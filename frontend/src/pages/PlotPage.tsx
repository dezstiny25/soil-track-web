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

const TIME_RANGES = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
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
    return <div className="p-10 text-center text-gray-600">Loading plot data...</div>;
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
            <div className="absolute inset-0 flex flex-col justify-end items-center pb-6 space-y-4">
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
        <div className="grid grid-cols-6 gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="col-span-6 p-4 rounded bg-white">
            <h2 className="text-lg font-semibold mb-2">Soil Moisture & Nutrient Trends</h2>
            <p className="text-sm text-gray-500 mb-2">
              Tracks soil moisture (%) and average nutrient concentration over time.
            </p>

            <div className="mb-4 flex items-center gap-2 flex-wrap">
              {Object.keys(TIME_RANGES).map(range => (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range as keyof typeof TIME_RANGES)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    selectedRange === range
                      ? 'bg-green-700 text-white'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  {range}
                </button>
              ))}
              <div className="ml-4 flex items-center gap-2">
                <label htmlFor="start-date" className="text-gray-700 text-sm">Start Date:</label>
                <input
                  id="start-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border px-2 py-1 rounded text-sm"
                />
              </div>
            </div>

            {/* Charts Layout */}
            <div className="grid grid-cols-6 gap-6">
  {/* Left: Main Chart and Controls */}
  <div className="col-span-4 bg-white p-4 rounded-lg shadow-sm">
    <div className="flex justify-between items-center mb-4">
  
    </div>

    <WebDetailedChart
      title="Moisture and pH"
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
    {[ 
      { title: 'Nitrogen', value: '29mg/l', dataKey: 'readed_nitrogen' },
      { title: 'Potassium', value: '39mg/l', dataKey: 'readed_potassium' },
      { title: 'Phosphorus', value: '39mg/l', dataKey: 'readed_phosphorus' },
    ].map(({ title, value, dataKey }) => (
      <div className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-lg font-bold">{value}</div>
          <div className="text-green-600 text-sm mt-1">+3.2%</div>
        </div>
        <div className="w-20 h-12">
          <WebSmallChart
            readings={nutrient_readings}
            dataKey={dataKey}
            unit=""
            selectedRange={selectedRange}
            currentStartDate={currentStartDate}
            currentEndDate={currentEndDate}
            isMini={true} // use this flag to render a small inline chart
          />
        </div>
      </div>
    ))}
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
