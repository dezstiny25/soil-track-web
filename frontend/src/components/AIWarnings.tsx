import React, { useEffect } from "react";
import { usePlotStore } from "../store/usePlotStore";

export function AIWarnings() {
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

  const englishEntries = aiHistory.filter(
    (entry) =>
      entry.language_type === "en" &&
      entry.analysis?.AI_Analysis?.warnings
  );

  if (englishEntries.length === 0) {
    return <p>No English AI warnings available for this plot.</p>;
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
      <div className="rounded-xl bg-white p-9 shadow">
        <h4 className="text-[26px] font-bold text-red-700 mb-2">⚠ Drought Risks</h4>
        <p className="text-gray-800 text-m">
          {drought_risks || "No drought risks identified in the latest analysis."}
        </p>
      </div>

      {/* Nutrient Imbalance */}
      <div className="rounded-xl bg-white p-9 shadow">
        <h4 className="text-[26px] font-bold text-red-700 mb-2">⚠ Nutrient Imbalances</h4>
        <p className="text-gray-800 text-m">
          {nutrient_imbalances || "No nutrient imbalances detected in the latest analysis."}
        </p>
      </div>
    </div>
  );
}

export default AIWarnings;
