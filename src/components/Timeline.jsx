import React, { useState, useEffect } from 'react';
import './Timeline.css';

function Timeline({
  years = ['PRÉ 2013', '2013', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
  selectedYear = '2025',
  onYearSelect,
  onPlay,
  isPlaying = false,
  onSpeedChange,
  speed = '0.5x',
  language = 'POR',
  onLanguageChange,
  isYearAvailable = () => true
}) {
  const [currentSelected, setCurrentSelected] = useState(selectedYear);

  // —————— 👇 ADIÇÃO: dois ícones inline simples ——————
  const BRFlagIcon = () => (
    <svg
      className="timeline-flag-icon"
      width="54"
      height="54"
      viewBox="0 0 54 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Português (Brasil)"
    >
      <mask id="br_mask" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="54" height="54">
        <circle cx="27" cy="27" r="27" fill="#D9D9D9" />
      </mask>
      <g mask="url(#br_mask)">
        <rect width="54" height="54" fill="#008557" />
        <path d="M27 10.5L49.5 27L27 43.5L4.5 27L27 10.5Z" fill="#FFC600" />
        <circle cx="27.375" cy="27" r="10.5" fill="#003758" />
        <path d="M17.4 25.182C18.685 24.899 20.014 24.75 21.374 24.75C27.325 24.75 32.701 27.599 36.227 32.1C36.914 30.82 37.351 29.374 37.468 27.836C33.335 23.61 27.65 21 21.374 21C20.565 21 19.766 21.043 18.979 21.128C18.198 22.326 17.65 23.701 17.4 25.182Z" fill="white" />
      </g>
    </svg>
  );

  const USFlagIcon = () => (
    <svg
      className="timeline-flag-icon"
      width="54"
      height="54"
      viewBox="0 0 54 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="English (US)"
    >
      <mask id="us_mask" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="54" height="54">
        <circle cx="27" cy="27" r="27" fill="#D9D9D9" />
      </mask>
      <g mask="url(#us_mask)">
        {/* listras */}
        <rect width="54" height="54" fill="#B22234" />
        <g>
          <rect y="4" width="54" height="4" fill="#FFF" />
          <rect y="12" width="54" height="4" fill="#FFF" />
          <rect y="20" width="54" height="4" fill="#FFF" />
          <rect y="28" width="54" height="4" fill="#FFF" />
          <rect y="36" width="54" height="4" fill="#FFF" />
          <rect y="44" width="54" height="4" fill="#FFF" />
        </g>
        {/* canton */}
        <rect width="24" height="24" fill="#3C3B6E" />
        {/* estrelas estilizadas simples */}
        <g fill="#FFF">
          <circle cx="3" cy="3" r="1" />
          <circle cx="7" cy="3" r="1" />
          <circle cx="11" cy="3" r="1" />
          <circle cx="15" cy="3" r="1" />
          <circle cx="19" cy="3" r="1" />

          <circle cx="5" cy="7" r="1" />
          <circle cx="9" cy="7" r="1" />
          <circle cx="13" cy="7" r="1" />
          <circle cx="17" cy="7" r="1" />
          <circle cx="21" cy="7" r="1" />

          <circle cx="3" cy="11" r="1" />
          <circle cx="7" cy="11" r="1" />
          <circle cx="11" cy="11" r="1" />
          <circle cx="15" cy="11" r="1" />
          <circle cx="19" cy="11" r="1" />

          <circle cx="5" cy="15" r="1" />
          <circle cx="9" cy="15" r="1" />
          <circle cx="13" cy="15" r="1" />
          <circle cx="17" cy="15" r="1" />
          <circle cx="21" cy="15" r="1" />

          <circle cx="3" cy="19" r="1" />
          <circle cx="7" cy="19" r="1" />
          <circle cx="11" cy="19" r="1" />
          <circle cx="15" cy="19" r="1" />
          <circle cx="19" cy="19" r="1" />
        </g>
      </g>
    </svg>
  );
  // —————— 👆 ADIÇÃO FIM ——————

  // Update local state when selectedYear prop changes
  useEffect(() => {
    setCurrentSelected(selectedYear);
  }, [selectedYear]);

  const handleYearClick = (year) => {
    setCurrentSelected(year);
    onYearSelect?.(year);
  };

  const handlePlayClick = () => {
    onPlay?.();
  };

  const handleSpeedClick = () => {
    onSpeedChange?.();
  };

  const handleLanguageClick = () => {
    onLanguageChange?.(language);
  };

  return (
    <div className="timeline-wrapper-main">
      <div className="timeline-container">
        <div className="timeline-play-section">
          <button className="timeline-play-button" onClick={handlePlayClick}>
            <svg
              className="timeline-play-icon"
              width="96"
              height="96"
              viewBox="0 0 96 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isPlaying ? (
                <>
                  <rect x="32" y="24" width="12" height="48" rx="2" fill="var(--grey-400)" />
                  <rect x="52" y="24" width="12" height="48" rx="2" fill="var(--grey-400)" />
                </>
              ) : (
                <path
                  d="M32 68.6998V27.2998C32 26.1665 32.4 25.2165 33.2 24.4498C34 23.6831 34.9333 23.2998 36 23.2998C36.3333 23.2998 36.6833 23.3498 37.05 23.4498C37.4167 23.5498 37.7667 23.6998 38.1 23.8998L70.7 44.5998C71.3 44.9998 71.75 45.4998 72.05 46.0998C72.35 46.6998 72.5 47.3331 72.5 47.9998C72.5 48.6665 72.35 49.2998 72.05 49.8998C71.75 50.4998 71.3 50.9998 70.7 51.3998L38.1 72.0998C37.7667 72.2998 37.4167 72.4498 37.05 72.5498C36.6833 72.6498 36.3333 72.6998 36 72.6998C34.9333 72.6998 34 72.3165 33.2 71.5498C32.4 70.7831 32 69.8331 32 68.6998Z"
                  fill="var(--grey-400)"
                />
              )}
            </svg>
          </button>
        </div>

        <div className="timeline-years-section">
          <div className="timeline-years-wrapper">
            {years.map((year) => {
              const available = isYearAvailable(year);
              return (
                <button
                  key={year}
                  className={`timeline-year-button ${currentSelected === year ? 'selected' : 'inactive'} ${!available ? 'disabled' : ''}`}
                  onClick={() => handleYearClick(year)}
                  disabled={!available}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>

        <div className="timeline-speed-section">
          <button className="timeline-speed-button" onClick={handleSpeedClick}>
            {speed}
          </button>
        </div>
      </div>

      <div className="timeline-language-section">
        <button className="timeline-language-button" onClick={handleLanguageClick}>
          <div className="timeline-flag-container">
            {/* —————— 👇 TROCA CONDICIONAL DA BANDEIRA —————— */}
            {language === 'ENG' ? <USFlagIcon /> : <BRFlagIcon />}
            {/* —————— 👆 TROCA CONDICIONAL DA BANDEIRA —————— */}
          </div>
          <div className="timeline-language-text">{language}</div>
        </button>
      </div>
    </div>
  );
}

export default Timeline;
