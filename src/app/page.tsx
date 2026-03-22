"use client";

import { LangProvider } from "@/context/LangContext";
import HomePage from "@/components/HomePage";

export default function Home() {
  return (
    <LangProvider lang="vi">
      <HomePage />
    </LangProvider>
  );
}
