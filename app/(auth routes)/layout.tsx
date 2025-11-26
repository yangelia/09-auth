"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {children}
    </div>
  );
}
