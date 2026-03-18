import { cache } from "react"
import { createQueryClient } from "@/lib/query/client"

export const getQueryClient = cache(createQueryClient)