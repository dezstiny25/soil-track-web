import dashboardStyles from '../styles/dashboard.module.css';
import React from 'react';
import nanoImage from '../assets/hardware/nano_not_connected.png'; // Default image
import npkImage from '../assets/hardware/npk_model.png';
import moistureImage from '../assets/hardware/moisture_model.png';

interface SensorDetailsListProps {
  boxSize?: string;
  imageSize?: string;
  imageSrc?: string;
  deviceName?: string;
  deviceSubtitle?: string;
  status?: 'connected' | 'disconnected';
  onReconnect?: () => void;
  sensors: {
    sensor_id: string;
    sensor_name: string;
    sensor_category: string;
    plot_id: string;
  }[];
}

const SensorDetailsList: React.FC<SensorDetailsListProps> = ({
  sensors,
  boxSize = 'h-96',
  imageSize = '150px',
  imageSrc,
  deviceName = 'ESP32',
  deviceSubtitle = 'Soil Data Transmitter',
  status = 'disconnected',
  onReconnect = () => alert('Reconnecting...'),
}) => {
  if (!sensors.length) {
    return <div className="text-gray-500">No sensors found for your plots.</div>;
  }

  return (
    <>
      {sensors.map((sensor) => {
        let sensorImage = nanoImage;
        if (sensor.sensor_category === 'NPK Sensor') {
          sensorImage = npkImage;
        } else if (sensor.sensor_category === 'Moisture Sensor') {
          sensorImage = moistureImage;
        }

        return (
          <div
            key={sensor.sensor_id}
            className={`bg-white rounded-lg w-full ${boxSize} p-5 flex flex-col items-center justify-center gap-2`}
          >
            <div className="mt-2 flex flex-col items-center justify-center w-full bg-[#F7F7F7] rounded-lg py-6">
              <img
                src={imageSrc || sensorImage}
                alt={deviceName}
                style={{ width: imageSize, height: imageSize }}
                className="object-contain mb-4"
              />
            </div>
            <div className="flex flex-row items-center justify-center w-full p-4">
              <div className="flex flex-col w-2/4 items-start text-start">
                <span className={`${dashboardStyles.sensorTitle} text-[#134F14] font-semibold`}>
                  {sensor.sensor_name}
                </span>
                <span className={`${dashboardStyles.sensorSubtitle} text-[#838383]`}>
                  {sensor.sensor_category}
                </span>
              </div>
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
      })}
    </>
  );
};

export default SensorDetailsList;
