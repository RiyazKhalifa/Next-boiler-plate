'use server'

import { getServerSession } from 'next-auth'
import { createApiClient } from '@/app/server/apiClient'
import { authOptions } from '@/libs/auth'

export async function getUserProfile() {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken,
        })

        const { data } = await api.get('/profile')
        return data;
    } catch (err) {
        if (err.statusCode === 401) {
            return { status: false, sessionExpired: true, message: "Session expired. Please log in again." };
        }
        return err;
    }
}

export async function updateUserProfile(payload) {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken,
        })

        const { data } = await api.put('/profile', payload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return data;
    } catch (err) {
        if (err.statusCode === 401) {
            return { status: false, sessionExpired: true, message: "Session expired. Please log in again." };
        }
        return err;
    }
}

export async function changeUserPassword(payload) {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken,
        })

        const { data } = await api.put('/profile/change-password', payload)
        return data;
    } catch (err) {
        if (err.statusCode === 401) {
            return { status: false, sessionExpired: true, message: "Session expired. Please log in again." };
        }
        return err;
    }
}
