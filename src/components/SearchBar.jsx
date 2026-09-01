import { useState, useEffect, useRef } from 'react';

function getCountryFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

export default function SearchBar({ onSelectCity }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      setIsOpen(true);
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`
        );
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(debounceRef.current);
  }, [query]);
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleSelect = (item) => {
    onSelectCity({
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto'
    });
    setQuery('');
    setIsOpen(false);
  };

  return (
    <section className="search-container" ref={containerRef} aria-label="City Search">
      <div className="search-box">
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          type="text"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city, province, or country (e.g. Karachi, London, Tokyo)..."
          autoComplete="off"
          spellCheck="false"
        />

        {query.length > 0 && (
          <button
            type="button"
            className="search-clear-btn visible"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            title="Clear Search"
          >
            &times;
          </button>
        )}
      </div>

      {isOpen && (
        <div className="search-dropdown open" role="listbox">
          {isLoading && <div className="dropdown-loading">Searching cities...</div>}
          {!isLoading && results.length === 0 && (
            <div className="dropdown-empty">No cities found matching "{query}"</div>
          )}
          {!isLoading &&
            results.map((item) => {
              const flag = getCountryFlag(item.country_code);
              const region = [item.admin1, item.country].filter(Boolean).join(', ');
              return (
                <div
                  key={`${item.id}-${item.latitude}-${item.longitude}`}
                  className="dropdown-item"
                  onClick={() => handleSelect(item)}
                >
                  <div className="dropdown-item-left">
                    <span className="item-flag">{flag}</span>
                    <div>
                      <div className="item-name">{item.name}</div>
                      <div className="item-details">{region}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                    {item.latitude.toFixed(1)}°, {item.longitude.toFixed(1)}°
                  </span>
                </div>
              );
            })}
        </div>
      )}
    </section>
  );
}
