'use server'

import { getServerSession } from 'next-auth'
import { createApiClient } from '@/app/server/apiClient'
import { authOptions } from '@/libs/auth'

export async function getSiteSettings() {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken
        })

        const { data } = await api.get('/site-settings')
        return data
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: 'Session expired. Please log in again.' }
        }
        return err
    }
}

export async function updateSiteSettings(payload) {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken
        })

        const { data } = await api.put('/site-settings', payload)
        return data
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: 'Session expired. Please log in again.' }
        }
        return err
    }
}
