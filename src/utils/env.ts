export function getApiBaseUrl(): string {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    if (!apiUrl) {
        throw new Error('Missing VITE_API_BASE_URL');
    }
    return apiUrl.trim().endsWith('/') ? apiUrl : `${apiUrl}/`;
}
