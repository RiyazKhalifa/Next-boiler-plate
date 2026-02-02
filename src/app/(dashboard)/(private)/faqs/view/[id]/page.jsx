import Grid from '@mui/material/Grid2'
import FaqOverview from '@views/apps/faq/view'
import { viewFaqData } from '@/app/server/actions/faq'
import { translateMetadata } from '@/utils/metadata';

export const generateMetadata = () => translateMetadata('faq');

const FaqViewTab = async ({ params }) => {
    const { id } = await params
    const response = await viewFaqData(id)

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <FaqOverview viewFaqData={response.data} />
            </Grid>
        </Grid>
    )
}

export default FaqViewTab
