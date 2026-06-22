'use client'

import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import { Card, CardHeader } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, pipe, nonEmpty } from 'valibot'
import { useTranslation } from 'react-i18next'
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'
import toast from 'react-hot-toast'
import { useSiteSettings } from '@/hooks/getSiteSettings'
import { updateSiteSettings } from '@/app/server/actions/siteSettings'
import { withAuthCheck } from '@/utils/authWrapper'
import { useLoader } from '@/contexts/LoaderContext'

import SiteSettingsSkeleton from './SiteSettingsSkeleton'

const SiteSettingsFormContent = ({ settings, schema, onSubmit }) => {
    const { t } = useTranslation()

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
        reset
    } = useForm({
        defaultValues: settings,
        resolver: valibotResolver(schema)
    })

    useEffect(() => {
        reset(settings)
    }, [settings, reset])

    return (
        <Card>
            <CardContent className='p-6 !pb-0'>
                <div className='flex items-center gap-4 border-b pb-5 mb-0'>
                    <CustomAvatar color='primary' skin='light' variant='rounded' size={44}>
                        <i className='tabler-world text-[28px]' />
                    </CustomAvatar>
                    <div className='flex flex-col'>
                        <Typography variant='h5' className='font-bold' color="text.primary">
                            {t('site_settings')}
                        </Typography>
                        <Typography variant='body2' className='text-slate-500'>
                            {t('manage_site_settings_information')}
                        </Typography>
                    </div>
                </div>
            </CardContent>
            <CardContent className='p-6'>
                <form
                    key={Object.keys(settings).join(',')}
                    noValidate
                    autoComplete='off'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Grid container spacing={6}>
                        {Object.keys(settings).map(key => (
                            <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
                                <Controller
                                    name={key}
                                    control={control}
                                    render={({ field }) => (
                                        <CustomTextField
                                            {...field}
                                            fullWidth
                                            label={t(key) !== key ? t(key) : key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            placeholder={t(`enter_${key}`) !== `enter_${key}` ? t(`enter_${key}`) : `Enter ${key.replace(/_/g, ' ')}`}
                                            error={!!errors[key]}
                                            helperText={errors[key]?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        ))}
                        <Grid size={{ xs: 12 }} className='flex items-center flex-row-reverse gap-4 mt-4 border-t pt-4'>
                            <Button
                                variant='contained'
                                type='submit'
                                disabled={!isDirty || isSubmitting}
                                startIcon={isSubmitting ? <i className='tabler-loader animate-spin' /> : <i className='tabler-device-floppy' />}
                            >
                                {isSubmitting ? t('submitting') : t('update')}
                            </Button>
                            <Button
                                variant='tonal'
                                color='secondary'
                                type='reset'
                                onClick={() => reset()}
                                disabled={!isDirty || isSubmitting}
                                startIcon={<i className='tabler-x' />}
                            >
                                {t('cancel')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    )
}

const SiteSettingsForm = () => {
    const { t } = useTranslation()
    const { settings, loading, fetchSettings } = useSiteSettings()

    const createSchema = keys => {
        const schema = {}
        keys.forEach(key => {
            schema[key] = pipe(string(), nonEmpty(t('validation.required')))
        })
        return object(schema)
    }

    const [schema, setSchema] = useState(null)
    const [formReady, setFormReady] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    useEffect(() => {
        if (Object.keys(settings).length > 0) {
            const newSchema = createSchema(Object.keys(settings))
            setSchema(newSchema)
            setFormReady(true)
        }
    }, [settings])

    const { setLoading } = useLoader()
    const onSubmit = async data => {
        setLoading(true)
        try {
            const res = await withAuthCheck(() => updateSiteSettings(data))
            if (!res) return
            if (!res.status) {
                setLoading(false)
                toast.error(res.message)
            } else {
                setLoading(false)
                toast.success(res.message)
                fetchSettings()
            }
        } catch (err) {
            setLoading(false)
            toast.error(t('validation.something_went_wrong'))
        }
    }

    if (loading || !formReady) return <SiteSettingsSkeleton />

    return <SiteSettingsFormContent settings={settings} schema={schema} onSubmit={onSubmit} />
}

export default SiteSettingsForm
