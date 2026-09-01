import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function RadarMap({ city, weatherData, toDisplayTemp, unit, onSelectCity }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const cityMarkerRef = useRef(null);
  const radarLayerRef = useRef(null);

  // Radar Animation State
  const [radarFrames, setRadarFrames] = useState([]);
  const [radarHost, setRadarHost] = useState('https://tilecache.rainviewer.com');
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [opacity, setOpacity] = useState(0.8);
  const [baseLayerType, setBaseLayerType] = useState('dark'); // 'dark' | 'satellite' | 'street'
  const [loadingRadar, setLoadingRadar] = useState(true);

  // --- Initialize Leaflet Map ---
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialLat = city?.latitude || 24.8608;
    const initialLon = city?.longitude || 67.0104;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLon],
      zoom: 3,
      minZoom: 3,
      maxZoom: 22,
      zoomControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(map);
    mapInstanceRef.current = map;

    // Click on map to inspect / switch location
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      const popupContent = document.createElement('div');
      popupContent.style.padding = '8px 10px';
      popupContent.style.textAlign = 'center';
      popupContent.innerHTML = `
        <strong style="color: #0F172A; display: block; font-size: 13px; margin-bottom: 2px;">Selected Pinpoint</strong>
        <span style="color: #64748B; font-size: 11px; display: block; margin-bottom: 8px;">${lat.toFixed(3)}°, ${lng.toFixed(3)}°</span>
        <button id="btn-inspect-weather" style="background: linear-gradient(135deg, #0284C7, #38BDF8); color: white; border: none; padding: 6px 14px; border-radius: 99px; font-weight: 700; cursor: pointer; font-size: 12px; box-shadow: 0 4px 10px rgba(2,132,199,0.4);">
          View Weather Here
        </button>
      `;

      L.popup()
        .setLatLng([lat, lng])
        .setContent(popupContent)
        .openOn(map);

      setTimeout(() => {
        const btn = document.getElementById('btn-inspect-weather');
        if (btn) {
          btn.onclick = () => {
            map.closePopup();
            onSelectCity({
              name: `Pin (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
              country: 'Selected Pin',
              countryCode: '',
              latitude: lat,
              longitude: lng,
              timezone: 'auto'
            });
          };
        }
      }, 50);
    });

    // Fetch RainViewer real-time radar frames
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then((res) => res.json())
      .then((data) => {
        if (data.radar && data.radar.past && data.radar.past.length > 0) {
          setRadarHost(data.host || 'https://tilecache.rainviewer.com');
          setRadarFrames(data.radar.past);
          setCurrentFrameIndex(data.radar.past.length - 1);
        }
      })
      .catch((err) => console.warn('Radar fetch error:', err))
      .finally(() => setLoadingRadar(false));

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // --- Update Base Tile Layer (Watermark-Free & 100% Free) ---
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (map._baseTileLayer) {
      map.removeLayer(map._baseTileLayer);
    }

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; OpenStreetMap contributors';
    let tileClassName = '';

    if (baseLayerType === 'dark') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; OpenStreetMap contributors';
      tileClassName = 'map-tiles-dark';
    } else if (baseLayerType === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '&copy; Esri & Earthstar Geographics';
      tileClassName = 'map-tiles-satellite';
    } else {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; OpenStreetMap contributors';
      tileClassName = '';
    }

    const tileLayer = L.tileLayer(url, {
      attribution,
      maxZoom: 18,
      className: tileClassName,
      subdomains: ['a', 'b', 'c']
    }).addTo(map);

    map._baseTileLayer = tileLayer;
  }, [baseLayerType]);

  // --- Update City Marker ---
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !city) return;

    const lat = city.latitude;
    const lon = city.longitude;

    const targetZoom = Math.min(map.getZoom() || 6, 7);
    map.setView([lat, lon], targetZoom);

    if (cityMarkerRef.current) {
      map.removeLayer(cityMarkerRef.current);
    }

    const tempText =
      weatherData?.current?.temperature_2m != null
        ? `${toDisplayTemp(weatherData.current.temperature_2m)}°${unit}`
        : '--';

    const customIcon = L.divIcon({
      className: 'custom-radar-pin',
      html: `
        <div class="radar-marker-pulse">
          <div class="marker-dot"></div>
          <div class="marker-badge">${city.name}: ${tempText}</div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
    cityMarkerRef.current = marker;
  }, [city, weatherData, toDisplayTemp, unit]);

  // --- Update Radar Frame Layer (with maxNativeZoom to prevent 'Zoom level not supported') ---
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || radarFrames.length === 0) return;

    const frame = radarFrames[currentFrameIndex];
    if (!frame) return;

    if (radarLayerRef.current) {
      map.removeLayer(radarLayerRef.current);
    }

    const radarUrl = `${radarHost}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`;

    // maxNativeZoom: 6 prevents RainViewer from ever returning "zoom level not supported" tiles!
    const layer = L.tileLayer(radarUrl, {
      opacity,
      zIndex: 10,
      tileSize: 256,
      minZoom: 2,
      maxNativeZoom: 6,
      maxZoom: 18
    }).addTo(map);

    radarLayerRef.current = layer;
  }, [currentFrameIndex, radarFrames, radarHost, opacity]);

  // --- Radar Playback Timer ---
  useEffect(() => {
    if (!isPlaying || radarFrames.length === 0) return;

    const timer = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % radarFrames.length);
    }, 750);

    return () => clearInterval(timer);
  }, [isPlaying, radarFrames]);

  // Format frame timestamp
  const currentTimestamp = radarFrames[currentFrameIndex]?.time;
  const timeFormatted = currentTimestamp
    ? new Date(currentTimestamp * 1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    : 'Live';

  return (
    <div className="glass-card radar-map-container">
      {/* Map Control Bar */}
      <div className="radar-controls-header">
        <div className="radar-title-box">
          <div className="radar-live-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
          </div>
          <div>
            <h3 className="radar-title">Live Doppler Radar & Weather Map</h3>
            <span className="radar-subtitle">Interactive Real-Time Precipitation & Cloud Scans</span>
          </div>
        </div>

        <div className="radar-layer-selectors">
          <button
            type="button"
            className={`map-style-btn ${baseLayerType === 'dark' ? 'active' : ''}`}
            onClick={() => setBaseLayerType('dark')}
            title="Clean dark radar mode"
          >
            Dark Radar
          </button>
          <button
            type="button"
            className={`map-style-btn ${baseLayerType === 'satellite' ? 'active' : ''}`}
            onClick={() => setBaseLayerType('satellite')}
            title="High-resolution satellite"
          >
            Satellite
          </button>
          <button
            type="button"
            className={`map-style-btn ${baseLayerType === 'street' ? 'active' : ''}`}
            onClick={() => setBaseLayerType('street')}
            title="OpenStreetMap streets"
          >
            Street
          </button>
        </div>
      </div>

      {/* Leaflet Map Surface */}
      <div className="leaflet-map-wrapper">
        <div ref={mapContainerRef} className="leaflet-map-canvas" />

        {loadingRadar && (
          <div className="radar-loading-overlay">
            <div className="radar-spinner" />
            <span>Connecting to live Doppler radar sweeps...</span>
          </div>
        )}
      </div>

      {/* Radar Timeline & Playback Bar */}
      <div className="radar-playback-dock">
        <div className="playback-left">
          <button
            type="button"
            className="radar-play-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause Radar Loop' : 'Play Radar Loop'}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>

          <div className="radar-time-tag">
            <span className="radar-live-dot" />
            <span>Sweep: <strong>{timeFormatted}</strong></span>
          </div>
        </div>

        {/* Scrubber slider */}
        <div className="playback-center">
          <input
            type="range"
            min="0"
            max={Math.max(0, radarFrames.length - 1)}
            value={currentFrameIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentFrameIndex(Number(e.target.value));
            }}
            className="radar-slider"
          />
        </div>

        {/* Opacity control */}
        <div className="playback-right">
          <span className="radar-label">Precip Opacity:</span>
          <input
            type="range"
            min="0.2"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="radar-opacity-slider"
            title="Adjust radar precipitation opacity"
          />
        </div>
      </div>
    </div>
  );
}
