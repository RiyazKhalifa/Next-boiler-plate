'use client'

import Grid from '@mui/material/Grid2'
import CustomerListTable from './CustomerListTable'
import { useCustomers } from '@/hooks/getCustomers'
import { useLoader } from '@/contexts/LoaderContext'

const CustomerList = () => {
    const { customers, pagination, loading, fetchCustomers } = useCustomers()
    const { setLoading } = useLoader()

    const refreshCustomers = async () => {
        setLoading(true)
        await fetchCustomers('', pagination.page, pagination.limit)
        setLoading(false)
    }

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <CustomerListTable
                    tableData={customers}
                    pagination={pagination}
                    setLoading={setLoading}
                    fetchCustomers={fetchCustomers}
                    refreshCustomers={refreshCustomers}
                />
            </Grid>
        </Grid>
    )
}

export default CustomerList
