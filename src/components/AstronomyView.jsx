import React from 'react';

/**
 * Astronomical Moon Phase & Illumination Calculator
 */
function getMoonPhaseData(date = new Date()) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();

  if (month < 3) {
    year--;
    month += 12;
  }

  const a = Math.floor(year / 100);
  const b = Math.floor(a / 4);
  const c = 2 - a + b;
  const e = Math.floor(365.25 * (year + 4716));
  const f = Math.floor(30.6001 * (month + 1));
  const jd = c + day + e + f - 1524.5;

  // Days since known new moon (2000-01-06)
  const daysSinceNew = (jd - 2451549.5) % 29.53058867;
  const phaseIndex = daysSinceNew / 29.53058867;
  const illumination = Math.round((1 - Math.cos(phaseIndex * 2 * Math.PI)) / 2 * 100);

  let phaseName = 'New Moon';
  let phaseDescription = 'The Moon is between Earth and the Sun, its illuminated side facing away from Earth.';
  let daysToFull = Math.round(14.76 - daysSinceNew);
  if (daysToFull < 0) daysToFull += 30;

  if (phaseIndex < 0.03 || phaseIndex > 0.97) {
    phaseName = 'New Moon';
  } else if (phaseIndex < 0.22) {
    phaseName = 'Waxing Crescent';
    phaseDescription = 'A thin sliver of illumination is visible on the right side as the Moon grows.';
  } else if (phaseIndex < 0.28) {
    phaseName = 'First Quarter';
    phaseDescription = 'Half of the Moon surface is illuminated on the right side.';
  } else if (phaseIndex < 0.47) {
    phaseName = 'Waxing Gibbous';
    phaseDescription = 'More than half illuminated, continuing to brighten towards full illumination.';
  } else if (phaseIndex < 0.53) {
    phaseName = 'Full Moon';
    phaseDescription = 'The entire face of the Moon is illuminated by direct sunlight.';
  } else if (phaseIndex < 0.72) {
    phaseName = 'Waning Gibbous';
    phaseDescription = 'The illuminated area is gradually decreasing from the right.';
  } else if (phaseIndex < 0.78) {
    phaseName = 'Last Quarter';
    phaseDescription = 'Half of the Moon surface is illuminated on the left side.';
  } else {
    phaseName = 'Waning Crescent';
    phaseDescription = 'Only a thin curve of illumination remains on the left side before disappearing.';
  }

  return {
    phaseName,
    phaseIndex,
    illumination,
    phaseDescription,
    daysToFull
  };
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

export default function AstronomyView({ city, daily, timezone }) {
  const moon = getMoonPhaseData();

  const sunriseISO = daily?.sunrise?.[0];
  const sunsetISO = daily?.sunset?.[0];
  const sunriseStr = sunriseISO ? formatTime(sunriseISO, timezone) : '--:--';
  const sunsetStr = sunsetISO ? formatTime(sunsetISO, timezone) : '--:--';

  let dayLengthStr = '--:--';
  let solarNoonStr = '--:--';
  let dayProgressPercent = 50;

  if (sunriseISO && sunsetISO) {
    const sr = new Date(sunriseISO);
    const ss = new Date(sunsetISO);
    const now = new Date();

    const diffMs = ss - sr;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    dayLengthStr = `${diffHours}h ${diffMins}m`;

    const solarNoonMs = sr.getTime() + diffMs / 2;
    solarNoonStr = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone || 'UTC'
    }).format(new Date(solarNoonMs));

    const progress = (now - sr) / (ss - sr);
    dayProgressPercent = Math.min(100, Math.max(0, progress * 100));
  }

  return (
    <div className="astronomy-view-container">
      {/* 1. Moon Phase Card */}
      <section className="glass-card astronomy-card">
        <div className="astro-header">
          <div>
            <span className="astro-badge">Lunar Cycle & Orbit</span>
            <h3 className="astro-title">Moon Phase: {moon.phaseName}</h3>
          </div>
          <span className="astro-pill">{moon.illumination}% Illumination</span>
        </div>

        <div className="moon-display-body">
          {/* Visual Moon Simulation */}
          <div className="moon-visual-container">
            <div className="moon-circle-disc">
              <div className="moon-craters-pattern" />
              {/* Shadow Overlay Simulation */}
              <div
                className="moon-shadow-overlay"
                style={{
                  transform: `scaleX(${Math.cos(moon.phaseIndex * 2 * Math.PI)})`
                }}
              />
            </div>
          </div>

          <div className="moon-details-info">
            <p className="moon-description">{moon.phaseDescription}</p>
            <div className="astro-metrics-row">
              <div className="astro-metric-box">
                <span className="astro-m-label">Illumination</span>
                <span className="astro-m-val">{moon.illumination}%</span>
              </div>
              <div className="astro-metric-box">
                <span className="astro-m-label">Days to Full Moon</span>
                <span className="astro-m-val">{moon.daysToFull} days</span>
              </div>
              <div className="astro-metric-box">
                <span className="astro-m-label">Lunar Cycle Age</span>
                <span className="astro-m-val">{(moon.phaseIndex * 29.53).toFixed(1)} d</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Solar & Daylight Progression */}
      <section className="glass-card astronomy-card">
        <div className="astro-header">
          <div>
            <span className="astro-badge">Solar Schedule</span>
            <h3 className="astro-title">Daylight & Sun Position in {city.name}</h3>
          </div>
          <span className="astro-pill">Total: {dayLengthStr}</span>
        </div>

        <div className="daylight-body">
          {/* Daylight Progress Bar */}
          <div className="daylight-bar-container">
            <div className="daylight-bar-track">
              <div className="daylight-bar-fill" style={{ width: `${dayProgressPercent}%` }} />
              <div className="daylight-sun-pointer" style={{ left: `${dayProgressPercent}%` }} />
            </div>
            <div className="daylight-labels">
              <span>Sunrise: {sunriseStr}</span>
              <span>Solar Noon: {solarNoonStr}</span>
              <span>Sunset: {sunsetStr}</span>
            </div>
          </div>

          <div className="sun-stats-grid">
            <div className="sun-stat-card">
              <span className="stat-name">Total Daylight</span>
              <span className="stat-val">{dayLengthStr}</span>
              <span className="stat-sub">From first light to dusk</span>
            </div>
            <div className="sun-stat-card">
              <span className="stat-name">Solar Noon</span>
              <span className="stat-val">{solarNoonStr}</span>
              <span className="stat-sub">Sun reaches highest elevation</span>
            </div>
            <div className="sun-stat-card">
              <span className="stat-name">Daylight Elapsed</span>
              <span className="stat-val">{dayProgressPercent.toFixed(0)}%</span>
              <span className="stat-sub">Sun progression along horizon</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
