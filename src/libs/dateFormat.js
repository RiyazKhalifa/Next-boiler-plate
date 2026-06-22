export function formatDate(dateString) {
    if (!dateString) return '-'
    const date = new Date(dateString)
    const format = process.env.NEXT_PUBLIC_DATE_FORMAT || 'MMM DD, YYYY, HH:mm:ss'

    const map = {
        'YYYY': date.getFullYear(),
        'MM': String(date.getMonth() + 1).padStart(2, '0'),
        'DD': String(date.getDate()).padStart(2, '0'),
        'HH': String(date.getHours()).padStart(2, '0'),
        'mm': String(date.getMinutes()).padStart(2, '0'),
        'ss': String(date.getSeconds()).padStart(2, '0'),
        'MMM': date.toLocaleString('en-US', { month: 'short' })
    }

    return Object.keys(map).reduce((acc, key) => acc.replace(key, map[key]), format)
}
