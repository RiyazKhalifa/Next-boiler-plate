'use client'

import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { Notify } from 'notiflix/build/notiflix-notify-aio'
import { Card, CardHeader, Typography, IconButton, MenuItem } from '@mui/material'
import {
    createColumnHelper,
    flexRender,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel
} from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import DebouncedInput from '@/components/DebouncedInput'
import CustomTextField from '@core/components/mui/TextField'
import AddCmsDrawer from './AddCmsDrawer'
import tableStyles from '@core/styles/table.module.css'
import Can from '@/libs/can'

const columnHelper = createColumnHelper()

const CmsListTable = ({ tableData, pagination, setLoading, fetchCms, refreshCms, viewCmsByIdData, updateCms }) => {
    const { t } = useTranslation()
    const router = useRouter()
    const [data, setData] = useState(tableData || [])
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState([])
    const [editingCms, setEditingCms] = useState(null)
    const [tablePagination, setTablePagination] = useState({
        pageIndex: (pagination.page || 1) - 1,
        pageSize: pagination.limit || 10
    })

    useEffect(() => {
        setTablePagination({ pageIndex: (pagination.page || 1) - 1, pageSize: pagination.limit || 10 })
    }, [pagination.page, pagination.limit])

    useEffect(() => {
        const sortBy = sorting.length > 0 ? sorting[0].id : ''
        const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : ''

        const mapping = {
            'title': 'title',
            'created_at': 'createdAt'
        }
        const backendSortBy = mapping[sortBy] || sortBy

        fetchCms(globalFilter, 1, tablePagination.pageSize, backendSortBy, sortOrder)
    }, [globalFilter, sorting])

    useEffect(() => {
        setData(tableData || [])
    }, [tableData])

    const handleOpenEditCms = async id => {
        setLoading(true)
        const result = await viewCmsByIdData(id)
        if (result?.status) {
            setEditingCms(result.data)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
            Notify.failure(t(result?.message) || t('validation.failed_to_fetch_role_details'))
        }
        setLoading(false)
    }

    const columns = useMemo(
        () => [
            columnHelper.accessor('title', {
                header: t('name'),
                cell: ({ row }) => (
                    <div>
                        <Typography color='text.primary' className='font-medium'>
                            {row.original.title || ''}
                        </Typography>
                        <Typography color='text.secondary' variant='body2'>
                            {row.original.title_ar || ''}
                        </Typography>
                    </div>
                )
            }),
            columnHelper.accessor('created_at', {
                header: t('created_at'),
                cell: ({ row }) => {
                    const date = new Date(row.original.created_at)
                    const year = date.getFullYear()
                    const month = String(date.getMonth() + 1).padStart(2, '0')
                    const day = String(date.getDate()).padStart(2, '0')
                    let hours = date.getHours()
                    const minutes = String(date.getMinutes()).padStart(2, '0')
                    const ampm = hours >= 12 ? 'PM' : 'AM'
                    hours = hours % 12
                    hours = hours ? hours : 12
                    const formattedDate = `${year}-${month}-${day} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`

                    return <Typography color='text.secondary'>{formattedDate}</Typography>
                }
            }),
            columnHelper.display({
                id: 'actions',
                header: t('action'),
                cell: ({ row }) => (
                    <div className='flex items-center gap-2'>
                        <Can permission='cms.update'>
                            <IconButton
                                sx={{ transition: 'all 0.2s', '&:hover': { backgroundColor: 'action.hover', '& i': { opacity: 0.7 } } }}
                                onClick={() => handleOpenEditCms(row.original.id)}
                            >
                                <i className='tabler-edit text-[22px] text-slate-600' />
                            </IconButton>
                        </Can>
                        <Can permission='cms.view'>
                            <IconButton
                                sx={{ transition: 'all 0.2s', '&:hover': { backgroundColor: 'action.hover', '& i': { opacity: 0.7 } } }}
                                onClick={() => {
                                    setLoading(true)
                                    setTimeout(() => {
                                        router.push(`/cms/view/${row.original.id}`)
                                        setLoading(false)
                                    }, 300)
                                }}
                            >
                                <i className='tabler-eye text-[22px] text-blue-600' />
                            </IconButton>
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
        state: { rowSelection, globalFilter, pagination: tablePagination, sorting },
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onPaginationChange: updater => {
            const newPagination = typeof updater === 'function' ? updater(tablePagination) : updater
            setTablePagination(newPagination)
            const sortBy = sorting.length > 0 ? sorting[0].id : ''
            const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : ''

            const mapping = {
                'title': 'title',
                'created_at': 'createdAt'
            }
            const backendSortBy = mapping[sortBy] || sortBy

            fetchCms(globalFilter, newPagination.pageIndex + 1, newPagination.pageSize, backendSortBy, sortOrder)
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
        <>
            {editingCms && (
                <AddCmsDrawer
                    cmsData={data}
                    open={!!editingCms}
                    handleClose={() => setEditingCms(null)}
                    editedCms={editingCms}
                    updateCms={updateCms}
                    fetchCms={fetchCms}
                    refreshCms={refreshCms}
                    setLoading={setLoading}
                />
            )}

            <Card className='overflow-hidden'>
                <CardHeader title={t('cms')} className='pbe-4' />
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
                        placeholder={t('search_by_name_and_arabic_name')}
                        className='is-full sm:is-[400px]'
                    />
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
                                                    className={classnames('flex items-center gap-1 font-semibold', {
                                                        'cursor-pointer select-none': header.column.getCanSort()
                                                    })}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
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
        </>
    )
}

export default CmsListTable
