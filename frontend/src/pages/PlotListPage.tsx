import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { usePlotStore } from "../store/usePlotStore";

const PlotListPage = () => {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);
  const { plots, getUserPlot, setSelectedPlotId } = usePlotStore();

  useEffect(() => {
    if (authUser?.user_id) {
      getUserPlot(authUser.user_id);
    }
  }, [authUser?.user_id]);

  const goToPlotPage = (plotId: string) => {
    setSelectedPlotId(plotId);
    navigate(`/plots/details/${plotId}`);
    console.log("Selected plot ID:", plotId);
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
          {plots.map((plot) => (
            <div
              key={plot.plot_id}
              className="bg-white rounded-xl shadow p-6 transition hover:shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">Plot Name:</p>
                  <h2 className="text-2xl font-semibold text-green-800">
                    {plot.plot_name}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-800 text-white px-4 py-1 rounded-full text-sm">
                    {plot.user_crops?.crop_name || "Unknown Crop"}
                  </span>
                  <button
                    onClick={() => goToPlotPage(plot.plot_id)}
                    className="bg-green-800 text-white w-7 h-7 rounded-full flex items-center justify-center"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-green-700 text-sm font-medium mt-2">
                  Analysis has been generated
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No plots found for your account.</p>
      )}
    </div>
  );
};

export default PlotListPage;
