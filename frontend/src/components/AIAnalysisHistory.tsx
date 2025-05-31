import React, { useEffect, useState } from "react";
import { usePlotStore } from "../store/usePlotStore";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const AIAnalysisHistory: React.FC = () => {
  const plotId = usePlotStore((state) => state.selectedPlotId);
  const aiHistory = usePlotStore((state) => state.aiHistory);
  const getAiHistory = usePlotStore((state) => state.getAiHistory);

  const [filterType, setFilterType] = useState<"Daily" | "Weekly">("Weekly");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    if (plotId) {
      getAiHistory(plotId);
    }
  }, [plotId, getAiHistory]);

  // Filtered and sorted entries
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

  const displayedFindings = filteredFindings?.slice(0, visibleCount);

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const hasMore = filteredFindings && visibleCount < filteredFindings.length;

  return (
    <div className="mt-6 bg-white p-10 rounded-xl shadow-sm border space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-green-800">
          Analysis List History:
        </h2>

        {/* Filter Buttons */}
        <div className="bg-gray-100 p-1 rounded-full flex items-center">
          <button
            onClick={() => {
              setFilterType("Daily");
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            className={`px-3 py-1 text-sm rounded-full ${
              filterType === "Daily"
                ? "bg-green-900 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => {
              setFilterType("Weekly");
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            className={`px-3 py-1 text-sm rounded-full ${
              filterType === "Weekly"
                ? "bg-green-900 text-white"
                : "text-gray-700 hover:bg-gray-200"
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
          <div className="text-center text-gray-500">Loading...</div>
        ) : displayedFindings?.length === 0 ? (
          <div className="text-center text-gray-500">
            No {filterType.toLowerCase()} English findings found.
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
                <div className="col-span-8 text-sm text-gray-600">
                  {findings}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* See More Button */}
      {hasMore && (
        <div
          onClick={handleSeeMore}
          className="text-sm text-center text-green-800 mt-2 hover:underline cursor-pointer flex items-center justify-center gap-1"
        >
          See more <ArrowRight size={14} />
        </div>
      )}
    </div>
  );
};

export default AIAnalysisHistory;
