import { useEffect, useState } from "react";

interface WeatherCardProps {
  lat?: number;
  lon?: number;
  className?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ lat, lon, className = "" }) => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [location, setLocation] = useState("Fetching location...");
  const [weatherBackground, setWeatherBackground] = useState("");

  const getBackgroundImage = (id: number, isDayTime: boolean): string => {
    const hasRain = [200, 201, 202, 230, 231, 232].includes(id);
    if (id >= 200 && id < 300) {
      return hasRain
        ? isDayTime
          ? "/assets/weather/thunder/heavy_thunder_rain_day.png"
          : "/assets/weather/thunder/heavy_thunder_rain_night.png"
        : isDayTime
        ? "/assets/weather/thunder/heavy_thunder_day.png"
        : "/assets/weather/thunder/heavy_thunder_night.png";
    } else if (id >= 300 && id < 400) {
      return isDayTime
        ? "/assets/weather/rain/light_rain_day.png"
        : "/assets/weather/rain/light_rain_night.png";
    } else if (id >= 500 && id < 600) {
      if (id < 502) {
        return isDayTime
          ? "/assets/weather/rain/light_rain_day.png"
          : "/assets/weather/rain/light_rain_night.png";
      } else if ([502, 503, 504].includes(id)) {
        return isDayTime
          ? "/assets/weather/rain/heavy_rain_day.png"
          : "/assets/weather/rain/heavy_rain_night.png";
      } else {
        return isDayTime
          ? "/assets/weather/moderate_rain_day.png"
          : "/assets/weather/moderate_rain_night.png";
      }
    } else if (id >= 600 && id < 700) {
      return isDayTime
        ? "/assets/weather/clear/clear.png"
        : "/assets/weather/clear/normal_night.png";
    } else if (id >= 700 && id < 800) {
      return isDayTime
        ? "/assets/weather/cloudy/cloudy_day.png"
        : "/assets/weather/cloudy/cloudy_night.png";
    } else if (id === 800) {
      return isDayTime
        ? "/assets/weather/clear/clear.png"
        : "/assets/weather/clear/normal_night.png";
    } else if (id > 800 && id < 805) {
      switch (id) {
        case 801:
          return isDayTime
            ? "/assets/weather/cloudy/few_clouds_day.png"
            : "/assets/weather/cloudy/few_clouds_night.png";
        case 802:
          return isDayTime
            ? "/assets/weather/cloudy/cloudy_day.png"
            : "/assets/weather/cloudy/cloudy_night.png";
        case 803:
        case 804:
          return isDayTime
            ? "/assets/weather/cloudy/overcast_day.png"
            : "/assets/weather/cloudy/overcast_night.png";
      }
    }
    return isDayTime
      ? "/assets/weather/clear/clear.png"
      : "/assets/weather/clear/normal_night.png";
  };

  useEffect(() => {
    const fetchWeather = async (latitude: number, longitude: number) => {
      try {
        const API_KEY = "dd7fee79831b309c75e3a8a3b06f0683"; // Replace with env var ideally
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        setWeatherData(data);
        setLocation(`${data.name}, ${data.sys.country}`);

        const currentTime = new Date().getTime() / 1000;
        const isDayTime = currentTime >= data.sys.sunrise && currentTime < data.sys.sunset;
        setWeatherBackground(getBackgroundImage(data.weather[0].id, isDayTime));
      } catch (error) {
        console.error("Error fetching weather:", error);
        setLocation("Location not found");
      }
    };

    if (lat && lon) {
      fetchWeather(lat, lon);
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      });
    }
  }, [lat, lon]);

  return (
    <div className={`w-full p-10 rounded-lg relative overflow-hidden flex flex-col justify-center ${className}`}>
      <img
        src={weatherBackground}
        alt="Weather Background"
        className="absolute inset-0 h-full w-full object-cover rounded-lg"
      />
      <div className="relative text-white flex flex-col text-start gap-0">
        <div className="flex flex-row w-full">
          <div className="w-2/3 flex flex-col items-start justify-center">
            <span className="text-lg font-bold text-center">{location}</span>
            <span className="text-[100px] font-bold text-center">
              {weatherData ? Math.round(weatherData.main.temp) : "--"}°C
            </span>
            <span className="text-lg font-bold text-center">
              {weatherData ? weatherData.weather[0].description : "Loading..."}
            </span>
            <div className="flex items-center justify-center bg-white/20 border border-white rounded-sm mt-2">
              <div className="flex flex-row items-center justify-center space-x-2 gap-3 px-4 py-0.5">
                <span className="text-sm font-medium text-white text-[10px]">
                  Precipitation: {weatherData ? weatherData.clouds.all : "--"}%
                </span>
                <span className="text-sm font-medium text-white text-[10px]">
                  Wind: {weatherData ? weatherData.wind.speed : "--"} m/s
                </span>
              </div>
            </div>
          </div>
          <div className="w-2/3"></div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
