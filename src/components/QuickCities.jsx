function getCountryFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const POPULAR_CITIES = [
  { name: 'Karachi', country: 'Pakistan', countryCode: 'PK', latitude: 24.8608, longitude: 67.0104, timezone: 'Asia/Karachi' },
  { name: 'Lahore', country: 'Pakistan', countryCode: 'PK', latitude: 31.5497, longitude: 74.3436, timezone: 'Asia/Karachi' },
  { name: 'Islamabad', country: 'Pakistan', countryCode: 'PK', latitude: 33.6844, longitude: 73.0479, timezone: 'Asia/Karachi' },
  { name: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
  { name: 'London', country: 'United Kingdom', countryCode: 'GB', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { name: 'New York', country: 'United States', countryCode: 'US', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
  { name: 'Tokyo', country: 'Japan', countryCode: 'JP', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'Paris', country: 'France', countryCode: 'FR', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' }
];

export default function QuickCities({ currentCity, onSelectCity }) {
  return (
    <nav className="quick-cities-bar" aria-label="Quick Select Popular Cities">
      {POPULAR_CITIES.map((city) => {
        const isActive = city.name.toLowerCase() === currentCity?.name?.toLowerCase();
        return (
          <button
            key={city.name}
            type="button"
            className={`city-pill ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCity(city)}
          >
            <span>{getCountryFlag(city.countryCode)}</span>
            <span>{city.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
