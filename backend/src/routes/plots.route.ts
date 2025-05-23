import express , { Request, Response } from "express";
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
res.json({ plots: data });
console.log("plots working", data);

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
    // 👇 Replace this with your actual Supabase query
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
  const plot_id = req.query.plot_id as string;

  if (!plot_id) {
    res.status(400).json({ error: "Missing plot_id" });
  }

  try {
    const { data, error } = await supabase
      .from("ai_analysis")
      .select("analysis")
      .eq("plot_id", plot_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) throw error;

    const analysis = data.analysis;
    // Check if it's a string, parse if needed
    const parsed =
      typeof analysis === "string" ? JSON.parse(analysis) : analysis;

    const summary = parsed.AI_Analysis;

    res.json({
      headline: summary.headline,
      short_summary: summary.short_summary,
    });
  } catch (error) {
    console.error("Failed to fetch or parse AI analysis:", error);
    res.status(500).json({ error: "Failed to fetch AI summary" });
  }
});




export default router;
