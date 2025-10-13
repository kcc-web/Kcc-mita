// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const INTRO_COOKIE = "kcc_quiz_intro";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /quiz配下のうち、/quiz/intro 以外へ行く時だけチェック
  if (pathname.startsWith("/quiz") && pathname !== "/quiz/intro") {
    const seen = req.cookies.get(INTRO_COOKIE)?.value === "1";
    if (!seen) {
      const url = req.nextUrl.clone();
      url.pathname = "/quiz/intro";
      // どこへ行こうとしていたかを覚えておく（任意）
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// 必要なパスだけ対象化（任意：省略可）
export const config = {
  matcher: ["/quiz/:path*"],
};
