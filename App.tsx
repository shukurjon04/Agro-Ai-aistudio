import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { DiseaseDetector } from './components/DiseaseDetector';
import { CropRecommender } from './components/CropRecommender';
import { Analytics } from './components/Analytics';
import { ChatAssistant } from './components/ChatAssistant';
import { Tab, CropRecommendation } from './types';
import { MOCK_WEATHER } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CROP_RECOMMENDATION);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recommendationData, setRecommendationData] = useState<CropRecommendation[]>([]);

  const handleRecommendationComplete = (data: CropRecommendation[]) => {
    setRecommendationData(data);
    setActiveTab(Tab.ANALYTICS); // Auto switch to analytics
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl">
              <h2 className="text-3xl font-bold mb-2">Xush kelibsiz, Fermer!</h2>
              <p className="opacity-90 text-lg">Bugun ekinlaringiz uchun ajoyib kun.</p>
              
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                  <p className="text-sm opacity-75">Harorat</p>
                  <p className="text-2xl font-bold">{MOCK_WEATHER.temp}°C</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                  <p className="text-sm opacity-75">Namlik</p>
                  <p className="text-2xl font-bold">{MOCK_WEATHER.humidity}%</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                  <p className="text-sm opacity-75">Shamol</p>
                  <p className="text-2xl font-bold">{MOCK_WEATHER.windSpeed} km/h</p>
                </div>
                 <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                  <p className="text-sm opacity-75">Holat</p>
                  <p className="text-2xl font-bold">{MOCK_WEATHER.condition}</p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab(Tab.CROP_RECOMMENDATION)}>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Hosilni Rejalashtirish</h3>
                    <p className="text-gray-600">Yeringiz va maqsadingizga mos ekinlarni sun'iy intellekt yordamida tanlang.</p>
                </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab(Tab.DISEASE_DETECTION)}>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Kasallikni Aniqlash</h3>
                    <p className="text-gray-600">O'simlik rasmini yuklang va tezkor diagnoz oling.</p>
                </div>
            </div>
          </div>
        );
      case Tab.DISEASE_DETECTION:
        return <DiseaseDetector />;
      case Tab.CROP_RECOMMENDATION:
        return <CropRecommender onRecommendationsLoaded={handleRecommendationComplete} />;
      case Tab.ANALYTICS:
        return <Analytics data={recommendationData} />;
      case Tab.CHAT:
        return <ChatAssistant />;
      default:
        return <div className="text-center p-10">Sahifa topilmadi</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <h1 className="text-xl font-bold text-emerald-800">AgroAI Pro</h1>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
