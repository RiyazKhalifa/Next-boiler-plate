'use server'

import { getServerSession } from 'next-auth'
import { createApiClient } from '@/app/server/apiClient'
import { authOptions } from '@/libs/auth'
import { revalidatePath } from 'next/cache'

async function getApi() {
    const session = await getServerSession(authOptions)
    return createApiClient({
        accessToken: session?.accessToken,
        refreshToken: session?.refreshToken
    })
}

export async function getLanguages() {
    try {
        const api = await getApi()
        const { data } = await api.get('/app-translations/languages')
        return data
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: 'Session expired. Please log in again.' }
        }
        return err
    }
}

export async function getTranslations(langCode) {
    try {
        const api = await getApi()
        const { data } = await api.get(`/app-translations/translations/${langCode}`)
        return data
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: 'Session expired. Please log in again.' }
        }
        return err
    }
}

export async function addTranslationKey(payload) {
    try {
        const api = await getApi()
        const { data } = await api.post('/app-translations/add-key', payload)
        if (data.status) revalidatePath('/app-translations')
        return data
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: 'Session expired. Please log in again.' }
        }
        return err
    }
}

export async function updateAppTranslations(langCode, payload) {
    try {
        const api = await getApi()
        const { data } = await api.put(`/app-translations/translations/${langCode}`, payload)
        if (data.status) revalidatePath('/app-translations')
        return data
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: 'Session expired. Please log in again.' }
        }
        return err
    }
}

export async function createLanguage(payload) {
    try {
        const api = await getApi()
        const { data } = await api.post('/app-translations/languages', payload)
        if (data.status) revalidatePath('/app-translations')
        return data
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: 'Session expired. Please log in again.' }
        }
        return err
    }
}
