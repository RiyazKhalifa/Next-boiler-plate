'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'

const FaqDetails = ({ viewFaqDetails, setLoading }) => {
    const { t } = useTranslation()
    const router = useRouter()

    if (!viewFaqDetails) {
        return <Typography>{t('faq_not_found')}</Typography>
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
                                router.push('/faqs')
                                setLoading(false)
                            }, 300)
                        }}
                    >
                        ← {t('back')}
                    </Button>

                    <Typography variant='h5' className='font-bold mb-2'>
                        {viewFaqDetails.question}
                    </Typography>
                    <Divider className='mb-6' />

                    <div dangerouslySetInnerHTML={{ __html: viewFaqDetails.answer }} />
                </CardContent>
            </Card>
        </>
    )
}

export default FaqDetails
