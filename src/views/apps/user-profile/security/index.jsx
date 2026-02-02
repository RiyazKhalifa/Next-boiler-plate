import Grid from '@mui/material/Grid2'

import { changeUserPassword } from '@/app/server/actions/myProfile'
import ChangePasswordCard from './ChangePasswordCard'

const Security = () => (
    <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
            <ChangePasswordCard changePassword={changeUserPassword} />
        </Grid>
    </Grid>
)

export default Security
