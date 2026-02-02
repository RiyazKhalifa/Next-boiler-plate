'use client'

import { useState } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, nonEmpty, minLength, email as emailValidator, pipe } from 'valibot'
import { useTranslation } from 'react-i18next'
import CustomTextField from '@core/components/mui/TextField'
import { useDispatch } from 'react-redux'
import { setUser } from '@/store/userSlice'
import { withAuthCheck } from '@/utils/authWrapper'
import toast from 'react-hot-toast'
import { defaultAvatar } from '@/configs/imageConfig'
import NextImage from '@/components/NextImage'

const getImageUrl = image => {
    if (!image) return defaultAvatar
    if (typeof image === 'string') return image
    if (typeof image === 'object' && image.url) return image.url
    if (Array.isArray(image) && image.length > 0) {
        return typeof image[0] === 'string' ? image[0] : image[0].url || defaultAvatar
    }
    return defaultAvatar
}

const AccountDetails = ({ userProfile, updateAction }) => {
    const { t } = useTranslation()

    const accountDetailsSchema = object({
        name: pipe(string(), nonEmpty(t('validation.name_required')), minLength(3, t('validation.name_min_length'))),
        email: pipe(string(), nonEmpty(t('validation.email_required')), emailValidator(t('validation.email_invalid')))
    })

    const [fileInput, setFileInput] = useState('')
    const [imgSrc, setImgSrc] = useState(getImageUrl(userProfile?.profile_image))
    const [selectedFile, setSelectedFile] = useState(null)
    const [userName, setUserName] = useState(userProfile?.name || '')
    const [savedImage, setSavedImage] = useState(userProfile?.profile_image)

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
        reset
    } = useForm({
        defaultValues: {
            name: userProfile?.name || '',
            email: userProfile?.email || ''
        },
        resolver: valibotResolver(accountDetailsSchema)
    })

    const handleFileInputChange = e => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onload = () => setImgSrc(reader.result)
            reader.readAsDataURL(file)
        }
    }

    const handleFileInputReset = () => {
        setFileInput('')
        setImgSrc(getImageUrl(savedImage))
    }

    const dispatch = useDispatch()
    const onSubmit = async data => {
        try {
            const formData = new FormData()
            formData.append('name', data.name)

            if (selectedFile) {
                formData.append('profile_image', selectedFile)
            }
            const res = await withAuthCheck(() => updateAction(formData))
            if (!res) return

            if (!res.status) {
                toast.error(res.message)
            } else {
                toast.success(res.message)
                dispatch(setUser(res.data))
                if (res.data?.profile_image) {
                    setImgSrc(getImageUrl(res.data.profile_image))
                    setSavedImage(res.data.profile_image)
                }
                reset({
                    name: res.data.name,
                    email: userProfile?.email
                })
                setUserName(res.data.name)
                setSelectedFile(null)
            }
        } catch (err) {
            toast.error(t('validation.something_went_wrong'))
        }
    }

    return (
        <div className='flex flex-col gap-6'>
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
                <div className='flex flex-col md:flex-row items-center gap-8 mb-8'>
                    <div className='relative'>
                        <div className='p-1.5 bg-white border-[3px] border-gray-100 rounded-full shadow-sm flex items-center justify-center overflow-hidden' style={{ width: 120, height: 120 }}>
                            {imgSrc && imgSrc !== defaultAvatar ? (
                                <NextImage
                                    fill
                                    className='rounded-full object-cover'
                                    src={imgSrc}
                                    alt='Profile'
                                />
                            ) : (
                                <div className='flex flex-col items-center justify-center text-gray-400'>
                                    <i className='tabler-user text-[60px]' />
                                </div>
                            )}
                        </div>
                        <label
                            htmlFor='upload-image'
                            className='absolute bottom-2 right-2 w-10 h-10 bg-white text-gray-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg border border-gray-100 hover:bg-gray-50 hover:text-primary transition-all duration-300 z-10'
                        >
                            <i className='tabler-camera text-lg' />
                            <input
                                hidden
                                type='file'
                                id='upload-image'
                                accept='image/png, image/jpeg'
                                onChange={handleFileInputChange}
                            />
                        </label>
                    </div>

                    <div className='flex flex-col items-center md:items-start gap-1 flex-grow text-center md:text-left'>
                        <Typography variant='h5' className='font-bold text-gray-800'>
                            {userName}
                        </Typography>
                        <Typography variant='body2' className='text-gray-500 font-medium'>
                            {userProfile?.email}
                        </Typography>
                        <div className='mt-2 inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100'>
                            <i className='tabler-info-circle text-gray-400 text-xs' />
                            <Typography variant='caption' className='text-gray-400 font-medium'>
                                {t('allowed_JPG_JPEG_PNG')}
                            </Typography>
                        </div>
                    </div>
                </div>

                <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-sm font-semibold text-gray-700 ml-1'>
                                {t('name')}
                            </label>
                            <Controller
                                name='name'
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        placeholder={t('name')}
                                        fullWidth
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                        className='[&_fieldset]:rounded-xl'
                                    />
                                )}
                            />
                        </div>

                        <div className='flex flex-col gap-1.5'>
                            <label className='text-sm font-semibold text-gray-700 ml-1'>
                                {t('email')}
                            </label>
                            <Controller
                                name='email'
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        placeholder='john.doe@gmail.com'
                                        fullWidth
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        InputProps={{
                                            readOnly: true,
                                            disabled: true,
                                            className: 'bg-gray-50/50'
                                        }}
                                        className='[&_fieldset]:rounded-xl'
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className='flex justify-end pt-6 border-t border-gray-100 mt-6 gap-3'>
                        <Button
                            variant='text'
                            disabled={!isDirty && !selectedFile}
                            onClick={() => {
                                reset()
                                setSelectedFile(null)
                                setImgSrc(getImageUrl(savedImage))
                            }}
                            className='px-8 py-2.5 rounded-l font-semibold normal-case min-w-[140px] bg-[#FFE5E6] text-[#FF4D49] hover:bg-[#FFD6D6]'
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            variant='contained'
                            type='submit'
                            disabled={isSubmitting || (!isDirty && !selectedFile)}
                            className='px-8 py-2.5 rounded-l font-semibold shadow-md hover:shadow-lg normal-case min-w-[140px]'
                        >
                            {isSubmitting ? (
                                <div className='flex items-center gap-2'>
                                    <i className='tabler-loader animate-spin' />
                                    <span>{t('saving')}</span>
                                </div>
                            ) : t('save_changs')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AccountDetails
