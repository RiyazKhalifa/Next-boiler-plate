// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import NotificationListTable from './NotificationListTable'

const NotificationList = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <NotificationListTable />
      </Grid>
    </Grid>
  )
}

export default NotificationList
