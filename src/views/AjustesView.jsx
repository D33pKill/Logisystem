import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { Plus, Trash2, Truck, Settings, Tag, CreditCard, ChevronDown, ChevronUp, Lock, DollarSign, Check, X, AlertTriangle, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'

const fmt = (n) => `$${Number(n || 0).toLocaleString('es-CL')}`

// ─── Sección genérica de maestros ─────────────────────────────────────────────
function SeccionMaestro({ titulo, icono: Icon, color, items, seccion, onAdd, onDelete }) {
    const [nuevo, setNuevo] = useState('')
    const activos = items.filter(i => !i.is_deleted)

    const handleAdd = () => {
        if (!nuevo.trim()) return
        onAdd(seccion, nuevo.trim())
        toast.success(`"${nuevo.trim()}" agregado`)
        setNuevo('')
    }

    return (
        <div className="glass-dark rounded-2xl border border-dark-border overflow-hidden mb-4">
            {/* Header */}
            <div className={`flex items-center gap-3 p-4 border-b border-dark-border`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-zinc-200 text-sm">{titulo}</h3>
                    <p className="text-xs text-zinc-600">{activos.length} registros</p>
                </div>
            </div>

            {/* Lista */}
            <div className="divide-y divide-zinc-800/60">
                {activos.length === 0 && (
                    <p className="text-center py-4 text-zinc-600 text-sm">Sin registros. Agrega el primero 👇</p>
                )}
                {activos.map(item => (
                    <div key={item.id} className="flex items-center justify-between px-4 py-3 group">
                        <span className="text-zinc-300 text-sm font-medium">{item.nombre}</span>
                        <button
                            onClick={() => { onDelete(seccion, item.id); toast.success(`"${item.nombre}" eliminado`) }}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Input agregar */}
            <div className="p-3 border-t border-dark-border flex gap-2">
                <input
                    value={nuevo}
                    onChange={e => setNuevo(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                    placeholder="Nuevo nombre..."
                    className="flex-1 h-10 px-3 bg-zinc-800/60 border border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm"
                />
                <button
                    onClick={handleAdd}
                    className="h-10 px-4 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-1"
                >
                    <Plus className="w-4 h-4" />
                    Agregar
                </button>
            </div>
        </div>
    )
}

// ─── Panel Flota ──────────────────────────────────────────────────────────────
function PanelFlota() {
    const { camiones, addCamion, deleteCamion, tarifas, upsertTarifa, maestros, getTarifaValor } = useApp()
    const activos = camiones.filter(c => !c.is_deleted)
    const tiposOp = maestros.tiposOperacion.filter(t => !t.is_deleted)
    const [nuevoCamion, setNuevoCamion] = useState({ patente: '', modelo: '', tipo: 'propio' })
    const [editingTarifas, setEditingTarifas] = useState(null) // camionId o null
    const [tarifaInput, setTarifaInput] = useState({})

    const handleAddCamion = () => {
        if (!nuevoCamion.patente.trim() || !nuevoCamion.modelo.trim()) {
            toast.error('Ingresa patente y modelo')
            return
        }
        addCamion(nuevoCamion)
        toast.success(`Camión ${nuevoCamion.patente} agregado`)
        setNuevoCamion({ patente: '', modelo: '', tipo: 'propio' })
    }

    const handleSaveTarifas = (camionId) => {
        Object.entries(tarifaInput).forEach(([tipoOpId, monto]) => {
            if (monto !== '' && monto !== null) {
                upsertTarifa(camionId, Number(tipoOpId), Number(monto))
            }
        })
        toast.success('Tarifas guardadas')
        setEditingTarifas(null)
        setTarifaInput({})
    }

    return (
        <div className="space-y-4">
            {/* Agregar camión */}
            <div className="glass-dark rounded-2xl border border-dark-border p-4">
                <h3 className="font-bold text-zinc-300 text-sm mb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-amber-400" /> Agregar Camión
                </h3>
                <div className="space-y-2">
                    <input value={nuevoCamion.patente} onChange={e => setNuevoCamion(p => ({ ...p, patente: e.target.value.toUpperCase() }))}
                        placeholder="Patente (ej: ABCD-12)"
                        className="w-full h-11 px-4 bg-zinc-800/60 border border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm" />
                    <input value={nuevoCamion.modelo} onChange={e => setNuevoCamion(p => ({ ...p, modelo: e.target.value }))}
                        placeholder="Modelo (ej: Volvo FH)"
                        className="w-full h-11 px-4 bg-zinc-800/60 border border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm" />
                    <select value={nuevoCamion.tipo} onChange={e => setNuevoCamion(p => ({ ...p, tipo: e.target.value }))}
                        className="w-full h-11 px-4 bg-zinc-800/60 border border-zinc-700 rounded-xl text-zinc-200 focus:outline-none focus:border-amber-500 text-sm appearance-none">
                        <option value="propio">Propio</option>
                        <option value="subcontratado">Subcontratado</option>
                    </select>
                    <button onClick={handleAddCamion}
                        className="w-full h-11 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-bold text-sm transition-all">
                        Agregar Camión
                    </button>
                </div>
            </div>

            {/* Lista camiones */}
            {activos.length === 0 && (
                <p className="text-center py-6 text-zinc-600 text-sm">Sin camiones registrados.</p>
            )}
            {activos.map(camion => (
                <div key={camion.id} className="glass-dark rounded-2xl border border-dark-border overflow-hidden">
                    {/* Header camión */}
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-zinc-700/50 flex items-center justify-center">
                                <Truck className="w-5 h-5 text-zinc-300" />
                            </div>
                            <div>
                                <p className="font-black text-zinc-200">{camion.patente}</p>
                                <p className="text-xs text-zinc-500">{camion.modelo} · {camion.tipo === 'propio' ? '✅ Propio' : '🔗 Subcontratado'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => { setEditingTarifas(editingTarifas === camion.id ? null : camion.id); setTarifaInput({}) }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-all">
                                <DollarSign className="w-3.5 h-3.5" /> Tarifas
                            </button>
                            <button onClick={() => { deleteCamion(camion.id); toast.success('Camión eliminado') }}
                                className="p-1.5 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Panel tarifas */}
                    <AnimatePresence>
                        {editingTarifas === camion.id && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                className="border-t border-dark-border p-4 space-y-2 bg-zinc-900/50">
                                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                                    Tarifas por Tipo de Operación
                                </p>
                                {tiposOp.map(tipo => {
                                    const valorActual = getTarifaValor(camion.id, tipo.id)
                                    const inputVal = tarifaInput[tipo.id] !== undefined ? tarifaInput[tipo.id] : (valorActual ?? '')
                                    return (
                                        <div key={tipo.id} className="flex items-center gap-3">
                                            <span className="flex-1 text-sm text-zinc-300">{tipo.nombre}</span>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">$</span>
                                                <input
                                                    type="number"
                                                    value={inputVal}
                                                    onChange={e => setTarifaInput(p => ({ ...p, [tipo.id]: e.target.value }))}
                                                    placeholder={valorActual ? fmt(valorActual) : '0'}
                                                    className="w-32 h-9 pl-6 pr-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-amber-500"
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                                <button onClick={() => handleSaveTarifas(camion.id)}
                                    className="w-full h-10 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-bold text-sm transition-all mt-2">
                                    Guardar Tarifas
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    )
}

// ─── AJUSTES VIEW PRINCIPAL ───────────────────────────────────────────────────
const SECCIONES = [
    { id: 'flota', label: 'Flota y Tarifario', icon: Truck },
    { id: 'bancos', label: 'Bancos', icon: CreditCard },
    { id: 'tiposOp', label: 'Tipos de Operación', icon: Settings },
    { id: 'categorias', label: 'Categorías de Gasto', icon: Tag },
]

export default function AjustesView() {
    const { isAdmin, maestros, addMaestro, deleteMaestro, resetToFactory } = useApp()
    const [activeSection, setActiveSection] = useState('flota')
    const [showReset, setShowReset] = useState(false)

    if (!isAdmin) {
        return (
            <div className="pt-6 pb-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 rounded-full bg-zinc-800/60 flex items-center justify-center mb-4">
                    <Lock className="w-10 h-10 text-zinc-600" />
                </div>
                <h2 className="text-xl font-bold text-zinc-400 mb-2">Acceso Restringido</h2>
                <p className="text-zinc-600 text-sm max-w-xs">Esta sección es solo para el Administrador.</p>
            </div>
        )
    }

    return (
        <div className="pb-6">
            <div className="pt-6 pb-5">
                <h1 className="text-2xl font-bold text-zinc-100">Ajustes</h1>
                <p className="text-zinc-500 text-sm">Configura la aplicación</p>
            </div>

            {/* Tabs secciones */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-thin">
                {SECCIONES.map(sec => {
                    const Icon = sec.icon
                    const isActive = activeSection === sec.id
                    return (
                        <button key={sec.id} onClick={() => setActiveSection(sec.id)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${isActive ? 'bg-amber-500 text-white' : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 border border-zinc-700'
                                }`}>
                            <Icon className="w-3.5 h-3.5" />
                            {sec.label}
                        </button>
                    )
                })}
            </div>

            {/* Contenido */}
            <AnimatePresence mode="wait">
                <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                    {activeSection === 'flota' && <PanelFlota />}

                    {activeSection === 'bancos' && (
                        <SeccionMaestro
                            titulo="Bancos"
                            icono={CreditCard}
                            color="bg-blue-500/20 text-blue-400"
                            items={maestros.bancos}
                            seccion="bancos"
                            onAdd={addMaestro}
                            onDelete={deleteMaestro}
                        />
                    )}

                    {activeSection === 'tiposOp' && (
                        <SeccionMaestro
                            titulo="Tipos de Operación"
                            icono={Settings}
                            color="bg-amber-500/20 text-amber-400"
                            items={maestros.tiposOperacion}
                            seccion="tiposOperacion"
                            onAdd={addMaestro}
                            onDelete={deleteMaestro}
                        />
                    )}

                    {activeSection === 'categorias' && (
                        <SeccionMaestro
                            titulo="Categorías de Gasto"
                            icono={Tag}
                            color="bg-rose-500/20 text-rose-400"
                            items={maestros.categoriasGasto}
                            seccion="categoriasGasto"
                            onAdd={addMaestro}
                            onDelete={deleteMaestro}
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* ── ZONA DE PELIGRO ── */}
            <div className="mt-8 p-4 border border-rose-500/30 rounded-2xl bg-rose-500/5">
                <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <h3 className="text-sm font-black text-rose-400 uppercase tracking-wider">Zona de Peligro</h3>
                </div>
                <p className="text-xs text-zinc-500 mb-4">
                    Borra todos los datos registrados y restaura la app al estado inicial de fábrica.
                    <strong className="text-rose-400"> Esta acción no se puede deshacer.</strong>
                </p>
                <motion.button
                    onClick={() => setShowReset(true)}
                    className="w-full h-11 flex items-center justify-center gap-2 bg-rose-500/10 border border-rose-500/40 text-rose-400 rounded-xl font-bold text-sm hover:bg-rose-500/20 transition-all"
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                >
                    <RotateCcw className="w-4 h-4" /> RESETEAR A DATOS DE FÁBRICA
                </motion.button>
            </div>

            {/* Modal confirmación reset */}
            <AnimatePresence>
                {showReset && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowReset(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="relative z-10 w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-3xl p-6 text-center shadow-2xl"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-rose-500/15 flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-8 h-8 text-rose-400" />
                            </div>
                            <h3 className="text-lg font-black text-zinc-100 mb-2">¿Resetear todo?</h3>
                            <p className="text-sm text-zinc-400 mb-6">
                                Se borrarán <strong className="text-zinc-200">todos los registros</strong> y se volverá
                                al estado de fábrica. Los datos no se pueden recuperar.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => setShowReset(false)}
                                    className="h-12 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-xl font-bold text-sm">
                                    Cancelar
                                </button>
                                <motion.button
                                    onClick={resetToFactory}
                                    className="h-12 bg-rose-500 text-white rounded-xl font-black text-sm shadow-lg shadow-rose-500/30"
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                >
                                    🗑️ Sí, Resetear
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
