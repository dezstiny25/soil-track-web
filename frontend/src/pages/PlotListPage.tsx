import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { usePlotStore } from "../store/usePlotStore";

const PlotListPage = () => {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);
  const {
    plots,
    getUserPlot,
    setSelectedPlotId,
    sensorCountsByPlot,
  } = usePlotStore();

  // Load user plots and sensor counts
  useEffect(() => {
    if (authUser?.user_id) {
      getUserPlot(authUser.user_id);
    }
  }, [authUser?.user_id, getUserPlot]);

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
                className="bg-white rounded-xl shadow p-6 transition hover:shadow-lg space-y-3"
              >
                {/* Row 1: Plot Name label */}
                <p className="text-sm text-gray-500">Plot Name:</p>

                {/* Row 2: Plot Name + Crop + Button (2-column layout) */}
                <div className="grid grid-cols-2 gap-4 items-center">
                  {/* Left Column: Plot Name */}
                  <h2 className="text-2xl font-semibold text-green-900">
                    {plot.plot_name}
                  </h2>

                  {/* Right Column: Crop + Button */}
                  <div className="flex justify-end items-center gap-2">
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

                {/* Row 3: Soil Moisture */}
                <p className="text-sm text-gray-600 bg-gray-100 font-bold p-2 rounded">
                  Soil Moisture Sensors {" "}
                  <span className={hasSoilMoistureSensors ? "text-gray-600" : "text-red-500"}>
                    {hasSoilMoistureSensors ? "Assigned" : "None"}
                  </span>
                </p>

                {/* Row 4: NPK Sensors */}
                <p className="text-sm text-gray-600 bg-gray-100 font-bold p-2 rounded">
                  NPK Sensors {" "}
                  <span className={hasNpkSensors ? "text-gray-600" : "text-red-500"}>
                    {hasNpkSensors ? "Assigned" : "None"}
                  </span>
                </p>

                {/* Row 5: Analysis */}
                <p className="text-green-900 text-sm font-medium">
                  Analysis has been generated
                </p>
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
