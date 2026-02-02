'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'
import LanguageSwitcher from '@components/LanguageSwitcher'
import themeConfig from '@configs/themeConfig'
import { useTranslation } from 'react-i18next'
import AuthIllustrationWrapper from './AuthIllustrationWrapper'
import { useDispatch } from 'react-redux'
import { setUser, setPermissions, clearUser, clearPermissions } from '@/store/userSlice'
import toast from 'react-hot-toast'
import { object, string, pipe, nonEmpty, email, minLength } from 'valibot'

const LoginV1 = () => {
    const { data: session } = useSession()
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const [isPasswordShown, setIsPasswordShown] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()

    const schema = object({
        email: pipe(string(), nonEmpty(t("validation.email_required")), email(t("validation.email_invalid"))),
        password: pipe(
            string(),
            nonEmpty(t("validation.password_required")),
            minLength(6, t("validation.password_min_length"))
        )
    })

    useEffect(() => {
        dispatch(clearUser())
        dispatch(clearPermissions())
    }, [])

    const handleClickShowPassword = () => setIsPasswordShown(show => !show)

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: valibotResolver(schema),
        defaultValues: { email: '', password: '' }
    })

    useEffect(() => {
        if (session?.user) {
            const user = {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                profile_image: session.user.profile_image,
                status: session.user.status,
            }

            dispatch(setUser(user))

            if (session.user.permissions) {
                dispatch(setPermissions(session.user.permissions))
            }
        }
    }, [session])

    const onSubmit = async data => {
        const res = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
        })
        if (res?.ok && !res.error) {
            const redirectURL = searchParams.get('redirectTo') ?? '/dashboard'
            router.replace(redirectURL)
        } else if (res?.error) {
            toast.error(res.error || t('errors.login_failed'))
        }
    }

    return (
        <AuthIllustrationWrapper>
            <Card className='flex flex-col sm:is-[450px]'>
                <CardContent className='sm:!p-12'>
                    <div className='absolute top-4 right-4 z-50'>
                        <LanguageSwitcher />
                    </div>
                    {/* Logo */}
                    <Link href='/' className='flex justify-center mbe-6'>
                        <Logo />
                    </Link>

                    {/* Header */}
                    <div className='flex flex-col gap-1 mbe-6'>
                        <Typography variant='h4'>
                            {t('welcome_to', { appTitle: themeConfig.templateName }) + ' 👋🏻'}
                        </Typography>
                        <Typography>{t('please_sign_in_to_your_account_and_start_the_adventure')}</Typography>
                    </div>

                    {/* Form */}
                    <form
                        noValidate
                        autoComplete='off'
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col gap-6'
                    >
                        {/* Email */}
                        <Controller
                            name='email'
                            control={control}
                            render={({ field }) => (
                                <CustomTextField
                                    {...field}
                                    autoFocus
                                    fullWidth
                                    label={t('email')}
                                    placeholder={t('enter_your_email')}
                                    error={!!errors.email}
                                    helperText={errors.email && t(errors.email.message)}
                                    onChange={e => {
                                        field.onChange(e.target.value)
                                    }}
                                />
                            )}
                        />

                        {/* Password */}
                        <Controller
                            name='password'
                            control={control}
                            render={({ field }) => (
                                <CustomTextField
                                    {...field}
                                    fullWidth
                                    label={t('password')}
                                    placeholder='············'
                                    type={isPasswordShown ? 'text' : 'password'}
                                    error={!!errors.password}
                                    helperText={errors.password && t(errors.password.message)}
                                    onChange={e => {
                                        field.onChange(e.target.value)
                                    }}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position='end'>
                                                    <IconButton
                                                        edge='end'
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={e => e.preventDefault()}
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

                        {/* Forgot Password */}
                        <div className='flex justify-end'>
                            <Typography
                                className='text-end'
                                color='primary.main'
                                component={Link}
                                href='/forgot-password'
                            >
                                {t('forgot_password')}
                            </Typography>
                        </div>

                        {/* Submit */}
                        <Button fullWidth variant='contained' type='submit' disabled={isSubmitting}>
                            {isSubmitting ? (
                                <div className='flex items-center gap-2'>
                                    <i className='tabler-loader animate-spin' />
                                    <span>{t('logging_in')}</span>
                                </div>
                            ) : t('login')}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AuthIllustrationWrapper>
    )
}

export default LoginV1
