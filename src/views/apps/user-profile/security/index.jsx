'use client'

import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid2'

import { changeUserPassword } from '@/app/server/actions/myProfile'
import ChangePasswordCard from './ChangePasswordCard'
import FormSkeleton from '@/components/FormSkeleton'

const Security = () => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 300)
        return () => clearTimeout(timer)
    }, [])

    if (loading) return <FormSkeleton fields={3} />

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <ChangePasswordCard changePassword={changeUserPassword} />
            </Grid>
        </Grid>
    )
}

export default Security
