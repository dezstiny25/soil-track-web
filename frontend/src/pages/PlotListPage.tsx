import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { usePlotStore } from "../store/usePlotStore";
import "../index.css";
import styles from "../styles/plotCard.module.css";

const PlotListPage = () => {
  const navigate = useNavigate();
  const aiSummary = usePlotStore((state) => state.aiSummary);
  const getAiSummary = usePlotStore((state) => state.getAiSummary);
  const authUser = useAuthStore((state) => state.authUser);

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
  const {
    plots,
    getUserPlot,
    setSelectedPlotId,
    sensorCountsByPlot,
  } = usePlotStore();

  useEffect(() => {
    if (authUser?.user_id) {
      getUserPlot(authUser.user_id);
      getAiSummary(authUser.user_id)
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
              <div key={plot.plot_id} className={styles.card}>
                <p className={styles.cardLabel}>Plot Name:</p>

                <div className={styles.headerRow}>
                  <h2 className={styles.cardTitle}>{plot.plot_name}</h2>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className={styles.cropBadge}>
                      {plot.user_crops?.crop_name || "No Crop Assigned"}
                    </span>
                    <button
                      onClick={() => goToPlotPage(plot.plot_id)}
                      className={styles.arrowButton}
                      aria-label={`Go to details for ${plot.plot_name}`}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <p className={styles.statusBox}>
                  Moisture Sensors {hasSoilMoistureSensors ? "Assigned" : "None"}
                </p>
                <p className={styles.statusBox}>
                  NPK Sensors {hasNpkSensors ? "Assigned" : "None"}
                </p>

                <p className={isToday 
                  ? styles.analysisText
                  : styles.analysisTextRed
                }>
                  {isToday 
                    ? "Analysis has been generated"
                    : "No analysis available"}
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
