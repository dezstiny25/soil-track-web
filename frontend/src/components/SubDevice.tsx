//SubDevice.tsx
import dashboardStyles from '../styles/dashboard.module.css';
import React from 'react';

interface SubDeviceProps {
  boxSize?: string; // Default size for the box
  imageSize?: string; // Default size for the image
  imageSrc?: string;
  deviceName?: string;
  deviceSubtitle?: string;
  status?: 'connected' | 'disconnected';
  onReconnect?: () => void;
}

const SubDevice: React.FC<SubDeviceProps> = ({
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
        <div className='flex flex-col w-2/3 items-start'>
          <span className={`${dashboardStyles.mainTitle} text-[#134F14] font-semibold`}>{deviceName}</span>
          <span className={`${dashboardStyles.deviceSubtitle} text-[#838383]`}>{deviceSubtitle}</span>
        </div>
        <div className='flex flex-row w-2/3 items-center justify-end text-end'>
      </div>
      </div>
        </div>
  );
};

export default SubDevice;