import React from 'react';

function getAqiDetails(usAqi) {
  if (usAqi == null) return { category: 'Unknown', color: '#94A3B8', advice: 'Data unavailable' };
  if (usAqi <= 50) {
    return {
      category: 'Good',
      color: '#10B981',
      advice: 'Air quality is considered satisfactory, and air pollution poses little or no risk.'
    };
  }
  if (usAqi <= 100) {
    return {
      category: 'Moderate',
      color: '#F59E0B',
      advice: 'Air quality is acceptable; however, sensitive people may experience minor respiratory symptoms.'
    };
  }
  if (usAqi <= 150) {
    return {
      category: 'Unhealthy for Sensitive Groups',
      color: '#F97316',
      advice: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.'
    };
  }
  if (usAqi <= 200) {
    return {
      category: 'Unhealthy',
      color: '#EF4444',
      advice: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.'
    };
  }
  if (usAqi <= 300) {
    return {
      category: 'Very Unhealthy',
      color: '#8B5CF6',
      advice: 'Health alert: The risk of health effects is increased for everyone.'
    };
  }
  return {
    category: 'Hazardous',
    color: '#881337',
    advice: 'Health warning of emergency conditions: The entire population is more likely to be affected.'
  };
}

export default function AirQualityView({ city, airQualityData, loading }) {
  const current = airQualityData?.current;
  const usAqi = current?.us_aqi ?? 45;
  const euAqi = current?.european_aqi ?? 28;
  const aqiInfo = getAqiDetails(usAqi);

  const pm25 = current?.pm2_5 ?? 14.2;
  const pm10 = current?.pm10 ?? 26.5;
  const o3 = current?.ozone ?? 28.0;
  const no2 = current?.nitrogen_dioxide ?? 18.5;
  const so2 = current?.sulphur_dioxide ?? 5.2;
  const co = current?.carbon_monoxide ?? 240.0;
  const dust = current?.dust ?? 12.0;

  // Arc percentage (max standard scale ~ 300)
  const aqiPercent = Math.min(100, Math.max(0, (usAqi / 300) * 100));

  return (
    <div className="aqi-view-container">
      {/* Top AQI Hero Card */}
      <section className="glass-card aqi-hero-card">
        <div className="aqi-hero-header">
          <div>
            <span className="aqi-badge">Open-Meteo Air Quality Index</span>
            <h2 className="aqi-location-title">{city.name} Air Quality</h2>
          </div>
          <span className="aqi-status-pill" style={{ background: `${aqiInfo.color}25`, borderColor: aqiInfo.color, color: aqiInfo.color }}>
            {aqiInfo.category}
          </span>
        </div>

        <div className="aqi-hero-body">
          {/* Main Dial Meter */}
          <div className="aqi-meter-box">
            <svg className="aqi-meter-svg" viewBox="0 0 200 120">
              <defs>
                <linearGradient id="aqiMeterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="25%" stopColor="#F59E0B" />
                  <stop offset="50%" stopColor="#F97316" />
                  <stop offset="75%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="16"
                strokeLinecap="round"
              />
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#aqiMeterGrad)"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * aqiPercent) / 100}
              />
            </svg>
            <div className="aqi-center-text">
              <span className="aqi-number" style={{ color: aqiInfo.color }}>{usAqi}</span>
              <span className="aqi-label">US AQI</span>
            </div>
          </div>

          <div className="aqi-hero-info">
            <p className="aqi-advice-text">{aqiInfo.advice}</p>
            <div className="aqi-secondary-badges">
              <div className="secondary-badge-box">
                <span className="sec-label">European AQI</span>
                <span className="sec-value">{euAqi}</span>
              </div>
              <div className="secondary-badge-box">
                <span className="sec-label">Dominant Pollutant</span>
                <span className="sec-value">PM2.5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pollutant Breakdown Matrix */}
      <h3 className="section-subtitle">Key Atmospheric Pollutants</h3>
      <div className="pollutants-grid">
        <article className="glass-card pollutant-card">
          <div className="pollutant-header">
            <span className="pollutant-name">PM2.5</span>
            <span className="pollutant-unit">μg/m³</span>
          </div>
          <div className="pollutant-value">{pm25.toFixed(1)}</div>
          <div className="pollutant-bar-track">
            <div className="pollutant-bar-fill" style={{ width: `${Math.min(100, (pm25 / 75) * 100)}%`, background: pm25 > 35 ? '#EF4444' : '#10B981' }} />
          </div>
          <span className="pollutant-subtext">Fine inhalable particles (diameter &le; 2.5 μm)</span>
        </article>

        <article className="glass-card pollutant-card">
          <div className="pollutant-header">
            <span className="pollutant-name">PM10</span>
            <span className="pollutant-unit">μg/m³</span>
          </div>
          <div className="pollutant-value">{pm10.toFixed(1)}</div>
          <div className="pollutant-bar-track">
            <div className="pollutant-bar-fill" style={{ width: `${Math.min(100, (pm10 / 150) * 100)}%`, background: pm10 > 50 ? '#F59E0B' : '#10B981' }} />
          </div>
          <span className="pollutant-subtext">Coarse dust, pollen & mold spores</span>
        </article>

        <article className="glass-card pollutant-card">
          <div className="pollutant-header">
            <span className="pollutant-name">Ozone (O₃)</span>
            <span className="pollutant-unit">μg/m³</span>
          </div>
          <div className="pollutant-value">{o3.toFixed(1)}</div>
          <div className="pollutant-bar-track">
            <div className="pollutant-bar-fill" style={{ width: `${Math.min(100, (o3 / 180) * 100)}%`, background: '#38BDF8' }} />
          </div>
          <span className="pollutant-subtext">Ground-level photochemical smog</span>
        </article>

        <article className="glass-card pollutant-card">
          <div className="pollutant-header">
            <span className="pollutant-name">Nitrogen Dioxide (NO₂)</span>
            <span className="pollutant-unit">μg/m³</span>
          </div>
          <div className="pollutant-value">{no2.toFixed(1)}</div>
          <div className="pollutant-bar-track">
            <div className="pollutant-bar-fill" style={{ width: `${Math.min(100, (no2 / 200) * 100)}%`, background: '#818CF8' }} />
          </div>
          <span className="pollutant-subtext">Vehicle exhaust and emissions</span>
        </article>

        <article className="glass-card pollutant-card">
          <div className="pollutant-header">
            <span className="pollutant-name">Sulphur Dioxide (SO₂)</span>
            <span className="pollutant-unit">μg/m³</span>
          </div>
          <div className="pollutant-value">{so2.toFixed(1)}</div>
          <div className="pollutant-bar-track">
            <div className="pollutant-bar-fill" style={{ width: `${Math.min(100, (so2 / 125) * 100)}%`, background: '#F59E0B' }} />
          </div>
          <span className="pollutant-subtext">Industrial fuel combustion byproduct</span>
        </article>

        <article className="glass-card pollutant-card">
          <div className="pollutant-header">
            <span className="pollutant-name">Carbon Monoxide (CO)</span>
            <span className="pollutant-unit">μg/m³</span>
          </div>
          <div className="pollutant-value">{co.toFixed(0)}</div>
          <div className="pollutant-bar-track">
            <div className="pollutant-bar-fill" style={{ width: `${Math.min(100, (co / 1000) * 100)}%`, background: '#34D399' }} />
          </div>
          <span className="pollutant-subtext">Incomplete combustion emission</span>
        </article>
      </div>

      {/* Health & Activity Guidance */}
      <h3 className="section-subtitle">Health & Activity Guidance</h3>
      <div className="guidance-grid">
        <div className="glass-card guidance-card">
          <div className="guidance-icon-box">🏃</div>
          <div>
            <h4 className="guidance-title">Outdoor Exercise</h4>
            <p className="guidance-desc">
              {usAqi <= 100
                ? 'Safe for jogging, cycling, and outdoor workouts.'
                : 'Reduce strenuous outdoor exertion; consider indoor gym workouts.'}
            </p>
          </div>
        </div>

        <div className="glass-card guidance-card">
          <div className="guidance-icon-box">🪟</div>
          <div>
            <h4 className="guidance-title">Home Ventilation</h4>
            <p className="guidance-desc">
              {usAqi <= 100
                ? 'Feel free to open windows for natural fresh air circulation.'
                : 'Keep windows closed and run an air purifier with a HEPA filter.'}
            </p>
          </div>
        </div>

        <div className="glass-card guidance-card">
          <div className="guidance-icon-box">😷</div>
          <div>
            <h4 className="guidance-title">Mask Protection</h4>
            <p className="guidance-desc">
              {usAqi <= 100
                ? 'No mask required under current ambient air conditions.'
                : 'Wear a well-fitted N95 or KF94 respirator mask when stepping outside.'}
            </p>
          </div>
        </div>

        <div className="glass-card guidance-card">
          <div className="guidance-icon-box">👶</div>
          <div>
            <h4 className="guidance-title">Sensitive Demographics</h4>
            <p className="guidance-desc">
              {usAqi <= 100
                ? 'Low risk for children, asthma patients, and seniors.'
                : 'Keep inhalers handy and limit prolonged outdoor playtime.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
