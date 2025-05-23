// store/usePlotStore.ts
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

// Interfaces
export interface UserCrop {
  category: string;
  crop_name: string;
  moisture_max: number;
  moisture_min: number;
  nitrogen_max: number;
  nitrogen_min: number;
  phosphorus_max: number;
  phosphorus_min: number;
  potassium_max: number;
  potassium_min: number;
}

export interface Plot {
  plot_id: string;
  plot_name: string;
  soil_type: string;
  isValveOn: boolean;
  polygons: string;
  user_crops: UserCrop | null;
}

export interface MoistureReading {
  read_time: string;
  soil_moisture: number;
  sensor_id: string;
}

export interface NutrientReading {
  read_time: string;
  readed_nitrogen: number;
  readed_phosphorus: number;
  readed_potassium: number;
  sensor_id: string;
}

export interface IrrigationLog {
  time_started: string;
  time_stopped: string;
  mac_address: string;
}

export interface PlotDetails {
  plot_deets: Plot;
  moisture_readings: MoistureReading[];
  nutrient_readings: NutrientReading[];
  irrigation_logs: IrrigationLog[];
}

interface PlotState {
  plots: Plot[] | null;
  selectedPlotId: string | null;
  selectedPlotDetails: PlotDetails | null;

  getUserPlot: (userId: string) => Promise<void>;
  getFullPlotDetails: (plotId: string) => Promise<void>;
  setSelectedPlotId: (plotId: string) => void;
}

// Utility: fallback-safe promise handler
const safeAsync = async <T>(
  promise: Promise<{ data: T }>,
  fallback: T
): Promise<T> => {
  try {
    const res = await promise;
    return res.data;
  } catch (error) {
    console.error(error);
    return fallback;
  }
};

// ✅ Internal: fetch plot list by user_id
export const getPlotList = async (userId: string) => {
  return await safeAsync(
    axiosInstance.get("/plots/get-plots", { params: { user_id: userId } }),
    { plots: [] }
  );
};

// ✅ Internal: fetch full plot details by plot_id
export const getPlotDetails = async (plotId: string): Promise<PlotDetails | null> => {
  try {
    const res = await axiosInstance.get("/plots/analytics", {
      params: { plot_id: plotId },
    });

    console.log("Raw plot details from API:", res.data);

    return {
      plot_deets: res.data.plot,
      moisture_readings: res.data.moisture_readings,
      nutrient_readings: res.data.nutrient_readings,
      irrigation_logs: res.data.irrigation_logs,
    };
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || "Unknown error occurred";
    alert(`Failed to fetch plot details: ${errorMessage}`);
    return null;
  }
};

// ✅ Zustand store
export const usePlotStore = create<PlotState>((set) => ({
  plots: null,
  selectedPlotId: null,
  selectedPlotDetails: null,

  getUserPlot: async (userId: string) => {
    const data = await getPlotList(userId);
    console.log("Fetched plots:", data);
    set({ plots: data.plots });
  },

  getFullPlotDetails: async (plotId: string) => {
    const plotDetails = await getPlotDetails(plotId);
    if (plotDetails) {
      set({ selectedPlotDetails: plotDetails });
    }
  },

  setSelectedPlotId: (plotId: string) => {
    set({ selectedPlotId: plotId });
  },
}));
