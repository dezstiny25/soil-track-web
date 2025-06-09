//AISummaryCard.tsx
import React, { useEffect, useMemo } from "react";
import { usePlotStore } from "../store/usePlotStore";
import { useAuthStore } from "../store/useAuthStore";
import dashboardStyles from "../styles/dashboard.module.css";
import styles from "../styles/plotCard.module.css";

type AISummaryCardProps = {
  onAnalysisCheck?: (hasAnalysis: boolean) => void;
};

const AISummaryCard: React.FC<AISummaryCardProps> = ({ onAnalysisCheck }) => {
  const selectedPlotId = usePlotStore((state) => state.selectedPlotId);
  const aiHistory = usePlotStore((state) => state.aiHistory);
  const getAiHistory = usePlotStore((state) => state.getAiHistory);
  const authUser = useAuthStore((state) => state.authUser);

  useEffect(() => {
    if (selectedPlotId) {
      getAiHistory(selectedPlotId);
    }
  }, [selectedPlotId, getAiHistory]);

  const englishEntries = useMemo(() => {
    
    if (!Array.isArray(aiHistory)) return [];
    return aiHistory.filter((entry) => {
      const analysis = entry?.analysis;
      const aiAnalysis = analysis?.AI_Analysis;
      return (
        entry?.language_type?.toLowerCase() === "en" &&
        typeof analysis?.headline === "string" &&
        typeof analysis?.short_summary === "string" &&
        typeof aiAnalysis?.date === "string"
      );
    });
    console.log("AI History raw:", aiHistory);
  }, [aiHistory]);

  const latestEntry = useMemo(() => {
    
    if (englishEntries.length === 0) return null;
    return englishEntries.reduce((latest, current) => {
      const latestDate = new Date(latest.analysis?.AI_Analysis?.date || 0);
      const currentDate = new Date(current.analysis?.AI_Analysis?.date || 0);
      return currentDate > latestDate ? current : latest;
    });
    console.log("Filtered English entries:", englishEntries);
  }, [englishEntries]);

  const isToday = useMemo(() => {
    const analysisDate = latestEntry?.analysis?.AI_Analysis?.date;
    if (!analysisDate) return false;
    const today = new Date();
    const date = new Date(analysisDate);
    return (
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate()
    );
  }, [latestEntry]);

  useEffect(() => {
      console.log("Latest Entry:", latestEntry);
  console.log("Is today:", isToday);
    onAnalysisCheck?.(!!latestEntry && isToday);
  }, [onAnalysisCheck, latestEntry, isToday]);

  // Show message when no valid analysis is available
  if (!latestEntry || !isToday) {
    return (
      <div className="rounded-xl bg-white p-12 py-16 space-y-4">
        <span className={dashboardStyles.subHeading}>
          Hey, <span className="font-bold">{authUser?.userFname || "Guest Account"}! 👋</span>
        </span>
        <h2 className={styles.superTitle}>No Analysis Generated.</h2>
        <p className="text-gray-800 w-3/4 text-lg">
          Currently, there is no analysis generated today.
        </p>
      </div>
    );
  }

  // Show latest analysis
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
