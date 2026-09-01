import React from 'react';

const TABS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
  },
  {
    id: 'radar',
    label: 'Live Radar & Maps',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    )
  },
  {
    id: 'airQuality',
    label: 'Air Quality (AQI)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        <path d="M12 12v4" />
        <path d="M10 14h4" />
      </svg>
    )
  },
  {
    id: 'analytics',
    label: 'Analytics & Compare',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )
  },
  {
    id: 'astronomy',
    label: 'Sun & Moon',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14l-1.41 1.41" />
      </svg>
    )
  },
  {
    id: 'saved',
    label: 'Saved Cities',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }
];

export default function Navigation({ activeTab, onTabChange }) {
  return (
    <>
      {/* Desktop Top Navigation Bar */}
      <nav className="desktop-navbar glass-card" aria-label="Main Navigation">
        <div className="nav-tabs-wrapper">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="nav-tab-icon">{tab.icon}</span>
                <span className="nav-tab-label">{tab.label}</span>
                {isActive && <span className="nav-active-pill" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Dock Bar */}
      <nav className="mobile-bottom-dock" aria-label="Mobile Navigation">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`dock-btn ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              title={tab.label}
            >
              <span className="dock-icon">{tab.icon}</span>
              <span className="dock-label">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
