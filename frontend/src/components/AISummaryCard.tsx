// components/AISummaryCard.tsx
import React, { useEffect } from "react";
import { usePlotStore } from "../store/usePlotStore";
import { useAuthStore } from '../store/useAuthStore';
import dashboardStyles from '../styles/dashboard.module.css';

const AISummaryCard: React.FC = () => {
  const plotId = usePlotStore((state) => state.selectedPlotId);
  const aiSummary = usePlotStore((state) => state.aiSummary);
  const getAiSummary = usePlotStore((state) => state.getAiSummary);
  const authUser = useAuthStore((state) => state.authUser);

  useEffect(() => {
    if (plotId) {
      getAiSummary(plotId);
    }
  }, [plotId]);

  return (
    <div className="rounded-xl shadow-md bg-white p-9 border border-gray-200 w-full mx-auto my-4 h-69">
      <span className={dashboardStyles.subHeading}>Hey, <span className="font-bold">{authUser?.userFname || 'Guest Account'}! 👋</span></span>
      <h2 className="text-[42px] font-bold text-green-900 mb-2">
        {aiSummary?.headline || "AI Summary Unavailable"}
      </h2>
      <p className="text-gray-800 w-3/4 text-lg">
        {aiSummary?.short_summary || "No summary data found for this plot."}
      </p>
    </div>
  );
};

export default AISummaryCard;
