import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FileSpreadsheet, TrendingUp, TrendingDown, Calendar, Truck, AlertTriangle } from 'lucide-react'
import MovementDetailModal from '../components/MovementDetailModal'
import { formatCurrency, exportToExcel } from '../utils/helpers'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

export default function MovimientosView({ showToast }) {
    const { transactions } = useApp()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedMovement, setSelectedMovement] = useState(null)

    // Filtrar movimientos
    const filteredTransactions = useMemo(() => {
        const query = searchQuery.toLowerCase()
        return transactions.filter(t =>
            t.description.toLowerCase().includes(query) ||
            t.truck.toLowerCase().includes(query) ||
            (t.complaintDetails?.folio || '').toLowerCase().includes(query) ||
            (t.tags || '').toLowerCase().includes(query)
        )
    }, [transactions, searchQuery])

    // Calcular resumen
    const summary = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
        const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
        return { income, expense, balance: income - expense }
    }, [transactions])

    const handleExport = () => {
        const exportData = filteredTransactions.map(t => ({
            Fecha: t.date,
            Tipo: t.type === 'income' ? 'Ingreso' : 'Gasto',
            Descripción: t.description,
            Camión: t.truck,
            Categoría: t.category || '-',
            Etiquetas: t.tags || '-',
            Monto: t.amount,
            Reclamo: t.hasComplaint ? 'SÍ' : 'NO',
            Folio: t.complaintDetails?.folio || '-'
        }))

        exportToExcel(exportData, 'movimientos_logisystem')
        showToast('✅ Movimientos exportados a Excel', 'success')
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-6"
        >
            {/* Header con Búsqueda */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar por folio, descripción, patente o etiqueta..."
                        className="w-full h-12 pl-11 pr-4 border border-dark-border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-accent bg-dark-surface2 text-dark-text placeholder-dark-text2"
                    />
                </div>

                <motion.button
                    onClick={handleExport}
                    className="h-12 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FileSpreadsheet className="w-5 h-5" />
                    <span className="hidden md:inline">Exportar Excel</span>
                </motion.button>
            </div>

            {/* Resumen Financiero */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-dark border border-emerald-500/30 rounded-lg p-4"
                >
                    <p className="text-xs font-bold text-emerald-400 uppercase mb-1">Ingresos del mes</p>
                    <p className="text-2xl font-bold text-emerald-400 font-mono">{formatCurrency(summary.income)}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-dark border border-red-500/30 rounded-lg p-4"
                >
                    <p className="text-xs font-bold text-red-400 uppercase mb-1">Gastos del mes</p>
                    <p className="text-2xl font-bold text-red-400 font-mono">{formatCurrency(summary.expense)}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`glass-dark border ${summary.balance >= 0 ? 'border-emerald-500/30' : 'border-orange-500/30'} rounded-lg p-4`}
                >
                    <p className={`text-xs font-bold ${summary.balance >= 0 ? 'text-emerald-400' : 'text-orange-400'} uppercase mb-1`}>Saldo</p>
                    <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-emerald-400' : 'text-orange-400'} font-mono`}>
                        {formatCurrency(summary.balance)}
                    </p>
                </motion.div>
            </div>

            {/* Listado Adaptativo */}
            <div>
                {/* Vista Mobile: Cards */}
                <div className="md:hidden space-y-3">
                    {filteredTransactions.length === 0 ? (
                        <div className="text-center py-12 text-dark-text2">
                            <p className="text-lg font-medium">No hay movimientos</p>
                            <p className="text-sm">{searchQuery ? 'Intenta otra búsqueda' : 'Registra tu primer movimiento'}</p>
                        </div>
                    ) : (
                        filteredTransactions.map((transaction, index) => (
                            <motion.div
                                key={transaction.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedMovement(transaction)}
                                className={`glass-dark rounded-lg p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow ${transaction.hasComplaint ? 'border-2 border-red-500/50' : 'border border-dark-border'
                                    }`}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        {transaction.type === 'income' ? (
                                            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                                                <TrendingDown className="w-5 h-5 text-red-400" />
                                            </div>
                                        )}

                                        <div>
                                            <p className="font-bold text-dark-text">{transaction.description}</p>
                                            <div className="flex items-center gap-1 text-xs text-dark-text2">
                                                <Calendar className="w-3 h-3" />
                                                {transaction.date}
                                            </div>
                                        </div>
                                    </div>

                                    <p className={`text-xl font-bold font-mono ${transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                                        }`}>
                                        {formatCurrency(transaction.amount)}
                                    </p>
                                </div>

                                {/* Details */}
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-1 text-dark-text2">
                                        <Truck className="w-4 h-4" />
                                        {transaction.truck}
                                    </div>

                                    {transaction.hasComplaint && (
                                        <div className="flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-1 rounded font-bold">
                                            <AlertTriangle className="w-4 h-4" />
                                            Reclamo #{transaction.complaintDetails?.folio || 'N/A'}
                                        </div>
                                    )}

                                    {transaction.category && (
                                        <span className="text-xs bg-dark-surface2 text-dark-text2 px-2 py-1 rounded">
                                            {transaction.category}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Vista Desktop: Tabla */}
                <div className="hidden md:block glass-dark rounded-lg border border-dark-border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-dark-surface2 border-b border-dark-border">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-dark-text2 uppercase">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-dark-text2 uppercase">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-dark-text2 uppercase">Descripción</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-dark-text2 uppercase">Camión</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-dark-text2 uppercase">Monto</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-dark-text2 uppercase">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-dark-text2">
                                        <p className="text-lg font-medium">No hay movimientos</p>
                                        <p className="text-sm">{searchQuery ? 'Intenta otra búsqueda' : 'Registra tu primer movimiento'}</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((transaction) => (
                                    <tr
                                        key={transaction.id}
                                        onClick={() => setSelectedMovement(transaction)}
                                        className={`hover:bg-dark-surface2 transition-colors cursor-pointer ${transaction.hasComplaint ? 'bg-red-500/5' : ''
                                            }`}
                                    >
                                        <td className="px-6 py-4 text-sm text-dark-text2">{transaction.date}</td>
                                        <td className="px-6 py-4">
                                            {transaction.type === 'income' ? (
                                                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-bold">
                                                    <TrendingUp className="w-3 h-3" />
                                                    Ingreso
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold">
                                                    <TrendingDown className="w-3 h-3" />
                                                    Gasto
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-dark-text">{transaction.description}</p>
                                            {transaction.category && (
                                                <p className="text-xs text-dark-text2 mt-1">{transaction.category}</p>
                                            )}
                                            {transaction.fuelDetails && (
                                                <p className="text-xs text-accent mt-1">
                                                    {transaction.fuelDetails.liters > 0 && `${transaction.fuelDetails.liters} L `}
                                                    {transaction.fuelDetails.mileage > 0 && `• ${transaction.fuelDetails.mileage} km`}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-dark-text2">{transaction.truck}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font-bold font-mono ${transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                                                }`}>
                                                {formatCurrency(transaction.amount)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {transaction.hasComplaint ? (
                                                <div className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    Reclamo #{transaction.complaintDetails?.folio || 'N/A'}
                                                </div>
                                            ) : (
                                                <span className="text-dark-text2 text-xs">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Movement Detail Modal */}
            <AnimatePresence>
                {selectedMovement && (
                    <MovementDetailModal
                        movement={selectedMovement}
                        onClose={() => setSelectedMovement(null)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    )
}
