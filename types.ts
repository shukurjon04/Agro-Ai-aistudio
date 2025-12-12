export enum Tab {
  DASHBOARD = 'DASHBOARD',
  DISEASE_DETECTION = 'DISEASE_DETECTION',
  CROP_RECOMMENDATION = 'CROP_RECOMMENDATION',
  ANALYTICS = 'ANALYTICS',
  CHAT = 'CHAT'
}

export interface WeatherData {
  temp: number;
  humidity: number;
  condition: string;
  windSpeed: number;
  date: string;
}

export interface CropRecommendation {
  cropName: string;
  reason: string;
  estimatedCost: number; // in USD or local currency equivalent
  estimatedProfit: number;
  riskFactor: number; // 0-100%
  durationMonths: number;
}

export interface RecommendationRequest {
  landSize: number; // in hectares
  soilType: string;
  season: string;
  goal: string; // e.g., 'max_profit', 'stability', 'export'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface DiseaseResult {
  diseaseName: string;
  confidence: number;
  description: string;
  treatment: string;
}
