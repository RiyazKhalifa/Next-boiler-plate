'use client'

import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import {
    Card,
    CardContent,
    Button,
    Typography,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CardHeader
} from '@mui/material'
import CustomAvatar from '@core/components/mui/Avatar'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, boolean, optional } from 'valibot'
import { useTranslation } from 'react-i18next'
import CustomTextField from '@core/components/mui/TextField'
import toast from 'react-hot-toast'
import { useAppSettings } from '@/hooks/getAppSettings'
import { updateAppSettings } from '@/app/server/actions/appSettings'
import { withAuthCheck } from '@/utils/authWrapper'
import { useLoader } from '@/contexts/LoaderContext'
import AuthenticationDialog from '@/components/AuthenticationDialog'
import AppSettingsSkeleton from './AppSettingsSkeleton'

const AppSettingsForm = () => {
    const { t } = useTranslation()
    const { settings, loading, fetchSettings } = useAppSettings()

    const [schema, setSchema] = useState(null)
    const [apps, setApps] = useState([])
    const [otherSettings, setOtherSettings] = useState([])

    const {
        control,
        handleSubmit,
        formState: { errors, isDirty },
        reset
    } = useForm({
        resolver: valibotResolver(schema || object({}))
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    useEffect(() => {
        if (Object.keys(settings).length > 0) {
            // Identify apps (keys ending in _version)
            const appKeys = Object.keys(settings)
                .filter(key => key.endsWith('_version'))
                .map(key => key.replace('_version', ''))

            // Identify other settings (not app versions, not compulsory update flags)
            const excludedKeys = []
            appKeys.forEach(app => {
                excludedKeys.push(`${app}_version`)
                excludedKeys.push(`${app}_compulsory_update`)
            })

            // Filter out maintenance mode keys as they have special section
            const maintenanceKeys = ['maintenance_mode', 'maintenance_mode_enable']
            const others = Object.keys(settings).filter(
                key => !excludedKeys.includes(key) && !maintenanceKeys.includes(key)
            )

            setApps(appKeys)
            setOtherSettings(others)

            // Dynamic Schema
            const schemaShape = {}
            Object.keys(settings).forEach(key => {
                if (key.endsWith('_compulsory_update') || key === 'maintenance_mode_enable') {
                    schemaShape[key] = optional(boolean())
                } else {
                    schemaShape[key] = optional(string())
                }
            })
            setSchema(object(schemaShape))

            // Format settings for reset
            const formattedSettings = { ...settings }
            Object.keys(settings).forEach(key => {
                const val = settings[key]
                if (key.endsWith('_compulsory_update') || key === 'maintenance_mode_enable') {
                    formattedSettings[key] = val === '1' || val === 1 || val === 'true' || val === true
                }
            })
            reset(formattedSettings)
        }
    }, [settings, reset])

    const [authDialogOpen, setAuthDialogOpen] = useState(false)
    const [pendingData, setPendingData] = useState(null)

    const onSubmit = data => {
        setPendingData(data)
        setAuthDialogOpen(true)
    }

    const { setLoading } = useLoader()
    const handleAuthenticated = async () => {
        if (!pendingData) return

        setLoading(true)
        try {
            const res = await withAuthCheck(() => updateAppSettings(pendingData))
            if (!res) return
            if (!res.status) {
                setLoading(false)
                toast.error(t(res.message))
            } else {
                setLoading(false)
                toast.success(t(res.message))
                fetchSettings()
            }
        } catch (err) {
            setLoading(false)
            toast.error(t('validation.something_went_wrong'))
        }
    }

    if (loading || !schema) return <AppSettingsSkeleton />

    return (
        <Card>
            <CardContent className='p-6 !pb-0'>
                <div className='flex items-center gap-4 border-b pb-5 mb-0'>
                    <CustomAvatar color='primary' skin='light' variant='rounded' size={44}>
                        <i className='tabler-device-mobile-cog text-[28px]' />
                    </CustomAvatar>
                    <div className='flex flex-col'>
                        <Typography variant='h5' className='font-bold' color="text.primary">
                            {t('app_settings')}
                        </Typography>
                        <Typography variant='body2' className='text-slate-500'>
                            {t('manage_app_settings_information')}
                        </Typography>
                    </div>
                </div>
            </CardContent>
            <CardContent className='p-6'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={6}>
                        {apps.length > 0 && (
                            <Grid size={{ xs: 12 }}>
                                <div className='border rounded'>
                                    <TableContainer component={Paper} elevation={0}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>{t('app_name')}</TableCell>
                                                    <TableCell>{t('version')}</TableCell>
                                                    <TableCell align='center'>{t('compulsory_update')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {apps.map(app => (
                                                    <TableRow key={app}>
                                                        <TableCell>{t(app) !== app ? t(app) : app.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</TableCell>
                                                        <TableCell>
                                                            <Controller
                                                                name={`${app}_version`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <CustomTextField
                                                                        {...field}
                                                                        value={field.value || ''}
                                                                        fullWidth
                                                                        placeholder='1.0.0'
                                                                        error={!!errors[`${app}_version`]}
                                                                        helperText={errors[`${app}_version`]?.message}
                                                                    />
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                            <Controller
                                                                name={`${app}_compulsory_update`}
                                                                control={control}
                                                                render={({ field: { value, onChange } }) => (
                                                                    <Checkbox
                                                                        checked={value || false}
                                                                        onChange={e => onChange(e.target.checked)}
                                                                    />
                                                                )}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </Grid>
                        )}

                        {/* Maintenance Mode */}
                        {(settings.maintenance_mode !== undefined || settings.maintenance_mode_enable !== undefined) && (
                            <Grid size={{ xs: 12 }}>
                                <div className='border rounded'>
                                    <TableContainer component={Paper} elevation={0}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell width={'50%'}>{t('maintenance_mode')}</TableCell>
                                                    <TableCell align='center'>{t('maintenance_mode_enable')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography>{t('maintenance_mode')}</Typography>
                                                    </TableCell>
                                                    <TableCell align='center'>
                                                        <Controller
                                                            name='maintenance_mode_enable'
                                                            control={control}
                                                            render={({ field: { value, onChange } }) => (
                                                                <Checkbox
                                                                    checked={value || false}
                                                                    onChange={e => onChange(e.target.checked)}
                                                                />
                                                            )}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </Grid>
                        )}

                        {/* Other Dynamic Settings */}
                        {otherSettings.map(key => (
                            <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
                                <Controller
                                    name={key}
                                    control={control}
                                    render={({ field }) => (
                                        <CustomTextField
                                            {...field}
                                            fullWidth
                                            label={t(key)}
                                            placeholder={t(`enter_${key}`)}
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
                                disabled={!isDirty}
                                startIcon={<i className='tabler-device-floppy' />}
                            >
                                {t('update')}
                            </Button>
                            <Button
                                variant='tonal'
                                color='secondary'
                                type='reset'
                                onClick={() => reset()}
                                disabled={!isDirty}
                                startIcon={<i className='tabler-x' />}
                            >
                                {t('cancel')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
            <AuthenticationDialog
                open={authDialogOpen}
                setOpen={setAuthDialogOpen}
                onAuthenticated={handleAuthenticated}
            />
        </Card >
    )
}

export default AppSettingsForm
