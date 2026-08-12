import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mgvotfobzdtpyrowhxeq.supabase.co";
const supabaseAnonKey = "sb_publishable_KzAvae77wuG-8D2gRyfpwg_YfXOCVSD";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
