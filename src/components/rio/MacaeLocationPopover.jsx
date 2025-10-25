import React from 'react';
import LocationPopover from './LocationPopover';
import locationsData from '@/data/locationsData.json';

function MacaeLocationPopover({ isOpen, anchorEl, onClose }) {
  const locationData = {
    title: locationsData.locations.macae.name,
    badge: locationsData.locations.macae.badge,
    image: locationsData.locations.macae.image,
    imageAlt: locationsData.locations.macae.imageAlt,
    width: locationsData.locations.macae.width,
    venture: locationsData.locations.macae.venture,
    partnershipText: locationsData.locations.macae.partnershipText
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


