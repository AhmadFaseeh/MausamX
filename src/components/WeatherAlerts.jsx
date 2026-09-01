import React, { useState } from 'react';

export default function WeatherAlerts({ weatherData, airQualityData }) {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (dismissed || !weatherData || !weatherData.current) return null;

  const current = weatherData.current;
  const code = current.weather_code;
  const temp = current.temperature_2m;
  const wind = current.wind_speed_10m;
  const pop = weatherData.hourly?.precipitation_probability?.[0] || 0;
  const aqi = airQualityData?.current?.us_aqi;

  let alert = null;

  // 1. Thunderstorm Alert
  if (code >= 95 && code <= 99) {
    alert = {
      type: 'danger',
      title: ' Severe Thunderstorm Warning',
      shortDesc: 'Active lightning, localized heavy downpours, and gusty winds reported.',
      tips: [
        'Stay indoors and away from open windows.',
        'Avoid contact with electrical equipment and plumbing fixtures.',
        'If driving, reduce speed and pull over if visibility becomes hazardous.'
      ]
    };
  }
  // 2. Extreme Heat
  else if (temp >= 38) {
    alert = {
      type: 'warning',
      title: ' Extreme Heat Advisory',
      shortDesc: `Dangerous ambient temperature of ${temp.toFixed(1)}°C. High risk of heat exhaustion.`,
      tips: [
        'Drink plenty of fluids even if you do not feel thirsty.',
        'Stay in air-conditioned or shaded areas during peak sun hours (11 AM - 4 PM).',
        'Never leave children or pets in unattended vehicles.'
      ]
    };
  }
  // 3. Heavy Rain / Flooding
  else if (code === 65 || code === 82 || pop >= 80) {
    alert = {
      type: 'info',
      title: 'Heavy Rainfall & Waterlogging Alert',
      shortDesc: 'Significant precipitation expected in the area with possible road surface runoff.',
      tips: [
        'Carry umbrella and waterproof gear.',
        'Exercise caution on highways and low-lying underpasses.',
        'Allow extra commute time due to reduced road traction.'
      ]
    };
  }
  // 4. High Wind Warning
  else if (wind >= 40) {
    alert = {
      type: 'warning',
      title: 'High Wind Warning',
      shortDesc: `Strong sustained winds of ${wind.toFixed(1)} km/h with sudden gusts.`,
      tips: [
        'Secure outdoor furniture and loose lightweight objects.',
        'Watch for falling branches or flying debris when walking outside.',
        'Drive carefully, especially high-profile vehicles on bridges.'
      ]
    };
  }
  // 5. Poor Air Quality
  else if (aqi && aqi >= 150) {
    alert = {
      type: 'danger',
      title: 'Unhealthy Air Quality (AQI ' + aqi + ')',
      shortDesc: 'Elevated particulate pollution levels detected. Everyone may begin to experience health effects.',
      tips: [
        'Wear an N95/KF94 mask when outdoors.',
        'Keep residential windows closed and run air purifiers.',
        'Sensitive groups (asthma, children, elderly) should avoid outdoor physical exertion.'
      ]
    };
  }

  if (!alert) return null;

  return (
    <div className={`smart-alert-card ${alert.type}`}>
      <div className="alert-main-row">
        <div className="alert-content">
          <h4 className="alert-title">{alert.title}</h4>
          <p className="alert-desc">{alert.shortDesc}</p>
        </div>

        <div className="alert-actions">
          <button
            type="button"
            className="alert-btn-details"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Hide Advice' : 'Safety Advice'}
          </button>
          <button
            type="button"
            className="alert-btn-close"
            onClick={() => setDismissed(true)}
            title="Dismiss Alert"
          >
            &times;
          </button>
        </div>
      </div>

      {expanded && (
        <ul className="alert-tips-list">
          {alert.tips.map((tip, idx) => (
            <li key={idx}>✓ {tip}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
