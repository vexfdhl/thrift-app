import React, { useState } from 'react';
import { ThriftStoreItem } from '../data/thriftStores';
import { SchoolItem, DUVAL_SCHOOLS } from '../data/schools';
import { calculateDistanceMiles, formatDistance } from '../utils/distance';
import {
  Navigation,
  MapPin,
  Clock,
  Car,
  Compass,
  ExternalLink,
  Copy,
  Check,
  X,
  Phone,
  School,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface NavigationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: ThriftStoreItem | null;
  selectedSchool: SchoolItem | null;
  onSelectSchool: (school: SchoolItem) => void;
  onViewOnDuvalMap: (store: ThriftStoreItem) => void;
  onToast: (msg: string) => void;
}

export const NavigationGuideModal: React.FC<NavigationGuideModalProps> = ({
  isOpen,
  onClose,
  store,
  selectedSchool,
  onSelectSchool,
  onViewOnDuvalMap,
  onToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [customStart, setCustomStart] = useState<string>('');
  const [isChangingSchool, setIsChangingSchool] = useState(false);

  if (!isOpen || !store) return null;

  const distance = selectedSchool
    ? calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, store.lat, store.lng)
    : null;

  // Estimate transit times
  const drivingMinutes = distance !== null ? Math.max(3, Math.round(distance * 2.2 + 2)) : 10;
  const bikingMinutes = distance !== null ? Math.round(distance * 5 + 4) : 25;
  const transitMinutes = distance !== null ? Math.round(distance * 3.5 + 8) : 20;

  const fullAddress = `${store.address}, ${store.city}, FL ${store.zip}`;
  const originParam = selectedSchool ? encodeURIComponent(selectedSchool.address) : '';
  const destParam = encodeURIComponent(`${store.name}, ${fullAddress}`);

  const googleMapsUrl = selectedSchool
    ? `https://www.google.com/maps/dir/?api=1&origin=${originParam}&destination=${destParam}&travelmode=driving`
    : `https://www.google.com/maps/search/?api=1&query=${destParam}`;

  const appleMapsUrl = selectedSchool
    ? `https://maps.apple.com/?saddr=${originParam}&daddr=${destParam}`
    : `https://maps.apple.com/?q=${destParam}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    onToast('Address copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchGoogleMaps = () => {
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    onToast('Launching Google Maps turn-by-turn navigation...');
  };

  const handleLaunchAppleMaps = () => {
    window.open(appleMapsUrl, '_blank', 'noopener,noreferrer');
    onToast('Launching Apple Maps directions...');
  };

  const handleViewOnMapClick = () => {
    onClose();
    onViewOnDuvalMap(store);
    onToast(`Showing ${store.name} on Duval Map`);
  };

  // Generate step-by-step route directions
  const steps = [
    {
      step: 1,
      text: selectedSchool
        ? `Depart from ${selectedSchool.name} onto the main exit towards Duval County transit corridor.`
        : `Head towards ${store.city} along main Duval thoroughfare.`,
      icon: School,
    },
    {
      step: 2,
      text: distance !== null && distance > 5
        ? `Merge onto standard Jacksonville expressway / connector route towards ${store.zip}.`
        : `Continue straight on local arterial road towards ${store.address.split(' ')[1] || 'destination'} Ave/St.`,
      icon: Compass,
    },
    {
      step: 3,
      text: `Follow local signs for ${store.address}. Watch for shopping plaza / merchant storefront signs.`,
      icon: Car,
    },
    {
      step: 4,
      text: `Arrive at ${store.name} (${store.address}). Parking is available adjacent to the store.`,
      icon: MapPin,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-['Nunito',sans-serif]">
      <div className="bg-[#FBEFD9] w-full max-w-xl rounded-3xl border-2 border-[#2E1F16]/20 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#2E1F16] text-[#FBEFD9] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EFAE6E] flex items-center justify-center text-[#2E1F16]">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-cloud text-base sm:text-lg text-[#FBEFD9] leading-tight">
                Turn-by-Turn Navigation
              </h3>
              <p className="text-[11px] text-[#FBEFD9]/70">
                Duval County High School Transit Route
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#FBEFD9] transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto text-[#2E1F16] text-[14px]">
          {/* Destination Banner */}
          <div className="bg-white p-4 rounded-2xl border border-[#2E1F16]/15 shadow-sm space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="bg-[#EFAE6E] text-[#2E1F16] text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  Destination
                </span>
                <h4 className="font-cloud text-lg sm:text-xl text-[#2E1F16] mt-1">
                  {store.name}
                </h4>
                <p className="text-xs text-[#2E1F16]/70 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#EFAE6E] shrink-0" />
                  <span>{fullAddress}</span>
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-block bg-[#C1D7C2] text-[#2E1F16] text-xs font-black px-2.5 py-1 rounded-full">
                  {store.priceTier}
                </span>
                <p className="text-[11px] font-bold text-[#2E1F16]/70 mt-1">
                  {store.fittingRoomsCount > 0 ? `${store.fittingRoomsCount} Rooms` : 'No Fitting Rooms'}
                </p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-[#2E1F16]/10 text-xs">
              <button
                onClick={handleCopyAddress}
                className="btn-clevr-outline text-[11px] py-1 px-2.5 gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Address'}</span>
              </button>

              <a
                href={`tel:${store.phone.replace(/[^0-9]/g, '')}`}
                className="btn-clevr-outline text-[11px] py-1 px-2.5 gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>{store.phone}</span>
              </a>
            </div>
          </div>

          {/* Starting School Location */}
          <div className="bg-[#F7E09A]/30 p-4 rounded-2xl border border-[#2E1F16]/15 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-[#2E1F16]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E1F16]/70">
                  Origin (Starting Point)
                </span>
              </div>
              <button
                onClick={() => setIsChangingSchool(!isChangingSchool)}
                className="text-xs font-bold text-[#2E1F16] hover:underline cursor-pointer"
              >
                {isChangingSchool ? 'Done' : 'Change School'}
              </button>
            </div>

            {isChangingSchool ? (
              <div className="space-y-2 pt-2">
                <select
                  value={selectedSchool?.id || ''}
                  onChange={(e) => {
                    const found = DUVAL_SCHOOLS.find(s => s.id === e.target.value);
                    if (found) {
                      onSelectSchool(found);
                      setIsChangingSchool(false);
                      onToast(`Origin changed to ${found.name}`);
                    }
                  }}
                  className="w-full bg-white border border-[#2E1F16]/20 rounded-xl p-2 text-xs font-bold text-[#2E1F16] focus:outline-none"
                >
                  <option value="">Select your Duval County High School...</option>
                  {DUVAL_SCHOOLS.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.address.split(',')[0]})</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <p className="font-bold text-sm text-[#2E1F16]">
                  {selectedSchool ? selectedSchool.name : 'No school selected (Showing general Duval distance)'}
                </p>
                {selectedSchool && (
                  <p className="text-xs text-[#2E1F16]/70 truncate">
                    {selectedSchool.address}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Time & Distance Estimates */}
          {distance !== null && (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-3 rounded-2xl border border-[#2E1F16]/15 shadow-xs">
                <Car className="w-4 h-4 mx-auto text-[#EFAE6E] mb-1" />
                <span className="block text-xs text-[#2E1F16]/60 font-semibold">Drive Time</span>
                <span className="font-cloud text-base font-bold text-[#2E1F16]">
                  {drivingMinutes} min
                </span>
                <span className="text-[10px] text-[#2E1F16]/50 block">
                  {formatDistance(distance)}
                </span>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-[#2E1F16]/15 shadow-xs">
                <Compass className="w-4 h-4 mx-auto text-[#C1D7C2] mb-1" />
                <span className="block text-xs text-[#2E1F16]/60 font-semibold">Transit</span>
                <span className="font-cloud text-base font-bold text-[#2E1F16]">
                  {transitMinutes} min
                </span>
                <span className="text-[10px] text-[#2E1F16]/50 block">JTA Bus Line</span>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-[#2E1F16]/15 shadow-xs">
                <Clock className="w-4 h-4 mx-auto text-[#2E1F16] mb-1" />
                <span className="block text-xs text-[#2E1F16]/60 font-semibold">Bicycle</span>
                <span className="font-cloud text-base font-bold text-[#2E1F16]">
                  {bikingMinutes} min
                </span>
                <span className="text-[10px] text-[#2E1F16]/50 block">Flat terrain</span>
              </div>
            </div>
          )}

          {/* Turn-by-Turn Route Preview */}
          <div className="bg-white p-4 rounded-2xl border border-[#2E1F16]/15 space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-[#2E1F16]/70">
              Turn-by-Turn Route Instructions
            </h5>
            <div className="space-y-3 text-xs">
              {steps.map((st) => {
                const IconComponent = st.icon;
                return (
                  <div key={st.step} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#F7E09A] flex items-center justify-center shrink-0 text-[#2E1F16] font-bold text-[11px] mt-0.5">
                      {st.step}
                    </div>
                    <p className="text-[#2E1F16]/85 font-medium leading-relaxed">
                      {st.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 bg-[#F7E09A]/30 border-t border-[#2E1F16]/10 flex flex-col sm:flex-row items-center gap-2 sm:justify-between">
          <button
            onClick={handleViewOnMapClick}
            className="w-full sm:w-auto btn-clevr-outline text-xs py-2.5 px-4 justify-center gap-1.5 cursor-pointer font-bold"
          >
            <MapPin className="w-4 h-4" />
            <span>Show on Duval Map</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleLaunchAppleMaps}
              className="flex-1 sm:flex-initial btn-clevr-outline text-xs py-2.5 px-3 justify-center gap-1 cursor-pointer font-bold"
              title="Open in Apple Maps"
            >
              <span>Apple Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleLaunchGoogleMaps}
              className="flex-1 sm:flex-initial btn-clevr-brown text-xs py-2.5 px-4 justify-center gap-1.5 cursor-pointer font-bold"
              title="Open in Google Maps"
            >
              <Navigation className="w-4 h-4" />
              <span>Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
