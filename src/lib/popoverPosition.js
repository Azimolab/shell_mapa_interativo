/**
 * Calcula a melhor posição para o popover baseado no espaço disponível
 * Garante que o popover não fique cortado e não sobreponha o pin
 * Considera as áreas ocupadas pela Timeline e Toolbar
 */

const BASE_OFFSET = 16; // Distância mínima visual desejada entre popover e pin
const ARROW_SIZE = 12; // Tamanho da arrow
const MARGIN = 20; // Margem mínima das bordas da tela

// Dimensões das áreas restritas (Timeline e Toolbar)
const TIMELINE_HEIGHT = 140; // Altura da timeline com scale(0.8) + padding (~112px * 0.8 + margem)
const TIMELINE_MARGIN_BOTTOM = 20; // bottom-5 = 20px
const TOOLBAR_WIDTH = 360; // Largura da toolbar (~358.5px)
const TOOLBAR_MARGIN_RIGHT = 30; // right-[30px]
const TOOLBAR_MARGIN_TOP = 48; // mt-12 = 48px

/**
 * Calcula a melhor posição para o popover
 * @param {DOMRect} anchorRect - Retângulo do elemento âncora (pin)
 * @param {Object} popoverDimensions - Dimensões estimadas do popover {width, height}
 * @returns {Object} - {side, align, sideOffset}
 */
export function calculateBestPopoverPosition(anchorRect, popoverDimensions = { width: 500, height: 400 }) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  const pinCenter = {
    x: anchorRect.left + anchorRect.width / 2,
    y: anchorRect.top + anchorRect.height / 2
  };

  // Calcular offset dinâmico baseado no tamanho do pin
  // Para pins com texto (mais altos), o offset será maior
  const dynamicOffsets = {
    top: BASE_OFFSET + ARROW_SIZE + (anchorRect.height / 2),
    bottom: BASE_OFFSET + ARROW_SIZE + (anchorRect.height / 2),
    left: BASE_OFFSET + ARROW_SIZE + (anchorRect.width / 2),
    right: BASE_OFFSET + ARROW_SIZE + (anchorRect.width / 2)
  };

  // Calcular áreas restritas
  const timelineRestricted = TIMELINE_HEIGHT + TIMELINE_MARGIN_BOTTOM;
  const toolbarRestricted = TOOLBAR_WIDTH + TOOLBAR_MARGIN_RIGHT;

  // Calcular espaço disponível em cada direção, considerando áreas restritas
  const space = {
    top: anchorRect.top - MARGIN - TOOLBAR_MARGIN_TOP,
    right: viewportWidth - anchorRect.right - MARGIN - toolbarRestricted,
    bottom: viewportHeight - anchorRect.bottom - MARGIN - timelineRestricted,
    left: anchorRect.left - MARGIN
  };

  console.log('📐 Espaço disponível (com restrições):', space);
  console.log('📍 Pin center:', pinCenter);
  console.log('📦 Popover dimensions:', popoverDimensions);
  console.log('📏 Pin size:', { width: anchorRect.width, height: anchorRect.height });
  console.log('📏 Dynamic offsets:', dynamicOffsets);

  // Verificar se cabe em cada posição usando offsets dinâmicos
  const fits = {
    top: space.top >= popoverDimensions.height + dynamicOffsets.top,
    right: space.right >= popoverDimensions.width + dynamicOffsets.right,
    bottom: space.bottom >= popoverDimensions.height + dynamicOffsets.bottom,
    left: space.left >= popoverDimensions.width + dynamicOffsets.left
  };

  console.log('✅ Cabe em:', fits);

  // Prioridades de posicionamento (preferir bottom e right quando possível)
  const priorities = [
    { side: 'bottom', align: 'center', check: fits.bottom },
    { side: 'top', align: 'center', check: fits.top },
    { side: 'right', align: 'center', check: fits.right },
    { side: 'left', align: 'center', check: fits.left },
  ];

  // Encontrar primeira posição que cabe
  let bestPosition = priorities.find(p => p.check);

  // Se nenhuma posição cabe perfeitamente, escolher a com mais espaço
  if (!bestPosition) {
    const maxSpace = Math.max(space.top, space.right, space.bottom, space.left);
    
    if (maxSpace === space.bottom) {
      bestPosition = { side: 'bottom', align: 'center' };
    } else if (maxSpace === space.top) {
      bestPosition = { side: 'top', align: 'center' };
    } else if (maxSpace === space.right) {
      bestPosition = { side: 'right', align: 'center' };
    } else {
      bestPosition = { side: 'left', align: 'center' };
    }
  }

  // Ajustar alinhamento com lógica melhorada para garantir que arrow possa apontar para o pin
  const ARROW_MARGIN = 25; // Margem mínima da arrow até as bordas do popover

  if (bestPosition.side === 'top' || bestPosition.side === 'bottom') {
    const popoverHalfWidth = popoverDimensions.width / 2;
    const leftSpace = pinCenter.x - MARGIN;
    const rightSpace = viewportWidth - pinCenter.x - MARGIN - toolbarRestricted;

    // Calcular onde o popover ficaria com cada alinhamento
    const centerLeft = pinCenter.x - popoverHalfWidth;
    const centerRight = centerLeft + popoverDimensions.width;
    
    // Verificar se com align center a arrow consegue apontar para o pin
    const canUseCenterAlign = 
      pinCenter.x >= (centerLeft + ARROW_MARGIN) && 
      pinCenter.x <= (centerRight - ARROW_MARGIN);

    if (canUseCenterAlign && leftSpace >= popoverHalfWidth && rightSpace >= popoverHalfWidth) {
      // Pode usar center com segurança
      bestPosition.align = 'center';
    } else if (leftSpace < popoverHalfWidth) {
      // Muito próximo da borda esquerda
      bestPosition.align = 'start';
    } else if (rightSpace < popoverHalfWidth) {
      // Muito próximo da borda direita
      bestPosition.align = 'end';
    } else {
      // Escolher o melhor alinhamento baseado em onde o pin está
      // Se o pin está mais à esquerda, usar start; se mais à direita, usar end
      const distanceFromLeft = pinCenter.x;
      const distanceFromRight = viewportWidth - pinCenter.x;
      
      if (distanceFromLeft < distanceFromRight) {
        bestPosition.align = 'start';
      } else {
        bestPosition.align = 'end';
      }
      console.log(`🔄 Ajustando align horizontal para ${bestPosition.align} (pin próximo da borda)`);
    }
  }

  if (bestPosition.side === 'left' || bestPosition.side === 'right') {
    const popoverHalfHeight = popoverDimensions.height / 2;
    const topSpace = pinCenter.y - MARGIN - TOOLBAR_MARGIN_TOP;
    const bottomSpace = viewportHeight - pinCenter.y - MARGIN - timelineRestricted;

    // Calcular onde o popover ficaria com cada alinhamento
    const centerTop = pinCenter.y - popoverHalfHeight;
    const centerBottom = centerTop + popoverDimensions.height;
    
    // Verificar se com align center a arrow consegue apontar para o pin
    const canUseCenterAlign = 
      pinCenter.y >= (centerTop + ARROW_MARGIN) && 
      pinCenter.y <= (centerBottom - ARROW_MARGIN);

    if (canUseCenterAlign && topSpace >= popoverHalfHeight && bottomSpace >= popoverHalfHeight) {
      // Pode usar center com segurança
      bestPosition.align = 'center';
    } else if (topSpace < popoverHalfHeight) {
      // Muito próximo do topo
      bestPosition.align = 'start';
    } else if (bottomSpace < popoverHalfHeight) {
      // Muito próximo do fundo
      bestPosition.align = 'end';
    } else {
      // Escolher o melhor alinhamento baseado em onde o pin está
      const distanceFromTop = pinCenter.y;
      const distanceFromBottom = viewportHeight - pinCenter.y;
      
      if (distanceFromTop < distanceFromBottom) {
        bestPosition.align = 'start';
      } else {
        bestPosition.align = 'end';
      }
      console.log(`🔄 Ajustando align vertical para ${bestPosition.align} (pin próximo da borda)`);
    }
  }

  // Selecionar o offset dinâmico apropriado para o lado escolhido
  const finalOffset = dynamicOffsets[bestPosition.side];

  // Calcular alignOffset para mover o popover e garantir que arrow aponte para o pin
  let alignOffset = 0;
  
  if (bestPosition.side === 'top' || bestPosition.side === 'bottom') {
    // Para popovers horizontais, calcular deslocamento horizontal necessário
    if (bestPosition.align === 'start') {
      alignOffset = -ARROW_MARGIN;
      console.log('📍 Align START horizontal: movendo popover para esquerda', alignOffset);
    } else if (bestPosition.align === 'end') {
      alignOffset = ARROW_MARGIN;
      console.log('📍 Align END horizontal: movendo popover para direita', alignOffset);
    }
  } else if (bestPosition.side === 'left' || bestPosition.side === 'right') {
    // Para popovers verticais, calcular deslocamento vertical necessário
    // IMPORTANTE: Precisamos calcular onde a arrow REALMENTE vai ficar para ajustar corretamente
    
    if (bestPosition.align === 'start') {
      // Com align: start, a borda SUPERIOR do popover se alinha ao CENTRO do pin
      // Isso significa que a arrow (que está na borda esquerda/direita do popover) 
      // ficaria na posição Y = 0 (topo do popover)
      // Mas queremos que a arrow aponte para o centro do pin!
      // Então precisamos mover o popover para BAIXO para arrow ficar no centro do pin
      
      // A arrow deveria estar a ARROW_MARGIN do topo
      // Mas também não pode ultrapassar o centro do popover se o pin estiver muito abaixo
      const idealArrowOffset = ARROW_MARGIN;
      
      // Se o popover for muito pequeno verticalmente, ajustar
      const maxOffset = Math.min(popoverDimensions.height / 3, ARROW_MARGIN * 2);
      
      alignOffset = Math.min(idealArrowOffset, maxOffset);
      console.log('📍 Align START vertical: movendo popover para BAIXO', alignOffset, {
        popoverHeight: popoverDimensions.height,
        maxOffset
      });
      
    } else if (bestPosition.align === 'end') {
      // Com align: end, a borda INFERIOR do popover se alinha ao CENTRO do pin
      // Isso significa que a arrow ficaria na posição Y = height (fundo do popover)
      // Mas queremos que a arrow aponte para o centro do pin!
      // Então precisamos mover o popover para CIMA para arrow ficar no centro do pin
      
      const idealArrowOffset = -ARROW_MARGIN;
      const maxOffset = -Math.min(popoverDimensions.height / 3, ARROW_MARGIN * 2);
      
      alignOffset = Math.max(idealArrowOffset, maxOffset);
      console.log('📍 Align END vertical: movendo popover para CIMA', alignOffset, {
        popoverHeight: popoverDimensions.height,
        maxOffset
      });
    }
  }

  console.log('🎯 Melhor posição:', {
    ...bestPosition,
    sideOffset: finalOffset,
    alignOffset,
    pinSize: { width: anchorRect.width, height: anchorRect.height }
  });

  return {
    side: bestPosition.side,
    align: bestPosition.align,
    sideOffset: finalOffset,
    alignOffset: alignOffset
  };
}

/**
 * Hook para obter as dimensões de um elemento após ele ser renderizado
 */
export function getPopoverDimensions(popoverElement) {
  if (!popoverElement) {
    // Dimensões padrão estimadas
    return { width: 500, height: 400 };
  }

  const rect = popoverElement.getBoundingClientRect();
  return {
    width: rect.width || 500,
    height: rect.height || 400
  };
}

