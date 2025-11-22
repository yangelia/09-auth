import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { checkSessionServer } from "@/lib/api/serverApi";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isAuth = await checkSessionServer();

  if (isAuth) {
    redirect("/profile");
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {children}
    </div>
  );
}
