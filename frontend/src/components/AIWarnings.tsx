import React, { useEffect } from "react";
import { usePlotStore } from "../store/usePlotStore";
import dayjs from "dayjs";
import "../index.css";
import styles from "../styles/plotCard.module.css";

export function AIWarnings({ analysisType }: { analysisType: "Daily" | "Weekly" }) {
  const selectedPlotId = usePlotStore((state) => state.selectedPlotId);
  const aiHistory = usePlotStore((state) => state.aiHistory);
  const getAiHistory = usePlotStore((state) => state.getAiHistory);

  useEffect(() => {
    if (selectedPlotId) {
      getAiHistory(selectedPlotId);
    }
  }, [selectedPlotId, getAiHistory]);

  if (!selectedPlotId) {
    return <p>Please select a plot to see AI insights.</p>;
  }

  if (!aiHistory) {
    return <p>Loading AI insights...</p>;
  }

  const now = dayjs();
  const sevenDaysAgo = now.subtract(7, "day");

  const englishEntries = aiHistory.filter(
    (entry) =>
      entry.language_type === "en" &&
      entry.analysis_type === analysisType &&
      entry.analysis?.AI_Analysis?.warnings &&
      (
        analysisType === "Daily" ||
        (analysisType === "Weekly" &&
          dayjs(entry.analysis_date).isAfter(sevenDaysAgo) &&
          dayjs(entry.analysis_date).isBefore(now.add(1, "day"))
        )
      )
  );

  if (englishEntries.length === 0) {
    return (
      <p>
        {analysisType === "Weekly"
          ? "No weekly analysis available."
          : "No AI warnings available for this plot."}
      </p>
    );
  }

  const latestEntry = englishEntries.reduce((latest, current) => {
    return new Date(current.analysis.AI_Analysis.date) > new Date(latest.analysis.AI_Analysis.date)
      ? current
      : latest;
  });

  const { drought_risks, nutrient_imbalances } = latestEntry.analysis.AI_Analysis.warnings;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Drought Risks */}
      <div className={`${styles.card} border`}>
        <h4 className="text-[26px] font-bold mb-2">Drought Risks</h4>
        <p className="text-gray-800 text-m">
          {drought_risks || "No drought risks identified in the latest analysis."}
        </p>
      </div>

      {/* Nutrient Imbalance */}
      <div className={`${styles.card} border`}>
        <h4 className="text-[26px] font-bold mb-2">Nutrient Imbalances</h4>
        <p className="text-gray-800 text-m">
          {nutrient_imbalances || "No nutrient imbalances detected in the latest analysis."}
        </p>
      </div>
    </div>
  );
}

export default AIWarnings;
