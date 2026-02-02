'use client'

import { useEffect, useState } from 'react'
import { InputAdornment } from '@mui/material'
import CustomTextField from '@core/components/mui/TextField'

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value, onChange, debounce])

    return (
        <CustomTextField
            {...props}
            value={value}
            onChange={e => setValue(e.target.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment position='start'>
                        <i className='tabler-search text-xl' />
                    </InputAdornment>
                )
            }}
        />
    )
}

export default DebouncedInput
