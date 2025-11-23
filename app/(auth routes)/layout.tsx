"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkSession } from "@/lib/api/clientApi";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const isAuth = await checkSession();

        if (isAuth) {
          router.replace("/profile");
        } else {
          router.refresh();
        }
      } catch {
        router.refresh();
      }
    };

    void verifyAuth();
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {children}
    </div>
  );
}
