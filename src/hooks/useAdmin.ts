"use client";

import { useAuth } from "@/context/AuthContext";

// Now just reads from AuthContext — no separate DB query per component
export function useAdmin() {
    const { isAdmin, adminLoading } = useAuth();
    return { isAdmin, loading: adminLoading };
}
