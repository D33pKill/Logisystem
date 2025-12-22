import { Plus, Download } from 'lucide-react'
import { getCurrentDate } from '../utils/helpers'

export default function Header({ onNewMovement, demoMode, setDemoMode }) {
    const modes = [
        { id: 'basic', label: '📄 Básico', description: 'Sin animaciones' },
        { id: 'standard', label: '⚡ Estándar', description: 'Profesional' },
        { id: 'pro', label: '✨ PRO IA', description: 'Con IA' },
    ]

    return (
        <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Panel de Control</h2>
                    <p className="text-sm text-slate-500">
                        Actualizado en tiempo real • {getCurrentDate()}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Exportar Excel
                    </button>

                    <button
                        onClick={onNewMovement}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-600/30 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Nuevo Movimiento
                    </button>
                </div>
            </div>

            {/* Demo Mode Selector */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Modo Demo:
                </span>
                <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                    {modes.map((mode) => (
                        <label
                            key={mode.id}
                            className="cursor-pointer"
                        >
                            <input
                                type="radio"
                                name="demoMode"
                                value={mode.id}
                                checked={demoMode === mode.id}
                                onChange={(e) => setDemoMode(e.target.value)}
                                className="peer hidden"
                            />
                            <div className="px-4 py-2 rounded-md text-sm font-medium transition-all peer-checked:bg-white peer-checked:shadow-sm peer-checked:text-blue-600 text-slate-600 hover:text-slate-800">
                                <div className="font-bold">{mode.label}</div>
                                <div className="text-xs opacity-75">{mode.description}</div>
                            </div>
                        </label>
                    ))}
                </div>
                <div className="flex-1"></div>
                <div className="text-xs text-slate-500 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-lg">
                    💡 <span className="font-semibold">Cambia el modo</span> para ver las 3 experiencias diferentes
                </div>
            </div>
        </header>
    )
}
