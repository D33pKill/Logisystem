import { useMemo } from 'react'
import { DollarSign, TrendingDown, TrendingUp, CheckCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { motion } from 'framer-motion'
import KPICard from '../components/KPICard'
import { initialTransactions, monthlyData, trucks } from '../data/mockData'
import { formatCurrency } from '../utils/helpers'

export default function DashboardView({ transactions: newTransactions, demoMode = 'pro' }) {
    const allTransactions = useMemo(() => {
        return [...newTransactions, ...initialTransactions]
    }, [newTransactions])

    const totals = useMemo(() => {
        const income = allTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0)

        const expense = allTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)

        return { income, expense, profit: income - expense }
    }, [allTransactions])

    const fleetStatus = useMemo(() => {
        return {
            onRoute: trucks.filter(t => t.status === 'En Ruta').length,
            waiting: trucks.filter(t => t.status === 'En Espera').length,
            inShop: trucks.filter(t => t.status === 'Taller').length,
        }
    }, [])

    // MODE BÁSICO: Diseño plano aburrido sin animaciones
    if (demoMode === 'basic') {
        return (
            <div className="max-w-[1600px] mx-auto space-y-6">
                {/* KPIs sin animación, estilo Excel */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-300 p-4">
                        <div className="text-xs text-slate-600 uppercase mb-1">Facturación Total</div>
                        <div className="text-2xl font-mono text-slate-900">{formatCurrency(totals.income)}</div>
                    </div>
                    <div className="bg-white border border-slate-300 p-4">
                        <div className="text-xs text-slate-600 uppercase mb-1">Gastos Operativos</div>
                        <div className="text-2xl font-mono text-slate-900">{formatCurrency(totals.expense)}</div>
                    </div>
                    <div className="bg-white border border-slate-300 p-4">
                        <div className="text-xs text-slate-600 uppercase mb-1">Utilidad Neta</div>
                        <div className="text-2xl font-mono text-slate-900">{formatCurrency(totals.profit)}</div>
                    </div>
                    <div className="bg-white border border-slate-300 p-4">
                        <div className="text-xs text-slate-600 uppercase mb-1">Estado de Flota</div>
                        <div className="text-sm space-y-1">
                            <div>En Ruta: {fleetStatus.onRoute}</div>
                            <div>Espera: {fleetStatus.waiting}</div>
                            <div>Taller: {fleetStatus.inShop}</div>
                        </div>
                    </div>
                </div>

                {/* Tabla Excel-style densa y aburrida */}
                <div className="bg-white border border-slate-400">
                    <div className="bg-slate-200 px-4 py-2 border-b border-slate-400">
                        <h3 className="font-bold text-slate-800">Registro de Transacciones</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="border border-slate-400 px-2 py-1 text-left">ID</th>
                                    <th className="border border-slate-400 px-2 py-1 text-left">Fecha</th>
                                    <th className="border border-slate-400 px-2 py-1 text-left">Descripción</th>
                                    <th className="border border-slate-400 px-2 py-1 text-left">Camión</th>
                                    <th className="border border-slate-400 px-2 py-1 text-left">Tipo</th>
                                    <th className="border border-slate-400 px-2 py-1 text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allTransactions.slice(0, 12).map((transaction, idx) => (
                                    <tr key={transaction.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                        <td className="border border-slate-400 px-2 py-1">{String(transaction.id).padStart(4, '0')}</td>
                                        <td className="border border-slate-400 px-2 py-1">{transaction.date}</td>
                                        <td className="border border-slate-400 px-2 py-1">{transaction.description}</td>
                                        <td className="border border-slate-400 px-2 py-1">{transaction.truck}</td>
                                        <td className="border border-slate-400 px-2 py-1">{transaction.type === 'income' ? 'Ingreso' : 'Gasto'}</td>
                                        <td className="border border-slate-400 px-2 py-1 text-right font-mono">{formatCurrency(transaction.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }

    // MODE ESTÁNDAR: Profesional con animaciones moderadas
    if (demoMode === 'standard') {
        return (
            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* KPIs con animaciones pero sin efectos fancy */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-lg shadow-sm border border-slate-200"
                    >
                        <div className="text-xs font-bold text-slate-400 uppercase mb-2">Facturación Total</div>
                        <div className="text-3xl font-bold text-slate-800 font-mono">{formatCurrency(totals.income)}</div>
                        <div className="text-xs text-green-600 mt-2">↑ +15% vs mes anterior</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-lg shadow-sm border border-slate-200"
                    >
                        <div className="text-xs font-bold text-slate-400 uppercase mb-2">Gastos Operativos</div>
                        <div className="text-3xl font-bold text-slate-800 font-mono">{formatCurrency(totals.expense)}</div>
                        <div className="text-xs text-slate-500 mt-2">Combustible 60%</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-lg shadow-sm border border-slate-200"
                    >
                        <div className="text-xs font-bold text-slate-400 uppercase mb-2">Utilidad Neta</div>
                        <div className="text-3xl font-bold text-slate-800 font-mono">{formatCurrency(totals.profit)}</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-800 text-white p-6 rounded-lg shadow-lg"
                    >
                        <div className="text-xs font-bold text-slate-400 uppercase mb-2">Estado de Flota</div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>En Ruta</span>
                                <span className="font-bold">{fleetStatus.onRoute}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>En Espera</span>
                                <span className="font-bold">{fleetStatus.waiting}</span>
                            </div>
                            <div className="flex justify-between text-red-300">
                                <span>Taller</span>
                                <span className="font-bold">{fleetStatus.inShop}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Gráfico simple */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-6 rounded-lg shadow-sm border border-slate-200"
                >
                    <h3 className="font-bold text-slate-700 mb-4">Flujo Financiero</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="month" stroke="#64748b" />
                            <YAxis stroke="#64748b" tickFormatter={(value) => `$${value / 1000000}M`} />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Line type="monotone" dataKey="income" stroke="#2563eb" strokeWidth={2} />
                            <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Tabla limpia */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
                >
                    <div className="px-6 py-4 bg-slate-50 border-b">
                        <h3 className="font-bold text-slate-700">Operaciones Recientes</h3>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                            <tr>
                                <th className="px-4 py-2 text-left">Fecha</th>
                                <th className="px-4 py-2 text-left">Descripción</th>
                                <th className="px-4 py-2 text-left">Tipo</th>
                                <th className="px-4 py-2 text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {allTransactions.slice(0, 6).map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3">{transaction.date}</td>
                                    <td className="px-4 py-3">{transaction.description}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs ${transaction.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono">{formatCurrency(transaction.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </div>
        )
    }

    // MODE PRO: Todo el diseño actual con todas las animaciones
    return (
        <div className="max-w-[1600px] mx-auto space-y-8">
            {/* KPIs con animación completa */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KPICard
                    title="Facturación Total"
                    value={totals.income}
                    icon={DollarSign}
                    borderColor="border-emerald-500"
                    iconBg="bg-emerald-50 text-emerald-600"
                    trend={{ value: '+15%', label: 'vs mes anterior', positive: true, icon: '↑' }}
                    delay={0}
                />

                <KPICard
                    title="Gastos Operativos"
                    value={totals.expense}
                    icon={TrendingDown}
                    borderColor="border-red-500"
                    iconBg="bg-red-50 text-red-600"
                    trend={{ value: 'Alta', label: 'Combustible 60%', positive: false, icon: '⚠' }}
                    delay={0.1}
                />

                <KPICard
                    title="Utilidad Neta"
                    value={totals.profit}
                    icon={TrendingUp}
                    borderColor="border-blue-500"
                    iconBg="bg-blue-50 text-blue-600"
                    delay={0.2}
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-slate-800 text-white p-6 rounded-xl shadow-lg"
                >
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Estado de Flota Real
                    </p>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                En Ruta
                            </span>
                            <span className="font-mono font-bold text-lg">{fleetStatus.onRoute}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                En Espera
                            </span>
                            <span className="font-mono font-bold text-lg">{fleetStatus.waiting}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-slate-600 pt-2">
                            <span className="text-sm flex items-center gap-2 text-red-300">
                                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                Taller
                            </span>
                            <span className="font-mono font-bold text-red-300">{fleetStatus.inShop}</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart con animaciones completas */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-700">Flujo Financiero (Últimos 6 Meses)</h3>
                        <div className="flex gap-4 text-xs">
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-blue-600"></span> Ingresos
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-red-500"></span> Gastos
                            </span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="month" stroke="#64748b" />
                            <YAxis stroke="#64748b" tickFormatter={(value) => `$${value / 1000000}M`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                labelStyle={{ color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Line
                                type="monotone"
                                dataKey="income"
                                stroke="#2563eb"
                                strokeWidth={3}
                                dot={{ fill: '#2563eb', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="expense"
                                stroke="#ef4444"
                                strokeWidth={3}
                                dot={{ fill: '#ef4444', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Top Trucks */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
                >
                    <h3 className="font-bold text-slate-700 mb-4 text-sm">Top Rentabilidad por Unidad</h3>
                    <div className="space-y-4">
                        {trucks.slice(0, 3).map((truck, index) => (
                            <div key={truck.id}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-bold">{truck.model} - {truck.plate}</span>
                                    <span className="text-green-600 font-bold">{formatCurrency(truck.profit)}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${(truck.profit / 12500000) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Transactions Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-700">Registro de Operaciones Recientes</h3>
                    <button className="text-xs text-blue-600 font-bold hover:underline">
                        Ver Historial Completo
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold">
                            <tr>
                                <th className="px-6 py-3">Fecha</th>
                                <th className="px-6 py-3">Concepto/Carga</th>
                                <th className="px-6 py-3">Camión</th>
                                <th className="px-6 py-3">Tipo</th>
                                <th className="px-6 py-3 text-right">Monto</th>
                                <th className="px-6 py-3 text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {allTransactions.slice(0, 8).map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-3 text-slate-500">{transaction.date}</td>
                                    <td className="px-6 py-3 font-medium">{transaction.description}</td>
                                    <td className="px-6 py-3">
                                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200">
                                            {transaction.truck}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${transaction.type === 'income'
                                                ? 'text-emerald-600 bg-emerald-50'
                                                : 'text-red-600 bg-red-50'
                                            }`}>
                                            {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right font-mono font-bold text-slate-700">
                                        {formatCurrency(transaction.amount)}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    )
}
