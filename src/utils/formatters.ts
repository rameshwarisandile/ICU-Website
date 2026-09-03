export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))

export const formatTime = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))

export const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value)

export const getStatusColor = (status: 'Stable' | 'Warning' | 'Critical') => {
  const map = {
    Stable: '#22c55e',
    Warning: '#f59e0b',
    Critical: '#ef4444',
  }

  return map[status]
}

export const getRiskPercent = (value: number) => `${Math.round(value)}%`
