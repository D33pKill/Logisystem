// Funciones utilitarias simplificadas para Plan Básico
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ')
}

export function formatCurrency(value) {
  if (!value) return '$0'
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value) {
  if (!value) return '0'
  return new Intl.NumberFormat('es-CL').format(value)
}

export function getCurrentDate() {
  return new Date().toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

// Exportación básica a Excel (CSV)
export function exportToExcel(data, filename = 'datos') {
  // Convertir datos a CSV
  const headers = Object.keys(data[0] || {})
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header]
      // Escapar valores con comas
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`
      }
      return value
    }).join(','))
  ].join('\n')

  // Crear blob y descargar
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${Date.now()}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
