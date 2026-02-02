import { useState, useEffect } from 'react'
import { Grid, Button, Typography, TextField, Autocomplete } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, nonEmpty, email as emailValidator, pipe } from 'valibot'
import CustomTextField from '@core/components/mui/TextField'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { withAuthCheck } from '@/utils/authWrapper'
import { defaultLogo } from '@/configs/imageConfig'
import NextImage from '@/components/NextImage'

const AddUserForm = ({ open, handleClose, addedUser, editedUser, updateUser, userRoles, refreshUsers, setLoading }) => {
    const { t } = useTranslation()

    const addUserSchema = object({
        name: pipe(string(), nonEmpty(t('validation.name_required'))),
        email: pipe(string(), nonEmpty(t('validation.email_required')), emailValidator(t('validation.email_invalid'))),
        roleId: pipe(string(), nonEmpty(t('validation.role_required')))
    })
    const [selectedFile, setSelectedFile] = useState(null)
    const [imgSrc, setImgSrc] = useState(null)

    const { control, handleSubmit, reset, setValue, formState } = useForm({
        defaultValues: { name: '', email: '', roleId: '', profile_image: null },
        resolver: valibotResolver(addUserSchema)
    })

    const { isSubmitting, errors } = formState

    useEffect(() => {
        if (editedUser?.data) {
            setValue('name', editedUser.data.name || '')
            setValue('email', editedUser.data.email || '')
            setValue('roleId', String(editedUser.data.role?.id || ''))
            setValue('profile_image', null)

            if (editedUser.data.profile_image) {
                setImgSrc(editedUser.data.profile_image)
            } else {
                setImgSrc(null)
            }
        } else {
            reset({ name: '', email: '', profile_image: '', roleId: '' })
            setImgSrc(null)
        }
    }, [editedUser, setValue, reset])

    const handleFileChange = (e, field) => {
        const file = e.target.files[0]
        setSelectedFile(file)
        field.onChange(file)

        if (file) {
            const reader = new FileReader()
            reader.onload = () => setImgSrc(reader.result)
            reader.readAsDataURL(file)
        } else {
            setImgSrc(null)
        }
    }

    const onSubmit = async data => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('name', data.name)
            formData.append('email', data.email)
            formData.append('roleId', Number(data.roleId))

            if (selectedFile) {
                formData.append('profile_image', selectedFile)
            }

            let res
            if (editedUser?.data) {
                res = await withAuthCheck(() => updateUser(editedUser.data.id, formData))
            } else {
                res = await withAuthCheck(() => addedUser(formData))
            }
            if (!res) return
            if (res.status) {
                toast.success(res.message)
                refreshUsers()
                setTimeout(() => {
                    handleClose()
                    reset()
                }, 1000)
            } else {
                toast.error(res.message)
            }
        } catch (err) {
            toast.error(t('something_went_wrong'))
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        handleClose()
        reset()
    }

    if (!open) return null

    return (
        <div className='p-6 border rounded-md mb-6 bg-white shadow-md slide-down'>
            <div className='border-b pb-4 mb-6'>
                <Typography variant='h4'>
                    {editedUser ? t('edit_user') : t('add_user')}
                </Typography>
                <Typography>{t('manage_user_information')}</Typography>
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
                            name='email'
                            control={control}
                            render={({ field }) => (
                                <CustomTextField
                                    {...field}
                                    fullWidth
                                    type='email'
                                    label={t('email')}
                                    placeholder={t('email')}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name='roleId'
                            control={control}
                            rules={{ required: t('validation.role_required') }}
                            render={({ field, fieldState }) => (
                                <Autocomplete
                                    fullWidth
                                    size='small'
                                    options={userRoles}
                                    getOptionLabel={option => option.name}
                                    value={userRoles.find(r => String(r.id) === field.value) || null}
                                    onChange={(_, newValue) => field.onChange(newValue ? String(newValue.id) : '')}
                                    renderInput={params => (
                                        <CustomTextField
                                            {...params}
                                            label={t('role')}
                                            placeholder={t('select_role')}
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name='profile_image'
                            control={control}
                            render={({ field }) => (
                                <div className='flex flex-col items-start'>
                                    <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                                        {t('profile_image')}
                                    </Typography>

                                    <div
                                        className='border-2 border-dashed rounded-md p-4 cursor-pointer flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100'
                                        style={{ width: '100%', textAlign: 'center' }}
                                        onClick={() => document.getElementById('profileUploadInput').click()}
                                    >
                                        <input
                                            id='profileUploadInput'
                                            type='file'
                                            accept='image/*'
                                            style={{ display: 'none' }}
                                            onChange={e => handleFileChange(e, field)}
                                        />

                                        {imgSrc && imgSrc !== defaultLogo ? (
                                            <div className='relative w-full h-[120px] flex items-center justify-center'>
                                                <NextImage
                                                    src={imgSrc}
                                                    alt='Preview'
                                                    width={100}
                                                    height={100}
                                                    className='rounded-md object-cover'
                                                />
                                                <div className='absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-1 pointer-events-none'>
                                                    <i className='tabler-camera text-white text-2xl' />
                                                    <Typography variant='caption' className='text-white font-semibold'>
                                                        {t('change_image')}
                                                    </Typography>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='flex flex-col items-center justify-center py-2'>
                                                <div className='w-10 h-10 rounded-full flex items-center justify-center bg-primaryLight text-primary mb-2'>
                                                    <i className='tabler-cloud-upload text-xl' />
                                                </div>
                                                <Typography variant='body2' className='font-medium text-textSecondary'>
                                                    {t('click_to_upload')}
                                                </Typography>
                                                <Typography variant='caption' className='text-textDisabled'>
                                                    {t('allowed_JPG_JPEG_PNG')}
                                                </Typography>
                                            </div>
                                        )}
                                    </div>

                                    {errors.profile_image && (
                                        <Typography variant='caption' sx={{ mt: 0.5, color: 'error.main' }}>
                                            {errors.profile_image.message}
                                        </Typography>
                                    )}
                                </div>
                            )}
                        />
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

export default AddUserForm
