import { AppData, Button, Trailer, GalleryItem } from '@/models/types';

/**
 * Normalizes a raw button object into the structured Button type.
 * @param rawButton The raw button object.
 * @returns A normalized Button object.
 */
function normalizeButton(rawButton: unknown): Button {
    // Type assertion for safety during normalization, assuming the structure is generally correct.
    const button = rawButton as {
        _id: string;
        title?: string | null;
        subtitle?: string | null;
        description?: string | null;
        thumbnailUrl?: string | null;
        trailers?: any[] | null;
        galleryItems?: any[] | null;
    };

    // Defensive mapping, ensuring all optional fields are null if missing or invalid.
    return {
        _id: button?._id ?? '',
        title: button?.title ?? null,
        subtitle: button?.subtitle ?? null,
        description: button?.description ?? null,
        thumbnailUrl: button?.thumbnailUrl ?? null,
        trailers: button?.trailers ?? null,
        galleryItems: button?.galleryItems ?? null,
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

    // 1. Attempt to locate the array of items defensively.
    if (typeof response === 'object' && response !== null) {
        // Check response.data
        if (response.data && Array.isArray(response.data)) {
            items = response.data;
        } 
        // Check response.data.data
        else if (response.data && typeof response.data === 'object' && response.data !== null && response.data.data && Array.isArray(response.data.data)) {
            items = response.data.data;
        } 
        // Check response.items
        else if (response.items && Array.isArray(response.items)) {
            items = response.items;
        } 
        // Check response itself
        else if (Array.isArray(response)) {
            items = response;
        }
    }

    // 2. Find the target item.
    const targetItem = items.find((item: unknown) => {
        const itemObj = item as { buttons?: any[] };
        if (!itemObj?.buttons || !Array.isArray(itemObj.buttons)) {
            return false;
        }
        const firstButton = itemObj.buttons[0];
        if (typeof firstButton !== 'object' || firstButton === null || !('hasOwnProperty' in firstButton) || !('hasOwnProperty' in firstButton['_id'])) {
             return false;
        }
        // Compare the _id of the first button in the item's buttons array.
        return (firstButton as any)._id === targetButtonId;
    });

    // 3. Normalize buttons if the item was found.
    if (targetItem) {
        const rawButtons = (targetItem as { buttons: unknown[] }).buttons;
        if (Array.isArray(rawButtons)) {
            const normalizedButtons: Button[] = rawButtons.map(normalizeButton);
            return { buttons: normalizedButtons };
        }
    }

    // 4. Return empty array if nothing found.
    return { buttons: [] };
}
