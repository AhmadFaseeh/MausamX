export const WeatherIcons = {
  clearDay: (
    <svg className="weather-svg sun-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE600" />
          <stop offset="100%" stopColor="#FF8A00" />
        </radialGradient>
        <filter id="sunGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <circle className="sun-body" cx="32" cy="32" r="14" fill="url(#sunGrad)" filter="url(#sunGlow)" />
      <g className="sun-rays" stroke="#FFA726" strokeWidth="3" strokeLinecap="round">
        <line x1="32" y1="6" x2="32" y2="12" />
        <line x1="32" y1="52" x2="32" y2="58" />
        <line x1="6" y1="32" x2="12" y2="32" />
        <line x1="52" y1="32" x2="58" y2="32" />
        <line x1="13.6" y1="13.6" x2="17.8" y2="17.8" />
        <line x1="46.2" y1="46.2" x2="50.4" y2="50.4" />
        <line x1="13.6" y1="50.4" x2="17.8" y2="46.2" />
        <line x1="46.2" y1="17.8" x2="50.4" y2="13.6" />
      </g>
    </svg>
  ),

  clearNight: (
    <svg className="weather-svg moon-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="moonGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFDF0" />
          <stop offset="100%" stopColor="#C5D3E8" />
        </radialGradient>
        <filter id="moonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <path className="moon-body" d="M38 14C24.745 14 14 24.745 14 38c0 7.276 3.25 13.795 8.384 18.17C21.16 54.34 20 51.31 20 48c0-13.255 10.745-24 24-24 3.31 0 6.34 1.16 8.17 2.384C47.795 18.25 41.276 14 38 14z" fill="url(#moonGrad)" filter="url(#moonGlow)" />
      <circle className="star star-1" cx="48" cy="18" r="1.5" fill="#FFFFFF" opacity="0.9" />
      <circle className="star star-2" cx="16" cy="20" r="1.2" fill="#FFFFFF" opacity="0.8" />
      <circle className="star star-3" cx="44" cy="46" r="1" fill="#FFFFFF" opacity="0.7" />
    </svg>
  ),

  partlyCloudyDay: (
    <svg className="weather-svg partly-cloudy-day-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sunGradHalf" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE600" />
          <stop offset="100%" stopColor="#FF9800" />
        </radialGradient>
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#CFD8DC" />
        </linearGradient>
      </defs>
      <circle className="sun-body-small" cx="24" cy="22" r="11" fill="url(#sunGradHalf)" />
      <g className="sun-rays-small" stroke="#FFA726" strokeWidth="2.5" strokeLinecap="round">
        <line x1="24" y1="4" x2="24" y2="8" />
        <line x1="8" y1="22" x2="12" y2="22" />
        <line x1="12.7" y1="10.7" x2="15.5" y2="13.5" />
        <line x1="35.3" y1="10.7" x2="32.5" y2="13.5" />
      </g>
      <path className="cloud-body" d="M46 48H22a10 10 0 0 1-2.2-19.75A14 14 0 0 1 45.2 26 11 11 0 0 1 46 48z" fill="url(#cloudGrad)" />
    </svg>
  ),

  partlyCloudyNight: (
    <svg className="weather-svg partly-cloudy-night-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cloudGradNight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
      <path d="M30 14a11 11 0 0 0 9 10.8A12 12 0 1 1 21.2 12.5C24 12.3 27 12.9 30 14z" fill="#F8FAFC" opacity="0.9" />
      <path className="cloud-body" d="M48 50H24a10 10 0 0 1-2.2-19.75A14 14 0 0 1 47.2 28 11 11 0 0 1 48 50z" fill="url(#cloudGradNight)" />
    </svg>
  ),

  cloudy: (
    <svg className="weather-svg cloudy-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cloudBack" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
        <linearGradient id="cloudFront" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
      <path className="cloud-back" d="M38 38H18a8 8 0 0 1-1.8-15.8A12 12 0 0 1 37.3 19 9 9 0 0 1 38 38z" fill="url(#cloudBack)" opacity="0.75" />
      <path className="cloud-front" d="M48 50H22a11 11 0 0 1-2.4-21.74A15 15 0 0 1 47.1 26 12 12 0 0 1 48 50z" fill="url(#cloudFront)" />
    </svg>
  ),

  rain: (
    <svg className="weather-svg rain-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rainCloud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
      </defs>
      <path className="cloud-body" d="M46 38H20a9 9 0 0 1-2-17.78A13 13 0 0 1 45.3 17 10 10 0 0 1 46 38z" fill="url(#rainCloud)" />
      <g className="rain-drops" stroke="#38BDF8" strokeWidth="2.8" strokeLinecap="round">
        <line className="rain-drop drop-1" x1="22" y1="43" x2="19" y2="52" />
        <line className="rain-drop drop-2" x1="32" y1="43" x2="29" y2="54" />
        <line className="rain-drop drop-3" x1="42" y1="43" x2="39" y2="51" />
      </g>
    </svg>
  ),

  heavyRain: (
    <svg className="weather-svg heavy-rain-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heavyRainCloud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>
      <path className="cloud-body" d="M48 38H20a9 9 0 0 1-2-17.78A13 13 0 0 1 46.3 17 10 10 0 0 1 48 38z" fill="url(#heavyRainCloud)" />
      <g className="rain-drops heavy" stroke="#0284C7" strokeWidth="3" strokeLinecap="round">
        <line className="rain-drop drop-1" x1="20" y1="42" x2="16" y2="54" />
        <line className="rain-drop drop-2" x1="28" y1="43" x2="24" y2="57" />
        <line className="rain-drop drop-3" x1="36" y1="42" x2="32" y2="55" />
        <line className="rain-drop drop-4" x1="44" y1="44" x2="40" y2="56" />
      </g>
    </svg>
  ),

  thunderstorm: (
    <svg className="weather-svg thunder-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="stormCloud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
      </defs>
      <path className="cloud-body" d="M46 36H20a9 9 0 0 1-2-17.78A13 13 0 0 1 45.3 15 10 10 0 0 1 46 36z" fill="url(#stormCloud)" />
      <path className="lightning-bolt" d="M33 34L25 45h8l-3 13 12-16h-8l5-8h-9z" fill="#FACC15" />
      <g stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="43" x2="16" y2="50" />
        <line x1="44" y1="43" x2="42" y2="50" />
      </g>
    </svg>
  ),

  snow: (
    <svg className="weather-svg snow-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="snowCloud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#93C5FD" />
        </linearGradient>
      </defs>
      <path className="cloud-body" d="M46 36H20a9 9 0 0 1-2-17.78A13 13 0 0 1 45.3 15 10 10 0 0 1 46 36z" fill="url(#snowCloud)" />
      <g className="snowflakes" stroke="#BAE6FD" strokeWidth="2.5" strokeLinecap="round">
        <g transform="translate(22, 47) scale(0.65)">
          <line x1="0" y1="-8" x2="0" y2="8" />
          <line x1="-8" y1="0" x2="8" y2="0" />
          <line x1="-5.6" y1="-5.6" x2="5.6" y2="5.6" />
          <line x1="-5.6" y1="5.6" x2="5.6" y2="-5.6" />
        </g>
        <g transform="translate(36, 50) scale(0.75)">
          <line x1="0" y1="-8" x2="0" y2="8" />
          <line x1="-8" y1="0" x2="8" y2="0" />
          <line x1="-5.6" y1="-5.6" x2="5.6" y2="5.6" />
          <line x1="-5.6" y1="5.6" x2="5.6" y2="-5.6" />
        </g>
      </g>
    </svg>
  ),

  fog: (
    <svg className="weather-svg fog-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#CBD5E1" strokeWidth="3.5" strokeLinecap="round">
        <line x1="14" y1="24" x2="50" y2="24" />
        <line x1="18" y1="32" x2="46" y2="32" />
        <line x1="12" y1="40" x2="52" y2="40" />
        <line x1="20" y1="48" x2="44" y2="48" />
      </g>
    </svg>
  )
};

export function getWeatherIcon(code, isDay = 1) {
  if (code === 0) return isDay ? WeatherIcons.clearDay : WeatherIcons.clearNight;
  if (code === 1 || code === 2) return isDay ? WeatherIcons.partlyCloudyDay : WeatherIcons.partlyCloudyNight;
  if (code === 3) return WeatherIcons.cloudy;
  if (code === 45 || code === 48) return WeatherIcons.fog;
  if (code >= 51 && code <= 57) return WeatherIcons.rain;
  if (code >= 61 && code <= 65) return code >= 63 ? WeatherIcons.heavyRain : WeatherIcons.rain;
  if (code === 66 || code === 67 || (code >= 71 && code <= 77) || code === 85 || code === 86) return WeatherIcons.snow;
  if (code >= 80 && code <= 82) return code === 82 ? WeatherIcons.heavyRain : WeatherIcons.rain;
  if (code >= 95 && code <= 99) return WeatherIcons.thunderstorm;
  return isDay ? WeatherIcons.clearDay : WeatherIcons.clearNight;
}

export function getWeatherDescription(code) {
  const descriptions = {
    0: 'Clear Sky',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing Rime Fog',
    51: 'Light Drizzle',
    53: 'Moderate Drizzle',
    55: 'Dense Drizzle',
    56: 'Light Freezing Drizzle',
    57: 'Dense Freezing Drizzle',
    61: 'Slight Rain',
    63: 'Moderate Rain',
    65: 'Heavy Rain',
    66: 'Light Freezing Rain',
    67: 'Heavy Freezing Rain',
    71: 'Slight Snow Fall',
    73: 'Moderate Snow Fall',
    75: 'Heavy Snow Fall',
    77: 'Snow Grains',
    80: 'Slight Rain Showers',
    81: 'Moderate Rain Showers',
    82: 'Violent Rain Showers',
    85: 'Slight Snow Showers',
    86: 'Heavy Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Slight Hail',
    99: 'Thunderstorm with Heavy Hail'
  };
  return descriptions[code] || 'Variable Conditions';
}

export function getWeatherTheme(code, isDay = 1) {
  if (!isDay && (code <= 3 || code === 45 || code === 48)) return 'theme-night';
  if (code === 0 || code === 1) return 'theme-clear-day';
  if (code === 2 || code === 3) return 'theme-cloudy';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'theme-rain';
  if (code >= 95 && code <= 99) return 'theme-thunderstorm';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'theme-snow';
  if (code === 45 || code === 48) return 'theme-fog';
  return isDay ? 'theme-clear-day' : 'theme-night';
}
