import React, { useState, useEffect, useCallback } from 'react';
import ThreeWeatherCanvas from './components/ThreeWeatherCanvas';
import Header from './components/Header';
import Navigation from './components/Navigation';
import SearchBar from './components/SearchBar';
import QuickCities from './components/QuickCities';
import WeatherAlerts from './components/WeatherAlerts';
import HeroWeather from './components/HeroWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherMetrics from './components/WeatherMetrics';
import RadarMap from './components/RadarMap';
import AirQualityView from './components/AirQualityView';
import AnalyticsView from './components/AnalyticsView';
import AstronomyView from './components/AstronomyView';
import SavedCitiesView from './components/SavedCitiesView';
import Toast from './components/Toast';
import { getWeatherTheme } from './utils/weatherIcons';

const DEFAULT_CITY = {
  name: 'Karachi',
  country: 'Pakistan',
  countryCode: 'PK',
  latitude: 24.8608,
  longitude: 67.0104,
  timezone: 'Asia/Karachi'
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [unit, setUnit] = useState(() => localStorage.getItem('aura_weather_unit') || 'C');
  const [city, setCity] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_weather_current_city');
      return saved ? JSON.parse(saved) : DEFAULT_CITY;
    } catch {
      return DEFAULT_CITY;
    }
  });

  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_weather_favorites');
      return saved ? JSON.parse(saved) : ['Karachi', 'London', 'Tokyo', 'Dubai'];
    } catch {
      return ['Karachi', 'London', 'Tokyo', 'Dubai'];
    }
  });

  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  }, []);

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    localStorage.setItem('aura_weather_unit', newUnit);
    showToast(`Units switched to °${newUnit}`);
  };

  const toDisplayTemp = useCallback(
    (celsius) => {
      if (celsius == null || isNaN(celsius)) return '--';
      if (unit === 'F') {
        return Math.round((celsius * 9) / 5 + 32);
      }
      return Math.round(celsius);
    },
    [unit]
  );

  // Fetch Weather Forecast
  const fetchWeather = useCallback(async (targetCity) => {
    setLoadingWeather(true);
    try {
      const tzParam = encodeURIComponent(targetCity.timezone || 'auto');
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${targetCity.latitude}&longitude=${targetCity.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=${tzParam}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Forecast API unreachable');
      const data = await res.json();
      setWeatherData(data);
    } catch (err) {
      console.error('Fetch weather error:', err);
      showToast('Could not fetch weather data. Please check connection.');
    } finally {
      setLoadingWeather(false);
    }
  }, [showToast]);

  // Fetch Air Quality Data
  const fetchAirQuality = useCallback(async (targetCity) => {
    try {
      const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${targetCity.latitude}&longitude=${targetCity.longitude}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAirQualityData(data);
      }
    } catch (err) {
      console.warn('Air quality fetch error:', err);
    }
  }, []);

  // Fetch both when city updates
  useEffect(() => {
    fetchWeather(city);
    fetchAirQuality(city);
  }, [city, fetchWeather, fetchAirQuality]);

  const handleSelectCity = (newCity) => {
    setCity(newCity);
    localStorage.setItem('aura_weather_current_city', JSON.stringify(newCity));
    showToast(`Loaded weather for ${newCity.name}`);
  };

  const handleToggleFavorite = () => {
    setFavorites((prev) => {
      const exists = prev.includes(city.name);
      let updated;
      if (exists) {
        updated = prev.filter((name) => name !== city.name);
        showToast(`${city.name} removed from favorites`);
      } else {
        updated = [...prev, city.name];
        showToast(`⭐ ${city.name} added to favorites!`);
      }
      localStorage.setItem('aura_weather_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveFavorite = (name) => {
    setFavorites((prev) => {
      const updated = prev.filter((n) => n !== name);
      localStorage.setItem('aura_weather_favorites', JSON.stringify(updated));
      showToast(`${name} removed from favorites`);
      return updated;
    });
  };

  const handleAddFavorite = (name) => {
    if (favorites.includes(name)) {
      showToast(`${name} is already saved`);
      return;
    }
    setFavorites((prev) => {
      const updated = [...prev, name];
      localStorage.setItem('aura_weather_favorites', JSON.stringify(updated));
      showToast(`⭐ ${name} added to saved locations!`);
      return updated;
    });
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.');
      return;
    }

    setLoadingGeo(true);
    showToast('Detecting current GPS location...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lon.toFixed(2)}&count=1&language=en&format=json`
          );
          let locationName = 'My Location';
          let country = '';
          let countryCode = '';

          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData.results && geoData.results.length > 0) {
              locationName = geoData.results[0].name;
              country = geoData.results[0].country || '';
              countryCode = geoData.results[0].country_code || '';
            }
          }

          const detectedCity = {
            name: locationName,
            country,
            countryCode,
            latitude: lat,
            longitude: lon,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto'
          };
          handleSelectCity(detectedCity);
        } catch {
          handleSelectCity({
            name: 'My Location',
            country: '',
            countryCode: '',
            latitude: lat,
            longitude: lon,
            timezone: 'auto'
          });
        } finally {
          setLoadingGeo(false);
        }
      },
      (err) => {
        setLoadingGeo(false);
        console.warn('Geolocation Error:', err);
        showToast('Location access denied or unavailable.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Determine current atmospheric theme
  const currentConditionCode = weatherData?.current?.weather_code ?? 0;
  const isDay = weatherData?.current?.is_day ?? 1;
  const themeName = getWeatherTheme(currentConditionCode, isDay);

  // Sync body class for CSS gradient styling
  useEffect(() => {
    document.body.className = themeName;
  }, [themeName]);

  const isFav = favorites.includes(city.name);

  return (
    <>
      {/* Three.js 3D WebGL Atmospheric Canvas */}
      <ThreeWeatherCanvas themeName={themeName} />
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />

      {/* Main Glassmorphic Dashboard */}
      <main className="app-container">
        <Header
          unit={unit}
          setUnit={handleUnitChange}
          onDetectLocation={handleDetectLocation}
          loadingGeo={loadingGeo}
        />

        {/* Navigation Bar (Desktop Tabs + Mobile Dock) */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Global Search & Quick Bar */}
        <SearchBar onSelectCity={handleSelectCity} />
        <QuickCities currentCity={city} onSelectCity={handleSelectCity} />

        {/* Smart Weather Alerts */}
        <WeatherAlerts weatherData={weatherData} airQualityData={airQualityData} />

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <>
            <HeroWeather
              city={city}
              current={weatherData?.current}
              daily={weatherData?.daily}
              unit={unit}
              toDisplayTemp={toDisplayTemp}
              isFavorite={isFav}
              onToggleFavorite={handleToggleFavorite}
            />

            <HourlyForecast
              hourly={weatherData?.hourly}
              currentTimeISO={weatherData?.current?.time}
              toDisplayTemp={toDisplayTemp}
            />

            <div className="dashboard-grid">
              <DailyForecast
                daily={weatherData?.daily}
                toDisplayTemp={toDisplayTemp}
              />

              <WeatherMetrics
                current={weatherData?.current}
                daily={weatherData?.daily}
                unit={unit}
                timezone={city.timezone || weatherData?.timezone}
              />
            </div>
          </>
        )}

        {activeTab === 'radar' && (
          <RadarMap
            city={city}
            weatherData={weatherData}
            toDisplayTemp={toDisplayTemp}
            unit={unit}
            onSelectCity={handleSelectCity}
          />
        )}

        {activeTab === 'airQuality' && (
          <AirQualityView
            city={city}
            airQualityData={airQualityData}
            loading={loadingWeather}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            city={city}
            weatherData={weatherData}
            toDisplayTemp={toDisplayTemp}
            unit={unit}
          />
        )}

        {activeTab === 'astronomy' && (
          <AstronomyView
            city={city}
            daily={weatherData?.daily}
            timezone={city.timezone || weatherData?.timezone}
          />
        )}

        {activeTab === 'saved' && (
          <SavedCitiesView
            favorites={favorites}
            currentCity={city}
            onSelectCity={handleSelectCity}
            onRemoveFavorite={handleRemoveFavorite}
            onAddFavorite={handleAddFavorite}
            toDisplayTemp={toDisplayTemp}
            unit={unit}
          />
        )}
      </main>

      <Toast message={toastMsg} isVisible={toastVisible} />
    </>
  );
}
