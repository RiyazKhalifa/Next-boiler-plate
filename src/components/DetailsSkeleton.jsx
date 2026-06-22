'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'

const DetailsSkeleton = () => {
    return (
        <Card>
            <CardContent className='flex flex-col gap-6'>
                <div className='flex justify-start'>
                    <Skeleton variant='rounded' width={100} height={40} />
                </div>

                <div className='flex flex-col gap-6'>
                    <div className='flex items-center justify-center flex-col gap-4'>
                        <Skeleton variant='rounded' width={120} height={120} className='rounded-xl' />
                        <Skeleton variant='text' width={200} height={32} />
                    </div>
                </div>

                <div>
                    <Skeleton variant='text' width={100} height={32} className='mb-4' />
                    <Divider />
                    <Box className='flex flex-col gap-4 mt-4'>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className='flex gap-2 items-center'>
                                <Skeleton variant='text' width={100} height={20} />
                                <Skeleton variant='text' width={200} height={20} />
                            </div>
                        ))}
                    </Box>
                </div>
            </CardContent>
        </Card>
    )
}

export default DetailsSkeleton
