"use client";

import { useEffect, useState } from "react";
import { checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const { setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    async function initAuth() {
      try {
        const user = await checkSession();
        if (user?.email) setUser(user);
        else clearIsAuthenticated();
      } catch {
        clearIsAuthenticated();
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, [setUser, clearIsAuthenticated]);

  if (loading) return <p>Loading...</p>;
  return <>{children}</>;
}
