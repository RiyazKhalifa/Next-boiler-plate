'use client'

import Grid from '@mui/material/Grid2'
import CustomerDetails from './CustomerDetails'
import { useLoader } from '@/contexts/LoaderContext'

const CustomerOverview = ({ viewCustomerData }) => {
    const { setLoading } = useLoader()

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <CustomerDetails
                    viewCustomerDetails={viewCustomerData}
                    setLoading={setLoading}
                />
            </Grid>
        </Grid>
    )
}

export default CustomerOverview
