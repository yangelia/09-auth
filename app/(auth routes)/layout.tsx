import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { checkSessionServer } from "@/lib/api/serverApi";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await checkSessionServer();

  if (user) {
    // Уже залогинен — не даём ходить по /sign-in и /sign-up
    redirect("/profile");
  }

  // Публичный доступ
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {children}
    </div>
  );
}
