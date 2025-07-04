import React, { useEffect } from "react";
import { usePlotStore } from "../store/usePlotStore";
import { Pencil } from "lucide-react";
import {
  convertSqMetersToAcres,
  convertSqMetersToSqFeet,
} from "../utils/calculateArea";
import styles from "../styles/plotCard.module.css"

const PlotDetailsCard: React.FC = () => {
  const plotId = usePlotStore((state) => state.selectedPlotId);
  const selectedPlotDetails = usePlotStore((state) => state.selectedPlotDetails);
  const getFullPlotDetails = usePlotStore((state) => state.getFullPlotDetails);
  const getSensorCount = usePlotStore((state) => state.getSensorCount);
  const areaInSqMeters = usePlotStore((state) => state.areaInSqMeters);

const getSensorCountByCategory = usePlotStore((state) => state.sensorCountByCategory);
const sensorCountByCategory = getSensorCountByCategory();


  useEffect(() => {
    if (plotId) {
      getFullPlotDetails(plotId);
      getSensorCount(plotId);
    }
  }, [plotId]);

  const crop = selectedPlotDetails?.plot_deets?.user_crops?.crop_name || "N/A";
  const soil = selectedPlotDetails?.plot_deets?.soil_type || "N/A";
  const moistureCount = sensorCountByCategory?.["Moisture Sensor"] || 0;
  const npkCount = sensorCountByCategory?.["NPK Sensor"] || 0;

  const formattedSqMeters =
    typeof areaInSqMeters === "number" && !isNaN(areaInSqMeters)
      ? areaInSqMeters.toFixed(2)
      : null;

    const areaInHectares = formattedSqMeters
    ? (Number(formattedSqMeters) / 10000).toFixed(2)
    : null;

  return (
    <div>
      <div className="flex justify-between items-center text-sm font-medium text-gray-900 mb-4 bg-gray-100 py-3 px-5 rounded-tl-lg rounded-tr-lg">
        <span>Plot Details:</span>
        {formattedSqMeters ? (
          <div className="text-right text-gray-500 text-sm">
            <div>{areaInHectares} ha</div>
          </div>
        ) : (
          <span className="text-red-500">Area not available</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="border rounded-lg p-5 bg-gray-50 relative">
          <div className={styles.gsText}>Crop Planted:</div>
          <div className={styles.smallText}>{crop}</div>
        </div>

        <div className="border rounded-lg p-5 bg-gray-50 relative">
          <div className={styles.gsText}>Soil Type:</div>
          <div className={styles.smallText}>{soil}</div>
          <button className="absolute top-2 right-2 text-gray-600 hover:text-black">
            <Pencil size={16} />
          </button>
        </div>

        <div className="border rounded-lg p-5 bg-gray-50">
          <div className={styles.gsText}>Moisture Sensors:</div>
          <div className={styles.smallText}>
            {moistureCount} sensor{moistureCount !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="border rounded-lg p-5 bg-gray-50">
          <div className={styles.gsText}>NPK Sensors:</div>
          <div className={styles.smallText}>
            {npkCount} sensor{npkCount !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlotDetailsCard;
