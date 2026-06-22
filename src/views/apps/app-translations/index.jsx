'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Grid, Autocomplete, Tab, Tabs, Button, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { useTranslation } from 'react-i18next'
import CustomTextField from '@core/components/mui/TextField'
import { getTranslations, addTranslationKey, updateAppTranslations } from '@/app/server/actions/appTranslations'
import toast from 'react-hot-toast'
import LoadingButton from '@mui/lab/LoadingButton'
import { languages as allWorldLanguages } from './languages'

const AppTranslations = () => {
    const { t } = useTranslation()
    const [selectedLanguage, setSelectedLanguage] = useState(null)
    const [activeTab, setActiveTab] = useState('customer') // Keeping state for now to minimize refactor risk, but can be removed
    const [translations, setTranslations] = useState({})
    const [searchKey, setSearchKey] = useState('')
    const [loading, setLoading] = useState(false)
    const [saveLoading, setSaveLoading] = useState(false)
    const [isDirty, setIsDirty] = useState(false)
    const [openAddKey, setOpenAddKey] = useState(false)
    const [newKey, setNewKey] = useState('')
    const [newKeyError, setNewKeyError] = useState('')
    const [isLanguageConfigured, setIsLanguageConfigured] = useState(true)

    useEffect(() => {
        if (selectedLanguage) {
            fetchTranslations(selectedLanguage.value)
        }
    }, [selectedLanguage])

    const fetchTranslations = async (code) => {
        setLoading(true)
        setIsLanguageConfigured(true)
        const res = await getTranslations(code)
        if (res.status && res.data) {
            setTranslations(res.data)
            setIsLanguageConfigured(true)
        } else {
            // If language doesn't exist in DB
            setIsLanguageConfigured(false)
            setTranslations({})
        }
        setIsDirty(false)
        setLoading(false)
    }

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }

    const handleSave = async () => {
        if (!selectedLanguage) return
        setSaveLoading(true)
        const appType = 'customer'
        const currentData = translations.customer_translation_data

        const res = await updateAppTranslations(selectedLanguage.value, {
            appType,
            translations: currentData,
            lang_name: selectedLanguage.label, // Send name just in case it needs to be created
            direction: (selectedLanguage.value === 'ar' || selectedLanguage.value === 'he' || selectedLanguage.value === 'fa') ? 'rtl' : 'ltr'
        })

        if (res.status) {
            toast.success(t('messages.translations_updated_successfully'))
            setIsDirty(false)
        } else {
            toast.error(t(res.message || 'errors.internal_error'))
        }
        setSaveLoading(false)
    }

    const handleNewKeyChange = (e) => {
        setNewKey(e.target.value)
        setNewKeyError('')
    }

    const generateKeyFromText = (text) => {
        return text.toLowerCase().trim()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '')
    }

    const handleAddKey = async () => {
        if (!newKey) {
            setNewKeyError(t('validation.required'))
            return
        }

        const generatedKey = generateKeyFromText(newKey)
        if (!generatedKey) {
            setNewKeyError(t('validation.invalid_key_format'))
            return
        }

        const res = await addTranslationKey({
            key: generatedKey,
            value: newKey,
            appType: activeTab
        })

        if (res.status) {
            toast.success(t('messages.key_added_successfully'))
            setOpenAddKey(false)
            setNewKey('')
            setNewKeyError('')
            if (selectedLanguage) fetchTranslations(selectedLanguage.value)
        } else {
            toast.error(t(res.message || 'errors.internal_error'))
        }
    }

    const handleTranslationChange = (key, value) => {
        setIsDirty(true)
        const field = 'customer_translation_data'
        setTranslations(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [key]: value
            }
        }))
    }

    const currentTranslations = translations.customer_translation_data || {}
    const filteredKeys = Object.keys(currentTranslations).filter(key =>
        key.toLowerCase().includes(searchKey.toLowerCase())
    )

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardContent className='p-6'>
                        <div className='flex items-center gap-3 border-b pb-5 mb-6'>
                            <div className='flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--mui-palette-primary-lightOpacity)] text-[var(--mui-palette-primary-main)]'>
                                <i className='tabler-language flex text-[28px]' />
                            </div>
                            <div className='flex flex-col'>
                                <Typography variant='h5' className='font-bold' color="text.primary">
                                    {t('app_translations')}
                                </Typography>
                                <Typography variant='body2' className='text-slate-500'>
                                    {t('select_language_to_manage_translations')}
                                </Typography>
                            </div>
                        </div>

                        <Grid container spacing={6} alignItems="center">
                            <Grid item xs={12} sm={6} md={4}>
                                <Autocomplete
                                    fullWidth
                                    options={allWorldLanguages}
                                    getOptionLabel={(option) => `${option.label} (${option.value})`}
                                    value={selectedLanguage}
                                    onChange={(event, newValue) => {
                                        setSelectedLanguage(newValue)
                                    }}
                                    renderInput={(params) => (
                                        <CustomTextField
                                            {...params}
                                            label={t('select_language')}
                                            placeholder={t('select_language_placeholder')}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            {selectedLanguage && (
                <Grid item xs={12}>
                    <Card>
                        {isLanguageConfigured ? (
                            <>
                                <CardContent>
                                    <div className='flex flex-wrap gap-4 items-center justify-between mb-6'>
                                        <CustomTextField
                                            placeholder={t('search_keys')}
                                            value={searchKey}
                                            onChange={(e) => setSearchKey(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position='start'>
                                                        <i className='tabler-search' />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        <div className='flex gap-2'>
                                            <Button
                                                variant='tonal'
                                                startIcon={<i className='tabler-plus' />}
                                                onClick={() => setOpenAddKey(true)}
                                            >
                                                {t('add_new_label')}
                                            </Button>
                                            <LoadingButton
                                                loading={saveLoading}
                                                variant='contained'
                                                onClick={handleSave}
                                                disabled={!isDirty}
                                                startIcon={<i className='tabler-device-floppy' />}
                                            >
                                                {t('save_translations')}
                                            </LoadingButton>
                                        </div>
                                    </div>

                                    <Grid container spacing={4}>
                                        {loading ? (
                                            <Grid item xs={12} className='text-center py-10'>
                                                <Typography>{t('loading')}</Typography>
                                            </Grid>
                                        ) : filteredKeys.length > 0 ? (
                                            filteredKeys.map(key => (
                                                <Grid item xs={12} sm={6} md={4} key={key}>
                                                    <CustomTextField
                                                        fullWidth
                                                        label={key}
                                                        value={currentTranslations[key] || ''}
                                                        onChange={(e) => handleTranslationChange(key, e.target.value)}
                                                    />
                                                </Grid>
                                            ))
                                        ) : (
                                            <Grid item xs={12} className='text-center py-10 text-slate-400'>
                                                <Typography>{t('no_keys_found')}</Typography>
                                            </Grid>
                                        )}
                                    </Grid>
                                </CardContent>
                            </>
                        ) : (
                            <CardContent className='flex flex-col items-center justify-center py-16 gap-4'>
                                <div className='flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-600 mb-2'>
                                    <i className='tabler-alert-triangle text-[32px]' />
                                </div>
                                <Typography variant='h5' className='font-bold text-center'>
                                    {t('language_not_configured_title')}
                                </Typography>
                                <Typography className='text-center text-slate-500 max-w-[400px]'>
                                    {t('language_not_configured_message', { language: selectedLanguage.label })}
                                </Typography>
                            </CardContent>
                        )}
                    </Card>
                </Grid>
            )}

            <Dialog
                open={openAddKey}
                onClose={() => {
                    setOpenAddKey(false)
                    setNewKey('')
                    setNewKeyError('')
                }}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>{t('add_new_label')}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 4 }}>
                        {t('enter_translation_text_helper')}
                    </Typography>
                    <CustomTextField
                        fullWidth
                        autoFocus
                        label={t('translation_text')}
                        placeholder="e.g. Welcome to our application"
                        value={newKey}
                        onChange={handleNewKeyChange}
                        error={!!newKeyError}
                        helperText={newKeyError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button color='secondary' variant='tonal' onClick={() => {
                        setOpenAddKey(false)
                        setNewKey('')
                        setNewKeyError('')
                    }}>{t('cancel')}</Button>
                    <Button
                        variant="contained"
                        onClick={handleAddKey}
                        disabled={!!newKeyError || !newKey}
                    >{t('add')}</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}

export default AppTranslations
