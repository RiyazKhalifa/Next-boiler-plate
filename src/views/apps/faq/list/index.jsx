'use client'

import { useFaqs } from '@/hooks/getFaqs'
import Grid from '@mui/material/Grid2'
import FaqListTable from './FaqListTable'
import { useLoader } from '@/contexts/LoaderContext'
import TableSkeleton from '@/components/TableSkeleton'

const FaqList = ({ addFaq, viewGetFaqData, showEditRecords }) => {
    const { faqs, pagination, loading, fetched, fetchFaqs } = useFaqs()
    const { setLoading } = useLoader()

    const refreshFaqs = async () => {
        fetchFaqs('', pagination.page, pagination.limit)
    }

    if (loading && !fetched) {
        return <TableSkeleton columns={3} rows={10} />
    }

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <FaqListTable
                    tableData={faqs}
                    pagination={pagination}
                    fetchFaqs={fetchFaqs}
                    refreshFaqs={refreshFaqs}
                    addFaq={addFaq}
                    editFaqData={viewGetFaqData}
                    updateFaq={showEditRecords}
                    setLoading={setLoading}
                />
            </Grid>
        </Grid>
    )
}

export default FaqList
