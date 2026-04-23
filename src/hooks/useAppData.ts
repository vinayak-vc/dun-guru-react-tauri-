import { useQuery } from '@tanstack/react-query';
import { getOptionalTargetButtonId } from '@/utils/env';
import { fetchAppDataRaw } from '@/services/api';
import { getAppData } from '@/services/normalization';

/**
 * Custom hook to fetch and normalize application data using React Query.
 * @returns The result object from useQuery.
 */
export function useAppData() {
    const targetButtonId = getOptionalTargetButtonId();

    return useQuery({
        queryKey: ['appData', targetButtonId ?? 'all'],
        queryFn: async () => {
            const raw = await fetchAppDataRaw();
            return getAppData(raw, targetButtonId);
        },
        staleTime: 60_000,
        retry: 1,
    });
}

// Export type UseAppDataResult
export type UseAppDataResult = ReturnType<typeof useAppData>;
