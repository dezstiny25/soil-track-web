import '../index.css';
import dashboardStyles from '../styles/dashboard.module.css';
import MainDevice from './MainDevice';
import ESP_NC from '../assets/hardware/esp_not_connected_with_shadow.png';
import NANO_NC from '../assets/hardware/nano_not_connected_with_shadow.png';
import ESP from '../assets/hardware/esp_connected_with_shadow.png';
import NANO from '../assets/hardware/nano_connected_with_shadow.png';

type Props = {
  sensors: any[];
  userDevice: IoTDevice | null;
};

export default function WebController({ sensors, userDevice }: Props) {
  const isConnected = userDevice?.device_status === 'ONLINE';

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <div className="flex flex-row w-full h-full space-x-4 mb-4">
        {/* ESP32 */}
        <MainDevice
          boxSize="500px"
          imageSrc={isConnected ? ESP : ESP_NC}
          deviceName="ESP32"
          deviceSubtitle="Soil Data Transmitter"
          status={isConnected ? 'connected' : 'disconnected'}
        />

        {/* Arduino Nano */}
        <MainDevice
          boxSize="500px"
          imageSrc={isConnected ? NANO : NANO_NC}
          deviceName="Arduino Nano"
          deviceSubtitle="Sensor Processor"
          status={isConnected ? 'connected' : 'disconnected'}
        />
      </div>

      {sensors.length === 0 && (
        <div className="text-gray-500 mt-4">No sensors available for your plots.</div>
      )}
    </div>
  );
}
