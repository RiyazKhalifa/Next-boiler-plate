'use client'

import { Dialog, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import CustomAvatar from '@core/components/mui/Avatar'

const DeleteConfirmationDialog = ({ open, handleClose, onConfirm, title, message }) => {
    const { t } = useTranslation()

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth='xs'
            aria-labelledby='delete-dialog-title'
            aria-describedby='delete-dialog-description'
            PaperProps={{
                sx: {
                    borderRadius: 'var(--mui-shape-customBorderRadius-lg)',
                    boxShadow: 'var(--mui-customShadows-lg)'
                }
            }}
        >
            <DialogContent className='flex flex-col items-center text-center p-12'>
                <CustomAvatar color='primary' skin='light' variant='rounded' size={70} className='mb-6'>
                    <i className='tabler-trash text-[40px]' />
                </CustomAvatar>
                <Typography variant='h5' className='mb-2 font-medium'>
                    {title}
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions className='justify-center pb-12 px-12'>
                <Box className='flex items-center gap-4'>
                    <Button
                        variant='tonal'
                        color='secondary'
                        onClick={handleClose}
                        className='min-is-[100px]'
                        size='medium'
                    >
                        {t('no_keep_it')}
                    </Button>
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={() => {
                            onConfirm()
                            handleClose()
                        }}
                        autoFocus
                        className='min-is-[100px]'
                        size='medium'
                    >
                        {t('yes_delete')}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteConfirmationDialog
