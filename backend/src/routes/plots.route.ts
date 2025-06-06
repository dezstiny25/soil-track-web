// plots.route.ts

import express, { Request, Response } from "express";
import supabase from "../lib/supabase";

const router = express.Router();

router.get("/get-plots", async (req, res) => {
  const user_id = req.query.user_id as string;

  if (!user_id) {
     res.status(400).json({ error: "Missing user_id" });
  }

  const { data, error } = await supabase
    .from("user_plots")
    .select(`
      plot_id,
      plot_name,
      user_crops (
        crop_name,
        category,
        moisture_min,
        moisture_max,
        nitrogen_max
      )
    `)
    .eq("user_id", user_id);

  if (error) {
     res.status(500).json({ error: error.message });
  }

  console.log("plots working", data);
  res.json({ plots: data });
});

router.get("/get-plot", async (req, res) => {
  const plot_id = req.query.plot_id as string;

  if (!plot_id) {
     res.status(400).json({ error: "Missing plot_id" });
  }

  const { data, error } = await supabase
    .from("user_plots")
    .select(`
      plot_id,
      plot_name,
      soil_type,
      isValveOpen,
      polygons,
      user_crops (
        crop_name,
        category,
        moisture_min,
        moisture_max,
        nitrogen_max,
        nitrogen_min,
        phosphorus_max,
        phosphorus_min,
        potassium_max,
        potassium_min
      )
    `)
    .eq("plot_id", plot_id)
    .single();

  if (error) {
     res.status(500).json({ error: error.message });
  }

  res.json({ plot: data });
});

router.get("/analytics", async (req, res) => {
  const plot_id = req.query.plot_id as string;

  if (!plot_id) {
     res.status(400).json({ message: "Missing plot_id in query" });
  }

  try {
    const { data: plot, error: plotError } = await supabase
      .from("user_plots")
      .select(`
        plot_id,
        plot_name,
        soil_type,
        isValveOn,
        polygons,
        user_crops (
          crop_name,
          category,
          moisture_min,
          moisture_max
        )
      `)
      .eq("plot_id", plot_id)
      .single();

    if (plotError) throw plotError;

    const { data: moisture_readings, error: moistureError } = await supabase
      .from("moisture_readings")
      .select("*")
      .eq("plot_id", plot_id)
      .order("read_time", { ascending: false });

    if (moistureError) throw moistureError;

    const { data: nutrient_readings, error: nutrientError } = await supabase
      .from("nutrient_readings")
      .select("*")
      .eq("plot_id", plot_id)
      .order("read_time", { ascending: false });

    if (nutrientError) throw nutrientError;

    const { data: irrigation_logs, error: irrigationError } = await supabase
      .from("irrigation_log")
      .select("*")
      .eq("plot_id", plot_id)
      .order("time_started", { ascending: false });

    if (irrigationError) throw irrigationError;

    res.json({
      plot,
      moisture_readings,
      nutrient_readings,
      irrigation_logs,
    });
  } catch (error) {
    console.error("Analytics route failed:", error);
    res.status(500).json({ message: "Failed to fetch plot analytics", error });
  }
});

router.get("/ai-summary", async (req, res) => {
  const user_id = req.query.user_id as string;

  if (!user_id) {
    res.status(400).json({ error: "Missing user_id" });
  }

  try {
    const { data, error } = await supabase
      .from("ai_summary")
      .select("*")
      .eq("user_id", user_id)
      .order("analysis_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      console.error("Supabase error or no data:", error);
      res.status(404).json({ error: "AI summary not found" });
    }

    const analysis = data.summary_analysis;
    const parsed = typeof analysis === "string" ? JSON.parse(analysis) : analysis;
    const summary = parsed?.summary || parsed?.AI_Analysis?.summary;
    const headline = parsed?.headline || parsed?.AI_Analysis?.headline;

    if (!summary) {
      res.status(500).json({ error: "Invalid summary structure" });
    }

    res.json({
      headline: headline || "No headline",
      summary,
      analysis_date: data.analysis_date, // 👈 Include date here
    });
  } catch (error) {
    console.error("Failed to fetch or parse AI summary:", error);
    res.status(500).json({ error: "Failed to fetch AI summary" });
  }
});

// Revised ai-history route with language_type included
router.get("/ai-history", async (req, res) => {
  const plot_id = req.query.plot_id as string;

  if (!plot_id) {
     res.status(400).json({ error: "Missing plot_id" });
  }

  try {
    // Select language_type assuming it's a column in ai_analysis table
    const { data, error } = await supabase
      .from("ai_analysis")
      .select("analysis_date, analysis, analysis_type, language_type")
      .eq("plot_id", plot_id)
      .order("analysis_date", { ascending: false });

    if (error) throw error;

    const parsedHistory = data.map((entry) => {
    const parsed = typeof entry.analysis === "string" ? JSON.parse(entry.analysis) : entry.analysis;
    const languageTypeFromJson = parsed?.AI_Analysis?.language_type;
    const languageType = entry.language_type || languageTypeFromJson || "unknown";

  return {
    language_type: languageType,
    analysis_type: entry.analysis_type || "unknown",
    analysis: {
      analysis_date: entry.analysis_date,
      headline: parsed?.AI_Analysis?.headline || "No headline",
      short_summary: parsed?.AI_Analysis?.short_summary || "No summary",
      AI_Analysis: {
        date: entry.analysis_date,
        status: parsed?.AI_Analysis?.status || "unknown",
        summary: {
          findings: parsed?.AI_Analysis?.summary?.findings || "No findings",
          predictions: parsed?.AI_Analysis?.summary?.predictions || "No predictions",
          recommendations: parsed?.AI_Analysis?.summary?.recommendations || "No recommendations",
        },
        warnings: {
          drought_risks: parsed?.AI_Analysis?.warnings?.drought_risks || "No drought risks",
          nutrient_imbalances: parsed?.AI_Analysis?.warnings?.nutrient_imbalances || "No nutrient imbalance",
        },
      },
    },
  };
});


    res.json({ history: parsedHistory });
  } catch (error) {
    console.error("Failed to fetch AI history", error);
    res.status(500).json({ error: "Failed to fetch AI history" });
  }
});

router.get("/sensor-count", async (req, res) => {
  const plot_id = req.query.plot_id as string;
  if (!plot_id) {
     res.status(400).json({ error: "Missing plot_id" });
  }

  try {
    const { data, error } = await supabase
      .from("user_plot_sensors")
      .select(`
        sensor_id,
        soil_sensors (sensor_category)
      `)
      .eq("plot_id", plot_id);

    if (error) throw error;

    const sensorCounts = data.reduce((acc: Record<string, number>, item: any) => {
      const category = item.soil_sensors?.sensor_category ?? "Unknown";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    res.json({ sensorCounts });
  } catch (err) {
    console.error("Failed to get sensor count", err);
    res.status(500).json({ error: "Failed to fetch sensor count" });
  }
});

// New Route to fetch irrigation history across all plots for a user
router.get("/irrigation-history", async (req, res) => {
  const user_id = req.query.user_id as string;
  if (!user_id) {
     res.status(400).json({ error: "Missing user_id" });
  }

  try {
    const { data, error } = await supabase
      .from("irrigation_log")
      .select(`
        time_started,
        time_stopped,
        mac_address,
        plot_id,
        user_plots (
          plot_name
        )
      `)
      .order("time_started", { ascending: false });

    if (error) throw error;

    const filtered = data.filter((entry: any) => entry.user_plots); // Ensure plot joined

    const formatted = filtered.map((entry: any) => ({
      plot_id: entry.plot_id,
      plot_name: entry.user_plots.plot_name,
      time_started: entry.time_started,
      time_stopped: entry.time_stopped,
      mac_address: entry.mac_address,
    }));

    res.json({ logs: formatted });
  } catch (err) {
    console.error("Failed to fetch irrigation history", err);
    res.status(500).json({ error: "Failed to fetch irrigation history" });
  }
});

router.get("/get-user-sensors", async (req, res) => {
  const user_id = req.query.user_id as string;

  if (!user_id) {
    res.status(400).json({ error: "Missing user_id" });
  }

  try {
    // Step 1: Get plot IDs for the user
    const { data: userPlots, error: userPlotsError } = await supabase
      .from("user_plots")
      .select("plot_id")
      .eq("user_id", user_id);

    if (userPlotsError) throw userPlotsError;

    const plotIds = userPlots.map((p) => p.plot_id);

    if (plotIds.length === 0) {
      res.json({ sensors: [] }); // No plots, no sensors
    }

    // Step 2: Get sensor IDs for these plots
    const { data: userSensors, error: sensorError } = await supabase
      .from("user_plot_sensors")
      .select(`
        sensor_id,
        plot_id,
        soil_sensors (
          sensor_name,
          sensor_category
        )
      `)
      .in("plot_id", plotIds);

    if (sensorError) throw sensorError;

    // Step 3: Format sensor info
    const sensors = userSensors.map((item: any) => ({
      sensor_id: item.sensor_id,
      plot_id: item.plot_id,
      sensor_name: item.soil_sensors?.sensor_name ?? "Unknown",
      sensor_category: item.soil_sensors?.sensor_category ?? "Unknown",
    }));

    res.json({ sensors });
  } catch (err) {
    console.error("Failed to get user sensors", err);
    res.status(500).json({ error: "Failed to fetch sensors" });
  }
});

// plots.route.ts
// In plots.route.ts
// plots.route.ts

router.get("/sensor-details", async (req, res) => {
  const plot_id = req.query.plot_id as string;
  if (!plot_id) {
    res.status(400).json({ error: "Missing plot_id" });
  }

  try {
    const { data, error } = await supabase
      .from("user_plot_sensors")
      .select(`
        sensor_id,
        soil_sensors (
          sensor_name,
          sensor_category
        )
      `)
      .eq("plot_id", plot_id);

    if (error) throw error;

    const sensorDetails = data.map((item: any) => ({
      sensor_id: item.sensor_id,
      sensor_name: item.soil_sensors?.sensor_name ?? "Unknown",
      sensor_category: item.soil_sensors?.sensor_category ?? "Unknown",
    }));

    res.json({ sensorDetails });
  } catch (err) {
    console.error("Failed to get sensor details", err);
    res.status(500).json({ error: "Failed to fetch sensor details" });
  }
});



export default router;
