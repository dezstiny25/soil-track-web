import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL as string;
const supabaseKey = process.env.REACT_APP_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
