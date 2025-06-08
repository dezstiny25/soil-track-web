import dashboardStyles from '../styles/dashboard.module.css';
import React, { useEffect, useMemo } from 'react';
import nanoImage from '../assets/hardware/nano_not_connected.png';
import npkImage from '../assets/hardware/npk_model.png';
import moistureImage from '../assets/hardware/moisture_model.png';
import { usePlotStore } from '../store/usePlotStore';
import { useAuthStore } from '../store/useAuthStore';

const SensorDetailsList: React.FC = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const getUserSensors = usePlotStore((state) => state.getUserSensors);
  const userSensorsByPlot = usePlotStore((state) => state.userSensorsByPlot);

  useEffect(() => {
    if (authUser?.user_id) {
      getUserSensors(authUser.user_id);
    }
  }, [authUser?.user_id, getUserSensors]);

  const sensors = useMemo(() => {
    return Object.values(userSensorsByPlot).flat();
  }, [userSensorsByPlot]);

  const status: 'connected' | 'disconnected' = 'disconnected';
  const imageSize = '150px';
  const deviceName = 'ESP32';

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
          <div key={sensor.sensor_id} className="bg-white rounded-lg p-5 flex flex-col items-center justify-center gap-2">
            <div className="mt-2 flex flex-col items-center justify-center w-full bg-[#F7F7F7] rounded-lg py-6">
              <img
                src={sensorImage}
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
