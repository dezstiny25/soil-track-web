import { useEffect, useState } from 'react';
import dashboardStyles from '../styles/dashboard.module.css';
import '../index.css';
import { useAuthStore } from '../store/useAuthStore';
import WeatherCard from '../components/WeatherCard';
import GlobalIrrigationHistory from '../components/GlobalIrrigationHistory';
import { usePlotStore } from '../store/usePlotStore';


// Assets
import mascot from '../assets/mascots/curious_soil.png';
import disconnectedHardware from '../assets/hardware/nano_not_connected.png';


export default function DashboardPage() {
  const authUser = useAuthStore((state) => state.authUser);
  
  return (
    <div className="min-h-screen min-w-screen">
      <main className="flex-grow container mt-0 py-8 pt-0 space-y-8 mx-auto">
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
        <div className="grid grid-cols-4 gap-4 w-full md:h-70 h-auto mb-4">
          
          {/* Weather Section Start */}
          <div className="col-span-2">
            <WeatherCard />
          </div>
          {/* Weather Section End */}

          {/* Second Column, Second Row */}
          <div className="col-span-2 bg-white rounded-lg gap-4 p-6 flex flex-col justify-between">
            
          </div>
        </div>

        {/* Row 3: 2/3 and 1/3 */}
        <div className="flex flex-col md:flex-row w-full md:h-70 h-auto space-y-4 md:space-y-0 md:space-x-4 mb-4">
          {/* Third Row, First Column */}
          <div className="w-full md:w-2/3 bg-white p-[20px] rounded-lg h-79">

        
           {authUser?.user_id ? (
              <GlobalIrrigationHistory userId={authUser.user_id} />
            ) : (
              <p>Loading irrigation logs...</p>
            )}

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