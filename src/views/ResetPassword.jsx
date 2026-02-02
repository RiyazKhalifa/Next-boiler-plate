'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, nonEmpty, minLength, pipe } from 'valibot'
import { useTranslation } from 'react-i18next'
import DirectionalIcon from '@components/DirectionalIcon'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'
import LanguageSwitcher from '@components/LanguageSwitcher'
import toast from 'react-hot-toast'

const AuthIllustrationWrapper = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: 450,
    position: 'relative',
    [theme.breakpoints.up('md')]: {
        '&:before': {
            zIndex: -1,
            position: 'absolute',
            height: '234px',
            width: '238px',
            content: '""',
            top: '-80px',
            left: '-45px',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='238' height='234' viewBox='0 0 238 234' fill='none'%3E%3Crect x='87.9395' y='0.5' width='149' height='149' rx='19.5' stroke='%23${theme.palette.primary.main.slice(1)}' stroke-opacity='0.16'/%3E%3Crect y='33.5608' width='200' height='200' rx='10' fill='%23${theme.palette.primary.main.slice(1)}' fill-opacity='0.08'/%3E%3C/svg%3E")`
        },
        '&:after': {
            zIndex: -1,
            position: 'absolute',
            height: '180px',
            width: '180px',
            content: '""',
            right: '-57px',
            bottom: '-64px',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180' fill='none'%3E%3Crect x='1' y='1' width='178' height='178' rx='19' stroke='%23${theme.palette.primary.main.slice(1)}' stroke-opacity='0.16' stroke-width='2' stroke-dasharray='8 8'/%3E%3Crect x='22.5' y='22.5' width='135' height='135' rx='10' fill='%23${theme.palette.primary.main.slice(1)}' fill-opacity='0.08'/%3E%3C/svg%3E")`
        }
    }
}))

const ResetPassword = ({ resetPasswordAction, validateResetTokenAction }) => {
    const { t } = useTranslation()

    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const resetPasswordSchema = object({
        newPassword: pipe(
            string(),
            nonEmpty(t("validation.new_password_required")),
            minLength(6, t("validation.password_min_length"))
        ),
        confirmPassword: pipe(
            string(),
            nonEmpty(t("validation.confirm_password_required")),
            minLength(6, t("validation.password_min_length"))
        )
    });

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                toast.error(t('validation.invalid_reset_token'))
                router.push('/login');
                return
            }

            const res = await validateResetTokenAction({ resetToken: token })
            if (!res.status) {
                toast.error(res.error || res.message || t('validation.invalid_reset_token'))
                router.push('/login');
                return
            } else {
                setLoading(false);
            }
        }
        validateToken()
    }, [token, router, t, validateResetTokenAction])

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: { newPassword: '', confirmPassword: '' },
        resolver: valibotResolver(resetPasswordSchema)
    })

    const newPassword = watch('newPassword')

    const onSubmit = async data => {
        if (data.newPassword !== data.confirmPassword) {
            toast.error(t('validation.passwords_not_match'))
            return
        }

        const res = await resetPasswordAction({
            resetToken: token,
            newPassword: data.newPassword
        })

        if (!res.status) {
            toast.error(res.error || res.message || t('validation.something_went_wrong'))
        } else {
            toast.success(res.message)
            reset()
            router.push('/login');
        }
    }

    return (
        <>
            {
                loading ? "" :
                    <AuthIllustrationWrapper>
                        <Card className='flex flex-col sm:is-[450px]'>
                            <CardContent className='sm:!p-12'>
                                <div className='absolute top-4 right-4 z-50'>
                                    <LanguageSwitcher />
                                </div>
                                <Link href='/' className='flex justify-center mbe-6'>
                                    <Logo />
                                </Link>

                                <div className='flex flex-col gap-1 mbe-6'>
                                    <Typography variant='h4'>{t('reset_password')} 🔒</Typography>
                                    <Typography>{t('your_new_password_must_be_different')}</Typography>
                                </div>

                                <form
                                    noValidate
                                    autoComplete='off'
                                    onSubmit={handleSubmit(onSubmit)}
                                    className='flex flex-col gap-6'
                                >
                                    {/* New Password */}
                                    <Controller
                                        name='newPassword'
                                        control={control}
                                        render={({ field }) => (
                                            <CustomTextField
                                                {...field}
                                                autoFocus
                                                fullWidth
                                                label={t('new_password')}
                                                placeholder='············'
                                                type={isPasswordShown ? 'text' : 'password'}
                                                error={!!errors.newPassword}
                                                helperText={errors.newPassword?.message}
                                                slotProps={{
                                                    input: {
                                                        endAdornment: (
                                                            <InputAdornment position='end'>
                                                                <IconButton
                                                                    edge='end'
                                                                    onClick={() => setIsPasswordShown(!isPasswordShown)}
                                                                >
                                                                    <i
                                                                        className={
                                                                            isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'
                                                                        }
                                                                    />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }
                                                }}
                                            />
                                        )}
                                    />

                                    {/* Confirm Password */}
                                    <Controller
                                        name='confirmPassword'
                                        control={control}
                                        render={({ field }) => (
                                            <CustomTextField
                                                {...field}
                                                fullWidth
                                                label={t('confirm_password')}
                                                placeholder='············'
                                                type={isConfirmPasswordShown ? 'text' : 'password'}
                                                error={!!errors.confirmPassword}
                                                helperText={errors.confirmPassword?.message}
                                                slotProps={{
                                                    input: {
                                                        endAdornment: (
                                                            <InputAdornment position='end'>
                                                                <IconButton
                                                                    edge='end'
                                                                    onClick={() =>
                                                                        setIsConfirmPasswordShown(!isConfirmPasswordShown)
                                                                    }
                                                                >
                                                                    <i
                                                                        className={
                                                                            isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'
                                                                        }
                                                                    />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        )
                                                    }
                                                }}
                                            />
                                        )}
                                    />

                                    <Button fullWidth variant='contained' type='submit' disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <div className='flex items-center gap-2'>
                                                <i className='tabler-loader animate-spin' />
                                                <span>{t('submitting')}</span>
                                            </div>
                                        ) : t('set_new_password')}
                                    </Button>

                                    <Typography className='flex justify-center items-center' color='primary.main'>
                                        <Link href='/login' className='flex items-center gap-1.5'>
                                            <DirectionalIcon
                                                ltrIconClass='tabler-chevron-left'
                                                rtlIconClass='tabler-chevron-right'
                                                className='text-xl'
                                            />
                                            <span>{t('back_to_login')}</span>
                                        </Link>
                                    </Typography>
                                </form>
                            </CardContent>
                        </Card>
                    </AuthIllustrationWrapper>
            }
        </>
    )
}

export default ResetPassword
