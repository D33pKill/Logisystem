// Funciones utilitarias para exportación
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

// Exportación a Excel (simula descarga de CSV/Excel)
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

// Exportación a PDF (simula generación de PDF con contenido HTML)
export function exportToPDF(content, filename = 'reporte') {
    // En producción usarías jsPDF o similar
    // Aquí simulamos con HTML to PDF básico
    const printWindow = window.open('', '', 'height=600,width=800')

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${filename}</title>
      <style>
        body {
          font-family: 'Inter', Arial, sans-serif;
          padding: 40px;
          color: #1e293b;
        }
        h1 {
          color: #0f172a;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 10px;
        }
        h2 {
          color: #334155;
          margin-top: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #cbd5e1;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #f1f5f9;
          font-weight: bold;
        }
        .metric {
          background: #f8fafc;
          border-left: 4px solid #2563eb;
          padding: 15px;
          margin: 10px 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #cbd5e1;
          font-size: 12px;
          color: #64748b;
        }
      </style>
    </head>
    <body>
      ${content}
      <div class="footer">
        <p>Generado el ${getCurrentDate()} | LogiSystem Enterprise - PRO IA</p>
        <p>Este reporte fue generado automáticamente por el sistema</p>
      </div>
      <script>
        window.onload = function() {
          window.print();
          setTimeout(() => window.close(), 500);
        }
      </script>
    </body>
    </html>
  `)

    printWindow.document.close()
}

// Generar contenido HTML para reportes PDF
export function generateFinancialReport(totals, transactions) {
    return `
    <h1>📊 Reporte Financiero Ejecutivo</h1>
    
    <h2>Resumen General</h2>
    <div class="metric">
      <strong>Facturación Total:</strong> ${formatCurrency(totals.income)}
    </div>
    <div class="metric">
      <strong>Gastos Operativos:</strong> ${formatCurrency(totals.expense)}
    </div>
    <div class="metric">
      <strong>Utilidad Neta:</strong> ${formatCurrency(totals.profit)}
    </div>
    
    <h2>Últimas Transacciones (${transactions.length} registros)</h2>
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Descripción</th>
          <th>Camión</th>
          <th>Tipo</th>
          <th>Monto</th>
        </tr>
      </thead>
      <tbody>
        ${transactions.slice(0, 20).map(t => `
          <tr>
            <td>${t.date}</td>
            <td>${t.description}</td>
            <td>${t.truck}</td>
            <td>${t.type === 'income' ? 'Ingreso' : 'Gasto'}</td>
            <td style="text-align: right">${formatCurrency(t.amount)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `
}
