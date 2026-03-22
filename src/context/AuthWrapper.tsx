"use client";

import { AuthProvider } from "@/context/AuthContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { ReactNode } from "react";

export function AuthWrapper({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <SiteSettingsProvider>
                {children}
            </SiteSettingsProvider>
        </AuthProvider>
    );
}
