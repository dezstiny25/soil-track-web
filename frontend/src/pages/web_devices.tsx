//web_devices.tsx
import { useState, useEffect, useMemo } from 'react';
import TabNavigation from '../components/TabNavigation';

import '../index.css';
import dashboardStyles from '../styles/dashboard.module.css';
import plotStyles from '../styles/plots.module.css';

import WebController from '../components/web_controller';
import WebPumpValves from '../components/web_pumps_valves';
import SensorDetailsList from '../components/SensorDetailsList';

import { useAuthStore } from '../store/useAuthStore';
import { usePlotStore } from '../store/usePlotStore';

const chartTabs = [
  { id: 'Controller', name: 'Controller', to: '/web_controller' },
  { id: 'Pump and Valves', name: 'Pump and Valves', to: '/web_pump_and_valves' },
];



export default function WebDevices() {
  const [activeTabChart, setActiveTab] = useState('Controller');
  const authUser = useAuthStore((state) => state.authUser);
  const getUserSensors = usePlotStore((state) => state.getUserSensors);
  const userSensorsByPlot = usePlotStore((state) => state.userSensorsByPlot);
  const getUserDevice = usePlotStore((state) => state.getUserDevice);
  const userDevice = usePlotStore((state) => state.userDevice);
  const hasDevice = Boolean(userDevice);


  useEffect(() => {
    if (authUser?.user_id) {
      getUserSensors(authUser.user_id);
      getUserDevice(authUser.user_id);
    }
  }, [authUser?.user_id, getUserSensors, getUserDevice]);

  const allSensors = useMemo(() => {
    return Object.values(userSensorsByPlot).flat();
  }, [userSensorsByPlot]);

  return (
    <div className="min-h-screen min-w-screen">
      <main className="flex-grow container mt-0 py-8 pt-0 space-y-8 mx-auto">
        <div className={`${dashboardStyles.header} ${plotStyles.header} flex items-center justify-between mb-8`}>
          <span className={`${dashboardStyles.mainTitle} font-semibold text-[#134F14]`}>
            <span className="text-[#838383]">Hey </span>, {authUser?.userFname || "Guest Account"} 👋 your device is {hasDevice ? "connected" : "not connected."}
          </span>
          <div className="flex items-center space-x-4">
            <TabNavigation
              tabs={chartTabs}
              activeTab={activeTabChart}
              onTabChange={setActiveTab}
              size="md"
              fullWidth={false}
            />
          </div>
        </div>

        {/* Render tabs */}
        {activeTabChart === 'Controller' && (
          <WebController sensors={allSensors} userDevice={userDevice} />
        )}
        {activeTabChart === 'Pump and Valves' && (
          <WebPumpValves sensors={allSensors} />
        )}

       <div className="flex flex-row w-full mb-4">
        <div className={dashboardStyles.deviceMessage}>
          {hasDevice
            ? "If your ESP32 and Arduino Nano is not connected, the sensors might not function properly."
            : ""}
        </div>
      </div>


        <div className="w-full">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Sensors in this Plot</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SensorDetailsList />
          </div>
        </div>
      </main>
    </div>
  );
}
