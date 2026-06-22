'use client'

import Grid from '@mui/material/Grid2'
import CustomerListTable from './CustomerListTable'
import { useCustomers } from '@/hooks/getCustomers'
import { useLoader } from '@/contexts/LoaderContext'
import TableSkeleton from '@/components/TableSkeleton'

const CustomerList = () => {
    const { customers, pagination, loading, fetched, fetchCustomers } = useCustomers()
    const { setLoading } = useLoader()

    const refreshCustomers = async () => {
        fetchCustomers('', pagination.page, pagination.limit)
    }

    if (loading && !fetched) {
        return <TableSkeleton columns={6} rows={10} />
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
