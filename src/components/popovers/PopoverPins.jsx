import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { calculateBestPopoverPosition } from '@/lib/popoverPosition';
import './PopoverPins.css';

// Importar o componente Pin
import Pin from '@/components/Pin';

// Importar os ícones de status como URLs (para o tag de status)
import IconProducao from '@/assets/icons/popover-producao.svg?url';
import IconExploracao from '@/assets/icons/popover-exploracao.svg?url';
import IconDesenvolvimento from '@/assets/icons/popover-desenvolvimento.svg?url';
import IconDescomissionamento from '@/assets/icons/popover-descomissionamento.svg?url';

/**
 * Mapeia o type para o ícone correspondente (para o tag de status)
 */
const getIconByType = (type) => {
  // Normalizar para lowercase
  const typeValue = (type || '').toLowerCase();
  
  // Exploration
  if (typeValue === 'exploration' || typeValue.includes('explora')) {
    return IconExploracao;
  }
  
  // Production
  if (typeValue === 'production' || typeValue.includes('produ')) {
    return IconProducao;
  }
  
  // Decommissioning
  if (typeValue === 'decommissioning' || typeValue.includes('descommission')) {
    return IconDescomissionamento;
  }
  
  // Development
  if (typeValue === 'development' || typeValue.includes('desenvolv')) {
    return IconDesenvolvimento;
  }
  
  // Fallback padrão
  return IconProducao;
};

/**
 * PopoverPins - Componente de popover UNIVERSAL para exibição de informações de pins
 * Baseado no design do Figma Shell Library
 * 
 * Este componente é usado para TODOS os tipos de pins:
 * - Exploration (Em exploração - RedPin)
 * - Production (Em produção - GreenPin)
 * - Development (Em desenvolvimento - PurplePin)
 * - Decommissioning (Em descomissionamento - GrayPin)
 * 
 * O componente se adapta automaticamente aos dados fornecidos.
 * 
 * Renderização Condicional (Auto Layout):
 * - Todos os campos são opcionais exceto title e status
 * - Seções inteiras são ocultadas se não houver dados
 * - Dividers aparecem apenas entre seções existentes
 * 
 * @param {boolean} isOpen - Controla a visibilidade do popover
 * @param {Element} anchorEl - Elemento do DOM que serve como âncora para o popover
 * @param {function} onClose - Callback chamado ao fechar o popover
 * @param {object} data - Dados a serem exibidos no popover
 * @param {string|object} data.status - Status do campo
 * @param {string} [data.status.label] - Label do status (ex: "Em produção", "Em exploração")
 * @param {string} data.title - Título principal (ex: "BM-S-11 - Lula") [obrigatório]
 * @param {array} [data.tags] - Array de tags (ex: ["Lula Central", "Lula Alto"])
 * @param {string|object} [data.operator] - Operadora (string flat ou objeto nested)
 * @param {string} [data.operator.name] - Nome da operadora
 * @param {string} [data.operator.description] - Descrição da operadora
 * @param {string|object} [data.depth] - Profundidade (string flat ou objeto nested)
 * @param {string} [data.depth.value] - Valor da profundidade (ex: "~2.100-2.200m")
 * @param {string} [data.depth.description] - Descrição da profundidade
 * @param {array} [data.companies] - Array de empresas participantes
 * @param {string} data.companies[].name - Nome da empresa
 * @param {number} data.companies[].percentage - Porcentagem de participação
 * @param {boolean} data.companies[].isOperator - Se é a empresa operadora (destaque)
 * @param {object} [data.infrastructure] - Infraestrutura associada
 * @param {string} data.infrastructure.title - Título da infraestrutura (ex: "8 FPSOs em operação")
 * @param {string} [data.infrastructure.description] - Descrição da infraestrutura
 * @param {array} [data.infrastructure.items] - Array de itens da infraestrutura
 * @param {number} data.infrastructure.items[].id - ID do item
 * @param {string} data.infrastructure.items[].name - Nome do item (ex: "P-74")
 */
function PopoverPins({ isOpen, anchorEl, onClose, data }) {
  const [triggerPosition, setTriggerPosition] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState({ side: 'bottom', align: 'center', sideOffset: 27, alignOffset: 0 });
  const [arrowPosition, setArrowPosition] = useState({ side: 'bottom', offset: '50%' });
  const popoverRef = useRef(null);

  // Função para calcular a posição da arrow
  const calculateArrowPosition = (anchorRect, bestPosition, popoverElement) => {
    if (!popoverElement) return { side: bestPosition.side, offset: '50%' };

    const popoverRect = popoverElement.getBoundingClientRect();
    const pinCenter = {
      x: anchorRect.left + anchorRect.width / 2,
      y: anchorRect.top + anchorRect.height / 2
    };

    const ARROW_SIZE = 10; // Tamanho da arrow
    const ARROW_MARGIN = 15; // Margem mínima das bordas do popover

    // DETECTAR AUTOMATICAMENTE qual lado o popover está em relação ao pin
    const popoverCenter = {
      x: popoverRect.left + popoverRect.width / 2,
      y: popoverRect.top + popoverRect.height / 2
    };

    const distances = {
      top: pinCenter.y - popoverRect.bottom,
      bottom: popoverRect.top - pinCenter.y,
      left: pinCenter.x - popoverRect.right,
      right: popoverRect.left - pinCenter.x
    };

    // Encontrar o lado mais próximo (maior valor positivo = lado correto)
    const actualSide = Object.entries(distances).reduce((max, [side, dist]) => 
      dist > max.dist ? { side, dist } : max, { side: 'bottom', dist: -Infinity }
    ).side;

    console.log('🔍 Lado detectado automaticamente:', {
      bestPositionSide: bestPosition.side,
      actualSide,
      distances,
      pinCenter,
      popoverRect: {
        top: popoverRect.top,
        bottom: popoverRect.bottom,
        left: popoverRect.left,
        right: popoverRect.right
      }
    });

    let offset = '50%';

    // Calcular offset baseado no lado REAL do popover
    if (actualSide === 'top' || actualSide === 'bottom') {
      // Arrow horizontal - calcular offset left/right
      const popoverLeft = popoverRect.left;
      const popoverWidth = popoverRect.width;
      let relativeX = pinCenter.x - popoverLeft;
      
      // Aplicar limites SUAVES (apenas para segurança)
      const minX = ARROW_MARGIN + ARROW_SIZE;
      const maxX = popoverWidth - ARROW_MARGIN - ARROW_SIZE;
      const originalX = relativeX;
      
      // Se estiver muito fora, limitar, caso contrário deixar apontar para o pin
      if (relativeX < minX || relativeX > maxX) {
        relativeX = Math.max(minX, Math.min(maxX, relativeX));
        console.log('⚠️ Arrow foi limitada (popover pode não estar bem posicionado)');
      }
      
      console.log('🎯 Arrow horizontal:', {
        originalX,
        finalX: relativeX,
        popoverWidth,
        isPointingToPin: Math.abs(originalX - relativeX) < 1
      });
      
      offset = `${relativeX}px`;
    } else if (actualSide === 'left' || actualSide === 'right') {
      // Arrow vertical - calcular offset top/bottom
      const popoverTop = popoverRect.top;
      const popoverHeight = popoverRect.height;
      let relativeY = pinCenter.y - popoverTop;
      
      // Aplicar limites SUAVES (apenas para segurança)
      const minY = ARROW_MARGIN + ARROW_SIZE;
      const maxY = popoverHeight - ARROW_MARGIN - ARROW_SIZE;
      const originalY = relativeY;
      
      // Se estiver muito fora, limitar, caso contrário deixar apontar para o pin
      if (relativeY < minY || relativeY > maxY) {
        relativeY = Math.max(minY, Math.min(maxY, relativeY));
        console.log('⚠️ Arrow foi limitada (popover pode não estar bem posicionado)');
      }
      
      console.log('🎯 Arrow vertical:', {
        originalY,
        finalY: relativeY,
        popoverHeight,
        isPointingToPin: Math.abs(originalY - relativeY) < 1
      });
      
      offset = `${relativeY}px`;
    }

    return {
      side: actualSide,  // Usar lado detectado automaticamente
      offset: offset
    };
  };

  useEffect(() => {
    if (anchorEl && isOpen) {
      // Usar RAF para garantir que o elemento está completamente posicionado
      requestAnimationFrame(() => {
        const rect = anchorEl.getBoundingClientRect();
        
        // Validar se o rect tem valores válidos
        if (rect.width === 0 && rect.height === 0) {
          console.warn('⚠️ AnchorEl com dimensões inválidas, tentando novamente...');
          // Tentar novamente após um pequeno delay
          setTimeout(() => {
            const newRect = anchorEl.getBoundingClientRect();
            setTriggerPosition({
              left: newRect.left + newRect.width / 2,
              top: newRect.top + newRect.height / 2
            });
            
            // Calcular melhor posição
            const bestPosition = calculateBestPopoverPosition(newRect, { width: 500, height: 600 });
            setPopoverPosition(bestPosition);

            // Calcular posição da arrow após popover estar renderizado
            // Usar múltiplos timeouts para garantir que o Radix UI terminou de posicionar
            setTimeout(() => {
              if (popoverRef.current) {
                const arrow = calculateArrowPosition(newRect, bestPosition, popoverRef.current);
                setArrowPosition(arrow);
                
                // Recalcular após mais tempo para garantir posição final
                setTimeout(() => {
                  if (popoverRef.current) {
                    const arrow = calculateArrowPosition(newRect, bestPosition, popoverRef.current);
                    setArrowPosition(arrow);
                    console.log('🎯 Arrow recalculada após Radix posicionar');
                  }
                }, 100);
              }
            }, 50);
          }, 50);
        } else {
          setTriggerPosition({
            left: rect.left + rect.width / 2,
            top: rect.top + rect.height / 2
          });
          
          // Calcular melhor posição
          const bestPosition = calculateBestPopoverPosition(rect, { width: 500, height: 600 });
          setPopoverPosition(bestPosition);

          // Calcular posição da arrow após popover estar renderizado
          // Usar múltiplos timeouts para garantir que o Radix UI terminou de posicionar
          setTimeout(() => {
            if (popoverRef.current) {
              const arrow = calculateArrowPosition(rect, bestPosition, popoverRef.current);
              setArrowPosition(arrow);
              
              // Recalcular após mais tempo para garantir posição final
              setTimeout(() => {
                if (popoverRef.current) {
                  const arrow = calculateArrowPosition(rect, bestPosition, popoverRef.current);
                  setArrowPosition(arrow);
                  console.log('🎯 Arrow recalculada após Radix posicionar');
                }
              }, 100);
            }
          }, 50);
        }
      });
    }
  }, [anchorEl, isOpen]);

  if (!isOpen || !data) return null;
  if (!anchorEl || !triggerPosition) return null;

  // Extrair valores da estrutura nested (nova) ou flat (antiga) - retrocompatibilidade
  const status = data.status?.label || data.status || 'Status não definido';
  const operatorName = data.operator?.name || data.operator || null;
  const operatorDescription = data.operator?.description || data.operatorDescription || null;
  const depthValue = data.depth?.value || data.depth || null;
  const depthDescription = data.depth?.description || data.depthDescription || null;
  const infrastructureTitle = data.infrastructure?.title || null;
  const infrastructureDescription = data.infrastructure?.description || null;
  const infrastructureItems = data.infrastructure?.items || [];
  
  // Determinar o que renderizar (Auto Layout do Figma)
  const hasSummary = operatorName || depthValue;
  const hasCompanies = data.companies && data.companies.length > 0;
  const hasInfrastructure = infrastructureTitle;
  
  // Dividers condicionais
  const shouldShowFirstDivider = hasSummary && hasCompanies;
  const shouldShowSecondDivider = (hasCompanies || hasSummary) && hasInfrastructure;

  const content = (
    <>
      {/* Dynamic Arrow - aponta para o centro do pin */}
      <div 
        className={`popover-pins-arrow popover-pins-arrow-${arrowPosition.side}`}
        style={{
          [arrowPosition.side === 'top' || arrowPosition.side === 'bottom' ? 'left' : 'top']: arrowPosition.offset,
          transform: arrowPosition.side === 'top' || arrowPosition.side === 'bottom' ? 'translateX(-50%)' : 'translateY(-50%)'
        }}
      />
      <div className="popover-pins-card">
          {/* Header Section */}
          <div className="popover-pins-header">
            <div className="popover-pins-upper-content">
              {/* Status Tag - Mostra Pin com número ou ícone padrão, sempre com texto do status */}
              <div className="popover-pins-status-tag">
                {data.number ? (
                  // Renderizar componente Pin se tiver número
                  <>
                    <Pin
                      type={data.type}
                      number={data.number}
                      isActive={false}
                      onClick={() => {}}
                    />
                    <span className="popover-pins-status-text">{status}</span>
                  </>
                ) : (
                  // Renderizar ícone padrão se não tiver número
                  <>
                    <div className="popover-pins-status-icon-container">
                      <img 
                        src={getIconByType(data.type)} 
                        alt={status}
                        className="popover-pins-status-icon"
                      />
                    </div>
                    <span className="popover-pins-status-text">{status}</span>
                  </>
                )}
              </div>

              {/* Title and Tags */}
              <div className="popover-pins-title-section">
                <h1 className="popover-pins-title">{data.title}</h1>
                {data.tags && data.tags.length > 0 && (
                  <div className="popover-pins-tags">
                    {data.tags.map((tag, index) => (
                      <div key={index} className="popover-pins-tag">
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Summary Section - Renderiza apenas se houver operadora OU profundidade */}
            {hasSummary && (
            <div className="popover-pins-summary">
              {/* Operadora - Renderiza apenas se existir */}
              {operatorName && (
              <div className="popover-pins-info-block">
                <div className="popover-pins-info-header">
                  <div className="popover-pins-info-icon-container">
                    <svg className="popover-pins-info-icon" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.9996 30.75C17.6806 30.75 17.4135 30.6421 17.1982 30.4264C16.9827 30.2109 16.875 29.9438 16.875 29.625V20.7056L10.575 27.0289C10.352 27.2519 10.0871 27.3658 9.78038 27.3705C9.47363 27.3755 9.20388 27.2616 8.97112 27.0289C8.73837 26.7961 8.622 26.5288 8.622 26.2268C8.622 25.925 8.73837 25.6578 8.97112 25.425L15.2944 19.125H6.375C6.05625 19.125 5.78913 19.0171 5.57363 18.8014C5.35788 18.5856 5.25 18.3184 5.25 17.9996C5.25 17.6806 5.35788 17.4135 5.57363 17.1982C5.78913 16.9827 6.05625 16.875 6.375 16.875H15.2944L8.97112 10.575C8.74813 10.352 8.63425 10.0848 8.6295 9.77325C8.6245 9.4615 8.736 9.19412 8.964 8.97112C9.19175 8.74812 9.4615 8.639 9.77325 8.64375C10.0848 8.6485 10.352 8.7625 10.575 8.98575L16.875 15.3086V6.375C16.875 6.05625 16.9829 5.78913 17.1986 5.57363C17.4144 5.35788 17.6816 5.25 18.0004 5.25C18.3194 5.25 18.5865 5.35788 18.8018 5.57363C19.0173 5.78913 19.125 6.05625 19.125 6.375V15.3086L25.4393 8.97112C25.6625 8.74812 25.9275 8.639 26.2343 8.64375C26.541 8.6485 26.8059 8.7615 27.0289 8.98275C27.2519 9.20375 27.3634 9.46613 27.3634 9.76988C27.3634 10.0739 27.2519 10.3375 27.0289 10.5608L20.6914 16.875H29.625C29.9438 16.875 30.2109 16.9829 30.4264 17.1986C30.6421 17.4144 30.75 17.6816 30.75 18.0004C30.75 18.3194 30.6421 18.5865 30.4264 18.8018C30.2109 19.0173 29.9438 19.125 29.625 19.125H20.6914L27.0289 25.4393C27.2519 25.6625 27.3634 25.9275 27.3634 26.2342C27.3634 26.541 27.2519 26.8083 27.0289 27.036C26.8059 27.264 26.5385 27.3755 26.2268 27.3705C25.9153 27.3658 25.648 27.2519 25.425 27.0289L19.125 20.7056V29.625C19.125 29.9438 19.0171 30.2109 18.8014 30.4264C18.5856 30.6421 18.3184 30.75 17.9996 30.75Z" fill="#343434"/>
                    </svg>
                  </div>
                  <span className="popover-pins-info-label">Operadora</span>
                </div>
                <div className="popover-pins-info-content">
                  <div className="popover-pins-info-value">{operatorName}</div>
                  {operatorDescription && (
                    <div className="popover-pins-info-description">{operatorDescription}</div>
                  )}
                </div>
              </div>
              )}

              {/* Profundidade - Renderiza apenas se existir */}
              {depthValue && (
              <div className="popover-pins-info-block">
                <div className="popover-pins-info-header">
                  <div className="popover-pins-info-icon-container">
                    <svg className="popover-pins-info-icon" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.875 26.4258V9.54518L14.8905 11.5154C14.6852 11.7229 14.4286 11.8267 14.1206 11.8267C13.8126 11.8267 13.5462 11.7152 13.3215 11.4922C13.1155 11.2877 13.0125 11.0274 13.0125 10.7114C13.0125 10.3954 13.1163 10.1336 13.3241 9.9258L17.0467 6.20318C17.19 6.05993 17.3412 5.95955 17.5005 5.90205C17.6597 5.8443 17.8303 5.81543 18.0123 5.81543C18.1946 5.81543 18.3636 5.8443 18.5193 5.90205C18.6751 5.95955 18.8245 6.05993 18.9675 6.20318L22.6905 9.9258C22.898 10.1336 23.0042 10.3884 23.0092 10.6904C23.014 10.9922 22.9087 11.2594 22.6935 11.4922C22.4587 11.7249 22.1903 11.8413 21.8883 11.8413C21.5866 11.8413 21.3193 11.7249 21.0866 11.4922L19.125 9.54518V26.4258L21.1095 24.4702C21.3147 24.2624 21.5713 24.1586 21.8793 24.1586C22.1873 24.1586 22.4537 24.2701 22.6785 24.4931C22.8845 24.6976 22.9875 24.9578 22.9875 25.2738C22.9875 25.5898 22.8836 25.8517 22.6758 26.0594L18.9532 29.7821C18.81 29.9253 18.6598 30.0258 18.5028 30.0836C18.3458 30.1413 18.1776 30.1702 17.9981 30.1702C17.8186 30.1702 17.6481 30.1411 17.4866 30.0828C17.3251 30.0248 17.1751 29.9261 17.0366 29.7866L13.3095 26.0594C13.105 25.8542 12.9981 25.5976 12.9888 25.2896C12.9796 24.9818 13.0865 24.7156 13.3095 24.4908C13.514 24.2848 13.7742 24.1818 14.0902 24.1818C14.4062 24.1818 14.6681 24.2856 14.8758 24.4931L16.875 26.4258Z" fill="#343434"/>
                    </svg>
                  </div>
                  <span className="popover-pins-info-label">Profundidade</span>
                </div>
                <div className="popover-pins-info-content">
                  <div className="popover-pins-info-value">{depthValue}</div>
                  {depthDescription && (
                    <div className="popover-pins-info-description">{depthDescription}</div>
                  )}
                </div>
              </div>
              )}
            </div>
            )}
          </div>

          {/* Divider 1 - Renderiza apenas se houver summary E companies */}
          {shouldShowFirstDivider && (
            <div className="popover-pins-divider"></div>
          )}

          {/* Shareholders Section - Renderiza apenas se houver companies */}
          {hasCompanies && (
            <div className="popover-pins-section">
              <h2 className="popover-pins-section-title">Participação das empresas</h2>
              <div className="popover-pins-companies">
                {data.companies.map((company, index) => (
                  <div key={index} className="popover-pins-company">
                    <div className="popover-pins-company-header">
                      <span className={`popover-pins-company-name ${company.isOperator ? 'is-operator' : ''}`}>
                        {company.name}{company.isOperator ? '*' : ''}
                      </span>
                      <span className="popover-pins-company-percentage">{company.percentage}%</span>
                    </div>
                    <div className="popover-pins-progress-bar">
                      <div className="popover-pins-progress-bg"></div>
                      <div 
                        className={`popover-pins-progress-fill ${company.isOperator ? 'is-operator' : ''}`}
                        style={{ width: `${company.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Divider 2 - Renderiza apenas se houver (companies OU summary) E infrastructure */}
          {shouldShowSecondDivider && (
            <div className="popover-pins-divider"></div>
          )}

          {/* Infrastructure Section - Renderiza apenas se houver infrastructure */}
          {hasInfrastructure && (
            <div className="popover-pins-section">
              <h2 className="popover-pins-section-title">Infraestrutura associada</h2>
              <div className="popover-pins-infrastructure">
                <div className="popover-pins-info-content">
                  <div className="popover-pins-info-value">{infrastructureTitle}</div>
                  {infrastructureDescription && (
                    <div className="popover-pins-info-description">{infrastructureDescription}</div>
                  )}
                </div>
                {infrastructureItems.length > 0 && (
                  <div className="popover-pins-bullets">
                    {infrastructureItems.map((item, index) => (
                      <div key={item.id || index} className="popover-pins-bullet">
                        <div className="popover-pins-bullet-icon">
                          <span>{item.id || index + 1}</span>
                        </div>
                        <span className="popover-pins-bullet-text">{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

      {/* Close Button */}
      <button className="popover-pins-close-button" onClick={onClose}>
        Fechar
      </button>
      </div>
    </>
  );

  // Renderiza popover posicionado com Shadcn
  return createPortal(
    <Popover open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <PopoverTrigger asChild>
        <div 
          style={{
            position: 'fixed',
            left: `${triggerPosition.left}px`,
            top: `${triggerPosition.top}px`,
            width: '1px',
            height: '1px',
            pointerEvents: 'none'
          }}
        />
      </PopoverTrigger>
      <PopoverContent 
        ref={popoverRef}
        className="p-0 w-max max-w-[calc(100vw-40px)] border-0 rounded-2xl bg-transparent shadow-none relative"
        side={popoverPosition.side}
        align={popoverPosition.align}
        sideOffset={popoverPosition.sideOffset}
        alignOffset={popoverPosition.alignOffset || 0}
        onInteractOutside={onClose}
        collisionPadding={20}
      >
        {content}
      </PopoverContent>
    </Popover>,
    document.body
  );
}

export default PopoverPins;

