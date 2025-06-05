import React, { useState, useMemo } from "react";
import { usePlotStore } from "../store/usePlotStore";
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../styles/plotCard.module.css";
import pump from "../assets/hardware/waterpump_connected.png";

const ITEMS_PER_PAGE = 5;
const MAX_ITEMS_ON_EXPAND = 10;

const IrrigationLogHistory: React.FC = () => {
  const selectedPlotDetails = usePlotStore((state) => state.selectedPlotDetails);
  const logs = selectedPlotDetails?.irrigation_logs || [];

  const groupedLogs = useMemo(() => {
    const grouped: Record<string, number> = {};
    logs.forEach((log) => {
      const date = new Date(log.time_started).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      grouped[date] = (grouped[date] || 0) + 1;
    });
    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // newest first
  }, [logs]);

  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);

  const itemsPerPage = expanded ? MAX_ITEMS_ON_EXPAND : ITEMS_PER_PAGE;
  const totalPages = Math.ceil(groupedLogs.length / itemsPerPage);

  const paginatedLogs = groupedLogs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const showSeeMore = !expanded && groupedLogs.length > ITEMS_PER_PAGE;

  return (
    <div className="mt-6 bg-white p-10 rounded-xl space-y-4">
      {/* Header with Image and Button */}
      <div className="bg-white py-11 px-5 rounded-xl shadow-sm border flex flex-col items-center justify-center h-[350px] space-y-4">
        <img src={pump} alt="Valve" className="w-[220px] h-[220px] object-contain" />
        <button className="w-full py-2 bg-gray-100 text-gray-500 rounded-lg text-sm hover:bg-gray-200 transition">
          Open the valve
        </button>
      </div>

      <div className="flex items-center justify-between">
        <h2 className={styles.medText}>Irrigation Log History</h2>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 px-7 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded">
        <div className="col-span-8">Date:</div>
        <div className="col-span-4">Times Irrigated</div>
      </div>

      {/* Table Rows */}
      <div className="space-y-2">
        {paginatedLogs.length === 0 ? (
          <div className="text-center text-gray-500">No irrigation logs found.</div>
        ) : (
          paginatedLogs.map((entry) => (
            <div
              key={entry.date}
              className="grid grid-cols-12 px-4 py-3 border-t border-gray-200 items-start"
            >
              <div className="col-span-10 font-medium text-gray-800 flex items-center gap-2">
                {entry.date}
                <ArrowUpRight size={16} className="text-gray-400" />
              </div>
              <div className="col-span-2 text-sm text-gray-600">{entry.count}</div>
            </div>
          ))
        )}
      </div>

      {/* "See More" Button */}
      {showSeeMore && (
        <div
          onClick={() => setExpanded(true)}
          className="text-sm text-center text-gray-600 mt-2 hover:underline cursor-pointer flex items-center justify-center gap-1"
        >
          See more <ArrowRight size={14} />
        </div>
      )}

      {/* Pagination Controls */}
      {expanded && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4 text-sm text-gray-700">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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

export default IrrigationLogHistory;
