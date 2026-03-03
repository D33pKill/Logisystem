/**
 * useLiquidacionPDF
 * Genera y abre una ventana de impresión con la liquidación mensual de un chofer.
 * No requiere dependencias externas — usa window.open + window.print().
 */

const fmt = (n) => `$${Number(n || 0).toLocaleString('es-CL')}`
const fmtFecha = (dateStr) => {
    if (!dateStr) return '—'
    try {
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-CL', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        })
    } catch { return dateStr }
}

/**
 * @param {Object} empleado  — datos del trabajador
 * @param {Array}  fletesEmp — fletes del mes de este chofer
 * @param {Array}  abonosEmp — abonos/adelantos del mes
 * @param {string} mes       — 'YYYY-MM'
 * @param {Object} maestros  — tablas maestras (tiposOperacion)
 */
export function generarLiquidacionPDF({ empleado, fletesEmp, abonosEmp, mes, maestros }) {
    const [anio, mesNum] = mes.split('-')
    const mesLabel = new Date(`${mes}-01T00:00:00`).toLocaleDateString('es-CL', {
        month: 'long', year: 'numeric'
    })

    const tiposOp = maestros?.tiposOperacion || []
    const getTipoNombre = (id) => tiposOp.find(t => t.id === id)?.nombre || '—'

    const totalFletes = fletesEmp.reduce((s, f) => s + (f.montoCliente || 0), 0)
    const totalAbonos = abonosEmp.reduce((s, a) => s + (a.monto || 0), 0)
    const totalLiquido = totalFletes - totalAbonos

    // ── Filas de tabla Fletes ──────────────────────────────────────────────────
    const filasFlete = fletesEmp.length > 0
        ? fletesEmp.map(f => `
            <tr>
                <td>${fmtFecha(f.fecha)}</td>
                <td>${f.folio || '—'}</td>
                <td>${f.patente || '—'}</td>
                <td>${getTipoNombre(f.tipoOperacionId)}</td>
                <td class="monto">${fmt(f.montoCliente)}</td>
            </tr>`).join('')
        : `<tr><td colspan="5" class="sin-mov">Sin movimientos en el período</td></tr>`

    // ── Filas de tabla Abonos ─────────────────────────────────────────────────
    const filasAbono = abonosEmp.length > 0
        ? abonosEmp.map(a => `
            <tr>
                <td>${fmtFecha(a.fecha)}</td>
                <td>${a.descripcion || 'Anticipo'}</td>
                <td class="monto">${fmt(a.monto)}</td>
            </tr>`).join('')
        : `<tr><td colspan="3" class="sin-mov">Sin abonos en el período</td></tr>`

    // ── HTML completo ─────────────────────────────────────────────────────────
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<title>Liquidación — ${empleado.nombre} — ${mesLabel}</title>
<style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 11pt;
        color: #111;
        background: #fff;
        padding: 28px 36px;
        line-height: 1.4;
    }

    /* ── ENCABEZADO ── */
    .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 2px solid #000;
        padding-bottom: 12px;
        margin-bottom: 14px;
    }
    .empresa-nombre { font-size: 16pt; font-weight: 900; letter-spacing: -0.5px; }
    .empresa-sub    { font-size: 9pt; color: #555; margin-top: 2px; }
    .titulo-doc     { font-size: 14pt; font-weight: bold; text-align: right; }
    .titulo-mes     { font-size: 10pt; color: #555; text-align: right; text-transform: capitalize; }

    /* ── DATOS DEL CHOFER ── */
    .ficha {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 6px 24px;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 12px 16px;
        margin-bottom: 18px;
        background: #f9f9f9;
    }
    .ficha-item label  { font-size: 8pt; color: #666; display: block; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
    .ficha-item span   { font-size: 11pt; font-weight: bold; color: #111; }

    /* ── SECCIONES ── */
    .seccion-title {
        font-size: 10pt;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
        border-bottom: 1.5px solid #000;
        padding-bottom: 4px;
        margin-bottom: 8px;
        margin-top: 18px;
    }

    /* ── TABLAS ── */
    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 10pt;
        margin-bottom: 6px;
    }
    thead tr { background: #111; color: #fff; }
    thead th { padding: 6px 8px; text-align: left; font-weight: bold; font-size: 9pt; }
    tbody tr:nth-child(even) { background: #f5f5f5; }
    tbody td { padding: 5px 8px; border-bottom: 1px solid #e0e0e0; }
    .monto { text-align: right; font-weight: 600; }
    .sin-mov { text-align: center; color: #888; font-style: italic; padding: 14px 0; }

    /* ── TOTALES ── */
    .totales {
        margin-top: 16px;
        border: 2px solid #111;
        border-radius: 4px;
        overflow: hidden;
    }
    .totales table { margin: 0; }
    .totales thead tr { background: #333; }
    .totales tbody td { padding: 7px 12px; font-size: 11pt; }
    .totales .liquido { font-size: 13pt; font-weight: 900; background: #111 !important; color: #fff; }
    .totales .liquido td { color: #fff; padding: 9px 12px; }
    .totales .negativo td { color: #cc0000; }

    /* ── FIRMAS ── */
    .firmas {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 32px;
        margin-top: 52px;
    }
    .firma-bloque { text-align: center; }
    .firma-linea  { border-top: 1.5px solid #444; padding-top: 6px; font-size: 10pt; font-weight: bold; }
    .firma-sub    { font-size: 8pt; color: #777; margin-top: 2px; }

    /* ── FOOTER ── */
    .footer-doc { margin-top: 28px; font-size: 8pt; color: #aaa; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 8px; }

    @media print {
        body { padding: 0; }
        @page { margin: 18mm 20mm; }
    }
</style>
</head>
<body>

<!-- ENCABEZADO EMPRESA -->
<div class="header">
    <div>
        <p class="empresa-nombre">Transportes López Ltda.</p>
        <p class="empresa-sub">RUT: 76.XXX.XXX-X &nbsp;|&nbsp; Reg. de Comercio: XXXX</p>
        <p class="empresa-sub">contacto@transporteslopez.cl</p>
    </div>
    <div>
        <p class="titulo-doc">LIQUIDACIÓN DE HABERES</p>
        <p class="titulo-mes">${mesLabel}</p>
        <p style="font-size:8pt;color:#999;text-align:right;margin-top:4px;">Emitido: ${new Date().toLocaleDateString('es-CL')}</p>
    </div>
</div>

<!-- DATOS DEL CHOFER -->
<div class="ficha">
    <div class="ficha-item">
        <label>Trabajador</label>
        <span>${empleado.nombre}</span>
    </div>
    <div class="ficha-item">
        <label>RUT</label>
        <span>${empleado.rut || '—'}</span>
    </div>
    <div class="ficha-item">
        <label>Cargo</label>
        <span>${empleado.cargo || '—'}</span>
    </div>
    <div class="ficha-item">
        <label>Tipo Contrato</label>
        <span>${empleado.tipoContrato === 'planta' ? 'Planta' : 'Externo'}</span>
    </div>
    <div class="ficha-item">
        <label>Teléfono</label>
        <span>${empleado.telefono || '—'}</span>
    </div>
    <div class="ficha-item">
        <label>Período</label>
        <span style="text-transform:capitalize">${mesLabel}</span>
    </div>
</div>

<!-- TABLA FLETES -->
<p class="seccion-title">Detalle de Fletes / Rutas</p>
<table>
    <thead>
        <tr>
            <th>Fecha</th>
            <th>Folio</th>
            <th>Patente</th>
            <th>Tipo de Operación</th>
            <th style="text-align:right">Valor</th>
        </tr>
    </thead>
    <tbody>
        ${filasFlete}
    </tbody>
</table>

<!-- TABLA ABONOS -->
<p class="seccion-title">Abonos / Adelantos Entregados</p>
<table>
    <thead>
        <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th style="text-align:right">Monto</th>
        </tr>
    </thead>
    <tbody>
        ${filasAbono}
    </tbody>
</table>

<!-- TOTALES -->
<div class="totales" style="margin-top:20px">
    <table>
        <tbody>
            <tr>
                <td style="font-weight:600">Total Bruto Fletes</td>
                <td class="monto">${fmt(totalFletes)}</td>
            </tr>
            <tr>
                <td style="font-weight:600">Total Abonos / Adelantos</td>
                <td class="monto">- ${fmt(totalAbonos)}</td>
            </tr>
            <tr class="liquido ${totalLiquido < 0 ? 'negativo' : ''}">
                <td style="color:#fff;font-size:13pt;font-weight:900">TOTAL LÍQUIDO A PAGAR</td>
                <td class="monto" style="color:#fff;font-size:13pt;font-weight:900">${fmt(totalLiquido)}</td>
            </tr>
        </tbody>
    </table>
</div>

<!-- FIRMAS -->
<div class="firmas">
    <div class="firma-bloque">
        <div style="height:48px"></div>
        <div class="firma-linea">${empleado.nombre}</div>
        <div class="firma-sub">Firma Trabajador — ${empleado.rut || ''}</div>
    </div>
    <div class="firma-bloque">
        <div style="height:48px"></div>
        <div class="firma-linea">Administración</div>
        <div class="firma-sub">Firma y Timbre Empresa</div>
    </div>
</div>

<!-- FOOTER -->
<p class="footer-doc">
    Documento generado por LogiSystem · ${new Date().toLocaleString('es-CL')} · Este documento tiene validez solo con firma y timbre de la empresa.
</p>

<script>
    window.onload = function() {
        setTimeout(function() { window.print(); }, 400);
    };
</script>
</body>
</html>`

    // Abrir ventana nueva con el HTML
    const ventana = window.open('', '_blank', 'width=900,height=700,scrollbars=yes')
    if (!ventana) {
        alert('Tu navegador bloqueó la ventana emergente. Por favor, permite las ventanas emergentes para este sitio.')
        return
    }
    ventana.document.write(html)
    ventana.document.close()
}
