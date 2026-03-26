"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FlipWordsProps {
    words: string[];
    duration?: number;
    className?: string;
}

export default function FlipWords({
    words,
    duration = 3000,
    className = "",
}: FlipWordsProps) {
    const [index, setIndex] = useState(0);

    const next = useCallback(() => {
        setIndex((prev) => (prev + 1) % words.length);
    }, [words.length]);

    useEffect(() => {
        const id = setInterval(next, duration);
        return () => clearInterval(id);
    }, [next, duration]);

    return (
        <span className={`inline-block relative ${className}`}>
            <AnimatePresence mode="wait">
                <motion.span
                    key={words[index]}
                    initial={{ opacity: 0, y: 20, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -20, rotateX: 90 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="inline-block"
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}
