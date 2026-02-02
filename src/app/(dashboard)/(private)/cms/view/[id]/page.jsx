import Grid from '@mui/material/Grid2'
import CmsOverview from '@views/apps/cms/view'
import { viewCmsData } from '@/app/server/actions/cms'
import { translateMetadata } from '@/utils/metadata';

export const generateMetadata = () => translateMetadata('cms_pages');

const CmsViewTab = async ({ params }) => {
    const { id } = await params
    const response = await viewCmsData(id)

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <CmsOverview viewCmsData={response.data} />
            </Grid>
        </Grid>
    )
}

export default CmsViewTab
