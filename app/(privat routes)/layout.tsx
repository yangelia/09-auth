import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { checkSessionServer } from "@/lib/api/serverApi";

// Этот layout оборачивает ВСЕ приватные маршруты: /notes, /profile, и т.п.
export default async function PrivateLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await checkSessionServer();

  if (!user) {
    // Не авторизован — на логин
    redirect("/sign-in");
  }

  // Авторизован — пускаем дальше
  return <>{children}</>;
}
