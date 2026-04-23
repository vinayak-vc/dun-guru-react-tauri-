export function getApiBaseUrl(): string {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    if (!apiUrl) {
        throw new Error('Missing VITE_API_BASE_URL');
    }
    return apiUrl.trim().endsWith('/') ? apiUrl : `${apiUrl}/`;
}

export function getOptionalApiBearerToken(): string | null {
    const token = import.meta.env.VITE_API_BEARER_TOKEN;
    if (typeof token !== 'string') return null;
    const trimmed = token.trim();
    return trimmed.length > 0 ? trimmed : null;
}

export function getTargetButtonId(): string {
    const targetButtonId = import.meta.env.VITE_TARGET_BUTTON_ID;
    if (!targetButtonId || targetButtonId.trim() === '') {
        throw new Error('Missing VITE_TARGET_BUTTON_ID');
    }
    return targetButtonId.trim();
}

export function getOptionalTargetButtonId(): string | null {
    const targetButtonId = import.meta.env.VITE_TARGET_BUTTON_ID;
    if (typeof targetButtonId !== 'string') return null;
    const trimmed = targetButtonId.trim();
    return trimmed.length > 0 && trimmed !== 'YOUR_TARGET_ID' ? trimmed : null;
}
