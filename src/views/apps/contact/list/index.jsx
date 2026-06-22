'use client'

import { useContacts } from '@/hooks/getContacts'
import Grid from '@mui/material/Grid2'
import ContactListTable from './ContactListTable'
import { useLoader } from '@/contexts/LoaderContext'
import TableSkeleton from '@/components/TableSkeleton'

const ContactList = ({ viewGetContactData, replyToContactData }) => {
    const { contacts, pagination, loading, fetched, fetchContacts } = useContacts()
    const { setLoading } = useLoader()

    const refreshContacts = async () => {
        fetchContacts('', pagination.page, pagination.limit)
    }

    if (loading && !fetched) {
        return <TableSkeleton columns={3} rows={10} />
    }

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <ContactListTable
                    tableData={contacts}
                    pagination={pagination}
                    fetchContacts={fetchContacts}
                    refreshContacts={refreshContacts}
                    editContactData={viewGetContactData}
                    replyContact={replyToContactData}
                    setLoading={setLoading}
                />
            </Grid>
        </Grid>
    )
}

export default ContactList
