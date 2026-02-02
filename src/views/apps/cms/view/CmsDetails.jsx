'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'

const CmsDetails = ({ viewCmsDetails, setLoading }) => {
    const { t } = useTranslation()
    const router = useRouter()

    if (!viewCmsDetails) {
        return <Typography>{t('cms_not_found')}</Typography>
    }

    return (
        <>
            <Card className='w-full'>
                <CardContent className='p-6'>
                    <Button
                        variant='outlined'
                        color='primary'
                        className='mb-4'
                        onClick={() => {
                            setLoading(true)
                            setTimeout(() => {
                                router.push('/cms')
                                setLoading(false)
                            }, 300)
                        }}
                    >
                        ← {t('back')}
                    </Button>

                    <Typography variant='h5' className='font-bold mb-2'>
                        {viewCmsDetails.title}
                    </Typography>
                    <Divider className='mb-6' />

                    <div dangerouslySetInnerHTML={{ __html: viewCmsDetails.content }} />
                </CardContent>
            </Card>
        </>
    )
}

export default CmsDetails
