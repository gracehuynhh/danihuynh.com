"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    adminLoading: boolean;
    signUp: (email: string, password: string) => Promise<{ error: string | null }>;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAdmin: false,
    adminLoading: true,
    signUp: async () => ({ error: null }),
    signIn: async () => ({ error: null }),
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminLoading, setAdminLoading] = useState(true);

    // Fetch admin status whenever user changes
    const fetchAdminStatus = async (userId: string | null) => {
        if (!userId) {
            setIsAdmin(false);
            setAdminLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("is_admin")
                .eq("id", userId)
                .single();
            if (error) console.error("[AuthContext] admin check error:", error.message);
            setIsAdmin(data?.is_admin ?? false);
        } catch {
            setIsAdmin(false);
        }
        setAdminLoading(false);
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            const u = session?.user ?? null;
            setUser(u);
            setLoading(false);
            fetchAdminStatus(u?.id ?? null);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                const u = session?.user ?? null;
                setUser(u);
                setLoading(false);
                setAdminLoading(true);
                fetchAdminStatus(u?.id ?? null);
            }
        );

        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const signUp = async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({ email, password });
        return { error: error?.message ?? null };
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, adminLoading, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
