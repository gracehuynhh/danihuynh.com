"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
    const isFirstRender = useRef(true);

    const next = useCallback(() => {
        setIndex((prev) => (prev + 1) % words.length);
    }, [words.length]);

    useEffect(() => {
        // Mark first render complete after first tick
        isFirstRender.current = false;
        const id = setInterval(next, duration);
        return () => clearInterval(id);
    }, [next, duration]);

    return (
        <span className={`inline-block relative ${className}`} style={{ minHeight: "1.2em" }}>
            <AnimatePresence mode="wait">
                <motion.span
                    key={words[index]}
                    // First word renders instantly (no animation), subsequent words animate
                    initial={isFirstRender.current ? false : { opacity: 0, y: 10, rotateX: -45 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -10, rotateX: 45 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="inline-block"
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}
