'use client'

import { useState, useEffect } from 'react'
import { Grid, Button, Typography, Checkbox, FormGroup, FormControlLabel } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, nonEmpty, pipe } from 'valibot'
import CustomTextField from '@core/components/mui/TextField'
import tableStyles from '@core/styles/table.module.css'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { withAuthCheck } from '@/utils/authWrapper'

const AddRoleForm = ({ open, handleClose, addRole, editedRole, updateRole, permissions, refreshRoles, setLoading }) => {
	const { t } = useTranslation()

	const addRoleSchema = object({
		name: pipe(string(), nonEmpty(t('validation.name_is_required'))),
		name_ar: pipe(string(), nonEmpty(t('validation.arabic_name_is_required')))
	})

	const [selectedPermissions, setSelectedPermissions] = useState([])

	const { control, handleSubmit, reset, setValue, formState } = useForm({
		defaultValues: { name: '', name_ar: '' },
		resolver: valibotResolver(addRoleSchema)
	})
	const { isSubmitting, errors } = formState

	useEffect(() => {
		if (editedRole) {
			setValue('name', editedRole.name || '')
			setValue('name_ar', editedRole.name_ar || '')
			setSelectedPermissions(editedRole.permissions?.map(p => p.id) || [])
		} else {
			reset({ name: '', name_ar: '' })
			setSelectedPermissions([])
		}
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [editedRole, setValue, reset])

	const safePermissions = permissions || []
	const groupedPermissions = safePermissions.reduce((acc, perm) => {
		const [rawGroup] = perm.name.split('.')
		const group = rawGroup
			.split('_')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')
		if (!acc[group]) acc[group] = []
		acc[group].push(perm)

		return acc
	}, {})

	const togglePermission = permId => {
		setSelectedPermissions(prev => (prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]))
	}

	const handleSelectAll = () => {
		if (selectedPermissions.length === safePermissions.length) {
			setSelectedPermissions([])
		} else {
			setSelectedPermissions(safePermissions.map(p => p.id))
		}
	}

	const onSubmit = async data => {
		setLoading(true)
		if (selectedPermissions.length === 0) {
			toast.error(t('validation.please_select_at_least_one_permission'))
			return
		}

		try {
			const payload = { name: data.name, name_ar: data.name_ar, permissionIds: selectedPermissions }
			const res = editedRole
				? await withAuthCheck(() => updateRole(editedRole.id, payload))
				: await withAuthCheck(() => addRole(payload))
			if (!res) return
			if (!res?.status) {
				toast.error(res?.message)
				return
			}

			toast.success(res?.message)
			refreshRoles()
			setTimeout(() => {
				handleClose()
				reset()
			}, 1200)
		} catch (err) {
			toast.error(err)
		} finally {
			setLoading(false)
		}
	}

	const handleReset = () => {
		handleClose()
		reset()
	}

	return (
		<div style={{ display: open ? 'block' : 'none' }} className='p-6 border rounded-md mb-6 bg-white shadow-md'>
			<div className='border-b pb-4 mb-6'>
				<Typography variant='h4'>
					{editedRole ? t('edit_role') : t('add_role')}
				</Typography>
				<Typography>{t('manage_role_information')}</Typography>
			</div>

			<form onSubmit={handleSubmit(onSubmit)}>
				<Grid container spacing={4}>
					<Grid item xs={12} md={6}>
						<Controller
							name='name'
							control={control}
							render={({ field }) => (
								<CustomTextField
									{...field}
									fullWidth
									label={t('name')}
									placeholder={t('name')}
									error={!!errors.name}
									helperText={errors.name?.message}
								/>
							)}
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<Controller
							name='name_ar'
							control={control}
							render={({ field }) => (
								<CustomTextField
									{...field}
									fullWidth
									label={t('arabic_name')}
									placeholder={t('arabic_name')}
									error={!!errors.name_ar}
									helperText={errors.name_ar?.message}
								/>
							)}
						/>
					</Grid>

					<Grid item xs={12}>
						<div className='overflow-x-auto mt-4'>
							<table className={tableStyles.table}>
								<tbody>
									<tr>
										<th className='pis-0'>
											<Typography color='text.primary' className='font-medium whitespace-nowrap'>
												{t('administrator_access')}
											</Typography>
										</th>
										<th className='!text-end pie-0'>
											<FormControlLabel
												control={
													<Checkbox
														onChange={handleSelectAll}
														checked={
															selectedPermissions.length === safePermissions.length &&
															safePermissions.length > 0
														}
													/>
												}
												label={t('select_all')}
											/>
										</th>
									</tr>

									{Object.entries(groupedPermissions).map(([group, items], idx) => (
										<tr key={idx} className='border-be'>
											<td className='pis-0'>
												<Typography className='font-medium capitalize'>{group}</Typography>
											</td>
											<td className='!text-end pie-0'>
												<FormGroup row className='justify-end'>
													{items.map(perm => (
														<FormControlLabel
															key={perm.id}
															control={
																<Checkbox
																	checked={selectedPermissions.includes(perm.id)}
																	onChange={() => togglePermission(perm.id)}
																/>
															}
															label={
																perm.name
																	.split('.')
																	.slice(1)
																	.join(' ')
																	.split(' ')
																	.map(
																		word =>
																			word.charAt(0).toUpperCase() + word.slice(1)
																	)
																	.join(' ') || perm.name
															}
														/>
													))}
												</FormGroup>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</Grid>

					<Grid item xs={12}>
						<div className='flex items-center flex-row-reverse gap-4 mt-4 border-t pt-4'>
							<Button variant='contained' type='submit' disabled={isSubmitting}>
								{isSubmitting ? (
									<div className='flex items-center gap-2'>
										<i className='tabler-loader animate-spin' />
										<span>{t('submitting')}</span>
									</div>
								) : t('submit')}
							</Button>
							<Button variant='tonal' color='error' type='button' onClick={handleReset}>
								{t('cancel')}
							</Button>
						</div>
					</Grid>
				</Grid>
			</form>
		</div>
	)
}

export default AddRoleForm
