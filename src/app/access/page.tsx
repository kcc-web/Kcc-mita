// src/app/access/page.tsx
import AccessClient from "./Accessclient"

export const metadata = {
  title: "Access | KCC Mita 2025",
  description: "慶應珈琲倶楽部の三田祭出店へのアクセス情報。第一校舎133教室への行き方をご案内します。",
};

export default function AccessPage() {
  return <AccessClient />;
}