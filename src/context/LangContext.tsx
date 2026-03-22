"use client";

import { createContext, useContext, ReactNode } from "react";

type Lang = "en" | "vi";

interface LangContextType {
    lang: Lang;
    t: (en: string, vi: string) => string;
}

const LangContext = createContext<LangContextType>({
    lang: "vi",
    t: (_en, vi) => vi,
});

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
    const t = (en: string, vi: string) => (lang === "en" ? en : vi);
    return (
        <LangContext.Provider value={{ lang, t }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    return useContext(LangContext);
}
