import { Home, Plus, Users, Settings, User } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BottomNav({ activeView, setActiveView }) {
    const navItems = [
        { id: 'inicio', label: 'Inicio', icon: Home },
        { id: 'operaciones', label: 'Operaciones', icon: Plus },
        { id: 'personal', label: 'Personal', icon: Users },
        { id: 'ajustes', label: 'Ajustes', icon: Settings },
        { id: 'perfil', label: 'Perfil', icon: User },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 glass-dark border-t border-dark-border z-50 backdrop-blur-xl md:hidden">
            <div className="grid grid-cols-5 h-16">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeView === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`flex flex-col items-center justify-center gap-0.5 transition-colors relative ${isActive ? 'bg-dark-surface2/50' : 'hover:bg-dark-surface/30'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavIndicator"
                                    className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Icon
                                className={`w-5 h-5 ${isActive ? 'text-amber-500' : 'text-zinc-500'}`}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className={`text-[9px] font-medium leading-tight ${isActive ? 'text-amber-500' : 'text-zinc-500'}`}>
                                {item.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}
