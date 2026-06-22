'use client'

import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import CustomTextField from '@core/components/mui/TextField'
import { verifyPassword } from '@/app/server/actions/auth'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

const AuthenticationDialog = ({ open, setOpen, onAuthenticated }) => {
    const { t } = useTranslation()
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleClose = () => {
        setOpen(false)
        setPassword('')
        setError('')
    }

    const handleSubmit = async e => {
        e.preventDefault()
        if (!password) {
            setError(t('validation.password_required'))
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await verifyPassword({ password })
            if (res.status) {
                onAuthenticated()
                handleClose()
            } else {
                setError(t(res.message))
            }
        } catch (err) {
            console.error(err)
            setError(t('validation.something_went_wrong'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth='sm'
            fullWidth
            PaperProps={{
                style: {
                    borderRadius: '6px',
                    padding: '0px'
                }
            }}
        >
            <DialogTitle sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='h5' component='span' sx={{ color: 'primary.text', fontWeight: '500' }}>
                    {t('authentication_password')}
                </Typography>
                <IconButton onClick={handleClose} size='small'>
                    <i className='tabler-x' />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
                <form onSubmit={handleSubmit}>
                    <Typography sx={{ mb: 1, color: 'primary.text', fontWeight: 500 }}>{t('password')}</Typography>
                    <CustomTextField
                        fullWidth
                        type='password'
                        placeholder={t('authentication_password')}
                        value={password}
                        onChange={e => {
                            setPassword(e.target.value)
                            setError('')
                        }}
                        error={!!error}
                        helperText={error}
                        sx={{ mb: 4 }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', gap: 2, mt: 4 }}>
                        <Button
                            variant='contained'
                            type='submit'
                            disabled={!password || loading}
                        >
                            {loading ? (
                                <div className='flex items-center gap-2'>
                                    <i className='tabler-loader animate-spin' />
                                    <span>{t('authenticating')}</span>
                                </div>
                            ) : (
                                t('authenticate')
                            )}
                        </Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AuthenticationDialog
