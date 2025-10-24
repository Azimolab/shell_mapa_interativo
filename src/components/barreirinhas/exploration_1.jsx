import React from 'react';
import './exploration_1.css';

function exploration_1({ isOpen, onClose }) {
  if (!isOpen) return null;

  const companyData = [
    {
      id: 'shell',
      name: 'Shell*',
      percentage: 65,
      color: '#DD1D21',
      isOperator: true
    },
    {
      id: 'pttep',
      name: 'PTTEP',
      percentage: 25,
      color: '#616161',
      isOperator: false
    },
    {
      id: 'mitsui',
      name: 'Mitsui',
      percentage: 10,
      color: '#616161',
      isOperator: false
    }
  ];

  return (
    <div className="barreirinhas_exploration_1-overlay" onClick={onClose}>
      <div className="barreirinhas_exploration_1-container" onClick={(e) => e.stopPropagation()}>
        <div className="barreirinhas_exploration_1-arrow" />
        <div className="barreirinhas_exploration_1-card">
          <div className="barreirinhas_exploration_1-content">
            {/* Header Section */}
            <div className="barreirinhas_exploration_1-header">
              <div className="barreirinhas_exploration_1-status-section">
                <div className="barreirinhas_exploration_1-status-badge">
                  <div className="barreirinhas_exploration_1-status-icon">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.0001 31.7884C16.1271 31.7884 14.5338 31.1316 13.2203 29.8181C11.9068 28.5046 11.2501 26.9114 11.2501 25.0384C11.2501 23.1654 11.9068 21.5721 13.2203 20.2586C14.5338 18.9451 16.1271 18.2884 18.0001 18.2884C19.8731 18.2884 21.4663 18.9451 22.7798 20.2586C24.0933 21.5721 24.7501 23.1654 24.7501 25.0384C24.7501 26.9114 24.0933 28.5046 22.7798 29.8181C21.4663 31.1316 19.8731 31.7884 18.0001 31.7884ZM10.5289 17.6767L4.09619 11.2155C5.99044 9.44623 8.13282 8.08661 10.5233 7.13661C12.9136 6.18661 15.4058 5.71161 18.0001 5.71161C20.5943 5.71161 23.0866 6.18661 25.4768 7.13661C27.8673 8.08661 30.0097 9.44623 31.9039 11.2155L25.4712 17.6767C24.4367 16.7287 23.2819 15.9975 22.0069 15.483C20.7319 14.9687 19.3963 14.7116 18.0001 14.7116C16.6038 14.7116 15.2682 14.9687 13.9932 15.483C12.7182 15.9975 11.5634 16.7287 10.5289 17.6767Z" fill="white"/>
                    </svg>
                  </div>
                  <span className="barreirinhas_exploration_1-status-text">Em exploração</span>
                </div>
                <h1 className="barreirinhas_exploration_1-title">Bacia de Barreirinhas</h1>
              </div>

              {/* Info Section */}
              <div className="barreirinhas_exploration_1-info-grid">
                <div className="barreirinhas_exploration_1-info-item">
                  <div className="barreirinhas_exploration_1-info-label">
                    <div className="barreirinhas_exploration_1-info-icon">
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.9996 30.75C17.6806 30.75 17.4135 30.6421 17.1982 30.4264C16.9827 30.2109 16.875 29.9438 16.875 29.625V20.7056L10.575 27.0289C10.352 27.2519 10.0871 27.3658 9.78038 27.3705C9.47363 27.3755 9.20388 27.2616 8.97112 27.0289C8.73837 26.7961 8.622 26.5288 8.622 26.2268C8.622 25.925 8.73837 25.6578 8.97112 25.425L15.2944 19.125H6.375C6.05625 19.125 5.78913 19.0171 5.57363 18.8014C5.35788 18.5856 5.25 18.3184 5.25 17.9996C5.25 17.6806 5.35788 17.4135 5.57363 17.1982C5.78913 16.9827 6.05625 16.875 6.375 16.875H15.2944L8.97112 10.575C8.74813 10.352 8.63425 10.0848 8.6295 9.77325C8.6245 9.4615 8.736 9.19412 8.964 8.97112C9.19175 8.74812 9.4615 8.639 9.77325 8.64375C10.0848 8.6485 10.352 8.7625 10.575 8.98575L16.875 15.3086V6.375C16.875 6.05625 16.9829 5.78913 17.1986 5.57363C17.4144 5.35788 17.6816 5.25 18.0004 5.25C18.3194 5.25 18.5865 5.35788 18.8018 5.57363C19.0173 5.78913 19.125 6.05625 19.125 6.375V15.3086L25.4393 8.97112C25.6625 8.74812 25.9275 8.639 26.2343 8.64375C26.541 8.6485 26.8059 8.7615 27.0289 8.98275C27.2519 9.20375 27.3634 9.46613 27.3634 9.76988C27.3634 10.0739 27.2519 10.3375 27.0289 10.5608L20.6914 16.875H29.625C29.9438 16.875 30.2109 16.9829 30.4264 17.1986C30.6421 17.4144 30.75 17.6816 30.75 18.0004C30.75 18.3194 30.6421 18.5865 30.4264 18.8018C30.2109 19.0173 29.9438 19.125 29.625 19.125H20.6914L27.0289 25.4393C27.2519 25.6625 27.3634 25.9275 27.3634 26.2342C27.3634 26.541 27.2519 26.8083 27.0289 27.036C26.8059 27.264 26.5385 27.3755 26.2268 27.3705C25.9153 27.3658 25.648 27.2519 25.425 27.0289L19.125 20.7056V29.625C19.125 29.9438 19.0171 30.2109 18.8014 30.4264C18.5856 30.6421 18.3184 30.75 17.9996 30.75Z" fill="#343434"/>
                      </svg>
                    </div>
                    <span className="barreirinhas_exploration_1-info-label-text">Operadora</span>
                  </div>
                  <div className="barreirinhas_exploration_1-info-details">
                    <div className="barreirinhas_exploration_1-info-value">Shell</div>
                    <div className="barreirinhas_exploration_1-info-description">Responsável pela administração do campo</div>
                  </div>
                </div>

                <div className="barreirinhas_exploration_1-info-item">
                  <div className="barreirinhas_exploration_1-info-label">
                    <div className="barreirinhas_exploration_1-info-icon">
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.875 26.4259V9.54524L14.8905 11.5155C14.6852 11.723 14.4286 11.8267 14.1206 11.8267C13.8126 11.8267 13.5462 11.7152 13.3215 11.4922C13.1155 11.2877 13.0125 11.0275 13.0125 10.7115C13.0125 10.3955 13.1163 10.1336 13.3241 9.92587L17.0467 6.20324C17.19 6.05999 17.3412 5.95962 17.5005 5.90212C17.6597 5.84437 17.8303 5.81549 18.0123 5.81549C18.1946 5.81549 18.3636 5.84437 18.5193 5.90212C18.6751 5.95962 18.8245 6.05999 18.9675 6.20324L22.6905 9.92587C22.898 10.1336 23.0042 10.3885 23.0092 10.6905C23.014 10.9922 22.9087 11.2595 22.6935 11.4922C22.4587 11.725 22.1903 11.8414 21.8883 11.8414C21.5866 11.8414 21.3193 11.725 21.0866 11.4922L19.125 9.54524V26.4259L21.1095 24.4702C21.3147 24.2625 21.5713 24.1586 21.8793 24.1586C22.1873 24.1586 22.4537 24.2701 22.6785 24.4931C22.8845 24.6976 22.9875 24.9579 22.9875 25.2739C22.9875 25.5899 22.8836 25.8517 22.6758 26.0595L18.9532 29.7821C18.81 29.9254 18.6598 30.0259 18.5028 30.0836C18.3458 30.1414 18.1776 30.1702 17.9981 30.1702C17.8186 30.1702 17.6481 30.1411 17.4866 30.0829C17.3251 30.0249 17.1751 29.9261 17.0366 29.7866L13.3095 26.0595C13.105 25.8542 12.9981 25.5976 12.9888 25.2896C12.9796 24.9819 13.0865 24.7156 13.3095 24.4909C13.514 24.2849 13.7742 24.1819 14.0902 24.1819C14.4062 24.1819 14.6681 24.2856 14.8758 24.4931L16.875 26.4259Z" fill="#343434"/>
                      </svg>
                    </div>
                    <span className="barreirinhas_exploration_1-info-label-text">Profundidade</span>
                  </div>
                  <div className="barreirinhas_exploration_1-info-details">
                    <div className="barreirinhas_exploration_1-info-value">~2.500-4.000m</div>
                    <div className="barreirinhas_exploration_1-info-description">Distância da superfície do mar até o fundo</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Participation Section */}
            <div className="barreirinhas_exploration_1-participation">
              <h2 className="barreirinhas_exploration_1-participation-title">Participação das empresas</h2>
              <div className="barreirinhas_exploration_1-companies">
                {companyData.map((company) => (
                  <div key={company.id} className="barreirinhas_exploration_1-company">
                    <div className="barreirinhas_exploration_1-company-header">
                      <span className={`barreirinhas_exploration_1-company-name ${company.isOperator ? 'operator' : ''}`}>
                        {company.name}
                      </span>
                      <span className="barreirinhas_exploration_1-company-percentage">
                        {company.percentage}%
                      </span>
                    </div>
                    <div className="barreirinhas_exploration_1-progress-bar">
                      <div 
                        className="barreirinhas_exploration_1-progress-fill"
                        style={{
                          width: `${company.percentage}%`,
                          backgroundColor: company.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button className="barreirinhas_exploration_1-close-button" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default exploration_1;
