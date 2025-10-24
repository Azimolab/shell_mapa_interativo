import React, { useState } from 'react';
import ResponsiveToolbar from './components/ResponsiveToolbar';
import './ResponsiveToolbarDemo.css';

function ResponsiveToolbarDemo() {
  const [selectedArea, setSelectedArea] = useState('rio');
  const [activeLegendItems, setActiveLegendItems] = useState({
    decommissioning: true,
    production: true,
    development: true,
    exploration: true
  });

  const handleAreaSelect = (areaId) => {
    setSelectedArea(areaId);
    console.log('Selected area:', areaId);
  };

  const handleLegendToggle = (itemId) => {
    setActiveLegendItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
    console.log('Toggled legend item:', itemId);
  };

  return (
    <div className="demo-container">
      <div className="demo-header">
        <h1>Responsive Toolbar Component</h1>
        <p>This component is fully responsive and adapts to different screen sizes.</p>
        <p>Maximum height: 850px with scrolling when needed.</p>
      </div>
      
      <div className="demo-content">
        <div className="toolbar-wrapper">
          <ResponsiveToolbar
            selectedArea={selectedArea}
            onAreaSelect={handleAreaSelect}
            onLegendToggle={handleLegendToggle}
            activeLegendItems={activeLegendItems}
          />
        </div>
        
        <div className="demo-info">
          <h3>Current State:</h3>
          <div className="state-info">
            <p><strong>Selected Area:</strong> {selectedArea}</p>
            <p><strong>Active Legend Items:</strong></p>
            <ul>
              {Object.entries(activeLegendItems).map(([key, value]) => (
                <li key={key}>
                  {key}: {value ? '✅' : '❌'}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="responsive-info">
            <h4>Responsive Features:</h4>
            <ul>
              <li>Adapts to all screen sizes (360px to desktop)</li>
              <li>Maintains aspect ratios and proportions</li>
              <li>Interactive legend items with visibility toggles</li>
              <li>Smooth animations and hover effects</li>
              <li>Maximum height constraint with scroll</li>
              <li>Optimized padding and margins for each breakpoint</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResponsiveToolbarDemo;
