'use client'

import { useState } from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, nonEmpty, minLength, pipe } from 'valibot'
import { useTranslation } from 'react-i18next'
import CustomTextField from '@core/components/mui/TextField'
import { withAuthCheck } from '@/utils/authWrapper'
import toast from 'react-hot-toast'
import { Typography } from '@mui/material'

const ChangePasswordCard = ({ changePassword }) => {
    const { t } = useTranslation()
    const changePasswordSchema = object({
        currentPassword: pipe(string(), nonEmpty(t('validation.current_password_required'))),
        newPassword: pipe(
            string(),
            nonEmpty(t('validation.new_password_required')),
            minLength(6, t('validation.password_min_length'))
        ),
        confirmNewPassword: pipe(string(), nonEmpty(t('validation.confirm_password_required')))
    })

    const [isCurrentPasswordShown, setIsCurrentPasswordShown] = useState(false)
    const [isNewPasswordShown, setIsNewPasswordShown] = useState(false)
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting, isValid, isDirty }
    } = useForm({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        },
        resolver: valibotResolver(changePasswordSchema),
        mode: 'onChange'
    })

    const newPassword = watch('newPassword')

    const onSubmit = async data => {
        if (data.newPassword !== data.confirmNewPassword) {
            toast.error(t('validation.new_confirm_password_do_not_match'))
            return
        }

        const res = await withAuthCheck(() =>
            changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmPassword: data.newPassword
            })
        )
        if (!res) return

        if (res?.error) {
            toast.error(t('validation.current_password_is_incorrect'))
        } else {
            toast.success(t('messages.password_changed_successfully'))
            reset()
        }
    }

    return (
        <div className='flex flex-col gap-6'>
            <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
                <div className='mb-6 pb-4 border-b border-gray-100'>
                    <Typography variant='h5' className='font-bold text-gray-800'>
                        {t('change_password')}
                    </Typography>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-sm font-semibold text-gray-700 ml-1'>
                                {t('current_password')}
                            </label>
                            <Controller
                                name='currentPassword'
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        placeholder='············'
                                        type={isCurrentPasswordShown ? 'text' : 'password'}
                                        fullWidth
                                        error={!!errors.currentPassword}
                                        helperText={errors.currentPassword?.message}
                                        className='[&_fieldset]:rounded-xl'
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position='end'>
                                                        <IconButton
                                                            edge='end'
                                                            onClick={() => setIsCurrentPasswordShown(!isCurrentPasswordShown)}
                                                            onMouseDown={e => e.preventDefault()}
                                                            className='text-gray-400'
                                                        >
                                                            <i className={isCurrentPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }
                                        }}
                                    />
                                )}
                            />
                        </div>

                        <div className='flex flex-col gap-1.5'>
                            <label className='text-sm font-semibold text-gray-700 ml-1'>
                                {t('new_password')}
                            </label>
                            <Controller
                                name='newPassword'
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        placeholder='············'
                                        type={isNewPasswordShown ? 'text' : 'password'}
                                        fullWidth
                                        error={!!errors.newPassword}
                                        helperText={errors.newPassword?.message}
                                        className='[&_fieldset]:rounded-xl'
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position='end'>
                                                        <IconButton
                                                            edge='end'
                                                            onClick={() => setIsNewPasswordShown(!isNewPasswordShown)}
                                                            onMouseDown={e => e.preventDefault()}
                                                            className='text-gray-400'
                                                        >
                                                            <i className={isNewPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }
                                        }}
                                    />
                                )}
                            />
                        </div>

                        <div className='flex flex-col gap-1.5'>
                            <label className='text-sm font-semibold text-gray-700 ml-1'>
                                {t('confirm_new_password')}
                            </label>
                            <Controller
                                name='confirmNewPassword'
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        placeholder='············'
                                        type={isConfirmPasswordShown ? 'text' : 'password'}
                                        fullWidth
                                        error={!!errors.confirmNewPassword}
                                        helperText={errors.confirmNewPassword?.message}
                                        className='[&_fieldset]:rounded-xl'
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position='end'>
                                                        <IconButton
                                                            edge='end'
                                                            onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                                                            onMouseDown={e => e.preventDefault()}
                                                            className='text-gray-400'
                                                        >
                                                            <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className='flex justify-end pt-6 border-t border-gray-100 mt-6 gap-3'>
                        <Button
                            variant='text'
                            disabled={!isDirty}
                            onClick={() => {
                                reset()
                                setIsCurrentPasswordShown(false)
                                setIsNewPasswordShown(false)
                                setIsConfirmPasswordShown(false)
                            }}
                            className='px-8 py-2.5 rounded-l font-semibold normal-case min-w-[140px] bg-[#FFE5E6] text-[#FF4D49] hover:bg-[#FFD6D6]'
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            variant='contained'
                            type='submit'
                            disabled={isSubmitting || !isValid}
                            className='px-8 py-2.5 rounded-l font-semibold shadow-md hover:shadow-lg normal-case min-w-[140px]'
                        >
                            {t('change_password')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePasswordCard
