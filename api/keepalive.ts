import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

/**
 * Supabase 無料プランは一定期間（約7日）DB アクティビティがないと自動停止される。
 * Vercel Cron から 1 日 1 回このエンドポイントを呼び出し、実テーブルへ軽量な
 * カウントクエリを投げることでアクティビティを発生させ、スリープを防ぐ。
 *
 * - 認証: Vercel Cron は CRON_SECRET が設定されていれば Authorization: Bearer を自動付与する
 * - クエリ: profiles（ユーザーマスター）へ head:true / count:'exact'。RLS により anon では
 *   件数は 0 が返るが、クエリ自体は Postgres に到達するため keepalive として十分。
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // キャッシュさせない（Cron からの実行が確実に Supabase へ届くように）
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // Vercel Cron が自動付与する Authorization: Bearer ${CRON_SECRET} を検証
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[keepalive] Missing Supabase config");
    return res.status(500).json({ ok: false, error: "Missing Supabase config" });
  }

  // lib/supabase.ts は React Native（SecureStore）依存のため Node 環境では使えない。
  // ここでは anon key で読み取り専用クライアントを直接生成する。
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { error, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("[keepalive] Supabase ping failed:", error.message);
    return res.status(500).json({ ok: false, error: error.message });
  }

  return res.status(200).json({
    ok: true,
    count: count ?? 0,
    timestamp: new Date().toISOString(),
  });
}
