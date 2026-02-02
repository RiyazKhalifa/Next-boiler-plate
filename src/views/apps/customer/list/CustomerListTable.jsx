'use client'

import { useEffect, useState, useMemo } from 'react'
import Switch from '@mui/material/Switch'
import { useTranslation } from 'react-i18next'
import { updateStatus } from '@/app/server/actions/common'
import { withAuthCheck } from '@/utils/authWrapper'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, Typography, IconButton, MenuItem } from '@mui/material'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, getSortedRowModel } from '@tanstack/react-table'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import DebouncedInput from '@/components/DebouncedInput'
import CustomTextField from '@core/components/mui/TextField'
import tableStyles from '@core/styles/table.module.css'
import Can from '@/libs/can'
import toast from 'react-hot-toast'
import CustomAvatar from '@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import classNames from 'classnames'
import Link from 'next/link'

const columnHelper = createColumnHelper()

const CustomerListTable = ({ tableData, pagination, setLoading, fetchCustomers, refreshCustomers }) => {
    const { t } = useTranslation()
    const [rowSelection, setRowSelection] = useState({})
    const [data, setData] = useState(tableData || [])
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState([])
    const [tablePagination, setTablePagination] = useState({
        pageIndex: (pagination.page || 1) - 1,
        pageSize: pagination.limit || 10
    })

    const router = useRouter()

    useEffect(() => {
        setTablePagination({ pageIndex: (pagination.page || 1) - 1, pageSize: pagination.limit || 10 })
    }, [pagination.page, pagination.limit])

    useEffect(() => {
        const sortBy = sorting.length > 0 ? sorting[0].id : ''
        const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : ''
        fetchCustomers(globalFilter, 1, tablePagination.pageSize, sortBy, sortOrder)
    }, [globalFilter, sorting])

    const columns = useMemo(
        () => [
            columnHelper.accessor('name', {
                header: t('name'),
                cell: ({ row }) => (
                    <div className='flex items-center gap-3'>
                        <CustomAvatar
                            src={row.original.profile_image}
                            skin='light'
                            color='primary'
                            size={34}
                        >
                            {getInitials(row.original.name || 'John Doe').toUpperCase()}
                        </CustomAvatar>
                        <div className='flex flex-col'>
                            <Typography color='text.primary' className='font-medium capitalize'>
                                <Link
                                    href={`/customers/view/${row.original.id}`}
                                    className='hover:text-primary transition-colors'
                                >
                                    {row.original.name}
                                </Link>
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>
                                {row.original.email}
                            </Typography>
                        </div>
                    </div>
                )
            }),
            columnHelper.accessor('status', {
                header: t('status'),
                cell: ({ row }) => {
                    const isActive = row.original.status?.toLowerCase() === 'active'

                    return (
                        <Switch
                            checked={isActive}
                            onChange={async e => {
                                setLoading(true)
                                const prevStatus = row.original.status
                                const newStatus = e.target.checked ? 'active' : 'inactive'
                                try {
                                    const res = await withAuthCheck(() =>
                                        updateStatus({
                                            module: 'customer',
                                            id: row.original.id,
                                            status: newStatus
                                        })
                                    )
                                    if (!res) return

                                    const response = Array.isArray(res) ? res[0] : res

                                    if (res.status == true) {
                                        row.original.status = newStatus
                                        setData([...data])
                                        toast.success(response.message, { duration: 3000 })
                                    } else {
                                        row.original.status = prevStatus
                                        setData([...data])
                                        toast.error(response.message, { duration: 3000 })
                                    }
                                } catch (err) {
                                    row.original.status = prevStatus
                                    setData([...data])
                                    toast.error(err.message || 'Error updating status', { duration: 3000 })
                                } finally {
                                    setLoading(false)
                                }
                            }}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#fff',
                                    transform: 'translateX(20px)'
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: 'green',
                                    opacity: 1
                                },
                                '& .MuiSwitch-switchBase:not(.Mui-checked)': {
                                    color: '#fff'
                                },
                                '& .MuiSwitch-switchBase:not(.Mui-checked) + .MuiSwitch-track': {
                                    backgroundColor: 'red',
                                    opacity: 1
                                }
                            }}
                        />
                    )
                },
                enableSorting: false
            }),
            columnHelper.accessor('action', {
                header: t('action'),
                cell: ({ row }) => (
                    <Can permission='customer.view'>
                        <IconButton
                            className='transition-all duration-200'
                            onClick={() => {
                                setLoading(true)
                                setTimeout(() => {
                                    router.push(`/customers/view/${row.original.id}`)
                                    setLoading(false)
                                }, 300)
                            }}
                        >
                            <i className='tabler-eye text-[22px] text-blue-600' />
                        </IconButton>
                    </Can>
                ),
                enableSorting: false
            })
        ],
        [t]
    )

    const table = useReactTable({
        data: tableData,
        columns,
        state: { rowSelection, globalFilter, pagination: tablePagination, sorting },
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: updater => {
            const newSorting = typeof updater === 'function' ? updater(sorting) : updater
            setSorting(newSorting)
            const sortBy = newSorting.length > 0 ? newSorting[0].id : ''
            const sortOrder = newSorting.length > 0 ? (newSorting[0].desc ? 'desc' : 'asc') : ''
            fetchCustomers(globalFilter, tablePagination.pageIndex + 1, tablePagination.pageSize, sortBy, sortOrder)
        },
        onPaginationChange: updater => {
            const newPagination = typeof updater === 'function' ? updater(tablePagination) : updater
            setTablePagination(newPagination)
            const sortBy = sorting.length > 0 ? sorting[0].id : ''
            const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : ''
            fetchCustomers(globalFilter, newPagination.pageIndex + 1, newPagination.pageSize, sortBy, sortOrder)
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        pageCount: pagination.totalPages || 1,
        enableRowSelection: true
    })

    return (
        <Card>
            <CardHeader title={t('customers')} className='pbe-4' />

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

                <DebouncedInput
                    value={globalFilter}
                    onChange={v => setGlobalFilter(String(v))}
                    placeholder={t('search_by_name_and_email')}
                    className='is-full sm:is-[320px]'
                />
            </div>

            <div className='overflow-x-auto'>
                <table className={tableStyles.table}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={classNames({
                                                    'flex items-center gap-1 font-semibold': true,
                                                    'cursor-pointer select-none': header.column.getCanSort()
                                                })}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanSort() && (
                                                    header.column.getIsSorted() ? (
                                                        header.column.getIsSorted() === 'asc' ?
                                                            <i className='tabler-chevron-up text-xl text-primary' /> :
                                                            <i className='tabler-chevron-down text-xl text-primary' />
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
                        {table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
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
            <TablePaginationComponent table={table} pagination={pagination} />
        </Card>
    )
}

export default CustomerListTable
