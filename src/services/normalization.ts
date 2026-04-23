import { AppData, Button } from '@/models/types';

/**
 * Normalizes a raw button object into the structured Button type.
 * @param rawButton The raw button object.
 * @returns A normalized Button object.
 */
function normalizeButton(rawButton: unknown): Button {
    // Type assertion for safety during normalization.
    const button = rawButton as {
        _id: unknown;
        title?: string | null;
        subtitle?: string | null;
        description?: string | null;
        thumbnailUrl?: string | null;
        trailers?: any[] | null;
        galleryItems?: any[] | null;
    };

    // Defensive mapping, ensuring all optional fields are null if missing or invalid.
    return {
        _id: String(button._id ?? ''),
        title: button.title ?? null,
        subtitle: button.subtitle ?? null,
        description: button.description ?? null,
        thumbnailUrl: button.thumbnailUrl ?? null,
        trailers: button.trailers ?? null,
        galleryItems: button.galleryItems ?? null,
    };
}

/**
 * Finds and normalizes the application data based on the target button ID.
 * @param response The raw API response data.
 * @param targetButtonId The ID of the button to locate.
 * @returns AppData containing the normalized buttons.
 */
export function getAppData(response: unknown, targetButtonId: string): AppData {
    let items: unknown[] = [];
    const r = response as any;

    // 1. Attempt to locate the array of items defensively based on priority.
    if (Array.isArray(r?.data?.data)) {
        items = r.data.data;
    } else if (Array.isArray(r?.data)) {
        items = r.data;
    } else if (Array.isArray(r?.items)) {
        items = r.items;
    } else if (Array.isArray(r)) {
        items = r;
    }

    // 2. Find the target item.
    const targetItem = items.find((item: unknown) => {
        const itemObj = item as { buttons?: unknown[] };
        const rawButtons = itemObj?.buttons;

        if (!Array.isArray(rawButtons)) {
            return false;
        }

        const firstButton = rawButtons[0];
        if (typeof firstButton !== 'object' || firstButton === null) {
            return false;
        }

        // Compare the _id of the first button in the item's buttons array.
        const buttonId = (firstButton as any)._id;
        return typeof buttonId === 'string' && buttonId === targetButtonId;
    });

    // 3. Normalize buttons if the item was found.
    if (targetItem) {
        const rawButtons = (targetItem as { buttons: unknown[] }).buttons;
        if (Array.isArray(rawButtons)) {
            const normalizedButtons: Button[] = rawButtons
                // Filter: ONLY keep buttons where _id is truthy
                .filter((rawButton: unknown) => {
                    const button = rawButton as { _id: unknown };
                    return button && button._id;
                })
                .map(normalizeButton);
            return { buttons: normalizedButtons };
        }
    }

    // 4. Return empty array if nothing found.
    return { buttons: [] };
}
