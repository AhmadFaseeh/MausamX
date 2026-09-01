import { getWeatherIcon } from '../utils/weatherIcons';
function formatDayOfWeek(isoString, index) {
  if (index === 0) return 'Today';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}
export default function DailyForecast({ daily, toDisplayTemp }) {
  if (!daily || !daily.time) return null;
  const allMins = daily.temperature_2m_min.map((t) => toDisplayTemp(t));
  const allMaxs = daily.temperature_2m_max.map((t) => toDisplayTemp(t));
  const overallMin = Math.min(...allMins);
  const overallMax = Math.max(...allMaxs);
  const spread = Math.max(overallMax - overallMin, 1);
  return (
    <section className="glass-card daily-section" aria-label="7-Day Extended Forecast">
      <h3 className="forecast-section-title">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: '18px', height: '18px', color: 'var(--accent-cyan)' }}
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        7-Day Forecast
      </h3>
      <div className="daily-list">
        {daily.time.map((isoDay, index) => {
          const wCode = daily.weather_code[index];
          const dayMin = toDisplayTemp(daily.temperature_2m_min[index]);
          const dayMax = toDisplayTemp(daily.temperature_2m_max[index]);
          const dayName = formatDayOfWeek(isoDay, index);

          const leftPercent = Math.max(0, ((dayMin - overallMin) / spread) * 100);
          const widthPercent = Math.max(12, ((dayMax - dayMin) / spread) * 100);

          return (
            <div key={isoDay} className="daily-item">
              <span className="daily-day">{dayName}</span>
              <div className="daily-icon-box">{getWeatherIcon(wCode, 1)}</div>
              <div className="temp-bar-container">
                <span className="temp-label-min">{dayMin}°</span>
                <div className="temp-bar-track">
                  <div
                    className="temp-bar-fill"
                    style={{
                      left: `${leftPercent.toFixed(1)}%`,
                      width: `${widthPercent.toFixed(1)}%`
                    }}
                  />
                </div>
                <span className="temp-label-max">{dayMax}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
