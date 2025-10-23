// src/app/api/admin/save/route.ts
import { NextResponse } from "next/server";
import { createClient as createServerOnlyClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SRV = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!URL || !SRV) {
  throw new Error("Missing SUPABASE envs: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

function serverClient() {
  return createServerOnlyClient(URL, SRV);
}

export async function POST(req: Request) {
  try {
    const supabase = serverClient();
    const { venue, settings } = await req.json();

    // --- venue 確保（無ければ作成）
    let { data: v, error: vselErr } = await supabase.from("venue").select("*").limit(1).single();
    // PostgREST: データなしは PGRST116（No rows found）
    if (vselErr && vselErr.code !== "PGRST116") throw vselErr;

    if (!v) {
      const { data: inserted, error: vInsErr } = await supabase
        .from("venue")
        .insert({
          status: "moderate",
          wait_from: 5,
          wait_to: 10,
          short_location: "KCC三田",
          hours: "10:00-18:00"
        })
        .select()
        .single();
      if (vInsErr) throw vInsErr;
      v = inserted!;
    }

    // venue 更新
    const { id: venueId, updated_at: _vu, ...venuePayload } = venue ?? {};
    const targetVenueId = venueId ?? v.id;
    if (venuePayload.wait_from != null) venuePayload.wait_from = Number(venuePayload.wait_from);
    if (venuePayload.wait_to != null) venuePayload.wait_to = Number(venuePayload.wait_to);

    const { data: vd, error: e1 } = await supabase
      .from("venue")
      .update(venuePayload)
      .eq("id", targetVenueId)
      .select()
      .single();
    if (e1) throw e1;

    // --- settings 確保（無ければ作成）
    let { data: s, error: sselErr } = await supabase.from("settings").select("*").eq("id", 1).single();
    if (sselErr && sselErr.code !== "PGRST116") throw sselErr;

    if (!s) {
      const { data: insertedS, error: sInsErr } = await supabase
        .from("settings")
        .insert({ id: 1 })
        .select()
        .single();
      if (sInsErr) throw sInsErr;
      s = insertedS!;
    }

    // settings 更新
    const { id: _sid, updated_at: _su, ...settingsPayload } = settings ?? {};
    const { data: sd, error: e2 } = await supabase
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


