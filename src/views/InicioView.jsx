import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { TrendingUp, TrendingDown, Wallet, Plus, FileText, Lock, Truck, Users, Clock, UserCog } from 'lucide-react'

const fmt = (n) => `$${Number(n || 0).toLocaleString('es-CL')}`

const containerV = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
}
const itemV = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } }
}

export default function InicioView({ onNavigate }) {
    const { currentUser, isAdmin, getKPIs, fletes, gastos, empleados, camiones } = useApp()
    const kpis = getKPIs()

    const mesLabel = new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })

    const ultimosFletes = fletes.filter(f => !f.is_deleted).slice(0, 5)
    const ultimosGastos = gastos.filter(g => !g.is_deleted).slice(0, 5)

    // Actividad reciente unificada
    const actividad = [
        ...ultimosFletes.map(f => ({ ...f, _tipo: 'flete' })),
        ...ultimosGastos.map(g => ({ ...g, _tipo: 'gasto' }))
    ]
        .sort((a, b) => new Date(b.creadoEn || b.fecha) - new Date(a.creadoEn || a.fecha))
        .slice(0, 6)

    return (
        <motion.div variants={containerV} initial="hidden" animate="visible" className="pb-6">

            {/* Header saludo */}
            <motion.div variants={itemV} className="pt-6 pb-4">
                <p className="text-zinc-500 text-sm font-medium">Bienvenido,</p>
                <h1 className="text-2xl font-bold text-zinc-100">{currentUser?.nombre?.split(' ')[0]} 👋</h1>
                <p className="text-zinc-600 text-xs mt-0.5 capitalize">{mesLabel}</p>
            </motion.div>

            {/* === KPI CARDS === */}
            {isAdmin ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                    {/* Saldo Caja */}
                    <motion.div
                        variants={itemV}
                        className="glass-dark rounded-2xl p-5 border border-dark-border md:col-span-1"
                        whileHover={{ scale: 1.01 }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-amber-500" />
                            </div>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Saldo Caja</span>
                        </div>
                        <p className={`text-3xl font-black mb-1 ${kpis.saldoCaja >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {fmt(kpis.saldoCaja)}
                        </p>
                        <p className="text-xs text-zinc-600">Balance total acumulado</p>
                    </motion.div>

                    {/* Ingresos Mes */}
                    <motion.div variants={itemV} className="glass-dark rounded-2xl p-5 border border-dark-border" whileHover={{ scale: 1.01 }}>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                        </div>
                        <p className="text-xs text-zinc-500 font-semibold uppercase mb-1">Ingresos Mes</p>
                        <p className="text-3xl font-black text-emerald-400">{fmt(kpis.ingresosMes)}</p>
                        <p className="text-xs text-zinc-600 mt-1">Este mes</p>
                    </motion.div>

                    {/* Egresos Mes */}
                    <motion.div variants={itemV} className="glass-dark rounded-2xl p-5 border border-dark-border" whileHover={{ scale: 1.01 }}>
                        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center mb-3">
                            <TrendingDown className="w-5 h-5 text-rose-400" />
                        </div>
                        <p className="text-xs text-zinc-500 font-semibold uppercase mb-1">Egresos Mes</p>
                        <p className="text-3xl font-black text-rose-400">{fmt(kpis.egresosMes)}</p>
                        <p className="text-xs text-zinc-600 mt-1">Este mes</p>
                    </motion.div>
                </div>
            ) : (
                /* Operador: KPIs restringidos */
                <motion.div variants={itemV} className="glass-dark rounded-2xl p-5 border border-amber-500/20 mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="font-bold text-zinc-300">Acceso Restringido</p>
                            <p className="text-xs text-zinc-600">Los datos financieros son visibles solo para el Administrador.</p>
                        </div>
                    </div>
                </motion.div>
            )}


            {/* === BOTONES DE ACCIÓN RÁPIDA === */}
            <motion.div variants={itemV} className="mb-5">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Acción Rápida</p>

                {/* Mobile: 2+1 layout / Desktop: 3 columnas iguales */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <motion.button
                        onClick={() => onNavigate?.('operaciones')}
                        className="flex flex-col items-center justify-center gap-2 py-6 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white font-black text-sm shadow-xl shadow-amber-500/30 active:scale-95 transition-all"
                        whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(217,119,6,0.4)' }}
                        whileTap={{ scale: 0.96 }}
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <FileText className="w-5 h-5" />
                        </div>
                        REGISTRAR INGRESO
                    </motion.button>

                    <motion.button
                        onClick={() => onNavigate?.('operaciones')}
                        className="flex flex-col items-center justify-center gap-2 py-6 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white font-black text-sm shadow-xl shadow-rose-500/30 active:scale-95 transition-all"
                        whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(239,68,68,0.35)' }}
                        whileTap={{ scale: 0.96 }}
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <Plus className="w-5 h-5" />
                        </div>
                        REGISTRAR GASTO
                    </motion.button>

                    {/* En desktop: mismo tamaño. En mobile: fila completa */}
                    <motion.button
                        onClick={() => onNavigate?.('personal')}
                        className="col-span-2 md:col-span-1 flex flex-col items-center justify-center gap-2 py-4 md:py-6 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white font-black text-sm shadow-xl shadow-sky-500/25 active:scale-95 transition-all"
                        whileHover={{ scale: 1.02, boxShadow: '0 16px 32px rgba(14,165,233,0.35)' }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                            <UserCog className="w-5 h-5" />
                        </div>
                        GESTIONAR PERSONAL
                    </motion.button>
                </div>
            </motion.div>




            {/* === RESUMEN RÁPIDO (Admin) === */}
            {isAdmin && (
                <motion.div variants={itemV} className="grid grid-cols-2 gap-3 mb-5">
                    <div className="glass-dark rounded-xl p-4 border border-dark-border flex items-center gap-3">
                        <Truck className="w-5 h-5 text-zinc-400" />
                        <div>
                            <p className="text-lg font-black text-zinc-200">{camiones.filter(c => !c.is_deleted).length}</p>
                            <p className="text-xs text-zinc-600">Camiones</p>
                        </div>
                    </div>
                    <div className="glass-dark rounded-xl p-4 border border-dark-border flex items-center gap-3">
                        <Users className="w-5 h-5 text-zinc-400" />
                        <div>
                            <p className="text-lg font-black text-zinc-200">{empleados.filter(e => !e.is_deleted).length}</p>
                            <p className="text-xs text-zinc-600">Choferes</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* === ACTIVIDAD RECIENTE === */}
            <motion.div variants={itemV} className="glass-dark rounded-2xl border border-dark-border p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-zinc-500" />
                    <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Actividad Reciente</h2>
                </div>

                {actividad.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="text-zinc-600 text-sm">Sin registros aún.</p>
                        <p className="text-zinc-700 text-xs mt-1">Usa los botones de arriba para comenzar.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {actividad.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center justify-between p-3 bg-dark-surface2 rounded-xl border border-dark-border"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item._tipo === 'flete' ? 'bg-emerald-500/15' : 'bg-rose-500/15'
                                        }`}>
                                        {item._tipo === 'flete'
                                            ? <TrendingUp className="w-4 h-4 text-emerald-400" />
                                            : <TrendingDown className="w-4 h-4 text-rose-400" />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-300 leading-tight">
                                            {item._tipo === 'flete'
                                                ? `Flete ${item.folio || 'S/N'} · ${item.patente}`
                                                : `Gasto · ${item.patente}`
                                            }
                                        </p>
                                        <p className="text-xs text-zinc-600">{item.fecha}</p>
                                    </div>
                                </div>
                                {isAdmin && (
                                    <p className={`text-sm font-bold ${item._tipo === 'flete' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {item._tipo === 'flete' ? '+' : '-'}{fmt(item._tipo === 'flete' ? item.montoCliente : item.monto)}
                                    </p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </motion.div>
    )
}
