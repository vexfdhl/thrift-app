import React from 'react';
import { Home, Compass, MapPin, Star, Info } from 'lucide-react';

interface MobileBottomDockProps {
  currentView: string;
  onChangeView: (view: string) => void;
  isSimulator?: boolean;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  currentView,
  onChangeView,
  isSimulator = false,
}) => {
  const tabs = [
    { id: 'home', label: 'Discover', icon: Home },
    { id: 'directory', label: 'Stores', icon: MapPin },
    { id: 'map', label: 'Map', icon: Compass },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'about', label: 'Mission', icon: Info },
  ];

  return (
    <nav
      className={`${
        isSimulator
          ? 'sticky bottom-0 left-0 right-0 z-40 w-full flex'
          : 'md:hidden fixed bottom-0 left-0 right-0 z-50 flex'
      } bg-[#FBEFD9]/98 backdrop-blur-md border-t border-[#2E1F16]/15 px-2 py-2 items-center justify-around shadow-lg shrink-0`}
    >
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = currentView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeView(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all cursor-pointer min-w-[56px] ${
              isActive
                ? 'bg-[#EFAE6E] text-[#2E1F16] font-extrabold shadow-xs'
                : 'text-[#2E1F16]/60 hover:text-[#2E1F16] active:bg-[#F7E09A]/40'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] tracking-tight mt-0.5 font-bold">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
