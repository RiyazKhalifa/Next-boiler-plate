'use client'

import { useState, useEffect } from 'react'
import { Grid, Button, Typography, Checkbox, FormGroup, FormControlLabel } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import { useTranslation } from 'react-i18next'

const PermissionListTable = ({ viewUserDetails, setLoading }) => {
    const { t } = useTranslation()
    const permissions = viewUserDetails?.role?.permissions || []
    const [selectedPermissions, setSelectedPermissions] = useState([])

    useEffect(() => {
        setSelectedPermissions(permissions.map(p => p.id))
    }, [permissions])

    const safePermissions = permissions || []
    const groupedPermissions = safePermissions.reduce((acc, perm) => {
        const [rawGroup] = perm.name.split('.')
        const group = rawGroup
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        if (!acc[group]) acc[group] = []
        acc[group].push(perm)

        return acc
    }, {})

    const togglePermission = permId => {
        setSelectedPermissions(prev => (prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]))
    }

    return (
        <div style={{ display: 'block' }} className='p-6 border rounded-md mb-6 bg-white shadow-md'>
            <Typography variant='h4' className='mb-4 pb-2 border-be'>
                {t('user_permissions')}
            </Typography>

            <form>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <div className='overflow-x-auto'>
                            <table className={tableStyles.table}>
                                <tbody>
                                    {Object.entries(groupedPermissions).map(([group, items], idx) => (
                                        <tr key={idx} className='border-be'>
                                            <td className='pis-0'>
                                                <Typography className='font-medium capitalize'>{group}</Typography>
                                            </td>
                                            <td className='!text-end pie-0'>
                                                <FormGroup row className='justify-end'>
                                                    {items.map(perm => (
                                                        <FormControlLabel
                                                            key={perm.id}
                                                            control={
                                                                <Checkbox
                                                                    checked={selectedPermissions.includes(perm.id)}
                                                                    onChange={() => togglePermission(perm.id)}
                                                                    disabled
                                                                />
                                                            }
                                                            label={
                                                                perm.name
                                                                    .split('.')
                                                                    .slice(1)
                                                                    .join(' ')
                                                                    .split(' ')
                                                                    .map(
                                                                        word =>
                                                                            word.charAt(0).toUpperCase() + word.slice(1)
                                                                    )
                                                                    .join(' ') || perm.name
                                                            }
                                                        />
                                                    ))}
                                                </FormGroup>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

export default PermissionListTable
