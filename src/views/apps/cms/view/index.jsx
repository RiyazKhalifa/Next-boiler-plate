'use client'

import Grid from '@mui/material/Grid2'
import CmsDetails from './CmsDetails'
import { useLoader } from '@/contexts/LoaderContext'

const CmsOverview = ({ viewCmsData }) => {
    const { setLoading } = useLoader()

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <CmsDetails viewCmsDetails={viewCmsData} setLoading={setLoading} />
            </Grid>
        </Grid>
    )
}

export default CmsOverview
