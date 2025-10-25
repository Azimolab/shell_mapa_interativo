import React, { useState, useEffect } from 'react';
import { getSVGByZoneAndYear } from '../assets/mapas/index.js';
import './SVGMap.css';

/**
 * Aplica regras de visibilidade aos pins dentro de um container DOM
 * @param {HTMLElement} container - Container com o SVG
 * @param {Object} legendItems - Objeto com estado de visibilidade dos itens da legenda
 */
function applyPinVisibilityRules(container, legendItems) {
  // Red pins (exploration)
  const redPinSelectors = [
    '[class*="RedPin"]',
    '[class*="redPin"]', 
    '[class*="red-pin"]',
    '[class*="Exploration"]',
    '[class*="exploration"]',
    '[id*="red"]',
    '[id*="Red"]',
    '[id*="exploration"]',
    '[id*="Exploration"]'
  ];
  
  redPinSelectors.forEach(selector => {
    const pins = container.querySelectorAll(selector);
    pins.forEach(pin => {
      if (pin.closest('svg') && pin.tagName !== 'svg') {
        pin.style.display = legendItems.exploration ? 'block' : 'none';
      }
    });
  });

  // Green pins (production)
  const greenPinSelectors = [
    '[class*="GreenPin"]',
    '[class*="greenPin"]',
    '[class*="green-pin"]',
    '[class*="Production"]',
    '[class*="production"]',
    '[id*="green"]',
    '[id*="Green"]',
    '[id*="production"]',
    '[id*="Production"]'
  ];
  
  greenPinSelectors.forEach(selector => {
    const pins = container.querySelectorAll(selector);
    pins.forEach(pin => {
      if (pin.closest('svg') && pin.tagName !== 'svg') {
        pin.style.display = legendItems.production ? 'block' : 'none';
      }
    });
  });

  // Gray/decommissioning pins
  const grayPinSelectors = [
    '[class*="GrayPin"]',
    '[class*="grayPin"]',
    '[class*="gray-pin"]',
    '[class*="DecommissionPin"]',
    '[class*="Decommission"]',
    '[class*="decommission"]',
    '[id*="gray"]',
    '[id*="Gray"]',
    '[id*="decommission"]',
    '[id*="Decommission"]'
  ];
  
  grayPinSelectors.forEach(selector => {
    const pins = container.querySelectorAll(selector);
    pins.forEach(pin => {
      if (pin.closest('svg') && pin.tagName !== 'svg') {
        pin.style.display = legendItems.decommissioning ? 'block' : 'none';
      }
    });
  });
}

function SVGMap({ selectedYear = '2025', selectedZone = 'rio', activeLegendItems }) {
  const [svgContent, setSvgContent] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    console.log('Carregando SVG para zona:', selectedZone, 'ano:', selectedYear);
    
    let svgText = getSVGByZoneAndYear(selectedZone, selectedYear);
    
    if (!svgText) {
      throw new Error('SVG não encontrado');
    }
    
    // Manipular o SVG para remover width/height fixos e adicionar preserveAspectRatio="none"
    svgText = svgText.replace(
      /<svg([^>]*)>/i,
      (match, attributes) => {
        // Remove width e height atributos fixos
        let newAttrs = attributes
          .replace(/\s*width="[^"]*"/gi, '')
          .replace(/\s*height="[^"]*"/gi, '');
        
        // Adiciona os novos atributos para SVG ocupar toda a tela
        console.log('newAttrs:', newAttrs);
        return `<svg ${newAttrs} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">`;
      }
    );
    
    // Criar container temporário off-screen para pre-processar o SVG
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.visibility = 'hidden';
    tempDiv.innerHTML = svgText;
    document.body.appendChild(tempDiv);
    
    try {
      // Aplicar regras de visibilidade ANTES de exibir
      applyPinVisibilityRules(tempDiv, activeLegendItems);
      
      // Capturar o HTML processado
      const processedSvg = tempDiv.innerHTML;
      
      console.log('SVG carregado e processado com sucesso, tamanho:', processedSvg.length);
      
      // Atualizar o SVG exibido com transição suave
      setSvgContent(processedSvg);
      
      // Pequeno delay para garantir smooth transition
      requestAnimationFrame(() => {
        setIsTransitioning(false);
      });
    } finally {
      // Limpar o container temporário
      document.body.removeChild(tempDiv);
    }
  }, [selectedYear, selectedZone, activeLegendItems]);

  return (
    <div className="svg-map-container fixed inset-0 w-full h-full overflow-hidden z-[1]">
      <div 
        className="svg-map-content w-full h-full [&_svg]:w-full [&_svg]:h-full [&_svg]:block [&_[class*='pin']]:cursor-pointer [&_[class*='Pin']]:cursor-pointer [&_g[class*='pin']]:pointer-events-auto [&_g[class*='Pin']]:pointer-events-auto [&_g[id*='pin']]:pointer-events-auto [&_g[id*='Pin']]:pointer-events-auto"
        style={{
          opacity: isTransitioning ? 0.7 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
}

export default SVGMap;

