import React, { useEffect, useState, useCallback } from 'react';
import RioLocationPopover from './rio/RioLocationPopover';
import SPLocationPopover from './rio/SPLocationPopover';
import MacaeLocationPopover from './rio/MacaeLocationPopover';
import PopoverPins from './popovers/PopoverPins';
import mapData from '../data/mapData.json';

/**
 * Componente responsável por gerenciar as interações com os pins do SVG
 * e abrir os popovers correspondentes
 */
function PinInteractionManager({ selectedYear, selectedZone, activeLegendItems, isPlaying, onPauseTimeline }) {
  
  /**
   * Busca um pin em mapData.json pela estrutura hierárquica ano/zona/tipo
   * @param {string} pinId - ID do pin a ser buscado (ex: 'exp1', 'prod2')
   * @param {string} year - Ano selecionado (ex: '2013', '2020')
   * @param {string} zone - Zona selecionada (ex: 'rio', 'barreirinhas')
   * @returns {Object|null} - Dados do pin ou null se não encontrado
   */
  const findPinInMapData = useCallback((pinId, year, zone) => {
    if (!mapData[year] || !mapData[year][zone]) return null;
    
    const regionData = mapData[year][zone];
    const pinArrays = [
      regionData.explorationPins || [],
      regionData.productionPins || [],
      regionData.decommissioningPins || []
    ];
    
    for (const array of pinArrays) {
      const pin = array.find(p => p.id === pinId);
      if (pin) return pin;
    }
    
    return null;
  }, []);
  const [activePopover, setActivePopover] = useState(null);
  const [popoverData, setPopoverData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // Declarar handlePinClick primeiro
  const handlePinClick = useCallback((event) => {
    event.stopPropagation();
    
    const element = event.currentTarget;
    let pinId = element.id || element.getAttribute('data-pin-id');
    const pinClass = element.className?.baseVal || element.className;
    
    console.log('🔴 PIN CLICKED:', { pinId, pinClass, element });
    
    // Se a timeline está tocando, pausá-la quando um pin for clicado
    const wasPlaying = isPlaying;
    if (isPlaying && onPauseTimeline) {
      console.log('⏸️ Pausando timeline devido ao clique no pin');
      onPauseTimeline();
    }

    // Função para processar o pin e abrir o popover
    const processPin = (targetElement) => {
      // Armazenar o elemento clicado como âncora para o popover
      setAnchorEl(targetElement);
      
      // Tentar mapear ID do SVG para ID do JSON
      let mappedId = mapSvgIdToJsonId(pinId, pinClass);
      
      console.log('Mapped ID:', mappedId);

      // Buscar dados do pin no mapData.json usando a estrutura hierárquica
      let pinData = null;
      
      // Tentar buscar com ID mapeado
      pinData = findPinInMapData(mappedId, selectedYear, selectedZone);
      
      // Se não encontrou, tentar com ID original limpo
      if (!pinData) {
        let cleanId = pinId.replace(/^(pin_|pin-|location_|location-)/i, '');
        pinData = findPinInMapData(cleanId, selectedYear, selectedZone);
      }
      
      console.log('Search results:', {
        mappedId,
        year: selectedYear,
        zone: selectedZone,
        foundPin: !!pinData,
        pinData
      });
      
      if (pinData) {
        console.log('✅ Pin data found:', pinData);
        console.log('📋 Setting activePopover to:', pinData.popoverType);
        setPopoverData(pinData);
        setActivePopover(pinData.popoverType);
      } else {
        console.warn('⚠️ No data found for pin:', pinId, 'mapped to:', mappedId);
        console.warn('📦 Context:', { year: selectedYear, zone: selectedZone });
        
        // Fallback: mostrar popover genérico baseado no tipo
        const genericType = identifyGenericType(pinId, pinClass);
        if (genericType) {
          console.log('🔄 Using generic type:', genericType);
          setPopoverData(genericType);
          setActivePopover(genericType.popoverType);
        }
      }
    };

    // Se estava tocando, aguardar um pouco para o SVG estabilizar
    if (wasPlaying) {
      console.log('⏳ Timeline foi pausada, aguardando SVG estabilizar...');
      setTimeout(() => {
        // Re-buscar o elemento pelo ID para garantir que temos a referência correta
        // Considerar múltiplos containers durante transição
        const svgContainers = document.querySelectorAll('.svg-map-content');
        
        if (svgContainers.length > 0 && pinId) {
          // Pegar o container correto (z-index 2 se houver múltiplos)
          let targetContainer = svgContainers[svgContainers.length - 1];
          if (svgContainers.length > 1) {
            for (const container of svgContainers) {
              const parent = container.parentElement;
              if (parent && getComputedStyle(parent).zIndex === '2') {
                targetContainer = container;
                break;
              }
            }
          }
          
          const svgElement = targetContainer.querySelector('svg');
          if (svgElement) {
            const freshElement = svgElement.querySelector(`#${CSS.escape(pinId)}`);
            if (freshElement) {
              console.log('✅ Elemento re-encontrado após pausa da timeline');
              processPin(freshElement);
            } else {
              console.warn('⚠️ Elemento não encontrado, usando elemento original');
              processPin(element);
            }
          } else {
            processPin(element);
          }
        } else {
          processPin(element);
        }
      }, 150); // 1300ms para aguardar a transição do SVGMap (1000ms) + margem
    } else {
      // Timeline já estava pausada, processar imediatamente
      processPin(element);
    }
  }, [isPlaying, onPauseTimeline, findPinInMapData, selectedYear, selectedZone]);

  const setupPinListeners = useCallback(() => {
    // IMPORTANTE: Há dois .svg-map-content durante a transição (fade-in e fade-out)
    // Precisamos pegar o SVG correto (z-index 2, o que está fazendo fade-in)
    const svgContainers = document.querySelectorAll('.svg-map-content');
    
    if (svgContainers.length === 0) {
      console.warn('⚠️ Nenhum container SVG encontrado');
      return;
    }
    
    // Se há múltiplos containers (durante transição), pegar o com z-index maior (o novo)
    let targetContainer = svgContainers[0];
    if (svgContainers.length > 1) {
      // Pegar o container cujo pai tem z-index 2
      for (const container of svgContainers) {
        const parent = container.parentElement;
        if (parent && getComputedStyle(parent).zIndex === '2') {
          targetContainer = container;
          console.log('🎯 Usando SVG com z-index 2 (novo SVG)');
          break;
        }
      }
    }
    
    const svgElement = targetContainer.querySelector('svg');
    if (!svgElement) {
      console.warn('⚠️ SVG element not found for pin listeners.');
      return;
    }

    // Seleção específica: apenas grupos principais de pins
    // Evita selecionar elementos filhos dentro dos grupos
    const selectors = [
      'g[id^="Pin_"]',           // LocationPins: Pin_Rio, Pin_SP, Pin_Macae etc.
      'g[id^="GreenPin"]',       // Production pins: GreenPin_1, GreenPin_2, etc.
      'g[id^="RedPin"]',         // Exploration pins: RedPin_1, RedPin_2, etc.
      'g[id^="PurplePin"]',      // Development pins: PurplePin_1, PurplePin_2, etc.
      'g[id^="GrayPin"]',        // Decommission pins: GrayPin_1, GrayPin_2, etc.
      'g[class*="GreenPin"]',    // Classe alternativa
      'g[class*="RedPin"]',      // Classe alternativa
      'g[class*="PurplePin"]',   // Classe alternativa
      'g[class*="GrayPin"]'      // Classe alternativa
    ];
    
    const pinElements = svgElement.querySelectorAll(selectors.join(', '));
    
    console.log(`📍 Found ${pinElements.length} interactive pin elements (containers: ${svgContainers.length})`);

    let listenersAdded = 0;
    pinElements.forEach((element) => {
      // Remover listener antigo se existir (previne duplicação)
      element.removeEventListener('click', handlePinClick);
      
      // Adicionar cursor pointer e garantir que o elemento é clicável
      element.style.cursor = 'pointer';
      element.style.pointerEvents = 'auto';
      
      // Adicionar event listener
      element.addEventListener('click', handlePinClick, { passive: false });
      
      // Marcar como processado para debug
      element.dataset.listenerAdded = 'true';
      element.dataset.listenerAddedAt = Date.now();
      
      listenersAdded++;
    });
    
    console.log(`✅ ${listenersAdded} listeners adicionados com sucesso em`, new Date().toISOString());
    
    // Verificação final: testar se pelo menos um elemento tem o listener
    if (listenersAdded > 0) {
      const firstPin = pinElements[0];
      console.log('🔍 Primeiro pin configurado:', {
        id: firstPin.id,
        hasListener: firstPin.dataset.listenerAdded === 'true',
        cursor: firstPin.style.cursor,
        pointerEvents: firstPin.style.pointerEvents
      });
    }
  }, [handlePinClick]);

  const removePinListeners = useCallback(() => {
    // Remover listeners de TODOS os containers SVG (pode haver 2 durante transição)
    const svgContainers = document.querySelectorAll('.svg-map-content');
    
    if (svgContainers.length === 0) {
      console.log('⚠️ removePinListeners: Nenhum container SVG encontrado');
      return;
    }

    const selectors = [
      'g[id^="Pin_"]',
      'g[id^="GreenPin"]',
      'g[id^="RedPin"]',
      'g[id^="PurplePin"]',
      'g[id^="GrayPin"]',
      'g[class*="GreenPin"]',
      'g[class*="RedPin"]',
      'g[class*="PurplePin"]',
      'g[class*="GrayPin"]'
    ];
    
    let totalListenersRemoved = 0;
    
    svgContainers.forEach((container, index) => {
      const svgElement = container.querySelector('svg');
      if (!svgElement) return;
      
      const pinElements = svgElement.querySelectorAll(selectors.join(', '));
      
      pinElements.forEach((element) => {
        if (element.dataset.listenerAdded === 'true') {
          totalListenersRemoved++;
        }
        element.removeEventListener('click', handlePinClick);
        delete element.dataset.listenerAdded;
        delete element.dataset.listenerAddedAt;
      });
    });
    
    if (totalListenersRemoved > 0) {
      console.log(`🗑️ ${totalListenersRemoved} listeners removidos de ${svgContainers.length} container(s)`);
    }
  }, [handlePinClick]);

  // useEffect principal para gerenciar os listeners
  useEffect(() => {
    console.log('🔄 PinInteractionManager useEffect triggered:', { 
      selectedYear, 
      selectedZone, 
      isPlaying,
      activeLegendItems 
    });

    // Limpar listeners existentes imediatamente
    removePinListeners();

    // Função para tentar adicionar os listeners com retry
    let attempts = 0;
    const maxAttempts = 20; // Aumentado para lidar com transições durante play
    let timerId = null;
    let isCleanedUp = false;

    const trySetupListeners = () => {
      if (isCleanedUp) return;
      
      // Buscar todos os containers (pode haver 2 durante transição)
      const svgContainers = document.querySelectorAll('.svg-map-content');
      
      if (svgContainers.length === 0) {
        // Nenhum container encontrado, tentar novamente
        attempts++;
        if (attempts < maxAttempts) {
          console.log('⏳ Tentativa', attempts, 'de', maxAttempts, '- Nenhum container encontrado');
          timerId = setTimeout(trySetupListeners, 150);
        } else {
          console.warn('❌ Não foi possível encontrar o SVG após', maxAttempts, 'tentativas');
        }
        return;
      }
      
      // Se houver múltiplos, pegar o com z-index 2 (novo)
      let targetContainer = svgContainers[svgContainers.length - 1]; // Por padrão, o último
      if (svgContainers.length > 1) {
        for (const container of svgContainers) {
          const parent = container.parentElement;
          if (parent && getComputedStyle(parent).zIndex === '2') {
            targetContainer = container;
            break;
          }
        }
      }
      
      const svgElement = targetContainer.querySelector('svg');
      
      if (svgElement && svgElement.querySelector('g')) {
        // SVG está pronto e tem elementos dentro
        console.log('✅ SVG pronto, configurando listeners (tentativa:', attempts + 1, ', containers:', svgContainers.length, ')');
        
        // Verificar se os elementos realmente existem antes de adicionar listeners
        const testSelectors = [
          'g[id^="Pin_"]',
          'g[id^="GreenPin"]',
          'g[id^="RedPin"]',
          'g[id^="PurplePin"]',
          'g[id^="GrayPin"]'
        ];
        
        const hasElements = testSelectors.some(selector => 
          svgElement.querySelector(selector) !== null
        );
        
        if (hasElements) {
          setupPinListeners();
        } else {
          console.log('⚠️ SVG existe mas não tem pins, tentando novamente...');
          attempts++;
          if (attempts < maxAttempts) {
            timerId = setTimeout(trySetupListeners, 100);
          }
        }
      } else if (attempts < maxAttempts) {
        // Tentar novamente após um delay
        attempts++;
        console.log('⏳ Tentativa', attempts, 'de', maxAttempts);
        timerId = setTimeout(trySetupListeners, 150);
      } else {
        console.warn('❌ Não foi possível encontrar o SVG após', maxAttempts, 'tentativas');
      }
    };

    // Delay inicial: aguardar a transição do SVGMap terminar (1000ms) + margem de segurança
    // O SVGMap faz crossfade por 1000ms, então precisamos aguardar isso
    const initialDelay = 1200; // 1200ms para garantir que a transição terminou
    const initialTimer = setTimeout(trySetupListeners, initialDelay);

    return () => {
      console.log('🧹 Cleanup do PinInteractionManager');
      isCleanedUp = true;
      clearTimeout(initialTimer);
      if (timerId) clearTimeout(timerId);
      removePinListeners();
    };
  }, [selectedYear, selectedZone, activeLegendItems, isPlaying, setupPinListeners, removePinListeners]);

  // Efeito para adicionar classe 'active' aos pins de localização quando o popover está aberto
  useEffect(() => {
    const svgElement = document.querySelector('.svg-map-content svg');
    if (!svgElement) return;

    // Remove classe active de todos os location pins
    const allLocationPins = svgElement.querySelectorAll('g[id^="Pin_"]');
    allLocationPins.forEach(pin => {
      pin.classList.remove('active');
    });

    // Adiciona classe active ao pin correspondente ao popover aberto
    if (activePopover === 'location_rio') {
      const rioPin = svgElement.querySelector('g[id="Pin_Rio"]');
      if (rioPin) rioPin.classList.add('active');
    } else if (activePopover === 'location_sp') {
      const spPin = svgElement.querySelector('g[id="Pin_SP"]');
      if (spPin) spPin.classList.add('active');
    } else if (activePopover === 'location_macae') {
      const macaePin = svgElement.querySelector('g[id="Pin_Macae"]');
      if (macaePin) macaePin.classList.add('active');
    }
  }, [activePopover]);

  const closePopover = useCallback(() => {
    setActivePopover(null);
    setPopoverData(null);
    setAnchorEl(null);
  }, []);

  // Efeito para fechar popover quando o play da timeline é ativado
  useEffect(() => {
    if (isPlaying && activePopover) {
      console.log('▶️ Play ativado, fechando popover');
      closePopover();
    }
  }, [isPlaying, activePopover, closePopover]);

  const mapSvgIdToJsonId = (svgId, pinClass) => {
    // Mapear IDs do SVG para IDs do JSON
    // Exemplos: GreenPin_3 -> prod3, RedPin_1 -> exp1, Pin_Rio -> rio
    
    if (!svgId) return null;
    
    const id = svgId.toLowerCase();
    const className = (pinClass || '').toLowerCase();
    
    // LocationPins específicos (prioridade alta)
    if (id.startsWith('pin_')) {
      // Pin_Rio -> rio, Pin_SP -> sp, Pin_Macae -> macae
      const locationName = id.replace('pin_', '');
      if (locationName === 'rio') return 'rio';
      if (locationName === 'sp' || locationName === 'saopaulo') return 'sp';
      if (locationName === 'macae') return 'macae';
    }
    
    // Green pins = produção
    if (id.includes('greenpin') || className.includes('greenpin')) {
      const number = svgId.match(/\d+/)?.[0];
      if (number) return `prod${number}`;
    }
    
    // Red pins = exploração
    if (id.includes('redpin') || className.includes('redpin')) {
      const number = svgId.match(/\d+/)?.[0];
      if (number) return `exp${number}`;
    }
    
    // Purple pins = desenvolvimento
    if (id.includes('purplepin') || className.includes('purplepin') || id.includes('development')) {
      const number = svgId.match(/\d+/)?.[0];
      if (number) return `dev${number}`;
    }
    
    // Gray pins = descomissionamento
    if (id.includes('graypin') || className.includes('graypin') || id.includes('decommission')) {
      const number = svgId.match(/\d+/)?.[0];
      if (number) return `decomm${number}`;
    }
    
    // Locations genéricas
    if (id.includes('location') || className.includes('location')) {
      if (id.includes('sp') || id.includes('saopaulo')) return 'sp';
      if (id.includes('rio') && !id.includes('barreirinhas')) return 'rio';
      if (id.includes('macae')) return 'macae';
    }
    
    return svgId;
  };

  const identifyGenericType = (pinId, pinClass) => {
    // Criar dados genéricos quando não encontrar no JSON
    const id = (pinId || '').toLowerCase();
    const className = (pinClass || '').toLowerCase();
    
    if (id.includes('greenpin') || className.includes('greenpin') || 
        id.includes('production') || className.includes('production')) {
      return {
        popoverType: 'production_type1',
        title: 'Campo de Produção',
        status: 'Em produção',
        operator: 'Shell',
        operatorDescription: 'Responsável pela administração do campo',
        depth: 'A definir',
        depthDescription: 'Distância da superfície do mar até o fundo',
        companies: [
          {
            id: 'shell',
            name: 'Shell*',
            percentage: 100,
            color: '#DD1D21',
            isOperator: true
          }
        ]
      };
    }
    
    if (id.includes('redpin') || className.includes('redpin') || 
        id.includes('exploration') || className.includes('exploration')) {
      return {
        popoverType: 'exploration_type1',
        title: 'Bloco em Exploração',
        status: 'Em exploração',
        operator: 'Shell',
        operatorDescription: 'Responsável pela administração do campo',
        depth: 'A definir',
        depthDescription: 'Distância da superfície do mar até o fundo',
        companies: [
          {
            id: 'shell',
            name: 'Shell*',
            percentage: 100,
            color: '#DD1D21',
            isOperator: true
          }
        ]
      };
    }
    
    if (id.includes('purplepin') || className.includes('purplepin') || 
        id.includes('development') || className.includes('development')) {
      return {
        popoverType: 'production_type1',
        title: 'Bloco em Desenvolvimento',
        status: 'Em desenvolvimento',
        operator: 'Shell',
        operatorDescription: 'Responsável pela administração do campo',
        depth: 'A definir',
        depthDescription: 'Distância da superfície do mar até o fundo',
        companies: [
          {
            id: 'shell',
            name: 'Shell*',
            percentage: 100,
            color: '#DD1D21',
            isOperator: true
          }
        ]
      };
    }
    
    if (id.includes('graypin') || className.includes('graypin') || 
        id.includes('decommission') || className.includes('decommission')) {
      return {
        popoverType: 'production_type1',
        title: 'Bloco em Descomissionamento',
        status: 'Em descomissionamento',
        operator: 'Shell',
        operatorDescription: 'Responsável pela administração do campo',
        depth: 'A definir',
        depthDescription: 'Distância da superfície do mar até o fundo',
        companies: [
          {
            id: 'shell',
            name: 'Shell*',
            percentage: 100,
            color: '#DD1D21',
            isOperator: true
          }
        ]
      };
    }
    
    return null;
  };

  const identifyPopoverType = (pinId, pinClass) => {
    // Converter para lowercase para comparação
    const id = (pinId || '').toLowerCase();
    const className = (pinClass || '').toLowerCase();

    // Verificar localizações específicas
    if (id.includes('sp') || id.includes('saopaulo') || id.includes('sao-paulo') ||
        className.includes('sp') || className.includes('saopaulo')) {
      return 'sp';
    }

    if (id.includes('macae') || id.includes('macaé') ||
        className.includes('macae') || className.includes('macaé')) {
      return 'macae';
    }

    if (id.includes('rio') && !id.includes('barreirinhas') ||
        className.includes('rio') && !className.includes('barreirinhas')) {
      return 'rio';
    }

    // Para pins de exploração/produção genéricos, abrir um popover padrão
    if (id.includes('exploration') || id.includes('exp') || id.includes('red') ||
        className.includes('exploration') || className.includes('exp') || className.includes('red')) {
      return 'exploration';
    }

    if (id.includes('production') || id.includes('prod') || id.includes('green') ||
        className.includes('production') || className.includes('prod') || className.includes('green')) {
      return 'production';
    }

    return null;
  };

  // Debug logs
  console.log('🔍 PinInteractionManager render:', {
    activePopover,
    hasPopoverData: !!popoverData,
    explorationPopoverOpen: activePopover === 'exploration_type1',
    productionPopoverOpen: activePopover === 'production_type1'
  });

  return (
    <>
      {/* Popovers de localizações específicas com shadcn */}
      {activePopover === 'location_sp' && (
        <SPLocationPopover 
          isOpen={true}
          anchorEl={anchorEl}
          onClose={closePopover} 
        />
      )}
      
      {activePopover === 'location_macae' && (
        <MacaeLocationPopover 
          isOpen={true}
          anchorEl={anchorEl}
          onClose={closePopover} 
        />
      )}
      
      {activePopover === 'location_rio' && (
        <RioLocationPopover 
          isOpen={true}
          anchorEl={anchorEl}
          onClose={closePopover} 
        />
      )}
      
      {/* Popovers de pins (exploration e production) */}
      {(activePopover === 'exploration_type1' || activePopover === 'production_type1') && (
        <PopoverPins
          isOpen={true}
          anchorEl={anchorEl}
          onClose={closePopover}
          data={popoverData}
        />
      )}
    </>
  );
}

export default PinInteractionManager;

