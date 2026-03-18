"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { createGroupFormSchema, CreateGroupFormTypes } from "@/zod-schema/createGroupZodSchema"
import CategorySelector from "@/components/CategorySelector"
import { Button } from "@/components/ui/button"
import { useState } from "react"
// import { PricingDialog } from "./PricingDialog/PricingDialog"
import { PricingProvider } from "./PricingDialog/PricingContext"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { orpc } from "@/lib/orpc"
import dynamic from "next/dynamic"

const PricingDialog = dynamic(
    () => import("./PricingDialog/PricingDialog").then((mod) => mod.PricingDialog),
    {
        ssr: false
    }
)

export const CreateGroupForm = () => {
    const [pricingDialogOpen, setPricingDialogOpen] = useState(false)

    const form = useForm<CreateGroupFormTypes>({
        resolver: zodResolver(createGroupFormSchema),
        defaultValues: {
            name: "",
            description: "",
            category: ""
        },
    })

    async function handleValidateForm() {
        const isVaild = await form.trigger()
        if (isVaild) {
            setPricingDialogOpen(true)
        }
    }

    return (
        <div className="flex flex-col gap-8 w-3/4">
            <div>
                <h3 className="h3 text-center">Create group.</h3>
                <p className="text-muted-foreground text-center">Start your journey and grow by creating group.</p>
            </div>
            <form id="form-rhf-demo" className="space-y-4">
                <FieldGroup className="">
                    {/* NAME FIELD */}
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="">
                                <FieldLabel
                                    htmlFor="form-name"
                                    className="font-semibold"
                                >
                                    Name
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="form-name"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="e.g. Engineering Team"
                                />
                                {fieldState.invalid && (
                                    <FieldError className="" errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* DESCRIPTION FIELD */}
                    <Controller
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="">
                                <FieldLabel
                                    htmlFor="form-description"
                                    className="font-semibold"
                                >
                                    Description
                                </FieldLabel>
                                <div className="relative group">
                                    <InputGroup className="">
                                        <InputGroupTextarea
                                            {...field}
                                            id="form-description"
                                            placeholder="What is this group about?"
                                            rows={4}
                                            className="w-full resize-none p-3 text-sm min-h-[120px]"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <InputGroupAddon align="block-end" className="p-2 ">
                                            <InputGroupText className="tabular-nums text-xs text-muted-foreground font-mono uppercase tracking-tighter">
                                                {field.value.length} / 100
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                                <FieldDescription className="text-xs text-muted-foreground leading-relaxed italic">
                                    This helps people find your community in the discovery feed.
                                </FieldDescription>
                                {fieldState.invalid && (
                                    <FieldError className="" errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {/* CATEGORY FIELD */}
                    <Controller
                        name="category"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="">
                                <FieldLabel className="font-semibold">
                                    Category
                                </FieldLabel>
                                <CategorySelector value={field.value} onChange={field.onChange} />
                                {fieldState.invalid && (
                                    <FieldError className="" errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <Separator className="bg-zinc-800/50 flex-1" />
                            <span className="text-[11px] text-zinc-600 uppercase tracking-widest font-medium">or</span>
                            <Separator className="bg-zinc-800/50 flex-1" />
                        </div>

                        <p className="text-center text-sm">
                            <Link href="/discover" className="text-muted-foreground hover:text-white transition-colors flex items-center justify-center gap-1 group">
                                Discover existing groups
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </p>
                    </div>
                    <Button type="button" onClick={handleValidateForm} className="w-full">Create</Button>
                </FieldGroup>
            </form>
            <PricingDialog
                pricingDialogOpen={pricingDialogOpen}
                setPricingDialogOpen={setPricingDialogOpen}
                groupForm={form}
            />
        </div>
    )
}
