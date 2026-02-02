'use server'

import { getServerSession } from 'next-auth'
import { createApiClient } from '@/app/server/apiClient'
import { authOptions } from '@/libs/auth'

export async function getRoleData(query = {}) {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken,
        })

        const { data } = await api.get('/roles', { params: query })
        return data;
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: "Session expired. Please log in again." };
        }
        return err;
    }
}

export async function createRole(payload) {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken,
        })

        const { data } = await api.post('/roles', payload, {})
        return data;
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: "Session expired. Please log in again." };
        }
        return err;
    }
}

export async function viewRoleData(roleId) {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken
        })

        const { data } = await api.get(`/roles/${roleId}`)
        return data
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: 'Session expired. Please log in again.' }
        }
        return err
    }
}

export async function getPermissions(query = {}) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return { data: [], status: false, message: 'Unauthorized' }
        }
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken,
        })

        const { data } = await api.get('/permissions', { params: query })
        return data;
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: "Session expired. Please log in again." };
        }
        return err;
    }
}

export async function updateRole(roleId, payload) {
    try {
        const session = await getServerSession(authOptions)
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken,
        })

        const { data } = await api.put(`/roles/${roleId}`, payload, {})
        return data;
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: "Session expired. Please log in again." };
        }
        return err;
    }
}

export async function deleteRole(roleId) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return { status: false, message: 'Unauthorized' }
        }
        const api = createApiClient({
            accessToken: session?.accessToken,
            refreshToken: session?.refreshToken,
        })

        const { data } = await api.delete(`/roles/${roleId}`)
        return data;
    } catch (err) {
        if (err.statusCode === 401) {
            return { data: null, sessionExpired: true, message: "Session expired. Please log in again." };
        }
        return err;
    }
}
