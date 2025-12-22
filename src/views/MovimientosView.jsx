import { useState, useMemo } from 'react'
import { Search, FileSpreadsheet, TrendingUp, TrendingDown, AlertTriangle, Calendar, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency, exportToExcel } from '../utils/helpers'

export default function MovimientosView({ transactions }) {
    const [searchQuery, setSearchQuery] = useState('')

    // Filtrar transacciones
    const filteredTransactions = useMemo(() => {
        if (!searchQuery) return transactions

        const query = searchQuery.toLowerCase()
        return transactions.filter(t =>
            t.description.toLowerCase().includes(query) ||
            t.truck.toLowerCase().includes(query) ||
            (t.complaintDetails?.folio || '').toLowerCase().includes(query)
        )
    }, [transactions, searchQuery])

    // Calcular resumen
    const summary = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
        const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
        return { income, expense, balance: income - expense }
    }, [transactions])

    const handleExport = () => {
        const exportData = transactions.map(t => ({
            Fecha: t.date,
            Tipo: t.type === 'income' ? 'Ingreso' : 'Gasto',
            Descripción: t.description,
            Camión: t.truck,
            Categoría: t.category || '-',
            Monto: t.amount,
            Reclamo: t.hasComplaint ? 'SÍ' : 'NO',
            Folio: t.complaintDetails?.folio || '-'
        }))

        exportToExcel(exportData, 'movimientos_logisystem')
        alert('✅ Movimientos exportados a Excel')
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header con Búsqueda */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar por folio, descripción o patente..."
                        className="w-full h-12 pl-11 pr-4 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    onClick={handleExport}
                    className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                >
                    <FileSpreadsheet className="w-5 h-5" />
                    <span className="hidden md:inline">Exportar Excel</span>
                </button>
            </div>

            {/* Resumen Financiero */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <p className="text-xs font-bold text-emerald-700 uppercase mb-1">Ingresos del mes</p>
                    <p className="text-2xl font-bold text-emerald-900 font-mono">{formatCurrency(summary.income)}</p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-xs font-bold text-red-700 uppercase mb-1">Gastos del mes</p>
                    <p className="text-2xl font-bold text-red-900 font-mono">{formatCurrency(summary.expense)}</p>
                </div>

                <div className={`${summary.balance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'} border rounded-lg p-4`}>
                    <p className={`text-xs font-bold ${summary.balance >= 0 ? 'text-blue-700' : 'text-orange-700'} uppercase mb-1`}>Saldo</p>
                    <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-900' : 'text-orange-900'} font-mono`}>
                        {formatCurrency(summary.balance)}
                    </p>
                </div>
            </div>

            {/* Listado Adaptativo */}
            <div>
                {/* Vista Mobile: Cards */}
                <div className="md:hidden space-y-3">
                    {filteredTransactions.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
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
                                className={`bg-white rounded-lg p-4 shadow-sm ${transaction.hasComplaint ? 'border-2 border-red-400' : 'border border-slate-200'
                                    }`}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        {transaction.type === 'income' ? (
                                            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                                                <TrendingDown className="w-5 h-5 text-red-600" />
                                            </div>
                                        )}

                                        <div>
                                            <p className="font-bold text-slate-800">{transaction.description}</p>
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <Calendar className="w-3 h-3" />
                                                {transaction.date}
                                            </div>
                                        </div>
                                    </div>

                                    <p className={`text-xl font-bold font-mono ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                                        }`}>
                                        {formatCurrency(transaction.amount)}
                                    </p>
                                </div>

                                {/* Details */}
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-1 text-slate-600">
                                        <Truck className="w-4 h-4" />
                                        {transaction.truck}
                                    </div>

                                    {transaction.hasComplaint && (
                                        <div className="flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded font-bold">
                                            <AlertTriangle className="w-4 h-4" />
                                            Reclamo #{transaction.complaintDetails.folio}
                                        </div>
                                    )}

                                    {transaction.category && (
                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                            {transaction.category}
                                        </span>
                                    )}
                                </div>

                                {/* Complaint Detail */}
                                {transaction.hasComplaint && transaction.complaintDetails.description && (
                                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                                        {transaction.complaintDetails.description}
                                    </div>
                                )}

                                {/* Fuel Details */}
                                {transaction.fuelDetails && (
                                    <div className="mt-2 flex gap-3 text-xs text-slate-600">
                                        {transaction.fuelDetails.liters > 0 && (
                                            <span>🛢️ {transaction.fuelDetails.liters} L</span>
                                        )}
                                        {transaction.fuelDetails.mileage > 0 && (
                                            <span>🚗 {transaction.fuelDetails.mileage} km</span>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Vista Desktop: Tabla */}
                <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Descripción</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Camión</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 uppercase">Monto</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        <p className="text-lg font-medium">No hay movimientos</p>
                                        <p className="text-sm">{searchQuery ? 'Intenta otra búsqueda' : 'Registra tu primer movimiento'}</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((transaction) => (
                                    <tr
                                        key={transaction.id}
                                        className={`hover:bg-slate-50 transition-colors ${transaction.hasComplaint ? 'bg-red-50' : ''
                                            }`}
                                    >
                                        <td className="px-6 py-4 text-sm text-slate-600">{transaction.date}</td>
                                        <td className="px-6 py-4">
                                            {transaction.type === 'income' ? (
                                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-bold">
                                                    <TrendingUp className="w-3 h-3" />
                                                    Ingreso
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-bold">
                                                    <TrendingDown className="w-3 h-3" />
                                                    Gasto
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-800">{transaction.description}</p>
                                            {transaction.category && (
                                                <p className="text-xs text-slate-500 mt-1">{transaction.category}</p>
                                            )}
                                            {transaction.fuelDetails && (
                                                <p className="text-xs text-blue-600 mt-1">
                                                    {transaction.fuelDetails.liters > 0 && `${transaction.fuelDetails.liters} L `}
                                                    {transaction.fuelDetails.mileage > 0 && `• ${transaction.fuelDetails.mileage} km`}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{transaction.truck}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font-bold font-mono ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                                                }`}>
                                                {formatCurrency(transaction.amount)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {transaction.hasComplaint ? (
                                                <div className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    Reclamo #{transaction.complaintDetails.folio}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-xs">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
