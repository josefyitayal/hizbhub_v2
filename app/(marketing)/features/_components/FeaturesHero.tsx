"use client"

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function FeaturesHero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-24 bg-background">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] opacity-[0.05] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="relative mx-auto max-w-7xl px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                >
                    <Badge className="mb-8">The Complete Toolkit</Badge>
                    <h1 className="mb-6 max-w-4xl text-5xl font-medium tracking-tight text-white sm:text-7xl">
                        Everything you need. <br />
                        <span className="text-muted-foreground">None of the clutter.</span>
                    </h1>
                    <p className="mb-10 max-w-2xl text-lg text-muted-foreground">
                        Replace your fragmented tech stack with one unified platform. HizbHub combines communities, structured courses, and native Ethiopian monetization into a single, high-performance command center.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button className="h-12 text-sm font-medium">
                            Start building for free
                        </Button>
                        <Button variant={"outline"} className="h-12 text-sm font-medium">
                            View Pricing
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
