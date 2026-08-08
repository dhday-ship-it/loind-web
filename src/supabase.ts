import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ximnbztcqizrxlickerq.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpbW5ienRjcWl6cnhsaWNrZXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxOTQ1MzQsImV4cCI6MjEwMTc3MDUzNH0.2U1M7SfLfCGDAUYtEXilfPdOLqW7IB0EmnZXCvZJKbM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
