// src/app/api/admin/save/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// 環境変数（Vercelとローカル両方に登録済みが前提）
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SRV = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function serverClient() {
  // Cookieは不要なのでダミーでOK
  return createServerClient(URL, SRV, {
    cookies: { get() { return undefined; } },
  });
}

export async function POST(req: Request) {
  try {
    const supabase = serverClient();
    const { venue } = await req.json();

    // venue レコードが存在しなければ作成
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

    // payload 整理
    const { id: venueId, updated_at: _u, ...payload } = venue ?? {};
    if (payload.wait_from != null) payload.wait_from = Number(payload.wait_from);
    if (payload.wait_to != null) payload.wait_to = Number(payload.wait_to);

    // venue更新
    const { error: e1, data: updated } = await supabase
      .from("venue")
      .update(payload)
      .eq("id", venueId ?? v.id)
      .select()
      .single();

    if (e1) throw e1;

    return NextResponse.json({ ok: true, venue: updated });
  } catch (err: any) {
    console.error("admin/save error", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? String(err) },
      { status: 400 }
    );
  }
}



