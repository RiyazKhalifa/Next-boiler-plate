'use client'

import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Confirm } from 'notiflix/build/notiflix-confirm-aio'
import { withAuthCheck } from '@/utils/authWrapper'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Slide from '@mui/material/Slide'
import Switch from '@mui/material/Switch'
import CardHeader from '@mui/material/CardHeader'
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
                    <div variant='contained' className='flex items-center'>
                        <Can permission='user.update'>
                            <IconButton
                                onClick={async () => {
                                    setLoading(true)
                                    const result = await editUserData(row.original.id)
                                    if (result.status) {
                                        if (result.data.profile_image) {
                                            result.data.profile_image = `${result.data.profile_image}?v=${new Date().getTime()}`
                                        }
                                        setEditingUser(result)
                                        setAddUserOpen(true)
                                    } else {
                                        toast.error('Failed to load user data: ' + result.message)
                                    }
                                    setLoading(false)
                                }}
                            >
                                <i className='tabler-edit text-[22px] text-slate-600' />
                            </IconButton>
                        </Can>
                        <Can permission='user.view'>
                            <IconButton
                                onClick={() => {
                                    setLoading(true)
                                    setTimeout(() => {
                                        router.push(`/users/view/${row.original.id}`)
                                        setLoading(false)
                                    }, 300)
                                }}
                            >
                                <i className='tabler-eye text-[22px] text-blue-600' />
                            </IconButton>
                        </Can>
                        <Can permission='user.delete'>
                            {row.original.id !== 1 && userData.id !== row.original.id && (
                                <IconButton
                                    onClick={() => {
                                        const primaryColor = primaryColorConfig.find(c => c.name === 'primary')?.dark || 'var(--mui-palette-primary-main)'

                                        Confirm.show(
                                            t('delete_confirmation'),
                                            t('delete_confirmation_message_user'),
                                            t('yes'),
                                            t('no'),
                                            async () => {
                                                setLoading(true)
                                                const result = await withAuthCheck(() =>
                                                    deleteRecord({
                                                        module: 'user',
                                                        id: row.original.id
                                                    })
                                                )
                                                if (!result) return
                                                if (result.status) {
                                                    refreshUsers()
                                                    toast.success(result.message)
                                                } else {
                                                    toast.error(result.message)
                                                }
                                                setLoading(false)
                                            },
                                            () => { },
                                            {
                                                titleColor: primaryColor,
                                                okButtonBackground: primaryColor,
                                                cancelButtonBackground: '#ccc'
                                            }
                                        )
                                    }}
                                >
                                    <i className='tabler-trash text-[22px] text-rose-600' />
                                </IconButton>
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
                <CardHeader title={t('users')} className='pbe-4' />
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
            </Card>
        </>
    )
}

export default UserListTable
