'use server'

import { getServerSession } from 'next-auth'
import { createApiClient } from '@/app/server/apiClient'
import { authOptions } from '@/libs/auth'

export async function getFaqData(query = {}) {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken
        })

        const { data } = await api.get('/faqs', { params: query })
        return data
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: 'Session expired. Please log in again.' }
        }
        return err
    }
}

export async function createFaq(payload) {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken
        })

        const { data } = await api.post('/faqs', payload, {})
        return data
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: 'Session expired. Please log in again.' }
        }
        return err
    }
}

export async function viewFaqData(faqId) {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken
        })

        const { data } = await api.get(`/faqs/${faqId}`)
        return data
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: 'Session expired. Please log in again.' }
        }
        return err
    }
}

export async function updateFaq(faqId, payload) {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken
        })

        const { data } = await api.put(`/faqs/${faqId}`, payload, {})
        return data
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: 'Session expired. Please log in again.' }
        }
        return err
    }
}
