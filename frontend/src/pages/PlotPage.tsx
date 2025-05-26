import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlotStore } from '../store/usePlotStore';
import WebSoilChart from '../components/charts/WebSoilChart';
import WebSmallChart from '../components/charts/WebSmallChart';
import AISummaryCard from '../components/AISummaryCard';
import plotStyles from '../styles/plots.module.css'
import MapView from '../components/MapView'
import dailyAnalysis from '../assets/exported/daily_anal_poster.png';
import PlotDetailsCard from "../components/PlotDetailsCard";
import AIAnalysisHistory from "../components/AIAnalysisHistory";
import IrrigationLogHistory from '../components/IrrigationLogHistory';

export default function PlotsPage() {
  const { plotId } = useParams();
  const navigate = useNavigate();
  const { selectedPlotDetails, getFullPlotDetails } = usePlotStore();
  const [loading, setLoading] = useState(true);

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

  if (loading || !selectedPlotDetails || !selectedPlotDetails.plot_deets) {
    return <div className="p-10 text-center text-gray-600">Loading plot data...</div>;
  }

  const { plot_deets, moisture_readings, nutrient_readings, irrigation_logs } = selectedPlotDetails;

  const latestNutrients = nutrient_readings?.[0];
  const latestMoisture = moisture_readings?.[0];
  
  return (
    
    <div className="min-h-screen min-w-screen">
      <main className="container py-8 space-y-8 mx-auto">
        <div className="grid grid-cols-7 gap-4 ">
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
                    Your Daily Analysis <br></br>is Ready
                  </span>
                 <button
                    onClick={() => navigate(`/plots/${plotId}/analysis`)}
                    className="px-4 py-2 bg-white text-[#134F14] w-3/4 rounded-full text-sm m-0"
                  >
                    Go to daily analysis
                  </button>
                </div>
            </div>
          </div>
        <div className="grid grid-cols-6 gap-4 bg-white p-4 rounded-lg shadow-sm">
          {/* MOISTURE 1ST COLUMN – spans 3 columns */}
          <div className="col-span-4 p-4 rounded bg-white">
            <h2 className="text-lg font-semibold mb-2">Latest Moisture Readings</h2>
            <p>
              {latestMoisture
                ? `${latestMoisture.soil_moisture}% on ${new Date(latestMoisture.read_time).toLocaleString()}`
                : 'No moisture data'}
            </p>
            <WebSoilChart
              moistureData={moisture_readings.slice(-4)}
              nutrientData={nutrient_readings.slice(-4)}
            />
          </div>

          {/* NUTRIENTS 2ND COLUMN – spans 2 columns */}
          <div className="col-span-2 space-y-4">
            <div className="border p-4 rounded bg-white">
              <h2 className="text-sm text-gray-500">Nitrogen</h2>
              <p className="text-xl font-bold text-black">
                {latestNutrients?.readed_nitrogen ?? 'N/A'} mg/l
              </p>
              <WebSmallChart
                label="Nitrogen"
                data={nutrient_readings.slice(-4).map((n) => n.readed_nitrogen)}
              />
            </div>
            <div className="border p-4 rounded bg-white">
              <h2 className="text-sm text-gray-500">Phosphorus</h2>
              <p className="text-xl font-bold text-black">
                {latestNutrients?.readed_phosphorus ?? 'N/A'} mg/l
              </p>
              <WebSmallChart
                label="Phosphorus"
                data={nutrient_readings.slice(-4).map((n) => n.readed_phosphorus)}
              />
            </div>
            <div className="border p-4 rounded bg-white">
              <h2 className="text-sm text-gray-500">Potassium</h2>
              <p className="text-xl font-bold text-black">
                {latestNutrients?.readed_potassium ?? 'N/A'} mg/l
              </p>
              <WebSmallChart
                label="Potassium"
                data={nutrient_readings.slice(-4).map((n) => n.readed_potassium)}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {/* Left Column (2/3 width) */}
          <div className="col-span-2 space-y-4">
            {/* Top Row: MapView and PlotDetailsCard side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-2">
                <MapView polygons={plot_deets.polygons}/>
              </div>
              <div className="bg-white rounded-lg h-full w-full p-2">
                <PlotDetailsCard />
              </div>
            </div>

            {/* Bottom Row: AI Analysis History (full width of left column) */}
            <div className="bg-white rounded-lg p-2">
              <AIAnalysisHistory />
            </div>
          </div>

          {/* Right Column (1/3 width) */}
          <div className="bg-white rounded-lg p-2">
            <IrrigationLogHistory />
          </div>
        </div> 
      </main>
    </div>
  );
}
