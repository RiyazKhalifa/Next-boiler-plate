'use client'

import Grid from '@mui/material/Grid2'
import UserDetails from './UserDetails'
import { useLoader } from '@/contexts/LoaderContext'

const UserOverview = ({ viewUserData }) => {
    const { setLoading } = useLoader()

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <UserDetails viewUserDetails={viewUserData} setLoading={setLoading} />
            </Grid>
        </Grid>
    )
}

export default UserOverview
