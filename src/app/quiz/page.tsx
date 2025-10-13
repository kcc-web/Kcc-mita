// src/app/quiz/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import QuizClient from "./QuizClient"; // ← 下で作る/直す

export default async function Page() {
  const store = await cookies();
  const seen = store.get("kcc_quiz_intro")?.value === "1";
  if (!seen) redirect("/quiz/intro?next=/quiz");

  return <QuizClient />;  // ここから下は“元のUI”を動かすクライアント
}

