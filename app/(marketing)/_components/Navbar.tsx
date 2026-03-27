"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignOutButton, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";

const links = ["Features", "Use Cases", "Discover", "Blog", "Pricing"]

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-border",
                isScrolled
                    ? "py-3 bg-black/70 backdrop-blur-xl border-b border-border"
                    : "py-5 bg-transparent"
            )}
        >
            {/* Sudden gradient wash (only when scrolled) */}
            {isScrolled && (
                <div className="absolute inset-0 -z-10  bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
            )}

            {/* Subtle grid (appears only when scrolled) */}
            {isScrolled && (
                <div
                    className="absolute inset-0 -z-10 opacity-[0.04]"
                    style={{
                        backgroundImage: `linear-gradient(to right, white 1px, transparent 1px),
                              linear-gradient(to bottom, white 1px, transparent 1px)`,
                        backgroundSize: "48px 48px",
                        maskImage:
                            "linear-gradient(to bottom, black 40%, transparent 100%)",
                        WebkitMaskImage:
                            "linear-gradient(to bottom, black 40%, transparent 100%)",
                    }}
                />
            )}

            <div className="container relative flex items-center justify-between px-6 mx-auto">
                {/* ================= Logo ================= */}
                <Link href="/" className="group flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-9 h-9 rounded-lg  backdrop-blur-sm transition-all duration-300 group-hover:border-border">
                        {/* studio light */}
                        <div className="absolute -inset-4 bg-white/[0.06] blur-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <Image src={"/Logo 2.svg"} alt="hizbhub logo" width={54} height={54} className="object-cover size-full" />
                    </div>

                    <span className="text-2xl font-semibold tracking-tight text-white">
                        Hizb<span className="text-muted-foreground">hub</span>
                    </span>
                </Link>

                {/* ================= Desktop Nav ================= */}
                <nav className="hidden md:flex items-center gap-10 ">
                    {links.map((item) => {
                        const href = `/${item.toLowerCase().replace(" ", "-")}`;
                        const isActive = pathname === href;

                        return (
                            <Link
                                key={item}
                                href={href}
                                className={cn(
                                    "relative text-sm font-medium transition-colors group",
                                    isActive
                                        ? "text-white"
                                        : "text-zinc-400 hover:text-white"
                                )}
                            >
                                {item}

                                {/* underline → light sweep */}
                                <span
                                    className={cn(
                                        "absolute -bottom-2 left-0 h-px bg-gradient-to-r from-transparent via-white to-transparent transition-all duration-300",
                                        isActive ? "w-full" : "w-0 group-hover:w-full"
                                    )}
                                />

                            </Link>
                        );
                    })}
                </nav>

                {/* ================= Actions ================= */}
                <div className="flex items-center gap-3">
                    <SignedOut>
                        <Button
                            variant="ghost"
                            asChild
                            className="text-zinc-400 hover:text-white hover:bg-white/5"
                        >
                            <Link href="/sign-in">Login</Link>
                        </Button>

                        <Button
                            asChild
                            className="hidden sm:flex h-10 px-5 bg-white text-black font-semibold hover:bg-zinc-200 transition-all active:scale-95"
                        >
                            <Link href="/sign-up">Get Started</Link>
                        </Button>
                    </SignedOut>

                    <SignedIn>
                        <UserButton />
                        <SignOutButton>
                            <Button variant="secondary">Logout</Button>
                        </SignOutButton>
                    </SignedIn>
                </div>
            </div>
        </header>
    );
};
