import React from "react";
import { usePlotStore } from "../store/usePlotStore";
import { ArrowUpRight, ArrowRight } from "lucide-react";

const IrrigationLogHistory: React.FC = () => {
  const selectedPlotDetails = usePlotStore((state) => state.selectedPlotDetails);
  const logs = selectedPlotDetails?.irrigation_logs || [];

  const groupedLogs = React.useMemo(() => {
    const grouped: Record<string, number> = {};

    logs.forEach((log) => {
      const date = new Date(log.time_started).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      grouped[date] = (grouped[date] || 0) + 1;
    });

    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
  }, [logs]);

  return (
    <div className="mt-6 bg-white p-10 rounded-xl space-y-4">
      {/* Header */}
      <div className='bg-white p-10 rounded-xl shadow-sm border'>
        <img
          src={`../assets/hardware/waterpump_connected.png`}
          alt="Valve"
          className="w-[220px] h-[220px] object-contain overflow mb-4"
        />
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-green-800">
          Irrigation Log History
        </h2>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded">
        <div className="col-span-8">Date:</div>
        <div className="col-span-4">Irrigation Count</div>
      </div>

      {/* Table Rows */}
      <div className="space-y-2">
        {groupedLogs.length === 0 ? (
          <div className="text-center text-gray-500">No irrigation logs found.</div>
        ) : (
          groupedLogs.map((entry) => (
            <div
              key={entry.date}
              className="grid grid-cols-12 px-4 py-3 border-t border-gray-200 items-start"
            >
                <div className="col-span-10 font-medium text-gray-800 flex items-center gap-2">
                    {entry.date}
                    <ArrowUpRight size={16} className="text-gray-400" />
                </div>

                <div className="col-span-2 text-sm text-gray-600">
                    {entry.count}
                </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Link (optional) */}
      <div className="text-sm text-center text-gray-600 mt-2 hover:underline cursor-pointer flex items-center justify-center gap-1">
        See more <ArrowRight size={14} />
      </div>
    </div>
  );
};

export default IrrigationLogHistory;
