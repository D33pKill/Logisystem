import { useApp } from '../context/AppContext'
import { TrendingUp, TrendingDown, DollarSign, Users, Truck } from 'lucide-react'

export default function InicioView({ onNavigate }) {
    const { transactions, employees, trucks } = useApp()

    const totalIngresos = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

    const totalGastos = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

    const balance = totalIngresos - totalGastos

    const totalEmpleados = employees.length
    const totalCamiones = trucks.length

    return (
        <div className="max-w-4xl mx-auto pb-24">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Dashboard</h1>
                <p className="text-slate-600">Resumen general de la operación</p>
            </div>

            {/* Accesos Rápidos - Administración */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                    onClick={() => onNavigate && onNavigate('personal')}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-left group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Administración</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">Personal</h3>
                    <p className="text-sm text-slate-600 mb-2">Gestión de Recursos Humanos</p>
                    <p className="text-lg font-bold text-blue-600">
                        {totalEmpleados} {totalEmpleados === 1 ? 'empleado' : 'empleados'}
                    </p>
                </button>

                <button
                    onClick={() => onNavigate && onNavigate('flota')}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-left group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                            <Truck className="w-6 h-6 text-slate-600" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Administración</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">Flota</h3>
                    <p className="text-sm text-slate-600 mb-2">Gestión de Camiones</p>
                    <p className="text-lg font-bold text-slate-700">
                        {totalCamiones} {totalCamiones === 1 ? 'camión' : 'camiones'}
                    </p>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* KPI Ingresos */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-emerald-600" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Ingresos</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-700">
                        ${totalIngresos.toLocaleString('es-CL')}
                    </p>
                </div>

                {/* KPI Gastos */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                            <TrendingDown className="w-6 h-6 text-red-600" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Gastos</span>
                    </div>
                    <p className="text-3xl font-bold text-red-700">
                        ${totalGastos.toLocaleString('es-CL')}
                    </p>
                </div>

                {/* KPI Balance */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Balance</span>
                    </div>
                    <p className={`text-3xl font-bold ${balance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                        ${balance.toLocaleString('es-CL')}
                    </p>
                </div>

                {/* KPI Empleados */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-slate-600" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Empleados</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-700">
                        {totalEmpleados}
                    </p>
                </div>

                {/* KPI Camiones */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                            <Truck className="w-6 h-6 text-slate-600" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Camiones</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-700">
                        {totalCamiones}
                    </p>
                </div>
            </div>

            {/* Movimientos Recientes */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Movimientos Recientes</h2>
                <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction) => (
                        <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    transaction.type === 'income' 
                                        ? 'bg-emerald-100' 
                                        : 'bg-red-100'
                                }`}>
                                    {transaction.type === 'income' ? (
                                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                                    ) : (
                                        <TrendingDown className="w-5 h-5 text-red-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">
                                        {transaction.description}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(transaction.date).toLocaleDateString('es-CL')} • {transaction.truck}
                                    </p>
                                </div>
                            </div>
                            <p className={`font-bold ${
                                transaction.type === 'income' 
                                    ? 'text-emerald-700' 
                                    : 'text-red-700'
                            }`}>
                                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString('es-CL')}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

