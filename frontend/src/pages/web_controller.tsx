import '../index.css';
import dashboardStyles from '../styles/dashboard.module.css';

import MainDevice from '../components/MainDevice';
import MainSensors from '../components/MainSensors';
import SensorDetailsList from '../components/SensorDetailsList'; // ✅ Import the new component

import { useEffect, useMemo } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { usePlotStore } from '../store/usePlotStore';

export default function WebController() {
  const authUser = useAuthStore((state) => state.authUser);
  const getUserSensors = usePlotStore((state) => state.getUserSensors);
  const userSensorsByPlot = usePlotStore((state) => state.userSensorsByPlot);
  const plotId = usePlotStore((state) => state.selectedPlotId);
  


  useEffect(() => {
    if (plotId) {
      getUserSensors(plotId);
    }
  }, [authUser?.user_id, getUserSensors]);

  const allSensors = useMemo(() => {
    return Object.values(userSensorsByPlot).flat();
  }, [userSensorsByPlot]);

  console.log("All Sensors:", allSensors);

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <div className="flex flex-row w-full h-full space-x-4 mb-4">
        <MainDevice boxSize="500px" />
        <MainDevice boxSize="500px" />
      </div>

      <div className="flex flex-row w-full mb-4">
        <div className="w-full text-start py-4">
          <span className={dashboardStyles.deviceMessage}>
            If your ESP32 and Arduino Nano is not connected, the sensors might not function properly.
          </span>
        </div>
      </div>

      {/* Sensor Details List Section */}
      <div className="w-full">
        <h2 className="text-xl font-bold text-gray-700 mb-2">Sensors in this Plot</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <SensorDetailsList sensors={allSensors} />
        </div>
      </div>
    </div>
  );
}
