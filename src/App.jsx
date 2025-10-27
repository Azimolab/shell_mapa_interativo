import React, { useState, useEffect, useRef } from 'react';
import Timeline from './components/Timeline';
import Toolbar from './components/Toolbar';
import SVGMap from './components/SVGMap';
import PinInteractionManager from './components/PinInteractionManager';
import { isSVGAvailable } from './assets/mapas/index.js';

import ShellAllTypeBR from './assets/ShellAllTypeBR.svg';
import ShellAllTypeEN from './assets/ShellAllTypeEN.svg';

function App() {
  const [selectedZone, setSelectedZone] = useState('rio');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [activeLegendItems, setActiveLegendItems] = useState({
    exploration: true,
    production: true,
    development: true,
    decommissioning: true
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState('0.5x');
  const playIntervalRef = useRef(null);

  // ✅ Estado do idioma
  const [language, setLanguage] = useState("POR");

  const years = ['PRÉ 2013', '2013', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];

  const speedToMs = {
    '0.5x': 4000,
    '1x': 2000,
    '1.5x': 1333,
    '2x': 1000
  };

  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setSelectedYear(prevYear => {
          const nextIndex = (years.indexOf(prevYear) + 1) % years.length;
          const nextYear = years[nextIndex];

          if (!isZoneAvailable(selectedZone, nextYear)) {
            setSelectedZone('rio');
          }
          return nextYear;
        });
      }, speedToMs[playSpeed]);

      return () => clearInterval(playIntervalRef.current);
    }
    clearInterval(playIntervalRef.current);
  }, [isPlaying, playSpeed, selectedZone]);

  const isZoneAvailable = (zone, year) => isSVGAvailable(zone, year);
  const isYearAvailable = (year) => isSVGAvailable(selectedZone, year);

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setIsPlaying(false);
    if (!isZoneAvailable(selectedZone, year)) {
      setSelectedZone('rio');
    }
  };

  const handlePlay = () => setIsPlaying(prev => !prev);

  const handleSpeedChange = () => {
    const speeds = ['0.5x', '1x', '1.5x', '2x'];
    const nextIndex = (speeds.indexOf(playSpeed) + 1) % speeds.length;
    setPlaySpeed(speeds[nextIndex]);
  };

  // ✅ Alternar idioma com clique
  const handleLanguageChange = () => {
    setLanguage(prev => prev === "POR" ? "ENG" : "POR");
    setIsPlaying(false);
  };

  const handleAreaSelect = (area) => {
    const zone = area.toLowerCase();
    if (isZoneAvailable(zone, selectedYear)) {
      setSelectedZone(zone);
    }
  };

  const handleLegendToggle = (itemId) => {
    setActiveLegendItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ backgroundColor: '#C0E6EC' }}>
      <div className="relative w-screen h-screen overflow-hidden">

        <SVGMap
          selectedYear={selectedYear}
          selectedZone={selectedZone}
          activeLegendItems={activeLegendItems}
          language={language} // ✅ enviado
        />

        <div className="absolute top-[2vh] left-[2vw] z-20">
         <img
  src={language === "ENG" ? ShellAllTypeEN : ShellAllTypeBR}
  className="h-[20vh] w-auto object-contain"
/>
        </div>

        <PinInteractionManager
          selectedZone={selectedZone}
          selectedYear={selectedYear}
          activeLegendItems={activeLegendItems}
          isPlaying={isPlaying}
          onPauseTimeline={() => setIsPlaying(false)}
          language={language} // ✅ enviado
        />

        <div className="absolute top-[3vh] right-[2vw] z-10 h-[85vh] flex flex-col">
          <Toolbar
            selectedArea={selectedZone}
            selectedYear={selectedYear}
            onAreaSelect={handleAreaSelect}
            onLegendToggle={handleLegendToggle}
            activeLegendItems={activeLegendItems}
            isZoneAvailable={isZoneAvailable}
            language={language} // ✅ enviado
          />
        </div>

        <Timeline
          selectedYear={selectedYear}
          onYearSelect={handleYearSelect}
          onPlay={handlePlay}
          isPlaying={isPlaying}
          speed={playSpeed}
          onSpeedChange={handleSpeedChange}
          language={language} // ✅ enviado
          onLanguageChange={handleLanguageChange} // ✅ alterna idioma
          isYearAvailable={isYearAvailable}
        />

      </div>
    </div>
  );
}

export default App;
