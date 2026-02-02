'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import CustomAvatar from '@core/components/mui/Avatar'
import { useTranslation } from 'react-i18next'
import { defaultLogo } from '@/configs/imageConfig'
import { useRouter } from 'next/navigation'

const CustomerDetails = ({ viewCustomerDetails, setLoading }) => {
    const { t } = useTranslation()
    const router = useRouter()

    if (!viewCustomerDetails) {
        return <Typography>{t('customer_not_found')}</Typography>
    }

    return (
        <>
            <Card>
                <CardHeader
                    title={t('customer_details')}
                    action={
                        <Button
                            variant='outlined'
                            color='secondary'
                            onClick={() => {
                                setLoading(true)
                                setTimeout(() => {
                                    router.push('/customers')
                                    setLoading(false)
                                }, 300)
                            }}
                            startIcon={<i className='tabler-arrow-left' />}
                        >
                            {t('back')}
                        </Button>
                    }
                    avatar={
                        <CustomAvatar skin='light' color='primary' variant='rounded'>
                            <i className='tabler-user text-xl' />
                        </CustomAvatar>
                    }
                    titleTypographyProps={{ className: 'text-lg font-medium' }}
                />
                <CardContent className='flex flex-col gap-6'>
                    <div className='flex items-center gap-4 bg-actionHover p-4 rounded-md'>
                        <CustomAvatar
                            alt='user-profile'
                            src={viewCustomerDetails.profile_image || defaultLogo}
                            variant='circular'
                            size={100}
                        />
                        <div className='flex flex-col'>
                            <Typography variant='h5' className='font-semibold'>{`${viewCustomerDetails.name}`}</Typography>
                            <Chip
                                label={viewCustomerDetails.status?.toLowerCase() === 'active' ? 'Active' : 'Inactive'}
                                color={viewCustomerDetails.status?.toLowerCase() === 'active' ? 'success' : 'error'}
                                variant='tonal'
                                size='small'
                                className='mt-2 w-fit uppercase'
                            />
                        </div>
                    </div>

                    <div>
                        <Typography variant='h6' className='mb-4'>{t('details')}</Typography>
                        <div className='flex flex-col gap-3'>
                            <div className='flex items-center gap-2'>
                                <i className='tabler-mail text-textSecondary' />
                                <Typography className='font-medium' color='text.primary'>
                                    {t('email')}:
                                </Typography>
                                <Typography color='text.secondary'>{viewCustomerDetails.email}</Typography>
                            </div>
                            <div className='flex items-center gap-2'>
                                <i className='tabler-phone text-textSecondary' />
                                <Typography className='font-medium' color='text.primary'>
                                    {t('phone')}:
                                </Typography>
                                <Typography color='text.secondary'>{viewCustomerDetails.phone}</Typography>
                            </div>
                            <div className='flex items-center gap-2'>
                                <i className='tabler-calendar text-textSecondary' />
                                <Typography className='font-medium' color='text.primary'>
                                    {t('registered_on')}:
                                </Typography>
                                <Typography color='text.secondary'>
                                    {new Date(viewCustomerDetails.created_at).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default CustomerDetails
