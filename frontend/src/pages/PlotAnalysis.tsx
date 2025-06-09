// PlotAnalysis.tsx
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import dayjs from 'dayjs';
import { usePlotStore } from '../store/usePlotStore';
import AILatestInsights from '../components/AILatestInsights';
import AIWarnings from '../components/AIWarnings';
import WebDetailedChart from '../components/charts/WebDetailedChart';
import "../index.css";
import styles from "../styles/plotCard.module.css";

const TIME_RANGES = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
};

const SkeletonBlock = ({ width = "100%", height = 20, className = "" }) => (
  <div
    className={`bg-gray-300 animate-pulse rounded ${className}`}
    style={{ width, height }}
  />
);

const PlotAnalysis = () => {
  const [showTrends, setShowTrends] = useState(true);
  const [showWarnings, setShowWarnings] = useState(true);
  const [selectedRange, setSelectedRange] = useState<'1D' | '1W' | '1M' | '3M'>('1D');
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [analysisType, setAnalysisType] = useState<'Daily' | 'Weekly'>('Daily');

  const {
    selectedPlotId,
    plots,
    selectedPlotDetails,
    getFullPlotDetails,
    aiHistory,
    getAiHistory,
  } = usePlotStore();

  const selectedPlot = plots.find(plot => plot.plot_id === selectedPlotId);

  useEffect(() => {
    if (selectedPlotId) {
      getAiHistory(selectedPlotId);
      getFullPlotDetails(selectedPlotId);
    }
  }, [selectedPlotId]);

  useEffect(() => {
    if (analysisType === 'Weekly') {
      setSelectedRange('1W');
    }
  }, [analysisType]);

  const isLoading = !selectedPlotDetails || !aiHistory;

  if (isLoading) {
    // Skeleton UI while loading data
    return (
      <div className="p-6 bg-gray-50 min-h-screen space-y-6">
        <div className="flex justify-between items-center mb-6">
          <SkeletonBlock width="40%" height={32} />
          <SkeletonBlock width="20%" height={32} />
        </div>

        <div className="mb-6">
          <SkeletonBlock width="100%" height={150} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 space-y-4">
          <SkeletonBlock width="30%" height={28} />
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonBlock key={i} height={200} />
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 space-y-4">
          <SkeletonBlock width="50%" height={28} />
          <SkeletonBlock width="100%" height={100} />
        </div>
      </div>
    );
  }

  // Existing full UI when data is ready
  const englishEntries = aiHistory?.filter(
    (entry) => entry.language_type === 'en' && entry.findings
  );

  const latestEntry = englishEntries?.reduce((latest, current) => {
    return new Date(current.analysis_date) > new Date(latest.analysis_date)
      ? current
      : latest;
  }, englishEntries?.[0]);

  const days = TIME_RANGES[selectedRange];
  const currentStartDate = dayjs(selectedDate);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className={styles.grayTitle}>
          Hey, <span className={styles.greenTitle}>Here is your plot findings:</span>
        </h1>
        <div className="text-right">
          <div className={styles.toggleContainer}>
            {['Daily', 'Weekly'].map(type => (
              <button
                key={type}
                onClick={() => setAnalysisType(type as 'Daily' | 'Weekly')}
                className={`${styles.rangeButton} ${analysisType === type ? styles.active : ''}`}
              >
                {type} Analysis
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="gap-4 mb-6">
        <AILatestInsights analysisType={analysisType} />
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowTrends(!showTrends)}
        >
          <h2 className={`${styles.medText} px-4 py-2 mb-1`}>
            Nutrients Trends:
          </h2>
          <span className="text-gray-600">
            {showTrends ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </span>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showTrends ? 'max-h-[2000px] mt-4' : 'max-h-0'
          }`}
        >
          {selectedPlotDetails && (
            <>
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <div className={styles.toggleContainer}>
                  {Object.keys(TIME_RANGES).map(range => (
                    <button
                      key={range}
                      onClick={() => setSelectedRange(range as keyof typeof TIME_RANGES)}
                      className={`${styles.rangeButton} ${
                        selectedRange === range
                          ? styles.active
                          : ''
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                <div className="text-sm flex items-center gap-2">
                  <label htmlFor="start-date" className="text-gray-700">
                    Start Date:
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    value={selectedDate || ""}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={`border px-3 py-2 rounded text-sm w-[140px] ${
                      !selectedDate ? "text-gray-400" : "text-gray-900"
                    }`}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <WebDetailedChart
                  title="Moisture Levels"
                  readings={selectedPlotDetails.moisture_readings}
                  dataKey="soil_moisture"
                  unit="%"
                  selectedRange={selectedRange}
                  currentStartDate={dayjs(selectedDate)}
                />
                <WebDetailedChart
                  title="Nitrogen Levels"
                  readings={selectedPlotDetails.nutrient_readings}
                  dataKey="readed_nitrogen"
                  unit="mg/l"
                  selectedRange={selectedRange}
                  currentStartDate={dayjs(selectedDate)}
                />
                <WebDetailedChart
                  title="Phosphorus Levels"
                  readings={selectedPlotDetails.nutrient_readings}
                  dataKey="readed_phosphorus"
                  unit="mg/l"
                  selectedRange={selectedRange}
                  currentStartDate={dayjs(selectedDate)}
                />
                <WebDetailedChart
                  title="Potassium Levels"
                  readings={selectedPlotDetails.nutrient_readings}
                  dataKey="readed_potassium"
                  unit="mg/l"
                  selectedRange={selectedRange}
                  currentStartDate={dayjs(selectedDate)}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowWarnings(!showWarnings)}
        >
          <h2 className="p-4 text-xl font-semibold text-gray-700">
            {selectedPlot?.plot_name || 'Selected Plot'}{' '}
            <span className="text-red-600">Warnings:</span>
          </h2>
          <span className="text-gray-600">
            {showWarnings ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </span>
        </div>
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showWarnings ? 'max-h-[2000px] mt-4' : 'max-h-0'
          }`}
        >
          <AIWarnings analysisType={analysisType} />
        </div>
      </div>
    </div>
  );
};

export default PlotAnalysis;
