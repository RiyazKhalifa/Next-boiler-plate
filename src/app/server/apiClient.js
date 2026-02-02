import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Factory for API client
export function createApiClient({ accessToken, refreshToken } = {}) {
    const instance = axios.create({
        baseURL: API_URL,
        headers: { "Content-Type": "application/json" },
    });

    // Attach tokens
    instance.interceptors.request.use(async (config) => {
        const cookieStore = await cookies();
        const lang = cookieStore.get("lang")?.value || "en";
        config.headers["Accept-Language"] = lang;
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        if (refreshToken) {
            config.headers["refresh-token"] = refreshToken;
        }
        return config;
    });

    // Handle responses
    instance.interceptors.response.use(
        (res) => res,
        (err) => {
            let errorData;
            if (typeof err.response?.data === 'string') {
                errorData = { message: err.response.data };
            } else {
                errorData = err.response?.data || { message: err.message || "API Error" };
            }
            errorData.statusCode = err.response?.status || 500;
            return Promise.reject(errorData);
        }
    );

    return instance;
}
