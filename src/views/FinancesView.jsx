import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, FileSpreadsheet, FileText } from 'lucide-react'
import { formatCurrency, exportToExcel, exportToPDF, generateFinancialReport } from '../utils/helpers'
import { initialTransactions } from '../data/mockData'

export default function FinancesView({ transactions: newTransactions = [], demoMode = 'pro' }) {
    const allTransactions = useMemo(() => {
        return [...newTransactions, ...initialTransactions]
    }, [newTransactions])

    const summary = useMemo(() => {
        const income = allTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
        const expense = allTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
        return { income, expense, balance: income - expense }
    }, [allTransactions])

    const handleExportExcel = () => {
        if (demoMode !== 'pro') {
            alert('⚠️ La exportación a Excel está disponible solo en el Plan PRO IA')
            return
        }

        const exportData = allTransactions.map(t => ({
            ID: String(t.id).padStart(4, '0'),
            Fecha: t.date,
            Descripción: t.description,
            Camión: t.truck,
            Tipo: t.type === 'income' ? 'Ingreso' : 'Gasto',
            Debe: t.type === 'expense' ? t.amount : 0,
            Haber: t.type === 'income' ? t.amount : 0,
            Monto: t.amount
        }))

        exportToExcel(exportData, 'libro_mayor_logisystem')
        alert('✅ Exportación a Excel completada')
    }

    const handleExportPDF = () => {
        if (demoMode !== 'pro') {
            alert('⚠️ La exportación a PDF está disponible solo en el Plan PRO IA')
            return
        }

        const reportContent = generateFinancialReport(summary, allTransactions)
        exportToPDF(reportContent, 'reporte_financiero_logisystem')
    }

    // MODO BÁSICO: Solo tabla plana
    if (demoMode === 'basic') {
        return (
            <div className="max-w-[1600px] mx-auto">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Finanzas</h2>

                <div className="bg-white border border-slate-400 mb-4 p-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <div className="text-slate-600">Total Ingresos:</div>
                            <div className="font-mono font-bold">{formatCurrency(summary.income)}</div>
                        </div>
                        <div>
                            <div className="text-slate-600">Total Gastos:</div>
                            <div className="font-mono font-bold">{formatCurrency(summary.expense)}</div>
                        </div>
                        <div>
                            <div className="text-slate-600">Saldo:</div>
                            <div className="font-mono font-bold">{formatCurrency(summary.balance)}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-400">
                    <div className="bg-slate-200 px-4 py-2 border-b border-slate-400">
                        <h3 className="font-bold text-slate-800">Libro Mayor</h3>
                    </div>
                    <table className="w-full text-xs border-collapse">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="border border-slate-400 px-2 py-1 text-left">ID</th>
                                <th className="border border-slate-400 px-2 py-1 text-left">Fecha</th>
                                <th className="border border-slate-400 px-2 py-1 text-left">Descripción</th>
                                <th className="border border-slate-400 px-2 py-1 text-right">Debe</th>
                                <th className="border border-slate-400 px-2 py-1 text-right">Haber</th>
                                <th className="border border-slate-400 px-2 py-1 text-right">Saldo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allTransactions.map((transaction, index) => {
                                const runningBalance = allTransactions
                                    .slice(0, index + 1)
                                    .reduce((balance, t) => balance + (t.type === 'income' ? t.amount : -t.amount), 0)

                                return (
                                    <tr key={transaction.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                        <td className="border border-slate-400 px-2 py-1 font-mono">{String(transaction.id).padStart(4, '0')}</td>
                                        <td className="border border-slate-400 px-2 py-1">{transaction.date}</td>
                                        <td className="border border-slate-400 px-2 py-1">{transaction.description}</td>
                                        <td className="border border-slate-400 px-2 py-1 text-right font-mono">
                                            {transaction.type === 'expense' ? formatCurrency(transaction.amount) : '-'}
                                        </td>
                                        <td className="border border-slate-400 px-2 py-1 text-right font-mono">
                                            {transaction.type === 'income' ? formatCurrency(transaction.amount) : '-'}
                                        </td>
                                        <td className="border border-slate-400 px-2 py-1 text-right font-mono">{formatCurrency(runningBalance)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    // MODO ESTÁNDAR: Cards simples con tabla limpia
    if (demoMode === 'standard') {
        return (
            <div className="max-w-[1600px] mx-auto space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Centro Financiero</h2>
                    <p className="text-slate-500 text-sm">Vista completa de debe y haber</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-emerald-500 text-white p-6 rounded-lg">
                        <div className="text-sm font-bold mb-1">HABER (Ingresos)</div>
                        <p className="text-2xl font-bold font-mono">{formatCurrency(summary.income)}</p>
                    </div>
                    <div className="bg-red-500 text-white p-6 rounded-lg">
                        <div className="text-sm font-bold mb-1">DEBE (Gastos)</div>
                        <p className="text-2xl font-bold font-mono">{formatCurrency(summary.expense)}</p>
                    </div>
                    <div className="bg-blue-500 text-white p-6 rounded-lg">
                        <div className="text-sm font-bold mb-1">SALDO NETO</div>
                        <p className="text-2xl font-bold font-mono">{formatCurrency(summary.balance)}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 bg-slate-800 text-white border-b">
                        <h3 className="font-bold">Libro Mayor</h3>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-2 text-left">Fecha</th>
                                <th className="px-4 py-2 text-left">Descripción</th>
                                <th className="px-4 py-2 text-right">Debe</th>
                                <th className="px-4 py-2 text-right">Haber</th>
                                <th className="px-4 py-2 text-right">Saldo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {allTransactions.slice(0, 15).map((transaction, index) => {
                                const runningBalance = allTransactions
                                    .slice(0, index + 1)
                                    .reduce((balance, t) => balance + (t.type === 'income' ? t.amount : -t.amount), 0)

                                return (
                                    <tr key={transaction.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-2">{transaction.date}</td>
                                        <td className="px-4 py-2">{transaction.description}</td>
                                        <td className="px-4 py-2 text-right font-mono text-red-600">
                                            {transaction.type === 'expense' ? formatCurrency(transaction.amount) : '-'}
                                        </td>
                                        <td className="px-4 py-2 text-right font-mono text-emerald-600">
                                            {transaction.type === 'income' ? formatCurrency(transaction.amount) : '-'}
                                        </td>
                                        <td className="px-4 py-2 text-right font-mono font-bold">{formatCurrency(runningBalance)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    // MODO PRO: Diseño completo con exportación
    return (
        <div className="max-w-[1600px] mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Centro Financiero</h2>
                    <p className="text-slate-500 text-sm">Vista completa de debe y haber para contabilidad</p>
                </div>

                {/* Botones de exportación - SOLO EN PRO */}
                <div className="flex gap-2">
                    <button
                        onClick={handleExportExcel}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm flex items-center gap-2 transition-all transform hover:scale-105"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        Exportar Excel
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm flex items-center gap-2 transition-all transform hover:scale-105"
                    >
                        <FileText className="w-4 h-4" />
                        Generar PDF
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingDown className="w-6 h-6" />
                        <span className="text-sm font-bold uppercase tracking-wider">Total Haber (Ingresos)</span>
                    </div>
                    <p className="text-3xl font-bold font-mono">{formatCurrency(summary.income)}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-6 h-6" />
                        <span className="text-sm font-bold uppercase tracking-wider">Total Debe (Gastos)</span>
                    </div>
                    <p className="text-3xl font-bold font-mono">{formatCurrency(summary.expense)}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="w-6 h-6" />
                        <span className="text-sm font-bold uppercase tracking-wider">Saldo Neto</span>
                    </div>
                    <p className="text-3xl font-bold font-mono">{formatCurrency(summary.balance)}</p>
                </motion.div>
            </div>

            {/* Detailed Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
                    <h3 className="font-bold">Libro Mayor - Todas las Operaciones</h3>
                    <p className="text-xs text-slate-400 mt-1">Exportable a Excel para tu contador(a)</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 text-xs uppercase text-slate-600 font-bold">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Fecha</th>
                                <th className="px-6 py-3">Descripción</th>
                                <th className="px-6 py-3">Unidad</th>
                                <th className="px-6 py-3 text-right">Debe</th>
                                <th className="px-6 py-3 text-right">Haber</th>
                                <th className="px-6 py-3 text-right">Saldo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {allTransactions.map((transaction, index) => {
                                const runningBalance = allTransactions
                                    .slice(0, index + 1)
                                    .reduce((balance, t) => {
                                        return balance + (t.type === 'income' ? t.amount : -t.amount)
                                    }, 0)

                                return (
                                    <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-3 text-slate-500 font-mono">{String(transaction.id).padStart(4, '0')}</td>
                                        <td className="px-6 py-3 text-slate-600">{transaction.date}</td>
                                        <td className="px-6 py-3 font-medium text-slate-800">{transaction.description}</td>
                                        <td className="px-6 py-3">
                                            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-mono">
                                                {transaction.truck}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right font-mono text-red-600 font-bold">
                                            {transaction.type === 'expense' ? formatCurrency(transaction.amount) : '-'}
                                        </td>
                                        <td className="px-6 py-3 text-right font-mono text-emerald-600 font-bold">
                                            {transaction.type === 'income' ? formatCurrency(transaction.amount) : '-'}
                                        </td>
                                        <td className="px-6 py-3 text-right font-mono font-bold text-slate-800">
                                            {formatCurrency(runningBalance)}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        <tfoot className="bg-slate-800 text-white font-bold">
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-right uppercase text-sm">Totales:</td>
                                <td className="px-6 py-4 text-right font-mono text-lg">{formatCurrency(summary.expense)}</td>
                                <td className="px-6 py-4 text-right font-mono text-lg">{formatCurrency(summary.income)}</td>
                                <td className="px-6 py-4 text-right font-mono text-lg">{formatCurrency(summary.balance)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </motion.div>
        </div>
    )
}
