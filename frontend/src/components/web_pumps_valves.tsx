import '../index.css';
import dashboardStyles from '../styles/dashboard.module.css';

import MainDevice from './MainDevice';
import MainSensors from './MainSensors';

type Props = {
  sensors: any[];
};

export default function WebPumpValves({ sensors }: Props) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-row w-full h-full space-x-4 mb-4 flex-wrap md:flex-nowrap">
        {/* Device 1 */}
        <MainDevice imageSize="300px" boxSize="510px" />

        {/* Device columns */}
        <div className="flex flex-row items-center w-full h-full space-x-4">
          <div className="flex flex-col h-full w-full space-y-4">
            <MainSensors imageSize="100px" boxSize="240px" />
            <MainSensors imageSize="100px" boxSize="240px" />
          </div>
          <div className="flex flex-col h-full w-full space-y-4">
            <MainSensors imageSize="100px" boxSize="240px" />
            <MainSensors imageSize="100px" boxSize="240px" />
          </div>
        </div>
      </div>

      {sensors.length === 0 && (
        <div className="text-gray-500 mt-4">No sensors available for this plot.</div>
      )}
    </div>
  );
}
