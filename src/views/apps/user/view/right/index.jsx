'use client'

import Grid from '@mui/material/Grid2'
import PermissionListTable from './PermissionListTable'
import { useLoader } from '@/contexts/LoaderContext'

const OverViewTab = ({ viewUserData }) => {
    const { setLoading } = useLoader()

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <PermissionListTable viewUserDetails={viewUserData} setLoading={setLoading} />
            </Grid>
        </Grid>
    )
}

export default OverViewTab
