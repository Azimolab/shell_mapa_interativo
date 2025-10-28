import React from 'react';
import LocationPopover from './LocationPopover';
import locationsData from '@/data/locationsData.json';

function RioLocationPopover({ isOpen, anchorEl, onClose, year }) {
  const rioData = locationsData.locations.rio;
  
  // Verificar se há dados específicos para o ano
  const yearSpecific = year && rioData.yearSpecificData && rioData.yearSpecificData[year];
  
  // Montar dados do popover, usando dados específicos do ano quando disponíveis
  const locationData = {
    title: rioData.name,
    badge: rioData.badge,
    image: rioData.image, // Sempre usa a imagem padrão (Rio2025.jpg)
    imageAlt: rioData.imageAlt, // Sempre usa o alt padrão
    width: rioData.width,
    // Se yearSpecific.venture é explicitamente null, não mostrar venture
    // Caso contrário, usar o venture padrão
    venture: yearSpecific ? yearSpecific.venture : rioData.venture
  };

  return (
    <LocationPopover
      isOpen={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      location={locationData}
    />
  );
}

export default RioLocationPopover;

