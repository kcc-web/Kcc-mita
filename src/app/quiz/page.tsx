// src/app/quiz/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import QuizClient from "./QuizClient";

export default async function QuizPage() {
  const cookieStore = await cookies();
  const seen = cookieStore.get("kcc_quiz_intro")?.value === "1";

  // クッキーが立ってない → Heroへ飛ばす
  if (!seen) redirect("/quiz/intro?next=/quiz");

  return <QuizClient />;
}


