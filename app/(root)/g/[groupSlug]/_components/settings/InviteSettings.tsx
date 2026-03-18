"use client"

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { CheckmarkBadgeIcon, CopyIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

export function InviteSettings({ groupSlug }: { groupSlug: string }) {
    const value = `https://hizbhub.com/g/${groupSlug}`
    const [isCopied, setIsCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
        } catch (err) {
            console.error("Failed to copy!", err)
        }
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="w-full border-b border-border">
                <p className="text-lg text-start pl-3">Inviate</p>
            </div>
            <div className="w-full px-10 flex flex-col gap-4">
                <div>
                    <p className="text-muted-foreground">Inviate People with this link</p>
                </div>
                <InputGroup>
                    <InputGroupInput
                        value={value}
                        readOnly
                        className="font-mono text-sm"
                    />
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton
                            variant="ghost"
                            size="icon-xs"
                            onClick={handleCopy}
                            aria-label="Copy code"
                        >
                            {isCopied ? (
                                <HugeiconsIcon icon={CheckmarkBadgeIcon} className="h-4 w-4 text-green-500" />
                            ) : (
                                <HugeiconsIcon icon={CopyIcon} className="h-4 w-4" />
                            )}
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        </div>
    )
}
