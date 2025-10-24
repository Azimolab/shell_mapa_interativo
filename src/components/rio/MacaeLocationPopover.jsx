import React from 'react';
import LocationPopover from './LocationPopover';
import pinData from '@/data/pinData.json';

function MacaeLocationPopover({ isOpen, anchorEl, onClose }) {
  const locationData = {
    title: pinData.locations.macae.name,
    badge: pinData.locations.macae.badge,
    image: pinData.locations.macae.image,
    imageAlt: pinData.locations.macae.imageAlt,
    width: pinData.locations.macae.width,
    venture: pinData.locations.macae.venture,
    partnershipText: pinData.locations.macae.partnershipText
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

export default MacaeLocationPopover;


