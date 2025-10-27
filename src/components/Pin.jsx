/**
 * Pin Component - Versão Simplificada com Tailwind CSS
 * Componente simples para exibir ícone de tipo e número de campos
 * 
 * @param {string} type - Tipo do campo (exploration, production, decommissioning)
 * @param {number} number - Número de campos agrupados
 * @param {boolean} isActive - Estado ativo/pressionado do pin
 * @param {function} onClick - Callback quando o pin é clicado
 */
import React from 'react';

// Importar os ícones SVG diretamente (com xmlns corrigido)
import IconExploracaoWhite from '@/assets/icons/exploration_white.svg';
import IconProducaoWhite from '@/assets/icons/production_white.svg';
import IconDescoWhite from '@/assets/icons/desco_white.svg';

/**
 * Mapeia o type para o ícone e cor de fundo
 */
const getTypeConfig = (type) => {
  // Normalizar para lowercase
  const typeValue = (type || '').toLowerCase();
  
  // Exploração
  if (typeValue === 'exploration' || typeValue.includes('explora')) {
    return { icon: IconExploracaoWhite, bgColor: '#DD1D21' };
  }
  
  // Produção
  if (typeValue === 'production' || typeValue.includes('produ')) {
    return { icon: IconProducaoWhite, bgColor: '#008557' };
  }
  
  // Descomissionamento
  if (typeValue === 'decommissioning' || typeValue.includes('descomission')) {
    return { icon: IconDescoWhite, bgColor: '#616161' };
  }
  
  // Desenvolvimento (fallback para produção)
  if (typeValue === 'development' || typeValue.includes('desenvolv')) {
    return { icon: IconProducaoWhite, bgColor: '#008557' };
  }
  
  // Fallback padrão
  return { icon: IconProducaoWhite, bgColor: '#008557' };
};

function Pin({ type, number, isActive = false, onClick }) {
  const config = getTypeConfig(type);
    
  return (
    <div 
      className={`flex justify-center items-center gap-1.5 px-2 py-2 rounded-lg outline-none focus:outline-none`}
      style={{ backgroundColor: config.bgColor }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <img 
        src={config.icon} 
        alt="Status" 
        className="w-3.5 h-3.5 shrink-0 block"
      />
      <span 
        className="text-md leading-none text-white font-bold pb-0.5"
        style={{ fontFamily: 'ShellBold, sans-serif' }}
      >
        {number}
      </span>
    </div>
  );
}

export default Pin;
