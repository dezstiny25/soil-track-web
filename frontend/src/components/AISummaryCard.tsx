import React, { useEffect } from "react";
import { usePlotStore } from "../store/usePlotStore";
import { useAuthStore } from "../store/useAuthStore";
import dashboardStyles from "../styles/dashboard.module.css";
import styles from "../styles/plotCard.module.css";

const AISummaryCard: React.FC = () => {
  const selectedPlotId = usePlotStore((state) => state.selectedPlotId);
  const aiHistory = usePlotStore((state) => state.aiHistory);
  const getAiHistory = usePlotStore((state) => state.getAiHistory);
  const authUser = useAuthStore((state) => state.authUser);

  useEffect(() => {
    if (selectedPlotId) {
      getAiHistory(selectedPlotId);
    }
  }, [selectedPlotId, getAiHistory]);

  console.log("AI History:", aiHistory);

  if (!selectedPlotId) {
    return <p>Please select a plot to see AI summary.</p>;
  }

  if (!aiHistory) {
    return <p></p>;
  }

  // Filter English entries with complete AI_Analysis content
  const englishEntries = aiHistory.filter(
    (entry) =>
      entry.language_type?.toLowerCase() === "en" &&
      entry.analysis?.headline &&
      entry.analysis?.short_summary &&
      entry.analysis?.AI_Analysis?.date
  );

  if (englishEntries.length === 0) {
    return <p>No Analysis Generated for today.</p>;
  }

  // Sort entries by date (descending) and pick the latest
  const latestEntry = englishEntries.reduce((latest, current) => {
    return new Date(current.analysis.AI_Analysis.date) >
      new Date(latest.analysis.AI_Analysis.date)
      ? current
      : latest;
  });
  const isToday = (() => {
    if (!latestEntry?.analysis?.AI_Analysis?.date) return false;
    const today = new Date();
    const analysisDate = new Date(latestEntry.analysis.AI_Analysis.date);
    return (
      today.getFullYear() === analysisDate.getFullYear() &&
      today.getMonth() === analysisDate.getMonth() &&
      today.getDate() === analysisDate.getDate()
    );
  })();

  if (!isToday) {
    return <div className="rounded-xl bg-white p-12 py-16 space-y-4">
      <span className={dashboardStyles.subHeading}>
        Hey, <span className="font-bold">{authUser?.userFname || "Guest Account"}! 👋</span>
      </span>
      <h2 className={styles.superTitle}>No Analysis Generated.</h2>
      <p className="text-gray-800 w-3/4 text-lg">Currently, there is no analysis generated today.</p>
    </div>;
  }

  const { headline, short_summary } = latestEntry.analysis;

  return (
    <div className="rounded-xl bg-white p-12 py-14 space-y-4">
      <span className={dashboardStyles.subHeading}>
        Hey, <span className="font-bold">{authUser?.userFname || "Guest Account"}! 👋</span>
      </span>
      <h2 className="text-[53px] font-bold text-green-900 leading-none mb-2">{headline}</h2>
      <p className="text-gray-800 w-3/4 text-lg">{short_summary}</p>
    </div>
  );
};

export default AISummaryCard;
