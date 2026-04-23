import axios, { AxiosInstance } from 'axios';
import { getApiBaseUrl, getOptionalApiBearerToken } from '@/utils/env';

// Configure the Axios instance
const bearerToken = getOptionalApiBearerToken();
const apiClient: AxiosInstance = axios.create({
    baseURL: getApiBaseUrl(),
    timeout: 10000,
    headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : undefined,
});

// Add response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        let message: string;
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const status = error.response.status;
            const statusText = error.response.statusText;
            const data = JSON.stringify(error.response.data);
            message = `API Error: ${status} (${statusText}). Details: ${data}`;
        } else if (error.request) {
            // The request was made but no response was received
            message = 'Network Error: No response received from the server.';
        } else {
            // Something happened in setting up the request that triggered an Error
            message = `Request Setup Error: ${error.message}`;
        }
        
        // Throw a new Error with a readable message including status code when available.
        throw new Error(message);
    }
);

/**
 * Fetches raw application data from the root endpoint.
 * @returns A promise that resolves with the response data.
 */
export async function fetchAppDataRaw(): Promise<unknown> {
    // Postman collection: GET /api/sikh-apps/data
    // When VITE_API_BASE_URL is set to '/api/' (vite proxy), we call 'sikh-apps/data' here.
    const response = await apiClient.get('sikh-apps/data');
    return response.data;
}
