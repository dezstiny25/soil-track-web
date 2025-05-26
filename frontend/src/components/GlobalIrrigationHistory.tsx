// components/GlobalIrrigationHistory.tsx
import { useEffect, useState } from "react";
import { usePlotStore } from "../store/usePlotStore";

export default function GlobalIrrigationHistory({ userId }: { userId: string }) {
  const { globalIrrigationLogs, getGlobalIrrigationLogs } = usePlotStore();

  const [page, setPage] = useState(1);
  const [logsPerPage, setLogsPerPage] = useState(5);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (userId) {
      getGlobalIrrigationLogs(userId);
      // Reset pagination state when user changes
      setPage(1);
      setLogsPerPage(5);
      setShowMore(false);
    }
  }, [userId]);

  // Pagination calculations
  const totalLogs = globalIrrigationLogs.length;
  const totalPages = Math.ceil(totalLogs / logsPerPage);

  // Slice logs to show for current page
  const currentLogs = globalIrrigationLogs.slice(
    (page - 1) * logsPerPage,
    page * logsPerPage
  );

  const handleSeeMore = () => {
    setLogsPerPage(10);
    setShowMore(true);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-xl mt-4">
      <h2 className="text-xl font-semibold mb-4">Irrigation Logs</h2>

      {totalLogs === 0 ? (
        <p>No irrigation logs found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Plot</th>
                  <th className="p-2 text-left">Start Time</th>
                  <th className="p-2 text-left">Stop Time</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{log.plot_name}</td>
                    <td className="p-2">{new Date(log.time_started).toLocaleString()}</td>
                    <td className="p-2">{new Date(log.time_stopped).toLocaleString()}</td>
                    <td className="p-2 text-center">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* See More Button */}
          {!showMore && totalLogs > 5 && (
            <div className="mt-4">
              <button
                onClick={handleSeeMore}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                See More
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {showMore && totalPages > 1 && (
            <div className="mt-4 flex space-x-2 justify-center">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`px-3 py-1 rounded ${
                  page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white"
                }`}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, idx) => {
                const pageNumber = idx + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 rounded ${
                      page === pageNumber
                        ? "bg-blue-800 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded ${
                  page === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
