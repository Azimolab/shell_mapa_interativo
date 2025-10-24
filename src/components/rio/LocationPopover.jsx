import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

function LocationPopover({ 
  isOpen, 
  anchorEl, 
  onClose, 
  location,
  centered = false
}) {
  const [triggerPosition, setTriggerPosition] = useState(null);

  useEffect(() => {
    if (anchorEl && isOpen && !centered) {
      const rect = anchorEl.getBoundingClientRect();
      setTriggerPosition({
        left: rect.left + rect.width / 2,
        top: rect.top + rect.height / 2
      });
    }
  }, [anchorEl, isOpen, centered]);

  if (!isOpen || !location) return null;
  if (!centered && (!anchorEl || !triggerPosition)) return null;

  const {
    title,
    badge,
    image,
    imageAlt,
    venture,
    partnershipText,
    width = '484px'
  } = location;

  const content = (
    <>
      {/* Arrow pointing up */}
      <div className="absolute top-[-7px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-10 border-b-white z-1001" />
      <div className="md:gap-3 max-[480px]:py-2.5 max-[480px]:gap-2.5 max-[360px]:p-2 flex flex-col gap-2">
        {/* Header */}
        <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 max-[480px]:gap-1.5">
          <div className="flex p-1 md:p-1.5 max-[480px]:p-[5px] items-center justify-center bg-grey-100 rounded-md w-[17px] h-[17px] md:w-7 md:h-7 max-[480px]:w-6 max-[480px]:h-6 shrink-0">
            <svg className="w-3 h-3 md:w-3.5 md:h-3.5 max-[480px]:w-3 max-[480px]:h-3" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M29.662 12.1512C28.2423 5.84098 22.7932 3 18.0068 3C18.0068 3 18.0068 3 17.9932 3C13.2203 3 7.75772 5.82732 6.338 12.1376C4.75602 19.1854 9.02871 25.1541 12.8958 28.9102C14.329 30.3034 16.1679 31 18.0068 31C19.8456 31 21.6845 30.3034 23.1042 28.9102C26.9713 25.1541 31.244 19.199 29.662 12.1512ZM18.0068 18.9941C15.6541 18.9941 13.7476 17.0683 13.7476 14.6917C13.7476 12.3151 15.6541 10.3893 18.0068 10.3893C20.3594 10.3893 22.2659 12.3151 22.2659 14.6917C22.2659 17.0683 20.3594 18.9941 18.0068 18.9941Z" fill="#343434"/>
            </svg>
          </div>
          <div className="text-grey-800 font-[ShellBook,'-apple-system',Roboto,Helvetica,sans-serif] text-[10px] md:text-[16px] max-[480px]:text-[14px] max-[360px]:text-xs font-normal leading-normal whitespace-nowrap">{badge}</div>
        </div>
        <h1 className="text-grey-800 font-[ShellBold,'-apple-system',Roboto,Helvetica,sans-serif] text-lg md:text-3xl max-[480px]:text-2xl max-[360px]:text-xl font-bold leading-normal m-0 whitespace-nowrap">{title}</h1>
        {image && (
          <img 
            className="w-full h-[110px] object-cover rounded-md" 
            src={image} 
            alt={imageAlt || `Instalação industrial em ${title}`} 
          />
        )}
      </div>

      {/* Joint Ventures */}
      <div className="flex flex-col gap-1.5 max-[480px]:gap-2.5">
        <h2 className="text-grey-600 font-[ShellMedium,'-apple-system',Roboto,Helvetica,sans-serif] text-[10px] md:text-[16px] max-[480px]:text-[14px] max-[360px]:text-xs font-medium leading-normal m-0 whitespace-nowrap">Joint Ventures / Participações parciais</h2>
        <div className="flex flex-col gap-1 md:gap-2.5">
          <div className="flex items-center gap-1.5 md:gap-2 max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-1.5">
            <img 
              className="w-6 h-6 md:w-10 md:h-10 max-[480px]:w-[30px] max-[480px]:h-[30px] rounded-md border border-grey-100 shrink-0 object-cover" 
              src={venture.logo} 
              alt={`${venture.name} logo`} 
            />
            <div className="flex flex-col gap-1 flex-1">
              <h3 className="text-grey-800 font-[ShellBook,'-apple-system',Roboto,Helvetica,sans-serif] text-xs md:text-lg max-[480px]:text-base max-[360px]:text-sm font-normal leading-normal m-0 whitespace-nowrap">{venture.name}</h3>
              <div className="flex items-center gap-1.5 md:gap-1 whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.22095 26.5286H11.7209V19.1C11.7209 18.679 11.8647 18.3262 12.1522 18.0414C12.4397 17.7567 12.7959 17.6143 13.2209 17.6143H19.2209C19.6459 17.6143 20.0022 17.7567 20.2897 18.0414C20.5772 18.3262 20.7209 18.679 20.7209 19.1V26.5286H25.2209V13.1571L16.2209 6.47143L7.22095 13.1571V26.5286ZM4.22095 26.5286V13.1571C4.22095 12.6867 4.3272 12.241 4.5397 11.82C4.7522 11.399 5.04595 11.0524 5.42095 10.78L14.4209 4.09429C14.9459 3.6981 15.5459 3.5 16.2209 3.5C16.8959 3.5 17.4959 3.6981 18.0209 4.09429L27.0209 10.78C27.3959 11.0524 27.6897 11.399 27.9022 11.82C28.1147 12.241 28.2209 12.6867 28.2209 13.1571V26.5286C28.2209 27.3457 27.9272 28.0452 27.3397 28.6271C26.7522 29.209 26.0459 29.5 25.2209 29.5H19.2209C18.7959 29.5 18.4397 29.3576 18.1522 29.0729C17.8647 28.7881 17.7209 28.4352 17.7209 28.0143V20.5857H14.7209V28.0143C14.7209 28.4352 14.5772 28.7881 14.2897 29.0729C14.0022 29.3576 13.6459 29.5 13.2209 29.5H7.22095C6.39595 29.5 5.6897 29.209 5.1022 28.6271C4.5147 28.0452 4.22095 27.3457 4.22095 26.5286Z" fill="#616161"/>
                  </svg>
                  <span className="text-grey-600 font-[ShellBook,'-apple-system',Roboto,Helvetica,sans-serif] text-[10px] md:text-[16px] max-[480px]:text-xs max-[360px]:text-[10px] font-normal leading-normal">{venture.business}</span>
                </div>
                <span className="text-sm text-grey-600">•</span>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5209 15.2H26.5559C26.2309 12.8167 25.2397 10.7962 23.5822 9.13875C21.9247 7.48125 19.9043 6.49 17.5209 6.165V15.2ZM14.9209 26.835V6.165C12.2993 6.49 10.1272 7.63292 8.4047 9.59375C6.6822 11.5546 5.82095 13.8567 5.82095 16.5C5.82095 19.1433 6.6822 21.4454 8.4047 23.4062C10.1272 25.3671 12.2993 26.51 14.9209 26.835ZM17.5209 26.835C19.9043 26.5317 21.9301 25.5458 23.5984 23.8775C25.2668 22.2092 26.2526 20.1833 26.5559 17.8H17.5209V26.835ZM16.2209 29.5C14.4226 29.5 12.7326 29.1587 11.1509 28.4762C9.56928 27.7937 8.19345 26.8675 7.02345 25.6975C5.85345 24.5275 4.9272 23.1517 4.2447 21.57C3.5622 19.9883 3.22095 18.2983 3.22095 16.5C3.22095 14.7017 3.5622 13.0117 4.2447 11.43C4.9272 9.84833 5.85345 8.4725 7.02345 7.3025C8.19345 6.1325 9.56928 5.20625 11.1509 4.52375C12.7326 3.84125 14.4226 3.5 16.2209 3.5C18.0193 3.5 19.7039 3.84125 21.2747 4.52375C22.8455 5.20625 24.2214 6.13792 25.4022 7.31875C26.583 8.49958 27.5147 9.87542 28.1972 11.4462C28.8797 13.0171 29.2209 14.7017 29.2209 16.5C29.2209 18.2767 28.8797 19.9558 28.1972 21.5375C27.5147 23.1192 26.5884 24.5004 25.4184 25.6812C24.2484 26.8621 22.8726 27.7937 21.2909 28.4762C19.7093 29.1587 18.0193 29.5 16.2209 29.5Z" fill="#616161"/>
                  </svg>
                  <span className="text-grey-600 font-[ShellMedium,'-apple-system',Roboto,Helvetica,sans-serif] text-[10px] md:text-[16px] max-[480px]:text-xs max-[360px]:text-[10px] font-medium leading-normal">{venture.ownership}</span>
                </div>
              </div>
            </div>
          </div>
          {partnershipText && (
            <p className="text-grey-600 font-[ShellBook,'-apple-system',Roboto,Helvetica,sans-serif] text-[11px] md:text-[16px] max-[480px]:text-xs max-[360px]:text-[10px] font-normal leading-normal m-0">
              {partnershipText}
            </p>
          )}
        </div>
      </div>

        {/* Close Button */}
        <button 
          className="flex w-full items-center justify-center p-2 border border-grey-400 font-bold text-lg rounded-md hover:bg-grey-50 hover:border-grey-600 transition-colors outline-none focus:outline-none focus:border-grey-600 whitespace-nowrap" 
          onClick={onClose}
          style={{ border: '1px solid #919191' }}
        >
          Fechar
        </button>
      </div>
    </>
  );

  // Se centered, renderiza como modal centralizado
  if (centered) {
    return createPortal(
      <div 
        className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-1000 p-5 box-border"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-[484px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Arrow pointing down */}
          <div className="absolute -bottom-[19px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-14 border-l-transparent border-r-14 border-r-transparent border-t-20 border-t-white z-1001" />
          <div className="py-5 px-8 w-full border border-grey-100 rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
            {content}
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // Renderiza popover posicionado se houver anchorEl
  return createPortal(
    <Popover open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <PopoverTrigger asChild>
        <div 
          style={{
            position: 'fixed',
            left: `${triggerPosition.left}px`,
            top: `${triggerPosition.top * 1.08 }px`,
            width: '1px',
            height: '1px',
            pointerEvents: 'none'
          }}
        />
      </PopoverTrigger>
      <PopoverContent 
        className="py-5 px-8 w-max max-w-[calc(100vw-40px)] border-grey-100 rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] relative"
        side="bottom"
        align="center"
        sideOffset={27}
        onInteractOutside={onClose}
      >
        {content}
      </PopoverContent>
    </Popover>,
    document.body
  );
}

export default LocationPopover;
