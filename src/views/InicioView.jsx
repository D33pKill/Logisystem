import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { TrendingUp, TrendingDown, DollarSign, Users, Truck, FileSpreadsheet, Download, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function InicioView({ onNavigate }) {
    const { transactions, employees, trucks } = useApp()
    const [isExporting, setIsExporting] = useState(false)

    const totalIngresos = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

    const totalGastos = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

    const balance = totalIngresos - totalGastos

    const totalEmpleados = employees.length
    const totalCamiones = trucks.length

    // Obtener incidencias reales de las transacciones
    const incidenciasDisplay = transactions
        .filter(t => t.hasComplaint && t.complaintDetails)
        .slice(0, 3)
        .map(t => ({
            id: t.id,
            fecha: t.date,
            ruta: t.routeId || 'N/A',
            tipo: t.complaintDetails?.incidence_type || 'Merma',
            descripcion: t.complaintDetails?.description || 'Sin descripción',
            patente: t.truck,
            responsable: t.complaintDetails?.responsible || 'N/A',
            folio: t.complaintDetails?.folio || 'N/A',
            item_count: t.complaintDetails?.item_count || null
        }))

    const handleExportExcel = async () => {
        setIsExporting(true)
        toast.loading('Generando reporte CSV...', { id: 'export' })

        // Obtener todas las incidencias (no solo las 3 últimas)
        const todasLasIncidencias = transactions
            .filter(t => t.hasComplaint && t.complaintDetails)
            .map(t => ({
                Fecha: t.date,
                Ruta: t.routeId || 'N/A',
                Tipo: t.complaintDetails?.incidence_type || 'Merma',
                Descripción: t.complaintDetails?.description || 'Sin descripción',
                Patente: t.truck,
                Responsable: t.complaintDetails?.responsible || 'N/A',
                Folio: t.complaintDetails?.folio || 'N/A',
                'Cantidad Afectada': t.complaintDetails?.item_count || '',
                Monto: t.amount,
                'Cuenta': t.accountName || 'N/A'
            }))

        // Si no hay incidencias, crear un array vacío con headers
        const exportData = todasLasIncidencias.length > 0 
            ? todasLasIncidencias 
            : [{
                Fecha: '',
                Ruta: '',
                Tipo: '',
                Descripción: 'No hay incidencias registradas',
                Patente: '',
                Responsable: '',
                Folio: '',
                'Cantidad Afectada': '',
                Monto: '',
                'Cuenta': ''
            }]

        // Generar CSV
        const headers = Object.keys(exportData[0] || {})
        const csvContent = [
            headers.join(','),
            ...exportData.map(row => 
                headers.map(header => {
                    const value = row[header] || ''
                    // Escapar valores con comas o comillas
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                        return `"${value.replace(/"/g, '""')}"`
                    }
                    return value
                }).join(',')
            )
        ].join('\n')

        // Crear blob y descargar
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)

        link.setAttribute('href', url)
        link.setAttribute('download', `reporte-incidencias-${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast.success(`Reporte descargado correctamente (${todasLasIncidencias.length} incidencias)`, { id: 'export' })
        setIsExporting(false)
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15
            }
        }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto pb-24"
        >
            <motion.div variants={itemVariants} className="mb-8">
                <h1 className="text-3xl font-bold text-dark-text mb-2">Dashboard</h1>
                <p className="text-dark-text2">Resumen general de la operación</p>
            </motion.div>

            {/* Accesos Rápidos - Administración - Adaptativo para Fold */}
            <div className="grid grid-cols-1 fold:grid-cols-2 gap-4 mb-6">
                <motion.button
                    variants={itemVariants}
                    onClick={() => onNavigate && onNavigate('personal')}
                    className="glass-dark p-6 rounded-2xl border border-dark-border shadow-lg hover:shadow-xl transition-all text-left group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent-light/20 flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent-light/30 transition-colors">
                            <Users className="w-6 h-6 text-accent" />
                        </div>
                        <span className="text-xs font-bold text-dark-text2 uppercase">Administración</span>
                    </div>
                    <h3 className="text-xl font-bold text-dark-text mb-1">Personal</h3>
                    <p className="text-sm text-dark-text2 mb-2">Gestión de Recursos Humanos</p>
                    <p className="text-lg font-bold text-accent">
                        {totalEmpleados} {totalEmpleados === 1 ? 'empleado' : 'empleados'}
                    </p>
                </motion.button>

                <motion.button
                    variants={itemVariants}
                    onClick={() => onNavigate && onNavigate('flota')}
                    className="glass-dark p-6 rounded-2xl border border-dark-border shadow-lg hover:shadow-xl transition-all text-left group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-dark-surface2 flex items-center justify-center group-hover:bg-dark-border/20 transition-colors">
                            <Truck className="w-6 h-6 text-dark-text" />
                        </div>
                        <span className="text-xs font-bold text-dark-text2 uppercase">Administración</span>
                    </div>
                    <h3 className="text-xl font-bold text-dark-text mb-1">Flota</h3>
                    <p className="text-sm text-dark-text2 mb-2">Gestión de Camiones</p>
                    <p className="text-lg font-bold text-dark-text">
                        {totalCamiones} {totalCamiones === 1 ? 'camión' : 'camiones'}
                    </p>
                </motion.button>
            </div>

            {/* KPIs Grid - Tarjetas de Resumen - Adaptativo para Fold */}
            <motion.div 
                className="grid grid-cols-1 fold:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
                layout
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
                <motion.div 
                    variants={itemVariants} 
                    className="glass-dark p-6 rounded-2xl border border-dark-border shadow-lg hover:shadow-xl transition-all group"
                    whileHover={{ scale: 1.02, y: -2 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                            <TrendingUp className="w-7 h-7 text-emerald-500" />
                        </div>
                        <span className="text-xs font-bold text-dark-text2 uppercase tracking-wider">Ingresos</span>
                    </div>
                    <motion.p 
                        className="text-4xl font-bold text-emerald-500 mb-1"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        ${totalIngresos.toLocaleString('es-CL')}
                    </motion.p>
                    <p className="text-xs text-dark-text2">Total acumulado</p>
                </motion.div>

                <motion.div 
                    variants={itemVariants} 
                    className="glass-dark p-6 rounded-2xl border border-dark-border shadow-lg hover:shadow-xl transition-all group"
                    whileHover={{ scale: 1.02, y: -2 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 rounded-xl bg-rose-500/20 flex items-center justify-center group-hover:bg-rose-500/30 transition-colors">
                            <TrendingDown className="w-7 h-7 text-rose-500" />
                        </div>
                        <span className="text-xs font-bold text-dark-text2 uppercase tracking-wider">Gastos</span>
                    </div>
                    <motion.p 
                        className="text-4xl font-bold text-rose-500 mb-1"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        ${totalGastos.toLocaleString('es-CL')}
                    </motion.p>
                    <p className="text-xs text-dark-text2">Total acumulado</p>
                </motion.div>

                <motion.div 
                    variants={itemVariants} 
                    className="glass-dark p-6 rounded-2xl border border-dark-border shadow-lg hover:shadow-xl transition-all group"
                    whileHover={{ scale: 1.02, y: -2 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                            <DollarSign className="w-7 h-7 text-amber-500" />
                        </div>
                        <span className="text-xs font-bold text-dark-text2 uppercase tracking-wider">Balance</span>
                    </div>
                    <motion.p 
                        className={`text-4xl font-bold mb-1 ${balance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        ${balance.toLocaleString('es-CL')}
                    </motion.p>
                    <p className="text-xs text-dark-text2">
                        {balance >= 0 ? 'Ganancia neta' : 'Pérdida neta'}
                    </p>
                </motion.div>
            </motion.div>

            {/* Sección de Incidencias y Exportación */}
            <motion.div variants={itemVariants} className="glass-dark rounded-2xl border border-dark-border shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <h2 className="text-xl font-bold text-dark-text">Últimas Incidencias</h2>
                    </div>
                    <motion.button
                        onClick={handleExportExcel}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent to-accent-light text-white rounded-xl font-semibold text-sm shadow-lg shadow-accent/30 hover:shadow-accent/50 transition-all disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isExporting ? (
                            <>
                                <FileSpreadsheet className="w-4 h-4 animate-pulse" />
                                <span>Generando...</span>
                            </>
                        ) : (
                            <>
                                <FileSpreadsheet className="w-4 h-4" />
                                <Download className="w-4 h-4" />
                                <span>Exportar Reporte (Excel)</span>
                            </>
                        )}
                    </motion.button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-border">
                                <th className="text-left py-3 px-4 text-xs font-bold text-dark-text2 uppercase">Fecha</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-dark-text2 uppercase">Ruta</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-dark-text2 uppercase">Tipo</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-dark-text2 uppercase hidden fold:table-cell">Descripción</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-dark-text2 uppercase">Patente</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-dark-text2 uppercase hidden lg:table-cell">Responsable</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incidenciasDisplay.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 px-4 text-center text-dark-text2">
                                        <p className="text-sm">No hay incidencias registradas</p>
                                    </td>
                                </tr>
                            ) : (
                                incidenciasDisplay.map((incidencia, index) => (
                                <motion.tr
                                    key={incidencia.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="border-b border-dark-border/50 hover:bg-dark-surface2/50 transition-colors"
                                >
                                    <td className="py-3 px-4 text-sm text-dark-text">{new Date(incidencia.fecha).toLocaleDateString('es-CL')}</td>
                                    <td className="py-3 px-4 text-sm font-mono text-dark-text">{incidencia.ruta}</td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
                                            {incidencia.tipo}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-dark-text2 hidden fold:table-cell">{incidencia.descripcion}</td>
                                    <td className="py-3 px-4 text-sm font-mono text-dark-text">{incidencia.patente}</td>
                                    <td className="py-3 px-4 text-sm text-dark-text2 hidden lg:table-cell">{incidencia.responsable || 'N/A'}</td>
                                </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Movimientos Recientes */}
            <motion.div variants={itemVariants} className="glass-dark rounded-2xl border border-dark-border shadow-lg p-6">
                <h2 className="text-xl font-bold text-dark-text mb-4">Movimientos Recientes</h2>
                <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction, index) => (
                        <motion.div
                            key={transaction.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-dark-surface2 rounded-xl border border-dark-border hover:border-dark-border/80 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    transaction.type === 'income' 
                                        ? 'bg-emerald-500/20' 
                                        : 'bg-red-500/20'
                                }`}>
                                    {transaction.type === 'income' ? (
                                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                                    ) : (
                                        <TrendingDown className="w-5 h-5 text-red-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-dark-text text-sm">
                                        {transaction.description}
                                    </p>
                                    <p className="text-xs text-dark-text2">
                                        {new Date(transaction.date).toLocaleDateString('es-CL')} • {transaction.truck}
                                    </p>
                                </div>
                            </div>
                            <p className={`font-bold ${
                                transaction.type === 'income' 
                                    ? 'text-emerald-400' 
                                    : 'text-red-400'
                            }`}>
                                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString('es-CL')}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}
