import React, { useEffect } from "react";
import { usePlotStore } from "../store/usePlotStore";

export function AILatestInsights() {
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
      entry.analysis?.AI_Analysis?.summary
  );

  if (englishEntries.length === 0) {
    return <p>No English AI findings available for this plot.</p>;
  }

  const latestEntry = englishEntries.reduce((latest, current) => {
    return new Date(current.analysis_date) > new Date(latest.analysis_date)
      ? current
      : latest;
  });

  const { findings, predictions, recommendations } = latestEntry.analysis.AI_Analysis.summary;

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Findings */}
      <div className="rounded-xl col-span-1 bg-white p-9 shadow">
        <h4 className="text-[26px] font-bold text-green-900 mb-2">Findings</h4>
        <p className="text-gray-800 text-m">{findings}</p>
      </div>

      {/* Predictions */}
      <div className="rounded-xl col-span-1 bg-white p-9 shadow">
        <h4 className="text-[26px] font-bold text-green-900 mb-2">Predictions</h4>
        <p className="text-gray-800 text-m">{predictions}</p>
      </div>

      {/* Recommendations */}
      <div className="rounded-xl col-span-1 bg-white p-9 shadow">
        <h4 className="text-[26px] font-bold text-green-900 mb-2">Recommendations</h4>
        <p className="text-gray-800 text-m">{recommendations}</p>
      </div>
    </div>
  );
}

export default AILatestInsights;
