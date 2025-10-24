import React, { useState } from 'react';
import './MapOverlay.css';
import RioLocationPopover from './rio/RioLocationPopover';
import MacaeLocationPopover from './rio/MacaeLocationPopover';
import SPLocationPopover from './rio/SPLocationPopover';
import RioExploration1 from './rio/exploration_1';
import RioExploration2 from './rio/exploration_2';
import RioExploration3 from './rio/exploration_3';
import RioProduction1 from './rio/production_1';
import RioProduction2 from './rio/production_2';
import PelotasExploration1 from './pelotas/exploration_1';
import PelotasExploration2 from './pelotas/exploration_2';
import PotiguarExploration1 from './potiguar/exploration_1';
import PotiguarExploration2 from './potiguar/exploration_2';
import BarreirinhasExploration1 from './barreirinhas/exploration_1';
import BarreirinhasExploration2 from './barreirinhas/exploration_2';
import BarreirinhasExploration3 from './barreirinhas/exploration_3';
import mapData from '../data/mapData.json';

function MapOverlay({ selectedZone = 'rio', selectedYear = '2025', activeLegendItems = {} }) {
  const [isRioPopoverOpen, setIsRioPopoverOpen] = useState(false);
  const [isMacaePopoverOpen, setIsMacaePopoverOpen] = useState(false);
  const [isSPPopoverOpen, setIsSPPopoverOpen] = useState(false);
  const [isRioExploration1Open, setIsRioExploration1Open] = useState(false);
  const [isRioExploration2Open, setIsRioExploration2Open] = useState(false);
  const [isRioExploration3Open, setIsRioExploration3Open] = useState(false);
  const [isRioProduction1Open, setIsRioProduction1Open] = useState(false);
  const [isRioProduction2Open, setIsRioProduction2Open] = useState(false);
  const [isPelotasExploration1Open, setIsPelotasExploration1Open] = useState(false);
  const [isPelotasExploration2Open, setIsPelotasExploration2Open] = useState(false);
  const [isPotiguarExploration1Open, setIsPotiguarExploration1Open] = useState(false);
  const [isPotiguarExploration2Open, setIsPotiguarExploration2Open] = useState(false);
  const [isBarreirinhasExploration1Open, setIsBarreirinhasExploration1Open] = useState(false);
  const [isBarreirinhasExploration2Open, setIsBarreirinhasExploration2Open] = useState(false);
  const [isBarreirinhasExploration3Open, setIsBarreirinhasExploration3Open] = useState(false);

  // Return null if no data available for the selected zone/year
  const currentData = mapData[selectedYear]?.[selectedZone] || mapData['2025']?.rio || {};

  // Only show Rio popover when zone is 'rio'
  const showRioPopovers = selectedZone === 'rio';
  // Show Pelotas popovers when zone is 'pelotas'
  const showPelotasPopovers = selectedZone === 'pelotas';
  // Show Potiguar popovers when zone is 'potiguar'
  const showPotiguarPopovers = selectedZone === 'potiguar';
  // Show Barreirinhas popovers when zone is 'barreirinhas'
  const showBarreirinhasPopovers = selectedZone === 'barreirinhas';

  const handlePinClick = (pin, type) => {
    if (selectedZone === 'rio') {
      console.log('Rio pin clicked:', pin.id, type);
      if (type === 'exploration') {
        if (pin.id === 'exp1') {
          setIsRioExploration1Open(true);
        } else if (pin.id === 'exp2') {
          setIsRioExploration2Open(true);
        } else if (pin.id === 'exp3') {
          setIsRioExploration3Open(true);
        }
      } else if (type === 'production') {
        if (pin.id === 'prod1') {
          setIsRioProduction1Open(true);
        } else if (pin.id === 'prod2') {
          setIsRioProduction2Open(true);
        }
      }
    } else if (selectedZone === 'pelotas' && type === 'exploration') {
      console.log('Pelotas pin clicked:', pin.id, pin.number);
      // For Pelotas exploration pins, open specific exploration component based on pin id
      if (pin.id === 'pel_exp1') {
        setIsPelotasExploration1Open(true);
      } else if (pin.id === 'pel_exp2') {
        setIsPelotasExploration2Open(true);
      }
    } else if (selectedZone === 'potiguar' && type === 'exploration') {
      console.log('Potiguar pin clicked:', pin.id, pin.number);
      // For Potiguar exploration pins, open specific exploration component based on pin id
      if (pin.id === 'pot_exp1') {
        setIsPotiguarExploration1Open(true);
      } else if (pin.id === 'pot_exp2') {
        setIsPotiguarExploration2Open(true);
      }
    } else if (selectedZone === 'barreirinhas' && type === 'exploration') {
      console.log('Barreirinhas pin clicked:', pin.id, pin.number);
      // For Barreirinhas exploration pins, open specific exploration component based on pin id
      if (pin.id === 'barr_exp1') {
        setIsBarreirinhasExploration1Open(true);
      } else if (pin.id === 'barr_exp2') {
        setIsBarreirinhasExploration2Open(true);
      } else if (pin.id === 'barr_exp3') {
        setIsBarreirinhasExploration3Open(true);
      }
    }
  };

  const PinComponent = ({ pin, type, visible }) => {
    if (!visible) return null;

    const isClickable = 
      (selectedZone === 'rio' && (type === 'exploration' || type === 'production')) ||
      ((selectedZone === 'pelotas' || selectedZone === 'potiguar' || selectedZone === 'barreirinhas') && type === 'exploration');

    return (
      <div
        className={`map-pin ${type}-pin ${pin.number ? 'numbered-pin' : ''} ${isClickable ? 'clickable' : ''}`}
        style={{
          left: `${pin.x}%`,
          top: `${pin.y}%`,
          transform: 'translate(-50%, -100%)'
        }}
        onClick={isClickable ? () => handlePinClick(pin, type) : undefined}
      >
        <div className={`pin-body ${type}`}>
          {type === 'exploration' && (
            <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
              <path d="M17.9996 31.7887C16.1266 31.7887 14.5333 31.1319 13.2198 29.8184C11.9063 28.5049 11.2496 26.9117 11.2496 25.0387C11.2496 23.1657 11.9063 21.5724 13.2198 20.2589C14.5333 18.9454 16.1266 18.2887 17.9996 18.2887C19.8726 18.2887 21.4658 18.9454 22.7793 20.2589C24.0928 21.5724 24.7496 23.1657 24.7496 25.0387C24.7496 26.9117 24.0928 28.5049 22.7793 29.8184C21.4658 31.1319 19.8726 31.7887 17.9996 31.7887ZM10.5285 17.677L4.0957 11.2158C5.98995 9.44654 8.13233 8.08691 10.5228 7.13691C12.9131 6.18691 15.4053 5.71191 17.9996 5.71191C20.5938 5.71191 23.0861 6.18691 25.4763 7.13691C27.8668 8.08691 30.0092 9.44654 31.9035 11.2158L25.4707 17.677C24.4362 16.729 23.2815 15.9978 22.0065 15.4833C20.7315 14.969 19.3958 14.7119 17.9996 14.7119C16.6033 14.7119 15.2677 14.969 13.9927 15.4833C12.7177 15.9978 11.563 16.729 10.5285 17.677Z" fill="white"/>
            </svg>
          )}
          {type === 'production' && (
            <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
              <path d="M17.9992 31.0498C15.1242 31.0498 12.7305 30.0623 10.818 28.0873C8.90547 26.1123 7.94922 23.6498 7.94922 20.6998C7.94922 18.6498 8.78047 16.3686 10.443 13.8561C12.1055 11.3436 14.6242 8.5748 17.9992 5.5498C21.3742 8.5748 23.893 11.3436 25.5555 13.8561C27.218 16.3686 28.0492 18.6498 28.0492 20.6998C28.0492 23.6498 27.093 26.1123 25.1805 28.0873C23.268 30.0623 20.8742 31.0498 17.9992 31.0498Z" fill="white"/>
            </svg>
          )}
          {type === 'decommissioning' && (
            <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
              <path d="M18 33C14.575 33 11.7188 31.825 9.43125 29.475C7.14375 27.125 6 24.2 6 20.7C6 18.2 6.99375 15.4812 8.98125 12.5437C10.9688 9.60625 13.975 6.425 18 3C22.025 6.425 25.0313 9.60625 27.0188 12.5437C29.0063 15.4812 30 18.2 30 20.7C30 24.2 28.8563 27.125 26.5688 29.475C24.2812 31.825 21.425 33 18 33ZM18 30C20.6 30 22.75 29.1187 24.45 27.3562C26.15 25.5938 27 23.375 27 20.7C27 18.875 26.2438 16.8125 24.7313 14.5125C23.2188 12.2125 20.975 9.7 18 6.975C15.025 9.7 12.7812 12.2125 11.2688 14.5125C9.75625 16.8125 9 18.875 9 20.7C9 23.375 9.85 25.5938 11.55 27.3562C13.25 29.1187 15.4 30 18 30Z" fill="white"/>
              <path d="M7 21H28L27.768 26.134L17.5 31.5L7.5 26.134L7 21Z" fill="white"/>
            </svg>
          )}
          {pin.number && (
            <div className="pin-number">{pin.number}</div>
          )}
        </div>
        <div className="pin-pointer"></div>
      </div>
    );
  };

  const LocationPin = ({ location }) => {
    const handleLocationClick = () => {
      if (location.name === 'Rio de Janeiro') {
        setIsRioPopoverOpen(true);
      } else if (location.name === 'Macaé') {
        setIsMacaePopoverOpen(true);
      } else if (location.name === 'São Paulo') {
        setIsSPPopoverOpen(true);
      }
    };

    const isClickable = location.name === 'Rio de Janeiro' || location.name === 'Macaé' || location.name === 'São Paulo';
    
    // Verifica se o pin está ativo (popover aberto)
    const isActive = 
      (location.name === 'Rio de Janeiro' && isRioPopoverOpen) ||
      (location.name === 'Macaé' && isMacaePopoverOpen) ||
      (location.name === 'São Paulo' && isSPPopoverOpen);

    return (
      <div
        className={`location-pin ${location.type} ${isClickable ? 'clickable' : ''} ${isActive ? 'active' : ''}`}
        style={{
          left: `${location.x}%`,
          top: `${location.y}%`,
          transform: 'translate(-50%, -100%)'
        }}
        onClick={isClickable ? handleLocationClick : undefined}
      >
        <div className="location-content">
          <div className="location-icon">
            {location.type === 'headquarter' ? (
              <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
                <path d="M33.5634 11.7659C31.7296 3.65268 24.6913 0 18.5087 0C18.5087 0 18.5087 0 18.4913 0C12.3262 0 5.27039 3.63512 3.43658 11.7483C1.3932 20.8098 6.91208 28.4839 11.907 33.3132C13.7583 35.1044 16.1335 36 18.5087 36C20.8839 36 23.2592 35.1044 25.093 33.3132C30.0879 28.4839 35.6068 20.8273 33.5634 11.7659ZM18.5087 20.5639C15.4699 20.5639 13.0073 18.0878 13.0073 15.0322C13.0073 11.9766 15.4699 9.50049 18.5087 9.50049C21.5476 9.50049 24.0102 11.9766 24.0102 15.0322C24.0102 18.0878 21.5476 20.5639 18.5087 20.5639Z" fill="#343434"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
                <path d="M17.9996 31.7887C16.1266 31.7887 14.5333 31.1319 13.2198 29.8184C11.9063 28.5049 11.2496 26.9117 11.2496 25.0387C11.2496 23.1657 11.9063 21.5724 13.2198 20.2589C14.5333 18.9454 16.1266 18.2887 17.9996 18.2887C19.8726 18.2887 21.4658 18.9454 22.7793 20.2589C24.0928 21.5724 24.7496 23.1657 24.7496 25.0387C24.7496 26.9117 24.0928 28.5049 22.7793 29.8184C21.4658 31.1319 19.8726 31.7887 17.9996 31.7887ZM10.5285 17.677L4.0957 11.2158C5.98995 9.44654 8.13233 8.08691 10.5228 7.13691C12.9131 6.18691 15.4053 5.71191 17.9996 5.71191C20.5938 5.71191 23.0861 6.18691 25.4763 7.13691C27.8668 8.08691 30.0092 9.44654 31.9035 11.2158L25.4707 17.677C24.4362 16.729 23.2815 15.9978 22.0065 15.4833C20.7315 14.969 19.3958 14.7119 17.9996 14.7119C16.6033 14.7119 15.2677 14.969 13.9927 15.4833C12.7177 15.9978 11.563 16.729 10.5285 17.677Z" fill="#343434"/>
              </svg>
            )}
          </div>
          <div className="location-text">
            <div className="location-name">{location.name}</div>
            {location.type === 'headquarter' && (
              <div className="location-type">HEADQUARTER</div>
            )}
          </div>
        </div>
        <div className="location-pointer"></div>
      </div>
    );
  };

  const PipelineComponent = ({ pipeline }) => (
    <svg 
      className="pipeline-overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    >
      <path
        d={`M ${pipeline.points.map(p => `${p[0]}% ${p[1]}%`).join(' L ')}`}
        stroke={pipeline.type === 'gas' ? '#95C8DC' : '#ED8A00'}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {pipeline.label && (
        <text
          x={`${pipeline.labelPos[0]}%`}
          y={`${pipeline.labelPos[1]}%`}
          className="pipeline-label"
          fill="#003758"
        >
          {pipeline.label}
        </text>
      )}
    </svg>
  );

  const GasLineComponent = ({ gasLine }) => (
    <div 
      className="gas-line-container"
      style={{
        position: 'absolute',
        left: `${Math.min(gasLine.start[0], gasLine.end[0])}%`,
        top: `${Math.min(gasLine.start[1], gasLine.end[1])}%`,
        width: `${Math.abs(gasLine.end[0] - gasLine.start[0])}%`,
        height: `${Math.abs(gasLine.end[1] - gasLine.start[1])}%`
      }}
    >
      <div className="gas-line-label">
        {gasLine.labels.map((label, idx) => (
          <div key={idx} className={idx === 0 ? 'main-label' : 'sub-label'}>
            {label}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="map-overlay">
      {/* Exploration Pins */}
      {currentData.explorationPins?.map(pin => (
        <PinComponent
          key={pin.id}
          pin={pin}
          type="exploration"
          visible={activeLegendItems.exploration !== false}
        />
      ))}

      {/* Production Pins */}
      {currentData.productionPins?.map(pin => (
        <PinComponent
          key={pin.id}
          pin={pin}
          type="production"
          visible={activeLegendItems.production !== false}
        />
      ))}

      {/* Decommissioning Pins */}
      {currentData.decommissioningPins?.map(pin => (
        <PinComponent
          key={pin.id}
          pin={pin}
          type="decommissioning"
          visible={activeLegendItems.decommissioning !== false}
        />
      ))}

      {/* Location Pins */}
      {currentData.locations?.map(location => (
        <LocationPin key={location.id} location={location} />
      ))}

      {/* Pipelines */}
      {currentData.pipelines?.map(pipeline => (
        <PipelineComponent key={pipeline.id} pipeline={pipeline} />
      ))}

      {/* Gas Lines */}
      {currentData.gasLines?.map(gasLine => (
        <GasLineComponent key={gasLine.id} gasLine={gasLine} />
      ))}

      {/* Rio-specific PopOvers - only render for Rio zone */}
      {showRioPopovers && (
        <>
          <RioLocationPopover
            isOpen={isRioPopoverOpen}
            onClose={() => setIsRioPopoverOpen(false)}
            centered
          />

          <MacaeLocationPopover
            isOpen={isMacaePopoverOpen}
            onClose={() => setIsMacaePopoverOpen(false)}
            centered
          />

          <SPLocationPopover
            isOpen={isSPPopoverOpen}
            onClose={() => setIsSPPopoverOpen(false)}
            centered
          />

          <RioExploration1
            isOpen={isRioExploration1Open}
            onClose={() => setIsRioExploration1Open(false)}
          />

          <RioExploration2
            isOpen={isRioExploration2Open}
            onClose={() => setIsRioExploration2Open(false)}
          />

          <RioExploration3
            isOpen={isRioExploration3Open}
            onClose={() => setIsRioExploration3Open(false)}
          />

          <RioProduction1
            isOpen={isRioProduction1Open}
            onClose={() => setIsRioProduction1Open(false)}
          />

          <RioProduction2
            isOpen={isRioProduction2Open}
            onClose={() => setIsRioProduction2Open(false)}
          />
        </>
      )}

      {/* Pelotas-specific Exploration Components - only render for Pelotas zone */}
      {showPelotasPopovers && (
        <>
          <PelotasExploration1
            isOpen={isPelotasExploration1Open}
            onClose={() => setIsPelotasExploration1Open(false)}
          />

          <PelotasExploration2
            isOpen={isPelotasExploration2Open}
            onClose={() => setIsPelotasExploration2Open(false)}
          />
        </>
      )}

      {/* Potiguar-specific Exploration Components - only render for Potiguar zone */}
      {showPotiguarPopovers && (
        <>
          <PotiguarExploration1
            isOpen={isPotiguarExploration1Open}
            onClose={() => setIsPotiguarExploration1Open(false)}
          />

          <PotiguarExploration2
            isOpen={isPotiguarExploration2Open}
            onClose={() => setIsPotiguarExploration2Open(false)}
          />
        </>
      )}

      {/* Barreirinhas-specific Exploration Components - only render for Barreirinhas zone */}
      {showBarreirinhasPopovers && (
        <>
          <BarreirinhasExploration1
            isOpen={isBarreirinhasExploration1Open}
            onClose={() => setIsBarreirinhasExploration1Open(false)}
          />

          <BarreirinhasExploration2
            isOpen={isBarreirinhasExploration2Open}
            onClose={() => setIsBarreirinhasExploration2Open(false)}
          />

          <BarreirinhasExploration3
            isOpen={isBarreirinhasExploration3Open}
            onClose={() => setIsBarreirinhasExploration3Open(false)}
          />
        </>
      )}
    </div>
  );
}

export default MapOverlay;
