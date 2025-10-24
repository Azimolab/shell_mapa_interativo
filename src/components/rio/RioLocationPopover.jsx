import React from 'react';
import LocationPopover from './LocationPopover';
import pinData from '@/data/pinData.json';

function RioLocationPopover({ isOpen, anchorEl, onClose }) {
  const locationData = {
    title: pinData.locations.rio.name,
    badge: pinData.locations.rio.badge,
    image: pinData.locations.rio.image,
    imageAlt: pinData.locations.rio.imageAlt,
    width: pinData.locations.rio.width,
    venture: pinData.locations.rio.venture
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

