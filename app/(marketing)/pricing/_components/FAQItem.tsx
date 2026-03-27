"use client"

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-white/5 py-6">
            <Button onClick={() => setIsOpen(!isOpen)} variant={"link"} className="flex w-full items-center justify-between text-left">
                <span className="text-lg font-medium text-white">{question}</span>
                {isOpen ? <HugeiconsIcon icon={Minus} className="h-5 w-5 text-zinc-400" /> : <HugeiconsIcon icon={Plus} className="h-5 w-5 text-zinc-400" />}
            </Button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pt-4 text-zinc-400">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
