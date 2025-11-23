"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkSession } from "@/lib/api/clientApi";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    async function protect() {
      const isAuth = await checkSession();
      if (isAuth) {
        router.replace("/profile");
      } else {
        router.refresh();
      }
    }

    protect();
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {children}
    </div>
  );
}
