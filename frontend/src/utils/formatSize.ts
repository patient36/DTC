export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'

    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']

    if (bytes < 1) return `${bytes.toFixed(2)} B`

    const i = bytes < k ? 0 : Math.floor(Math.log(bytes) / Math.log(k))

    const unitIndex = Math.min(i, sizes.length - 1)

    return `${parseFloat((bytes / Math.pow(k, unitIndex)).toFixed(unitIndex > 0 ? 1 : 0))} ${sizes[unitIndex]}`
}