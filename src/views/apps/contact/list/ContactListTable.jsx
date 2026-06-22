'use client'

import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { withAuthCheck } from '@/utils/authWrapper'
import { deleteRecord } from '@/app/server/actions/common'
import { Card, CardHeader, Typography, IconButton, MenuItem, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Divider, Chip } from '@mui/material'
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog'
import classnames from 'classnames'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel
} from '@tanstack/react-table'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import DebouncedInput from '@/components/DebouncedInput'
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'
import tableStyles from '@core/styles/table.module.css'
import Can from '@/libs/can'
import { formatDate } from '@/libs/dateFormat'

const columnHelper = createColumnHelper()

const ContactListTable = ({
    tableData,
    pagination,
    setLoading,
    fetchContacts,
    refreshContacts,
    editContactData,
    replyContact
}) => {
    const { t } = useTranslation()

    const [viewOpen, setViewOpen] = useState(false)
    const [viewData, setViewData] = useState(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [selectedToDelete, setSelectedToDelete] = useState(null)
    const [replyOpen, setReplyOpen] = useState(false)
    const [selectedToReply, setSelectedToReply] = useState(null)
    const [replyMessage, setReplyMessage] = useState('')
    const [data, setData] = useState(tableData || [])
    const [globalFilter, setGlobalFilter] = useState('')
    const [tablePagination, setTablePagination] = useState({
        pageIndex: (pagination.page || 1) - 1,
        pageSize: pagination.limit || 10
    })
    const [sorting, setSorting] = useState([])

    useEffect(() => {
        setTablePagination({ pageIndex: (pagination.page || 1) - 1, pageSize: pagination.limit || 10 })
    }, [pagination.page, pagination.limit])

    useEffect(() => {
        const sortBy = sorting.length > 0 ? sorting[0].id : ''
        const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : ''
        fetchContacts(globalFilter, 1, tablePagination.pageSize, sortBy, sortOrder)
    }, [globalFilter, sorting])

    useEffect(() => {
        setData(tableData || [])
    }, [tableData])

    const handleOpenViewContact = async id => {
        setLoading(true)
        const result = await editContactData(id)
        if (result?.status) {
            setViewData(result.data)
            setViewOpen(true)
            await refreshContacts() // update read status in table
        } else {
            toast.error(t(result?.message) || 'Error occurred')
        }
        setLoading(false)
    }

    const handleDeleteContact = id => {
        setSelectedToDelete(id)
        setDeleteOpen(true)
    }

    const handleOpenReply = row => {
        setSelectedToReply(row)
        setReplyMessage(row.reply || '')
        setReplyOpen(true)
    }

    const handleReplySubmit = async () => {
        if (!replyMessage.trim()) {
            toast.error(t('validation.reply_required'))
            return
        }

        setLoading(true)
        const result = await withAuthCheck(() => replyContact(selectedToReply.id, { reply: replyMessage }))
        if (result?.status) {
            toast.success(t('messages.reply_sent_successfully'))
            setReplyOpen(false)
            refreshContacts()
        } else {
            toast.error(t(result?.message) || 'Failed to send reply')
        }
        setLoading(false)
    }

    const columns = useMemo(
        () => [
            columnHelper.accessor('name', {
                header: t('name'),
                cell: ({ row }) => (
                    <Typography color='text.primary' className='font-medium'>
                        {row.original.name}
                    </Typography>
                )
            }),
            columnHelper.accessor('email', {
                header: t('email'),
                cell: ({ row }) => (
                    <Typography color='text.primary'>
                        {row.original.email}
                    </Typography>
                )
            }),
            columnHelper.accessor('subject', {
                header: t('subject'),
                cell: ({ row }) => (
                    <Typography color='text.primary'>
                        {row.original.subject}
                    </Typography>
                )
            }),
            columnHelper.accessor('status', {
                header: t('status'),
                cell: ({ row }) => {
                    const status = row.original.status || 'pending'
                    const colors = {
                        pending: 'warning',
                        read: 'success',
                        replied: 'info'
                    }

                    return (
                        <Chip
                            label={t(status)}
                            color={colors[status]}
                            variant='tonal'
                            size='small'
                            className='capitalize'
                        />
                    )
                }
            }),
            columnHelper.accessor('created_at', {
                id: 'createdAt',
                header: t('created_at'),
                cell: ({ row }) => (
                    <Typography color='text.primary'>
                        {formatDate(row.original.created_at)}
                    </Typography>
                )
            }),
            columnHelper.accessor('action', {
                header: t('action'),
                cell: ({ row }) => (
                    <div className='flex items-center gap-2'>
                        <Can permission='contact.view'>
                            <Tooltip title={t('view')}>
                                <IconButton
                                    sx={{ transition: 'all 0.2s', '&:hover': { backgroundColor: 'action.hover', '& i': { opacity: 0.7 } } }}
                                    onClick={() => handleOpenViewContact(row.original.id)}
                                >
                                    <i className='tabler-eye text-[22px] text-textSecondary' />
                                </IconButton>
                            </Tooltip>
                            <Can permission='contact.reply'>
                                <Tooltip title={t('reply')}>
                                    <IconButton
                                        sx={{ transition: 'all 0.2s', '&:hover': { backgroundColor: 'action.hover', '& i': { opacity: 0.7 } } }}
                                        onClick={() => handleOpenReply(row.original)}
                                    >
                                        <i className='tabler-mail-forward text-[22px] text-textSecondary' />
                                    </IconButton>
                                </Tooltip>
                            </Can>
                        </Can>
                        <Can permission='contact.delete'>
                            <Tooltip title={t('delete')}>
                                <IconButton
                                    sx={{ transition: 'all 0.2s', '&:hover': { backgroundColor: 'action.hover', '& i': { opacity: 0.7 } } }}
                                    onClick={() => handleDeleteContact(row.original.id)}
                                >
                                    <i className='tabler-trash text-[22px] text-textSecondary' />
                                </IconButton>
                            </Tooltip>
                        </Can>
                    </div>
                ),
                enableSorting: false
            })
        ],
        [data, t, setLoading]
    )

    const table = useReactTable({
        data: tableData,
        columns,
        state: { globalFilter, pagination: tablePagination, sorting },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: updater => {
            const newSorting = typeof updater === 'function' ? updater(sorting) : updater
            setSorting(newSorting)
            const sortBy = newSorting.length > 0 ? newSorting[0].id : ''
            const sortOrder = newSorting.length > 0 ? (newSorting[0].desc ? 'desc' : 'asc') : ''
            fetchContacts(globalFilter, tablePagination.pageIndex + 1, tablePagination.pageSize, sortBy, sortOrder)
        },
        onPaginationChange: updater => {
            const newPagination = typeof updater === 'function' ? updater(tablePagination) : updater
            setTablePagination(newPagination)
            const sortBy = sorting.length > 0 ? sorting[0].id : ''
            const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : ''
            fetchContacts(globalFilter, newPagination.pageIndex + 1, newPagination.pageSize, sortBy, sortOrder)
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        pageCount: pagination.totalPages || 1
    })

    return (
        <>
            <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth scroll='body'>
                <DialogTitle className='flex items-center gap-2 pbe-2'>
                    <i className='tabler-info-square-rounded text-2xl text-primary' />
                    <Typography variant='h5' component='span' className='font-bold'>
                        {t('contact_details')}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {viewData && (
                        <div className="flex flex-col gap-6 pt-2">
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-actionHover border border-neutral-100 flex-wrap'>
                                <div className='flex items-start gap-3'>
                                    <CustomAvatar color='primary' skin='light' size={40} variant='rounded'>
                                        <i className='tabler-user' />
                                    </CustomAvatar>
                                    <div>
                                        <Typography variant="caption" className='uppercase font-bold tracking-wider'>{t('name')}</Typography>
                                        <Typography variant="body1" className='font-medium text-textPrimary'>{viewData.name}</Typography>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3'>
                                    <CustomAvatar color='info' skin='light' size={40} variant='rounded'>
                                        <i className='tabler-mail' />
                                    </CustomAvatar>
                                    <div>
                                        <Typography variant="caption" className='uppercase font-bold tracking-wider'>{t('email')}</Typography>
                                        <Typography variant="body1" className='font-medium text-textPrimary truncate max-w-[180px]' title={viewData.email}>
                                            {viewData.email}
                                        </Typography>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3'>
                                    <CustomAvatar color='success' skin='light' size={40} variant='rounded'>
                                        <i className='tabler-phone' />
                                    </CustomAvatar>
                                    <div>
                                        <Typography variant="caption" className='uppercase font-bold tracking-wider'>{t('phone')}</Typography>
                                        <Typography variant="body1" className='font-medium text-textPrimary'>{viewData.phone || 'N/A'}</Typography>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3'>
                                    <CustomAvatar color={viewData.status === 'replied' ? 'info' : (viewData.status === 'read' ? 'success' : 'warning')} skin='light' size={40} variant='rounded'>
                                        <i className='tabler-status-change' />
                                    </CustomAvatar>
                                    <div>
                                        <Typography variant="caption" className='uppercase font-bold tracking-wider'>{t('status')}</Typography>
                                        <Typography variant="body1" className='font-medium text-textPrimary capitalize'>{t(viewData.status)}</Typography>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col gap-1.5'>
                                <div className='flex items-center gap-2'>
                                    <i className='tabler-tag text-lg text-primary' />
                                    <Typography variant="caption" className='uppercase font-bold tracking-wider'>{t('subject')}</Typography>
                                </div>
                                <Typography variant="body1" className="font-bold text-textPrimary p-3 bg-neutral-50 rounded-lg border">
                                    {viewData.subject || 'No Subject'}
                                </Typography>
                            </div>

                            <div className='flex flex-col gap-1.5'>
                                <div className='flex items-center gap-2'>
                                    <i className='tabler-message-2 text-lg text-primary' />
                                    <Typography variant="caption" className='uppercase font-bold tracking-wider'>{t('message')}</Typography>
                                </div>
                                <Typography variant="body2" className="whitespace-pre-wrap rounded-xl bg-actionHover p-4 text-textPrimary border border-dashed">
                                    {viewData.message}
                                </Typography>
                            </div>

                            {viewData.reply && (
                                <div className='flex flex-col gap-1.5 relative p-4 rounded-xl bg-primaryLight border border-primaryBorder'>
                                    <div className='flex items-center justify-between mb-2'>
                                        <div className='flex items-center gap-2'>
                                            <i className='tabler-corner-down-right-double text-primary text-xl' />
                                            <Typography variant="caption" color="primary" className='uppercase font-bold tracking-wider'>{t('reply_message')}</Typography>
                                        </div>
                                        {viewData.replied_at && (
                                            <Typography variant="caption" className='bg-white px-2 py-0.5 rounded shadow-sm italic'>
                                                {formatDate(viewData.replied_at)}
                                            </Typography>
                                        )}
                                    </div>
                                    <Typography variant="body2" className="whitespace-pre-wrap text-textPrimary leading-relaxed">
                                        {viewData.reply}
                                    </Typography>
                                </div>
                            )}

                            <div className='flex items-center justify-between pt-2 border-t border-dashed'>
                                <div className='flex items-center gap-1.5'>
                                    <i className='tabler-calendar-event text-textSecondary' />
                                    <Typography variant="caption" className='font-medium'>
                                        {t('inquiry_received_on')}: {formatDate(viewData.created_at)}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogActions className='pbs-2 pbe-6 pli-6'>
                    <Button 
                        onClick={() => setViewOpen(false)} 
                        color="primary" 
                        variant="contained"
                        startIcon={<i className='tabler-check' />}
                    >
                        {t('close')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={replyOpen} onClose={() => setReplyOpen(false)} maxWidth="sm" fullWidth scroll='body'>
                <DialogTitle className='flex items-center gap-2 pbe-2'>
                    <i className='tabler-mail-forward text-2xl text-primary' />
                    <Typography variant='h5' component='span' className='font-bold'>
                        {selectedToReply?.status === 'replied' ? t('edit_reply') : t('reply_to_inquiry')}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedToReply && (
                        <div className="flex flex-col gap-5 pt-2">
                            <div className='flex flex-col sm:flex-row gap-4 p-4 rounded bg-actionHover border border-dashed border-primary'>
                                <div className='flex-1'>
                                    <div className='flex items-center gap-1.5 mb-1'>
                                        <i className='tabler-user text-primary text-lg' />
                                        <Typography variant="caption" className='uppercase font-bold tracking-wider'>{t('to')}</Typography>
                                    </div>
                                    <Typography variant="body1" className='font-medium text-textPrimary leading-tight'>
                                        {selectedToReply.name}
                                    </Typography>
                                    <Typography variant="body2" className='text-textSecondary'>
                                        {selectedToReply.email}
                                    </Typography>
                                </div>
                                <div className='flex-1 border-is sm:pl-4'>
                                    <div className='flex items-center gap-1.5 mb-1'>
                                        <i className='tabler-message text-primary text-lg' />
                                        <Typography variant="caption" className='uppercase font-bold tracking-wider'>{t('subject')}</Typography>
                                    </div>
                                    <Typography variant="body1" className='font-medium text-textPrimary leading-snug'>
                                        Re: {selectedToReply.subject}
                                    </Typography>
                                </div>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <div className='flex items-center gap-2'>
                                    <i className='tabler-pencil text-xl text-primary' />
                                    <Typography className='font-medium text-textPrimary'>{t('reply_message')}</Typography>
                                </div>
                                <CustomTextField
                                    fullWidth
                                    multiline
                                    rows={6}
                                    placeholder={t('enter_your_reply')}
                                    value={replyMessage}
                                    onChange={e => setReplyMessage(e.target.value)}
                                    sx={{ '& .MuiInputBase-root': { borderRadius: '12px' } }}
                                />
                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogActions className='pbs-2 pbe-6 pli-6'>
                    <Button 
                        onClick={() => setReplyOpen(false)} 
                        color="secondary" 
                        variant="tonal" 
                        startIcon={<i className='tabler-x' />}
                    >
                        {t('cancel')}
                    </Button>
                    <Button 
                        onClick={handleReplySubmit} 
                        color="primary" 
                        variant="contained" 
                        startIcon={<i className='tabler-send' />}
                    >
                        {t('send_reply')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Card className='overflow-hidden'>
                <CardHeader
                    className='pbe-4'
                    title={
                        <div className='flex items-center gap-3'>
                            <CustomAvatar color='primary' skin='light' variant='rounded' size={34}>
                                <i className='tabler-mail text-[22px]' />
                            </CustomAvatar>
                            <Typography variant='h5' className='font-bold'>
                                {t('contacts')}
                            </Typography>
                        </div>
                    }
                />
                <div className='flex justify-between flex-col md:flex-row items-start md:items-center p-6 border-bs gap-4'>
                    <CustomTextField
                        select
                        value={table.getState().pagination.pageSize}
                        onChange={e => table.setPageSize(Number(e.target.value))}
                    >
                        {[10, 25, 50].map(size => (
                            <MenuItem key={size} value={size}>
                                {size}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <DebouncedInput
                            value={globalFilter}
                            onChange={v => setGlobalFilter(String(v))}
                            placeholder={t('search')}
                            className='is-full sm:is-[400px]'
                        />
                    </div>
                </div>

                <div className='overflow-x-auto'>
                    <table className={tableStyles.table}>
                        <thead className='bg-[var(--mui-palette-customColors-tableHeaderBg)]'>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className='plb-3'>
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={classnames({
                                                        'flex items-center gap-1 font-semibold': true,
                                                        'cursor-pointer select-none': header.column.getCanSort()
                                                    })}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {header.column.getCanSort() && (
                                                        header.column.getIsSorted() ? (
                                                            header.column.getIsSorted() === 'asc' ? (
                                                                <i className='tabler-chevron-up text-xl text-primary' />
                                                            ) : (
                                                                <i className='tabler-chevron-down text-xl text-primary' />
                                                            )
                                                        ) : (
                                                            <i className='tabler-arrows-sort text-lg opacity-40' />
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className='text-center'>
                                        {t('no_data_available')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <TablePaginationComponent table={table} pagination={pagination} />
                <DeleteConfirmationDialog
                    open={deleteOpen}
                    handleClose={() => setDeleteOpen(false)}
                    onConfirm={async () => {
                        setLoading(true)
                        const result = await withAuthCheck(() => deleteRecord({ module: 'contact', id: selectedToDelete }))
                        if (result?.status) {
                            refreshContacts()
                            toast.success(t(result.message))
                        } else {
                            toast.error(t(result?.message) || 'Failed to delete record')
                        }
                        setLoading(false)
                        setDeleteOpen(false)
                    }}
                    title={t('delete_confirmation_title')}
                    message={t('delete_confirmation_message')}
                />
            </Card>
        </>
    )
}

export default ContactListTable
