function getWindCardinal(deg) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8;
  return directions[index];
}

function getUvCategory(uv) {
  if (uv < 3) return { level: 'Low', desc: 'Minimal sun protection needed' };
  if (uv < 6) return { level: 'Moderate', desc: 'Wear sunglasses & hat outdoors' };
  if (uv < 8) return { level: 'High', desc: 'Use sunscreen SPF 30+ outdoors' };
  if (uv < 11) return { level: 'Very High', desc: 'Seek shade during midday hours' };
  return { level: 'Extreme', desc: 'Avoid outdoor sun exposure' };
}

function formatTime(isoString, timezone) {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone || 'UTC'
    }).format(date);
  } catch {
    return '--:--';
  }
}

export default function WeatherMetrics({ current, daily, unit, timezone }) {
  if (!current) return null;

  const rawWindKmh = current.wind_speed_10m || 0;
  const isFahrenheit = unit === 'F';
  const windSpeed = isFahrenheit ? (rawWindKmh * 0.621371).toFixed(1) : rawWindKmh.toFixed(1);
  const windUnit = isFahrenheit ? 'mph' : 'km/h';
  const windDir = current.wind_direction_10m || 0;
  const uvVal = daily?.uv_index_max?.[0] || 0;
  const uvCategory = getUvCategory(uvVal);
  const uvPercent = Math.min(100, Math.max(0, (uvVal / 11) * 100));
  const hum = current.relative_humidity_2m || 0;
  let humDesc = 'Comfortable moisture level';
  if (hum < 30) humDesc = 'Air is dry & crisp';
  else if (hum > 80) humDesc = 'Very humid & sticky';
  else if (hum > 60) humDesc = 'Humid conditions';
  const pressure = Math.round(current.surface_pressure || 1013);
  let pressureDesc = 'Normal atmospheric equilibrium';
  if (pressure > 1018) pressureDesc = 'High pressure: Stable & clear';
  else if (pressure < 1005) pressureDesc = 'Low pressure: Rain or storm likely';
  const precip = (current.precipitation || 0).toFixed(1);
  const precipDesc = precip > 0 ? 'Active precipitation detected' : 'No rain in the last hour';
  const sunriseISO = daily?.sunrise?.[0];
  const sunsetISO = daily?.sunset?.[0];
  const sunriseStr = sunriseISO ? formatTime(sunriseISO, timezone) : '--:--';
  const sunsetStr = sunsetISO ? formatTime(sunsetISO, timezone) : '--:--';
  let sunCx = 150;
  let sunCy = 27;
  let sunFill = '#F59E0B';
  if (sunriseISO && sunsetISO) {
    const now = new Date();
    const sr = new Date(sunriseISO);
    const ss = new Date(sunsetISO);
    let progress = (now - sr) / (ss - sr);
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    const t = progress;
    const invT = 1 - t;
    sunCx = invT * invT * 20 + 2 * invT * t * 150 + t * t * 280;
    sunCy = invT * invT * 60 + 2 * invT * t * -5 + t * t * 60;
    if (progress === 0 || progress === 1) {
      sunFill = '#94A3B8';
    }
  }

  return (
    <section className="metrics-grid" aria-label="Weather Highlights & Metrics">
      <article className="glass-card metric-card">
        <div className="metric-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
          </svg>
          <span>Wind & Direction</span>
        </div>
        <div className="metric-body">
          <div className="compass-box">
            <div className="compass-visual">
              <div
                className="compass-needle"
                style={{ transform: `rotate(${windDir}deg)` }}
              />
            </div>
            <div>
              <div className="metric-value-row">
                <span className="metric-value">{windSpeed}</span>
                <span className="metric-unit">{windUnit}</span>
              </div>
              <div className="metric-subtext">
                Bearing: {windDir}° ({getWindCardinal(windDir)})
              </div>
            </div>
          </div>
        </div>
      </article>
      <article className="glass-card metric-card">
        <div className="metric-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14l-1.41 1.41" />
          </svg>
          <span>UV Index</span>
        </div>
        <div className="metric-body">
          <div className="metric-value-row">
            <span className="metric-value">{uvVal.toFixed(1)}</span>
            <span className="metric-unit">{uvCategory.level}</span>
          </div>
          <div className="uv-scale-bar">
            <div className="uv-indicator-dot" style={{ left: `${uvPercent}%` }} />
          </div>
          <div className="metric-subtext">{uvCategory.desc}</div>
        </div>
      </article>
      <article className="glass-card metric-card">
        <div className="metric-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
          <span>Humidity</span>
        </div>
        <div className="metric-body">
          <div className="metric-value-row">
            <span className="metric-value">{hum}</span>
            <span className="metric-unit">%</span>
          </div>
          <div className="metric-subtext">{humDesc}</div>
        </div>
      </article>
      <article className="glass-card metric-card">
        <div className="metric-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="m14 9-3 3" />
            <circle cx="12" cy="12" r="1" />
          </svg>
          <span>Air Pressure</span>
        </div>
        <div className="metric-body">
          <div className="metric-value-row">
            <span className="metric-value">{pressure}</span>
            <span className="metric-unit">hPa</span>
          </div>
          <div className="metric-subtext">{pressureDesc}</div>
        </div>
      </article>
      <article className="glass-card metric-card">
        <div className="metric-header">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
          <span>Precipitation & Rain</span>
        </div>
        <div className="metric-body">
          <div className="metric-value-row">
            <span className="metric-value">{precip}</span>
            <span className="metric-unit">mm</span>
          </div>
          <div className="metric-subtext">{precipDesc}</div>
        </div>
      </article>
      <article className="glass-card metric-card sun-schedule">
        <div className="metric-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v6m-7.07.93l4.24 4.24M1.93 18.07l4.24-4.24M22 18h-2m2-8h-6m-4 12a6 6 0 0 0 6-6H6a6 6 0 0 0 6 6z" />
          </svg>
          <span>Sun Schedule & Daylight</span>
        </div>
        <div className="metric-body">
          <div className="sun-arc-container">
            <svg className="sun-arc-svg" viewBox="0 0 300 70" preserveAspectRatio="none">
              <defs>
                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(245, 158, 11, 0.2)" />
                  <stop offset="50%" stopColor="rgba(245, 158, 11, 0.8)" />
                  <stop offset="100%" stopColor="rgba(245, 158, 11, 0.2)" />
                </linearGradient>
              </defs>
              <path
                d="M 20 60 Q 150 -5 280 60"
                fill="none"
                stroke="rgba(255, 255, 255, 0.18)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <circle
                cx={sunCx.toFixed(1)}
                cy={sunCy.toFixed(1)}
                r="7"
                fill={sunFill}
                filter="drop-shadow(0 0 8px #F59E0B)"
              />
            </svg>
          </div>
          <div className="sun-times-row">
            <div className="sun-time-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v6m-7.07.93l4.24 4.24M1.93 18.07l4.24-4.24M22 18h-2m2-8h-6m-4 12a6 6 0 0 0 6-6H6a6 6 0 0 0 6 6z" />
              </svg>
              <span>Sunrise: <strong>{sunriseStr}</strong></span>
            </div>
            <div className="sun-time-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 10V4m-7.07 4.93l4.24-4.24M1.93 18.07l4.24-4.24M22 18h-2m2-8h-6m-4 12a6 6 0 0 0 6-6H6a6 6 0 0 0 6 6z" />
                <path d="M12 14l-3-3m3 3l3-3" />
              </svg>
              <span>Sunset: <strong>{sunsetStr}</strong></span>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
