import '../index.css';
import dashboardStyles from '../styles/dashboard.module.css';
import MainDevice from './MainDevice';

type Props = {
  sensors: any[];
};

export default function WebController({ sensors }: Props) {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      <div className="flex flex-row w-full h-full space-x-4 mb-4">
        {/*ESP32*/}
        <MainDevice boxSize="500px" />

        {/*Arduino Nano*/}
        <MainDevice boxSize="500px" />
      </div>

      {sensors.length === 0 && (
        <div className="text-gray-500 mt-4">No sensors available for your plots.</div>
      )}
    </div>
  );
}
