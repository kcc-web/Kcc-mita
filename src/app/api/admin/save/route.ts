// src/app/api/admin/save/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// 必須：Vercel/ローカルの両方で env を設定しておく
const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SRV  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function serverClient() {
  // Cookieは使わないのでダミー実装でOK
  return createServerClient(URL, SRV, {
    cookies: { get() { return undefined; } },
  });
}

export async function POST(req: Request) {
  try {
    const supabase = serverClient();
    const { venue, settings } = await req.json();

    // --- venue 確保（無ければ作る）
    let { data: v } = await supabase.from("venue").select("*").limit(1).single();
    if (!v) {
      const { data: inserted } = await supabase
        .from("venue")
        .insert({
          status: "moderate",
          wait_from: 5,
          wait_to: 10,
          short_location: "KCC三田",
          hours: "10:00-18:00",
        })
        .select()
        .single();
      v = inserted!;
    }

    // payload から id/updated_at を落とす
    const { id: venueId, updated_at: _vu, ...venuePayload } = venue ?? {};
    // venueId が undefined の場合は既存の v.id を採用
    const targetVenueId = venueId ?? v.id;

    // 数値にそろえる
    if (venuePayload.wait_from != null) venuePayload.wait_from = Number(venuePayload.wait_from);
    if (venuePayload.wait_to   != null) venuePayload.wait_to   = Number(venuePayload.wait_to);

    // venue 更新
    const { error: e1, data: vd } = await supabase
      .from("venue")
      .update(venuePayload)
      .eq("id", targetVenueId)
      .select()
      .single();

    if (e1) throw e1;

    // --- settings 確保（無ければ作る）
    let { data: s } = await supabase.from("settings").select("*").eq("id", 1).single();
    if (!s) {
      const { data: insertedS } = await supabase
        .from("settings")
        .insert({ id: 1 })
        .select()
        .single();
      s = insertedS!;
    }

    const { id: _sid, updated_at: _su, ...settingsPayload } = settings ?? {};

    // settings 更新
    const { error: e2, data: sd } = await supabase
      .from("settings")
      .update(settingsPayload)
      .eq("id", 1)
      .select()
      .single();

    if (e2) throw e2;

    return NextResponse.json({ ok: true, venue: vd, settings: sd });
  } catch (err: any) {
    console.error("admin/save error", err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 400 });
  }
}
