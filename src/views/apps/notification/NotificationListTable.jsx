'use client'

import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { withAuthCheck } from '@/utils/authWrapper'
import { Card, CardHeader, Button, Typography, IconButton, MenuItem, Tooltip } from '@mui/material'
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog'
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
import TableSkeleton from '@/components/TableSkeleton'
import CustomAvatar from '@core/components/mui/Avatar'
import CustomChip from '@core/components/mui/Chip'
import tableStyles from '@core/styles/table.module.css'
import Can from '@/libs/can'
import { getNotifications } from '@/app/server/actions/notification'
import { formatDate } from '@/libs/dateFormat'

const columnHelper = createColumnHelper()

const NotificationListTable = () => {
    const { t } = useTranslation()

    // States
    const [rowSelection, setRowSelection] = useState({})
    const [data, setData] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [loading, setLoading] = useState(false)
    const [fetched, setFetched] = useState(false)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    })

    const fetchNotifications = async (search = globalFilter, page = pagination.page, limit = pagination.limit) => {
        setLoading(true)
        try {
            const res = await withAuthCheck(() => getNotifications({ search, page, limit }))
            if (res?.status) {
                setData(res.data.notifications || [])
                setPagination({
                    page: res.data.current_page,
                    limit: limit,
                    total: res.data.total,
                    totalPages: res.data.pages
                })
            } else {
                toast.error(res?.message || 'Error fetching notifications')
            }
        } catch (error) {
            toast.error('Failed to load notifications')
        } finally {
            setLoading(false)
            if (!fetched) setFetched(true)
        }
    }

    useEffect(() => {
        fetchNotifications(globalFilter, 1)
    }, [globalFilter])

    const columns = useMemo(
        () => [
            columnHelper.accessor('id', {
                header: 'ID',
                cell: ({ row }) => <Typography color='text.primary'>#{row.original.id}</Typography>
            }),
            columnHelper.accessor('customer', {
                header: t('customer'),
                cell: ({ row }) => (
                    <div className='flex flex-col'>
                        <Typography color='text.primary' className='font-medium'>
                            {row.original.customer ? row.original.customer.name : t('all_customers')}
                        </Typography>
                        {row.original.customer && (
                            <Typography variant='body2' className='text-slate-500'>
                                {row.original.customer.email}
                            </Typography>
                        )}
                    </div>
                )
            }),
            columnHelper.accessor('type', {
                header: t('type'),
                cell: ({ row }) => (
                    <CustomChip
                        round='true'
                        size='small'
                        label={row.original.type}
                        color={row.original.type === 'broadcast' ? 'primary' : 'secondary'}
                        variant='tonal'
                        className='capitalize'
                    />
                )
            }),
            columnHelper.accessor('title', {
                header: t('title'),
                cell: ({ row }) => (
                    <Typography color='text.primary' className='font-medium'>
                        {row.original.title}
                    </Typography>
                )
            }),
            columnHelper.accessor('message', {
                header: t('message'),
                cell: ({ row }) => (
                    <Tooltip title={row.original.message}>
                        <Typography className='truncate max-w-[300px]' color='text.secondary'>
                            {row.original.message}
                        </Typography>
                    </Tooltip>
                )
            }),
            columnHelper.accessor('created_at', {
                header: t('created_at'),
                cell: ({ row }) => <Typography color='text.secondary'>{formatDate(row.original.created_at)}</Typography>
            })
        ],
        [t]
    )

    const table = useReactTable({
        data,
        columns,
        state: { rowSelection, globalFilter, pagination: { pageIndex: pagination.page - 1, pageSize: pagination.limit } },
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: updater => {
            const nextState = typeof updater === 'function' ? updater({ pageIndex: pagination.page - 1, pageSize: pagination.limit }) : updater
            fetchNotifications(globalFilter, nextState.pageIndex + 1, nextState.pageSize)
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        pageCount: pagination.totalPages || 1
    })

    if (loading && !fetched) {
        return <TableSkeleton columns={6} rows={10} title={t('notifications')} />
    }

    return (
        <>
            <Card className='overflow-hidden'>
                <CardHeader
                    title={
                        <div className='flex items-center gap-3'>
                            <CustomAvatar color='primary' skin='light' variant='rounded' size={34}>
                                <i className='tabler-bell text-[22px]' />
                            </CustomAvatar>
                            <Typography variant='h5' className='font-bold'>
                                {t('notifications')}
                            </Typography>
                        </div>
                    }
                />
                <div className='flex justify-between flex-col md:flex-row items-start md:items-center p-6 border-bs gap-4'>
                    <CustomTextField
                        select
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}
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
                            placeholder={t('search_by_name_and_arabic_name')}
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
                                                <div className='font-semibold'>
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length} className='text-center'>
                                        <i className='tabler-loader animate-spin text-primary' /> {t('loading')}
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className='text-center text-textSecondary'>
                                        {t('no_data_available')}
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <TablePaginationComponent table={table} pagination={{
                    page: pagination.page,
                    limit: pagination.limit,
                    totalRecords: pagination.total,
                    totalPages: pagination.totalPages
                }} />
            </Card>
        </>
    )
}

export default NotificationListTable
