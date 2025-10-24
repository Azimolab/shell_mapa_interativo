import React, { useState, useEffect } from 'react';

function Toolbar({
  selectedArea = 'rio',
  selectedYear = '2025',
  onAreaSelect,
  onLegendToggle,
  activeLegendItems = {
    exploration: true,
    production: true,
    decommissioning: true
  },
  isZoneAvailable = () => true
}) {
  const [currentArea, setCurrentArea] = useState(selectedArea);

  // Update local state when prop changes
  useEffect(() => {
    setCurrentArea(selectedArea);
  }, [selectedArea]);

  const areas = [
    { id: 'barreirinhas', label: 'Barreirinhas' },
    { id: 'potiguar', label: 'Potiguar' },
    { id: 'rio', label: 'Rio de Janeiro' },
    { id: 'pelotas', label: 'Pelotas' }
  ];

  // Filtrar apenas áreas disponíveis para o ano selecionado
  const availableAreas = areas.filter(area => isZoneAvailable(area.id, selectedYear));

  // Ajustar o label do Rio baseado na quantidade de áreas disponíveis
  const areasWithAdjustedLabels = availableAreas.map(area => {
    if (area.id === 'rio') {
      return {
        ...area,
        label: availableAreas.length >= 4 ? 'Rio' : 'Rio de Janeiro'
      };
    }
    return area;
  });

  const handleAreaClick = (areaId) => {
    // Only allow click if zone is available
    if (isZoneAvailable(areaId, selectedYear)) {
      setCurrentArea(areaId);
      onAreaSelect?.(areaId);
    }
  };

  const handleLegendToggle = (itemId) => {
    onLegendToggle?.(itemId);
  };

  return (
    <div className="inline-flex flex-col items-start -gap-px rounded-lg border-[2.5px] border-white bg-white w-[359px] max-w-full shadow-[0_4px_20px_rgba(0,0,0,0.1)] scale-75 origin-top-right lg:w-full lg:max-w-[600px] lg:border-[3px] md:border-2 sm:border">
      {/* Map Selector Section */}
      <div className="flex flex-col items-start -gap-[2px] relative w-full">
        <div className="flex p-[18px_29px] lg:p-[24px_36px] md:p-[20px_24px] sm:p-[16px_20px] flex-col justify-center items-start gap-4 lg:gap-6 md:gap-5 sm:gap-4 self-stretch rounded-t-lg bg-white relative">
          <h2 className="self-stretch text-[#616161] font-['ShellMedium',-apple-system,Roboto,Helvetica,sans-serif] text-[13px] lg:text-[22px] md:text-[20px] sm:text-[18px] font-medium leading-normal m-0">
            Clique para alterar a área visualizada
          </h2>
          <div className="flex items-start gap-1.5 lg:gap-2 md:gap-2 sm:gap-1.5 flex-nowrap sm:overflow-x-auto">
            {areasWithAdjustedLabels.map((area) => {
              const isActive = area.id === currentArea;

              return (
                <button
                  key={area.id}
                  className={`flex p-3 lg:p-[18px] md:p-[14px_18px] sm:p-[12px_16px] justify-center items-center gap-[5px] rounded-md border-none cursor-pointer transition-all duration-200 font-['ShellBold',-apple-system,Roboto,Helvetica,sans-serif] text-[11px] lg:text-[18px] md:text-base sm:text-sm font-bold leading-normal whitespace-nowrap hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] ${
                    isActive
                      ? 'bg-[#027FA2] text-[#F5F5F5] border border-[#027FA2]'
                      : 'border border-[#919191] bg-transparent text-[#343434]'
                  }`}
                  onClick={() => handleAreaClick(area.id)}
                >
                  {area.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-[358.5px] h-[189.5px] lg:w-full lg:h-[300px] md:h-[250px] sm:h-[200px] bg-[#C0E6EC] relative overflow-hidden">
          <svg className="w-[287px] h-[238px] lg:w-[450px] lg:h-[375px] md:w-[350px] md:h-[290px] sm:w-[280px] sm:h-[230px] shrink-0 stroke-[5px] absolute -left-[70px] -top-[29px] lg:-left-[110px] lg:-top-[45px] md:-left-20 md:-top-[35px] sm:-left-[60px] sm:-top-[25px]" viewBox="0 0 438 379" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M218.842 -59C218.842 -59 226.063 -53.757 226.063 -50.8112C226.063 -47.8624 226.391 -40.0009 230.001 -34.761C233.611 -29.518 232.627 -27.5541 237.222 -26.5692C241.816 -25.5872 242.475 -22.3112 241.16 -19.6897C239.848 -17.0682 236.566 -18.0501 232.627 -12.8131C228.689 -7.57013 226.063 -4.62134 222.78 -2.32715C219.498 -0.0359802 216.544 1.60355 216.874 4.22504C217.199 6.84354 221.141 6.84357 224.748 6.84357C228.358 6.84357 232.627 7.17087 233.283 4.87967C233.939 2.58551 235.91 -2.98477 240.176 -2.65448C244.442 -2.32718 250.348 -1.01791 254.945 -1.99985C259.539 -2.98477 261.838 -1.99985 260.195 1.93088C258.555 5.86163 256.916 8.1528 254.289 9.79236C251.663 11.4319 245.754 13.7231 242.475 14.3777C239.189 15.0353 230.332 17.3265 234.926 17.6568C239.52 17.9811 246.085 17.6568 246.085 19.2933C246.085 20.9299 247.397 24.5333 250.679 21.2602C253.961 17.9811 249.695 18.966 255.929 16.3445C262.166 13.7231 265.117 9.1377 267.091 7.50113C269.058 5.8616 278.903 5.207 283.172 7.17087C287.438 9.13773 289.733 11.1046 294.003 13.3958C298.272 15.6899 298.272 16.9992 303.85 17.3265C309.431 17.6568 311.398 19.3321 314.025 22.5873C316.651 25.8456 319.931 29.1187 326.167 29.1187C332.404 29.1187 339.294 29.1187 346.514 31.0855C353.738 33.0524 362.598 31.4129 368.179 33.0524C373.757 34.689 388.854 47.4631 392.795 49.7573C396.734 52.0515 409.207 56.9671 414.785 59.2583C420.363 61.5525 429.554 62.8617 431.522 68.7593C433.493 74.6539 433.493 95.9471 431.522 101.514C429.554 107.085 427.587 109.706 423.318 114.622C419.051 119.535 410.844 127.723 406.581 132.636C402.312 137.552 400.344 142.464 399.36 146.395C398.373 150.329 392.137 157.536 388.201 157.205C384.26 156.878 379.994 156.223 379.666 159.499C379.338 162.776 378.354 181.775 378.354 188.327C378.354 194.879 380.65 200.777 377.695 210.275C374.744 219.776 374.085 216.172 371.459 224.361C368.835 232.55 370.475 233.862 366.537 240.087C362.598 246.309 360.959 245 358.332 252.206C355.706 259.413 355.05 264.326 353.41 268.257C351.767 272.19 348.816 272.515 346.19 275.136C343.563 277.758 345.531 284.31 338.969 285.292C332.404 286.274 328.794 284.965 327.479 283.652C326.167 282.343 322.557 281.361 319.931 282.343C317.304 283.328 315.992 279.725 308.116 283.983C300.239 288.241 298.925 288.568 297.613 290.205C296.298 291.844 290.72 294.138 287.438 295.12C284.155 296.102 278.578 296.43 276.935 299.706C275.295 302.982 278.578 302.654 273.655 304.949C268.73 307.24 266.107 306.912 264.133 309.534C262.166 312.152 262.166 312.81 260.195 315.756C258.227 318.708 259.539 321.653 256.916 323.293C254.289 324.93 252.974 325.26 253.961 326.893C254.945 328.533 256.26 327.878 255.929 331.482C255.601 335.085 254.617 339.016 256.916 341.637C259.211 344.256 260.523 345.241 259.539 347.859C258.555 350.481 256.26 354.415 253.305 355.396C250.348 356.378 246.085 357.36 244.77 361.949C243.458 366.534 240.176 373.741 238.533 374.723C236.894 375.708 233.939 374.723 230.001 374.723C226.063 374.723 223.111 375.05 222.78 378.326C222.452 381.602 222.78 386.188 219.826 386.842C216.874 387.5 215.014 385.206 212.823 389.791C210.638 394.376 209.326 395.361 209.651 397.98C209.979 400.601 210.536 403.55 209.6 406.172C208.667 408.793 209.979 409.448 206.368 411.415C202.758 413.379 199.151 416 199.151 416H-32.0755C-32.0755 416 -30.5998 403.88 -29.9409 396.674C-29.285 389.464 -29.285 389.791 -29.285 384.878C-29.285 379.963 -28.9571 377.999 -27.3144 374.068C-25.6777 370.137 -25.6777 367.189 -26.3306 364.57C-26.9895 361.949 -26.9895 356.378 -25.3468 353.102C-23.7041 349.829 -23.7041 346.55 -21.0806 339.343C-18.4541 332.136 -20.7527 335.085 -17.7982 326.242C-14.8438 317.395 -15.1718 311.501 -15.4997 305.603C-15.8306 299.706 -16.8144 295.12 -15.4997 291.19C-14.188 287.256 -12.2203 256.792 -12.2203 247.621C-12.2203 238.447 -12.5453 226.328 -19.4409 222.067C-26.3306 217.809 -23.7041 214.86 -32.0755 210.929C-40.4469 207.002 -50.9469 202.413 -60.466 197.173C-69.9852 191.93 -78.1896 184.723 -81.469 178.499C-84.7543 172.277 -85.0793 169.325 -89.0205 162.121C-92.9587 154.914 -98.8646 143.446 -103.462 137.879C-108.056 132.309 -115.932 124.12 -116.919 119.535C-117.903 114.949 -117.575 110.036 -121.513 107.739C-125.451 105.448 -140 99.2233 -140 98.2413V-25.5872C-140 -25.5872 -134.312 -28.536 -129.718 -30.4999C-125.124 -32.4668 -118.559 -30.8272 -114.948 -33.776C-111.338 -36.7248 -110.354 -40.0009 -107.728 -41.9648C-105.101 -43.9316 -103.79 -44.259 -102.806 -46.8805C-101.822 -49.502 -103.462 -59 -103.462 -59H218.842Z" 
              fill="var(--grass-x)" 
              stroke="var(--ocean-200)" 
              strokeWidth="10" 
              strokeMiterlimit="10" 
              strokeLinejoin="round"
            />
          </svg>
          
          <div className="text-[#343434] font-['ShellBold',-apple-system,Roboto,Helvetica,sans-serif] text-[22px] lg:text-4xl md:text-[28px] sm:text-2xl font-bold leading-normal absolute left-[63px] top-[78px] lg:left-[100px] lg:top-[120px] md:left-20 md:top-[100px] sm:left-[60px] sm:top-20 w-[66px] h-[30px]">
            Brasil
          </div>
          
          <div className="w-[109px] h-[171px] lg:w-[180px] lg:h-[280px] md:w-[140px] md:h-[220px] sm:w-[120px] sm:h-[180px] shrink-0 absolute left-[114px] top-3 lg:left-[180px] lg:top-5 md:left-[140px] md:top-[15px] sm:left-[120px] sm:top-2.5">
            <div className="shrink-0 rounded border-2 border-white absolute w-6 h-[21px] lg:w-9 lg:h-8 md:w-9 md:h-8 sm:w-6 sm:h-[21px] left-0 top-[150px] lg:top-[188px] md:top-[188px] sm:top-[150px] transition-all duration-200"></div>
            <div className="shrink-0 rounded border-2 border-sky-500 absolute w-[67px] h-[34px] lg:w-[100px] lg:h-[50px] md:w-[100px] md:h-[50px] sm:w-[67px] sm:h-[34px] left-[19px] top-[108px] lg:left-7 lg:top-[162px] md:left-7 md:top-[162px] sm:left-[19px] sm:top-[108px] transition-all duration-200"></div>
            <div className="shrink-0 rounded border-2 border-white absolute w-[17px] h-[15px] lg:w-[25px] lg:h-[22px] md:w-[25px] md:h-[22px] sm:w-[17px] sm:h-[15px] left-[93px] top-4 lg:left-[139px] lg:top-6 md:left-[139px] md:top-6 sm:left-[93px] sm:top-4 transition-all duration-200"></div>
            <div className="shrink-0 rounded border-2 border-white absolute w-[17px] h-[15px] lg:w-[25px] lg:h-[22px] md:w-[25px] md:h-[22px] sm:w-[17px] sm:h-[15px] left-12 top-0 lg:left-[71px] lg:top-0 md:left-[71px] md:top-0 sm:left-12 sm:top-0 transition-all duration-200"></div>
          </div>
        </div>
      </div>

      {/* Subtitles/Legend Section */}
      <div className="flex p-[18px_29px] lg:p-[24px_36px] md:p-[20px_24px] sm:p-[16px_20px] flex-col justify-center items-start gap-4 lg:gap-6 md:gap-5 sm:gap-4 self-stretch rounded-b-lg bg-white relative">
        {/* Maritime Blocks Section */}
        <div className="flex flex-col items-start gap-3 self-stretch">
          <h3 className="self-stretch text-[#616161] font-['ShellMedium',-apple-system,Roboto,Helvetica,sans-serif] text-[13px] lg:text-[22px] md:text-[20px] sm:text-[18px] font-medium leading-normal m-0">
            Blocos Marítimos
          </h3>
          <div className="flex flex-col items-start gap-2 lg:gap-3 md:gap-3 sm:gap-3 self-stretch">
            <div className={`flex w-[300.5px] lg:w-full md:w-full sm:w-full items-center gap-3.5 lg:gap-5 md:gap-5 sm:gap-4 max-w-full ${!activeLegendItems.exploration ? 'hidden' : ''}`}>
              <div className="flex items-center gap-2 lg:gap-3 md:gap-3 sm:gap-2.5 flex-1">
                <div className="flex p-1.5 lg:p-2.5 md:p-2.5 sm:p-2 items-center gap-[5px] rounded-lg border border-[#E0E0E0] aspect-square bg-white">
                  <svg width="18" height="18" className="lg:w-7 lg:h-7 md:w-7 md:h-7 sm:w-6 sm:h-6" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.9996 31.7887C16.1266 31.7887 14.5333 31.1319 13.2198 29.8184C11.9063 28.5049 11.2496 26.9117 11.2496 25.0387C11.2496 23.1657 11.9063 21.5724 13.2198 20.2589C14.5333 18.9454 16.1266 18.2887 17.9996 18.2887C19.8726 18.2887 21.4658 18.9454 22.7793 20.2589C24.0928 21.5724 24.7496 23.1657 24.7496 25.0387C24.7496 26.9117 24.0928 28.5049 22.7793 29.8184C21.4658 31.1319 19.8726 31.7887 17.9996 31.7887ZM10.5285 17.677L4.0957 11.2158C5.98995 9.44654 8.13233 8.08691 10.5228 7.13691C12.9131 6.18691 15.4053 5.71191 17.9996 5.71191C20.5938 5.71191 23.0861 6.18691 25.4763 7.13691C27.8668 8.08691 30.0092 9.44654 31.9035 11.2158L25.4707 17.677C24.4362 16.729 23.2815 15.9978 22.0065 15.4833C20.7315 14.969 19.3958 14.7119 17.9996 14.7119C16.6033 14.7119 15.2677 14.969 13.9927 15.4833C12.7177 15.9978 11.563 16.729 10.5285 17.677Z" fill="#DD1D21"/>
                  </svg>
                </div>
                <span className="text-[#343434] font-['ShellBook',-apple-system,Roboto,Helvetica,sans-serif] text-[13px] lg:text-[22px] md:text-[20px] sm:text-[18px] font-normal leading-normal">
                  Em exploração
                </span>
              </div>
              <button 
                className="w-[22px] h-[22px] lg:w-9 lg:h-9 md:w-9 md:h-9 sm:w-8 sm:h-8 shrink-0 aspect-square bg-none border-none cursor-pointer transition-all duration-200 rounded hover:bg-gray-50 hover:scale-105 active:scale-95" 
                onClick={() => handleLegendToggle('exploration')}
              >
                <svg width="22" height="22" className="lg:w-8 lg:h-8 md:w-8 md:h-8 sm:w-7 sm:h-7" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.0034 28.5578C24.0809 28.5578 25.8453 27.8308 27.2967 26.3766C28.7481 24.9225 29.4738 23.1567 29.4738 21.0792C29.4738 19.0017 28.7467 17.2373 27.2926 15.7859C25.8385 14.3345 24.0727 13.6088 21.9952 13.6088C19.9177 13.6088 18.1533 14.3359 16.7019 15.79C15.2505 17.2442 14.5248 19.01 14.5248 21.0875C14.5248 23.1649 15.2519 24.9294 16.706 26.3807C18.1602 27.8321 19.926 28.5578 22.0034 28.5578ZM21.9993 26.0333C20.6243 26.0333 19.4556 25.5521 18.4931 24.5896C17.5306 23.6271 17.0493 22.4583 17.0493 21.0833C17.0493 19.7083 17.5306 18.5396 18.4931 17.5771C19.4556 16.6146 20.6243 16.1333 21.9993 16.1333C23.3743 16.1333 24.5431 16.6146 25.5056 17.5771C26.4681 18.5396 26.9493 19.7083 26.9493 21.0833C26.9493 22.4583 26.4681 23.6271 25.5056 24.5896C24.5431 25.5521 23.3743 26.0333 21.9993 26.0333ZM21.9993 33.9167C18.1398 33.9167 14.6101 32.8871 11.41 30.828C8.20989 28.7691 5.6556 26.0604 3.7471 22.7017C3.59432 22.4383 3.48264 22.1729 3.41206 21.9056C3.34178 21.6382 3.30664 21.3638 3.30664 21.0824C3.30664 20.801 3.34178 20.5269 3.41206 20.2602C3.48264 19.9934 3.59432 19.7283 3.7471 19.465C5.6556 16.1063 8.20989 13.3975 11.41 11.3387C14.6101 9.27957 18.1398 8.25 21.9993 8.25C25.8588 8.25 29.3886 9.27957 32.5886 11.3387C35.7887 13.3975 38.343 16.1063 40.2515 19.465C40.4043 19.7283 40.516 19.9937 40.5866 20.2611C40.6568 20.5284 40.692 20.8028 40.692 21.0842C40.692 21.3657 40.6568 21.6397 40.5866 21.9065C40.516 22.1732 40.4043 22.4383 40.2515 22.7017C38.343 26.0604 35.7887 28.7691 32.5886 30.828C29.3886 32.8871 25.8588 33.9167 21.9993 33.9167Z" fill="var(--grey-800)"/>
                </svg>
              </button>
            </div>

            <div className={`flex w-[300.5px] lg:w-full md:w-full sm:w-full items-center gap-3.5 lg:gap-5 md:gap-5 sm:gap-4 max-w-full ${!activeLegendItems.production ? 'hidden' : ''}`}>
              <div className="flex items-center gap-2 lg:gap-3 md:gap-3 sm:gap-2.5 flex-1">
                <div className="flex p-1.5 lg:p-2.5 md:p-2.5 sm:p-2 items-center gap-[5px] rounded-lg border border-[#E0E0E0] aspect-square bg-white">
                  <svg width="18" height="18" className="lg:w-7 lg:h-7 md:w-7 md:h-7 sm:w-6 sm:h-6" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.9992 31.0498C15.1242 31.0498 12.7305 30.0623 10.818 28.0873C8.90547 26.1123 7.94922 23.6498 7.94922 20.6998C7.94922 18.6498 8.78047 16.3686 10.443 13.8561C12.1055 11.3436 14.6242 8.5748 17.9992 5.5498C21.3742 8.5748 23.893 11.3436 25.5555 13.8561C27.218 16.3686 28.0492 18.6498 28.0492 20.6998C28.0492 23.6498 27.093 26.1123 25.1805 28.0873C23.268 30.0623 20.8742 31.0498 17.9992 31.0498Z" fill="#008557"/>
                  </svg>
                </div>
                <span className="text-[#343434] font-['ShellBook',-apple-system,Roboto,Helvetica,sans-serif] text-[13px] lg:text-[22px] md:text-[20px] sm:text-[18px] font-normal leading-normal">
                  Em produção
                </span>
              </div>
              <button 
                className="w-[22px] h-[22px] lg:w-9 lg:h-9 md:w-9 md:h-9 sm:w-8 sm:h-8 shrink-0 aspect-square bg-none border-none cursor-pointer transition-all duration-200 rounded hover:bg-gray-50 hover:scale-105 active:scale-95" 
                onClick={() => handleLegendToggle('production')}
              >
                <svg width="22" height="22" className="lg:w-8 lg:h-8 md:w-8 md:h-8 sm:w-7 sm:h-7" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.0034 28.5578C24.0809 28.5578 25.8453 27.8308 27.2967 26.3766C28.7481 24.9225 29.4738 23.1567 29.4738 21.0792C29.4738 19.0017 28.7467 17.2373 27.2926 15.7859C25.8385 14.3345 24.0727 13.6088 21.9952 13.6088C19.9177 13.6088 18.1533 14.3359 16.7019 15.79C15.2505 17.2442 14.5248 19.01 14.5248 21.0875C14.5248 23.1649 15.2519 24.9294 16.706 26.3807C18.1602 27.8321 19.926 28.5578 22.0034 28.5578ZM21.9993 26.0333C20.6243 26.0333 19.4556 25.5521 18.4931 24.5896C17.5306 23.6271 17.0493 22.4583 17.0493 21.0833C17.0493 19.7083 17.5306 18.5396 18.4931 17.5771C19.4556 16.6146 20.6243 16.1333 21.9993 16.1333C23.3743 16.1333 24.5431 16.6146 25.5056 17.5771C26.4681 18.5396 26.9493 19.7083 26.9493 21.0833C26.9493 22.4583 26.4681 23.6271 25.5056 24.5896C24.5431 25.5521 23.3743 26.0333 21.9993 26.0333ZM21.9993 33.9167C18.1398 33.9167 14.6101 32.8871 11.41 30.828C8.20989 28.7691 5.6556 26.0604 3.7471 22.7017C3.59432 22.4383 3.48264 22.1729 3.41206 21.9056C3.34178 21.6382 3.30664 21.3638 3.30664 21.0824C3.30664 20.801 3.34178 20.5269 3.41206 20.2602C3.48264 19.9934 3.59432 19.7283 3.7471 19.465C5.6556 16.1063 8.20989 13.3975 11.41 11.3387C14.6101 9.27957 18.1398 8.25 21.9993 8.25C25.8588 8.25 29.3886 9.27957 32.5886 11.3387C35.7887 13.3975 38.343 16.1063 40.2515 19.465C40.4043 19.7283 40.516 19.9937 40.5866 20.2611C40.6568 20.5284 40.692 20.8028 40.692 21.0842C40.692 21.3657 40.6568 21.6397 40.5866 21.9065C40.516 22.1732 40.4043 22.4383 40.2515 22.7017C38.343 26.0604 35.7887 28.7691 32.5886 30.828C29.3886 32.8871 25.8588 33.9167 21.9993 33.9167Z" fill="var(--grey-800)"/>
                </svg>
              </button>
            </div>

            <div className={`flex w-[300.5px] lg:w-full md:w-full sm:w-full items-center gap-3.5 lg:gap-5 md:gap-5 sm:gap-4 max-w-full ${!activeLegendItems.decommissioning ? 'hidden' : ''}`}>
              <div className="flex items-center gap-2 lg:gap-3 md:gap-3 sm:gap-2.5 flex-1">
                <div className="flex p-1.5 lg:p-2.5 md:p-2.5 sm:p-2 items-center gap-[5px] rounded-lg border border-[#E0E0E0] aspect-square bg-white">
                  <svg width="18" height="18" className="lg:w-7 lg:h-7 md:w-7 md:h-7 sm:w-6 sm:h-6" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C16.025 3.425 19.0311 6.60645 21.0186 9.54395C23.006 12.4814 24 15.2002 24 17.7002C24 21.2001 22.8558 24.1247 20.5684 26.4746C18.2809 28.8246 15.425 30 12 30C8.575 30 5.71914 28.8246 3.43164 26.4746C1.14419 24.1247 4.2614e-05 21.2001 0 17.7002C0 15.2002 0.993965 12.4814 2.98145 9.54395C4.96895 6.60645 7.975 3.425 12 0ZM12 3.97461C9.025 6.69961 6.78105 9.2127 5.26855 11.5127C3.75615 13.8126 3 15.8753 3 17.7002C3 17.8008 3.00345 17.9007 3.00586 18H20.9941C20.9965 17.9007 21 17.8008 21 17.7002C21 15.8753 20.2438 13.8126 18.7314 11.5127C17.2189 9.2127 14.975 6.69961 12 3.97461Z" fill="var(--grey-800)" transform="translate(6, 3)"/>
                  </svg>
                </div>
                <span className="text-[#343434] font-['ShellBook',-apple-system,Roboto,Helvetica,sans-serif] text-[13px] lg:text-[22px] md:text-[20px] sm:text-[18px] font-normal leading-normal">
                  Em descomissionamento
                </span>
              </div>
              <button 
                className="w-[22px] h-[22px] lg:w-9 lg:h-9 md:w-9 md:h-9 sm:w-8 sm:h-8 shrink-0 aspect-square bg-none border-none cursor-pointer transition-all duration-200 rounded hover:bg-gray-50 hover:scale-105 active:scale-95" 
                onClick={() => handleLegendToggle('decommissioning')}
              >
                <svg width="22" height="22" className="lg:w-8 lg:h-8 md:w-8 md:h-8 sm:w-7 sm:h-7" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.0034 28.5578C24.0809 28.5578 25.8453 27.8308 27.2967 26.3766C28.7481 24.9225 29.4738 23.1567 29.4738 21.0792C29.4738 19.0017 28.7467 17.2373 27.2926 15.7859C25.8385 14.3345 24.0727 13.6088 21.9952 13.6088C19.9177 13.6088 18.1533 14.3359 16.7019 15.79C15.2505 17.2442 14.5248 19.01 14.5248 21.0875C14.5248 23.1649 15.2519 24.9294 16.706 26.3807C18.1602 27.8321 19.926 28.5578 22.0034 28.5578ZM21.9993 26.0333C20.6243 26.0333 19.4556 25.5521 18.4931 24.5896C17.5306 23.6271 17.0493 22.4583 17.0493 21.0833C17.0493 19.7083 17.5306 18.5396 18.4931 17.5771C19.4556 16.6146 20.6243 16.1333 21.9993 16.1333C23.3743 16.1333 24.5431 16.6146 25.5056 17.5771C26.4681 18.5396 26.9493 19.7083 26.9493 21.0833C26.9493 22.4583 26.4681 23.6271 25.5056 24.5896C24.5431 25.5521 23.3743 26.0333 21.9993 26.0333ZM21.9993 33.9167C18.1398 33.9167 14.6101 32.8871 11.41 30.828C8.20989 28.7691 5.6556 26.0604 3.7471 22.7017C3.59432 22.4383 3.48264 22.1729 3.41206 21.9056C3.34178 21.6382 3.30664 21.3638 3.30664 21.0824C3.30664 20.801 3.34178 20.5269 3.41206 20.2602C3.48264 19.9934 3.59432 19.7283 3.7471 19.465C5.6556 16.1063 8.20989 13.3975 11.41 11.3387C14.6101 9.27957 18.1398 8.25 21.9993 8.25C25.8588 8.25 29.3886 9.27957 32.5886 11.3387C35.7887 13.3975 38.343 16.1063 40.2515 19.465C40.4043 19.7283 40.516 19.9937 40.5866 20.2611C40.6568 20.5284 40.692 20.8028 40.692 21.0842C40.692 21.3657 40.6568 21.6397 40.5866 21.9065C40.516 22.1732 40.4043 22.4383 40.2515 22.7017C38.343 26.0604 35.7887 28.7691 32.5886 30.828C29.3886 32.8871 25.8588 33.9167 21.9993 33.9167Z" fill="var(--grey-800)"/>
                </svg>
              </button>
            </div>
          </div>
          
          <p className="self-stretch text-[#666] font-['ShellBook',-apple-system,Roboto,Helvetica,sans-serif] text-[11px] lg:text-lg md:text-base sm:text-sm font-normal leading-normal m-0">
            *Os números presentes nos marcadores indicam a quantidade de blocos agrupados (loteamentos)
          </p>
        </div>

        <div className="h-0.5 self-stretch bg-[#C0C0C0] my-[3px]"></div>

        {/* Infrastructure Section */}
        <div className="flex flex-col items-start gap-3 self-stretch">
          <h3 className="self-stretch text-[#616161] font-['ShellMedium',-apple-system,Roboto,Helvetica,sans-serif] text-[13px] lg:text-[22px] md:text-[20px] sm:text-[18px] font-medium leading-normal m-0">
            Infraestrutura
          </h3>
          <div className="flex flex-col items-start gap-2 lg:gap-3 md:gap-3 sm:gap-3 self-stretch">
            <div className="flex items-center gap-2 lg:gap-3 md:gap-3 sm:gap-2.5 self-stretch">
              <div className="flex p-1.5 lg:p-2.5 md:p-2.5 sm:p-2 items-center gap-[5px] rounded-lg border border-[#E0E0E0] aspect-square bg-white">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.0392 25.0671C18.6552 25.0671 18.3332 24.9372 18.0732 24.6775C17.8135 24.4175 17.6836 24.0955 17.6836 23.7115V19.1249H4.93359C4.61484 19.1249 4.34759 19.017 4.13184 18.8012C3.91634 18.5855 3.80859 18.3182 3.80859 17.9995C3.80859 17.6805 3.91634 17.4134 4.13184 17.1981C4.34759 16.9826 4.61484 16.8749 4.93359 16.8749H17.6836V12.2882C17.6836 11.9042 17.8135 11.5822 18.0732 11.3222C18.3332 11.0625 18.6552 10.9326 19.0392 10.9326H30.4625C30.8465 10.9326 31.1685 11.0625 31.4285 11.3222C31.6882 11.5822 31.8181 11.9042 31.8181 12.2882V23.7115C31.8181 24.0955 31.6882 24.4175 31.4285 24.6775C31.1685 24.9372 30.8465 25.0671 30.4625 25.0671H19.0392Z" fill="var(--sunrise-300)"/>
                </svg>
              </div>
              <span className="text-[#343434] font-['ShellBook',-apple-system,Roboto,Helvetica,sans-serif] text-[13px] lg:text-[22px] md:text-[20px] sm:text-[18px] font-normal leading-normal">
                Óleoduto
              </span>
            </div>

            <div className="flex items-center gap-2 lg:gap-3 md:gap-3 sm:gap-2.5 self-stretch">
              <div className="flex p-1.5 lg:p-2.5 md:p-2.5 sm:p-2 items-center gap-[5px] rounded-lg border border-[#E0E0E0] aspect-square bg-white">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24.5" cy="18" r="7" fill="var(--sky-800)"/>
                  <path d="M5 18H18" stroke="var(--sky-800)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-[#343434] font-['ShellBook',-apple-system,Roboto,Helvetica,sans-serif] text-[13px] lg:text-[22px] md:text-[20px] sm:text-[18px] font-normal leading-normal">
                Gasoduto
              </span>
            </div>

            <div className="flex items-center gap-2 lg:gap-3 md:gap-3 sm:gap-2.5 self-stretch">
              <div className="flex p-1.5 lg:p-2.5 md:p-2.5 sm:p-2 items-center gap-[5px] rounded-lg border border-[#E0E0E0] aspect-square bg-white">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.5 18H31.5" stroke="var(--grey-800)" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 7"/>
                </svg>
              </div>
              <span className="text-[#343434] font-['ShellBook',-apple-system,Roboto,Helvetica,sans-serif] text-[13px] lg:text-[22px] md:text-[20px] sm:text-[18px] font-normal leading-normal">
                Infraestrutura de terceiros
              </span>
            </div>
          </div>
        </div>

        <div className="h-0.5 self-stretch bg-[#C0C0C0] my-[3px]"></div>

        {/* Additional Information Section */}
        <div className="flex flex-col items-start gap-3 self-stretch">
          <h3 className="self-stretch text-[#616161] font-['ShellMedium',-apple-system,Roboto,Helvetica,sans-serif] text-[13px] lg:text-[22px] md:text-[20px] sm:text-[18px] font-medium leading-normal m-0">
            Informações Adicionais
          </h3>
          <div className="flex flex-col items-start gap-2 lg:gap-3 md:gap-3 sm:gap-3 self-stretch">
            <div className="flex items-center gap-2 lg:gap-3 md:gap-3 sm:gap-2.5 self-stretch">
              <div className="flex p-1.5 lg:p-2.5 md:p-2.5 sm:p-2 items-center gap-[5px] rounded-lg border border-[#E0E0E0] aspect-square bg-white">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.9996 30.75C17.6806 30.75 17.4135 30.6421 17.1982 30.4264C16.9827 30.2109 16.875 29.9438 16.875 29.625V20.7056L10.575 27.0289C10.352 27.2519 10.0871 27.3658 9.78038 27.3705C9.47363 27.3755 9.20388 27.2616 8.97112 27.0289C8.73837 26.7961 8.622 26.5288 8.622 26.2268C8.622 25.925 8.73837 25.6578 8.97112 25.425L15.2944 19.125H6.375C6.05625 19.125 5.78913 19.0171 5.57363 18.8014C5.35788 18.5856 5.25 18.3184 5.25 17.9996C5.25 17.6806 5.35788 17.4135 5.57363 17.1982C5.78913 16.9827 6.05625 16.875 6.375 16.875H15.2944L8.97112 10.575C8.74813 10.352 8.63425 10.0848 8.6295 9.77325C8.6245 9.4615 8.736 9.19412 8.964 8.97112C9.19175 8.74812 9.4615 8.639 9.77325 8.64375C10.0848 8.6485 10.352 8.7625 10.575 8.98575L16.875 15.3086V6.375C16.875 6.05625 16.9829 5.78913 17.1986 5.57363C17.4144 5.35788 17.6816 5.25 18.0004 5.25C18.3194 5.25 18.5865 5.35788 18.8018 5.57363C19.0173 5.78913 19.125 6.05625 19.125 6.375V15.3086L25.4393 8.97112C25.6625 8.74812 25.9275 8.639 26.2343 8.64375C26.541 8.6485 26.8059 8.7615 27.0289 8.98275C27.2519 9.20375 27.3634 9.46613 27.3634 9.76988C27.3634 10.0739 27.2519 10.3375 27.0289 10.5608L20.6914 16.875H29.625C29.9438 16.875 30.2109 16.9829 30.4264 17.1986C30.6421 17.4144 30.75 17.6816 30.75 18.0004C30.75 18.3194 30.6421 18.5865 30.4264 18.8018C30.2109 19.0173 29.9438 19.125 29.625 19.125H20.6914L27.0289 25.4393C27.2519 25.6625 27.3634 25.9275 27.3634 26.2342C27.3634 26.541 27.2519 26.8083 27.0289 27.036C26.8059 27.264 26.5385 27.3755 26.2268 27.3705C25.9153 27.3658 25.648 27.2519 25.425 27.0289L19.125 20.7056V29.625C19.125 29.9438 19.0171 30.2109 18.8014 30.4264C18.5856 30.6421 18.3184 30.75 17.9996 30.75Z" fill="var(--grey-800)"/>
                </svg>
              </div>
              <span className="text-[#343434] font-['ShellBook',-apple-system,Roboto,Helvetica,sans-serif] text-[13px] lg:text-[22px] md:text-[20px] sm:text-[18px] font-normal leading-normal">
                Operador da plataforma
              </span>
            </div>

            <div className="flex items-center gap-2 lg:gap-3 md:gap-3 sm:gap-2.5 self-stretch">
              <div className="flex p-1.5 lg:p-2.5 md:p-2.5 sm:p-2 items-center gap-[5px] rounded-lg border border-[#E0E0E0] aspect-square bg-white">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.875 26.4258V9.54518L14.8905 11.5154C14.6852 11.7229 14.4286 11.8267 14.1206 11.8267C13.8126 11.8267 13.5462 11.7152 13.3215 11.4922C13.1155 11.2877 13.0125 11.0274 13.0125 10.7114C13.0125 10.3954 13.1163 10.1336 13.3241 9.9258L17.0467 6.20318C17.19 6.05993 17.3412 5.95955 17.5005 5.90205C17.6597 5.8443 17.8303 5.81543 18.0123 5.81543C18.1946 5.81543 18.3636 5.8443 18.5193 5.90205C18.6751 5.95955 18.8245 6.05993 18.9675 6.20318L22.6905 9.9258C22.898 10.1336 23.0042 10.3884 23.0092 10.6904C23.014 10.9922 22.9087 11.2594 22.6935 11.4922C22.4587 11.7249 22.1903 11.8413 21.8883 11.8413C21.5866 11.8413 21.3193 11.7249 21.0866 11.4922L19.125 9.54518V26.4258L21.1095 24.4702C21.3147 24.2624 21.5713 24.1586 21.8793 24.1586C22.1873 24.1586 22.4537 24.2701 22.6785 24.4931C22.8845 24.6976 22.9875 24.9578 22.9875 25.2738C22.9875 25.5898 22.8836 25.8517 22.6758 26.0594L18.9532 29.7821C18.81 29.9253 18.6598 30.0258 18.5028 30.0836C18.3458 30.1413 18.1776 30.1702 17.9981 30.1702C17.8186 30.1702 17.6481 30.1411 17.4866 30.0828C17.3251 30.0248 17.1751 29.9261 17.0366 29.7866L13.3095 26.0594C13.105 25.8542 12.9981 25.5976 12.9888 25.2896C12.9796 24.9818 13.0865 24.7156 13.3095 24.4908C13.514 24.2848 13.7742 24.1818 14.0902 24.1818C14.4062 24.1818 14.6681 24.2856 14.8758 24.4931L16.875 26.4258Z" fill="var(--grey-800)"/>
                </svg>
              </div>
              <span className="text-[#343434] font-['ShellBook',-apple-system,Roboto,Helvetica,sans-serif] text-[13px] lg:text-[22px] md:text-[20px] sm:text-[18px] font-normal leading-normal">
                Profundidade
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
