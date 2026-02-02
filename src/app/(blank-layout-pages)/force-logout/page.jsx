'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { signOut, getSession } from 'next-auth/react'
import { Alert, CircularProgress, Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { forceLogout } from '@/app/server/actions/auth'

const ForceLogoutPage = () => {
    const { t } = useTranslation()
    const searchParams = useSearchParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const token = searchParams.get('token')

    useEffect(() => {
        if (!token) {
            setError(t('errors.invalid_token'))
            setLoading(false)
            return
        }

        const performLogout = async () => {
            try {
                const data = await forceLogout(token)

                if (data.status) {
                    setSuccess(true)
                    const session = await getSession()

                    setTimeout(() => {
                        if (session?.refreshToken === token) {
                            signOut({ redirect: true, callbackUrl: '/' })
                        } else {
                            router.push('/')
                        }
                    }, 2000)
                } else {
                    throw new Error(data.message || t('errors.force_logout_failed'))
                }
            } catch (err) {
                setError(err.message || t('errors.force_logout_failed'))
            } finally {
                setLoading(false)
            }
        }

        performLogout()
    }, [token, t])

    if (loading) {
        return (
            <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>{t('processing_force_logout')}</Typography>
            </Box>
        )
    }

    return (
        <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh' p={2}>
            {error && <Alert severity='error'>{error}</Alert>}
            {success && (
                <Alert severity='success'>
                    {t('messages.force_logout_success')}
                </Alert>
            )}
        </Box>
    )
}

export default ForceLogoutPage
