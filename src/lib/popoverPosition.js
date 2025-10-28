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
  // aplicar penalização extra no left/right se o pin estiver muito próximo do topo
  const extraTopPenalty = anchorRect.top < TOOLBAR_MARGIN_TOP ? TOOLBAR_MARGIN_TOP : 0;

  const space = {
    top: anchorRect.top - MARGIN - TOOLBAR_MARGIN_TOP,
    right: viewportWidth - anchorRect.right - MARGIN - toolbarRestricted - extraTopPenalty,
    bottom: viewportHeight - anchorRect.bottom - MARGIN - timelineRestricted,
    left: anchorRect.left - MARGIN - extraTopPenalty
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
    // Calcular espaço lateral real considerando penalização reduzida do toolbar
    // Se o popover pode caber acima do toolbar, reduzir um pouco a penalização da toolbar
    const toolbarPenaltyReduced = fits.top ? Math.max(0, toolbarRestricted - Math.round(TOOLBAR_MARGIN_TOP * 0.6)) : toolbarRestricted;
    const leftSpace = pinCenter.x - MARGIN - (anchorRect.top < TOOLBAR_MARGIN_TOP ? TOOLBAR_MARGIN_TOP : 0);
    const rightSpace = viewportWidth - pinCenter.x - MARGIN - toolbarPenaltyReduced - (anchorRect.top < TOOLBAR_MARGIN_TOP ? TOOLBAR_MARGIN_TOP : 0);

    // Calcular onde o popover ficaria com cada alinhamento
    const centerLeft = pinCenter.x - popoverHalfWidth;
    const centerRight = centerLeft + popoverDimensions.width;
    
    // Verificar se com align center a arrow consegue apontar para o pin
    const canUseCenterAlign = 
      pinCenter.x >= (centerLeft + ARROW_MARGIN) && 
      pinCenter.x <= (centerRight - ARROW_MARGIN);

    // Tornar center-align mais permissivo: calcular um centro permitido (clamped)
    const allowedCenterMinX = MARGIN + popoverHalfWidth;
    const allowedCenterMaxX = Math.max(allowedCenterMinX, viewportWidth - MARGIN - toolbarPenaltyReduced - popoverHalfWidth);
    const popoverCenterCandidateX = Math.max(allowedCenterMinX, Math.min(allowedCenterMaxX, pinCenter.x));
    const centerShiftX = Math.abs(popoverCenterCandidateX - pinCenter.x);

    // se a troca de centro necessária couber dentro da área útil para a arrow, permitir center
    if ((canUseCenterAlign || centerShiftX <= (popoverHalfWidth - ARROW_MARGIN))) {
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

  // Caso especial: se o popover previsto invadir a toolbar à direita, forçar abrir à esquerda
  try {
    const allowedRightEdge = viewportWidth - MARGIN - TOOLBAR_MARGIN_RIGHT;
    // calcular previsão do popover em top/bottom com center (ou candidate center)
    const predictedCenterX = (bestPosition.align === 'center') ? popoverCenterCandidateX : Math.max(allowedCenterMinX, Math.min(allowedCenterMaxX, pinCenter.x));
    const predictedLeft = predictedCenterX - popoverHalfWidth;
    const predictedRight = predictedLeft + popoverDimensions.width;

    if (predictedRight > allowedRightEdge) {
      console.log('⚠️ Popover previsivelmente invade toolbar à direita — forçando abertura à esquerda');
      // Forçar esquerda com alinhamento center quando possível
      bestPosition.side = 'left';
      bestPosition.align = 'center';
    }
  } catch (e) {
    // noop
  }

  if (bestPosition.side === 'left' || bestPosition.side === 'right') {
    const popoverHalfHeight = popoverDimensions.height / 2;
    // Calcular espaços verticais reais; incluir penalização do toolbar se o pin estiver alto
    const topSpace = pinCenter.y - MARGIN - (anchorRect.top < TOOLBAR_MARGIN_TOP ? TOOLBAR_MARGIN_TOP : TOOLBAR_MARGIN_TOP);
    const bottomSpace = viewportHeight - pinCenter.y - MARGIN - timelineRestricted;

    // Calcular onde o popover ficaria com cada alinhamento
    const centerTop = pinCenter.y - popoverHalfHeight;
    const centerBottom = centerTop + popoverDimensions.height;
    
    // Verificar se com align center a arrow consegue apontar para o pin
    const canUseCenterAlign = 
      pinCenter.y >= (centerTop + ARROW_MARGIN) && 
      pinCenter.y <= (centerBottom - ARROW_MARGIN);

    // Permitir center-align mais generoso verticalmente: calcular centro permitido e shift
    const allowedCenterMinY = MARGIN + popoverHalfHeight;
    const allowedCenterMaxY = Math.max(allowedCenterMinY, viewportHeight - MARGIN - timelineRestricted - popoverHalfHeight);
    const popoverCenterCandidateY = Math.max(allowedCenterMinY, Math.min(allowedCenterMaxY, pinCenter.y));
    const centerShiftY = Math.abs(popoverCenterCandidateY - pinCenter.y);

    if (canUseCenterAlign || centerShiftY <= (popoverHalfHeight - ARROW_MARGIN)) {
      // Pode usar center com segurança ou com pequeno deslocamento que ainda permite a seta
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
  // Determinar se o lado foi forçado (não cabia originalmente)
  const sideWasForced = !fits[bestPosition.side];

  // calcular penalização reduzida do toolbar para uso no cálculo de alignOffset
  const toolbarPenaltyReducedGlobal = fits.top ? Math.max(0, toolbarRestricted - Math.round(TOOLBAR_MARGIN_TOP * 0.6)) : toolbarRestricted;

  let finalOffset = dynamicOffsets[bestPosition.side];

  // Se o lado foi forçado, reduzir um pouco a margem (dar alguns pixels críticos)
  if (sideWasForced) {
    const REDUCTION = 12; // reduzir margem quando forçado
    if (bestPosition.side === 'left' || bestPosition.side === 'right') {
      const minSafe = Math.ceil(anchorRect.width / 2) + 12;
      finalOffset = Math.max(minSafe, dynamicOffsets[bestPosition.side] - REDUCTION);
    } else {
      const minSafe = Math.ceil(anchorRect.height / 2) + 12;
      finalOffset = Math.max(minSafe, dynamicOffsets[bestPosition.side] - REDUCTION);
    }
  }

  // Calcular alignOffset para mover o popover e garantir que arrow aponte para o pin
  let alignOffset = 0;
  
  if (bestPosition.side === 'top' || bestPosition.side === 'bottom') {
    // Para popovers horizontais, calcular deslocamento horizontal necessário
    const popoverHalfWidth = popoverDimensions.width / 2;

    // calcular centro possível do popover (limitado pelas margens e penalty do toolbar)
    const allowedCenterMinX = MARGIN + popoverHalfWidth;
    const allowedCenterMaxX = Math.max(allowedCenterMinX, viewportWidth - MARGIN - toolbarPenaltyReducedGlobal - popoverHalfWidth);
    const popoverCenterX = Math.max(allowedCenterMinX, Math.min(allowedCenterMaxX, pinCenter.x));

    const maxDelta = Math.max(0, popoverHalfWidth - ARROW_MARGIN);
    const deltaX = pinCenter.x - popoverCenterX;

    if (bestPosition.align === 'center') {
      // alinhar ao centro do pin (ou ao centro permitido)
      alignOffset = 0;
    } else {
      // quando start/end, alinhar o popover em direção ao pin com clamp baseado no tamanho
      alignOffset = Math.max(-maxDelta, Math.min(maxDelta, deltaX));
      console.log('📍 Align horizontal (clamped delta):', { align: bestPosition.align, alignOffset, deltaX, maxDelta });
    }
  } else if (bestPosition.side === 'left' || bestPosition.side === 'right') {
    // Para popovers verticais, calcular deslocamento vertical necessário
    // IMPORTANTE: Precisamos calcular onde a arrow REALMENTE vai ficar para ajustar corretamente
    const popoverHalfHeight = popoverDimensions.height / 2;

    // centro permitido do popover verticalmente
    const allowedCenterMinY = MARGIN + popoverHalfHeight;
    const allowedCenterMaxY = Math.max(allowedCenterMinY, viewportHeight - MARGIN - timelineRestricted - popoverHalfHeight);
    const popoverCenterY = Math.max(allowedCenterMinY, Math.min(allowedCenterMaxY, pinCenter.y));

    const maxDeltaY = Math.max(0, popoverHalfHeight - ARROW_MARGIN);
    const deltaY = pinCenter.y - popoverCenterY;

    if (bestPosition.align === 'center') {
      alignOffset = 0;
    } else {
      alignOffset = Math.max(-maxDeltaY, Math.min(maxDeltaY, deltaY));
      console.log('📍 Align vertical (clamped delta):', { align: bestPosition.align, alignOffset, deltaY, maxDeltaY });
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

