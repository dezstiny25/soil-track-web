


// CSS

import '../index.css';
import dashboardStyles from '../styles/dashboard.module.css';
import { useEffect, useMemo } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { usePlotStore } from '../store/usePlotStore';
import SensorDetailsList from '../components/SensorDetailsList';

// Components
import MainDevice from '../components/MainDevice';
import MainSensors from '../components/MainSensors';

export default function WebPumpValves() {
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

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='flex flex-row md:flex-row w-full h-full md:space-y-0 md:space-x-4 mb-4'>
                {/* Device 1 */}
                <MainDevice imageSize='300px' boxSize='510px'/>

                {/* Device column 1 */}
                <div className="flex flex-row items-center w-2/4 h-full space-x-4">
                    <div className="flex flex-col h-full w-full space-y-4">
                        <MainSensors imageSize='100px' boxSize='240px'/>
                        <MainSensors imageSize='100px' boxSize='240px'/>
                    </div>

                    {/* Device column 2 */}
                    <div className="flex flex-col h-full w-full space-y-4">
                            <MainSensors imageSize='100px' boxSize='240px'/>
                            <MainSensors imageSize='100px' boxSize='240px'/>
                    </div>
                </div>

                
            </div>

            <div className='flex flex-row md:flex-row w-full md:space-y-0 md:space-x-4 mb-4'>
                <div className={`w-1/4 text-start py-4`}>
                    <span className={`${dashboardStyles.deviceMessage}`}>If your ESP32 and Arduino Nano is not connected, the sensors might not function properly.</span>
                </div>
            </div>

            <div className='flex flex-row md:flex-row w-full h-full space-y-4 md:space-y-0 md:space-x-4 mb-4'>
                <SensorDetailsList sensors={allSensors} />
            </div>

        </div>
        

        
    )
}

