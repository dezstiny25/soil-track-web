import { Request, Response } from "express";
import supabase from "../lib/supabase";

export const getUserPlot = async (req: Request, res: Response) => {
  const { user_id } = req.body;

  if (!user_id) {
    res.status(400).json({ error: "Missing user_id" });
  }

  const { data, error } = await supabase
    .from("user_crops")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
   res.status(500).json({ error: error.message });
  }

  res.status(200).json({ plots: data });
};
