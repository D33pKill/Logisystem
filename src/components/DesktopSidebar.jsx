import { motion } from 'framer-motion'
import { Home, Plus, Users, Settings, User, Truck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Logo from './Logo'

const NAV_ITEMS = [
    { id: 'inicio', label: 'Inicio', icon: Home, accent: null },
    { id: 'operaciones', label: 'Operaciones', icon: Plus, accent: null },
    { id: 'personal', label: 'Personal', icon: Users, accent: 'sky' },
    { id: 'ajustes', label: 'Ajustes', icon: Settings, accent: null },
    { id: 'perfil', label: 'Perfil', icon: User, accent: null },
]

export default function DesktopSidebar({ activeView, setActiveView }) {
    const { currentUser, isAdmin } = useApp()

    return (
        <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-zinc-950 border-r border-zinc-800/60 z-40">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-800/60">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                    <p className="font-black text-zinc-100 text-sm leading-tight">LogiSystem</p>
                    <p className="text-zinc-600 text-[10px] leading-tight truncate">Transportes López</p>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon
                    const isActive = activeView === item.id
                    const isPersonal = item.id === 'personal'

                    const activeStyle = isPersonal
                        ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'

                    const inactiveStyle = isPersonal
                        ? 'text-zinc-400 hover:bg-sky-500/5 hover:text-sky-300'
                        : 'text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-200'

                    return (
                        <motion.button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${isActive ? activeStyle : inactiveStyle
                                }`}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Active indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="sidebarIndicator"
                                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full ${isPersonal ? 'bg-sky-400' : 'bg-amber-400'
                                        }`}
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                />
                            )}

                            <Icon
                                className={`flex-shrink-0 transition-colors ${isPersonal ? 'w-5 h-5' : 'w-4.5 h-4.5'
                                    } ${isActive
                                        ? isPersonal ? 'text-sky-400' : 'text-amber-400'
                                        : isPersonal ? 'text-zinc-400 group-hover:text-sky-300' : ''
                                    }`}
                                style={{ width: isPersonal ? '22px' : '18px', height: isPersonal ? '22px' : '18px' }}
                                strokeWidth={isActive ? 2.5 : 2}
                            />

                            <span className={`font-semibold text-sm ${isPersonal && isActive ? 'font-black' : ''}`}>
                                {item.label}
                            </span>

                            {/* Badge Personal */}
                            {isPersonal && !isActive && (
                                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400">
                                    ★
                                </span>
                            )}
                        </motion.button>
                    )
                })}
            </nav>

            {/* User info bottom */}
            <div className="px-4 py-4 border-t border-zinc-800/60">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${isAdmin ? 'bg-amber-500/20' : 'bg-zinc-800'
                        }`}>
                        {isAdmin ? '👑' : '🚚'}
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-300 truncate leading-tight">
                            {currentUser?.nombre?.split(' ')[0]}
                        </p>
                        <p className={`text-[10px] truncate leading-tight ${isAdmin ? 'text-amber-500' : 'text-zinc-500'}`}>
                            {isAdmin ? 'Administrador' : 'Operador'}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
