import React from 'react';
import LocationPopover from './LocationPopover';
import locationsData from '@/data/locationsData.json';

function RioLocationPopover({ isOpen, anchorEl, onClose }) {
  const locationData = {
    title: locationsData.locations.rio.name,
    badge: locationsData.locations.rio.badge,
    image: locationsData.locations.rio.image,
    imageAlt: locationsData.locations.rio.imageAlt,
    width: locationsData.locations.rio.width,
    venture: locationsData.locations.rio.venture
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

