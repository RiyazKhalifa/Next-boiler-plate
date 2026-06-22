'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Skeleton } from '@mui/material'
import Grid from '@mui/material/Grid2'

const SiteSettingsSkeleton = () => {
    return (
        <Card>
            <CardContent className='p-6'>
                {/* Header */}
                <div className='flex items-center gap-3 border-b pb-5 mb-6'>
                    <Skeleton variant='rounded' width={40} height={40} className='rounded-xl' />
                    <div className='flex flex-col flex-1 gap-1'>
                        <Skeleton variant='text' width={150} height={32} />
                        <Skeleton variant='text' width={250} height={20} />
                    </div>
                </div>

                <Grid container spacing={6}>
                    {/* Settings Fields - 6 placeholders as an example */}
                    {[1, 2, 3, 4, 5, 6].map((index) => (
                        <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                            <div className='flex flex-col gap-1'>
                                <Skeleton variant='text' width='40%' height={20} />
                                <Skeleton variant='rounded' width='100%' height={56} />
                            </div>
                        </Grid>
                    ))}

                    {/* Action Buttons */}
                    <Grid size={{ xs: 12 }} className='flex gap-4 justify-end border-t pt-4 mt-4'>
                        <Skeleton variant='rounded' width={100} height={40} />
                        <Skeleton variant='rounded' width={100} height={40} />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default SiteSettingsSkeleton
