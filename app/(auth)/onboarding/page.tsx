'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { onboardingSchema } from "@/zod-schema/onboardingZodSchema"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { useMutation } from '@tanstack/react-query'
import { orpc } from '@/lib/orpc'
import { toast } from 'sonner'
import { ProfilePictureUpload } from './_components/profilePictureUpload'

const getClientSideCookie = (name: string) => {
    if (typeof document === 'undefined') return; // Ensure it runs in the browser

    const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${name}=`))
        ?.split('=')[1];
    return cookieValue;
};

export default function OnboardingComponent() {
    const { user } = useUser()
    const searchParams = useSearchParams();
    const router = useRouter()

    const redirectUrl = searchParams.get("redirect_url");

    const [cookieValue, setCookieValue] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        setCookieValue(getClientSideCookie('my-cookie-name'));
    }, []);

    const onboardingMutation = useMutation(orpc.user.create.mutationOptions({
        onSuccess: async () => {
            if (user) {
                try {
                    // Force Clerk to refresh the session token with new metadata
                    await user.reload();
                } catch (err) {
                    console.error("Failed to reload user session:", err);
                }
            }

            router.push(redirectUrl || "/discover")
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))

    const form = useForm<z.infer<typeof onboardingSchema>>({
        resolver: zodResolver(onboardingSchema),
        values: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            userName: user?.username || "",
            bio: "",
            profilePicture: user?.imageUrl || ""
        }
    })

    const onSubmit = async (data: z.infer<typeof onboardingSchema>) => {
        onboardingMutation.mutate(data)
    }

    return (
        <div className='w-full h-screen flex items-center justify-center relative' >
            <div className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[600px] bg-[radial-gradient(50%_50%_at_50%_0%,rgba(255,255,255,0.10)_0%,transparent_100%)] pointer-events-none" />
            <Card className="w-full sm:max-w-md">
                <CardHeader>
                    <CardTitle>User Profile</CardTitle>
                    <CardDescription>Fill the following forms to create your profile.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="form-onboarding" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="profilePicture"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="form-onboarding-profilePicture">Profile Picture</FieldLabel>
                                        <ProfilePictureUpload id='form-onboarding-profilePicture' value={field.value} setValue={field.onChange} />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <div className='grid grid-cols-2 gap-2'>
                                <Controller
                                    name="firstName"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-onboarding-firstName">First Name</FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-onboarding-firstName"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="First Name"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="lastName"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-onboarding-lastName">Last Name</FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-onboarding-lastName"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Last Name"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>
                            <Controller
                                name="userName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-onboarding-userName">Username</FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-onboarding-userName"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Username"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="bio"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-onboarding-bio">Bio</FieldLabel>
                                        <InputGroup>
                                            <InputGroupTextarea
                                                {...field}
                                                id="form-onboarding-bio"
                                                placeholder="Something about your self"
                                                rows={6}
                                                className="min-h-24 resize-none"
                                                aria-invalid={fieldState.invalid}
                                            />
                                            <InputGroupAddon align="block-end">
                                                <InputGroupText className="tabular-nums">
                                                    {field.value.length}/100 characters
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Field orientation="horizontal">
                        <Button
                            type="submit"
                            disabled={onboardingMutation.isPending}
                            form="form-onboarding"
                        >
                            {onboardingMutation.isPending ? "Creating..." : "Create"}
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
            <div>
                {cookieValue && (
                    <p>Referrered by: {cookieValue}</p>
                )}
            </div>
        </div>
    )
}
