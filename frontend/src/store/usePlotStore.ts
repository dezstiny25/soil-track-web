// store/usePlotStore.ts
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { calculateAreaInSqMeters } from "../utils/calculateArea";

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

// Adjusted AiSummary interface according to new backend response
export interface AiSummary {
  headline: string;
  short_summary: string;
  language_type: string;  // new field to track language of summary
}

export interface PlotDetailsCardProps {
  cropName: string;
  soilType: string;
  moistureSensorCount: number;
  npkSensorCount: number;
  onEditCrop?: () => void;
  onEditSoil?: () => void;
}

export interface AIHistoryEntry {
  language_type: string;
  analysis_type: string;
  analysis: {
    short_summary: string;
    headline: string;
    AI_Analysis: {
      date: string;
      status: string;
      summary: {
        findings: string;
        predictions: string;
        recommendations: string;
      };
      warnings: {
        drought_risks: string;
        nutrient_imbalances: string;
      };
    };
  };
}

interface SensorCountByCategory {
  [category: string]: number;
}

interface GlobalIrrigationLog {
  plot_id: string;
  plot_name: string;
  time_started: string;
  time_stopped: string;
  mac_address: string;
}

interface PlotState {
  plots: Plot[] | null;
  selectedPlotId: string | null;
  selectedPlotDetails: PlotDetails | null;

  aiSummary: AiSummary | null;
  getAiSummary: (plotId: string) => Promise<void>;

  sensorCountsByPlot: Record<string, SensorCountByCategory>;
  getSensorCount: (plotId: string) => Promise<void>;
  sensorCountByCategory: () => SensorCountByCategory;

  aiHistory: AIHistoryEntry[] | null;
  getAiHistory: (plotId: string) => Promise<void>;

  getGroupedIrrigationLogs: () => { date: string; count: number }[];

  areaInSqMeters: number | null;
  setAreaInSqMeters: (area: number) => void;

  globalIrrigationLogs: GlobalIrrigationLog[];
  getGlobalIrrigationLogs: (userId: string) => Promise<void>;

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

// Fetch plot list by user_id
export const getPlotList = async (userId: string) => {
  return await safeAsync(
    axiosInstance.get("/plots/get-plots", { params: { user_id: userId } }),
    { plots: [] }
  );
};

// Fetch full plot details by plot_id
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
    const errorMessage =
      err.response?.data?.message || err.message || "Unknown error occurred";
    alert(`Failed to fetch plot details: ${errorMessage}`);
    return null;
  }
};

// Zustand store
export const usePlotStore = create<PlotState>((set, get) => ({
  plots: null,
  selectedPlotId: null,
  selectedPlotDetails: null,
  sensorCountsByPlot: {},

  aiSummary: null,
  aiHistory: null,

  areaInSqMeters: null,
  setAreaInSqMeters: (area) => set({ areaInSqMeters: area }),

  getUserPlot: async (userId: string) => {
    const data = await getPlotList(userId);
    console.log("Fetched plots:", data);
    set({ plots: data.plots });
  },

  getFullPlotDetails: async (plotId: string) => {
    const plotDetails = await getPlotDetails(plotId);
    if (plotDetails) {
      set({ selectedPlotDetails: plotDetails });

      try {
        const rawPolygons = plotDetails.plot_deets.polygons;
        const polygons =
          typeof rawPolygons === "string" ? JSON.parse(rawPolygons) : rawPolygons;

        if (Array.isArray(polygons) && polygons.length > 0) {
          const area = calculateAreaInSqMeters(polygons);
          set({ areaInSqMeters: area });
        } else {
          set({ areaInSqMeters: null });
        }
      } catch (err) {
        console.error("Failed to calculate area:", err);
        set({ areaInSqMeters: null });
      }
    }
  },

  setSelectedPlotId: (plotId: string) => {
    set({ selectedPlotId: plotId });
  },

  getAiSummary: async (plotId: string) => {
    try {
      const res = await axiosInstance.get("/plots/ai-summary", {
        params: { plot_id: plotId },
      });
      // Expecting { headline, short_summary, language_type }
      set({ aiSummary: res.data });
    } catch (error) {
      console.error("Failed to fetch AI summary:", error);
      set({ aiSummary: null });
    }
  },

  getSensorCount: async (plotId: string) => {
    try {
      const res = await axiosInstance.get("/plots/sensor-count", {
        params: { plot_id: plotId },
      });
      const counts: SensorCountByCategory = res.data.sensorCounts || {};
      set((state) => ({
        sensorCountsByPlot: {
          ...state.sensorCountsByPlot,
          [plotId]: counts,
        },
      }));
    } catch (error) {
      console.error("Failed to fetch sensor count", error);
      set((state) => ({
        sensorCountsByPlot: {
          ...state.sensorCountsByPlot,
          [plotId]: {},
        },
      }));
    }
  },

  sensorCountByCategory: () => {
    const plotId = get().selectedPlotId;
    if (!plotId) return {};
    return get().sensorCountsByPlot[plotId] || {};
  },

  getAiHistory: async (plotId: string) => {
    try {
      const res = await axiosInstance.get("/plots/ai-history", {
        params: { plot_id: plotId },
      });
      // Expecting response: { history: AIHistoryEntry[] }
      set({ aiHistory: res.data.history });
    } catch (error) {
      console.error("Failed to fetch AI history", error);
      set({ aiHistory: null });
    }
  },

  getGroupedIrrigationLogs: () => {
    const logs = get().selectedPlotDetails?.irrigation_logs || [];

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
  },

  globalIrrigationLogs: [],
  getGlobalIrrigationLogs: async (userId: string) => {
    try {
      const res = await axiosInstance.get("/plots/irrigation-history", {
        params: { user_id: userId },
      });
      set({ globalIrrigationLogs: res.data.logs });
    } catch (err) {
      console.error("Failed to fetch global irrigation logs", err);
      set({ globalIrrigationLogs: [] });
    }
  },
}));
