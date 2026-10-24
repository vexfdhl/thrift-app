import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { SchoolItem } from '../data/schools';
import { ThriftStoreItem } from '../data/thriftStores';
import { calculateDistanceMiles, formatDistance } from '../utils/distance';
import {
  School,
  ShoppingBag,
  ArrowRight,
  X,
  MapPin,
  Navigation,
  RotateCcw,
  DoorOpen,
  Check
} from 'lucide-react';

interface ThriftMapProps {
  selectedSchool: SchoolItem | null;
  stores: ThriftStoreItem[];
  onSelectStore: (store: ThriftStoreItem) => void;
  onClearSchool?: () => void;
  heightClassName?: string;
}

const TILE_PROVIDERS = {
  esri: {
    name: 'Street (Clean)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, USGS, DeLorme',
    maxZoom: 19,
  },
  osm: {
    name: 'OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  },
};

export const ThriftMap: React.FC<ThriftMapProps> = ({
  selectedSchool,
  stores,
  onSelectStore,
  onClearSchool,
  heightClassName = 'h-[460px] sm:h-[530px] md:h-[600px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeTileStyle, setActiveTileStyle] = useState<'esri' | 'osm'>('esri');
  const [showAllPins, setShowAllPins] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activePreviewStore, setActivePreviewStore] = useState<{
    store: ThriftStoreItem;
    distance: number | null;
  } | null>(null);

  const DUVAL_CENTER: [number, number] = [30.3322, -81.6557];
  const DEFAULT_ZOOM = 11;

  const storesWithDistance = stores.map((store) => {
    const dist = selectedSchool
      ? calculateDistanceMiles(selectedSchool.lat, selectedSchool.lng, store.lat, store.lng)
      : null;
    return { store, dist };
  });

  const displayStores = selectedSchool && !showAllPins
    ? [...storesWithDistance].sort((a, b) => (a.dist ?? 999) - (b.dist ?? 999)).slice(0, 3)
    : [...storesWithDistance].sort((a, b) => (a.dist ?? 999) - (b.dist ?? 999));

  const switchTileLayer = useCallback((styleKey: 'esri' | 'osm') => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const provider = TILE_PROVIDERS[styleKey];
    const newLayer = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      maxZoom: provider.maxZoom,
    }).addTo(map);

    tileLayerRef.current = newLayer;
    setActiveTileStyle(styleKey);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    setIsLoading(true);

    const map = L.map(mapContainerRef.current, {
      center: DUVAL_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    const provider = TILE_PROVIDERS.esri;
    const tileLayer = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      maxZoom: provider.maxZoom,
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    mapInstanceRef.current = map;
    setIsLoading(false);

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    const bounds = L.latLngBounds([]);

    // 1. School Marker
    if (selectedSchool) {
      const schoolLatLng: [number, number] = [selectedSchool.lat, selectedSchool.lng];
      bounds.extend(schoolLatLng);

      const schoolIcon = L.divIcon({
        className: 'custom-school-marker-wrapper',
        html: `
          <div style="
            background-color: #EFAE6E;
            border: 2px solid #2E1F16;
            color: #2E1F16;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(46,31,22,0.3);
            cursor: pointer;
            position: relative;
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            <div style="
              position: absolute;
              bottom: -6px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 6px solid #2E1F16;
            "></div>
          </div>
        `,
        iconSize: [38, 44],
        iconAnchor: [19, 44],
      });

      const schoolMarker = L.marker(schoolLatLng, { icon: schoolIcon }).addTo(markersLayer);
      schoolMarker.bindTooltip(
        `<div style="font-family:'Nunito',sans-serif;font-weight:700;color:#2E1F16;padding:4px 6px;">
          <strong>${selectedSchool.name}</strong><br/>
          <span style="font-size:11px;color:#EFAE6E;font-weight:700;">Active Duval High School</span>
        </div>`,
        { direction: 'top', offset: [0, -42] }
      );
    }

    // 2. Store Markers
    displayStores.forEach(({ store, dist }, index) => {
      const storeLatLng: [number, number] = [store.lat, store.lng];
      bounds.extend(storeLatLng);

      const isTopClosest = selectedSchool && index < 3;
      const markerBg = isTopClosest ? '#C1D7C2' : '#F7E09A';
      const textColor = '#2E1F16';
      const borderColor = '#2E1F16';
      const labelText = isTopClosest ? `#${index + 1}` : store.priceTier;

      const storeIcon = L.divIcon({
        className: 'custom-store-marker-wrapper',
        html: `
          <div style="
            background-color: ${markerBg};
            border: 2px solid ${borderColor};
            color: ${textColor};
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(46,31,22,0.2);
            cursor: pointer;
            position: relative;
            font-family: 'Nunito', sans-serif;
            font-weight: 800;
            font-size: 11px;
          ">
            <span>${labelText}</span>
            <div style="
              position: absolute;
              bottom: -5px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 5px solid ${borderColor};
            "></div>
          </div>
        `,
        iconSize: [36, 41],
        iconAnchor: [18, 41],
      });

      const storeMarker = L.marker(storeLatLng, { icon: storeIcon }).addTo(markersLayer);

      storeMarker.on('click', () => {
        setActivePreviewStore({ store, distance: dist });
      });

      storeMarker.bindTooltip(
        `<div style="font-family:'Nunito',sans-serif;font-weight:700;color:#2E1F16;padding:4px 6px;">
          <strong>${store.name}</strong> (${store.priceTier})<br/>
          <span style="font-size:11px;color:#2E1F16;font-weight:600;">${
            dist !== null ? formatDistance(dist) + ' from campus' : store.city
          }</span>
        </div>`,
        { direction: 'top', offset: [0, -38] }
      );
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 14,
        animate: true,
      });
    } else {
      map.setView(DUVAL_CENTER, DEFAULT_ZOOM, { animate: true });
    }

    if (selectedSchool && displayStores.length > 0) {
      setActivePreviewStore({
        store: displayStores[0].store,
        distance: displayStores[0].dist,
      });
    } else {
      setActivePreviewStore(null);
    }

    setTimeout(() => map.invalidateSize(), 100);
  }, [selectedSchool, showAllPins]);

  const handleResetDuvalCenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setView(DUVAL_CENTER, DEFAULT_ZOOM, { animate: true });
    if (onClearSchool) onClearSchool();
    setActivePreviewStore(null);
  };

  return (
    <div className={`relative w-full ${heightClassName} rounded-2xl overflow-hidden border border-[#2E1F16]/15 bg-[#FBEFD9]`}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {isLoading && (
        <div className="absolute inset-0 bg-[#FBEFD9]/80 backdrop-blur-xs flex items-center justify-center z-20">
          <div className="bg-[#FBEFD9] border border-[#2E1F16]/20 p-4 rounded-2xl shadow-md flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[#2E1F16] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-[#2E1F16]">Loading Duval Map...</span>
          </div>
        </div>
      )}

      {/* Top Left Legend */}
      <div className="absolute top-3 left-3 z-10 bg-[#FBEFD9]/95 backdrop-blur-md border border-[#2E1F16]/15 p-4 rounded-2xl shadow-md text-xs text-[#2E1F16] max-w-[240px]">
        <div className="flex items-center gap-2 mb-1.5 font-bold">
          <span className="w-3.5 h-3.5 rounded-full bg-[#EFAE6E] border border-[#2E1F16] shadow-xs inline-block" />
          <span>Selected High School</span>
        </div>
        <div className="flex items-center gap-2 mb-2.5 font-bold">
          <span className="w-3.5 h-3.5 rounded-full bg-[#C1D7C2] border border-[#2E1F16] shadow-xs inline-block" />
          <span>Closest Thrift Stores</span>
        </div>

        {selectedSchool && (
          <button
            onClick={() => setShowAllPins(!showAllPins)}
            className="w-full mb-2.5 text-center text-[11px] font-bold bg-[#F7E09A]/40 hover:bg-[#F7E09A] border border-[#2E1F16]/20 text-[#2E1F16] rounded-xl py-1.5 px-2 transition-colors cursor-pointer"
          >
            {showAllPins ? 'Focus on Top 3 Closest' : `Show All (${stores.length}) Stores`}
          </button>
        )}

        <div className="pt-2 border-t border-[#2E1F16]/10 flex items-center justify-between gap-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#2E1F16]/60">Layer:</span>
          <div className="inline-flex rounded-full border border-[#2E1F16]/20 p-0.5 bg-[#F7E09A]/30 text-[11px]">
            <button
              onClick={() => switchTileLayer('esri')}
              className={`px-2.5 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                activeTileStyle === 'esri'
                  ? 'bg-[#EFAE6E] text-[#2E1F16] shadow-xs'
                  : 'text-[#2E1F16]/70 hover:text-[#2E1F16]'
              }`}
            >
              Clean
            </button>
            <button
              onClick={() => switchTileLayer('osm')}
              className={`px-2.5 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                activeTileStyle === 'osm'
                  ? 'bg-[#EFAE6E] text-[#2E1F16] shadow-xs'
                  : 'text-[#2E1F16]/70 hover:text-[#2E1F16]'
              }`}
            >
              OSM
            </button>
          </div>
        </div>
      </div>

      <div className="absolute top-16 right-3 z-10">
        <button
          onClick={handleResetDuvalCenter}
          className="w-10 h-10 rounded-full bg-[#FBEFD9] hover:bg-white text-[#2E1F16] border border-[#2E1F16]/20 shadow-md flex items-center justify-center cursor-pointer transition-colors"
          title="Reset map to Duval County center"
          aria-label="Reset Duval Map"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {activePreviewStore && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-10 bg-[#FBEFD9]/95 backdrop-blur-md border border-[#2E1F16]/20 p-5 rounded-2xl shadow-xl animate-fade-in text-[#2E1F16]">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <span className="bg-[#EFAE6E] text-[#2E1F16] px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-extrabold">
                  {activePreviewStore.store.priceTier}
                </span>
                <span className="text-[#2E1F16]/70">{activePreviewStore.store.priceRangeFormatted}</span>
                {activePreviewStore.distance !== null && (
                  <span className="bg-[#C1D7C2] text-[#2E1F16] px-2 py-0.5 rounded text-[11px]">
                    {formatDistance(activePreviewStore.distance)} away
                  </span>
                )}
              </div>

              <h4 className="font-editorial text-xl text-[#2E1F16] mt-1.5 leading-snug">
                {activePreviewStore.store.name}
              </h4>
              <p className="text-xs text-[#2E1F16]/70 flex items-center gap-1 mt-0.5 truncate font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#2E1F16]/50 shrink-0" />
                <span>{activePreviewStore.store.address}</span>
              </p>
            </div>

            <button
              onClick={() => setActivePreviewStore(null)}
              className="p-1 hover:bg-[#2E1F16]/10 rounded-lg text-[#2E1F16]/50 hover:text-[#2E1F16] transition-colors cursor-pointer"
              aria-label="Close preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#2E1F16]/80 mt-2 bg-white p-2.5 rounded-xl border border-[#2E1F16]/10 leading-relaxed shadow-xs">
            {activePreviewStore.store.priceNotes}
          </p>

          <div className="flex items-center gap-3 text-xs text-[#2E1F16]/80 mt-2.5 font-bold">
            <span className="inline-flex items-center gap-1">
              <DoorOpen className="w-3.5 h-3.5 text-[#2E1F16]/60" />
              <span>
                {activePreviewStore.store.fittingRoomsCount > 0 ? 'Fitting rooms open' : 'No fitting rooms'}
              </span>
            </span>
            {activePreviewStore.store.hasFormalwear && (
              <>
                <span>·</span>
                <span className="text-[#2E1F16] font-bold bg-[#F7E09A] px-2 py-0.5 rounded">Formalwear</span>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 phone-grid-2 gap-2 mt-3 pt-3 border-t border-[#2E1F16]/10">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                activePreviewStore.store.name + ' ' + activePreviewStore.store.address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-clevr-outline text-xs py-2 px-3 justify-center"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Directions</span>
            </a>

            <button
              onClick={() => onSelectStore(activePreviewStore.store)}
              className="btn-clevr-brown text-xs py-2 px-3 justify-center font-bold"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
