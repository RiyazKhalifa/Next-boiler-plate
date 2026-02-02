'use server'

import { getServerSession } from 'next-auth'
import { createApiClient } from '@/app/server/apiClient'
import { authOptions } from '@/libs/auth'

export async function updateStatus(payload) {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken,
        })

        const { data } = await api.put('/common/status', payload)
        return data;
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: "Session expired. Please log in again." };
        }
        return err;
    }
}

export async function deleteRecord(payload) {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken,
        })

        const { data } = await api.delete('/common/delete', { data: payload })
        return data;
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: "Session expired. Please log in again." };
        }
        return err;
    }
}

export async function updateSequence(payload) {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken,
        })

        const { data } = await api.put('/common/sequence', payload)
        return data;
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: "Session expired. Please log in again." };
        }
        return err;
    }
}
