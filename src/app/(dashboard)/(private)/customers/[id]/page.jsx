import Grid from '@mui/material/Grid2'
import CustomerOverview from '@views/apps/customer/view'
import { viewCustomerData } from '@/app/server/actions/customer'
import { translateMetadata } from '@/utils/metadata';

export const generateMetadata = () => translateMetadata('customer');

const CustomerViewTab = async ({ params }) => {
    const { id } = await params
    const responseCustomerData = await viewCustomerData(id)

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <CustomerOverview
                    viewCustomerData={responseCustomerData.data}
                />
            </Grid>
        </Grid>
    )
}

export default CustomerViewTab
