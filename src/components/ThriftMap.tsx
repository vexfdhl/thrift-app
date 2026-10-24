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
  Check,
  Layers,
  Filter
} from 'lucide-react';

interface ThriftMapProps {
  selectedSchool: SchoolItem | null;
  stores: ThriftStoreItem[];
  onSelectStore: (store: ThriftStoreItem) => void;
  onOpenNavigate?: (store: ThriftStoreItem) => void;
  onClearSchool?: () => void;
  heightClassName?: string;
}

const TILE_PROVIDERS = {
  esri: {
    name: 'Clean Street',
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
  onOpenNavigate,
  onClearSchool,
  heightClassName = 'h-[460px] sm:h-[530px] md:h-[600px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeTileStyle, setActiveTileStyle] = useState<'esri' | 'osm'>('esri');
  // Default to true so ALL stores are ALWAYS visible!
  const [showAllPins, setShowAllPins] = useState(true);
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

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: DUVAL_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    });

    const provider = TILE_PROVIDERS[activeTileStyle];
    const tileLayer = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      maxZoom: provider.maxZoom,
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Pins & Polylines whenever stores or selectedSchool change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    const bounds = L.latLngBounds([]);

    // 1. Add School Marker if Selected
    if (selectedSchool) {
      const schoolIcon = L.divIcon({
        className: 'custom-school-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-10 h-10 rounded-full bg-[#2E1F16] border-3 border-[#F7E09A] shadow-xl flex items-center justify-center text-white transform hover:scale-110 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m4 6 8-4 8 4"/>
                <path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/>
                <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/>
                <path d="M18 5v17"/>
                <path d="M6 5v17"/>
                <circle cx="12" cy="9" r="2"/>
              </svg>
            </div>
            <div class="absolute -bottom-1 w-2 h-2 bg-[#2E1F16] rotate-45"></div>
          </div>
        `,
        iconSize: [40, 44],
        iconAnchor: [20, 44],
      });

      const schoolMarker = L.marker([selectedSchool.lat, selectedSchool.lng], {
        icon: schoolIcon,
        zIndexOffset: 1000,
      }).addTo(markersLayer);

      schoolMarker.bindPopup(`
        <div style="font-family: 'Nunito', sans-serif; padding: 4px;">
          <strong style="color: #2E1F16; font-size: 13px;">${selectedSchool.name}</strong><br/>
          <span style="font-size: 11px; color: #666;">${selectedSchool.address}</span>
        </div>
      `);

      bounds.extend([selectedSchool.lat, selectedSchool.lng]);
    }

    // 2. Add Store Markers
    displayStores.forEach(({ store, dist }, idx) => {
      bounds.extend([store.lat, store.lng]);

      const isClosest3 = selectedSchool && idx < 3;
      const pinColor = isClosest3 ? '#EFAE6E' : '#2E1F16';
      const badgeText = isClosest3 ? `#${idx + 1}` : store.priceTier;

      const storeIcon = L.divIcon({
        className: 'custom-thrift-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="px-2 py-1 rounded-full text-xs font-bold shadow-lg border-2 border-white flex items-center gap-1 transition-transform group-hover:scale-110" style="background-color: ${pinColor}; color: ${isClosest3 ? '#2E1F16' : '#FBEFD9'};">
              <span class="text-[10px] uppercase font-black">${badgeText}</span>
              <span class="truncate max-w-[85px] text-[11px] font-bold">${store.name.split(' ')[0]}</span>
            </div>
          </div>
        `,
        iconSize: [110, 32],
        iconAnchor: [55, 16],
      });

      const marker = L.marker([store.lat, store.lng], {
        icon: storeIcon,
      }).addTo(markersLayer);

      marker.on('click', () => {
        setActivePreviewStore({ store, distance: dist });
      });

      // Draw dotted connection line between selected school and top 3 closest stores
      if (selectedSchool && isClosest3) {
        L.polyline(
          [
            [selectedSchool.lat, selectedSchool.lng],
            [store.lat, store.lng],
          ],
          {
            color: '#EFAE6E',
            weight: 3,
            dashArray: '6, 8',
            opacity: 0.8,
          }
        ).addTo(markersLayer);
      }
    });

    // Fit map bounds
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [displayStores, selectedSchool]);

  const handleResetDuvalCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(DUVAL_CENTER, DEFAULT_ZOOM);
    }
  };

  return (
    <div className={`relative w-full ${heightClassName} rounded-3xl overflow-hidden shadow-md border border-[#2E1F16]/15`}>
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto z-10 flex flex-wrap items-center gap-2">
        {/* Count Badge & Toggle */}
        <div className="bg-[#FBEFD9]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#2E1F16]/15 shadow-md flex items-center gap-2 text-xs font-bold text-[#2E1F16]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{displayStores.length} of {stores.length} Stores Shown</span>
          {selectedSchool && (
            <button
              onClick={() => setShowAllPins(!showAllPins)}
              className="ml-1 text-[11px] bg-[#EFAE6E] text-[#2E1F16] px-2 py-0.5 rounded-full hover:bg-[#e5a05b] cursor-pointer"
            >
              {showAllPins ? 'Show Closest 3' : `Show All ${stores.length}`}
            </button>
          )}
        </div>

        {/* Selected School Pill */}
        {selectedSchool && (
          <div className="bg-[#2E1F16] text-[#FBEFD9] px-3 py-1.5 rounded-full shadow-md text-xs font-bold flex items-center gap-1.5 border border-[#F7E09A]/40">
            <School className="w-3.5 h-3.5 text-[#EFAE6E]" />
            <span className="truncate max-w-[150px] sm:max-w-[200px]">{selectedSchool.name}</span>
            {onClearSchool && (
              <button
                onClick={onClearSchool}
                className="hover:text-[#EFAE6E] ml-1 p-0.5 rounded-full"
                title="Clear school selection"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Tile Provider Switcher */}
        <div className="hidden sm:flex items-center gap-1 bg-[#FBEFD9]/90 backdrop-blur-md border border-[#2E1F16]/15 rounded-full p-1 shadow-md text-xs">
          <button
            onClick={() => switchTileLayer('esri')}
            className={`px-2.5 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
              activeTileStyle === 'esri'
                ? 'bg-[#2E1F16] text-[#FBEFD9]'
                : 'text-[#2E1F16]/70 hover:text-[#2E1F16]'
            }`}
          >
            Clean Map
          </button>
          <button
            onClick={() => switchTileLayer('osm')}
            className={`px-2.5 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
              activeTileStyle === 'osm'
                ? 'bg-[#2E1F16] text-[#FBEFD9]'
                : 'text-[#2E1F16]/70 hover:text-[#2E1F16]'
            }`}
          >
            OSM
          </button>
        </div>
      </div>

      {/* Recenter Button */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={handleResetDuvalCenter}
          className="w-9 h-9 rounded-full bg-[#FBEFD9] hover:bg-white text-[#2E1F16] border border-[#2E1F16]/20 shadow-md flex items-center justify-center cursor-pointer transition-colors"
          title="Reset map view to center of Duval County"
          aria-label="Reset Duval Map"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Store Preview Drawer */}
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

              <h4 className="font-cloud text-lg text-[#2E1F16] mt-1.5 leading-snug">
                {activePreviewStore.store.name}
              </h4>
              <p className="text-xs text-[#2E1F16]/70 flex items-center gap-1 mt-0.5 truncate font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#EFAE6E] shrink-0" />
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
                {activePreviewStore.store.fittingRoomsCount > 0
                  ? `${activePreviewStore.store.fittingRoomsCount} Rooms Open`
                  : 'No fitting rooms'}
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
            <button
              onClick={() => {
                if (onOpenNavigate) {
                  onOpenNavigate(activePreviewStore.store);
                } else {
                  window.open(
                    `https://maps.google.com/?q=${encodeURIComponent(
                      activePreviewStore.store.name + ' ' + activePreviewStore.store.address
                    )}`,
                    '_blank'
                  );
                }
              }}
              className="btn-clevr-outline text-xs py-2 px-3 justify-center gap-1.5 cursor-pointer font-bold"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Navigate</span>
            </button>

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
