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
import toast from 'react-hot-toast'
import { useSiteSettings } from '@/hooks/getSiteSettings'
import { updateSiteSettings } from '@/app/server/actions/siteSettings'
import { withAuthCheck } from '@/utils/authWrapper'

const SiteSettingsFormContent = ({ settings, schema, onSubmit }) => {
    const { t } = useTranslation()

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
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
            <CardContent className='p-6'>
                <div className='border-b pb-4 mb-6'>
                    <Typography variant='h4'>
                        {t('site_settings')}
                    </Typography>
                    <Typography>{t('manage_site_settings_information')}</Typography>
                </div>
                <form
                    key={Object.keys(settings).join(',')}
                    noValidate
                    autoComplete='off'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Grid container spacing={6}>
                        {Object.keys(settings).map(key => (
                            <Grid key={key} size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name={key}
                                    control={control}
                                    render={({ field }) => (
                                        <CustomTextField
                                            {...field}
                                            fullWidth
                                            label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            placeholder={`Enter ${key}`}
                                            error={!!errors[key]}
                                            helperText={errors[key]?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        ))}
                        <Grid size={{ xs: 12 }}>
                            <div className='flex items-center gap-4 border-t pt-4 justify-end'>
                                <Button variant='contained' type='submit' disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <div className='flex items-center gap-2'>
                                            <i className='tabler-loader animate-spin' />
                                            <span>{t('submitting')}</span>
                                        </div>
                                    ) : t('submit')}
                                </Button>
                            </div>
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

    const onSubmit = async data => {
        try {
            const res = await withAuthCheck(() => updateSiteSettings(data))
            if (!res) return
            if (!res.status) {
                toast.error(res.message)
            } else {
                toast.success(res.message)
                fetchSettings()
            }
        } catch (err) {
            toast.error(t('validation.something_went_wrong'))
        }
    }

    if (loading || !formReady) return <Typography>{t('loading_settings')}</Typography>

    return <SiteSettingsFormContent settings={settings} schema={schema} onSubmit={onSubmit} />
}

export default SiteSettingsForm
