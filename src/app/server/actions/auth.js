'use server'

import { getServerSession } from 'next-auth'
import { createApiClient } from '@/app/server/apiClient'
import { authOptions } from '@/libs/auth'

export async function forgotPassword(payload) {
    try {
        const api = createApiClient()
        const { data } = await api.post('/auth/forgot-password', payload)

        return data;
    } catch (err) {
        return err;
    }
}

export async function resetPassword(payload) {
    try {
        const api = createApiClient()
        const { data } = await api.post('/auth/reset-password', payload)

        return data;
    } catch (err) {
        return err;
    }
}

export async function logout() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return {
                status: false,
                message: 'Not authenticated',
                data: null,
                error: 'Not authenticated',
            }
        }

        const api = createApiClient({ refreshToken: session.refreshToken })
        const { data } = await api.post('/auth/logout', {})
        return data;
    } catch (err) {
        return err;
    }
}

export async function forceLogout(token) {
    try {
        const api = createApiClient()
        const { data } = await api.get(`/auth/force-logout?token=${token}`)
        return data;
    } catch (err) {
        return err;
    }
}
