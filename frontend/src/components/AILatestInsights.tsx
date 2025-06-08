import React, { useEffect } from "react";
import { usePlotStore } from "../store/usePlotStore";
import dayjs from "dayjs";
import "../index.css";
import styles from "../styles/plotCard.module.css";

export function AILatestInsights({ analysisType }: { analysisType: "Daily" | "Weekly" }) {
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
      entry.analysis?.AI_Analysis?.summary &&
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
          : "No English AI findings available for this plot."}
      </p>
    );
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
        <h4 className={styles.bigText}>Findings</h4>
        <p className="mt-2 text-gray-800 text-m text-justify">{findings}</p>
      </div>

      {/* Predictions */}
      <div className="rounded-xl col-span-1 bg-white p-9 shadow">
        <h4 className={styles.bigText}>Predictions</h4>
        <p className="mt-2 text-gray-800 text-m text-justify">{predictions}</p>
      </div>

      {/* Recommendations */}
      <div className="rounded-xl col-span-1 bg-white p-9 shadow">
        <h4 className={styles.bigText}>Recommendations</h4>
        <p className="mt-2 text-gray-800 text-m text-justify">{recommendations}</p>
      </div>
    </div>
  );
}

export default AILatestInsights;
