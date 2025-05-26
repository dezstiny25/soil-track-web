import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { CropCard } from '../components/CropCard';
import { ChevronDown, ChevronUp, ArrowRight, ArrowUpRight, Filter } from 'lucide-react';
import { usePlotStore } from "../store/usePlotStore";

const WebSoilChart = ({ title }: { title: string }) => {
  const [chartData] = useState({
    series: [
      {
        name: 'Moisture',
        data: [31, 40, 28, 51, 42, 60, 65]
      },
      {
        name: 'Nutrients',
        data: [11, 32, 45, 32, 34, 32, 29]
      }
    ],
    options: {
      chart: {
        height: 350,
        type: 'area' as const,
        toolbar: { show: false }
      },
      colors: ['#1E88E5', '#43A047'],
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth' as const,
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        type: 'datetime' as const,
        categories: [
          "2025-05-09T00:00:00.000Z",
          "2025-05-10T00:00:00.000Z",
          "2025-05-11T00:00:00.000Z",
          "2025-05-12T00:00:00.000Z",
          "2025-05-13T00:00:00.000Z",
          "2025-05-14T00:00:00.000Z",
          "2025-05-15T00:00:00.000Z"
        ],
        labels: {
          style: {
            colors: '#666',
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#666',
            fontSize: '12px'
          }
        }
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy'
        },
        y: {
          formatter: (value: number) => `${value}%`
        }
      },
      legend: {
        position: 'top' as const,
        horizontalAlign: 'right' as const
      }
    }
  });

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-700">{title}</h3>
        <span className="bg-green-200 text-green-800 px-5 py-1 rounded-full text-sm">Increasing ↑</span>
      </div>
      <ReactApexChart 
        options={chartData.options}
        series={chartData.series} 
        type="area" 
        height={300} 
      />
    </div>
  );
};

const Dashboard = () => {
  const [showTrends, setShowTrends] = useState(true);
  const [showWarnings, setShowWarnings] = useState(true);
  const plotId = usePlotStore((state) => state.selectedPlotId);
    const aiHistory = usePlotStore((state) => state.aiHistory);
    const getAiHistory = usePlotStore((state) => state.getAiHistory);
  
    const [filter, setFilter] = useState<"Daily" | "Weekly">("Weekly");
  
    useEffect(() => {
      if (plotId) {
        getAiHistory(plotId);
      }
    }, [plotId]);
  
    // Add this after fetching aiHistory
const filteredHistory = aiHistory
  ?.filter((entry) => entry.analysis_type === filter && entry.language_type === "en")
  ?.sort((a, b) => new Date(b.analysis_date).getTime() - new Date(a.analysis_date).getTime());

const latestFinding = filteredHistory?.[0];


  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-green-700">Hey, <span className="font-bold">Here is your plot findings:</span></h1>
        <div className="text-right">
          <div className="bg-green-800 text-white px-4 py-2 rounded-full text-sm">Weekly Analysis</div>
          <div className="text-sm text-gray-600">Sun, December 17</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">Area Findings</h3>
          {!aiHistory ? (
                    <div className="text-center text-gray-500">Loading...</div>
                  ) : filteredHistory?.length === 0 ? (
                    <div className="text-center text-gray-500">
                      No {filter.toLowerCase()} entries found.
                    </div>
                  ) : (
                    filteredHistory.map((entry, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 px-4 py-3 border-t border-gray-200 items-start"
                      >
                        <div className="col-span-4 font-medium text-gray-800 flex items-center gap-2">
                          {new Date(entry.analysis_date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                          <ArrowUpRight size={14} className="text-gray-400" />
                        </div>
                        <div className="col-span-8 text-sm text-gray-600">
                          {entry.findings}
                        </div>
                      </div>
                    ))
                  )}
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">Area Predictions</h3>
          <p className="text-sm text-gray-600">With the upcoming weather forecast predicting rain, moisture levels are expected to rise. Benefiting the rice crop but phosphorus levels remain critically low. If the low phosphorus levels persist, crop growth may not be addressed promptly.</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">Area Recommendations</h3>
          <p className="text-sm text-gray-600">Given the low phosphorus levels, it’s essential to take action today. Consider applying a phosphorus-rich fertilizer to support the upcoming growth stage of the rice crop.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowTrends(!showTrends)}>
          <h2 className="text-xl font-semibold text-gray-700">Nutrients <span className="text-green-600">Trends:</span></h2>
          <span className="text-gray-600">{showTrends ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
        </div>
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${showTrends ? 'max-h-[2000px] mt-4' : 'max-h-0'}`}
        >
          <div className="grid md:grid-cols-2 gap-4">
            {['Moisture Levels', 'Nitrogen Levels', 'PH Levels', 'Phosphorus Levels', 'Soil Temperature', 'Potassium Levels'].map(label => (
              <WebSoilChart key={label} title={label} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowWarnings(!showWarnings)}>
          <h2 className="text-xl font-semibold text-red-600">Area A <span className="text-black">Warnings:</span></h2>
          <span className="text-gray-600">{showWarnings ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
        </div>
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${showWarnings ? 'max-h-[2000px] mt-4' : 'max-h-0'}`}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 shadow-sm rounded-xl">
              <h4 className="font-semibold text-red-600 mb-1">⚠ Drought Risks</h4>
              <p className="text-sm text-gray-600">While moisture levels are adequate now, keep an eye on the weather forecast and precipitation. Potential heavy rains that could affect soil structure.</p>
            </div>
            <div className="bg-white p-4 shadow-sm rounded-xl">
              <h4 className="font-semibold text-red-600 mb-1">⚠ Nutrient Imbalance</h4>
              <p className="text-sm text-gray-600">Phosphorus levels are currently low and need immediate attention to avoid impacting crop growth.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
