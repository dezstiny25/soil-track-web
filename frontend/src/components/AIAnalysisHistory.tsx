import React, { useEffect, useState } from "react";
import { usePlotStore } from "../store/usePlotStore";
import { ArrowRight, ArrowUpRight, Filter } from "lucide-react";

const AIAnalysisHistory: React.FC = () => {
  const plotId = usePlotStore((state) => state.selectedPlotId);
  const aiHistory = usePlotStore((state) => state.aiHistory);
  const getAiHistory = usePlotStore((state) => state.getAiHistory);

  const [filter, setFilter] = useState<"Daily" | "Weekly">("Weekly");

  useEffect(() => {
    if (plotId) {
      getAiHistory(plotId);
    }
  }, [plotId]);

  const filteredHistory = aiHistory?.filter((entry) => {
    return entry.analysis_type === filter;
  });

  return (
    <div className="mt-6 bg-white p-10 rounded-xl shadow-sm border space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-green-800">
          Analysis List History:
        </h2>

        <div className="flex items-center gap-2">
          {/* Filter Tabs */}
          <div className="bg-gray-100 p-1 rounded-full flex items-center">
            <button
              onClick={() => setFilter("Daily")}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === "Daily"
                  ? "bg-green-700 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setFilter("Weekly")}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === "Weekly"
                  ? "bg-green-700 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Weekly
            </button>
          </div>

          {/* Filter Button */}
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded">
        <div className="col-span-4">Date:</div>
        <div className="col-span-8">Quick Insights</div>
      </div>

      {/* History Items */}
      <div className="space-y-2">
        {!aiHistory ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : filteredHistory?.length === 0 ? (
          <div className="text-center text-gray-500">
            No {filter.toLowerCase()} entries found.
          </div>
        ) : (
          filteredHistory.map((entry, index) => (
            <div
              key={index}
              className="grid grid-cols-12 px-4 py-3 border-t border-gray-200 items-start"
            >
              <div className="col-span-4 font-medium text-gray-800 flex items-center gap-2">
                {new Date(entry.analysis_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                <ArrowUpRight size={14} className="text-gray-400" />
              </div>
              <div className="col-span-8 text-sm text-gray-600">
                {entry.findings}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Link */}
      <div className="text-sm text-center text-gray-600 mt-2 hover:underline cursor-pointer flex items-center justify-center gap-1">
        See more <ArrowRight size={14} />
      </div>
    </div>
  );
};

export default AIAnalysisHistory;
