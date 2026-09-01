import { getWeatherIcon, getWeatherDescription } from '../utils/weatherIcons';

function getCountryFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

export default function HeroWeather({
  city,
  current,
  daily,
  unit,
  toDisplayTemp,
  isFavorite,
  onToggleFavorite
}) {
  if (!current) return null;

  const isDay = current.is_day;
  const code = current.weather_code;

  // Format local time in the city's timezone
  let localTimeStr = '--:--';
  try {
    const now = new Date();
    localTimeStr = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: city.timezone || 'UTC'
    }).format(now);
  } catch {
    localTimeStr = 'Live';
  }

  const highTemp = daily?.temperature_2m_max?.[0] != null ? toDisplayTemp(daily.temperature_2m_max[0]) : '--';
  const lowTemp = daily?.temperature_2m_min?.[0] != null ? toDisplayTemp(daily.temperature_2m_min[0]) : '--';

  return (
    <section className="glass-card hero-weather-card" aria-label="Current Weather Overview">
      <div className="hero-header">
        <div className="hero-location">
          <div className="location-title-row">
            <h2 className="location-name">{city.name}</h2>
            
          </div>
          <div className="location-meta">
            <span>
              {city.country} {getCountryFlag(city.countryCode)}
            </span>
            <span>•</span>
            <span>{localTimeStr}</span>
          </div>
        </div>

        <button
          type="button"
          className={`hero-favorite-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={onToggleFavorite}
          title={isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
        >
          <svg
            viewBox="0 0 24 24"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
        </button>
      </div>

      <div className="hero-body">
        <div className="hero-temp-section">
          <div className="hero-temp-row">
            <span className="hero-temp-number">{toDisplayTemp(current.temperature_2m)}</span>
            <span className="hero-temp-unit">°{unit}</span>
          </div>

          <div className="hero-condition-badge">
            <span>{getWeatherDescription(code)}</span>
          </div>

          <div className="hero-range-pills">
            <div className="range-pill">
              Feels like <strong>{toDisplayTemp(current.apparent_temperature)}°</strong>
            </div>
            <div className="range-pill">
              H: <strong>{highTemp}°</strong> L: <strong>{lowTemp}°</strong>
            </div>
          </div>
        </div>

        <div className="hero-illustration">
          {getWeatherIcon(code, isDay)}
        </div>
      </div>
    </section>
  );
}
