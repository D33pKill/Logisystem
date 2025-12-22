import { motion } from 'framer-motion'
import { MapPin, User, TrendingUp, Wrench, Clock, Lock } from 'lucide-react'
import { trucks } from '../data/mockData'
import { formatCurrency } from '../utils/helpers'

const statusConfig = {
    'En Ruta': { color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50', icon: MapPin },
    'En Espera': { color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50', icon: Clock },
    'Taller': { color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50', icon: Wrench },
}

export default function FleetView({ demoMode = 'pro' }) {
    // MODO BÁSICO: Lista simple sin tarjetas
    if (demoMode === 'basic') {
        return (
            <div className="max-w-[1600px] mx-auto">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Gestión de Flota</h2>

                {/* Tabla Excel-style */}
                <div className="bg-white border border-slate-400">
                    <div className="bg-slate-200 px-4 py-2 border-b border-slate-400">
                        <h3 className="font-bold text-slate-800">Lista de Vehículos</h3>
                    </div>
                    <table className="w-full text-xs border-collapse">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="border border-slate-400 px-2 py-1 text-left">ID</th>
                                <th className="border border-slate-400 px-2 py-1 text-left">Modelo</th>
                                <th className="border border-slate-400 px-2 py-1 text-left">Patente</th>
                                <th className="border border-slate-400 px-2 py-1 text-left">Estado</th>
                                <th className="border border-slate-400 px-2 py-1 text-left">Conductor</th>
                                <th className="border border-slate-400 px-2 py-1 text-left">Ruta</th>
                                <th className="border border-slate-400 px-2 py-1 text-right">Rentabilidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trucks.map((truck, idx) => (
                                <tr key={truck.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                    <td className="border border-slate-400 px-2 py-1">{truck.id}</td>
                                    <td className="border border-slate-400 px-2 py-1">{truck.model}</td>
                                    <td className="border border-slate-400 px-2 py-1 font-mono">{truck.plate}</td>
                                    <td className="border border-slate-400 px-2 py-1">{truck.status}</td>
                                    <td className="border border-slate-400 px-2 py-1">{truck.driver}</td>
                                    <td className="border border-slate-400 px-2 py-1">{truck.route}</td>
                                    <td className="border border-slate-400 px-2 py-1 text-right font-mono">{formatCurrency(truck.profit)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    // MODO ESTÁNDAR: Tarjetas simples sin efectos fancy
    if (demoMode === 'standard') {
        return (
            <div className="max-w-[1600px] mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Gestión de Flota</h2>
                        <p className="text-slate-500 text-sm">Estado actual de vehículos</p>
                    </div>
                    <div className="flex gap-3 text-xs">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded">
                            En Ruta: {trucks.filter(t => t.status === 'En Ruta').length}
                        </span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded">
                            Espera: {trucks.filter(t => t.status === 'En Espera').length}
                        </span>
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded">
                            Taller: {trucks.filter(t => t.status === 'Taller').length}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trucks.map((truck) => {
                        const config = statusConfig[truck.status]
                        return (
                            <div key={truck.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-slate-800">{truck.model}</h3>
                                        <p className="text-xs text-slate-500 font-mono">{truck.plate}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs ${config.bgColor} ${config.textColor}`}>
                                        {truck.status}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm mb-3">
                                    <div className="flex items-center gap-2">
                                        <User className="w-3 h-3 text-slate-400" />
                                        <span className="text-slate-600">{truck.driver !== '-' ? truck.driver : 'Sin asignar'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3 h-3 text-slate-400" />
                                        <span className="text-slate-600">{truck.route !== '-' ? truck.route : 'Sin ruta'}</span>
                                    </div>
                                </div>

                                <div className="border-t pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-500">Rentabilidad</span>
                                        <span className="text-sm font-bold text-emerald-600 font-mono">{formatCurrency(truck.profit)}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    // MODO PRO: Diseño actual completo
    return (
        <div className="max-w-[1600px] mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Gestión de Flota</h2>
                    <p className="text-slate-500 text-sm">Estado en tiempo real de todos los vehículos</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-bold text-green-700">En Ruta: {trucks.filter(t => t.status === 'En Ruta').length}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-lg">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm font-bold text-yellow-700">Espera: {trucks.filter(t => t.status === 'En Espera').length}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm font-bold text-red-700">Taller: {trucks.filter(t => t.status === 'Taller').length}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trucks.map((truck, index) => {
                    const config = statusConfig[truck.status]
                    const StatusIcon = config.icon

                    return (
                        <motion.div
                            key={truck.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
                        >
                            <div className={`h-2 ${config.color}`}></div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">{truck.model}</h3>
                                        <p className="text-sm text-slate-500 font-mono">Patente: {truck.plate}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full ${config.bgColor} ${config.textColor} text-xs font-bold flex items-center gap-1`}>
                                        <StatusIcon className="w-3 h-3" />
                                        {truck.status}
                                    </div>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-600">
                                            {truck.driver !== '-' ? truck.driver : 'Sin asignar'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-600">
                                            {truck.route !== '-' ? truck.route : 'Sin ruta asignada'}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-500 uppercase font-bold">Rentabilidad Mes</span>
                                        <div className="flex items-center gap-1">
                                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                                            <span className="text-lg font-bold text-emerald-600 font-mono">
                                                {formatCurrency(truck.profit)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
