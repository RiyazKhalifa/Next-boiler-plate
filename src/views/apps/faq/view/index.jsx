'use client'

import Grid from '@mui/material/Grid2'
import FaqDetails from './FaqDetails'
import { useLoader } from '@/contexts/LoaderContext'

const FaqOverview = ({ viewFaqData }) => {
    const { setLoading } = useLoader()

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <FaqDetails viewFaqDetails={viewFaqData} setLoading={setLoading} />
            </Grid>
        </Grid>
    )
}

export default FaqOverview
