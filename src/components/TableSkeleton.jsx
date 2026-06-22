'use client'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from '@core/components/mui/TextField'
import tableStyles from '@core/styles/table.module.css'

const TableSkeleton = ({ columns = 5, rows = 5, title = 'Loading...' }) => {
    return (
        <Card>
            <CardHeader title={<Skeleton variant='text' width={150} height={32} />} className='pbe-4' />
            <div className='flex justify-between flex-col md:flex-row items-start md:items-center p-6 border-bs gap-4'>
                <Skeleton variant='rounded' width={80} height={40} />
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                    <Skeleton variant='rounded' width={320} height={40} />
                    <Skeleton variant='rounded' width={120} height={40} />
                </div>
            </div>

            <div className='overflow-x-auto'>
                <TableContainer component={Paper} elevation={0}>
                    <Table className={tableStyles.table}>
                        <TableHead>
                            <TableRow>
                                {[...Array(columns)].map((_, i) => (
                                    <TableCell key={i}>
                                        <Skeleton variant='text' width='60%' height={24} />
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[...Array(rows)].map((_, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {[...Array(columns)].map((_, colIndex) => (
                                        <TableCell key={colIndex}>
                                            <Skeleton variant='text' width='80%' height={24} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            {/* Pagination Skeleton */}
            <Box className='flex justify-between items-center p-6 border-bs'>
                <Skeleton variant='text' width={150} height={24} />
                <Skeleton variant='rounded' width={200} height={32} />
            </Box>
        </Card>
    )
}

export default TableSkeleton
