import React, { useState, useEffect } from 'react';
import './Toolbar.css';

// Importar ícones SVG
import ExploracaoIcon from '../assets/icons/Exploracao.svg';
import DesenvolvimentoIcon from '../assets/icons/Desenvolvimento.svg';
import ProducaoIcon from '../assets/icons/Producao.svg';
import DescomissionamentoIcon from '../assets/icons/Descomissionamento.svg';
import EyeIcon from '../assets/icons/eye.svg';
import EyeDisableIcon from '../assets/icons/eye_disable.svg';

function Toolbar({
  selectedArea = 'rio',
  selectedYear = '2025',
  onAreaSelect,
  onLegendToggle,
  activeLegendItems = {
    exploration: true,
    production: true,
    development: true,
    decommissioning: true
  },
  isZoneAvailable = () => true
}) {
  const [currentArea, setCurrentArea] = useState(selectedArea);

  // Sincronizar estado interno com prop externa
  useEffect(() => {
    setCurrentArea(selectedArea);
  }, [selectedArea]);

  // Mapear nomes das legendas de inglês para português
  const visibleLegends = {
    exploracao: activeLegendItems.exploration,
    desenvolvimento: activeLegendItems.development,
    producao: activeLegendItems.production,
    descomissionamento: activeLegendItems.decommissioning
  };

  // TODO: Implementar lógica para determinar availableLegends baseado nos dados
  // Por enquanto, todas as legendas estão disponíveis
  const availableLegends = {
    exploracao: true,
    desenvolvimento: true,
    producao: true,
    descomissionamento: true
  };

  const allAreas = [
    { id: 'barreirinhas', label: 'Barreirinhas' },
    { id: 'potiguar', label: 'Potiguar' },
    { id: 'rio', label: 'Rio' },
    { id: 'pelotas', label: 'Pelotas' }
  ];

  const handleAreaClick = (areaId) => {
    // Só permite click se zona estiver disponível
    if (isZoneAvailable(areaId, selectedYear)) {
      setCurrentArea(areaId);
      onAreaSelect?.(areaId);
    }
  };

  const toggleLegendVisibility = (legendId) => {
    // Mapear de volta para inglês para o callback
    const legendMap = {
      'exploracao': 'exploration',
      'desenvolvimento': 'development',
      'producao': 'production',
      'descomissionamento': 'decommissioning'
    };
    
    if (availableLegends[legendId] && onLegendToggle) {
      onLegendToggle(legendMap[legendId]);
    }
  };

  return (
    <div className="idiom-por" data-name="Idiom=POR" data-node-id="7:2558">
      {/* Map Selector */}
      <div className="map-selector" data-name="Map Selector" data-node-id="7:2474">
        <div className="header" data-name="Header" data-node-id="7:2475">
          <p className="section-title">Clique para alterar a área visualizada</p>
          <div className="menu" data-name="Menu" data-node-id="7:2477">
            {allAreas.map((area, index) => {
              const isActive = currentArea === area.id;
              const isAvailable = isZoneAvailable(area.id, selectedYear);
              return (
                <button
                  key={area.id}
                  className={`btn btn-${index + 1} ${isActive ? 'active' : 'inactive'} ${!isAvailable ? 'disabled' : ''}`}
                  data-name={`BTN_${index + 1}`}
                  data-node-id={`13:${4060 + index * 2 + (index > 0 ? 1 : 0)}`}
                  onClick={() => handleAreaClick(area.id)}
                  disabled={!isAvailable}
                >
                  {area.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="map-selector-content" data-name="MapSelector" data-node-id="13:4028">
          <svg className="map-vector" data-name="MapVector" viewBox="0 0 219 190" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M109.421 -29.5C109.421 -29.5 113.031 -26.8785 113.031 -25.4056C113.031 -23.9312 113.195 -20.0005 115 -17.3805C116.806 -14.759 116.314 -13.7771 118.611 -13.2846C120.908 -12.7936 121.237 -11.1556 120.58 -9.84483C119.924 -8.53409 118.283 -9.02505 116.314 -6.40656C114.345 -3.78506 113.031 -2.31067 111.39 -1.16357C109.749 -0.0179901 108.272 0.801773 108.437 2.11252C108.6 3.42177 110.57 3.42178 112.374 3.42178C114.179 3.42178 116.314 3.58543 116.642 2.43983C116.97 1.29276 117.955 -1.49239 120.088 -1.32724C122.221 -1.16359 125.174 -0.508957 127.473 -0.999924C129.77 -1.49239 130.919 -0.999924 130.098 0.965439C129.278 2.93082 128.458 4.0764 127.145 4.89618C125.831 5.71594 122.877 6.86154 121.237 7.18886C119.595 7.51765 115.166 8.66324 117.463 8.82838C119.76 8.99055 123.042 8.82838 123.042 9.64667C123.042 10.465 123.698 12.2667 125.339 10.6301C126.981 8.99055 124.848 9.48302 127.964 8.17227C131.083 6.86154 132.559 4.56885 133.545 3.75056C134.529 2.9308 139.451 2.6035 141.586 3.58543C143.719 4.56886 144.867 5.55229 147.001 6.69788C149.136 7.84497 149.136 8.49959 151.925 8.66325C154.715 8.8284 155.699 9.66603 157.012 11.2937C158.326 12.9228 159.965 14.5593 163.084 14.5593C166.202 14.5593 169.647 14.5593 173.257 15.5428C176.869 16.5262 181.299 15.7064 184.09 16.5262C186.879 17.3445 194.427 23.7316 196.398 24.8786C198.367 26.0257 204.604 28.4836 207.393 29.6292C210.182 30.7762 214.777 31.4309 215.761 34.3797C216.746 37.327 216.746 47.9736 215.761 50.7572C214.777 53.5424 213.793 54.8531 211.659 57.3109C209.526 59.7673 205.422 63.8616 203.29 66.318C201.156 68.7758 200.172 71.2322 199.68 73.1975C199.187 75.1644 196.068 78.7678 194.101 78.6027C192.13 78.439 189.997 78.1117 189.833 79.7497C189.669 81.3878 189.177 90.8873 189.177 94.1634C189.177 97.4395 190.325 100.388 188.848 105.137C187.372 109.888 187.043 108.086 185.729 112.181C184.418 116.275 185.237 116.931 183.268 120.043C181.299 123.154 180.479 122.5 179.166 126.103C177.853 129.707 177.525 132.163 176.705 134.128C175.884 136.095 174.408 136.257 173.095 137.568C171.782 138.879 172.765 142.155 169.484 142.646C166.202 143.137 164.397 142.482 163.74 141.826C163.084 141.172 161.279 140.681 159.965 141.172C158.652 141.664 157.996 139.862 154.058 141.991C150.12 144.12 149.462 144.284 148.806 145.102C148.149 145.922 145.36 147.069 143.719 147.56C142.078 148.051 139.289 148.215 138.467 149.853C137.648 151.491 139.289 151.327 136.828 152.474C134.365 153.62 133.053 153.456 132.067 154.767C131.083 156.076 131.083 156.405 130.098 157.878C129.114 159.354 129.77 160.827 128.458 161.647C127.145 162.465 126.487 162.63 126.981 163.447C127.473 164.266 128.13 163.939 127.964 165.741C127.801 167.543 127.309 169.508 128.458 170.819C129.606 172.128 130.262 172.62 129.77 173.93C129.278 175.24 128.13 177.207 126.653 177.698C125.174 178.189 123.042 178.68 122.385 180.974C121.729 183.267 120.088 186.87 119.267 187.361C118.447 187.854 116.97 187.361 115 187.361C113.031 187.361 111.556 187.525 111.39 189.163C111.226 190.801 111.39 193.094 109.913 193.421C108.437 193.75 107.507 192.603 106.411 194.896C105.319 197.188 104.663 197.681 104.825 198.99C104.989 200.301 105.268 201.775 104.8 203.086C104.334 204.397 104.989 204.724 103.184 205.707C101.379 206.689 99.5754 208 99.5754 208H-16.0377C-16.0377 208 -15.2999 201.94 -14.9705 198.337C-14.6425 194.732 -14.6425 194.896 -14.6425 192.439C-14.6425 189.981 -14.4785 188.999 -13.6572 187.034C-12.8389 185.069 -12.8389 183.594 -13.1653 182.285C-13.4947 180.974 -13.4947 178.189 -12.6734 176.551C-11.8521 174.915 -11.8521 173.275 -10.5403 169.672C-9.22706 166.068 -10.3763 167.543 -8.89912 163.121C-7.42191 158.698 -7.58588 155.75 -7.74985 152.802C-7.91531 149.853 -8.40722 147.56 -7.74985 145.595C-7.09398 143.628 -6.11015 128.396 -6.11015 123.811C-6.11015 119.224 -6.27264 113.164 -9.72046 111.033C-13.1653 108.904 -11.8521 107.43 -16.0377 105.465C-20.2234 103.501 -25.4734 101.207 -30.233 98.5866C-34.9926 95.9651 -39.0948 92.3617 -40.7345 89.2493C-42.3772 86.1383 -42.5396 84.6624 -44.5102 81.0605C-46.4794 77.457 -49.4323 71.7231 -51.7309 68.9395C-54.0279 66.1543 -57.9662 62.06 -58.4596 59.7673C-58.9515 57.4746 -58.7875 55.0182 -60.7566 53.8697C-62.7257 52.7241 -70 49.6116 -70 49.1207V-12.7936C-70 -12.7936 -67.1559 -14.268 -64.8588 -15.25C-62.5618 -16.2334 -59.2794 -15.4136 -57.4742 -16.888C-55.6691 -18.3624 -55.1772 -20.0005 -53.8639 -20.9824C-52.5507 -21.9658 -51.8948 -22.1295 -51.4029 -23.4402C-50.911 -24.751 -51.7309 -29.5 -51.7309 -29.5H109.421Z" fill="#BED50F" stroke="#81CCD9" strokeWidth="5" strokeMiterlimit="10" strokeLinejoin="round"/>
          </svg>
          
          <p className="map-title" data-node-id="I13:4028;13:3880">Brasil</p>
          
          <div className="selectors" data-name="Selectors" data-node-id="I13:4028;13:3881">
            <div className={`selector s-1 ${currentArea === 'barreirinhas' ? 'active' : 'inactive'}`} data-name="S_1" data-node-id="I13:4028;13:3891"></div>
            <div className={`selector s-2 ${currentArea === 'potiguar' ? 'active' : 'inactive'}`} data-name="S_2" data-node-id="I13:4028;13:3889"></div>
            <div className={`selector s-3 ${currentArea === 'rio' ? 'active' : 'inactive'}`} data-name="S_3" data-node-id="I13:4028;13:3885"></div>
            <div className={`selector s-4 ${currentArea === 'pelotas' ? 'active' : 'inactive'}`} data-name="S_4" data-node-id="I13:4028;13:3887"></div>
          </div>
        </div>
      </div>

      {/* Subtitles */}
      <div className="subtitles" data-name="Subtitles" data-node-id="7:2494">
        {/* Blocos Marítimos */}
        <div className="bloco-maritimo" data-name="BlocoMaritimo" data-node-id="7:2495">
          <h3 className="section-title">Blocos Marítimos</h3>
          <div className="menu" data-name="Menu" data-node-id="25:8400">
            <div className="filter-block" data-name="FilterBlock" data-node-id="7:2497">
              {/* Em exploração */}
              <div className={`exploracao ${!availableLegends.exploracao ? 'disabled' : ''}`} data-name="Exploracao" data-node-id="73:611">
                <div className="icon-text" data-name="IconText" data-node-id="I73:611;1:158">
                  <div className="icon-container" data-name="IconContainer" data-node-id="I73:611;1:159">
                    <div className="icon-box" data-name="IconBox" data-node-id="I73:611;1:160">
                      <img src={ExploracaoIcon} alt="Em exploração" />
                    </div>
                  </div>
                  <span className="legend-label" data-node-id="I73:611;1:162">Em exploração</span>
                </div>
                <button 
                  className={`button-default ${!availableLegends.exploracao ? 'disabled' : ''}`}
                  data-name="Button_Default_1" 
                  data-node-id="I73:611;1:163"
                  onClick={availableLegends.exploracao ? () => toggleLegendVisibility('exploracao') : undefined}
                  disabled={!availableLegends.exploracao}
                  style={!availableLegends.exploracao ? { pointerEvents: 'none' } : {}}
                >
                  <img 
                    src={visibleLegends.exploracao ? EyeIcon : EyeDisableIcon} 
                    alt={visibleLegends.exploracao ? "Visível" : "Oculto"} 
                  />
                </button>
              </div>

              {/* Em desenvolvimento */}
              <div className={`construcao ${!availableLegends.desenvolvimento ? 'disabled' : ''}`} data-name="Construcao" data-node-id="7:2498">
                <div className="icon-text" data-node-id="I7:2498;72:527">
                  <div className="icon-container" data-name="IconContainer" data-node-id="I7:2498;72:589">
                    <div className="icon-box" data-name="IconBox" data-node-id="I7:2498;80:686">
                      <img src={DesenvolvimentoIcon} alt="Em desenvolvimento" />
                    </div>
                  </div>
                  <span className="legend-label" data-node-id="I7:2498;72:533">Em desenvolvimento</span>
                </div>
                <button 
                  className={`button-default ${!availableLegends.desenvolvimento ? 'disabled' : ''}`}
                  data-name="Button_Default_3" 
                  data-node-id="I7:2498;72:534"
                  onClick={availableLegends.desenvolvimento ? () => toggleLegendVisibility('desenvolvimento') : undefined}
                  disabled={!availableLegends.desenvolvimento}
                  style={!availableLegends.desenvolvimento ? { pointerEvents: 'none' } : {}}
                >
                  <img 
                    src={visibleLegends.desenvolvimento ? EyeIcon : EyeDisableIcon} 
                    alt={visibleLegends.desenvolvimento ? "Visível" : "Oculto"} 
                  />
                </button>
              </div>

              {/* Em produção */}
              <div className={`producao ${!availableLegends.producao ? 'disabled' : ''}`} data-name="Producao" data-node-id="7:2499">
                <div className="icon-text" data-node-id="I7:2499;1:175">
                  <div className="icon-container" data-name="IconContainer" data-node-id="I7:2499;1:176">
                    <div className="icon-box" data-name="IconBox" data-node-id="I7:2499;1:177">
                      <img src={ProducaoIcon} alt="Em produção" />
                    </div>
                  </div>
                  <span className="legend-label" data-node-id="I7:2499;1:179">Em produção</span>
                </div>
                <button 
                  className={`button-default ${!availableLegends.producao ? 'disabled' : ''}`}
                  data-name="Button_Default_2" 
                  data-node-id="I7:2499;5:2276"
                  onClick={availableLegends.producao ? () => toggleLegendVisibility('producao') : undefined}
                  disabled={!availableLegends.producao}
                  style={!availableLegends.producao ? { pointerEvents: 'none' } : {}}
                >
                  <img 
                    src={visibleLegends.producao ? EyeIcon : EyeDisableIcon} 
                    alt={visibleLegends.producao ? "Visível" : "Oculto"} 
                  />
                </button>
              </div>

              {/* Em descomissionamento */}
              <div className={`descomissionamento ${!availableLegends.descomissionamento ? 'disabled' : ''}`} data-name="Descomissionamento" data-node-id="7:2500">
                <div className="icon-text" data-node-id="I7:2500;1:192">
                  <div className="icon-container" data-name="IconContainer" data-node-id="I7:2500;1:193">
                    <div className="icon-box" data-name="IconBox" data-node-id="I7:2500;1:194">
                      <img src={DescomissionamentoIcon} alt="Em descomissionamento" />
                    </div>
                  </div>
                  <span className="legend-label" data-node-id="I7:2500;1:198">Em descomissionamento</span>
                </div>
                <button 
                  className={`button-default ${!availableLegends.descomissionamento ? 'disabled' : ''}`}
                  data-name="Button_Default_3" 
                  data-node-id="I7:2500;5:2295"
                  onClick={availableLegends.descomissionamento ? () => toggleLegendVisibility('descomissionamento') : undefined}
                  disabled={!availableLegends.descomissionamento}
                  style={!availableLegends.descomissionamento ? { pointerEvents: 'none' } : {}}
                >
                  <img 
                    src={visibleLegends.descomissionamento ? EyeIcon : EyeDisableIcon} 
                    alt={visibleLegends.descomissionamento ? "Visível" : "Oculto"} 
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider" data-name="Divider" data-node-id="7:2501"></div>

        {/* Infraestrutura */}
        <div className="infraestrutura" data-name="Infraestrutura" data-node-id="7:2502">
          <h3 className="section-title">Infraestrutura</h3>
          <div className="menu" data-name="Menu" data-node-id="7:2504">
            {/* Óleoduto */}
            <div className="oleoduto" data-name="Oleoduto" data-node-id="7:2505">
              <div className="box-icon" data-name="BoxIcon" data-node-id="7:2506">
                <svg className="icon" width="18" height="18" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.0392 25.0672C18.6552 25.0672 18.3332 24.9374 18.0732 24.6776C17.8135 24.4176 17.6836 24.0956 17.6836 23.7116V19.125H4.9336C4.61484 19.125 4.3476 19.0171 4.13184 18.8014C3.91634 18.5856 3.8086 18.3184 3.8086 17.9996C3.8086 17.6806 3.91634 17.4135 4.13184 17.1978C4.3476 16.9819 4.61484 16.874 4.9336 16.874H17.6836V14.2884C17.6836 13.9044 17.8135 13.5824 18.0732 13.3224C18.3332 13.0626 18.6552 12.9327 19.0392 12.9327H30.4624C30.8464 12.9327 31.1684 13.0626 31.4284 13.3224C31.6882 13.5824 31.818 13.9044 31.818 14.2884V23.7116C31.818 24.0956 31.6882 24.4176 31.4284 24.6776C31.1684 24.9374 30.8464 25.0672 30.4624 25.0672H19.0392Z" fill="#ED8A00"/>
                </svg>
              </div>
              <span className="legend-label" data-node-id="7:2509">Óleoduto</span>
            </div>

            {/* Gasoduto */}
            <div className="gasoduto" data-name="Gasoduto" data-node-id="7:2510">
              <div className="box-icon" data-name="BoxIcon" data-node-id="7:2511">
                <svg className="icon" width="18" height="18" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24.5" cy="18" r="7" fill="#003758"/>
                  <path d="M5 18H18" stroke="#003758" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="legend-label" data-node-id="7:2515">Gasoduto</span>
            </div>

            {/* Infraestrutura de terceiros */}
            <div className="terceiros" data-name="Terceiros" data-node-id="7:2516">
              <div className="box-icon" data-name="BoxIcon" data-node-id="7:2517">
                <svg className="icon" width="18" height="18" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.5 18H31.5" stroke="#343434" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 7"/>
                </svg>
              </div>
              <span className="legend-label" data-node-id="7:2520">Infraestrutura de terceiros</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider" data-name="Divider" data-node-id="7:2521"></div>

        {/* Informações Adicionais */}
        <div className="informacoes-adicionais" data-name="InformaçõesAdicionais" data-node-id="7:2522">
          <h3 className="section-title">Informações Adicionais</h3>
          <div className="menu" data-name="Menu" data-node-id="7:2524">
            {/* Operador da plataforma */}
            <div className="operador" data-name="Operador" data-node-id="7:2525">
              <div className="box-icon" data-name="BoxIcone" data-node-id="7:2526">
                <svg className="icon" width="18" height="18" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.9996 30.75C17.6806 30.75 17.4135 30.6422 17.1978 30.4264C16.9819 30.2108 16.874 29.9438 16.874 29.625V20.7056L10.575 27.0288C10.352 27.2518 10.0871 27.3658 9.78038 27.3706C9.47363 27.3755 9.20388 27.2616 8.97113 27.0288C8.73838 26.7962 8.622 26.5288 8.622 26.2268C8.622 25.925 8.73838 25.6578 8.97113 25.425L15.2944 19.125H6.375C6.05625 19.125 5.78913 19.0171 5.57363 18.8014C5.35788 18.5856 5.25 18.3184 5.25 17.9996C5.25 17.6806 5.35788 17.4135 5.57363 17.1978C5.78913 16.9819 6.05625 16.874 6.375 16.874H15.2944L8.97113 10.575C8.74813 10.352 8.63425 10.0848 8.6295 9.77325C8.625 9.4615 8.73663 9.19413 8.97 8.97113C9.20175 8.74813 9.4615 8.639 9.74925 8.64375C10.0348 8.64851 10.352 8.7625 10.575 8.98575L16.874 15.2886V6.375C16.874 6.05625 16.9819 5.78913 17.1976 5.57363C17.4134 5.35788 17.6806 5.25 17.9994 5.25C18.3184 5.25 18.5855 5.35788 18.8012 5.57363C19.0171 5.78913 19.125 6.05625 19.125 6.375V15.2886L25.4392 8.97113C25.6626 8.74813 25.9276 8.639 26.2342 8.64375C26.541 8.64851 26.8058 8.7615 27.0288 8.97275C27.2518 9.18375 27.3634 9.44613 27.3634 9.75988C27.3634 10.0739 27.2518 10.3375 27.0288 10.5508L20.6914 16.874H29.625C29.9438 16.874 30.2108 16.9819 30.4264 17.1976C30.6422 17.4134 30.75 17.6806 30.75 17.9994C30.75 18.3184 30.6422 18.5855 30.4264 18.8012C30.2108 19.0171 29.9438 19.125 29.625 19.125H20.6914L27.0288 25.4392C27.2518 25.6626 27.3634 25.9274 27.3634 26.2342C27.3634 26.541 27.2518 26.8082 27.0288 27.036C26.8058 27.264 26.5386 27.3756 26.2268 27.3706C25.9152 27.3658 25.648 27.2518 25.425 27.0288L19.125 20.7056V29.625C19.125 29.9438 19.0171 30.2108 18.8014 30.4264C18.5856 30.6422 18.3184 30.75 17.9996 30.75Z" fill="#343434"/>
                </svg>
              </div>
              <span className="legend-label" data-node-id="7:2529">Operador da plataforma</span>
            </div>

            {/* Profundidade */}
            <div className="profundidade" data-name="Profundidade" data-node-id="7:2530">
              <div className="box-icon" data-name="BoxIcon" data-node-id="7:2531">
                <svg className="icon" width="18" height="18" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.875 26.426V9.54531L14.8905 11.5156C14.6852 11.7231 14.4286 11.8268 14.1206 11.8268C13.8126 11.8268 13.5462 11.7153 13.3215 11.4923C13.1155 11.2878 13.0124 11.0276 13.0124 10.7116C13.0124 10.3956 13.1164 10.1337 13.3241 9.92592L17.0467 6.2033C17.19 6.06006 17.3412 5.95968 17.5005 5.90218C17.6597 5.84442 17.8303 5.81556 18.0123 5.81556C18.1946 5.81556 18.3636 5.84442 18.5194 5.90218C18.6751 5.95968 18.8245 6.06006 18.9675 6.2033L22.6904 9.92592C22.898 10.1337 23.0042 10.3886 23.0092 10.6906C23.014 10.9923 22.9088 11.2596 22.6936 11.4923C22.4588 11.7251 22.1904 11.8414 21.8884 11.8414C21.5866 11.8414 21.3194 11.7251 21.0866 11.4923L19.125 9.54531V26.426L21.1095 24.4704C21.3148 24.2626 21.5714 24.1586 21.8794 24.1586C22.1874 24.1586 22.4538 24.2702 22.6785 24.4932C22.8845 24.6976 22.9876 24.958 22.9876 25.274C22.9876 25.59 22.8836 25.8519 22.6758 26.0596L18.9532 29.7822C18.81 29.9254 18.6598 30.026 18.5028 30.0838C18.3458 30.1415 18.1776 30.1704 17.9981 30.1704C17.8186 30.1704 17.6481 30.1412 17.4865 30.0829C17.3251 30.0247 17.1751 29.9262 17.0366 29.7866L13.3095 26.0596C13.105 25.8552 12.9981 25.5976 12.9885 25.287C12.979 24.9761 13.0847 24.7156 13.3054 24.5055C13.5142 24.285 13.7715 24.1748 14.0772 24.1748C14.3829 24.1748 14.6368 24.2856 14.8384 24.5073L16.875 26.426Z" fill="#343434"/>
                </svg>
              </div>
              <span className="legend-label" data-node-id="7:2534">Profundidade</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;

