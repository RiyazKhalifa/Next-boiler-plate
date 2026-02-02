"use client"

import { useState, useEffect } from "react"
import Grid from '@mui/material/Grid2'
import { useDispatch } from "react-redux"
import { setUser } from "@/store/userSlice"
import { withAuthCheck } from '@/utils/authWrapper'
import { getUserProfile, updateUserProfile } from '@/app/server/actions/myProfile'
import AccountDetails from './AccountDetails'

const Account = () => {
    const [userProfile, setUserProfile] = useState(null)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await withAuthCheck(getUserProfile)
                if (!res) return
                setUserProfile(res.data)
                dispatch(setUser(res.data))
            } catch (error) {
                console.error("Failed to load profile:", error)
            }
        }
        fetchProfile()
    }, [dispatch])

    if (!userProfile) return <p>Loading profile...</p>

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <AccountDetails userProfile={userProfile} updateAction={updateUserProfile} />
            </Grid>
        </Grid>
    )
}

export default Account
