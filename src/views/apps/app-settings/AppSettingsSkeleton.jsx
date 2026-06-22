'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Skeleton } from '@mui/material'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid2'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material'

const AppSettingsSkeleton = () => {
    return (
        <Card>
            <CardContent className='p-6'>
                {/* Header */}
                <div className='flex items-center gap-3 border-b pb-5 mb-6'>
                    <Skeleton variant='rounded' width={40} height={40} className='rounded-xl' />
                    <div className='flex flex-col flex-1 gap-1'>
                        <Skeleton variant='text' width={200} height={32} />
                        <Skeleton variant='text' width={250} height={20} />
                    </div>
                </div>

                <Grid container spacing={6}>
                    {/* App Versions Table */}
                    <Grid size={{ xs: 12 }}>
                        <Box className='border rounded'>
                            <TableContainer component={Paper} elevation={0}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><Skeleton variant='text' width='60%' /></TableCell>
                                            <TableCell><Skeleton variant='text' width='50%' /></TableCell>
                                            <TableCell align='center'><Skeleton variant='text' width='70%' /></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {[1, 2].map((index) => (
                                            <TableRow key={index}>
                                                <TableCell><Skeleton variant='text' width='40%' /></TableCell>
                                                <TableCell><Skeleton variant='rounded' height={40} /></TableCell>
                                                <TableCell align='center'><Skeleton variant='rounded' width={24} height={24} sx={{ mx: 'auto' }} /></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Grid>

                    {/* Maintenance Mode Table */}
                    <Grid size={{ xs: 12 }}>
                        <Box className='border rounded'>
                            <TableContainer component={Paper} elevation={0}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width={'50%'}><Skeleton variant='text' width='60%' /></TableCell>
                                            <TableCell align='center'><Skeleton variant='text' width='70%' /></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell><Skeleton variant='text' width='50%' /></TableCell>
                                            <TableCell align='center'><Skeleton variant='rounded' width={24} height={24} sx={{ mx: 'auto' }} /></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Grid>

                    {/* Action Buttons */}
                    <Grid size={{ xs: 12 }} className='flex gap-4 justify-end border-t pt-4'>
                        <Skeleton variant='rounded' width={100} height={40} />
                        <Skeleton variant='rounded' width={100} height={40} />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default AppSettingsSkeleton
