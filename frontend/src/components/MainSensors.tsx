import dashboardStyles from '../styles/dashboard.module.css';
import React from 'react';
import nanoImage from '../assets/hardware/nano_not_connected_with_shadow.png'; // Default image

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
      <div className="flex flex-row items-start justify-start w-full p-4">
        
        {/* Text Info */}
        <div className="flex flex-col items-start text-start">
          <span className={`${dashboardStyles.sensorTitle} text-[#134F14] font-semibold`}>
            {deviceName}
          </span>
          <span className={`${dashboardStyles.sensorSubtitle} text-[#838383]`}>
            {deviceSubtitle}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MainSensors;
