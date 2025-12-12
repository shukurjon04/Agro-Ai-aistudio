import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CropRecommendation, DiseaseResult, RecommendationRequest } from "../types";

// Helper to get API key (must be set in environment)
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key topilmadi. Iltimos, sozlamalarni tekshiring.");
  }
  return new GoogleGenAI({ apiKey });
};

// 1. Disease Detection Service
export const analyzeCropDisease = async (base64Image: string): Promise<DiseaseResult> => {
  const ai = getAiClient();
  
  const prompt = `
    Sen professional agronomsan. Quyidagi rasmdagi o'simlikni tahlil qil.
    1. O'simlik turini aniqla.
    2. Unda qanday kasallik yoki zararkunanda borligini aniqla.
    3. Agar o'simlik sog'lom bo'lsa, "Sog'lom" deb yoz.
    4. Davolash bo'yicha qisqa va aniq tavsiyalar ber (o'zbek tilida).
    
    Javobni JSON formatida qaytar:
    {
      "diseaseName": "Kasallik nomi",
      "confidence": 95,
      "description": "Qisqacha ta'rif",
      "treatment": "Davolash choralari"
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diseaseName: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          description: { type: Type.STRING },
          treatment: { type: Type.STRING }
        }
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as DiseaseResult;
  }
  throw new Error("AI tahlil qila olmadi.");
};

// 2. Crop Recommendation Service
export const getCropRecommendations = async (req: RecommendationRequest): Promise<CropRecommendation[]> => {
  const ai = getAiClient();

  const prompt = `
    Fermer xo'jaligi uchun qaror qabul qilish tizimi (DSS) sifatida ishla.
    Ma'lumotlar:
    - Yer maydoni: ${req.landSize} gektar
    - Tuproq turi: ${req.soilType}
    - Mavsum: ${req.season}
    - Fermerning maqsadi: ${req.goal}
    
    O'zbekiston sharoitini hisobga olgan holda, ushbu shartlarga eng mos keladigan 3-4 ta ekin turini taklif qil.
    Har bir ekin uchun taxminiy xarajat (1 gektar uchun USD hisobida), kutilayotgan foyda (USD), risk darajasi (0-100%) va yetilish muddatini (oy) hisobla.
    Risk omillarini (ob-havo, kasallik, bozor) hisobga ol.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            cropName: { type: Type.STRING, description: "Ekin nomi" },
            reason: { type: Type.STRING, description: "Nima uchun tavsiya qilingani" },
            estimatedCost: { type: Type.NUMBER, description: "Gektariga xarajat ($)" },
            estimatedProfit: { type: Type.NUMBER, description: "Gektariga kutilayotgan foyda ($)" },
            riskFactor: { type: Type.NUMBER, description: "Risk foizi (0-100)" },
            durationMonths: { type: Type.NUMBER, description: "Yetilish muddati (oy)" }
          }
        }
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as CropRecommendation[];
  }
  return [];
};

// 3. Chat Assistant
export const chatWithAgroBot = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  const ai = getAiClient();
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: [
      {
        role: 'user',
        parts: [{ text: "Sen AgroAI Pro tizimisining aqlli yordamchisisan. Fermerlarga o'zbek tilida, aniq va foydali maslahatlar berasan. Ekinlar, o'g'itlar, kasalliklar va bozor narxlari bo'yicha ekspert kabi javob ber." }]
      },
      ...history
    ]
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};
