'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Confirm } from 'notiflix/build/notiflix-confirm-aio'
import { updateStatus, deleteRecord } from '@/app/server/actions/common'
import toast from 'react-hot-toast'
import { withAuthCheck } from '@/utils/authWrapper'
import { Card, CardHeader, Button, Typography, IconButton, MenuItem, Slide } from '@mui/material'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, getSortedRowModel } from '@tanstack/react-table'
import classnames from 'classnames'
import AddRoleForm from './AddRoleDrawer'
import TablePaginationComponent from '@components/TablePaginationComponent'
import DebouncedInput from '@components/DebouncedInput'
import CustomTextField from '@core/components/mui/TextField'
import tableStyles from '@core/styles/table.module.css'
import primaryColorConfig from '@/configs/primaryColorConfig'
import Can from '@/libs/can'
import Switch from '@mui/material/Switch'

const columnHelper = createColumnHelper()

const RoleListTable = ({
	tableData,
	pagination,
	setLoading,
	fetchRoles,
	refreshRoles,
	permissions,
	addRole,
	editRoleData,
	updateRole
}) => {
	const primary1Color = primaryColorConfig.find(c => c.name === 'primary')?.dark || 'var(--mui-palette-primary-main)'
	const { t } = useTranslation()

	const [addRoleOpen, setAddRoleOpen] = useState(false)
	const [editingRole, setEditingRole] = useState(null)
	const [rowSelection, setRowSelection] = useState({})
	const [data, setData] = useState(tableData || [])
	const [globalFilter, setGlobalFilter] = useState('')
	const [sorting, setSorting] = useState([])
	const [tablePagination, setTablePagination] = useState({
		pageIndex: (pagination.page || 1) - 1,
		pageSize: pagination.limit || 10
	})

	const filteredTableData = useMemo(() => {
		return (tableData || []).filter(role => role.id !== 1)
	}, [tableData])

	useEffect(() => {
		setTablePagination({ pageIndex: (pagination.page || 1) - 1, pageSize: pagination.limit || 10 })
	}, [pagination.page, pagination.limit])

	useEffect(() => {
		const sortBy = sorting.length > 0 ? sorting[0].id : ''
		const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : ''
		fetchRoles(globalFilter, 1, tablePagination.pageSize, sortBy, sortOrder)
	}, [globalFilter, sorting])

	const handleOpenAddRole = () => {
		setLoading(true)
		setTimeout(() => {
			setEditingRole(null)
			setAddRoleOpen(true)
			window.scrollTo({ top: 0, behavior: 'smooth' })
			setLoading(false)
		}, 300)
	}

	const handleOpenEditRole = async id => {
		setLoading(true)
		const result = await editRoleData(id)
		if (result?.status) {
			setEditingRole(result.data)
			setAddRoleOpen(true)
			window.scrollTo({ top: 0, behavior: 'smooth' })
		} else {
			toast.error(result?.message)
		}
		setLoading(false)
	}

	const handleDeleteRole = id => {
		Confirm.show(
			t('delete_confirmation'),
			t('delete_confirmation_message'),
			t('yes'),
			t('no'),
			async () => {
				setLoading(true)
				const result = await withAuthCheck(() =>
					deleteRecord({
						module: 'role',
						id: id
					})
				)
				if (!result) return
				if (result?.status) {
					refreshRoles()
					toast.success(result.message)
				} else {
					toast.error(result.message)
				}
				setLoading(false)
			},
			() => { },
			{ titleColor: primary1Color, okButtonBackground: primary1Color, cancelButtonBackground: '#ccc' }
		)
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
			columnHelper.accessor('name_ar', {
				header: t('arabic_name'),
				cell: ({ row }) => (
					<Typography color='text.primary' className='font-medium'>
						{row.original.name_ar}
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
											module: 'role',
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
					<div className='flex items-center gap-2'>
						<Can permission='role.update'>
							<IconButton
								onClick={() => handleOpenEditRole(row.original.id)}
								className='transition-all duration-200'
							>
								<i className='tabler-edit text-[22px] text-slate-600' />
							</IconButton>
						</Can>
						<Can permission='role.view'>
							<IconButton
								component={Link}
								href={`/roles/view/${row.original.id}`}
								className='transition-all duration-200'
							>
								<i className='tabler-eye text-[22px] text-blue-600' />
							</IconButton>
						</Can>
						<Can permission='role.delete'>
							<IconButton
								onClick={() => handleDeleteRole(row.original.id)}
								className='transition-all duration-200'
							>
								<i className='tabler-trash text-[22px] text-rose-600' />
							</IconButton>
						</Can>
					</div>
				),
				enableSorting: false
			})
		],
		[]
	)

	const table = useReactTable({
		data: filteredTableData,
		columns,
		state: { rowSelection, globalFilter, pagination: tablePagination, sorting },
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		onSortingChange: updater => {
			const newSorting = typeof updater === 'function' ? updater(sorting) : updater
			setSorting(newSorting)
			const sortBy = newSorting.length > 0 ? newSorting[0].id : ''
			const sortOrder = newSorting.length > 0 ? (newSorting[0].desc ? 'desc' : 'asc') : ''
			fetchRoles(globalFilter, tablePagination.pageIndex + 1, tablePagination.pageSize, sortBy, sortOrder)
		},
		onPaginationChange: updater => {
			const newPagination = typeof updater === 'function' ? updater(tablePagination) : updater
			setTablePagination(newPagination)
			const sortBy = sorting.length > 0 ? sorting[0].id : ''
			const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : ''
			fetchRoles(globalFilter, newPagination.pageIndex + 1, newPagination.pageSize, sortBy, sortOrder)
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
			<Slide direction='down' in={addRoleOpen} mountOnEnter unmountOnExit>
				<div>
					<AddRoleForm
						open={addRoleOpen}
						handleClose={() => {
							setAddRoleOpen(false)
							setEditingRole(null)
						}}
						addRole={addRole}
						editedRole={editingRole}
						updateRole={updateRole}
						permissions={permissions}
						refreshRoles={refreshRoles}
						setLoading={setLoading}
					/>
				</div>
			</Slide>
			<Card>
				<CardHeader title={t('roles')} className='pbe-4' />
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
							placeholder={t('search_by_role_name_and_arabic_name')}
							className='is-full sm:is-[320px]'
						/>
						<Can permission='role.create'>
							<Button
								variant='contained'
								startIcon={<i className='tabler-plus' />}
								onClick={handleOpenAddRole}
							>
								{t('add_new_role')}
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

export default RoleListTable
