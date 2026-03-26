"use client";

import { useState, useEffect } from "react";
import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { DaniLogo } from "@/components/DaniLogo";
import AuthDialog from "@/components/AuthDialog";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { lang, t } = useLang();
    const { user } = useAuth();
    const { isAdmin } = useAdmin();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: t("Courses", "Khóa học"), href: "/#courses" },
        { label: t("Blog", "Blog"), href: "/blog" },
        { label: t("Contact", "Liên hệ"), href: "/#contact" },
    ];


    const LangToggle = () => (
        <div className="flex items-center rounded-lg border border-border bg-muted p-0.5 text-xs font-semibold">
            <a
                href="/en"
                className={`px-2.5 py-1 rounded-md transition-all duration-200 ${lang === "en"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
            >
                EN
            </a>
            <a
                href="/"
                className={`px-2.5 py-1 rounded-md transition-all duration-200 ${lang === "vi"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
            >
                VI
            </a>
        </div>
    );

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass" : "bg-transparent"
                }`}
        >
            <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
                {/* Logo */}
                <a href="/" className="flex items-center group">
                    <DaniLogo height={34} />
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="nav-link text-muted-foreground hover:text-foreground transition-colors text-sm"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-2.5">
                    <LangToggle />
                    {user ? (
                        <>
                            {isAdmin && (
                                <Button asChild size="sm" variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg px-3 text-xs font-semibold">
                                    <a href="/admin">Admin</a>
                                </Button>
                            )}
                            <Button asChild size="sm" className="btn-primary border-0 text-white rounded-lg px-4">
                                <a href="/dashboard">
                                    <User className="w-3.5 h-3.5 mr-1.5" />
                                    Dashboard
                                </a>
                            </Button>
                        </>
                    ) : (
                        <AuthDialog>
                            <Button size="sm" className="btn-primary border-0 text-white rounded-lg px-4 cursor-pointer">
                                {t("Sign In", "Đăng nhập")}
                            </Button>
                        </AuthDialog>
                    )}
                </div>

                {/* Mobile — Sheet */}
                <div className="flex md:hidden items-center gap-2">
                    <LangToggle />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="glass border-l border-border w-64 p-6">
                            <div className="flex flex-col gap-6">
                                <a href="/" className="flex items-center">
                                    <DaniLogo height={28} />
                                </a>
                                <Separator className="bg-border" />
                                <nav className="flex flex-col gap-4">
                                    {navLinks.map((link) => (
                                        <SheetClose asChild key={link.href}>
                                            <a
                                                href={link.href}
                                                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                                            >
                                                {link.label}
                                            </a>
                                        </SheetClose>
                                    ))}
                                </nav>
                                <Separator className="bg-border" />
                                <SheetClose asChild>
                                    {user ? (
                                        <Button asChild className="btn-primary border-0 text-white w-full">
                                            <a href="/dashboard">
                                                <User className="w-3.5 h-3.5 mr-1.5" />
                                                Dashboard
                                            </a>
                                        </Button>
                                    ) : (
                                        <AuthDialog>
                                            <Button className="btn-primary border-0 text-white w-full cursor-pointer">
                                                {t("Sign In", "Đăng nhập")}
                                            </Button>
                                        </AuthDialog>
                                    )}
                                </SheetClose>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
