// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 管理画面用の簡易Basic認証
// 本番環境では環境変数で設定
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'kcc2025secure';

export function middleware(request: NextRequest) {
  // 管理画面パスのみ認証チェック
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const basicAuth = request.headers.get('authorization');

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      if (user === ADMIN_USERNAME && pwd === ADMIN_PASSWORD) {
        return NextResponse.next();
      }
    }

    // 認証失敗時は401を返す
    return new NextResponse('認証が必要です', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  return NextResponse.next();
}

// 管理画面パスにのみ適用
export const config = {
  matcher: '/admin/:path*',
};