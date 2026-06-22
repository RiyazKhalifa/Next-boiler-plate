'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Grid from '@mui/material/Grid2'

const FormSkeleton = ({ fields = 4 }) => {
    return (
        <Card>
            <CardContent className='p-6'>
                {/* Header Shimmer */}
                <div className='flex items-center gap-3 border-b pb-5 mb-6'>
                    <Skeleton variant='rounded' width={40} height={40} className='rounded-xl' />
                    <div className='flex flex-col flex-1 gap-1'>
                        <Skeleton variant='text' width={150} height={28} />
                        <Skeleton variant='text' width={220} height={18} />
                    </div>
                </div>

                <Grid container spacing={6}>
                    {Array.from({ length: fields }).map((_, index) => (
                        <Grid key={index} size={{ xs: 12, sm: 12, md: 6 }}>
                            <Skeleton variant='text' width={80} height={20} className='mb-2' />
                            <Skeleton variant='rounded' height={50} />
                        </Grid>
                    ))}

                    <Grid size={{ xs: 12 }} className='flex items-center flex-row-reverse gap-4 mt-4 border-t pt-4'>
                        <Skeleton variant='rounded' width={100} height={40} />
                        <Skeleton variant='rounded' width={100} height={40} />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default FormSkeleton
