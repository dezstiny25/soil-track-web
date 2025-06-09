//AIAnalysisHistory.tsx
import React, { useEffect, useState } from "react";
import { usePlotStore } from "../store/usePlotStore";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../styles/plotCard.module.css";

const INITIAL_ITEMS = 5;
const MAX_ITEMS = 10;

const AIAnalysisHistory: React.FC = () => {
  const plotId = usePlotStore((state) => state.selectedPlotId);
  const aiHistory = usePlotStore((state) => state.aiHistory);
  const getAiHistory = usePlotStore((state) => state.getAiHistory);

  const [filterType, setFilterType] = useState<"Daily" | "Weekly">("Daily");
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (plotId) {
      getAiHistory(plotId);
    }
  }, [plotId, getAiHistory]);

  useEffect(() => {
    setPage(1);
    setExpanded(false);
  }, [filterType]);
console.log("Raw AI history:", aiHistory);

  const filteredFindings = aiHistory
  
    ?.filter(
      (entry) =>
        entry.language_type?.toLowerCase() === "en" &&
        entry.analysis_type === filterType &&
        entry.analysis?.AI_Analysis?.summary?.findings
    )
    .sort(
      (a, b) =>
        new Date(b.analysis.AI_Analysis.date).getTime() -
        new Date(a.analysis.AI_Analysis.date).getTime()
    );

  const itemsPerPage = expanded ? MAX_ITEMS : INITIAL_ITEMS;
  const totalPages = Math.ceil((filteredFindings?.length || 0) / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const displayedFindings = filteredFindings?.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="bg-white p-10 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className={styles.medText}>Analysis List History:</h2>

        {/* Filter Buttons */}
        <div className={styles.toggleContainer}>
          <button
            onClick={() => setFilterType("Daily")}
            className={`${styles.rangeButton} ${
              filterType === "Daily" ? styles.active : ""
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setFilterType("Weekly")}
            className={`${styles.rangeButton} ${
              filterType === "Weekly" ? styles.active : ""
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded">
        <div className="col-span-4">Date:</div>
        <div className="col-span-8">Findings</div>
      </div>

      {/* History Items */}
      <div className="space-y-2">
        {!aiHistory ? (
          <div className="text-center text-gray-500">No findings found.</div>
        ) : displayedFindings?.length === 0 ? (
          <div className="text-center text-gray-500">
            No {filterType.toLowerCase()} findings found.
          </div>
        ) : (
          displayedFindings.map((entry, index) => {
            const findings = entry.analysis.AI_Analysis.summary.findings;
            const analysisDate = entry.analysis.AI_Analysis.date;
            const formattedDate = analysisDate
              ? new Date(analysisDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "Unknown date";

            return (
              <div
                key={index}
                className="grid grid-cols-12 px-4 py-3 border-t border-gray-200 items-start"
              >
                <div className="col-span-4 font-medium text-gray-800 flex items-center gap-2">
                  {formattedDate}
                  <ArrowUpRight size={14} className="text-gray-400" />
                </div>
                <div className="col-span-8 text-sm text-gray-600">{findings}</div>
              </div>
            );
          })
        )}
      </div>

      {/* See More Button */}
      {!expanded && filteredFindings && filteredFindings.length > INITIAL_ITEMS && (
        <div
          onClick={() => setExpanded(true)}
          className="text-sm text-center text-green-800 mt-2 hover:underline cursor-pointer flex items-center justify-center gap-1"
        >
          See more <ArrowRight size={14} />
        </div>
      )}

      {/* Pagination */}
      {expanded && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4 text-sm text-gray-700">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className={`flex items-center gap-1 px-3 py-1 rounded border ${
              page === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className={`flex items-center gap-1 px-3 py-1 rounded border ${
              page === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AIAnalysisHistory;
