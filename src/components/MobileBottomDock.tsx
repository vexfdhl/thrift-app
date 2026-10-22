import React from 'react';
import { Home, Compass, MapPin, Star, Info } from 'lucide-react';

interface MobileBottomDockProps {
  currentView: string;
  onChangeView: (view: string) => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  currentView,
  onChangeView,
}) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'map', label: 'Map', icon: Compass },
    { id: 'directory', label: 'Stores', icon: MapPin },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FBEFD9]/95 backdrop-blur-md border-t border-[#2E1F16]/15 px-3 py-2 flex items-center justify-around shadow-lg">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = currentView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeView(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all cursor-pointer ${
              isActive
                ? 'bg-[#EFAE6E] text-[#2E1F16] font-bold shadow-xs'
                : 'text-[#2E1F16]/60 hover:text-[#2E1F16]'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
