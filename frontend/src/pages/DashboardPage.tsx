import { useEffect, useState } from 'react';
import dashboardStyles from '../styles/dashboard.module.css';
import '../index.css';
import { useAuthStore } from '../store/useAuthStore';
import WeatherCard from '../components/WeatherCard';
import GlobalIrrigationHistory from '../components/GlobalIrrigationHistory';
import { usePlotStore } from '../store/usePlotStore';
import styles from '../styles/plotCard.module.css';

// Assets
import mascot from '../assets/mascots/curious_soil.png';
import disconnectedHardware from '../assets/hardware/nano_not_connected.png';

export default function DashboardPage() {
  const authUser = useAuthStore((state) => state.authUser);
  const aiSummary = usePlotStore((state) => state.aiSummary);
  const getAiSummary = usePlotStore((state) => state.getAiSummary);
  const getUserPlot = usePlotStore((state) => state.getUserPlot);

  const [loading, setLoading] = useState(true);

  const isToday = (() => {
    if (!aiSummary?.analysis_date) return false;
    const today = new Date();
    const summaryDate = new Date(aiSummary.analysis_date);
    return (
      today.getFullYear() === summaryDate.getFullYear() &&
      today.getMonth() === summaryDate.getMonth() &&
      today.getDate() === summaryDate.getDate()
    );
  })();

  useEffect(() => {
    if (authUser?.user_id) {
      setLoading(true);
      Promise.all([
        getUserPlot(authUser.user_id),
        getAiSummary(authUser.user_id)
      ]).finally(() => setLoading(false));
    }
  }, [authUser]);

  return (
    <div className="min-h-screen min-w-screen">
      <main className="flex-grow container mt-0 py-8 pt-0 space-y-8 mx-auto">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row w-full md:h-74 h-auto space-y-4 md:space-y-0 md:space-x-4 mb-4">
          <div className="w-full md:w-2/3 bg-white rounded-lg text-left flex flex-col justify-center px-[40px] py-[60px]">
            <h1 className="text-xl text-gray-900 font-semibold">
              Hey, <span className="font-bold">{authUser?.userFname || "Guest Account"}</span> 👋
            </h1>

            {loading ? (
              <div className="py-3 space-y-2 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-[70%]" />
                <div className="h-4 bg-gray-100 rounded w-[90%]" />
              </div>
            ) : (
              <>
                <span>
                  <span className={styles.superTitle}>
                    {isToday ? aiSummary?.headline : 'No Analysis for today.'}
                  </span>
                </span>
                <span className="py-3 md:w-[500px]">
                  <span className={dashboardStyles.subTitle}>
                    {isToday ? aiSummary?.summary : 'No Analysis Generated for today.'}
                  </span>
                </span>
              </>
            )}
          </div>

          <div className='px-12'>
            <img
              src={mascot}
              alt="Curious Soil Mascot"
              className="h-80 w-80 object-contain rounded-lg justify-items-center"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-4 gap-4 w-full md:h-70 h-auto mb-4">
          {/* Weather Section */}
          <div className="col-span-2">
            {loading ? (
              <div className="bg-gray-200 rounded-lg p-6 animate-pulse space-y-4">
                <div className="h-6 bg-gray-400 rounded w-1/2" />
                <div className="h-4 bg-gray-300 rounded w-full" />
                <div className="h-4 bg-gray-300 rounded w-[80%]" />
                <div className="h-4 bg-gray-300 rounded w-[60%]" />
              </div>
            ) : (
              <WeatherCard />
            )}
          </div>

          {/* Placeholder Card */}
          <div className="col-span-2 bg-white rounded-lg gap-4 p-6 flex flex-col justify-between">
            {/* Add future content or keep blank */}
            <div className="text-sm text-gray-400">Content goes here</div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex flex-col md:flex-row w-full md:h-70 h-auto space-y-4 md:space-y-0 md:space-x-4 mb-4">
          <div className="w-full md:w-2/3 bg-white p-[20px] rounded-lg h-79">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-[90%]" />
                <div className="h-4 bg-gray-100 rounded w-[80%]" />
                <div className="h-4 bg-gray-100 rounded w-[90%]" />
                <div className="h-4 bg-gray-100 rounded w-[80%]" />
              </div>
            ) : authUser?.user_id ? (
              <GlobalIrrigationHistory userId={authUser.user_id} />
            ) : (
              <p>Loading irrigation logs...</p>
            )}
          </div>

          {/* Hardware Status */}
          <div className="w-full h-79 md:w-1/3 bg-white p-4 rounded-lg">
            <div className="flex flex-col">
              <div className="bg-gray-100 rounded-lg p-4 mb-4 flex flex-col items-center justify-center">
                <img
                  src={disconnectedHardware}
                  alt="Disconnected Hardware"
                  className="h-50 w-50 object-contain rounded-lg"
                />
              </div>
              <div className="flex flex-row items-center justify-between">
                <div className="bg-red-100 text-red-800 rounded-full px-6 py-2">
                  <span>Disconnected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
