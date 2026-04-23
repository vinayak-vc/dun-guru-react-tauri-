export function getApiBaseUrl(): string {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    if (!apiUrl) {
        throw new Error('Missing VITE_API_BASE_URL');
    }
    return apiUrl.trim().endsWith('/') ? apiUrl : `${apiUrl}/`;
}

export function getTargetButtonId(): string {
    const targetButtonId = import.meta.env.VITE_TARGET_BUTTON_ID;
    if (!targetButtonId || targetButtonId.trim() === '') {
        throw new Error('Missing VITE_TARGET_BUTTON_ID');
    }
    return targetButtonId.trim();
}
