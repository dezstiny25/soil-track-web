//MainDevice.tsx
import dashboardStyles from '../styles/dashboard.module.css';
import React from 'react';

interface MainDeviceProps {
  boxSize?: string; // Default size for the box
  imageSize?: string; // Default size for the image
  imageSrc?: string;
  deviceName?: string;
  deviceSubtitle?: string;
  status?: 'connected' | 'disconnected';
  onReconnect?: () => void;
}

const MainDevice: React.FC<MainDeviceProps> = ({
  boxSize = '595px',
  imageSize = '300px',
  imageSrc = '../assets/hardware/nano_not_connected.png',
  deviceName = 'ESP32',
  deviceSubtitle = 'Soil Data Transmitter',
  status = 'disconnected',
  onReconnect = () => alert('Reconnecting...')
}) => {
  return (
    <div className={`bg-white rounded-lg h-[${boxSize}] w-1/2 p-5 flex flex-col items-center justify-center`}>
      {/* Device */}
      <div className='mt-2 flex flex-col items-center justify-center h-full w-full bg-[#F7F7F7] rounded-lg py-6'>
        <img 
          src={imageSrc} 
          alt="Valve"
          className={`w-[${imageSize}] h-[${imageSize}] object-contain mb-4`}
          style={{ height: imageSize }}
        />
      </div>

      {/* Text */}
      <div className='flex flex-row items-center justify-center h-full w-full p-4'>
        <div className='flex flex-col w-1/3 items-start'>
          <span className={`${dashboardStyles.mainTitle} text-[#134F14] font-semibold`}>{deviceName}</span>
          <span className={`${dashboardStyles.deviceSubtitle} text-[#838383]`}>{deviceSubtitle}</span>
        </div>
        <div className='flex flex-row w-2/3 items-center justify-end text-end'>
          {/* Connection Status */}
          <div className="bg-[#EFEFEF] rounded-full px-6 py-[10px] flex flex-row items-center justify-between me-2">
        {/* Status Icon */}
        {status === 'disconnected' ? (
          <div className="bg-[#C42727] rounded-full p-1 flex items-center justify-center me-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        ) : (
          <div className="bg-[#27C46A] rounded-full p-1 flex items-center justify-center me-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="6" />
            </svg>
          </div>
        )}
        {/* Status Text */}
        <div className={`${status === 'disconnected' ? `${dashboardStyles.deviceStatusOffline}` : `${dashboardStyles.deviceStatusOnline}`}`}>
          {status === 'disconnected' ? 'Disconnected' : 'Connected'}
        </div>
          </div>

          {/* Button */}
          <button className="bg-[#134F14] text-white rounded-full p-2" onClick={onReconnect}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
          </button>
        </div>
      </div>
        </div>
  );
};

export default MainDevice;