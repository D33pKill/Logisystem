import {
    LayoutDashboard,
    Truck,
    Calculator,
    Sparkles,
    Tag
} from 'lucide-react'
import { cn } from '../utils/helpers'

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fleet', label: 'Gestión de Flota', icon: Truck },
    { id: 'finances', label: 'Finanzas', icon: Calculator },
    { id: 'ai-audit', label: 'IA Auditoría', icon: Sparkles, badge: 'PRO' },
    { id: 'pricing', label: 'Ver Licencias', icon: Tag, special: true },
]

export default function Sidebar({ activeView, setActiveView }) {
    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl">
            {/* Logo */}
            <div className="p-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                        <Truck className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">LogiSystem</h1>
                        <p className="text-xs text-slate-400">Enterprise v4.0</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeView === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={cn(
                                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left group',
                                isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                                item.special && 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold mt-4'
                            )}
                        >
                            <Icon className={cn(
                                'w-5 h-5',
                                item.special && 'animate-pulse'
                            )} />
                            <span className="flex-1 font-medium text-sm">{item.label}</span>
                            {item.badge && (
                                <span className="bg-indigo-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700">
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-800 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                        TA
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Tomás Admin</p>
                        <p className="text-xs text-slate-400">Gerente</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
