import Grid from '@mui/material/Grid2'
import UserOverview from '@views/apps/user/view'
import OverViewTab from '@views/apps/user/view/right'
import { viewUserData } from '@/app/server/actions/user'
import { translateMetadata } from '@/utils/metadata';

export const generateMetadata = () => translateMetadata('user');

const UserViewTab = async ({ params }) => {
    const { id } = await params
    const response = await viewUserData(id)

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12, lg: 4, md: 5 }}>
                <UserOverview viewUserData={response.data} />
            </Grid>
            <Grid size={{ xs: 12, lg: 8, md: 7 }}>
                <OverViewTab viewUserData={response.data} />
            </Grid>
        </Grid>
    )
}

export default UserViewTab
