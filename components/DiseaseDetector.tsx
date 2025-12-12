import React, { useState, useRef } from 'react';
import { Upload, AlertTriangle, CheckCircle, RefreshCw, ScanSearch } from 'lucide-react';
import { analyzeCropDisease } from '../services/geminiService';
import { DiseaseResult } from '../types';

export const DiseaseDetector: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      // Extract base64 part
      const base64Data = image.split(',')[1];
      const data = await analyzeCropDisease(base64Data);
      setResult(data);
    } catch (err) {
      setError("Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring yoki API kalitni tekshiring.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
          <ScanSearch className="text-emerald-600" />
          Kasallikni aniqlash
        </h2>
        <p className="text-gray-600 mb-6">
          O'simlik bargi yoki tanasining rasmini yuklang. Sun'iy intellekt kasallikni aniqlab, davolash choralarini tavsiya qiladi.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-4">
            <div 
              className={`border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                image ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {image ? (
                <img src={image} alt="Preview" className="h-full w-full object-contain rounded-xl" />
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-gray-500 font-medium">Rasm yuklash uchun bosing</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG formatlar</p>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {image && (
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Tahlil qilinmoqda...
                  </>
                ) : (
                  <>
                    <ScanSearch className="w-5 h-5" />
                    Aniqlash
                  </>
                )}
              </button>
            )}
            {error && <p className="text-red-500 text-center bg-red-50 p-2 rounded-lg">{error}</p>}
          </div>

          {/* Result Section */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-full">
             {!result ? (
               <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                 <ScanSearch className="w-16 h-16 mb-4 opacity-20" />
                 <p>Natija shu yerda ko'rinadi</p>
               </div>
             ) : (
               <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                   <h3 className="text-xl font-bold text-gray-800">{result.diseaseName}</h3>
                   <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                     result.confidence > 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                   }`}>
                     {result.confidence}% Ishonch
                   </span>
                 </div>
                 
                 <div>
                   <h4 className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                     <AlertTriangle className="w-4 h-4 text-amber-500" />
                     Muammo:
                   </h4>
                   <p className="text-gray-600 text-sm leading-relaxed">{result.description}</p>
                 </div>

                 <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                   <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                     <CheckCircle className="w-4 h-4" />
                     Tavsiya (Davolash):
                   </h4>
                   <p className="text-gray-700 text-sm">{result.treatment}</p>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
