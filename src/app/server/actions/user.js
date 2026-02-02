'use server'

import { getServerSession } from 'next-auth'
import { createApiClient } from '@/app/server/apiClient'
import { authOptions } from '@/libs/auth'

export async function getUserData(query = {}) {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken
        })

        const { data } = await api.get('/users', { params: query })
        return data
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: 'Session expired. Please log in again.' }
        }
        return err
    }
}

export async function createUser(payload) {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken
        })

        const { data } = await api.post('/users', payload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return data
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: 'Session expired. Please log in again.' }
        }
        return err
    }
}

export async function viewUserData(userId) {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken
        })

        const { data } = await api.get(`/users/${userId}`)
        return data
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: 'Session expired. Please log in again.' }
        }
        return err
    }
}

export async function updateUser(userId, payload) {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken
        })

        const { data } = await api.put(`/users/${userId}`, payload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return data
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: 'Session expired. Please log in again.' }
        }
        return err
    }
}
