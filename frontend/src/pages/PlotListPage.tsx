import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { usePlotStore } from "../store/usePlotStore";
import { axiosInstance } from "../lib/axios";

interface SensorCountByCategory {
  [category: string]: number;
}

const PlotListPage = () => {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);
  const { plots, getUserPlot, setSelectedPlotId } = usePlotStore();

  // Local state to keep sensor counts keyed by plotId
  const [sensorCountsByPlot, setSensorCountsByPlot] = useState<Record<string, SensorCountByCategory>>({});

  // Load user plots on authUser change
  useEffect(() => {
    if (authUser?.user_id) {
      getUserPlot(authUser.user_id);
    }
  }, [authUser?.user_id, getUserPlot]);

  // When plots load, fetch sensor counts for each plot individually
  useEffect(() => {
    if (plots && plots.length > 0) {
      plots.forEach(async (plot) => {
        try {
          const res = await axiosInstance.get("/plots/sensor-count", {
            params: { plot_id: plot.plot_id },
          });
          setSensorCountsByPlot((prev) => ({
            ...prev,
            [plot.plot_id]: res.data.sensorCounts || {},
          }));
        } catch (error) {
          console.error(`Failed to fetch sensor count for plot ${plot.plot_id}`, error);
          setSensorCountsByPlot((prev) => ({
            ...prev,
            [plot.plot_id]: {},
          }));
        }
      });
    }
  }, [plots]);

  // Navigate to plot details page and set selected plot id in Zustand store
  const goToPlotPage = (plotId: string) => {
    setSelectedPlotId(plotId);
    navigate(`/plots/details/${plotId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <h1 className="text-2xl text-gray-900 font-semibold mb-8">
        Hey,{" "}
        <span className="font-bold">
          {authUser?.userFname || "Guest Account"}
        </span>
        ! Here are your plots <span className="inline-block">👋</span>
      </h1>

      {plots && plots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plots.map((plot) => {
            const sensorCounts = sensorCountsByPlot[plot.plot_id] || {};

            const hasSoilMoistureSensors = (sensorCounts["Moisture Sensor"] ?? 0) > 0;
            const hasNpkSensors = (sensorCounts["NPK Sensor"] ?? 0) > 0;

            return (
              <div
                key={plot.plot_id}
                className="bg-white rounded-xl shadow p-6 transition hover:shadow-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Plot Name:</p>
                    <h2 className="text-2xl font-semibold text-green-900">
                      {plot.plot_name}
                    </h2>
                    <p className="text-sm text-gray-900 bg-gray-100 font-bold p-2 rounded mt-1">
                      Soil Moisture Sensors:{" "}
                      <span className={hasSoilMoistureSensors ? "text-gray-900" : "text-red-500"}>
                        {hasSoilMoistureSensors ? "Assigned" : "None"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-900 bg-gray-100 font-bold p-2 rounded mt-1">
                      NPK Sensors:{" "}
                      <span className={hasNpkSensors ? "text-green-900" : "text-red-500"}>
                        {hasNpkSensors ? "Assigned" : "None"}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-900 text-white px-4 py-1 rounded-full text-sm">
                      {plot.user_crops?.crop_name || "Unknown Crop"}
                    </span>
                    <button
                      onClick={() => goToPlotPage(plot.plot_id)}
                      className="bg-green-900 text-white w-7 h-7 rounded-full flex items-center justify-center"
                      aria-label={`Go to details for ${plot.plot_name}`}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-green-900 text-sm font-medium mt-2">
                    Analysis has been generated
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No plots found for your account.</p>
      )}
    </div>
  );
};

export default PlotListPage;
