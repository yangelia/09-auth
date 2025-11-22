import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { checkSessionServer } from "@/lib/api/serverApi";

export default async function PrivateLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isAuth = await checkSessionServer();

  if (!isAuth) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
