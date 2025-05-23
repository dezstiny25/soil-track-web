import { useEffect, useState } from 'react';
import dashboardStyles from '../styles/dashboard.module.css';
import '../index.css';
import { useAuthStore } from '../store/useAuthStore';


// Assets
import mascot from '../assets/mascots/curious_soil.png';
import disconnectedHardware from '../assets/hardware/nano_not_connected.png';

const irrigationLogs = [
  { id: 1, date: 'March 20, 2025', area: 'Area A', opened: '11:59 AM', closed: '2:40 AM' },
  { id: 2, date: 'March 21, 2025', area: 'Area A', opened: '11:59 AM', closed: '2:40 AM' },
  { id: 3, date: 'March 22, 2025', area: 'Area A', opened: '11:59 AM', closed: '2:40 AM' },
];

export default function DashboardPage() {
  const authUser = useAuthStore((state) => state.authUser);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [location, setLocation] = useState<string>('Fetching location...');
  const [weatherBackground, setWeatherBackground] = useState<string>('');

  const getBackgroundImage = (id: number, isDayTime: boolean): string => {
    const hasRain = [200, 201, 202, 230, 231, 232].includes(id);

    if (id >= 200 && id < 300) {
      return hasRain
        ? isDayTime
          ? '/assets/weather/thunder/heavy_thunder_rain_day.png'
          : '/assets/weather/thunder/heavy_thunder_rain_night.png'
        : isDayTime
          ? '/assets/weather/thunder/heavy_thunder_day.png'
          : '/assets/weather/thunder/heavy_thunder_night.png';
    } else if (id >= 300 && id < 400) {
      return isDayTime
        ? '/assets/weather/rain/light_rain_day.png'
        : '/assets/weather/rain/light_rain_night.png';
    } else if (id >= 500 && id < 600) {
      if (id < 502) {
        return isDayTime
          ? '/assets/weather/rain/light_rain_day.png'
          : '/assets/weather/rain/light_rain_night.png';
      } else if ([502, 503, 504].includes(id)) {
        return isDayTime
          ? '/assets/weather/rain/heavy_rain_day.png'
          : '/assets/weather/rain/heavy_rain_night.png';
      } else {
        return isDayTime
          ? '/assets/weather/moderate_rain_day.png'
          : '/assets/weather/moderate_rain_night.png';
      }
    } else if (id >= 600 && id < 700) {
      return isDayTime
        ? '/assets/weather/clear/clear.png'
        : '/assets/weather/clear/normal_night.png';
    } else if (id >= 700 && id < 800) {
      return isDayTime
        ? '/assets/weather/cloudy/cloudy_day.png'
        : '/assets/weather/cloudy/cloudy_night.png';
    } else if (id === 800) {
      return isDayTime
        ? '/assets/weather/clear/clear.png'
        : '/assets/weather/clear/normal_night.png';
    } else if (id > 800 && id < 805) {
      switch (id) {
        case 801:
          return isDayTime
            ? '/assets/weather/cloudy/few_clouds_day.png'
            : '/assets/weather/cloudy/few_clouds_night.png';
        case 802:
          return isDayTime
            ? '/assets/weather/cloudy/cloudy_day.png'
            : '/assets/weather/cloudy/cloudy_night.png';
        case 803:
        case 804:
          return isDayTime
            ? '/assets/weather/cloudy/overcast_day.png'
            : '../assets/weather/cloudy/overcast_night.png';
      }
    }
    return isDayTime
      ? '/assets/weather/clear/clear.png'
      : '/assets/weather/clear/normal_night.png';
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const API_KEY = 'dd7fee79831b309c75e3a8a3b06f0683'; // <-- Replace with your OpenWeather API key
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        setWeatherData(data);
        setLocation(`${data.name}, ${data.sys.country}`);

        const currentTime = new Date().getTime() / 1000;
        const isDayTime = currentTime >= data.sys.sunrise && currentTime < data.sys.sunset;
        const bgImage = getBackgroundImage(data.weather[0].id, isDayTime);
        setWeatherBackground(bgImage);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setLocation('Location not found');
      }
    });
  }, []);

  return (
    <div className="min-h-screen min-w-screen">
      <main className="flex-grow container mt-0 py-8 pt-0 space-y-8">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row w-full md:h-74 h-auto space-y-4 md:space-y-0 md:space-x-4 mb-4">
          <div className="w-full md:w-2/3 bg-white rounded-lg text-left flex flex-col justify-center px-[40px] py-[60px]">
            <span className={dashboardStyles.subHeading}>Hey, <span className="font-bold">{authUser?.userFname || 'Guest Account'}! 👋</span></span>
            <span className="py-3 md:w-[500px]">
              <span className={`${dashboardStyles.mainTitle} leading-[0.5rem]`}>
                Moisture Increasing, Nutrient Levels Fluctuating
              </span>
            </span>
            <span className="py-3 md:w-[500px]">
              <span className={dashboardStyles.subTitle}>
              No AI Analysis has been generated.
              </span>
            </span>
          </div>
          <div>
            <img
              src={mascot}
              alt="Curious Soil Mascot"
             className="h-80 w-80 object-contain rounded-lg"/>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col md:flex-row w-full md:h-70 h-auto space-y-4 md:space-y-0 md:space-x-4 mb-4">
          
          {/* Weather Section Start */}
          <div className="w-full md:w-1/2 bg-blue-200 p-10 rounded-lg relative overflow-hidden flex flex-col justify-center">
            <img
              src={weatherBackground}
              alt="Weather Background"
              className="absolute inset-0 h-full w-full object-cover rounded-lg"
            />
            <div className="relative z-10 text-white flex flex-col text-start gap-0">
              <div className="flex flex-row w-full">
                <div className="w-1/3 flex flex-col items-start justify-center">
                  <span className="text-lg font-bold text-center">{location}</span>
                  <span className={`${dashboardStyles.weatherText} text-center`}>
                    {weatherData ? Math.round(weatherData.main.temp) : '--'}°C
                  </span>
                  <span className="text-lg font-bold text-center">
                    {weatherData ? weatherData.weather[0].description : 'Loading...'}
                  </span>
                  <div className="flex items-center justify-center bg-white/20 border border-white rounded-sm mt-2">
                    <div className="flex flex-row items-center justify-center space-x-2 gap-3 px-4 py-0.5">
                      <span className="text-sm font-medium text-white text-[10px]">
                        Precipitation: {weatherData ? weatherData.clouds.all : '--'}%
                      </span>
                      <span className="text-sm font-medium text-white text-[10px]">
                        Wind: {weatherData ? weatherData.wind.speed : '--'} m/s
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-2/3"></div>
              </div>
            </div>
          </div>
          {/* Weather Section End */}

          {/* Second Column, Second Row */}
          <div className="w-full md:w-1/2 bg-white p-4 rounded-lg">
            
          </div>
        </div>

        {/* Row 3: 2/3 and 1/3 */}
        <div className="flex flex-col md:flex-row w-full md:h-70 h-auto space-y-4 md:space-y-0 md:space-x-4 mb-4">
          {/* Third Row, First Column */}
          <div className="w-full md:w-2/3 bg-white p-[20px] rounded-lg h-79">

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#134F14]">Recent Irrigation Log</h3>
            {/* Toggle and Filter placeholders */}
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-300">Daily</button>
              <button className="px-3 py-1 bg-green-800 text-white rounded-full text-sm">Weekly</button>
              <button className="px-3 py-1 bg-gray-100 rounded-full text-sm">Filter</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-black">
              <thead className="rounded-full">
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Area</th>
                  <th className="px-4 py-2">Time Opened</th>
                  <th className="px-4 py-2">Time Closed</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {irrigationLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-300/40">
                    <td className="px-4 py-2 text-sm text-start">{log.date}</td>
                    <td className="px-4 py-2 text-sm text-start">{log.area}</td>
                    <td className="px-4 py-2 text-sm text-start">{log.opened}</td>
                    <td className="px-4 py-2 text-sm text-start">{log.closed}</td>
                    <td className="px-4 py-2 text-sm text-start">
                      <button className="text-green-800 hover:underline text-sm flex items-center">
                        View <span className="ml-1">›</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        
          </div>

          {/* Third Row, Second Column */}
          <div className="w-full h-79 md:w-1/3 bg-white p-4 rounded-lg">
            <div className="flex flex-col">
              {/* Grey Rounded Container */}
              <div className="bg-gray-100 rounded-lg p-4 mb-4 flex flex-col items-center justify-center">
                <img
                  src={disconnectedHardware}
                  alt="Curious Soil Mascot"
                  className="h-50 w-50 object-contain rounded-lg"/>
              </div>
              <div className="flex flex-row items-center justify-between">
                <div className="bg-red-100 text-red-800 rounded-full px-6 py-2">
                  {/* Add "x" icon */}
                  <i></i>
                  <span>Disconnected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}