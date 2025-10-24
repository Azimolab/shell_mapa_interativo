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
  onLanguageChange
}) {
  const [currentSelected, setCurrentSelected] = useState(selectedYear);

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
              // Pause icon
              <>
                <rect x="32" y="24" width="12" height="48" rx="2" fill="var(--grey-400)" />
                <rect x="52" y="24" width="12" height="48" rx="2" fill="var(--grey-400)" />
              </>
            ) : (
              // Play icon
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
          {years.map((year) => (
            <button
              key={year}
              className={`timeline-year-button ${currentSelected === year ? 'selected' : 'inactive'}`}
              onClick={() => handleYearClick(year)}
            >
              {year}
            </button>
          ))}
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
            <svg
              className="timeline-flag-icon"
              width="54"
              height="54"
              viewBox="0 0 54 54"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask id="mask0_68_10647" style={{maskType: 'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="54" height="54">
                <circle cx="27" cy="27" r="27" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_68_10647)">
                <rect width="54" height="54" fill="#008557"/>
                <path d="M27 10.5L49.5 27L27 43.5L4.5 27L27 10.5Z" fill="#FFC600"/>
                <path d="M27.375 37.5C32.9669 37.5 37.5 32.799 37.5 27C37.5 21.201 32.9669 16.5 27.375 16.5C21.7831 16.5 17.25 21.201 17.25 27C17.25 32.799 21.7831 37.5 27.375 37.5Z" fill="#003758"/>
                <path d="M17.4004 25.1819C18.6848 24.8987 20.0145 24.75 21.3742 24.75C27.3252 24.75 32.7009 27.5988 36.2265 32.1004C36.9141 30.8198 37.3507 29.3744 37.4676 27.8357C33.3346 23.6097 27.6495 21 21.3742 21C20.5654 21 19.7664 21.0434 18.9793 21.1279C18.1983 22.3262 17.6497 23.7007 17.4004 25.1819Z" fill="white"/>
              </g>
            </svg>
          </div>
          <div className="timeline-language-text">{language}</div>
        </button>
      </div>
    </div>
  );
}

export default Timeline;
