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

/**
 * When set, `getAppData` selects `data[i]` where `data[i].buttons[0]._id` equals this value.
 * If unset, normalization uses the default marker id for the Sikh History home bundle.
 */
export function getOptionalHomeFirstButtonId(): string | null {
    const id = import.meta.env.VITE_HOME_FIRST_BUTTON_ID;
    if (typeof id !== 'string') return null;
    const trimmed = id.trim();
    return trimmed.length > 0 ? trimmed : null;
}
