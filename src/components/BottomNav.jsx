import { Home, Plus, Users } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BottomNav({ activeView, setActiveView }) {
    const navItems = [
        {
            id: 'inicio',
            label: 'Inicio',
            icon: Home,
            color: 'text-blue-600',
            activeBg: 'bg-blue-50'
        },
        {
            id: 'registrar',
            label: 'Registrar',
            icon: Plus,
            color: 'text-blue-600',
            activeBg: 'bg-blue-50'
        },
        {
            id: 'personal',
            label: 'Personal',
            icon: Users,
            color: 'text-blue-600',
            activeBg: 'bg-blue-50'
        }
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden z-50 safe-area-bottom">
            <div className="grid grid-cols-3 h-16">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeView === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${isActive ? item.activeBg : 'hover:bg-slate-50'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavIndicator"
                                    className="absolute top-0 left-0 right-0 h-1 bg-blue-600"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            <Icon
                                className={`w-6 h-6 ${isActive ? item.color : 'text-slate-400'}`}
                                strokeWidth={isActive ? 2.5 : 2}
                            />

                            <span className={`text-xs font-medium ${isActive ? item.color : 'text-slate-500'
                                }`}>
                                {item.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}
