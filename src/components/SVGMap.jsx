import React, { useState, useEffect } from 'react';
import { getSVGByZoneAndYear } from '../assets/mapas/index.js';
import './SVGMap.css';

function SVGMap({ selectedYear = '2025', selectedZone = 'rio', activeLegendItems }) {
  const [svgContent, setSvgContent] = useState('');
  const [nextSvgContent, setNextSvgContent] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
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
    
    console.log('SVG carregado com sucesso, tamanho:', svgText.length);
    
    // Se já existe conteúdo e é diferente, fazer transição
    if (svgContent && svgText !== svgContent) {
      setIsTransitioning(true);
      setNextSvgContent(svgText);
      
      // Após 500ms (metade da animação de 1000ms), trocar os conteúdos
      setTimeout(() => {
        setSvgContent(svgText);
        setIsTransitioning(false);
        setNextSvgContent('');
      }, 500);
    } else {
      // Primeira carga ou mesmo conteúdo
      setSvgContent(svgText);
    }
  }, [selectedYear, selectedZone]);

  // Aplicar visibilidade dos pins baseado nos filtros da legenda
  useEffect(() => {
    if (!svgContent) return;

    // Pequeno delay para garantir que o DOM foi atualizado
    setTimeout(() => {
      // Red pins (exploration) - procurar por elementos com classes que contenham "Red", "red", "exploration", "Exploration"
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
        const pins = document.querySelectorAll(selector);
        pins.forEach(pin => {
          if (pin.closest('svg') && pin.tagName !== 'svg') {
            pin.style.display = activeLegendItems.exploration ? 'block' : 'none';
          }
        });
      });

      // Green pins (production) - procurar por elementos com classes que contenham "Green", "green", "production", "Production"
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
        const pins = document.querySelectorAll(selector);
        pins.forEach(pin => {
          if (pin.closest('svg') && pin.tagName !== 'svg') {
            pin.style.display = activeLegendItems.production ? 'block' : 'none';
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
        const pins = document.querySelectorAll(selector);
        pins.forEach(pin => {
          if (pin.closest('svg') && pin.tagName !== 'svg') {
            pin.style.display = activeLegendItems.decommissioning ? 'block' : 'none';
          }
        });
      });
    }, 100);
  }, [svgContent, activeLegendItems]);

  return (
    <div className="svg-map-container fixed inset-0 w-full h-full overflow-hidden z-[1]">
      {isTransitioning ? (
        // Renderizar dois mapas durante a transição
        <div className="svg-transition-container">
          {/* Mapa atual (fade-out) */}
          <div className="svg-transition-layer svg-map-fade-out">
            <div 
              className="svg-map-content w-full h-full [&_svg]:w-full [&_svg]:h-full [&_svg]:block [&_[class*='pin']]:cursor-pointer [&_[class*='Pin']]:cursor-pointer [&_g[class*='pin']]:pointer-events-auto [&_g[class*='Pin']]:pointer-events-auto [&_g[id*='pin']]:pointer-events-auto [&_g[id*='Pin']]:pointer-events-auto"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          </div>
          {/* Próximo mapa (fade-in) */}
          <div className="svg-transition-layer svg-map-fade-in">
            <div 
              className="svg-map-content w-full h-full [&_svg]:w-full [&_svg]:h-full [&_svg]:block [&_[class*='pin']]:cursor-pointer [&_[class*='Pin']]:cursor-pointer [&_g[class*='pin']]:pointer-events-auto [&_g[class*='Pin']]:pointer-events-auto [&_g[id*='pin']]:pointer-events-auto [&_g[id*='Pin']]:pointer-events-auto"
              dangerouslySetInnerHTML={{ __html: nextSvgContent }}
            />
          </div>
        </div>
      ) : (
        // Renderizar apenas o mapa atual (sem transição)
        <div 
          className="svg-map-content w-full h-full [&_svg]:w-full [&_svg]:h-full [&_svg]:block [&_[class*='pin']]:cursor-pointer [&_[class*='Pin']]:cursor-pointer [&_g[class*='pin']]:pointer-events-auto [&_g[class*='Pin']]:pointer-events-auto [&_g[id*='pin']]:pointer-events-auto [&_g[id*='Pin']]:pointer-events-auto"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )}
    </div>
  );
}

export default SVGMap;

