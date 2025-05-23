import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlotStore } from '../store/usePlotStore';
import WebSoilChart from '../components/charts/WebSoilChart';
import WebSmallChart from '../components/charts/WebSmallChart';

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
      <main className="container py-8 space-y-8">
        <div className="text-left px-6 md:px-0">
          <h1 className="text-2xl font-bold text-green-800">
            {plot_deets?.plot_name || "Unnamed Plot"}
          </h1>
         
        </div>

        <div className="text-lg font-semibold text-[#134F14]">
          Crop: {plot_deets.user_crops?.crop_name ?? 'No crop'}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="border p-4 rounded">
            <h2 className="text-sm text-gray-500">Nitrogen</h2>
            <p className="text-xl font-bold text-black">
              {latestNutrients?.readed_nitrogen ?? 'N/A'} mg/l
            </p>
            <WebSmallChart
              label="Nitrogen"
              data={nutrient_readings.map((n) => n.readed_nitrogen)}
            />
          </div>
          <div className="border p-4 rounded">
            <h2 className="text-sm text-gray-500">Phosphorus</h2>
            <p className="text-xl font-bold text-black">
              {latestNutrients?.readed_phosphorus ?? 'N/A'} mg/l
            </p>
            <WebSmallChart
              label="Phosphorus"
              data={nutrient_readings.map((n) => n.readed_phosphorus)}
            />
          </div>
          <div className="border p-4 rounded">
            <h2 className="text-sm text-gray-500">Potassium</h2>
            <p className="text-xl font-bold text-black">
              {latestNutrients?.readed_potassium ?? 'N/A'} mg/l
            </p>
            <WebSmallChart
              label="Potassium"
              data={nutrient_readings.map((n) => n.readed_potassium)}
            />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Latest Moisture Reading</h2>
          <p>
            {latestMoisture
              ? `${latestMoisture.soil_moisture}% on ${new Date(latestMoisture.read_time).toLocaleString()}`
              : 'No moisture data'}
          </p>
          <WebSoilChart
            moistureData={moisture_readings}
            nutrientData={nutrient_readings}
          />
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Irrigation Log</h2>
          {irrigation_logs.length === 0 ? (
            <p className="text-gray-500">No irrigation history</p>
          ) : (
            <ul className="space-y-2">
              {irrigation_logs.slice(0, 5).map((log, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {new Date(log.time_started).toLocaleString()} → {new Date(log.time_stopped).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
