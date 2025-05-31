import '../index.css';
import dashboardStyles from '../styles/dashboard.module.css';

import MainDevice from '../components/MainDevice';
import MainSensors from '../components/MainSensors';

import { useEffect, useMemo } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { usePlotStore } from '../store/usePlotStore';

export default function WebController() {
  const authUser = useAuthStore((state) => state.authUser);
  const userSensorsByPlot = usePlotStore((state) => state.userSensorsByPlot);
  const getUserSensors = usePlotStore((state) => state.getUserSensors);

  // Load sensors on mount
  useEffect(() => {
    if (authUser?.user_id) {
      getUserSensors(authUser.user_id);
    }
  }, [authUser?.user_id, getUserSensors]);

  // Flatten all sensors from all plots
  const allSensors = useMemo(() => {
    return Object.values(userSensorsByPlot).flat();
  }, [userSensorsByPlot]);

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex flex-row md:flex-row w-full h-full space-y-4 md:space-y-0 md:space-x-4 mb-4'>
        <MainDevice boxSize='500px' />
        <MainDevice boxSize='500px' />
      </div>

      <div className='flex flex-row w-full md:space-y-0 md:space-x-4 mb-4'>
        <div className='w-1/4 text-start py-4'>
          <span className={dashboardStyles.deviceMessage}>
            If your ESP32 and Arduino Nano is not connected, the sensors might not function properly.
          </span>
        </div>
      </div>

      <div className='flex flex-wrap w-full gap-4'>
        {allSensors.length > 0 ? (
          allSensors.map((sensor) => (
            <div
              key={sensor.sensor_id}
              className='w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]'
            >
              <MainSensors
                deviceName={sensor.name}
                deviceSubtitle={sensor.category}
                status={sensor.status}
                imageSrc={sensor.image || '/assets/hardware/nano_not_connected.png'}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full">No sensors available.</p>
        )}
      </div>
    </div>
  );
}
