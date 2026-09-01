import React, { useState, useEffect } from 'react';
import { getWeatherIcon, getWeatherDescription } from '../utils/weatherIcons';
import CustomDropdown from './CustomDropdown';

const COMPARISON_PRESETS = [
  { name: 'London', country: 'United Kingdom', flag: '🇬🇧', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { name: 'Tokyo', country: 'Japan', flag: '🇯🇵', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'New York', country: 'United States', flag: '🇺🇸', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
  { name: 'Dubai', country: 'United Arab Emirates', flag: '🇦🇪', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
  { name: 'Paris', country: 'France', flag: '🇫🇷', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Karachi', country: 'Pakistan', flag: '🇵🇰', latitude: 24.8608, longitude: 67.0104, timezone: 'Asia/Karachi' }
];

export default function AnalyticsView({ city, weatherData, toDisplayTemp, unit }) {
  const [compareCity, setCompareCity] = useState(
    COMPARISON_PRESETS.find((c) => c.name.toLowerCase() !== city.name.toLowerCase()) || COMPARISON_PRESETS[0]
  );
  const [compareData, setCompareData] = useState(null);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [hoveredHour, setHoveredHour] = useState(null);

  // Fetch comparison weather data
  useEffect(() => {
    if (!compareCity) return;
    setLoadingCompare(true);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${compareCity.latitude}&longitude=${compareCity.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=precipitation_probability&daily=uv_index_max&timezone=${encodeURIComponent(compareCity.timezone || 'auto')}`
    )
      .then((res) => res.json())
      .then((data) => setCompareData(data))
      .catch((err) => console.warn('Compare fetch error:', err))
      .finally(() => setLoadingCompare(false));
  }, [compareCity]);

  // Extract hourly data (next 24 hours)
  const hourly = weatherData?.hourly;
  const hours = hourly?.time ? hourly.time.slice(0, 24) : [];
  const temps = hourly?.temperature_2m ? hourly.temperature_2m.slice(0, 24).map((t) => toDisplayTemp(t)) : [];
  const pops = hourly?.precipitation_probability ? hourly.precipitation_probability.slice(0, 24) : [];

  // SVG Chart Dimensions
  const chartWidth = 700;
  const chartHeight = 180;
  const paddingX = 30;
  const paddingY = 25;

  let minTemp = temps.length > 0 ? Math.min(...temps) : 0;
  let maxTemp = temps.length > 0 ? Math.max(...temps) : 40;
  if (minTemp === maxTemp) {
    minTemp -= 2;
    maxTemp += 2;
  }

  // Generate SVG Points for Temperature Curve
  const points = temps.map((temp, i) => {
    const x = paddingX + (i / Math.max(temps.length - 1, 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((temp - minTemp) / (maxTemp - minTemp)) * (chartHeight - paddingY * 2);
    return { x, y, temp, time: hours[i] };
  });

  // Smooth Bezier path string
  let pathD = '';
  let areaD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      pathD += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;
  }

  const dropdownOptions = COMPARISON_PRESETS.map((p) => ({
    value: p.name,
    label: `${p.name} (${p.country})`,
    flag: p.flag
  }));

  return (
    <div className="analytics-view-container">
      {/* 24-Hour Temperature Curve Chart */}
      <section className="glass-card chart-card">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">24-Hour Temperature Trajectory</h3>
            <span className="chart-subtitle">Smooth hourly temperature curve with real-time gradient</span>
          </div>
          {hoveredHour && (
            <div className="chart-tooltip-badge">
              <span>{new Date(hoveredHour.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}:</span>
              <strong>{hoveredHour.temp}°{unit}</strong>
            </div>
          )}
        </div>

        <div className="chart-svg-wrapper">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="analytics-svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id="tempAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
                <stop offset="80%" stopColor="#38BDF8" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal guideline */}
            <line
              x1={paddingX}
              y1={chartHeight / 2}
              x2={chartWidth - paddingX}
              y2={chartHeight / 2}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeDasharray="4 4"
            />

            {/* Gradient Area Fill */}
            {areaD && <path d={areaD} fill="url(#tempAreaGrad)" />}

            {/* Temperature Stroke Line */}
            {pathD && <path d={pathD} fill="none" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />}

            {/* Interactive Data Dots */}
            {points.map((pt, idx) => (
              <g
                key={idx}
                onMouseEnter={() => setHoveredHour(pt)}
                onMouseLeave={() => setHoveredHour(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredHour?.time === pt.time ? 6 : 3.5}
                  fill={hoveredHour?.time === pt.time ? '#FFFFFF' : '#38BDF8'}
                  stroke="#0F172A"
                  strokeWidth="2"
                />
              </g>
            ))}
          </svg>
        </div>

        <div className="chart-x-labels">
          {points.filter((_, i) => i % 3 === 0).map((pt, i) => (
            <span key={i} className="chart-x-time">
              {new Date(pt.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
            </span>
          ))}
        </div>
      </section>

      {/* Precipitation Probability Bar Graph */}
      <section className="glass-card chart-card">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Precipitation Probability (%)</h3>
            <span className="chart-subtitle">Hourly likelihood of rain or showers over 24 hours</span>
          </div>
        </div>

        <div className="pop-bars-container">
          {pops.map((pop, idx) => {
            const timeStr = hours[idx]
              ? new Date(hours[idx]).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
              : `${idx}h`;
            return (
              <div key={idx} className="pop-bar-column">
                <span className="pop-value">{pop > 0 ? `${pop}%` : ''}</span>
                <div className="pop-bar-track">
                  <div
                    className="pop-bar-fill"
                    style={{
                      height: `${Math.max(4, pop)}%`,
                      background: pop > 50 ? '#0284C7' : '#38BDF8'
                    }}
                  />
                </div>
                <span className="pop-time">{timeStr}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Side-by-Side City Comparison Tool with Glassmorphic Custom Dropdown */}
      <section className="glass-card compare-card">
        <div className="compare-header">
          <div>
            <h3 className="chart-title">City vs City Comparison</h3>
            <span className="chart-subtitle">Benchmark live atmospheric parameters side-by-side</span>
          </div>

          <div className="compare-selector-box">
            <span className="compare-label">Compare with:</span>
            <CustomDropdown
              options={dropdownOptions}
              value={compareCity?.name}
              onChange={(selectedName) => {
                const found = COMPARISON_PRESETS.find((c) => c.name === selectedName);
                if (found) setCompareCity(found);
              }}
            />
          </div>
        </div>

        <div className="compare-table-wrapper">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Atmospheric Metric</th>
                <th className="th-active-city">{city.name} (Current)</th>
                <th className="th-compare-city">{compareCity.name}</th>
              </tr>
            </thead>
            <tbody>
              {/* Temperature */}
              <tr>
                <td className="metric-col">Temperature</td>
                <td className="val-primary">
                  {toDisplayTemp(weatherData?.current?.temperature_2m)}°{unit}
                </td>
                <td className="val-secondary">
                  {toDisplayTemp(compareData?.current?.temperature_2m)}°{unit}
                </td>
              </tr>

              {/* Condition */}
              <tr>
                <td className="metric-col">Condition</td>
                <td>
                  <div className="inline-condition">
                    <span className="tiny-icon">
                      {getWeatherIcon(weatherData?.current?.weather_code, weatherData?.current?.is_day)}
                    </span>
                    <span>{getWeatherDescription(weatherData?.current?.weather_code)}</span>
                  </div>
                </td>
                <td>
                  <div className="inline-condition">
                    <span className="tiny-icon">
                      {getWeatherIcon(compareData?.current?.weather_code, compareData?.current?.is_day)}
                    </span>
                    <span>{getWeatherDescription(compareData?.current?.weather_code)}</span>
                  </div>
                </td>
              </tr>

              {/* Feels Like */}
              <tr>
                <td className="metric-col">Feels Like</td>
                <td>{toDisplayTemp(weatherData?.current?.apparent_temperature)}°{unit}</td>
                <td>{toDisplayTemp(compareData?.current?.apparent_temperature)}°{unit}</td>
              </tr>

              {/* Humidity */}
              <tr>
                <td className="metric-col">Humidity</td>
                <td>{weatherData?.current?.relative_humidity_2m ?? '--'}%</td>
                <td>{compareData?.current?.relative_humidity_2m ?? '--'}%</td>
              </tr>

              {/* Wind Speed */}
              <tr>
                <td className="metric-col">Wind Speed</td>
                <td>{(weatherData?.current?.wind_speed_10m ?? 0).toFixed(1)} km/h</td>
                <td>{(compareData?.current?.wind_speed_10m ?? 0).toFixed(1)} km/h</td>
              </tr>

              {/* UV Index */}
              <tr>
                <td className="metric-col">UV Index</td>
                <td>{(weatherData?.daily?.uv_index_max?.[0] ?? 0).toFixed(1)}</td>
                <td>{(compareData?.daily?.uv_index_max?.[0] ?? 0).toFixed(1)}</td>
              </tr>

              {/* Precipitation */}
              <tr>
                <td className="metric-col">Rain Chance</td>
                <td>{weatherData?.hourly?.precipitation_probability?.[0] ?? 0}%</td>
                <td>{compareData?.hourly?.precipitation_probability?.[0] ?? 0}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
