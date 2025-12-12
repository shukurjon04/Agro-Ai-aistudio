import React, { useState } from 'react';
import { Sprout, DollarSign, TrendingUp, AlertOctagon } from 'lucide-react';
import { getCropRecommendations } from '../services/geminiService';
import { CropRecommendation, RecommendationRequest } from '../types';
import { SOIL_TYPES, SEASONS, GOALS } from '../constants';

interface CropRecommenderProps {
  onRecommendationsLoaded: (recs: CropRecommendation[]) => void;
}

export const CropRecommender: React.FC<CropRecommenderProps> = ({ onRecommendationsLoaded }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RecommendationRequest>({
    landSize: 1,
    soilType: SOIL_TYPES[0],
    season: SEASONS[0],
    goal: GOALS[0]
  });
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await getCropRecommendations(formData);
      setRecommendations(data);
      onRecommendationsLoaded(data);
    } catch (error) {
      console.error("Error getting recommendations", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Form Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Sprout className="text-emerald-600" />
          Aqlli Ekin Tavsiyasi (DSS)
        </h2>
        
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Yer maydoni (gektar)</label>
            <input 
              type="number" 
              step="0.1"
              min="0.01"
              value={formData.landSize}
              onChange={(e) => setFormData({...formData, landSize: parseFloat(e.target.value)})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tuproq turi</label>
            <select 
              value={formData.soilType}
              onChange={(e) => setFormData({...formData, soilType: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            >
              {SOIL_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Mavsum</label>
            <select 
              value={formData.season}
              onChange={(e) => setFormData({...formData, season: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            >
              {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Asosiy Maqsad</label>
            <select 
              value={formData.goal}
              onChange={(e) => setFormData({...formData, goal: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            >
              {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-4 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 disabled:opacity-70 flex items-center gap-2"
            >
              {loading ? 'AI Hisoblamoqda...' : 'Tahlil va Tavsiya Olish'}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {recommendations.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-emerald-900">{rec.cropName}</h3>
                <span className="text-xs font-semibold bg-white px-2 py-1 rounded text-emerald-600 border border-emerald-200">
                  {rec.durationMonths} oy
                </span>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-gray-600 text-sm italic">"{rec.reason}"</p>
                
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-500"><DollarSign className="w-4 h-4"/> Xarajat:</span>
                    <span className="font-semibold">${rec.estimatedCost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-emerald-600"><TrendingUp className="w-4 h-4"/> Kutilayotgan foyda:</span>
                    <span className="font-bold text-emerald-600">+${rec.estimatedProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-amber-500"><AlertOctagon className="w-4 h-4"/> Risk darajasi:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${rec.riskFactor > 50 ? 'bg-red-500' : 'bg-green-500'}`} 
                          style={{width: `${rec.riskFactor}%`}}
                        />
                      </div>
                      <span className="font-medium text-xs">{rec.riskFactor}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
