import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { LogOut, Shield, Clock, ChevronRight, Users } from 'lucide-react'
import toast from 'react-hot-toast'

const containerV = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
}
const itemV = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 130, damping: 18 } }
}

export default function PerfilView({ onLogout, onNavigate }) {
    const { currentUser, isAdmin, auditLog } = useApp()
    const [showLog, setShowLog] = useState(false)

    const handleLogout = () => {
        toast.success('Sesión cerrada')
        setTimeout(onLogout, 600)
    }

    const roleIcon = isAdmin ? '👑' : '🚚'
    const roleLabel = isAdmin ? 'Administrador' : 'Operador'
    const roleColor = isAdmin ? 'text-amber-400' : 'text-zinc-400'

    return (
        <motion.div variants={containerV} initial="hidden" animate="visible" className="pb-6">
            {/* Header */}
            <motion.div variants={itemV} className="pt-6 pb-5">
                <h1 className="text-2xl font-bold text-zinc-100">Perfil</h1>
                <p className="text-zinc-500 text-sm">Tu cuenta y configuración</p>
            </motion.div>

            {/* Card usuario */}
            <motion.div variants={itemV} className="glass-dark rounded-2xl border border-dark-border p-6 mb-4">
                <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${isAdmin ? 'bg-amber-500/20' : 'bg-zinc-800'}`}>
                        {roleIcon}
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-zinc-100">{currentUser?.nombre}</h2>
                        <p className={`text-sm font-bold ${roleColor}`}>{roleLabel}</p>
                        <p className="text-xs text-zinc-600 mt-0.5">{currentUser?.email}</p>
                    </div>
                </div>
                {isAdmin && (
                    <div className="mt-4 pt-4 border-t border-dark-border flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span className="text-xs text-amber-300 font-semibold">Acceso total al sistema</span>
                    </div>
                )}
            </motion.div>

            {/* Acceso rápido a Personal */}
            <motion.div variants={itemV} className="mb-4">
                <button
                    onClick={() => onNavigate?.('personal')}
                    className="w-full flex items-center justify-between p-4 glass-dark rounded-2xl border border-dark-border hover:bg-zinc-800/40 transition-all"
                >
                    <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-sky-400" />
                        <span className="font-bold text-zinc-200">Gestión de Personal</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>
            </motion.div>

            {/* Log de Auditoría (solo Admin) */}
            {isAdmin && (
                <motion.div variants={itemV} className="mb-4">
                    <button
                        onClick={() => setShowLog(!showLog)}
                        className="w-full flex items-center justify-between p-4 glass-dark rounded-2xl border border-dark-border hover:bg-zinc-800/40 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-zinc-400" />
                            <div className="text-left">
                                <span className="font-bold text-zinc-200">Log de Auditoría</span>
                                <p className="text-xs text-zinc-600">{auditLog.length} registros</p>
                            </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-zinc-500 transition-transform ${showLog ? 'rotate-90' : ''}`} />
                    </button>

                    {showLog && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                            className="mt-2 glass-dark rounded-2xl border border-dark-border overflow-hidden"
                        >
                            {auditLog.length === 0 ? (
                                <p className="text-center py-6 text-zinc-600 text-sm">Sin actividad aún.</p>
                            ) : (
                                <div className="divide-y divide-zinc-800/60 max-h-72 overflow-y-auto scrollbar-thin">
                                    {auditLog.slice(0, 50).map(entry => (
                                        <div key={entry.id} className="px-4 py-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-zinc-300 leading-tight">{entry.action}</p>
                                                    {entry.detail && <p className="text-xs text-zinc-600 mt-0.5 truncate">{entry.detail}</p>}
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className={`text-xs font-bold ${entry.role === 'admin' ? 'text-amber-400' : 'text-zinc-400'}`}>
                                                        {entry.user?.split(' ')[0]}
                                                    </p>
                                                    <p className="text-xs text-zinc-700">
                                                        {new Date(entry.timestamp).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* Cerrar Sesión */}
            <motion.div variants={itemV}>
                <motion.button
                    onClick={handleLogout}
                    className="w-full h-14 flex items-center justify-center gap-3 bg-rose-500/10 border-2 border-rose-500/30 rounded-2xl text-rose-400 font-black text-base hover:bg-rose-500/20 hover:border-rose-500/50 transition-all"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                >
                    <LogOut className="w-5 h-5" />
                    CERRAR SESIÓN
                </motion.button>
            </motion.div>
        </motion.div>
    )
}
