import React from 'react';
import { LayoutDashboard, ScanLine, Sprout, BarChart3, MessageSquareText, Leaf } from 'lucide-react';
import { Tab } from '../types';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: Tab.DASHBOARD, label: 'Bosh sahifa', icon: LayoutDashboard },
    { id: Tab.DISEASE_DETECTION, label: 'Kasallik aniqlash', icon: ScanLine },
    { id: Tab.CROP_RECOMMENDATION, label: 'Ekin tavsiyasi', icon: Sprout },
    { id: Tab.ANALYTICS, label: 'Tahlil va Prognoz', icon: BarChart3 },
    { id: Tab.CHAT, label: 'Agro Maslahatchi', icon: MessageSquareText },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-emerald-900 text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-2 p-6 border-b border-emerald-800">
          <div className="bg-white p-2 rounded-full">
            <Leaf className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold">AgroAI Pro</h1>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-emerald-700 text-white shadow-lg' 
                  : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-emerald-800 p-4 rounded-xl">
            <p className="text-xs text-emerald-200">Ob-havo ma'lumoti</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl font-bold">24°C</span>
              <span className="text-sm">Quyoshli</span>
            </div>
            <p className="text-xs mt-1 opacity-75">Toshkent, O'zbekiston</p>
          </div>
        </div>
      </div>
    </>
  );
};
