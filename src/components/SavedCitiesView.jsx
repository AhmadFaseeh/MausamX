import React, { useState, useEffect } from 'react';
import { getWeatherIcon, getWeatherDescription } from '../utils/weatherIcons';

export default function SavedCitiesView({
  favorites,
  currentCity,
  onSelectCity,
  onRemoveFavorite,
  onAddFavorite,
  toDisplayTemp,
  unit
}) {
  const [citySnapshots, setCitySnapshots] = useState({});
  const [searchNew, setSearchNew] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Fetch weather snapshots for all saved cities
  useEffect(() => {
    favorites.forEach((cityName) => {
      // Fetch coordinates for city if not in cache
      fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.results && data.results[0]) {
            const loc = data.results[0];
            return fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
            )
              .then((wRes) => wRes.json())
              .then((wData) => {
                setCitySnapshots((prev) => ({
                  ...prev,
                  [cityName]: {
                    ...loc,
                    weather: wData
                  }
                }));
              });
          }
        })
        .catch((err) => console.warn('Saved city snapshot error:', err));
    });
  }, [favorites]);

  const handleSearch = async (val) => {
    setSearchNew(val);
    if (val.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(val.trim())}&count=4&language=en&format=json`
      );
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch {
      setSearchResults([]);
    }
  };

  return (
    <div className="saved-cities-container">
      {/* Top Bar with Add Favorite Input */}
      <section className="glass-card saved-header-card">
        <div>
          <h2 className="saved-title">Saved Locations</h2>
          <span className="saved-subtitle">Manage and monitor your bookmarked global cities</span>
        </div>

        <div className="add-city-box">
          <input
            type="text"
            className="add-city-input"
            placeholder="Add new city to favorites..."
            value={searchNew}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div className="add-city-dropdown">
              {searchResults.map((item) => (
                <div
                  key={`${item.id}-${item.latitude}`}
                  className="add-city-item"
                  onClick={() => {
                    onAddFavorite(item.name);
                    setSearchNew('');
                    setSearchResults([]);
                  }}
                >
                  <span>{item.name}, {item.country}</span>
                  <span className="add-city-plus">+ Add</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Grid of Saved City Cards */}
      <div className="saved-cards-grid">
        {favorites.map((cityName) => {
          const snapshot = citySnapshots[cityName];
          const isCurrent = cityName.toLowerCase() === currentCity?.name?.toLowerCase();
          const currentW = snapshot?.weather?.current;
          const dailyW = snapshot?.weather?.daily;

          const temp = currentW ? toDisplayTemp(currentW.temperature_2m) : '--';
          const code = currentW?.weather_code ?? 0;
          const isDay = currentW?.is_day ?? 1;
          const high = dailyW?.temperature_2m_max?.[0] != null ? toDisplayTemp(dailyW.temperature_2m_max[0]) : '--';
          const low = dailyW?.temperature_2m_min?.[0] != null ? toDisplayTemp(dailyW.temperature_2m_min[0]) : '--';

          return (
            <div
              key={cityName}
              className={`glass-card saved-city-card ${isCurrent ? 'current-active' : ''}`}
            >
              <div className="saved-card-top">
                <div>
                  <h3 className="saved-card-name">{cityName}</h3>
                  <span className="saved-card-country">{snapshot?.country || 'Saved Location'}</span>
                </div>

                <button
                  type="button"
                  className="saved-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(cityName);
                  }}
                  title="Remove from saved"
                >
                  &times;
                </button>
              </div>

              <div className="saved-card-middle">
                <div className="saved-temp-box">
                  <span className="saved-temp-val">{temp}°{unit}</span>
                  <span className="saved-condition-desc">{getWeatherDescription(code)}</span>
                </div>

                <div className="saved-icon-box">
                  {getWeatherIcon(code, isDay)}
                </div>
              </div>

              <div className="saved-card-bottom">
                <span className="saved-range">H: {high}° L: {low}°</span>
                <button
                  type="button"
                  className="saved-switch-btn"
                  onClick={() => {
                    if (snapshot) {
                      onSelectCity({
                        name: snapshot.name,
                        country: snapshot.country,
                        countryCode: snapshot.country_code,
                        latitude: snapshot.latitude,
                        longitude: snapshot.longitude,
                        timezone: snapshot.timezone || 'auto'
                      });
                    }
                  }}
                >
                  {isCurrent ? 'Viewing Now' : 'Select City'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
