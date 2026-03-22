"use client";

import { LangProvider } from "@/context/LangContext";
import HomePage from "@/components/HomePage";

export default function EnglishHome() {
    return (
        <LangProvider lang="en">
            <HomePage />
        </LangProvider>
    );
}
