import { Home, Plus, Users, List, Truck, LogOut, Smartphone, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Logo from './Logo'
import AddAccountModal from './AddAccountModal'

export default function DesktopSidebar({ activeView, setActiveView, onLogout, foldOptimization, onToggleFoldOptimization }) {
    const [showAddAccountModal, setShowAddAccountModal] = useState(false)
    const navItems = [
        { id: 'inicio', label: 'Inicio', icon: Home },
        { id: 'registrar', label: 'Registrar Movimiento', icon: Plus },
        { id: 'personal', label: 'Personal', icon: Users },
        { id: 'flota', label: 'Flota', icon: Truck },
        { id: 'movimientos', label: 'Ver Movimientos', icon: List }
    ]

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-dark-surface border-r border-dark-border flex-col z-50 transition-all duration-300">
            {/* Logo con animación de escala para Fold */}
            <motion.div 
                className="p-4 border-b border-dark-border"
                layout
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
                <Logo size="small" showText={true} variant="horizontal" />
            </motion.div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeView === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                isActive
                                    ? 'bg-gradient-to-r from-accent to-accent-light text-white shadow-lg shadow-accent/20'
                                    : 'text-dark-text2 hover:bg-dark-surface2 hover:text-dark-text'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-dark-border space-y-2">
                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-light rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">T</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-white text-sm font-medium">Tomás Admin</p>
                        <p className="text-dark-text2 text-xs">Plan Básico</p>
                    </div>
                </div>

                {/* Switch de Optimización para Plegables */}
                <div className="px-4 py-3 rounded-lg bg-dark-surface2/50 border border-dark-border/50 mb-2">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-amber-500" />
                            <span className="text-xs font-semibold text-dark-text">Optimización para Plegables</span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-500/70 uppercase tracking-wider">Beta</span>
                    </div>
                    <p className="text-[10px] text-dark-text2 mb-3 leading-tight">
                        Activa el modo adaptativo para dispositivos plegables (Galaxy Fold)
                    </p>
                    <button
                        onClick={onToggleFoldOptimization}
                        className="w-full flex items-center justify-between p-2 rounded-lg bg-dark-surface hover:bg-dark-border/50 transition-colors"
                    >
                        <span className="text-xs text-dark-text2">
                            {foldOptimization ? 'Modo Adaptativo' : 'Modo Clásico'}
                        </span>
                        <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                            foldOptimization ? 'bg-amber-500' : 'bg-zinc-700'
                        }`}>
                            <motion.div
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                                animate={{ left: foldOptimization ? '28px' : '4px' }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        </div>
                    </button>
                </div>

                {/* Botón para agregar cuenta bancaria */}
                <button
                    onClick={() => setShowAddAccountModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-surface2/50 border border-dark-border/50 hover:bg-dark-border/50 transition-colors text-left mb-2"
                >
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-dark-text">Añadir Nueva Cuenta</p>
                        <p className="text-[10px] text-dark-text2">Crear cuenta bancaria o efectivo</p>
                    </div>
                    <Plus className="w-4 h-4 text-dark-text2" />
                </button>

                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-dark-text2 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Cerrar Sesión</span>
                </button>

                {/* Banner de Modo Desarrollo */}
                <div className="px-4 py-2 mt-2">
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                            Modo Desarrollo
                        </p>
                        <p className="text-[9px] text-amber-400/80 leading-tight">
                            Almacenamiento Local
                        </p>
                        <p className="text-[9px] text-dark-text2/70 leading-tight mt-1">
                            Próxima fase: Migración a Nube Segura
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal para agregar cuenta */}
            <AddAccountModal
                isOpen={showAddAccountModal}
                onClose={() => setShowAddAccountModal(false)}
            />
        </aside>
    )
}
