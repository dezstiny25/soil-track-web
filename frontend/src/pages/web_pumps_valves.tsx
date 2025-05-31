


// CSS

import '../index.css';
import dashboardStyles from '../styles/dashboard.module.css';

// Components
import MainDevice from '../components/MainDevice';
import MainSensors from '../components/MainSensors';

export default function WebPumpValves() {
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
                {/* Gamit ka props nak, check mo main file nakaayos na parameters mo mwa mwaa */}
                
                {/* Device 1 */}
                <MainSensors />

                {/* Device 2 */}
                <MainSensors />

                {/* Device 3 */}
                <MainSensors />

                {/* Device 4 */}
                <MainSensors />
            </div>

        </div>
        

        
    )
}

