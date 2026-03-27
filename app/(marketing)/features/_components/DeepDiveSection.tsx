"use client"

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion, AnimatePresence } from 'framer-motion';

export function DeepDiveSection({
    badge,
    title,
    description,
    features,
    imageContent,
    reverse = false
}: {
    badge: string;
    title: string;
    description: string;
    features: { icon: any, title: string, desc: string }[];
    imageContent: React.ReactNode;
    reverse?: boolean;
}) {
    return (
        <section className="py-24 border-t border-border bg-background">
            <div className="mx-auto max-w-7xl px-6">
                <div className={cn("grid gap-16 lg:grid-cols-2 lg:gap-24 items-center", reverse && "lg:grid-flow-col-dense")}>
                    <motion.div
                        initial={{ opacity: 0, x: reverse ? 20 : -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className={cn(reverse && "lg:col-start-2")}
                    >
                        <Badge className="mb-6">{badge}</Badge>
                        <h2 className="mb-6 text-3xl font-medium tracking-tight text-white sm:text-4xl">{title}</h2>
                        <p className="mb-12 text-lg text-muted-foreground">{description}</p>

                        <div className="space-y-8">
                            {features.map((feature, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-zinc-900/50 text-muted-foreground">
                                        <HugeiconsIcon icon={feature.icon} className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="mb-1 font-medium text-white">{feature.title}</h4>
                                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className={cn("relative aspect-square lg:aspect-auto lg:h-[600px] rounded-2xl border border-border bg-zinc-950 overflow-hidden flex items-center justify-center p-8", reverse && "lg:col-start-1")}
                    >
                        {/* Abstract UI Representation */}
                        {imageContent}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
