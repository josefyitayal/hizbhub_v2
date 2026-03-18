// instrumentation.ts

// This ensures the entire file and its imports only run in the Node.js runtime
export const runtime = 'nodejs';

export async function register() {
    // Now it is safe to import server-only code
    await import('./lib/orpc.server');
}
