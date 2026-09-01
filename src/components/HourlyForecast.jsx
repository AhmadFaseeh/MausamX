import React, { useRef, useState, useEffect, useCallback } from 'react';
import { getWeatherIcon } from '../utils/weatherIcons';

export default function HourlyForecast({ hourly, currentTimeISO, toDisplayTemp }) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Hook 1: scroll check callback
  const checkScrollability = useCallback(() => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  // Hook 2: attach listener (ALWAYS called at top level)
  useEffect(() => {
    const el = trackRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollability);
      checkScrollability();
      return () => el.removeEventListener('scroll', checkScrollability);
    }
  }, [checkScrollability, hourly]);

  // Safe Guard: Check data AFTER all hooks
  if (!hourly || !hourly.time || !Array.isArray(hourly.time)) {
    return null;
  }

  let startIndex = 0;
  if (currentTimeISO) {
    for (let i = 0; i < hourly.time.length; i++) {
      if (hourly.time[i] >= currentTimeISO) {
        startIndex = i;
        break;
      }
    }
  }

  const hoursToShow = hourly.time.slice(startIndex, startIndex + 24);

  const handleScroll = (direction) => {
    if (!trackRef.current) return;
    const scrollAmount = 260;
    trackRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="glass-card hourly-section" aria-label="Hourly Forecast">
      {/* Header with Title & Left/Right Arrow Icons */}
      <div className="hourly-header-row">
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
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          24-Hour Forecast
        </h3>

        {/* Carousel Arrow Controls */}
        <div className="carousel-nav-arrows">
          <button
            type="button"
            className={`carousel-arrow-btn ${!canScrollLeft ? 'disabled' : ''}`}
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll Left"
            title="Scroll hours left"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            className={`carousel-arrow-btn ${!canScrollRight ? 'disabled' : ''}`}
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll Right"
            title="Scroll hours right"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Relative Carousel Track */}
      <div className="hourly-carousel-wrapper">
        <div className="hourly-track" ref={trackRef}>
          {hoursToShow.map((isoTime, idx) => {
            const arrayIndex = startIndex + idx;
            const temp = hourly.temperature_2m?.[arrayIndex];
            const wCode = hourly.weather_code?.[arrayIndex] ?? 0;
            const pop = hourly.precipitation_probability ? hourly.precipitation_probability[arrayIndex] : 0;

            const timePart = isoTime.includes('T') ? isoTime.split('T')[1] : '';
            const hourNum = parseInt(timePart.split(':')[0] || '12', 10);
            const hourIsDay = hourNum >= 6 && hourNum < 19 ? 1 : 0;

            let displayTime = 'Now';
            if (idx !== 0) {
              try {
                const date = new Date(isoTime);
                displayTime = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
              } catch {
                displayTime = `${hourNum}:00`;
              }
            }

            return (
              <div key={isoTime} className={`hourly-card ${idx === 0 ? 'active-now' : ''}`}>
                <span className="hourly-time">{displayTime}</span>
                <div className="hourly-icon">{getWeatherIcon(wCode, hourIsDay)}</div>
                <span className="hourly-temp">{toDisplayTemp(temp)}°</span>
                {pop > 10 ? (
                  <span className="hourly-pop" title="Precipitation Chance">
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '10px', height: '10px' }}>
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    {pop}%
                  </span>
                ) : (
                  <span style={{ height: '14px' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
