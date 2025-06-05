// PlotsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlotStore } from '../store/usePlotStore';
import WebDetailedChart from '../components/charts/WebDetailedChart';
import WebSmallChart from '../components/charts/WebSmallChart';
import AISummaryCard from '../components/AISummaryCard';
import plotStyles from '../styles/plots.module.css';
import MapView from '../components/MapView';
import dailyAnalysis from '../assets/exported/daily_anal_poster.png';
import PlotDetailsCard from "../components/PlotDetailsCard";
import AIAnalysisHistory from "../components/AIAnalysisHistory";
import IrrigationLogHistory from '../components/IrrigationLogHistory';
import dayjs from 'dayjs';
import styles from "../styles/plotCard.module.css";

const TIME_RANGES = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
};

const PlotPageSkeleton = () => {
  return (
    <div className="p-10 space-y-6 animate-pulse">
      {/* Top Summary Skeleton */}
      <div className="grid grid-cols-7 gap-4">
        <div className="col-span-5 h-[400px] bg-gray-200 rounded-lg" />
        <div className="col-span-2 h-[400px] bg-gray-200 rounded-lg" />
      </div>

      {/* Trends Section Skeleton */}
      <div className="bg-gray-100 p-6 rounded-lg space-y-4">
        <div className="h-6 w-1/3 bg-gray-300 rounded" />
        <div className="h-4 w-2/3 bg-gray-300 rounded" />

        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-14 h-8 bg-gray-300 rounded-full" />
          ))}
          <div className="ml-4 w-40 h-8 bg-gray-300 rounded" />
        </div>

        <div className="grid grid-cols-6 gap-6 mt-4">
          <div className="col-span-4 h-72 bg-gray-200 rounded-lg" />
          <div className="col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Panels Skeleton */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 bg-gray-200 rounded-lg" />
            <div className="h-64 bg-gray-200 rounded-lg" />
          </div>
          <div className="h-48 bg-gray-200 rounded-lg" />
        </div>
        <div className="h-full bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
};


export default function PlotsPage() {
  const { plotId } = useParams();
  const navigate = useNavigate();
  const { selectedPlotDetails, getFullPlotDetails } = usePlotStore();
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState<'1D' | '1W' | '1M' | '3M'>('1D');
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    const fetchPlotDetails = async () => {
      if (!plotId) {
        navigate("/plots");
        return;
      }
      await getFullPlotDetails(plotId);
      setLoading(false);
    };

    fetchPlotDetails();
  }, [plotId, getFullPlotDetails, navigate]);

  const days = TIME_RANGES[selectedRange];
  const currentStartDate = dayjs(selectedDate);
  const currentEndDate = currentStartDate.add(days - 1, 'day').endOf('day');

  if (loading || !selectedPlotDetails || !selectedPlotDetails.plot_deets) {
    return <PlotPageSkeleton />;
  }

  const { plot_deets, moisture_readings, nutrient_readings, irrigation_logs } = selectedPlotDetails;

  return (
    <div className="min-h-screen min-w-screen">
      <main className="container py-8 space-y-8 mx-auto">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-7 gap-4">
          <div className="col-span-5 h-[400px] relative overflow-hidden bg-white rounded-lg border shadow-sm">
            <AISummaryCard />
          </div>
          <div className="col-span-2 h-[400px] relative overflow-hidden bg-white rounded-lg">
            <img
              src={dailyAnalysis}
              alt="Daily Analysis Background"
              className="absolute inset-0 h-full w-full object-cover object-top rounded-lg"
            />
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 space-y-3">
              <span className={`${plotStyles.analysisText} text-white text-center mb-1`}>
                Your Daily Analysis <br />is Ready
              </span>
              <button
                onClick={() => navigate(`/plots/${plotId}/analysis`)}
                className="px-4 py-2 bg-white text-[#134F14] w-3/4 rounded-full text-sm"
              >
                Go to daily analysis
              </button>
            </div>
          </div>
        </div>

        {/* Moisture & Nutrient Trends Section */}
        <div className="grid grid-cols-6 gap-4 bg-white p-4 rounded-lg border shadow-sm">
          <div className="col-span-6 p-4 rounded bg-white">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-semibold">Soil Moisture & Nutrient Trends</h2>
                <p className="text-sm text-gray-500">
                  Tracks soil moisture (%) and average nutrient concentration over time.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className={styles.cropBadge}>
                  {Object.keys(TIME_RANGES).map(range => (
                    <button
                      key={range}
                      onClick={() => setSelectedRange(range as keyof typeof TIME_RANGES)}
                      className={`px-5 py-1 rounded-lg text-sm ${
                        selectedRange === range
                          ? 'bg-white text-gray-700'
                          : 'text-white'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                <div className="ml-4 flex items-center gap-2 relative">
                  <input
                    id="start-date"
                    type="date"
                    value={selectedDate || ""}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={`border px-3 py-2 rounded text-sm w-[140px] ${
                      !selectedDate ? "text-gray-400" : "text-gray-900"
                    }`}
                  />
                  {!selectedDate && (
                    <span className="absolute left-[88px] text-gray-400 text-sm pointer-events-none">
                      Custom
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Charts Layout */}
            <div className="grid grid-cols-6 gap-6">
                {/* Left: Main Chart and Controls */}
                <div className="col-span-4 bg-white p-4">
                  <WebDetailedChart
                    title="Moisture"
                    readings={moisture_readings}
                    dataKey="soil_moisture"
                    unit="%"
                    selectedRange={selectedRange}
                    currentStartDate={currentStartDate}
                    currentEndDate={currentEndDate}
                  />
                </div>
                {/* Right: Nutrient Stat Cards */}
              <div className="col-span-2 space-y-4">
                {['readed_nitrogen', 'readed_potassium', 'readed_phosphorus'].map((dataKey) => {
                const titleMap: Record<string, string> = {
                  readed_nitrogen: 'Nitrogen',
                  readed_potassium: 'Potassium',
                  readed_phosphorus: 'Phosphorus',
                };

                const sortedReadings = [...nutrient_readings]
                  .filter(r => r[dataKey] !== null && r[dataKey] !== undefined)
                  .sort((a, b) => new Date(b.read_time).getTime() - new Date(a.read_time).getTime());

                const latest = sortedReadings[0]?.[dataKey] ?? 'N/A';
                const previous = sortedReadings[1]?.[dataKey];

                const percentChange =
                  latest !== 'N/A' && previous
                    ? (((latest - previous) / previous) * 100).toFixed(1)
                    : null;

                return (
                  <div key={dataKey} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="grid grid-cols-4 items-center gap-4">
                      {/* Left side: Text */}
                      <div className="col-span-1">
                        <div className="text-sm text-gray-500">{titleMap[dataKey]}</div>
                        <div className="text-lg font-bold">{latest}mg/l</div>
                        {percentChange !== null && (
                          <div
                            className={`text-sm mt-1 ${
                              Number(percentChange) >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {Number(percentChange) >= 0 ? '+' : ''}
                            {percentChange}%
                          </div>
                        )}
                      </div>

                      {/* Right side: Chart */}
                      <div className="col-span-3">
                        <WebSmallChart
                          readings={nutrient_readings}
                          dataKey={dataKey}
                          unit=""
                          selectedRange={selectedRange}
                          currentStartDate={currentStartDate}
                          currentEndDate={currentEndDate}
                          isMini={true}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Panels */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-2">
                <MapView polygons={plot_deets.polygons} />
              </div>
              <div className="bg-white rounded-lg h-full w-full p-2">
                <PlotDetailsCard />
              </div>
            </div>
            <div className="bg-white rounded-lg p-2">
              <AIAnalysisHistory />
            </div>
          </div>
          <div className="bg-white rounded-lg p-2">
            <IrrigationLogHistory />
          </div>
        </div>
      </main>
    </div>
    
  );
}
