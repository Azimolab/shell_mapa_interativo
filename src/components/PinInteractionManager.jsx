import React, { useEffect, useState, useCallback } from 'react';
import RioLocationPopover from './rio/RioLocationPopover';
import SPLocationPopover from './rio/SPLocationPopover';
import MacaeLocationPopover from './rio/MacaeLocationPopover';
import PopoverPins from './popovers/PopoverPins';
import mapDataBR from '../data/mapData.json';
import mapDataUS from '../data/mapDataUs.json';
import locationsData from '../data/locationsData.json';

/**
 * Componente responsável por gerenciar as interações com os pins do SVG
 * e abrir os popovers correspondentes
 */
function PinInteractionManager({ selectedYear, selectedZone, activeLegendItems, isPlaying, onPauseTimeline, language }) {

  const mapData = language === "ENG" ? mapDataUS : mapDataBR;

  console.log("🔤 PinInteractionManager recebeu language:", language);

   console.log("🔤 PinInteractionManager recebeu mapa:", mapData);

  /**
   * Busca um pin em mapData.json pela estrutura hierárquica ano/zona/tipo
   * @param {string} pinId - ID do pin a ser buscado (ex: 'exp1', 'prod2', 'GreenPin_7-GatoDoMato')
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
      regionData.developmentPins || [],
      regionData.decommissioningPins || []
    ];
    
    for (const array of pinArrays) {
      // Buscar por ID do JSON ou por svgId (mais robusto)
      const pin = array.find(p => 
        p.id === pinId || 
        p.svgId === pinId || 
        p.id === pinId.toLowerCase() ||
        p.svgId?.toLowerCase() === pinId.toLowerCase()
      );
      if (pin) return pin;
    }
    
    return null;
  }, [mapData]);

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

    // Se estava em play, aguardar um frame para garantir que o SVG está estável
    // e re-buscar o elemento pelo ID para ter a referência correta
    if (wasPlaying && pinId) {
      requestAnimationFrame(() => {
        const svgContainer = document.querySelector('.svg-map-content');
        if (svgContainer) {
          const svgElement = svgContainer.querySelector('svg');
          if (svgElement) {
            const freshElement = svgElement.querySelector(`#${CSS.escape(pinId)}`);
            if (freshElement) {
              console.log('✅ Usando elemento atualizado após pausa do play');
              setAnchorEl(freshElement);
            } else {
              console.warn('⚠️ Elemento não encontrado, usando elemento original');
              setAnchorEl(element);
            }
          } else {
            setAnchorEl(element);
          }
        } else {
          setAnchorEl(element);
        }
      });
    } else {
      // Timeline não estava em play, usar elemento diretamente
      setAnchorEl(element);
    }
    
    // Verificar PRIMEIRO se é um pin de location (prioridade alta)
    const locationId = detectLocationPin(pinId, pinClass);
    if (locationId && locationsData.locations[locationId]) {
      console.log('📍 Location pin detected:', locationId);
      const locationData = locationsData.locations[locationId];
      setPopoverData({ ...locationData, id: locationId });
      setActivePopover(`location_${locationId}`);
      return;
    }
    
    // Se não for location, buscar nos pins de campos (exploration, production, etc)
    let mappedId = mapSvgIdToJsonId(pinId, pinClass);
    console.log('Mapped ID:', mappedId);

    // Buscar dados do pin no mapData.json usando a estrutura hierárquica
    let pinData = null;
    
    // 1. Tentar buscar com ID original do SVG (pode ser o svgId no JSON)
    pinData = findPinInMapData(pinId, selectedYear, selectedZone);
    
    // 2. Se não encontrou, tentar com ID mapeado
    if (!pinData && mappedId) {
      pinData = findPinInMapData(mappedId, selectedYear, selectedZone);
    }
    
    // 3. Se ainda não encontrou, tentar com ID original limpo
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
      
      // Para qualquer pin de campo (exploration, production, development, decommissioning)
      // Usa o componente genérico PopoverPins
      setPopoverData(pinData);
      setActivePopover('pin_generic');
    } else {
      console.warn('⚠️ No data found for pin:', pinId, 'mapped to:', mappedId);
      console.warn('📦 Context:', { year: selectedYear, zone: selectedZone });
      
      // Fallback: mostrar popover genérico baseado no tipo visual
      const genericType = identifyGenericType(pinId, pinClass);
      if (genericType) {
        console.log('🔄 Using generic fallback');
        setPopoverData(genericType);
        setActivePopover('pin_generic');
      }
    }
  }, [isPlaying, onPauseTimeline, findPinInMapData, selectedYear, selectedZone]);

  const setupPinListeners = useCallback(() => {
    const svgContainer = document.querySelector('.svg-map-content');
    
    if (!svgContainer) {
      console.warn('⚠️ Nenhum container SVG encontrado');
      return false;
    }
    
    const svgElement = svgContainer.querySelector('svg');
    if (!svgElement) {
      console.warn('⚠️ SVG element not found for pin listeners.');
      return false;
    }

    // Seleção específica: apenas grupos principais de pins
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
    
    if (pinElements.length === 0) {
      console.warn('⚠️ Nenhum pin encontrado no SVG');
      return false;
    }
    
    console.log(`📍 Encontrados ${pinElements.length} pins interativos`);

    let listenersAdded = 0;
    pinElements.forEach((element) => {
      // Remover listener antigo se existir (previne duplicação)
      element.removeEventListener('click', handlePinClick);
      
      // Adicionar cursor pointer e garantir que o elemento é clicável
      element.style.cursor = 'pointer';
      element.style.pointerEvents = 'auto';
      
      // Adicionar event listener
      element.addEventListener('click', handlePinClick, { passive: false });
      
      listenersAdded++;
    });
    
    console.log(`✅ ${listenersAdded} listeners adicionados com sucesso`);
    return true;
  }, [handlePinClick]);

  const removePinListeners = useCallback(() => {
    const svgContainer = document.querySelector('.svg-map-content');
    
    if (!svgContainer) {
      return;
    }

    const svgElement = svgContainer.querySelector('svg');
    if (!svgElement) return;

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
    
    const pinElements = svgElement.querySelectorAll(selectors.join(', '));
    
    pinElements.forEach((element) => {
      element.removeEventListener('click', handlePinClick);
    });
    
    if (pinElements.length > 0) {
      console.log(`🗑️ ${pinElements.length} listeners removidos`);
    }
  }, [handlePinClick]);

  /**
   * Extrai o identificador base do pin para encontrar o cluster correspondente
   * Exemplos:
   * - "GreenPin_1-Parque das Conchas" -> "GreenPin_1"
   * - "GrayPin_1-BijupiraSalema" -> "GrayPin_1"
   * - "RedPin_2-Campo X" -> "RedPin_2"
   * @param {string} pinId - ID completo do pin
   * @returns {string} - Identificador base do pin
   */
  const extractPinBaseId = useCallback((pinId) => {
    if (!pinId) return null;
    
    // Padrão: TipoPin_Número-NomeDetalhado
    // Queremos extrair: TipoPin_Número
    const match = pinId.match(/^([A-Za-z]+Pin_\d+)/);
    if (match) {
      return match[1];
    }
    
    // Fallback: retornar até o primeiro hífen (se existir)
    const hyphenIndex = pinId.indexOf('-');
    if (hyphenIndex > 0) {
      return pinId.substring(0, hyphenIndex);
    }
    
    // Se não tem hífen, retornar o ID completo
    return pinId;
  }, []);

  // useEffect para escutar o evento de SVG pronto
  useEffect(() => {
    const handleSvgReady = (event) => {
      const { year, zone } = event.detail;
      console.log('📥 Evento svgMapReady recebido:', { year, zone });
      
      // Adicionar listeners quando o SVG estiver pronto
      requestAnimationFrame(() => {
        setupPinListeners();
      });
    };

    window.addEventListener('svgMapReady', handleSvgReady);

    return () => {
      window.removeEventListener('svgMapReady', handleSvgReady);
    };
  }, [setupPinListeners]);

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

    // Sistema de retry mais robusto usando requestAnimationFrame
    let attempts = 0;
    const maxAttempts = 20;
    let rafId = null;
    let timeoutId = null;
    let isCleanedUp = false;

    const trySetupWithRetry = () => {
      if (isCleanedUp) return;
      
      attempts++;
      const success = setupPinListeners();
      
      if (success) {
        console.log(`✅ Listeners configurados com sucesso na tentativa ${attempts}`);
        return;
      }
      
      if (attempts < maxAttempts) {
        // Usar requestAnimationFrame para tentar após o próximo repaint
        rafId = requestAnimationFrame(() => {
          // Adicionar um pequeno delay adicional após o RAF
          timeoutId = setTimeout(trySetupWithRetry, 50);
        });
      } else {
        console.warn(`❌ Não foi possível adicionar listeners após ${maxAttempts} tentativas`);
      }
    };

    // Iniciar o processo de setup com RAF para garantir que o DOM está pronto
    rafId = requestAnimationFrame(trySetupWithRetry);

    return () => {
      console.log('🧹 Cleanup do PinInteractionManager');
      isCleanedUp = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
      removePinListeners();
    };
  }, [selectedYear, selectedZone, activeLegendItems, setupPinListeners, removePinListeners]);

  // Efeito para adicionar classe 'active' aos pins quando o popover está aberto
  useEffect(() => {
    const svgElement = document.querySelector('.svg-map-content svg');
    if (!svgElement) return;

    // Remove classe active de TODOS os pins
    const allPins = svgElement.querySelectorAll('g[id^="Pin_"], g[id*="GreenPin"], g[id*="RedPin"], g[id*="PurplePin"], g[id*="GrayPin"], g[class*="GreenPin"], g[class*="RedPin"], g[class*="PurplePin"], g[class*="GrayPin"]');
    allPins.forEach(pin => {
      pin.classList.remove('active');
    });

    // Ocultar todos os Cluster_Active por padrão
    const allClusters = svgElement.querySelectorAll('g[id*="Cluster_"], g[class*="Cluster_Active"]');
    allClusters.forEach(cluster => {
      cluster.style.display = 'none';
    });

    // Se há um popover aberto e um anchorEl, adicionar classe active
    if (activePopover && anchorEl) {
      // Para location pins (identificados pelo activePopover)
      if (activePopover === 'location_rio') {
        const rioPin = svgElement.querySelector('g[id="Pin_Rio"]');
        if (rioPin) rioPin.classList.add('active');
      } else if (activePopover === 'location_sp') {
        const spPin = svgElement.querySelector('g[id="Pin_SP"]');
        if (spPin) spPin.classList.add('active');
      } else if (activePopover === 'location_macae') {
        const macaePin = svgElement.querySelector('g[id="Pin_Macae"]');
        if (macaePin) macaePin.classList.add('active');
      } else if (activePopover === 'pin_generic') {
        // Para pins genéricos (exploration, production, etc), usar o anchorEl
        const pinId = anchorEl.id || anchorEl.getAttribute('data-pin-id');
        if (pinId) {
          const activePin = svgElement.querySelector(`#${CSS.escape(pinId)}`);
          if (activePin) {
            activePin.classList.add('active');
            console.log('✨ Pin ativo:', pinId);

            // Verificar se este pin tem "number" (é um cluster)
            if (popoverData && popoverData.number) {
              console.log('🎯 Pin com number detectado:', pinId);
              
              // Extrair o identificador base do pin (ex: "GreenPin_1" de "GreenPin_1-Parque das Conchas")
              const pinBaseId = extractPinBaseId(pinId);
              console.log('📌 ID base extraído:', pinBaseId);
              
              // Procurar pelo cluster com o padrão: Cluster_Active-{baseId}
              const clusterActiveId = `Cluster_Active-${pinBaseId}`;
              const clusterActive = svgElement.querySelector(`g[id="${CSS.escape(clusterActiveId)}"]`);
              
              console.log('🔍 Procurando cluster:', clusterActiveId);
              
              if (clusterActive) {
                // Tornar visível
                clusterActive.style.display = 'block';
                console.log('✅ Cluster_Active exibido:', clusterActiveId);
              } else {
                console.warn('⚠️ Cluster_Active não encontrado:', clusterActiveId);
                // Debug: listar clusters disponíveis
                const availableClusters = svgElement.querySelectorAll('g[id*="Cluster_Active"]');
                console.log('📋 Clusters disponíveis:', Array.from(availableClusters).map(c => c.id));
              }
            }
          }
        }
      }
    }
  }, [activePopover, anchorEl, popoverData, extractPinBaseId]);

  const closePopover = useCallback(() => {
    setActivePopover(null);
    setPopoverData(null);
    setAnchorEl(null);
  }, []);

  

  /**
   * Detecta se o pin é de location (São Paulo, Rio, Macaé)
   * @param {string} pinId - ID do pin do SVG
   * @param {string} pinClass - Classe do pin
   * @returns {string|null} - ID da location ('sp', 'rio', 'macae') ou null
   */
  const detectLocationPin = (pinId, pinClass) => {
    if (!pinId) return null;
    
    const id = pinId.toLowerCase();
    const className = (pinClass || '').toLowerCase();
    
    // Detectar pelo padrão Pin_* (mais comum)
    if (id === 'pin_sp' || id === 'pin-sp') return 'sp';
    if (id === 'pin_rio' || id === 'pin-rio') return 'rio';
    if (id === 'pin_macae' || id === 'pin-macae' || id === 'pin_macaé' || id === 'pin-macaé') return 'macae';
    
    // Detectar se a classe contém LocationPin e o ID contém o nome da cidade
    const isLocationPin = className.includes('locationpin') || id.includes('location');
    
    if (isLocationPin) {
      if (id.includes('sp') || id.includes('saopaulo') || id.includes('sao') || id.includes('paulo')) return 'sp';
      if (id.includes('rio') && !id.includes('barreirinhas')) return 'rio';
      if (id.includes('macae') || id.includes('macaé')) return 'macae';
    }
    
    // Detectar apenas pelo nome (fallback)
    if (id === 'sp' || id === 'saopaulo') return 'sp';
    if (id === 'rio') return 'rio';
    if (id === 'macae' || id === 'macaé') return 'macae';
    
    return null;
  };

  // Efeito para fechar popover quando o play da timeline é ativado
  useEffect(() => {
    if (isPlaying && activePopover) {
      console.log('▶️ Play ativado, fechando popover');
      closePopover();
    }
  }, [isPlaying, activePopover, closePopover]);

  const mapSvgIdToJsonId = (svgId, pinClass) => {
    // Mapear IDs do SVG para IDs do JSON de pins de campos
    // Exemplos: GreenPin_3 -> prod3, RedPin_1 -> exp1
    // Nota: Location pins (Pin_Rio, Pin_SP, etc) são tratados separadamente por detectLocationPin()
    
    if (!svgId) return null;
    
    const id = svgId.toLowerCase();
    const className = (pinClass || '').toLowerCase();
    
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
    
    return svgId;
  };

  const identifyGenericType = (pinId, pinClass) => {
    // Criar dados genéricos quando não encontrar no JSON
    const id = (pinId || '').toLowerCase();
    const className = (pinClass || '').toLowerCase();
    
    // Determinar status baseado no tipo de pin
    let status = 'Status desconhecido';
    
    if (id.includes('greenpin') || className.includes('greenpin') || 
        id.includes('production') || className.includes('production')) {
      status = { label: 'Em produção', icon: 'production' };
    } else if (id.includes('redpin') || className.includes('redpin') || 
        id.includes('exploration') || className.includes('exploration')) {
      status = { label: 'Em exploração', icon: 'exploration' };
    } else if (id.includes('purplepin') || className.includes('purplepin') || 
        id.includes('development') || className.includes('development')) {
      status = { label: 'Em desenvolvimento', icon: 'development' };
    } else if (id.includes('graypin') || className.includes('graypin') || 
        id.includes('decommission') || className.includes('decommission')) {
      status = { label: 'Em descomissionamento', icon: 'decommissioning' };
    }
    
    return {
      title: 'Informações não disponíveis',
      status: status,
      operator: {
        name: 'Shell',
        description: 'Responsável pela administração do campo'
      },
      depth: {
        value: 'A definir',
        description: 'Distância da superfície do mar até o fundo'
      },
      companies: [
        {
          name: 'Shell',
          percentage: 100,
          isOperator: true
        }
      ]
    };
  };

  // Debug logs
  console.log('🔍 PinInteractionManager render:', {
    activePopover,
    hasPopoverData: !!popoverData,
    pinGenericPopoverOpen: activePopover === 'pin_generic'
  });

  return (
    <>
      {/* Popovers de localizações específicas (São Paulo, Rio, Macaé) */}
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
          year={selectedYear}
        />
      )}
      
      {/* Popover genérico para TODOS os pins (exploration, production, development, decommissioning) */}
      {activePopover === 'pin_generic' && (
        <PopoverPins
          isOpen={true}
          anchorEl={anchorEl}
          onClose={closePopover}
          data={popoverData}
          language={language}
        />
      )}
    </>
  );
}

export default PinInteractionManager;

