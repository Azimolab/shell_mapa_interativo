import React from 'react';
import { createPortal } from 'react-dom';
import './production_2.css';

function production_2({ isOpen, onClose }) {
  if (!isOpen) return null;

  const companyData = [
    {
      id: 'shell',
      name: 'Shell*',
      percentage: 80,
      color: '#DD1D21',
      isOperator: true
    },
    {
      id: 'ongc',
      name: 'ONGC',
      percentage: 27,
      color: '#616161',
      isOperator: false
    },
    {
      id: 'qatar',
      name: 'Qatar Petroleum',
      percentage: 23,
      color: '#616161',
      isOperator: false
    }
  ];

  return createPortal(
    <div className="production_2-overlay" onClick={onClose}>
      <div className="production_2-container" onClick={(e) => e.stopPropagation()}>
        <div className="production_2-arrow" />
        <div className="production_2-card">
          <div className="production_2-content">
            {/* Header Section */}
            <div className="production_2-header">
              <div className="production_2-status-section">
                <div className="production_2-status-badge">
                  <div className="production_2-status-icon">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.0002 31.05C15.1252 31.05 12.7314 30.0625 10.8189 28.0875C8.90645 26.1125 7.9502 23.65 7.9502 20.7C7.9502 18.65 8.78145 16.3688 10.4439 13.8563C12.1064 11.3438 14.6252 8.57505 18.0002 5.55005C21.3752 8.57505 23.8939 11.3438 25.5564 13.8563C27.2189 16.3688 28.0502 18.65 28.0502 20.7C28.0502 23.65 27.0939 26.1125 25.1814 28.0875C23.2689 30.0625 20.8752 31.05 18.0002 31.05Z" fill="white"/>
                    </svg>
                  </div>
                  <span className="production_2-status-text">Em produção</span>
                </div>
                <h1 className="production_2-title">Parque das Conchas</h1>
              </div>

              {/* Info Section */}
              <div className="production_2-info-grid">
                <div className="production_2-info-item">
                  <div className="production_2-info-label">
                    <div className="production_2-info-icon">
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.9996 30.75C17.6806 30.75 17.4135 30.6421 17.1982 30.4264C16.9827 30.2109 16.875 29.9438 16.875 29.625V20.7056L10.575 27.0289C10.352 27.2519 10.0871 27.3658 9.78038 27.3705C9.47363 27.3755 9.20388 27.2616 8.97112 27.0289C8.73837 26.7961 8.622 26.5288 8.622 26.2268C8.622 25.925 8.73837 25.6578 8.97112 25.425L15.2944 19.125H6.375C6.05625 19.125 5.78913 19.0171 5.57363 18.8014C5.35788 18.5856 5.25 18.3184 5.25 17.9996C5.25 17.6806 5.35788 17.4135 5.57363 17.1982C5.78913 16.9827 6.05625 16.875 6.375 16.875H15.2944L8.97112 10.575C8.74813 10.352 8.63425 10.0848 8.6295 9.77325C8.6245 9.4615 8.736 9.19412 8.964 8.97112C9.19175 8.74812 9.4615 8.639 9.77325 8.64375C10.0848 8.6485 10.352 8.7625 10.575 8.98575L16.875 15.3086V6.375C16.875 6.05625 16.9829 5.78913 17.1986 5.57363C17.4144 5.35788 17.6816 5.25 18.0004 5.25C18.3194 5.25 18.5865 5.35788 18.8018 5.57363C19.0173 5.78913 19.125 6.05625 19.125 6.375V15.3086L25.4393 8.97112C25.6625 8.74812 25.9275 8.639 26.2343 8.64375C26.541 8.6485 26.8059 8.7615 27.0289 8.98275C27.2519 9.20375 27.3634 9.46613 27.3634 9.76988C27.3634 10.0739 27.2519 10.3375 27.0289 10.5608L20.6914 16.875H29.625C29.9438 16.875 30.2109 16.9829 30.4264 17.1986C30.6421 17.4144 30.75 17.6816 30.75 18.0004C30.75 18.3194 30.6421 18.5865 30.4264 18.8018C30.2109 19.0173 29.9438 19.125 29.625 19.125H20.6914L27.0289 25.4393C27.2519 25.6625 27.3634 25.9275 27.3634 26.2342C27.3634 26.541 27.2519 26.8083 27.0289 27.036C26.8059 27.264 26.5385 27.3755 26.2268 27.3705C25.9153 27.3658 25.648 27.2519 25.425 27.0289L19.125 20.7056V29.625C19.125 29.9438 19.0171 30.2109 18.8014 30.4264C18.5856 30.6421 18.3184 30.75 17.9996 30.75Z" fill="#343434"/>
                      </svg>
                    </div>
                    <span className="production_2-info-label-text">Operadora</span>
                  </div>
                  <div className="production_2-info-details">
                    <div className="production_2-info-value">Shell</div>
                    <div className="production_2-info-description">Responsável pela administração do campo</div>
                  </div>
                </div>

                <div className="production_2-info-item">
                  <div className="production_2-info-label">
                    <div className="production_2-info-icon">
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.875 26.4258V9.54518L14.8905 11.5154C14.6852 11.7229 14.4286 11.8267 14.1206 11.8267C13.8126 11.8267 13.5462 11.7152 13.3215 11.4922C13.1155 11.2877 13.0125 11.0274 13.0125 10.7114C13.0125 10.3954 13.1163 10.1336 13.3241 9.9258L17.0467 6.20318C17.19 6.05993 17.3412 5.95955 17.5005 5.90205C17.6597 5.8443 17.8303 5.81543 18.0123 5.81543C18.1946 5.81543 18.3636 5.8443 18.5193 5.90205C18.6751 5.95955 18.8245 6.05993 18.9675 6.20318L22.6905 9.9258C22.898 10.1336 23.0042 10.3884 23.0092 10.6904C23.014 10.9922 22.9087 11.2594 22.6935 11.4922C22.4587 11.7249 22.1903 11.8413 21.8883 11.8413C21.5866 11.8413 21.3193 11.7249 21.0866 11.4922L19.125 9.54518V26.4258L21.1095 24.4702C21.3147 24.2624 21.5713 24.1586 21.8793 24.1586C22.1873 24.1586 22.4537 24.2701 22.6785 24.4931C22.8845 24.6976 22.9875 24.9578 22.9875 25.2738C22.9875 25.5898 22.8836 25.8517 22.6758 26.0594L18.9532 29.7821C18.81 29.9253 18.6598 30.0258 18.5028 30.0836C18.3458 30.1413 18.1776 30.1702 17.9981 30.1702C17.8186 30.1702 17.6481 30.1411 17.4866 30.0828C17.3251 30.0248 17.1751 29.9261 17.0366 29.7866L13.3095 26.0594C13.105 25.8542 12.9981 25.5976 12.9888 25.2896C12.9796 24.9818 13.0865 24.7156 13.3095 24.4908C13.514 24.2848 13.7742 24.1818 14.0902 24.1818C14.4062 24.1818 14.6681 24.2856 14.8758 24.4931L16.875 26.4258Z" fill="#343434"/>
                      </svg>
                    </div>
                    <span className="production_2-info-label-text">Profundidade</span>
                  </div>
                  <div className="production_2-info-details">
                    <div className="production_2-info-value">~1.780m</div>
                    <div className="production_2-info-description">Distância da superfície do mar até o fundo</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="production_2-divider" />

            {/* Company Participation Section */}
            <div className="production_2-participation">
              <h2 className="production_2-participation-title">Participação das empresas</h2>
              <div className="production_2-companies">
                {companyData.map((company) => (
                  <div key={company.id} className="production_2-company">
                    <div className="production_2-company-header">
                      <span className={`production_2-company-name ${company.isOperator ? 'operator' : ''}`}>
                        {company.name}
                      </span>
                      <span className="production_2-company-percentage">
                        {company.percentage}%
                      </span>
                    </div>
                    <div className="production_2-progress-bar">
                      <div 
                        className="production_2-progress-fill"
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

            {/* Divider */}
            <div className="production_2-divider" />

            {/* Infrastructure Section */}
            <div className="production_2-infrastructure">
              <h2 className="production_2-infrastructure-title">Infraestrutura associada</h2>
              <div className="production_2-infrastructure-content">
                <div className="production_2-fpso-info">
                  <div className="production_2-fpso-title">1 FPSO em operação</div>
                  <div className="production_2-fpso-description">Unidade flutuante de produção, armazenamento e transferência de petróleo</div>
                </div>
                <div className="production_2-bullet-item">
                  <div className="production_2-bullet-number">
                    <span>1</span>
                  </div>
                  <span className="production_2-bullet-text">Espírito Santo</span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button className="production_2-close-button" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default production_2;
