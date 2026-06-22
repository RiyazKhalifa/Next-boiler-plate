'use client'

import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Confirm } from 'notiflix/build/notiflix-confirm-aio'
import { withAuthCheck } from '@/utils/authWrapper'
import { Card, CardHeader, Button, Typography, IconButton, MenuItem, Slide, Tooltip } from '@mui/material'
import Switch from '@mui/material/Switch'
import { useRouter } from 'next/navigation'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, getSortedRowModel } from '@tanstack/react-table'
import classnames from 'classnames'
import AddUserForm from './AddUserDrawer'
import TablePaginationComponent from '@components/TablePaginationComponent'
import DebouncedInput from '@/components/DebouncedInput'
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'
import NextImage from '@/components/NextImage'
import { getInitials } from '@/utils/getInitials'
import tableStyles from '@core/styles/table.module.css'
import primaryColorConfig from '@/configs/primaryColorConfig'
import Can from '@/libs/can'
import toast from 'react-hot-toast'
import { updateStatus, deleteRecord } from '@/app/server/actions/common'
import { useSelector } from 'react-redux'
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog'

const columnHelper = createColumnHelper()

const UserListTable = ({
    tableData,
    pagination,
    setLoading,
    fetchUsers,
    refreshUsers,
    addedUser,
    editUserData,
    updateRecords,
    userRoles
}) => {
    const { t } = useTranslation()
    const [addUserOpen, setAddUserOpen] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [rowSelection, setRowSelection] = useState({})
    const [data, setData] = useState(tableData || [])
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState([])
    const [userRole, setUserRoles] = useState([])
    const [tablePagination, setTablePagination] = useState({
        pageIndex: (pagination.page || 1) - 1,
        pageSize: pagination.limit || 10
    })
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [selectedToDelete, setSelectedToDelete] = useState(null)

    const router = useRouter()

    useEffect(() => {
        setTablePagination({ pageIndex: (pagination.page || 1) - 1, pageSize: pagination.limit || 10 })
    }, [pagination.page, pagination.limit])

    useEffect(() => {
        const sortBy = sorting.length > 0 ? sorting[0].id : ''
        const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : ''
        fetchUsers(globalFilter, 1, tablePagination.pageSize, sortBy, sortOrder)
    }, [globalFilter, sorting])

    const handleOpenAddUser = () => {
        setEditingUser(null)
        setAddUserOpen(true)
    }

    const handleOpenEditUser = user => {
        setEditingUser(user)
        setAddUserOpen(true)
    }

    const handleCloseForm = () => {
        setAddUserOpen(false)
        setEditingUser(null)
    }

    useEffect(() => {
        async function fetchRoles() {
            const result = await userRoles()
            if (result.status) {
                setUserRoles(result.data.roles)
            } else {
                toast.error(t('validation.something_went_wrong'))
            }
        }
        fetchRoles()
    }, [])

    const getAvatar = ({ avatar, fullName }) =>
        avatar ? (
            <NextImage
                src={avatar}
                alt={fullName}
                width={34}
                height={34}
                className='rounded-full'
            />
        ) : (
            <CustomAvatar size={34}>{getInitials(fullName)}</CustomAvatar>
        )
    const userData = useSelector(state => state.user)


    const columns = useMemo(
        () => [
            columnHelper.accessor('fullName', {
                header: t('user'),
                cell: ({ row }) => (
                    <div className='flex items-center gap-4'>
                        {getAvatar(row.original)}
                        <div className='flex flex-col'>
                            <Typography color='text.primary' className='font-medium'>
                                {row.original.fullName}
                            </Typography>
                            <Typography variant='body2'>{row.original.email}</Typography>
                        </div>
                    </div>
                )
            }),
            columnHelper.accessor('role', {
                header: t('role'),
                cell: ({ row }) => (
                    <Typography className='capitalize' color='text.primary'>
                        {row.original.role}
                    </Typography>
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
                                            module: 'user',
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
                        />
                    )
                },
                enableSorting: false
            }),
            columnHelper.accessor('action', {
                header: t('action'),
                cell: ({ row }) => (
                    <div variant='contained' className='flex items-center'>
                        <Can permission='user.update'>
                            <Tooltip title={t('edit')}>
                                <IconButton
                                    onClick={async () => {
                                        setLoading(true)
                                        const result = await editUserData(row.original.id)
                                        if (result?.status) {
                                            setEditingUser(result.data)
                                            setAddUserOpen(true)
                                            window.scrollTo({ top: 0, behavior: 'smooth' })
                                        } else {
                                            toast.error(result?.message)
                                        }
                                        setLoading(false)
                                    }}
                                >
                                    <i className='tabler-edit text-[22px] text-textSecondary' />
                                </IconButton>
                            </Tooltip>
                        </Can>
                        <Can permission='user.view'>
                            <Tooltip title={t('view')}>
                                <IconButton
                                    onClick={() => router.push(`/users/view/${row.original.id}`)}
                                >
                                    <i className='tabler-eye text-[22px] text-textSecondary' />
                                </IconButton>
                            </Tooltip>
                        </Can>
                        <Can permission='user.delete'>
                            {row.original.id !== 1 && userData.id !== row.original.id && (
                                <Tooltip title={t('delete')}>
                                    <IconButton
                                        onClick={() => {
                                            setSelectedToDelete(row.original.id)
                                            setDeleteOpen(true)
                                        }}
                                    >
                                        <i className='tabler-trash text-[22px] text-textSecondary' />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Can>
                    </div>
                ),
                enableSorting: false
            })
        ],
        [data]
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
            fetchUsers(globalFilter, tablePagination.pageIndex + 1, tablePagination.pageSize, sortBy, sortOrder)
        },
        onPaginationChange: updater => {
            const newPagination = typeof updater === 'function' ? updater(tablePagination) : updater
            setTablePagination(newPagination)
            const sortBy = sorting.length > 0 ? sorting[0].id : ''
            const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : ''
            fetchUsers(globalFilter, newPagination.pageIndex + 1, newPagination.pageSize, sortBy, sortOrder)
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
            <Slide direction='down' in={addUserOpen} mountOnEnter unmountOnExit>
                <div>
                    <AddUserForm
                        open={addUserOpen}
                        handleClose={() => {
                            setAddUserOpen(false)
                            setEditingUser(null)
                        }}
                        addedUser={addedUser}
                        editedUser={editingUser}
                        updateUser={updateRecords}
                        userRoles={userRole}
                        refreshUsers={refreshUsers}
                        setLoading={setLoading}
                    />
                </div>
            </Slide>
            <Card>
                <CardHeader
                    className='pbe-4'
                    title={
                        <div className='flex items-center gap-3'>
                            <CustomAvatar color='primary' skin='light' variant='rounded' size={34}>
                                <i className='tabler-users text-[22px]' />
                            </CustomAvatar>
                            <Typography variant='h5' className='font-bold'>
                                {t('users')}
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
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                    </CustomTextField>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                        <DebouncedInput
                            value={globalFilter}
                            onChange={value => setGlobalFilter(String(value))}
                            placeholder={t('search_by_name_and_email')}
                            className='is-full sm:is-[320px]'
                        />
                        <Can permission='user.create'>
                            <Button
                                variant='contained'
                                startIcon={<i className='tabler-plus' />}
                                onClick={() => {
                                    setEditingUser(null)
                                    setAddUserOpen(true)
                                }}
                            >
                                {t('add_new_user')}
                            </Button>
                        </Can>
                    </div>
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
                                                    className={classnames({
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
                                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
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
                <DeleteConfirmationDialog
                    open={deleteOpen}
                    handleClose={() => setDeleteOpen(false)}
                    onConfirm={async () => {
                        setLoading(true)
                        const result = await withAuthCheck(() =>
                            deleteRecord({
                                module: 'user',
                                id: selectedToDelete
                            })
                        )
                        if (result?.status) {
                            refreshUsers()
                            toast.success(result.message)
                        } else {
                            toast.error(result?.message)
                        }
                        setLoading(false)
                    }}
                    title={t('delete_confirmation_title')}
                    message={t('delete_confirmation_message')}
                />
            </Card>
        </>
    )
}

export default UserListTable
