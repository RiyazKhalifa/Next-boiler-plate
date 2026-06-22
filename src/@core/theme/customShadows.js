const customShadows = mode => {
    return {
        xs: `0px 1px 6px rgb(var(--mui-mainColorChannels-${mode}Shadow) / ${mode === 'light' ? 0.05 : 0.08})`,
        sm: `0px 2px 8px rgb(var(--mui-mainColorChannels-${mode}Shadow) / ${mode === 'light' ? 0.06 : 0.1})`,
        md: `0px 3px 12px rgb(var(--mui-mainColorChannels-${mode}Shadow) / ${mode === 'light' ? 0.07 : 0.12})`,
        lg: `0px 4px 18px rgb(var(--mui-mainColorChannels-${mode}Shadow) / ${mode === 'light' ? 0.08 : 0.14})`,
        xl: `0px 5px 30px rgb(var(--mui-mainColorChannels-${mode}Shadow) / ${mode === 'light' ? 0.1 : 0.16})`,
        primary: {
            sm: '0px 2px 6px rgb(var(--mui-palette-primary-mainChannel) / 0.15)',
            md: '0px 4px 16px rgb(var(--mui-palette-primary-mainChannel) / 0.2)',
            lg: '0px 6px 20px rgb(var(--mui-palette-primary-mainChannel) / 0.25)'
        },
        secondary: {
            sm: '0px 2px 6px rgb(var(--mui-palette-secondary-mainChannel) / 0.15)',
            md: '0px 4px 16px rgb(var(--mui-palette-secondary-mainChannel) / 0.2)',
            lg: '0px 6px 20px rgb(var(--mui-palette-secondary-mainChannel) / 0.25)'
        },
        error: {
            sm: '0px 2px 6px rgb(var(--mui-palette-error-mainChannel) / 0.15)',
            md: '0px 4px 16px rgb(var(--mui-palette-error-mainChannel) / 0.2)',
            lg: '0px 6px 20px rgb(var(--mui-palette-error-mainChannel) / 0.25)'
        },
        warning: {
            sm: '0px 2px 6px rgb(var(--mui-palette-warning-mainChannel) / 0.15)',
            md: '0px 4px 16px rgb(var(--mui-palette-warning-mainChannel) / 0.2)',
            lg: '0px 6px 20px rgb(var(--mui-palette-warning-mainChannel) / 0.25)'
        },
        info: {
            sm: '0px 2px 6px rgb(var(--mui-palette-info-mainChannel) / 0.15)',
            md: '0px 4px 16px rgb(var(--mui-palette-info-mainChannel) / 0.2)',
            lg: '0px 6px 20px rgb(var(--mui-palette-info-mainChannel) / 0.25)'
        },
        success: {
            sm: '0px 2px 6px rgb(var(--mui-palette-success-mainChannel) / 0.15)',
            md: '0px 4px 16px rgb(var(--mui-palette-success-mainChannel) / 0.2)',
            lg: '0px 6px 20px rgb(var(--mui-palette-success-mainChannel) / 0.25)'
        }
    }
}

export default customShadows
