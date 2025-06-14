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

export interface AiSummary {
  headline: string;
  summary: string;
  analysis_date: string; // or Date, depending on how you use it
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

interface SensorInfo {
  sensor_id: string;
  plot_id: string;
  sensor_name: string;
  sensor_category: string;
}


interface SensorDetail {
  sensor_id: string;
  sensor_name: string;
  sensor_category: string;
}

interface GlobalIrrigationLog {
  plot_id: string;
  plot_name: string;
  time_started: string;
  time_stopped: string;
  mac_address: string;
}

interface IoTDevice {
  id: string;
  user_id: string;
  mac_address: string;
  name?: string;
  created_at?: string;
}


interface PlotState {
  plots: Plot[] | null;
  selectedPlotId: string | null;
  selectedPlotDetails: PlotDetails | null;

  aiSummary: AiSummary | null;
  getAiSummary: (userId: string) => Promise<void>;

  sensorCountsByPlot: Record<string, SensorCountByCategory>;
  getSensorCount: (plotId: string) => Promise<void>;
  sensorCountByCategory: () => SensorCountByCategory;

  userSensorsByPlot: Record<string, SensorInfo[]>;
  getUserSensors: (userId: string) => Promise<void>;

  aiHistory: AIHistoryEntry[] | null;
  getAiHistory: (plotId: string) => Promise<void>;

  getGroupedIrrigationLogs: () => { date: string; count: number }[];

  areaInSqMeters: number | null;
  setAreaInSqMeters: (area: number) => void;

  globalIrrigationLogs: GlobalIrrigationLog[];
  getGlobalIrrigationLogs: (userId: string) => Promise<void>;

  userDevice: IoTDevice | null;
  getUserDevice: (userId: string) => Promise<void>;


  sensorDetailsByPlot: Record<string, SensorDetail[]>;
  getSensorDetails: (plotId: string) => Promise<void>;
  sensorDetails: () => SensorDetail[];

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

  const plots = data.plots || [];
  set({ plots });

  // Fetch all sensor counts in parallel
    await Promise.all(
      plots.map((plot) => plot.plot_id && get().getSensorCount(plot.plot_id))
    );
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

getAiSummary: async (userId: string) => {
  try {
    const res = await axiosInstance.get("/plots/ai-summary", {
      params: { user_id: userId },
    });

    const summary = res.data;

    // Defensive check for required field
    const hasValidDate = summary?.analysis_date && !isNaN(new Date(summary.analysis_date).getTime());

    if (hasValidDate) {
      const today = new Date();
      const summaryDate = new Date(summary.analysis_date);

      const isSameDay =
        today.getFullYear() === summaryDate.getFullYear() &&
        today.getMonth() === summaryDate.getMonth() &&
        today.getDate() === summaryDate.getDate();

      if (!isSameDay) {
        console.warn("AI summary exists but not for today.");
      }

      set({ aiSummary: summary });
    } else {
      console.warn("AI summary data received but missing or invalid date.");
      set({ aiSummary: null });
    }

  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn("No AI summary available for this user.");
    } else {
      console.error("Error fetching AI summary:", error);
    }

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
    const plots = get().plots;

    // If plots are not yet fetched, fetch them first
    let plotIds: string[] = [];

    if (!plots) {
      const data = await getPlotList(userId);
      const fetchedPlots = data.plots || [];
      set({ plots: fetchedPlots });
      plotIds = fetchedPlots.map((plot) => plot.plot_id);
    } else {
      plotIds = plots.map((plot) => plot.plot_id);
    }

    // Fetch all logs (backend filters by user_id and includes plot info)
    const res = await axiosInstance.get("/plots/irrigation-history", {
      params: { user_id: userId },
    });

    const allLogs = res.data.logs || [];

    // Filter logs that belong to the user's plot_ids
    const userLogs = allLogs
      .filter((log: any) => plotIds.includes(log.plot_id))
      .sort((a: any, b: any) =>
        new Date(b.time_started).getTime() - new Date(a.time_started).getTime()
      );

    set({ globalIrrigationLogs: userLogs });
  } catch (err) {
    console.error("Failed to fetch global irrigation logs", err);
    set({ globalIrrigationLogs: [] });
  }
},

userSensorsByPlot: {},

getUserSensors: async (userId: string) => {
  try {
    const res = await axiosInstance.get("/plots/get-user-sensors", {
      params: { user_id: userId },
    });
    const sensors: SensorInfo[] = res.data.sensors || [];

    // Group by plot_id
    const groupedByPlot: Record<string, SensorInfo[]> = {};
    for (const sensor of sensors) {
      const plotId = sensor.plot_id;
      if (!groupedByPlot[plotId]) groupedByPlot[plotId] = [];
      groupedByPlot[plotId].push(sensor);
    }

    set({ userSensorsByPlot: groupedByPlot });
  } catch (error) {
    console.error("Failed to fetch user sensors", error);
    set({ userSensorsByPlot: {} });
  }
},


  sensorDetailsByPlot: {},

  getSensorDetails: async (plotId: string) => {
    try {
      const res = await axiosInstance.get("/plots/sensor-details", {
        params: { plot_id: plotId },
      });
      const details: SensorDetail[] = res.data.sensorDetails || [];
      set((state) => ({
        sensorDetailsByPlot: {
          ...state.sensorDetailsByPlot,
          [plotId]: details,
        },
      }));
    } catch (error) {
      console.error("Failed to fetch sensor details", error);
      set((state) => ({
        sensorDetailsByPlot: {
          ...state.sensorDetailsByPlot,
          [plotId]: [],
        },
      }));
    }
  },

  sensorDetails: () => {
    const plotId = get().selectedPlotId;
    if (!plotId) return [];
    return get().sensorDetailsByPlot[plotId] || [];
  },

  userDevice: null,

  getUserDevice: async (userId: string) => {
    try {
      const res = await axiosInstance.get("/plots/user-device", {
        params: { user_id: userId },
      });
      set({ userDevice: res.data.device });
    } catch (err) {
      console.error("Failed to fetch user IoT device", err);
      set({ userDevice: null });
    }
  },

}));