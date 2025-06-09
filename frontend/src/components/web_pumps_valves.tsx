//web_pump_valves.tsx
import '../index.css';
import dashboardStyles from '../styles/dashboard.module.css';
import SubDevice from './SubDevice';
import MainSensors from './MainSensors';
import pumpimg from '../assets/hardware/pump_model.png';
import valveimg from '../assets/hardware/valve_model.png';

import { usePlotStore } from '../store/usePlotStore';

export default function WebPumpValves() {
  const plots = usePlotStore((state) => state.plots);
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-row w-full h-full space-x-4 mb-4 flex-wrap md:flex-nowrap">
        {/* Water Pump */}
        <SubDevice 
              boxSize="500px"
              imageSrc={pumpimg}
              deviceName="Water Pump"
              deviceSubtitle="Electronic Water Pump"
            />

        {/* Plot Valves */}
        <div className="flex flex-col flex-1 space-y-4">
           {plots.map((plot, index) => (
                    <MainSensors
                      key={plot.plot_id}
                      imageSize="100px"
                      imageSrc={valveimg}
                      boxSize="240px"
                      deviceName={`Valve ${index + 1}`}
                      deviceSubtitle={plot.plot_name}
                      status="connected"
                    />
                  ))}
        </div>
      </div>

      {plots.length === 0 && (
        <div className="text-gray-500 mt-4">No plots found. No valves to display.</div>
      )}
    </div>
  );
}
