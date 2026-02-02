'use client'

import Link from 'next/link'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, nonEmpty, pipe, email as emailValidator } from 'valibot'
import { useTranslation } from 'react-i18next'
import DirectionalIcon from '@components/DirectionalIcon'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'
import LanguageSwitcher from '@components/LanguageSwitcher'
import AuthIllustrationWrapper from './AuthIllustrationWrapper'
import toast from 'react-hot-toast'

const ForgotPasswordV1 = ({ forgotPasswordAction }) => {
    const { t } = useTranslation()

    const forgotPasswordSchema = object({
        email: pipe(string(), nonEmpty(t("validation.email_required")), emailValidator(t("validation.email_invalid")))
    })

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: { email: '' },
        resolver: valibotResolver(forgotPasswordSchema)
    })

    const onSubmit = async data => {
        const res = await forgotPasswordAction(data)

        if (!res.status) {
            toast.error(res.error || res.message || t('validation.something_went_wrong'))
        } else {
            toast.success(res.message)
            reset()
        }
    }

    return (
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
                        <Typography variant='h4'>{t('forgot_password')} 🔒</Typography>
                        <Typography>{t('email_instructions_to_reset_your_password')}</Typography>
                    </div>

                    <form
                        noValidate
                        autoComplete='off'
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col gap-6'
                    >
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
                                    helperText={errors.email?.message}
                                />
                            )}
                        />

                        <Button fullWidth variant='contained' type='submit' disabled={isSubmitting}>
                            {isSubmitting ? (
                                <div className='flex items-center gap-2'>
                                    <i className='tabler-loader animate-spin' />
                                    <span>{t('sending')}</span>
                                </div>
                            ) : t('send_reset_link')}
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
    )
}

export default ForgotPasswordV1
