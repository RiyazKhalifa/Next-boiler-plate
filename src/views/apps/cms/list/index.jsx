'use client'

import { useCms } from '@/hooks/getCms'
import Grid from '@mui/material/Grid2'
import CmsListTable from './CmsListTable'
import { useLoader } from '@/contexts/LoaderContext'

const CmsList = ({ viewCmsByIdData, updateCmsPages }) => {
    const { cms, pagination, loading, fetchCms } = useCms()
    const { setLoading } = useLoader()

    const refreshCms = async () => {
        setLoading(true)
        await fetchCms('', pagination.page, pagination.limit)
        setLoading(false)
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
