import { getApiBaseUrl, getOptionalApiBearerToken } from '@/utils/env';

const isTauriRuntime =
    typeof window !== 'undefined' &&
    (Boolean((window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__) ||
        Boolean((window as unknown as { __TAURI__?: unknown }).__TAURI__));

const buildUrl = (path: string) => {
    const base = getApiBaseUrl();
    const clean = path.startsWith('/') ? path.slice(1) : path;
    return `${base}${clean}`;
};

const buildHeaders = () => {
    const bearerToken = getOptionalApiBearerToken();
    return bearerToken ? { Authorization: `Bearer ${bearerToken}` } : undefined;
};

/**
 * Fetches raw application data from the root endpoint.
 * @returns A promise that resolves with the response data.
 */
export async function fetchAppDataRaw(): Promise<unknown> {
    // Postman collection: GET /api/sikh-apps/data
    // When VITE_API_BASE_URL is set to '/api/' (vite proxy), we call 'sikh-apps/data' here.
    const url = buildUrl('sikh-apps/data');

    if (isTauriRuntime) {
        // Dynamically import so non-Tauri runtimes can never crash on module init.
        const { fetch: tauriFetch } = await import('@tauri-apps/plugin-http');
        const res = await tauriFetch(url, {
            method: 'GET',
            headers: buildHeaders(),
            connectTimeout: 10_000,
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`API Error: ${res.status}. Details: ${text}`);
        }
        return await res.json();
    }

    const res = await fetch(url, {
        method: 'GET',
        headers: buildHeaders(),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`API Error: ${res.status}. Details: ${text}`);
    }
    return await res.json();
}
