'use client'

import { useCms } from '@/hooks/getCms'
import Grid from '@mui/material/Grid2'
import CmsListTable from './CmsListTable'
import { useLoader } from '@/contexts/LoaderContext'
import TableSkeleton from '@/components/TableSkeleton'

const CmsList = ({ viewCmsByIdData, updateCmsPages }) => {
    const { cms, pagination, loading, fetched, fetchCms } = useCms()
    const { setLoading } = useLoader()

    const refreshCms = async () => {
        fetchCms('', pagination.page, pagination.limit)
    }

    if (loading && !fetched) {
        return <TableSkeleton columns={4} rows={10} />
    }

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <CmsListTable
                    tableData={cms}
                    pagination={pagination}
                    setLoading={setLoading}
                    fetchCms={fetchCms}
                    refreshCms={refreshCms}
                    viewCmsByIdData={viewCmsByIdData}
                    updateCms={updateCmsPages}
                />
            </Grid>
        </Grid>
    )
}

export default CmsList
