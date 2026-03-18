// lib/orpc.server.ts
import 'server-only'

import { createRouterClient } from '@orpc/server'
import { router } from '@/app/router'
import { headers } from 'next/headers'

globalThis.$client = createRouterClient(router, {
    /**
     * Provide initial context if needed.
     */
    context: async () => ({
        // FIX: The base context requires 'request: Request'. 
        // Use a dummy Request object to satisfy the type-checker.
        request: new Request('https://orpc-server-client-placeholder.local'),
        headers: await headers(), // provide headers if initial context required
    }),
})
