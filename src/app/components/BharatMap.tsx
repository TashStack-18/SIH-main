'use client';

/**
 * 🇮🇳 BHARAT SAFE YATRA — UNIFIED GLOBAL MAP (BHARATMAP)
 * Phase 11.1: Single Persistent Map Engine with Real Routable Geometry,
 * Dynamic Mapbox GL Markers, Auto Camera Tracking & Clean Daylight Heritage Theme
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { RouteCalculationResult } from '@/src/lib/providers/types';

export type BharatMapMode = '3D' | '2D' | 'SATELLITE';

export interface BharatMapStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  dayNumber: number;
  sequenceNumber: number;
  isActive?: boolean;
  isCompleted?: boolean;
  isLocked?: boolean;
  isMustVisit?: boolean;
  type?: string;
  notes?: string;
}

export interface BharatMapNearby {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  detourDisplay?: string;
  distanceKm?: number;
}

export interface BharatMapProps {
  stops: BharatMapStop[];
  routeResult?: RouteCalculationResult | null;
  activeStopId?: string | null;
  onSelectStop?: (stopId: string) => void;
  nearbyPlaces?: BharatMapNearby[];
  onAddNearby?: (placeId: string) => void;
  isJourneyMode?: boolean;
  height?: string;
  showControls?: boolean;
  className?: string;
}

export function BharatMap({
  stops,
  routeResult,
  activeStopId,
  onSelectStop,
  nearbyPlaces = [],
  onAddNearby,
  isJourneyMode = false,
  height = '540px',
  showControls = true,
  className = '',
}: BharatMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const mapboxglModuleRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const prevStopsSignatureRef = useRef<string>('');

  // Default mode is 3D Bright Daylight Map
  const [mapMode, setMapMode] = useState<BharatMapMode>('3D');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [hoveredStop, setHoveredStop] = useState<BharatMapStop | null>(null);
  const [hoveredNearby, setHoveredNearby] = useState<BharatMapNearby | null>(null);
  const [useSvgFallback, setUseSvgFallback] = useState(false);

  const [internalRouteResult, setInternalRouteResult] = useState<RouteCalculationResult | null>(null);

  const validStops = stops.filter(
    (s) => typeof s.lat === 'number' && typeof s.lng === 'number' && !isNaN(s.lat) && !isNaN(s.lng)
  );

  // Compute bounding box
  const lats = validStops.map((s) => s.lat);
  const lngs = validStops.map((s) => s.lng);
  const minLat = lats.length > 0 ? Math.min(...lats) : 20.0;
  const maxLat = lats.length > 0 ? Math.max(...lats) : 35.0;
  const minLng = lngs.length > 0 ? Math.min(...lngs) : 70.0;
  const maxLng = lngs.length > 0 ? Math.max(...lngs) : 90.0;
  const centerLat = validStops.length > 0 ? (minLat + maxLat) / 2 : 28.6139;
  const centerLng = validStops.length > 0 ? (minLng + maxLng) / 2 : 77.2090;

  // Compute optimal zoom level for slippy tile engine
  const calcAutoZoom = useCallback(() => {
    const span = Math.max(maxLat - minLat, maxLng - minLng);
    if (span < 0.08) return 13;
    if (span < 0.25) return 12;
    if (span < 0.8) return 11;
    if (span < 2.2) return 9;
    if (span < 5.0) return 7;
    return 6;
  }, [maxLat, minLat, maxLng, minLng]);

  const [slippyZoom, setSlippyZoom] = useState<number>(12);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [containerDim, setContainerDim] = useState<{ w: number; h: number }>({ w: 900, h: 540 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startPanX: number; startPanY: number } | null>(null);

  // Sync zoom and center whenever stops change
  useEffect(() => {
    setSlippyZoom(calcAutoZoom());
    setPanOffset({ x: 0, y: 0 });
  }, [calcAutoZoom]);

  // Track container dimensions via ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setContainerDim({ w: Math.round(rect.width), h: Math.round(rect.height) });
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // If parent didn't pass routeResult and we have >= 2 stops, fetch verified turn-by-turn road route
  useEffect(() => {
    if (routeResult) {
      setInternalRouteResult(null);
      return;
    }

    if (validStops.length < 2) {
      setInternalRouteResult(null);
      return;
    }

    let isMounted = true;
    const waypoints = validStops.map((s) => ({
      lat: s.lat,
      lng: s.lng,
      name: s.name,
    }));

    fetch('/api/v1/maps/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ waypoints, mode: 'driving' }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && json.data) {
          setInternalRouteResult(json.data);
        }
      })
      .catch((err) => {
        console.warn('[BharatMap] Auto route fetch error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [validStops, routeResult]);

  const activeRoute = routeResult || internalRouteResult;

  // Helper to construct / update Route GeoJSON layers
  const syncRouteLayer = useCallback((map: any, geojson?: any) => {
    if (!map) return;
    const geom = geojson || activeRoute?.geometryGeoJSON;

    // NEVER draw Euclidean straight lines cutting through lakes and buildings!
    // Only draw the route layer once real turn-by-turn road geometry is ready.
    if (!geom || !geom.coordinates || geom.coordinates.length < 2) {
      const source = map.getSource('route-line');
      if (source) {
        source.setData({
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: [] },
        });
      }
      return;
    }

    const source = map.getSource('route-line');
    if (source) {
      source.setData({
        type: 'Feature',
        properties: {},
        geometry: geom,
      });
    } else {
      map.addSource('route-line', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: geom,
        },
      });

      // Glow casing (Ochre Gold)
      if (!map.getLayer('route-glow-layer')) {
        map.addLayer({
          id: 'route-glow-layer',
          type: 'line',
          source: 'route-line',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#C88E44',
            'line-width': 8,
            'line-opacity': 0.4,
            'line-blur': 2,
          },
        });
      }

      // Main vibrant line (Saffron Orange)
      if (!map.getLayer('route-line-layer')) {
        map.addLayer({
          id: 'route-line-layer',
          type: 'line',
          source: 'route-line',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#EA580C',
            'line-width': 4.5,
            'line-opacity': 0.95,
          },
        });
      }
    }
  }, [activeRoute]);

  // -------------------------------------------------------------
  // 1. Mapbox GL JS Initialization (Default: Bright Daylight 3D Outdoors)
  // -------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token || token.includes('your_') || typeof window === 'undefined') {
      setUseSvgFallback(true);
      return;
    }

    import('mapbox-gl')
      .then((mapboxglModule) => {
        if (!isMounted || !containerRef.current || mapInstanceRef.current) return;

        const mapboxgl = mapboxglModule.default;
        mapboxglModuleRef.current = mapboxgl;
        (mapboxgl as any).accessToken = token;

        try {
          // Initialize with bright, vibrant daylight outdoors style with 3D elevation
          const map = new mapboxgl.Map({
            container: containerRef.current,
            style: 'mapbox://styles/mapbox/outdoors-v12',
            center: [centerLng, centerLat],
            zoom: validStops.length > 1 ? 11 : 13,
            projection: 'mercator',
            pitch: 50,
            bearing: -5,
          });

          map.on('load', () => {
            if (!isMounted) return;
            mapInstanceRef.current = map;
            setIsMapLoaded(true);

            // Add 3D Terrain elevation source
            try {
              if (!map.getSource('mapbox-dem')) {
                map.addSource('mapbox-dem', {
                  type: 'raster-dem',
                  url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
                  tileSize: 512,
                  maxzoom: 14,
                });
                map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.2 });
              }
            } catch (demErr) {
              console.warn('[BharatMap] 3D DEM terrain notice:', demErr);
            }

            syncRouteLayer(map);

            if (validStops.length > 1) {
              const bounds = new mapboxgl.LngLatBounds();
              validStops.forEach((s) => bounds.extend([s.lng, s.lat]));
              map.fitBounds(bounds, { padding: 70, maxZoom: 14, duration: 800 });
            }
          });

          map.on('style.load', () => {
            try {
              if (!map.getSource('mapbox-dem')) {
                map.addSource('mapbox-dem', {
                  type: 'raster-dem',
                  url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
                  tileSize: 512,
                  maxzoom: 14,
                });
              }
              if (mapMode === '3D') {
                map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.2 });
              }
            } catch (e) {
              // Terrain fallback
            }
            syncRouteLayer(map);
          });

          map.on('error', (e) => {
            console.warn('[BharatMap] Mapbox notice:', e);
          });
        } catch (err) {
          console.warn('[BharatMap] WebGL initialization fallback:', err);
          setUseSvgFallback(true);
        }
      })
      .catch(() => {
        setUseSvgFallback(true);
      });

    return () => {
      isMounted = false;
      if (markersRef.current) {
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
      }
    };
  }, []);

  // -------------------------------------------------------------
  // 2. Real Mapbox GL Markers Rendering & Synchronization
  // -------------------------------------------------------------
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapLoaded || !mapboxglModuleRef.current) return;
    const map = mapInstanceRef.current;
    const mapboxgl = mapboxglModuleRef.current;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Render Stop Markers
    validStops.forEach((stop) => {
      const isActive = stop.id === activeStopId || stop.isActive;
      const isCompleted = stop.isCompleted;

      const el = document.createElement('div');
      el.className = `bharat-map-marker ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      el.style.alignItems = 'center';
      el.style.zIndex = isActive ? '30' : '10';

      // Pin badge
      const badge = document.createElement('div');
      badge.style.width = isActive ? '34px' : '26px';
      badge.style.height = isActive ? '34px' : '26px';
      badge.style.borderRadius = '50%';
      badge.style.background = isCompleted ? '#10b981' : isActive ? '#EA580C' : '#C88E44';
      badge.style.border = isActive ? '3px solid #ffffff' : '2px solid #ffffff';
      badge.style.display = 'flex';
      badge.style.alignItems = 'center';
      badge.style.justifyContent = 'center';
      badge.style.color = '#ffffff';
      badge.style.fontWeight = '800';
      badge.style.fontSize = isActive ? '0.85rem' : '0.72rem';
      badge.style.boxShadow = isActive
        ? '0 0 16px rgba(234, 88, 12, 0.8), 0 4px 12px rgba(45, 27, 20, 0.35)'
        : '0 2px 8px rgba(45, 27, 20, 0.25)';
      badge.style.transition = 'all 0.2s ease';
      badge.innerText = isCompleted ? '✓' : String(stop.sequenceNumber);
      el.appendChild(badge);

      // Clean, bright pill label below pin
      const label = document.createElement('div');
      label.style.marginTop = '4px';
      label.style.whiteSpace = 'nowrap';
      label.style.background = '#FFFFFF';
      label.style.padding = '3px 9px';
      label.style.borderRadius = '20px';
      label.style.fontSize = '0.72rem';
      label.style.fontWeight = '700';
      label.style.color = isActive ? '#EA580C' : '#2D1B14';
      label.style.border = `1.5px solid ${isActive ? '#EA580C' : 'rgba(200, 142, 68, 0.4)'}`;
      label.style.boxShadow = '0 3px 10px rgba(45, 27, 20, 0.15)';
      label.innerText = stop.name;
      el.appendChild(label);

      // Click listener: select stop and fly to place smoothly
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onSelectStop) onSelectStop(stop.id);
        map.flyTo({
          center: [stop.lng, stop.lat],
          zoom: Math.max(map.getZoom(), 13.5),
          pitch: mapMode === '3D' ? 50 : 0,
          duration: 900,
        });
      });

      // Hover feedback
      el.addEventListener('mouseenter', () => {
        setHoveredStop(stop);
        badge.style.transform = 'scale(1.15)';
      });
      el.addEventListener('mouseleave', () => {
        setHoveredStop(null);
        badge.style.transform = 'scale(1)';
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([stop.lng, stop.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Render Nearby Candidate Markers
    nearbyPlaces.forEach((place) => {
      const el = document.createElement('div');
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      el.style.alignItems = 'center';
      el.style.zIndex = '8';

      const badge = document.createElement('div');
      badge.style.width = '22px';
      badge.style.height = '22px';
      badge.style.borderRadius = '50%';
      badge.style.background = '#0284c7';
      badge.style.border = '2px dashed #ffffff';
      badge.style.display = 'flex';
      badge.style.alignItems = 'center';
      badge.style.justifyContent = 'center';
      badge.style.color = '#ffffff';
      badge.style.fontSize = '0.75rem';
      badge.style.fontWeight = '800';
      badge.style.boxShadow = '0 2px 8px rgba(2, 132, 199, 0.4)';
      badge.innerText = '+';
      el.appendChild(badge);

      if (place.detourDisplay) {
        const label = document.createElement('div');
        label.style.marginTop = '2px';
        label.style.whiteSpace = 'nowrap';
        label.style.background = '#FFFFFF';
        label.style.padding = '2px 7px';
        label.style.borderRadius = '12px';
        label.style.fontSize = '0.68rem';
        label.style.fontWeight = '700';
        label.style.color = '#0369a1';
        label.style.border = '1px solid rgba(2, 132, 199, 0.4)';
        label.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
        label.innerText = `${place.name} (${place.detourDisplay})`;
        el.appendChild(label);
      }

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onAddNearby) onAddNearby(place.id);
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([place.lng, place.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [validStops, activeStopId, nearbyPlaces, isMapLoaded, mapMode, onSelectStop, onAddNearby]);

  // -------------------------------------------------------------
  // 3. Smart Camera Bounds Tracking ONLY on new destination/stops change
  // -------------------------------------------------------------
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapLoaded || validStops.length === 0) return;
    const map = mapInstanceRef.current;
    const mapboxgl = mapboxglModuleRef.current;
    if (!mapboxgl) return;

    // Create signature based strictly on stop IDs and coordinates
    const currentSignature = validStops.map((s) => `${s.id}:${s.lat.toFixed(4)},${s.lng.toFixed(4)}`).join('|');

    if (currentSignature !== prevStopsSignatureRef.current) {
      prevStopsSignatureRef.current = currentSignature;

      if (validStops.length === 1) {
        map.flyTo({
          center: [validStops[0].lng, validStops[0].lat],
          zoom: 12.5,
          pitch: mapMode === '3D' ? 50 : 0,
          duration: 1000,
        });
      } else {
        const bounds = new mapboxgl.LngLatBounds();
        validStops.forEach((s) => bounds.extend([s.lng, s.lat]));
        map.fitBounds(bounds, {
          padding: { top: 70, bottom: 70, left: 70, right: 70 },
          maxZoom: 14,
          duration: 1000,
        });
      }
    }
  }, [validStops, isMapLoaded, mapMode]);

  // -------------------------------------------------------------
  // 4. Focus Active Stop Camera when activeStopId changes
  // -------------------------------------------------------------
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapLoaded || !activeStopId) return;
    const map = mapInstanceRef.current;
    const target = validStops.find((s) => s.id === activeStopId);
    if (target) {
      map.flyTo({
        center: [target.lng, target.lat],
        zoom: Math.max(map.getZoom(), 13.5),
        pitch: mapMode === '3D' ? 50 : 0,
        duration: 800,
      });
    }
  }, [activeStopId, isMapLoaded, mapMode, validStops]);

  // -------------------------------------------------------------
  // 5. Update Route GeoJSON dynamically
  // -------------------------------------------------------------
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapLoaded) return;
    syncRouteLayer(mapInstanceRef.current, activeRoute?.geometryGeoJSON);
  }, [activeRoute, isMapLoaded, syncRouteLayer]);

  // -------------------------------------------------------------
  // Web Mercator Slippy Map Tile Calculations
  // -------------------------------------------------------------
  const lng2tile = (lng: number, z: number) => {
    return ((lng + 180) / 360) * Math.pow(2, z);
  };

  const lat2tile = (lat: number, z: number) => {
    const rad = (lat * Math.PI) / 180;
    return (
      ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) *
      Math.pow(2, z)
    );
  };

  const TILE_SIZE = 256;
  const effCenterTileX = lng2tile(centerLng, slippyZoom) - panOffset.x / TILE_SIZE;
  const effCenterTileY = lat2tile(centerLat, slippyZoom) - panOffset.y / TILE_SIZE;

  // Convert (lat, lng) to pixel coords inside the container
  const toScreenPx = useCallback(
    (lat: number, lng: number) => {
      const pxX = (lng2tile(lng, slippyZoom) - effCenterTileX) * TILE_SIZE + containerDim.w / 2;
      const pxY = (lat2tile(lat, slippyZoom) - effCenterTileY) * TILE_SIZE + containerDim.h / 2;
      return { x: pxX, y: pxY };
    },
    [slippyZoom, effCenterTileX, effCenterTileY, containerDim]
  );

  // Visible tiles generation
  const tileList = useMemo(() => {
    const cols = Math.ceil(containerDim.w / TILE_SIZE) + 3;
    const rows = Math.ceil(containerDim.h / TILE_SIZE) + 3;
    const minX = Math.floor(effCenterTileX - cols / 2);
    const maxX = minX + cols;
    const minY = Math.floor(effCenterTileY - rows / 2);
    const maxY = minY + rows;

    const maxTiles = Math.pow(2, slippyZoom);
    const list: Array<{ key: string; url: string; left: number; top: number }> = [];

    for (let tx = minX; tx <= maxX; tx++) {
      for (let ty = minY; ty <= maxY; ty++) {
        if (ty < 0 || ty >= maxTiles) continue;
        const wrappedTx = ((tx % maxTiles) + maxTiles) % maxTiles;
        const url =
          mapMode === 'SATELLITE'
            ? `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${slippyZoom}/${ty}/${wrappedTx}`
            : `https://basemaps.cartocdn.com/rastertiles/voyager/${slippyZoom}/${wrappedTx}/${ty}@2x.png`;

        list.push({
          key: `${mapMode}-${slippyZoom}-${tx}-${ty}`,
          url,
          left: (tx - effCenterTileX) * TILE_SIZE + containerDim.w / 2,
          top: (ty - effCenterTileY) * TILE_SIZE + containerDim.h / 2,
        });
      }
    }
    return list;
  }, [containerDim, effCenterTileX, effCenterTileY, slippyZoom, mapMode]);

  // Turn-by-Turn Road Coordinates from OSRM/Mapbox routing engine
  const roadCoords: [number, number][] = useMemo(() => {
    if (activeRoute?.geometryGeoJSON?.coordinates && activeRoute.geometryGeoJSON.coordinates.length > 1) {
      return activeRoute.geometryGeoJSON.coordinates;
    }
    return [];
  }, [activeRoute]);

  const roadPolylinePoints = useMemo(() => {
    if (roadCoords.length < 2) return '';
    return roadCoords
      .map(([lng, lat]) => {
        const pt = toScreenPx(lat, lng);
        return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
      })
      .join(' ');
  }, [roadCoords, toScreenPx]);

  // Mouse drag handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startPanX: panOffset.x,
      startPanY: panOffset.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStartRef.current || !isDragging) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    setPanOffset({
      x: dragStartRef.current.startPanX + dx,
      y: dragStartRef.current.startPanY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // -------------------------------------------------------------
  // 6. Camera Controls: Fit Journey & Next Stop
  // -------------------------------------------------------------
  const fitJourney = useCallback(() => {
    if (validStops.length === 0) return;

    if (mapInstanceRef.current && isMapLoaded) {
      const map = mapInstanceRef.current;
      const mapboxgl = mapboxglModuleRef.current;
      if (mapboxgl) {
        if (validStops.length === 1) {
          map.flyTo({
            center: [validStops[0].lng, validStops[0].lat],
            zoom: 12,
            pitch: mapMode === '3D' ? 50 : 0,
            duration: 900,
          });
        } else {
          const bounds = new mapboxgl.LngLatBounds();
          validStops.forEach((s) => bounds.extend([s.lng, s.lat]));
          map.fitBounds(bounds, {
            padding: { top: 70, bottom: 70, left: 70, right: 70 },
            maxZoom: 14,
            duration: 900,
          });
        }
        return;
      }
    }

    setPanOffset({ x: 0, y: 0 });
    setSlippyZoom(calcAutoZoom());
  }, [validStops, isMapLoaded, mapMode, calcAutoZoom]);

  const focusNextStop = useCallback(() => {
    const currentIndex = validStops.findIndex((s) => s.id === activeStopId);
    const next =
      currentIndex >= 0 && currentIndex < validStops.length - 1
        ? validStops[currentIndex + 1]
        : validStops.find((s) => !s.isCompleted) || validStops[0];

    if (!next) return;
    if (onSelectStop) onSelectStop(next.id);

    if (mapInstanceRef.current && isMapLoaded) {
      mapInstanceRef.current.flyTo({
        center: [next.lng, next.lat],
        zoom: 14,
        pitch: mapMode === '3D' ? 50 : 0,
        duration: 900,
      });
      return;
    }

    const cTileX = lng2tile(centerLng, slippyZoom);
    const cTileY = lat2tile(centerLat, slippyZoom);
    const nextTileX = lng2tile(next.lng, slippyZoom);
    const nextTileY = lat2tile(next.lat, slippyZoom);
    setPanOffset({
      x: (cTileX - nextTileX) * TILE_SIZE,
      y: (cTileY - nextTileY) * TILE_SIZE,
    });
  }, [validStops, activeStopId, isMapLoaded, mapMode, onSelectStop, centerLng, centerLat, slippyZoom]);

  // -------------------------------------------------------------
  // 7. Switch Modes (3D Outdoors, 2D Outdoors, Satellite)
  // -------------------------------------------------------------
  const handleModeChange = (newMode: BharatMapMode) => {
    setMapMode(newMode);
    if (!mapInstanceRef.current || !isMapLoaded) return;
    const map = mapInstanceRef.current;

    if (newMode === '3D') {
      const currentStyle = map.getStyle()?.sprite || '';
      if (currentStyle.includes('satellite')) {
        map.setStyle('mapbox://styles/mapbox/outdoors-v12');
      }
      map.easeTo({ pitch: 50, bearing: -5, duration: 800 });
    } else if (newMode === '2D') {
      const currentStyle = map.getStyle()?.sprite || '';
      if (currentStyle.includes('satellite')) {
        map.setStyle('mapbox://styles/mapbox/outdoors-v12');
      }
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
    } else if (newMode === 'SATELLITE') {
      map.setStyle('mapbox://styles/mapbox/satellite-streets-v12');
      map.easeTo({ pitch: 50, duration: 800 });
    }
  };

  return (
    <div
      className={`bharat-map-root ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: 'var(--radius-xl, 16px)',
        overflow: 'hidden',
        background: '#FAF7F2',
        border: '1px solid rgba(200, 142, 68, 0.35)',
        boxShadow: '0 12px 36px rgba(45, 27, 20, 0.1)',
      }}
    >
      {/* 1. Underlying Mapbox Container (Active if Mapbox GL token is present) */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* 2. Interactive High-Res Slippy Tile Map (Active when Mapbox GL is unavailable) */}
      {(useSvgFallback || !isMapLoaded) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Tile & Road Stage with 3D Perspective Tilt for 3D & Satellite */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform:
                mapMode === '3D' || mapMode === 'SATELLITE'
                  ? 'perspective(1000px) rotateX(24deg) scale(1.08)'
                  : 'none',
              transformOrigin: '50% 60%',
              transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Real Map Tiles (CartoDB Daylight or Esri Satellite) */}
            {tileList.map((tile: { key: string; url: string; left: number; top: number }) => (
              <img
                key={tile.key}
                src={tile.url}
                alt=""
                loading="lazy"
                draggable={false}
                style={{
                  position: 'absolute',
                  left: `${tile.left}px`,
                  top: `${tile.top}px`,
                  width: `${TILE_SIZE}px`,
                  height: `${TILE_SIZE}px`,
                  pointerEvents: 'none',
                  display: 'block',
                }}
              />
            ))}

            {/* Turn-by-Turn Road Route Layer (Never straight lines) */}
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 4,
              }}
            >
              {roadPolylinePoints && (
                <>
                  {/* Outer Gold Glow Casing */}
                  <polyline
                    points={roadPolylinePoints}
                    fill="none"
                    stroke="#C88E44"
                    strokeWidth="8"
                    strokeOpacity="0.45"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Vibrant Saffron Main Road */}
                  <polyline
                    points={roadPolylinePoints}
                    fill="none"
                    stroke="#EA580C"
                    strokeWidth="4"
                    strokeOpacity="0.95"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Dashed Guidance Center Line */}
                  <polyline
                    points={roadPolylinePoints}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                    strokeOpacity="0.85"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>

            {/* Verified Place Pins & Hospital Markers */}
            {validStops.map((stop) => {
              const pt = toScreenPx(stop.lat, stop.lng);
              const isActive = stop.id === activeStopId || stop.isActive;
              const isHospital = stop.type === 'HOSPITAL';

              return (
                <div
                  key={stop.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectStop) onSelectStop(stop.id);
                  }}
                  onMouseEnter={() => setHoveredStop(stop)}
                  onMouseLeave={() => setHoveredStop(null)}
                  style={{
                    position: 'absolute',
                    left: `${pt.x}px`,
                    top: `${pt.y}px`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isActive ? 25 : 15,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pointerEvents: 'auto',
                  }}
                >
                  {/* Pin Circle */}
                  <div
                    style={{
                      width: isHospital ? '28px' : '32px',
                      height: isHospital ? '28px' : '32px',
                      borderRadius: '50%',
                      background: isHospital ? '#DC2626' : isActive ? '#EA580C' : '#C88E44',
                      border: '2.5px solid #FFFFFF',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: isHospital ? '0.75rem' : '0.8rem',
                      transition: 'transform 0.2s ease',
                      transform: isActive ? 'scale(1.2)' : 'scale(1)',
                    }}
                  >
                    {isHospital ? '🏥' : stop.sequenceNumber}
                  </div>

                  {/* Name Label */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: '#2D1B14',
                      whiteSpace: 'nowrap',
                      marginTop: '4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      border: '1px solid rgba(200, 142, 68, 0.3)',
                      pointerEvents: 'none',
                    }}
                  >
                    {stop.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Zoom Controls */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '16px',
              zIndex: 35,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              pointerEvents: 'auto',
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSlippyZoom((z) => Math.min(18, z + 1));
              }}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid rgba(200, 142, 68, 0.3)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#2D1B14',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSlippyZoom((z) => Math.max(4, z - 1));
              }}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid rgba(200, 142, 68, 0.3)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#2D1B14',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Zoom Out"
            >
              −
            </button>
          </div>
        </div>
      )}

      {/* 3. Top Telemetry & Controls Ribbon (Bright Glassmorphism) */}
      {showControls && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            zIndex: 30,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          {/* View Mode Switcher: 3D Terrain Map (Default), 2D Map, Satellite */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(200, 142, 68, 0.3)',
              borderRadius: '30px',
              padding: '3px',
              gap: '2px',
              pointerEvents: 'auto',
              boxShadow: '0 6px 20px rgba(45, 27, 20, 0.12)',
            }}
          >
            {[
              { id: '3D', label: '🗺️ 3D Map' },
              { id: '2D', label: '🗺️ 2D Map' },
              { id: 'SATELLITE', label: '🛰️ Satellite' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleModeChange(mode.id as BharatMapMode)}
                style={{
                  padding: '5px 14px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: mapMode === mode.id ? '#C88E44' : 'transparent',
                  color: mapMode === mode.id ? '#FFFFFF' : '#4A3C31',
                  transition: 'all 0.2s ease',
                  boxShadow: mapMode === mode.id ? '0 2px 8px rgba(200, 142, 68, 0.35)' : 'none',
                }}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Camera Shortcuts */}
          <div style={{ display: 'flex', gap: '6px', pointerEvents: 'auto' }}>
            <button
              onClick={fitJourney}
              style={{
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(200, 142, 68, 0.3)',
                color: '#2D1B14',
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 4px 12px rgba(45, 27, 20, 0.08)',
              }}
            >
              <span>⛶</span> Fit Journey
            </button>

            {validStops.length > 0 && (
              <button
                onClick={focusNextStop}
                style={{
                  background: '#C88E44',
                  border: 'none',
                  color: '#ffffff',
                  padding: '5px 14px',
                  borderRadius: '20px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 4px 12px rgba(200, 142, 68, 0.35)',
                }}
              >
                <span>➜</span> Next Stop
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. Live Journey Mode HUD (Bright Glass) */}
      {isJourneyMode && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            zIndex: 30,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(200, 142, 68, 0.4)',
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 12px 30px rgba(45, 27, 20, 0.15)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#C88E44', fontWeight: 800 }}>
              🔴 LIVE JOURNEY TRACKING
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2D1B14' }}>
              {validStops.find((s) => s.id === activeStopId)?.name || validStops[0]?.name || 'Next Waypoint'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#78685C' }}>
              Day {validStops.find((s) => s.id === activeStopId)?.dayNumber || 1} • Stop{' '}
              {validStops.find((s) => s.id === activeStopId)?.sequenceNumber || 1} of {validStops.length}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={focusNextStop}
              style={{
                background: '#10b981',
                border: 'none',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Focus Target
            </button>
          </div>
        </div>
      )}

      {/* 5. Bottom Provider Ribbon (Light) */}
      <div
        style={{
          position: 'absolute',
          bottom: isJourneyMode ? '80px' : '8px',
          left: '12px',
          zIndex: 25,
          pointerEvents: 'none',
          fontSize: '0.68rem',
          color: '#4A3C31',
          display: 'flex',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '3px 10px',
          borderRadius: '6px',
          border: '1px solid rgba(200, 142, 68, 0.2)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <span>🗺️ {isMapLoaded ? 'Daylight 3D Terrain Live' : 'Verified Route Network'}</span>
        {activeRoute?.totalDistanceKm ? (
          <span>
            • Verified Road Network: {activeRoute.totalDistanceKm} km ({activeRoute.totalDurationMinutes} mins)
          </span>
        ) : null}
      </div>
    </div>
  );
}
