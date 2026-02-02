// MUI Imports
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'

const TablePaginationComponent = ({ table, pagination }) => {
    const currentPage = table.getState().pagination.pageIndex + 1
    const pageSize = table.getState().pagination.pageSize
    const total = pagination?.total || 0
    const totalPages = pagination?.totalPages || 1

    const startEntry = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
    const endEntry = Math.min(currentPage * pageSize, total)

    return (
        <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>
            <Typography color='text.disabled'>
                {`Showing ${startEntry} to ${endEntry} of ${total} entries`}
            </Typography>
            <Pagination
                shape='rounded'
                color='primary'
                variant='tonal'
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => {
                    table.setPageIndex(page - 1)
                }}
                showFirstButton
                showLastButton
            />
        </div>
    )
}

export default TablePaginationComponent
