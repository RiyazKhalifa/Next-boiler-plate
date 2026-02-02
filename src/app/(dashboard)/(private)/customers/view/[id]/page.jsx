import Grid from '@mui/material/Grid2'
import CustomerOverview from '@views/apps/customer/view'
import { viewCustomerData } from '@/app/server/actions/customer'

const CustomerViewTab = async ({ params }) => {
    const { id } = await params
    const response = await viewCustomerData(id)

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12, lg: 4, md: 5 }}>
                <CustomerOverview viewCustomerData={response.data} />
            </Grid>
        </Grid>
    )
}

export default CustomerViewTab
