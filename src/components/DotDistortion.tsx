"use client";

import { useEffect, useRef, useCallback } from "react";

interface DotDistortionProps {
    className?: string;
    dotColor?: string;
    dotSize?: number;
    gap?: number;
    mouseRadius?: number;
    distortionStrength?: number;
}

export default function DotDistortion({
    className = "",
    dotColor = "rgba(37, 99, 235, 0.12)",
    dotSize = 1.5,
    gap = 28,
    mouseRadius = 120,
    distortionStrength = 18,
}: DotDistortionProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const animRef = useRef<number>(0);
    const isActiveRef = useRef(false); // Only animate when mouse is near

    // Parse the alpha from the dotColor once, not every frame
    const baseAlpha = parseFloat(dotColor.match(/[\d.]+\)$/)?.[0] || "0.12");

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;

        if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.scale(dpr, dpr);
        }

        ctx.clearRect(0, 0, w, h);

        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const r2 = mouseRadius * mouseRadius;

        // Pre-compute the color without alpha for reuse
        const colorBase = dotColor.replace(/[\d.]+\)$/, "");

        for (let x = gap / 2; x < w; x += gap) {
            for (let y = gap / 2; y < h; y += gap) {
                const dx = x - mx;
                const dy = y - my;
                const dist2 = dx * dx + dy * dy;

                let drawX = x;
                let drawY = y;
                let size = dotSize;
                let alpha = baseAlpha;

                if (dist2 < r2) {
                    const dist = Math.sqrt(dist2);
                    const force = (1 - dist / mouseRadius);
                    const eased = force * force;
                    const angle = Math.atan2(dy, dx);
                    drawX += Math.cos(angle) * eased * distortionStrength;
                    drawY += Math.sin(angle) * eased * distortionStrength;
                    size = dotSize + eased * 1.5;
                    alpha = (0.4 + eased * 0.6) * baseAlpha;
                }

                ctx.beginPath();
                ctx.arc(drawX, drawY, size, 0, Math.PI * 2);
                ctx.fillStyle = `${colorBase}${alpha})`;
                ctx.fill();
            }
        }

        // Only keep animating if mouse is active
        if (isActiveRef.current) {
            animRef.current = requestAnimationFrame(draw);
        }
    }, [dotColor, dotSize, gap, mouseRadius, distortionStrength, baseAlpha]);

    // Draw once on mount to show static dots, then stop
    const drawStatic = useCallback(() => {
        mouseRef.current = { x: -1000, y: -1000 };
        draw();
    }, [draw]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Initial static draw
        drawStatic();

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
            if (!isActiveRef.current) {
                isActiveRef.current = true;
                animRef.current = requestAnimationFrame(draw);
            }
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
            isActiveRef.current = false;
            // One last draw to reset dots to static positions
            draw();
        };

        canvas.addEventListener("mousemove", handleMouseMove, { passive: true });
        canvas.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animRef.current);
        };
    }, [draw, drawStatic]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
            style={{ zIndex: 0 }}
        />
    );
}
