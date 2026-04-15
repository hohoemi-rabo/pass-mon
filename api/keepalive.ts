import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.query.token as string | undefined;
  if (!token || token !== process.env.KEEPALIVE_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ error: "Missing Supabase config" });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { error } = await supabase.from("credentials").select("id").limit(1);

  if (error) {
    return res.status(500).json({ error: "Supabase ping failed", detail: error.message });
  }

  return res.status(200).json({
    ok: true,
    timestamp: new Date().toISOString(),
  });
}
