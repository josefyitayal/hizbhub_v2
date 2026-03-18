import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'
import { serializer } from '../serializer'

export function createQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                queryKeyHashFn(queryKey) {
                    const [json, meta] = serializer.serialize(queryKey)
                    return JSON.stringify({ json, meta })
                },
                staleTime: 60 * 1000, // > 0 to prevent immediate refetching on mount
            },
            dehydrate: {
                shouldDehydrateQuery: query => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
                serializeData(data) {
                    const [json, meta] = serializer.serialize(data)
                    return { json, meta }
                },
            },
            hydrate: {
                deserializeData(data) {
                    // React Query will pass whatever was returned from `serializeData` here.
                    // In some edge-cases (e.g. undefined / unexpected shapes) `meta` may not
                    // be iterable, which breaks `StandardRPCJsonSerializer`.
                    if (!data || typeof data !== 'object') {
                        return data
                    }

                    const { json, meta } = data as { json?: unknown; meta?: unknown }

                    // If this doesn't look like our serialized payload, just return as-is.
                    if (typeof json === 'undefined') {
                        return data
                    }

                    // Ensure `meta` is iterable for the serializer; fall back to empty meta.
                    const safeMeta =
                        (Array.isArray(meta) ||
                            // Map is iterable as well
                            meta instanceof Map) ?
                            meta :
                            []

                    return serializer.deserialize(json, safeMeta as any)
                }
            },
        }
    })
}
