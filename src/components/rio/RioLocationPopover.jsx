import React from 'react';
import LocationPopover from './LocationPopover';

import locationsDataBR from '@/data/locationsData.json';
import locationsDataUS from '@/data/locationsDataUs.json';

function RioLocationPopover({ isOpen, anchorEl, onClose, year, language = "POR" }) {

  // ✅ Seleciona o JSON conforme idioma
  const dataSource = language === "ENG" ? locationsDataUS : locationsDataBR;
  const rioData = dataSource.locations.rio;

  // ✅ Mantém a lógica original de ano específico
  const yearSpecific =
    year &&
    rioData.yearSpecificData &&
    rioData.yearSpecificData[year];

  const locationData = {
    title: rioData.name,
    badge: rioData.badge,
    image: rioData.image,
    imageAlt: rioData.imageAlt,
    width: rioData.width,
    // ✅ Se ano tiver venture diferente, usa ele
    venture:
      yearSpecific && yearSpecific.venture !== undefined
        ? yearSpecific.venture
        : rioData.venture
  };

  return (
    <LocationPopover
      isOpen={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      location={locationData}
      language={language} // ✅ Passe adiante também
    />
  );
}

export default RioLocationPopover;
