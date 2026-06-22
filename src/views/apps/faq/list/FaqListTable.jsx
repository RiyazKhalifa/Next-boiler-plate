'use client'

import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import Switch from '@mui/material/Switch'
import { updateStatus, deleteRecord, updateSequence } from '@/app/server/actions/common'
import { withAuthCheck } from '@/utils/authWrapper'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, Button, Typography, IconButton, MenuItem, Tooltip } from '@mui/material'
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel
} from '@tanstack/react-table'
import classnames from 'classnames'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import AddFaqForm from './AddFaqDrawer'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import DebouncedInput from '@/components/DebouncedInput'
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'
import tableStyles from '@core/styles/table.module.css'
import primaryColorConfig from '@/configs/primaryColorConfig'
import Can from '@/libs/can'

const columnHelper = createColumnHelper()

const Row = ({ row }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: String(row.original.id)
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <tr
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={classnames({ selected: row.getIsSelected(), 'opacity-50': isDragging })}
        >
            {row.getVisibleCells().map((cell, index) => (
                <td
                    key={cell.id}
                    {...(index === 0 ? listeners : {})}
                    style={index === 0 ? { cursor: isDragging ? 'grabbing' : 'grab' } : {}}
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </tr>
    )
}

const FaqListTable = ({
    tableData,
    pagination,
    setLoading,
    fetchFaqs,
    refreshFaqs,
    addFaq,
    editFaqData,
    updateFaq
}) => {
    const primary1Color = primaryColorConfig.find(c => c.name === 'primary-1')?.dark || '#000'
    const { t } = useTranslation()
    const router = useRouter()

    const [addFaqOpen, setAddFaqOpen] = useState(false)
    const [editingFaq, setEditingFaq] = useState(null)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [selectedToDelete, setSelectedToDelete] = useState(null)
    const [rowSelection, setRowSelection] = useState({})
    const [data, setData] = useState(tableData || [])
    const [globalFilter, setGlobalFilter] = useState('')
    const [tablePagination, setTablePagination] = useState({
        pageIndex: (pagination.page || 1) - 1,
        pageSize: pagination.limit || 10
    })
    const [isUpdatingSequence, setIsUpdatingSequence] = useState(false)

    useEffect(() => {
        setTablePagination({ pageIndex: (pagination.page || 1) - 1, pageSize: pagination.limit || 10 })
    }, [pagination.page, pagination.limit])

    useEffect(() => {
        fetchFaqs(globalFilter, 1, tablePagination.pageSize)
    }, [globalFilter])

    useEffect(() => {
        setData(tableData || [])
    }, [tableData])

    const handleOpenAddFaq = () => {
        setLoading(true)
        setTimeout(() => {
            setEditingFaq(null)
            setAddFaqOpen(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setLoading(false)
        }, 300)
    }

    const handleOpenEditFaq = async id => {
        setLoading(true)
        const result = await editFaqData(id)
        if (result?.status) {
            setEditingFaq(result.data)
            setAddFaqOpen(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
            toast.error(result?.message)
        }
        setLoading(false)
    }

    const handleDeleteFaq = id => {
        setSelectedToDelete(id)
        setDeleteOpen(true)
    }

    const columns = useMemo(
        () => [
            columnHelper.accessor('drag', {
                header: '',
                cell: () => <i className='tabler-grip-vertical text-textSecondary' />,
                enableSorting: false,
                size: 40
            }),
            columnHelper.accessor('question', {
                header: t('name'),
                cell: ({ row }) => (
                    <Typography color='text.primary' className='font-medium'>
                        {row.original.question}
                    </Typography>
                )
            }),
            columnHelper.accessor('question_ar', {
                header: t('arabic_name'),
                cell: ({ row }) => (
                    <Typography color='text.primary' className='font-medium'>
                        {row.original.question_ar}
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
                                            module: 'faq',
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
                    <div className='flex items-center gap-2'>
                        <Can permission='faq.update'>
                            <Tooltip title={t('edit')}>
                                <IconButton
                                    sx={{ transition: 'all 0.2s', '&:hover': { backgroundColor: 'action.hover', '& i': { opacity: 0.7 } } }}
                                    onClick={() => handleOpenEditFaq(row.original.id)}
                                >
                                    <i className='tabler-edit text-[22px] text-textSecondary' />
                                </IconButton>
                            </Tooltip>
                        </Can>
                        <Can permission='faq.view'>
                            <Tooltip title={t('view')}>
                                <IconButton
                                    sx={{ transition: 'all 0.2s', '&:hover': { backgroundColor: 'action.hover', '& i': { opacity: 0.7 } } }}
                                    onClick={() => router.push(`/faqs/view/${row.original.id}`)}
                                >
                                    <i className='tabler-eye text-[22px] text-textSecondary' />
                                </IconButton>
                            </Tooltip>
                        </Can>
                        <Can permission='faq.delete'>
                            <Tooltip title={t('delete')}>
                                <IconButton
                                    sx={{ transition: 'all 0.2s', '&:hover': { backgroundColor: 'action.hover', '& i': { opacity: 0.7 } } }}
                                    onClick={() => handleDeleteFaq(row.original.id)}
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
        state: { rowSelection, globalFilter, pagination: tablePagination },
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: updater => {
            const newPagination = typeof updater === 'function' ? updater(tablePagination) : updater
            setTablePagination(newPagination)
            fetchFaqs(globalFilter, newPagination.pageIndex + 1, newPagination.pageSize)
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualFiltering: true,
        pageCount: pagination.totalPages || 1,
        enableRowSelection: true
    })

    const handleDragEnd = async event => {
        const { active, over } = event
        if (!over || String(active.id) === String(over.id) || isUpdatingSequence) return

        const oldIndex = data.findIndex(item => String(item.id) === String(active.id))
        const newIndex = data.findIndex(item => String(item.id) === String(over.id))

        const newData = arrayMove(data, oldIndex, newIndex)
        setData(newData)
        setIsUpdatingSequence(true)

        try {
            const offset = (pagination.page - 1) * pagination.limit
            const payload = {
                module: 'faq',
                sequences: newData.map((item, index) => ({
                    id: item.id,
                    sequence: offset + index + 1
                }))
            }

            const res = await updateSequence(payload)

            if (res?.status) {
                toast.success(t('messages.sequence_updated_successfully'))
                await refreshFaqs()
            } else {
                toast.error(res?.message || 'Failed to update sequence')
                setData(tableData)
            }
        } catch (error) {
            toast.error(t('errors.error_updating_sequence'))
            setData(tableData)
        } finally {
            setIsUpdatingSequence(false)
        }
    }

    return (
        <>
            <AddFaqForm
                open={addFaqOpen}
                handleClose={() => {
                    setAddFaqOpen(false)
                    setEditingFaq(null)
                }}
                addFaq={addFaq}
                editedFaq={editingFaq}
                updateFaq={updateFaq}
                refreshFaqs={refreshFaqs}
                setLoading={setLoading}
            />
            <Card className='overflow-hidden'>
                <CardHeader
                    className='pbe-4'
                    title={
                        <div className='flex items-center gap-3'>
                            <CustomAvatar color='primary' skin='light' variant='rounded' size={34}>
                                <i className='tabler-question-mark text-[22px]' />
                            </CustomAvatar>
                            <Typography variant='h5' className='font-bold'>
                                {t('faqs')}
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
                            placeholder={t('search_by_name_and_arabic_name')}
                            className='is-full sm:is-[400px]'
                        />
                        <Can permission='faq.create'>
                            <Button
                                variant='contained'
                                startIcon={<i className='tabler-plus' />}
                                onClick={handleOpenAddFaq}
                            >
                                {t('add_new_faq')}
                            </Button>
                        </Can>
                    </div>
                </div>

                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <div className='overflow-x-auto'>
                        <table className={tableStyles.table}>
                            <thead className='bg-[var(--mui-palette-customColors-tableHeaderBg)]'>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th key={header.id} className='plb-3'>
                                                {header.isPlaceholder ? null : (
                                                    <div className='font-semibold'>
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    </div>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                <SortableContext
                                    items={data.map(item => String(item.id))}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {table.getRowModel().rows.map(row => (
                                        <Row key={row.id} row={row} />
                                    ))}
                                </SortableContext>
                            </tbody>
                        </table>
                    </div>
                </DndContext>
                <TablePaginationComponent table={table} pagination={pagination} />
                <DeleteConfirmationDialog
                    open={deleteOpen}
                    handleClose={() => setDeleteOpen(false)}
                    onConfirm={async () => {
                        setLoading(true)
                        const result = await withAuthCheck(() =>
                            deleteRecord({
                                module: 'faq',
                                id: selectedToDelete
                            })
                        )
                        if (result?.status) {
                            refreshFaqs()
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

export default FaqListTable
