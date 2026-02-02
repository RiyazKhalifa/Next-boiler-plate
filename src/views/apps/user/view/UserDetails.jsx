'use client'

import { useMemo } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import CustomAvatar from '@core/components/mui/Avatar'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { defaultLogo } from '@/configs/imageConfig'

const UserDetails = ({ viewUserDetails, setLoading }) => {
    const { t } = useTranslation()
    const router = useRouter()

    if (!viewUserDetails) {
        return <Typography>{t('user_not_found')}</Typography>
    }

    const imageSrc = useMemo(() => {
        return viewUserDetails.profile_image
            ? `${viewUserDetails.profile_image}?v=${new Date().getTime()}`
            : defaultLogo
    }, [viewUserDetails.profile_image])

    return (
        <>
            <Card>
                <CardContent className='flex flex-col gap-6'>
                    <div className='flex justify-start'>
                        <Button
                            variant='outlined'
                            color='primary'
                            onClick={() => {
                                setLoading(true)
                                setTimeout(() => {
                                    router.push('/users')
                                    setLoading(false)
                                }, 300)
                            }}
                        >
                            ← {t('back')}
                        </Button>
                    </div>
                    <div className='flex flex-col gap-6'>
                        <div className='flex items-center justify-center flex-col gap-4'>
                            <div className='flex flex-col items-center gap-4'>
                                <CustomAvatar
                                    alt='user-profile'
                                    src={imageSrc}
                                    variant='rounded'
                                    size={120}
                                />
                                <Typography variant='h5'>{`${viewUserDetails.name}`}</Typography>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Typography variant='h5'>{t('details')}</Typography>
                        <Divider className='mlb-4' />
                        <div className='flex flex-col gap-2'>
                            <div className='flex items-center flex-wrap gap-x-1.5'>
                                <Typography className='font-medium' color='text.primary'>
                                    {t('username')}:
                                </Typography>
                                <Typography>{viewUserDetails.name}</Typography>
                            </div>
                            <div className='flex items-center flex-wrap gap-x-1.5'>
                                <Typography className='font-medium' color='text.primary'>
                                    {t('email')}:
                                </Typography>
                                <Typography>{viewUserDetails.email}</Typography>
                            </div>
                            <div className='flex items-center flex-wrap gap-x-1.5'>
                                <Typography className='font-medium' color='text.primary'>
                                    {t('status')}:
                                </Typography>
                                <Typography
                                    sx={{
                                        color:
                                            viewUserDetails.status?.toLowerCase() === 'active'
                                                ? 'success.main'
                                                : 'error.main'
                                    }}
                                >
                                    {viewUserDetails.status?.toLowerCase() === 'active' ? 'Active' : 'Inactive'}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default UserDetails
