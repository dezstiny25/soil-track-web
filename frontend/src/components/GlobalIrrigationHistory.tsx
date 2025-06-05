import { useEffect, useState } from "react";
import { usePlotStore } from "../store/usePlotStore";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import styles from "../styles/plotCard.module.css";

const DEFAULT_ITEMS = 5;
const EXPANDED_ITEMS = 10;

export default function GlobalIrrigationHistory({ userId }: { userId: string }) {
  const { globalIrrigationLogs, getGlobalIrrigationLogs } = usePlotStore();

  const [page, setPage] = useState(1);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (userId) {
      getGlobalIrrigationLogs(userId);
      setPage(1);
      setShowMore(false);
    }
  }, [userId]);

  const logsPerPage = showMore ? EXPANDED_ITEMS : DEFAULT_ITEMS;
  const totalLogs = globalIrrigationLogs.length;
  const totalPages = Math.ceil(totalLogs / logsPerPage);

  const startIndex = (page - 1) * logsPerPage;
  const endIndex = page * logsPerPage;
  const currentLogs = globalIrrigationLogs.slice(startIndex, endIndex);

  const handleSeeMore = () => {
    setShowMore(true);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="mt-6 bg-white px-5 py-2 space-y-4">
      <h2 className={styles.medText}>Recent Irrigation Log</h2>

      {/* Table Header */}
      <div className="grid grid-cols-12 px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded">
        <div className="col-span-3">Plot</div>
        <div className="col-span-4">Start Time</div>
        <div className="col-span-4">Stop Time</div>
        <div className="col-span-1 text-center">Action</div>
      </div>

      {/* Table Body */}
      <div className="space-y-2">
        {totalLogs === 0 ? (
          <div className="text-center text-gray-500">No irrigation logs found.</div>
        ) : (
          currentLogs.map((log, i) => {
            const start = new Date(log.time_started).toLocaleString();
            const stop = new Date(log.time_stopped).toLocaleString();

            return (
              <div
                key={i}
                className="grid grid-cols-12 px-4 py-3 border-t border-gray-200 items-start"
              >
                <div className="col-span-3 font-medium text-gray-800 flex items-center gap-2">
                  {log.plot_name}
                  <ArrowUpRight size={14} className="text-gray-400" />
                </div>
                <div className="col-span-4 text-sm text-gray-600">{start}</div>
                <div className="col-span-4 text-sm text-gray-600">{stop}</div>
                <div className="col-span-1 flex justify-center">
                  <button className="text-sm text-blue-600 hover:underline">Details</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* See More Button */}
      {!showMore && totalLogs > DEFAULT_ITEMS && (
        <div
          onClick={handleSeeMore}
          className="text-sm text-center text-gray-800 mt-2 hover:underline cursor-pointer flex items-center justify-center gap-1"
        >
          See more <ArrowRight size={14} />
        </div>
      )}

      {/* Pagination Controls */}
      {showMore && totalPages > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={`px-3 py-1 rounded-tl-lg rounded-bl-lg text-sm text-gray-800 ${
              page === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : `${styles.green} text-white hover:bg-green-800`
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
                    className={`px-3 py-1 rounded-lg text-sm ${
                      page === pageNumber
                        ? `${styles.green} text-white`
                        : ""
                    }`}
                  >
                    {pageNumber}
                  </button>
              );
            })}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded-tr-lg rounded-br-lg text-sm ${
              page === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : `${styles.green} text-white`
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
