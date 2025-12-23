import { Home, Plus, Users, Truck, List } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BottomNav({ activeView, setActiveView }) {
    const navItems = [
        {
            id: 'inicio',
            label: 'Inicio',
            icon: Home
        },
        {
            id: 'registrar',
            label: 'Registrar',
            icon: Plus
        },
        {
            id: 'personal',
            label: 'Personal',
            icon: Users
        },
        {
            id: 'flota',
            label: 'Flota',
            icon: Truck
        },
        {
            id: 'movimientos',
            label: 'Movimientos',
            icon: List
        }
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 glass-dark border-t border-dark-border z-50 safe-area-bottom backdrop-blur-xl transition-all duration-300">
            <div className="grid grid-cols-5 h-16">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeView === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`flex flex-col items-center justify-center gap-0.5 transition-colors relative ${
                                isActive ? 'bg-dark-surface2/50' : 'hover:bg-dark-surface/30'
                            }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavIndicator"
                                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            <Icon
                                className={`w-5 h-5 ${isActive ? 'text-amber-500' : 'text-zinc-500'}`}
                                strokeWidth={isActive ? 2.5 : 2}
                            />

                            <span className={`text-[10px] font-medium leading-tight ${isActive ? 'text-amber-500' : 'text-zinc-500'}`}>
                                {item.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}
