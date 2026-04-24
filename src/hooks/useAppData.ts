import { useQuery } from '@tanstack/react-query';
import { getOptionalHomeFirstButtonId } from '@/utils/env';
import { fetchAppDataRaw } from '@/services/api';
import { getAppData } from '@/services/normalization';

/**
 * Custom hook to fetch and normalize application data using React Query.
 * @returns The result object from useQuery.
 */
export function useAppData() {
    const homeFirstButtonId = getOptionalHomeFirstButtonId();

    return useQuery({
        queryKey: ['appData', 'homeMarker', homeFirstButtonId ?? 'default'],
        queryFn: async () => {
            const raw = await fetchAppDataRaw();
            return getAppData(raw, homeFirstButtonId);
        },
        staleTime: 60_000,
        retry: 1,
    });
}

// Export type UseAppDataResult
export type UseAppDataResult = ReturnType<typeof useAppData>;
