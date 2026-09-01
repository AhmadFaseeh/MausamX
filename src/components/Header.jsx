import React from 'react';
import { WeatherIcons } from '../utils/weatherIcons';

export default function Header({ unit, setUnit, onDetectLocation, loadingGeo }) {
  return (
    <header className="app-header">
      <div className="brand-wrapper">
        <div className="brand-logo-only" title="AuraWeather">
          {WeatherIcons.partlyCloudyDay}
        </div>
      </div>

      <div className="header-controls">
        <div className="unit-toggle-group" role="group" aria-label="Temperature Unit Switcher">
          <button 
            type="button"
            className={`unit-btn ${unit === 'C' ? 'active' : ''}`}
            onClick={() => setUnit('C')}
            title="Celsius (°C)"
          >
            °C
          </button>
          <button 
            type="button"
            className={`unit-btn ${unit === 'F' ? 'active' : ''}`}
            onClick={() => setUnit('F')}
            title="Fahrenheit (°F)"
          >
            °F
          </button>
        </div>

        <button 
          type="button"
          className={`icon-action-btn ${loadingGeo ? 'loading' : ''}`}
          onClick={onDetectLocation}
          title="Detect Current Location"
          aria-label="Use My Location"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="22" y1="12" x2="18" y2="12" />
            <line x1="6" y1="12" x2="2" y2="12" />
            <line x1="12" y1="6" x2="12" y2="2" />
            <line x1="12" y1="22" x2="12" y2="18" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>
    </header>
  );
}
