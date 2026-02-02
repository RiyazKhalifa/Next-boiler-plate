export function formatDate(dateString) {
    if (!dateString) return '-'
    const date = new Date(dateString)

    return date.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).replace(',', '')
}
