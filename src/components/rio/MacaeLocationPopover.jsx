import React from 'react';
import LocationPopover from './LocationPopover';

import locationsDataBR from '@/data/locationsData.json';
import locationsDataUS from '@/data/locationsDataUs.json';

function MacaeLocationPopover({ isOpen, anchorEl, onClose, language = "POR" }) {

  // ✅ Seleciona JSON conforme o idioma
  const dataSource = language === "ENG" ? locationsDataUS : locationsDataBR;
  const macae = dataSource.locations.macae;

  const locationData = {
    title: macae.name,
    badge: macae.badge,
    image: macae.image,
    imageAlt: macae.imageAlt,
    width: macae.width,
    venture: macae.venture,
    partnershipText: macae.partnershipText
  };

  return (
    <LocationPopover
      isOpen={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      location={locationData}
      language={language} // ✅ passa adiante
    />
  );
}

export default MacaeLocationPopover;
