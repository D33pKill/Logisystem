import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { FileText, DollarSign, ChevronRight, CheckCircle, Truck, Calculator, Info, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const fmt = (n) => `$${Number(n || 0).toLocaleString('es-CL')}`

const TABS = [
    { id: 'flete', label: 'Registrar Ingreso', icon: FileText, color: 'amber' },
    { id: 'gasto', label: 'Registrar Gasto', icon: DollarSign, color: 'rose' },
]

// ─── FORMULARIO FLETE ──────────────────────────────────────────────────────────
function FleteForm({ onNavigate }) {
    const { camiones, maestros, tarifas, addFlete, isAdmin, getTarifaValor } = useApp()
    const camionesActivos = camiones.filter(c => !c.is_deleted)
    const tiposOp = maestros.tiposOperacion.filter(t => !t.is_deleted)

    const [form, setForm] = useState({
        fecha: new Date().toISOString().split('T')[0],
        camionId: '',
        folio: '',
        montoCliente: '',
        tipoOperacionId: '',
        aplicarIva: false,
        descripcion: '',
    })
    const [saved, setSaved] = useState(false)

    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

    const camionSel = form.camionId ? camionesActivos.find(c => c.id === Number(form.camionId)) : null
    const tipoOpSel = form.tipoOperacionId ? tiposOp.find(t => t.id === Number(form.tipoOperacionId)) : null

    const tarifa = (camionSel && tipoOpSel)
        ? getTarifaValor(camionSel.id, tipoOpSel.id)
        : null

    const montoNum = Number(form.montoCliente) || 0
    const montoBase = form.aplicarIva ? Math.round(montoNum / 1.19) : montoNum
    const utilidad = tarifa !== null ? montoBase - tarifa : null

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.camionId || !form.tipoOperacionId || !form.montoCliente || !form.fecha) {
            toast.error('Completa todos los campos obligatorios')
            return
        }
        addFlete({
            ...form,
            camionId: Number(form.camionId),
            tipoOperacionId: Number(form.tipoOperacionId),
            montoCliente: Number(form.montoCliente),
        })
        toast.success('✅ Ruta registrada correctamente')
        setSaved(true)
        setTimeout(() => { setSaved(false); setForm({ fecha: new Date().toISOString().split('T')[0], camionId: '', folio: '', montoCliente: '', tipoOperacionId: '', aplicarIva: false, descripcion: '' }) }, 2000)
    }

    if (saved) {
        return (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-zinc-200 mb-1">¡Ruta Guardada!</h3>
                <p className="text-zinc-500 text-sm">El registro se guardó correctamente.</p>
            </motion.div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fecha */}
            <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">📅 Fecha *</label>
                <input type="date" value={form.fecha} onChange={e => set('fecha', e.target.value)}
                    className="w-full h-14 px-4 bg-zinc-800/60 border-2 border-zinc-700 rounded-xl text-zinc-200 focus:outline-none focus:border-amber-500 transition-all text-base" required />
            </div>

            {/* Patente */}
            <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">🚛 Camión / Patente *</label>
                <select value={form.camionId} onChange={e => { set('camionId', e.target.value); set('tipoOperacionId', '') }}
                    className="w-full h-14 px-4 bg-zinc-800/60 border-2 border-zinc-700 rounded-xl text-zinc-200 focus:outline-none focus:border-amber-500 transition-all text-base appearance-none" required>
                    <option value="">— Seleccionar camión —</option>
                    {camionesActivos.map(c => (
                        <option key={c.id} value={c.id}>{c.patente} · {c.modelo}</option>
                    ))}
                </select>
            </div>

            {/* Tipo de Operación */}
            <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">📋 Tipo de Operación *</label>
                <select value={form.tipoOperacionId} onChange={e => set('tipoOperacionId', e.target.value)}
                    className="w-full h-14 px-4 bg-zinc-800/60 border-2 border-zinc-700 rounded-xl text-zinc-200 focus:outline-none focus:border-amber-500 transition-all text-base appearance-none" required>
                    <option value="">— Seleccionar tipo —</option>
                    {tiposOp.map(t => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                </select>
                {/* Tarifa encontrada */}
                {tarifa !== null && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex items-center gap-2 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <Truck className="w-4 h-4 text-amber-400" />
                        <span className="text-xs text-amber-300">Tarifa camión: <strong>{fmt(tarifa)}</strong></span>
                    </motion.div>
                )}
                {(camionSel && tipoOpSel && tarifa === null) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="mt-2 flex items-center gap-2 p-2.5 bg-zinc-800/60 border border-zinc-700 rounded-lg">
                        <Info className="w-4 h-4 text-zinc-500" />
                        <span className="text-xs text-zinc-500">Sin tarifa configurada para esta combinación.</span>
                    </motion.div>
                )}
            </div>

            {/* Folio */}
            <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">📄 Folio / Ruta</label>
                <input type="text" value={form.folio} onChange={e => set('folio', e.target.value)}
                    placeholder="Ej: 001234"
                    className="w-full h-14 px-4 bg-zinc-800/60 border-2 border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-all text-base" />
            </div>

            {/* Monto Cliente */}
            <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">💰 Monto que paga el Cliente *</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-lg">$</span>
                    <input type="number" value={form.montoCliente} onChange={e => set('montoCliente', e.target.value)}
                        placeholder="0"
                        className="w-full h-14 pl-8 pr-4 bg-zinc-800/60 border-2 border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-all text-base" required />
                </div>
            </div>

            {/* Toggle IVA */}
            <div className="flex items-center justify-between p-4 glass-dark rounded-xl border border-dark-border">
                <div>
                    <p className="text-sm font-bold text-zinc-300">Aplicar IVA (19%)</p>
                    <p className="text-xs text-zinc-600">Descuenta el IVA del monto ingresado</p>
                </div>
                <button type="button" onClick={() => set('aplicarIva', !form.aplicarIva)}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${form.aplicarIva ? 'bg-amber-500' : 'bg-zinc-700'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${form.aplicarIva ? 'left-6.5 translate-x-0.5' : 'left-0.5'}`} />
                </button>
            </div>

            {/* Preview cálculo (solo Admin) */}
            {isAdmin && montoNum > 0 && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-zinc-900/80 border border-zinc-700 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                        <Calculator className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Calculadora</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Monto Cliente</span>
                        <span className="text-zinc-200 font-semibold">{fmt(montoNum)}</span>
                    </div>
                    {form.aplicarIva && (
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Monto Base (sin IVA)</span>
                            <span className="text-zinc-200 font-semibold">{fmt(montoBase)}</span>
                        </div>
                    )}
                    {tarifa !== null && (
                        <>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Tarifa Camión</span>
                                <span className="text-rose-400 font-semibold">-{fmt(tarifa)}</span>
                            </div>
                            <div className="flex justify-between text-sm pt-2 border-t border-zinc-700">
                                <span className="text-zinc-200 font-bold">Utilidad</span>
                                <span className={`font-black text-base ${utilidad >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{fmt(utilidad)}</span>
                            </div>
                        </>
                    )}
                </motion.div>
            )}

            {/* Descripción */}
            <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">📝 Notas (opcional)</label>
                <textarea value={form.descripcion} onChange={e => set('descripcion', e.target.value)}
                    rows={2} placeholder="Observaciones adicionales..."
                    className="w-full px-4 py-3 bg-zinc-800/60 border-2 border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-all text-sm resize-none" />
            </div>

            {/* Botón Guardar */}
            <motion.button type="submit"
                className="w-full h-14 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-black text-lg shadow-lg shadow-amber-500/30"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                💾 GUARDAR RUTA
            </motion.button>
        </form>
    )
}

// ─── FORMULARIO GASTO ──────────────────────────────────────────────────────────
function GastoForm() {
    const { camiones, maestros, addGasto } = useApp()
    const camionesActivos = camiones.filter(c => !c.is_deleted)
    const categorias = maestros.categoriasGasto.filter(c => !c.is_deleted)
    const bancos = maestros.bancos.filter(b => !b.is_deleted)

    const [form, setForm] = useState({
        fecha: new Date().toISOString().split('T')[0],
        camionId: '',
        categoriaId: '',
        bancoId: '',
        monto: '',
        descripcion: '',
    })
    const [saved, setSaved] = useState(false)

    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.camionId || !form.categoriaId || !form.monto || !form.fecha) {
            toast.error('Completa todos los campos obligatorios')
            return
        }
        addGasto({
            ...form,
            camionId: Number(form.camionId),
            categoriaId: Number(form.categoriaId),
            bancoId: Number(form.bancoId) || null,
            monto: Number(form.monto),
        })
        toast.success('✅ Gasto registrado correctamente')
        setSaved(true)
        setTimeout(() => { setSaved(false); setForm({ fecha: new Date().toISOString().split('T')[0], camionId: '', categoriaId: '', bancoId: '', monto: '', descripcion: '' }) }, 2000)
    }

    if (saved) {
        return (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-zinc-200 mb-1">¡Gasto Guardado!</h3>
                <p className="text-zinc-500 text-sm">El registro se guardó correctamente.</p>
            </motion.div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fecha */}
            <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">📅 Fecha *</label>
                <input type="date" value={form.fecha} onChange={e => set('fecha', e.target.value)}
                    className="w-full h-14 px-4 bg-zinc-800/60 border-2 border-zinc-700 rounded-xl text-zinc-200 focus:outline-none focus:border-rose-500 transition-all text-base" required />
            </div>

            {/* Camión */}
            <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">🚛 Camión / Patente *</label>
                <select value={form.camionId} onChange={e => set('camionId', e.target.value)}
                    className="w-full h-14 px-4 bg-zinc-800/60 border-2 border-zinc-700 rounded-xl text-zinc-200 focus:outline-none focus:border-rose-500 transition-all text-base appearance-none" required>
                    <option value="">— Seleccionar camión —</option>
                    {camionesActivos.map(c => (
                        <option key={c.id} value={c.id}>{c.patente} · {c.modelo}</option>
                    ))}
                </select>
            </div>

            {/* Categoría */}
            <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">🏷️ Categoría de Gasto *</label>
                <select value={form.categoriaId} onChange={e => set('categoriaId', e.target.value)}
                    className="w-full h-14 px-4 bg-zinc-800/60 border-2 border-zinc-700 rounded-xl text-zinc-200 focus:outline-none focus:border-rose-500 transition-all text-base appearance-none" required>
                    <option value="">— Seleccionar categoría —</option>
                    {categorias.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>
            </div>

            {/* Banco */}
            <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">🏦 Banco / Cuenta</label>
                <select value={form.bancoId} onChange={e => set('bancoId', e.target.value)}
                    className="w-full h-14 px-4 bg-zinc-800/60 border-2 border-zinc-700 rounded-xl text-zinc-200 focus:outline-none focus:border-rose-500 transition-all text-base appearance-none">
                    <option value="">— Seleccionar banco —</option>
                    {bancos.map(b => (
                        <option key={b.id} value={b.id}>{b.nombre}</option>
                    ))}
                </select>
            </div>

            {/* Monto */}
            <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">💸 Monto *</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-lg">$</span>
                    <input type="number" value={form.monto} onChange={e => set('monto', e.target.value)}
                        placeholder="0"
                        className="w-full h-14 pl-8 pr-4 bg-zinc-800/60 border-2 border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-all text-base" required />
                </div>
            </div>

            {/* Descripción */}
            <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">📝 Descripción</label>
                <textarea value={form.descripcion} onChange={e => set('descripcion', e.target.value)}
                    rows={2} placeholder="¿En qué se gastó?"
                    className="w-full px-4 py-3 bg-zinc-800/60 border-2 border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-all text-sm resize-none" />
            </div>

            {/* Botón Guardar */}
            <motion.button type="submit"
                className="w-full h-14 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl font-black text-lg shadow-lg shadow-rose-500/30"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                💾 GUARDAR GASTO
            </motion.button>
        </form>
    )
}

// ─── VISTA PRINCIPAL ──────────────────────────────────────────────────────────
export default function OperacionesView({ onNavigate }) {
    const [activeTab, setActiveTab] = useState('flete')

    return (
        <div className="pb-6">
            {/* Header */}
            <div className="pt-6 pb-5">
                <h1 className="text-2xl font-bold text-zinc-100">Operaciones</h1>
                <p className="text-zinc-500 text-sm">Registra rutas y gastos</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-zinc-900/60 rounded-2xl border border-zinc-800">
                {TABS.map(tab => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${isActive
                                ? tab.color === 'amber'
                                    ? 'bg-amber-500 text-white shadow-lg'
                                    : 'bg-rose-500 text-white shadow-lg'
                                : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Formulario activo */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: activeTab === 'flete' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'flete' ? <FleteForm onNavigate={onNavigate} /> : <GastoForm />}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
