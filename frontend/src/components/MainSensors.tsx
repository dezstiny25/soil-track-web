import dashboardStyles from '../styles/dashboard.module.css';
import React from 'react';
import nanoImage from '../assets/hardware/nano_not_connected.png'; // Default image

interface MainSensorsProps {
  boxSize?: string; // Tailwind height class (e.g., 'h-96')
  imageSize?: string; // Image width/height in pixels
  imageSrc?: string; // Custom image source
  deviceName?: string;
  deviceSubtitle?: string;
  status?: 'connected' | 'disconnected';
  onReconnect?: () => void;
}

const MainSensors: React.FC<MainSensorsProps> = ({
  boxSize = 'h-96', // Tailwind height class
  imageSize = '150px',
  imageSrc,
  deviceName = 'ESP32',
  deviceSubtitle = 'Soil Data Transmitter',
  status = 'disconnected',
  onReconnect = () => alert('Reconnecting...'),
}) => {
  return (
    <div className={`bg-white rounded-lg w-full ${boxSize} p-5 flex flex-col items-center justify-center gap-2`}>
      
      {/* Device Image */}
      <div className="mt-2 flex flex-col items-center justify-center w-full bg-[#F7F7F7] rounded-lg py-6">
        <img 
          src={imageSrc || nanoImage} 
          alt={deviceName}
          style={{ width: imageSize, height: imageSize }}
          className="object-contain mb-4"
        />
      </div>

      {/* Info Section */}
      <div className="flex flex-row items-center justify-center w-full p-4">
        
        {/* Text Info */}
        <div className="flex flex-col w-2/4 items-start text-start">
          <span className={`${dashboardStyles.sensorTitle} text-[#134F14] font-semibold`}>
            {deviceName}
          </span>
          <span className={`${dashboardStyles.sensorSubtitle} text-[#838383]`}>
            {deviceSubtitle}
          </span>
        </div>

        {/* Status Indicator */}
        <div className="flex flex-row w-2/4 items-center justify-end text-end">
          <div
            className={`rounded-full px-5 py-[10px] flex items-center justify-between me-2 ${
              status === 'connected' ? 'bg-green-600' : 'bg-[#C42727]'
            }`}
          >
            <div
              className={
                status === 'disconnected'
                  ? dashboardStyles.sensorStatusOffline
                  : dashboardStyles.sensorStatusOnline
              }
            >
              {status === 'disconnected' ? 'Disconnected' : 'Connected'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSensors;
