import { Button } from "@/components/ui/button"
import { Plan } from "@/db/schemas"
import { orpc } from "@/lib/orpc"
import { isDefinedError } from "@orpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { usePricing } from "./PricingContext"

export const SkipToTrail = () => {
    const queryClient = useQueryClient()
    const { selectedPlan, groupForm, setOpen, setStep } = usePricing()
    const router = useRouter()

    const trialMutation = useMutation(orpc.payment.startTrial.mutationOptions({
        onSuccess: ({ group, channel }) => {
            toast.success(`Group ${group.title} created successfully`)
            queryClient.invalidateQueries({
                queryKey: orpc.group.list.userGroupInfo.queryKey()
            })
            groupForm.reset()
            setStep("pricing");
            setOpen(false);
            router.push(`/g/${group.slug}/community/${channel.id}`)
        },
        onError: (error) => {
            if (isDefinedError(error)) {
                const definedError = error as Error
                toast.error(definedError.message)
                return
            }

            toast.error("Something went wrong, try again.")
        }

    }))

    const ensureFormReady = async () => {
        const isValid = await groupForm.trigger()
        if (!isValid) {
            toast.error("Please complete the group details first.")
            return false
        }
        return true
    }

    const handleSkip = async () => {
        if (!selectedPlan) {
            toast.error("Please select a plan.")
            return
        }

        const isValid = await ensureFormReady()
        if (!isValid) return

        trialMutation.mutate({
            planId: selectedPlan.id,
            group: groupForm.getValues()
        })
    }

    const isTrialPending = trialMutation.isPending

    return (
        <Button
            variant="link"
            onClick={handleSkip}
            disabled={isTrialPending}
            className="text-muted-foreground hover:text-white transition-colors text-xs uppercase tracking-widest font-medium decoration-zinc-800"
        >
            skip to trial
        </Button>
    )
}
