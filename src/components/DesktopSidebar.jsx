import { Home, Plus, List, Truck } from 'lucide-react'

export default function DesktopSidebar({ activeView, setActiveView }) {
    const navItems = [
        { id: 'registrar', label: 'Registrar Movimiento', icon: Plus },
        { id: 'movimientos', label: 'Ver Movimientos', icon: List },
        { id: 'camiones', label: 'Gestión de Camiones', icon: Truck }
    ]

    return (
        <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-slate-900 flex-col z-50">
            {/* Logo */}
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg">LogiSystem</h1>
                        <p className="text-slate-400 text-xs">Gestión Logística</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeView === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">T</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-white text-sm font-medium">Tomás Admin</p>
                        <p className="text-slate-400 text-xs">Plan Básico</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
