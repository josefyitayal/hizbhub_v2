import '../lib/orpc.server'

import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import { Toaster } from '@/components/ui/sonner';
import { Providers } from '@/lib/providers';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});


export const metadata: Metadata = {
    metadataBase: new URL("https://hizbhub-v2.vercel.app/"),
    title: {
        default: "Hizbhub - Build & Monetize Communities in Ethiopia",
        template: "%s | Hizbhub",
    },
    description:
        "Create, manage, and monetize your online community with Hizbhub. Built for creators, educators, and businesses in Ethiopia.",
    openGraph: {
        siteName: "Hizbhub",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider appearance={{ baseTheme: shadcn }}>
            <html lang="en" className={outfit.variable} suppressHydrationWarning>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Providers>
                            {children}
                            <Toaster />
                        </Providers>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
