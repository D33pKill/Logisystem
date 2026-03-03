import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { generarLiquidacionPDF } from '../utils/liquidacionPDF'
import {
    Users, Plus, Pencil, Trash2, X, CheckCircle, User, Phone,
    Mail, FileText, Briefcase, Calendar, CreditCard, Shield,
    MessageCircle, AlertCircle, ChevronDown, ChevronUp, DollarSign,
    Download
} from 'lucide-react'
import toast from 'react-hot-toast'

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
const fmt = (n) => `$${Number(n || 0).toLocaleString('es-CL')}`

const getInitials = (nombre = '') =>
    nombre.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()

const whatsappUrl = (tel) => {
    const clean = tel.replace(/\D/g, '').replace(/^0/, '')
    const num = clean.startsWith('56') ? clean : `56${clean}`
    return `https://wa.me/${num}`
}

const TABS = ['Trabajadores', 'Liquidaciones']

const ESTADO_CONFIG = {
    en_ruta: { label: 'En Ruta', cls: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
    disponible: { label: 'Disponible', cls: 'bg-sky-500/15 text-sky-400 border border-sky-500/30' },
    vacaciones: { label: 'Vacaciones', cls: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' },
}

const inputCls = "w-full h-11 px-3 bg-zinc-800/60 border border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-all text-sm"
const labelCls = "block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1"

// ──────────────────────────────────────────────────────────────────────────────
// Avatar con Iniciales
// ──────────────────────────────────────────────────────────────────────────────
function Avatar({ nombre, size = 'md' }) {
    const initials = getInitials(nombre)
    const sizeMap = {
        md: 'w-12 h-12 text-base',
        lg: 'w-16 h-16 text-xl',
        xl: 'w-20 h-20 text-2xl',
    }
    return (
        <div className={`${sizeMap[size]} rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-600/20 border border-amber-500/30 flex items-center justify-center font-black text-amber-400 flex-shrink-0`}>
            {initials || <User className="w-1/2 h-1/2" />}
        </div>
    )
}

// ──────────────────────────────────────────────────────────────────────────────
// Modal Agregar/Editar (básico, sin los campos de detalle — esos van en el drawer)
// ──────────────────────────────────────────────────────────────────────────────
function ModalTrabajador({ trabajador, onSave, onClose }) {
    const isEditing = !!trabajador?.id
    const [form, setForm] = useState({
        nombre: trabajador?.nombre || '',
        rut: trabajador?.rut || '',
        telefono: trabajador?.telefono || '',
        cargo: trabajador?.cargo || 'Chofer',
        estado: trabajador?.estado || 'disponible',
    })
    const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.nombre.trim() || !form.rut.trim()) {
            toast.error('Nombre y RUT son obligatorios')
            return
        }
        onSave(form)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
                initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative z-10 w-full sm:max-w-md bg-zinc-900 border border-zinc-700 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
            >
                <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mb-5 sm:hidden" />
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-black text-zinc-100">
                        {isEditing ? '📝 Editar Trabajador' : '➕ Nuevo Trabajador'}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className={labelCls}>👤 Nombre completo *</label>
                        <input value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Ej: Pedro González" className={inputCls} required />
                    </div>
                    <div>
                        <label className={labelCls}>🪪 RUT *</label>
                        <input value={form.rut} onChange={e => set('rut', e.target.value)} placeholder="Ej: 12.345.678-9" className={inputCls} required />
                    </div>
                    <div>
                        <label className={labelCls}>📱 Teléfono</label>
                        <input value={form.telefono} onChange={e => set('telefono', e.target.value)} placeholder="+56 9 1234 5678" className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>💼 Cargo</label>
                            <select value={form.cargo} onChange={e => set('cargo', e.target.value)} className={inputCls + " appearance-none"}>
                                <option>Chofer</option><option>Ayudante</option><option>Administrativo</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>🚦 Estado</label>
                            <select value={form.estado} onChange={e => set('estado', e.target.value)} className={inputCls + " appearance-none"}>
                                <option value="disponible">Disponible</option>
                                <option value="en_ruta">En Ruta</option>
                                <option value="vacaciones">Vacaciones</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button type="button" onClick={onClose} className="h-12 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-xl font-bold text-sm">Cancelar</button>
                        <motion.button type="submit" className="h-12 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-black text-sm" whileTap={{ scale: 0.97 }}>
                            {isEditing ? '💾 Guardar' : '✅ Agregar'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

// ──────────────────────────────────────────────────────────────────────────────
// DRAWER / BOTTOM SHEET DE DETALLE
// ──────────────────────────────────────────────────────────────────────────────
function DetalleTrabajador({ empleado, onClose, isAdmin, onUpdate }) {
    const { fletes, abonos, maestros, getMesActual } = useApp()
    const [tab, setTab] = useState('info')  // 'info' | 'contrato'
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({
        email: empleado.email || '',
        telefono: empleado.telefono || '',
        notas: empleado.notas || '',
        tipoContrato: empleado.tipoContrato || 'planta',
        fechaIngreso: empleado.fechaIngreso || '',
        vencimientoLicencia: empleado.vencimientoLicencia || '',
    })
    const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

    // Sincronizar si cambia el empleado exteriormente
    useEffect(() => {
        setForm({
            email: empleado.email || '',
            telefono: empleado.telefono || '',
            notas: empleado.notas || '',
            tipoContrato: empleado.tipoContrato || 'planta',
            fechaIngreso: empleado.fechaIngreso || '',
            vencimientoLicencia: empleado.vencimientoLicencia || '',
        })
    }, [empleado.id])

    const handleSave = () => {
        onUpdate(empleado.id, form)
        toast.success(`¡Datos de ${empleado.nombre} actualizados! 📝`)
        setEditing(false)
    }

    const estado = ESTADO_CONFIG[empleado.estado] || ESTADO_CONFIG.disponible
    const mesActual = getMesActual()

    // Fletes del mes para este empleado (filtrados por empleadoId)
    const fletesDelMes = fletes.filter(f =>
        !f.is_deleted && f.fecha?.startsWith(mesActual) && f.empleadoId === empleado.id
    )
    const abonosDelMes = abonos.filter(a =>
        !a.is_deleted && a.empleadoId === empleado.id && a.mes === mesActual
    )

    const handleGenerarPDF = () => {
        generarLiquidacionPDF({
            empleado,
            fletesEmp: fletesDelMes,
            abonosEmp: abonosDelMes,
            mes: mesActual,
            maestros,
        })
        toast.success(`Generando liquidación PDF de ${empleado.nombre} 📄`)
    }

    // Detectar si la licencia vence pronto (< 60 días)
    const licenciaVence = empleado.vencimientoLicencia
        ? Math.ceil((new Date(empleado.vencimientoLicencia) - new Date()) / (1000 * 60 * 60 * 24))
        : null
    const licenciaAlerta = licenciaVence !== null && licenciaVence < 60

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Panel — derecha en desktop, abajo en mobile */}
            <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: 'spring', stiffness: 280, damping: 32 }}
                className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-zinc-950 border-l border-zinc-800/60 flex flex-col shadow-2xl"
            >
                {/* ── HEADER ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 flex-shrink-0">
                    <h2 className="text-base font-black text-zinc-200">Ficha del Trabajador</h2>
                    <button onClick={onClose} className="p-2 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ── CUERPO (scrollable) ── */}
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    {/* Identidad */}
                    <div className="px-6 py-5 border-b border-zinc-800/40">
                        <div className="flex items-center gap-4">
                            <Avatar nombre={empleado.nombre} size="xl" />
                            <div className="min-w-0">
                                <h3 className="text-xl font-black text-zinc-100 leading-tight">{empleado.nombre}</h3>
                                <p className="text-sm text-zinc-500 mt-0.5">{empleado.rut}</p>
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                    <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                                        <Briefcase className="w-3 h-3" /> {empleado.cargo}
                                    </span>
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${estado.cls}`}>
                                        {estado.label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Acciones de contacto rápido */}
                        <div className="flex gap-2 mt-4">
                            {(form.telefono || empleado.telefono) && (
                                <a
                                    href={whatsappUrl(form.telefono || empleado.telefono)}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 h-10 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 transition-all"
                                >
                                    <MessageCircle className="w-4 h-4" /> WhatsApp
                                </a>
                            )}
                            {(form.email || empleado.email) && (
                                <a
                                    href={`mailto:${form.email || empleado.email}`}
                                    className="flex-1 flex items-center justify-center gap-2 h-10 bg-sky-500/15 border border-sky-500/30 rounded-xl text-sky-400 text-xs font-bold hover:bg-sky-500/25 transition-all"
                                >
                                    <Mail className="w-4 h-4" /> Email
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Tabs Detalle */}
                    <div className="flex gap-1 p-3 border-b border-zinc-800/40">
                        {['info', 'contrato'].map(t => (
                            <button key={t} onClick={() => setTab(t)}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all capitalize ${tab === t ? 'bg-amber-500 text-white' : 'text-zinc-500 hover:text-zinc-300'
                                    }`}>
                                {t === 'info' ? '📋 Contacto & Notas' : '📄 Contrato'}
                            </button>
                        ))}
                    </div>

                    <div className="px-6 py-5 space-y-4">
                        {tab === 'info' ? (
                            <>
                                {/* Teléfono */}
                                <div>
                                    <label className={labelCls}>📱 Teléfono</label>
                                    {editing ? (
                                        <input value={form.telefono} onChange={e => set('telefono', e.target.value)} placeholder="+56 9 1234 5678" className={inputCls} />
                                    ) : (
                                        <p className="text-zinc-200 text-sm font-medium py-2">{form.telefono || '—'}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className={labelCls}>✉️ Email</label>
                                    {editing ? (
                                        <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="ejemplo@correo.cl" type="email" className={inputCls} />
                                    ) : (
                                        <p className="text-zinc-200 text-sm font-medium py-2">{form.email || '—'}</p>
                                    )}
                                </div>

                                {/* Notas */}
                                <div>
                                    <label className={labelCls}>📝 Notas / Observaciones</label>
                                    {editing ? (
                                        <textarea value={form.notas} onChange={e => set('notas', e.target.value)}
                                            rows={4} placeholder="Ej: Chofer de confianza para rutas largas..."
                                            className="w-full px-3 py-2.5 bg-zinc-800/60 border border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500 text-sm resize-none" />
                                    ) : (
                                        <div className="p-3 bg-zinc-800/40 rounded-xl border border-zinc-800 min-h-[60px]">
                                            <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">{form.notas || 'Sin observaciones.'}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Tipo de Contrato */}
                                <div>
                                    <label className={labelCls}>💼 Tipo de Contrato</label>
                                    {editing ? (
                                        <select value={form.tipoContrato} onChange={e => set('tipoContrato', e.target.value)} className={inputCls + " appearance-none"}>
                                            <option value="planta">Planta (indefinido)</option>
                                            <option value="externo">Externo / Eventual</option>
                                        </select>
                                    ) : (
                                        <div className="flex items-center gap-2 py-2">
                                            <Shield className="w-4 h-4 text-zinc-500" />
                                            <p className="text-zinc-200 text-sm font-medium capitalize">
                                                {form.tipoContrato === 'planta' ? 'Planta (indefinido)' : 'Externo / Eventual'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Fecha de Ingreso */}
                                <div>
                                    <label className={labelCls}>📅 Fecha de Ingreso</label>
                                    {editing ? (
                                        <input type="date" value={form.fechaIngreso} onChange={e => set('fechaIngreso', e.target.value)} className={inputCls} />
                                    ) : (
                                        <div className="flex items-center gap-2 py-2">
                                            <Calendar className="w-4 h-4 text-zinc-500" />
                                            <p className="text-zinc-200 text-sm font-medium">
                                                {form.fechaIngreso
                                                    ? new Date(form.fechaIngreso + 'T00:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
                                                    : '—'
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Vencimiento Licencia */}
                                <div>
                                    <label className={labelCls}>🪪 Vencimiento Licencia de Conducir</label>
                                    {editing ? (
                                        <input type="date" value={form.vencimientoLicencia} onChange={e => set('vencimientoLicencia', e.target.value)} className={inputCls} />
                                    ) : (
                                        <div className={`flex items-center gap-2 p-3 rounded-xl border ${licenciaAlerta
                                            ? 'bg-rose-500/10 border-rose-500/30'
                                            : 'bg-zinc-800/40 border-zinc-800'
                                            }`}>
                                            <CreditCard className={`w-4 h-4 ${licenciaAlerta ? 'text-rose-400' : 'text-zinc-500'}`} />
                                            <div>
                                                <p className={`text-sm font-medium ${licenciaAlerta ? 'text-rose-300' : 'text-zinc-200'}`}>
                                                    {form.vencimientoLicencia
                                                        ? new Date(form.vencimientoLicencia + 'T00:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
                                                        : '—'
                                                    }
                                                </p>
                                                {licenciaAlerta && (
                                                    <p className="text-xs text-rose-400 mt-0.5 font-bold">
                                                        ⚠️ Vence en {licenciaVence} días
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* ── FOOTER ACCIONES ── */}
                <div className="px-6 py-4 border-t border-zinc-800/60 flex-shrink-0 space-y-2">
                    {/* Botón PDF — siempre visible */}
                    <motion.button
                        onClick={handleGenerarPDF}
                        className="w-full h-11 flex items-center justify-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl font-bold text-sm hover:bg-emerald-500/25 transition-all"
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                    >
                        <Download className="w-4 h-4" /> GENERAR LIQUIDACIÓN PDF
                    </motion.button>

                    {/* Editar — solo Admin */}
                    {isAdmin && (
                        editing ? (
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => setEditing(false)}
                                    className="h-11 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-xl font-bold text-sm">
                                    Cancelar
                                </button>
                                <motion.button onClick={handleSave}
                                    className="h-11 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-black text-sm shadow-lg shadow-amber-500/30"
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                    💾 Guardar Cambios
                                </motion.button>
                            </div>
                        ) : (
                            <motion.button onClick={() => setEditing(true)}
                                className="w-full h-11 flex items-center justify-center gap-2 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl font-bold text-sm hover:bg-zinc-700 transition-all"
                                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                                <Pencil className="w-4 h-4 text-amber-400" /> Editar Información
                            </motion.button>
                        )
                    )}
                </div>
            </motion.div>
        </>
    )
}

// ──────────────────────────────────────────────────────────────────────────────
// Card Trabajador
// ──────────────────────────────────────────────────────────────────────────────
function CardTrabajador({ emp, onOpen, onEdit, onDelete, isAdmin }) {
    const estado = ESTADO_CONFIG[emp.estado] || ESTADO_CONFIG.disponible

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.01, borderColor: 'rgba(217,119,6,0.35)' }}
            onClick={() => onOpen(emp)}
            className="glass-dark rounded-2xl border border-dark-border p-5 cursor-pointer transition-all relative group hover:shadow-lg hover:shadow-amber-500/5"
        >
            {/* Indicador hover sutil */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/3 group-hover:to-transparent transition-all pointer-events-none" />

            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar nombre={emp.nombre} size="md" />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-black text-zinc-100 text-base leading-tight truncate">{emp.nombre}</h3>
                        <p className="text-xs text-zinc-500 mt-0.5">{emp.rut}</p>
                        {emp.telefono && <p className="text-xs text-zinc-600 mt-0.5">{emp.telefono}</p>}
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${estado.cls}`}>
                        {estado.label}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-zinc-600" />
                    <span className="text-xs text-zinc-500">{emp.cargo}</span>
                    {emp.tipoContrato && (
                        <span className="text-xs text-zinc-700 ml-1">
                            · {emp.tipoContrato === 'planta' ? 'Planta' : 'Externo'}
                        </span>
                    )}
                </div>
                <span className="text-[10px] text-zinc-700 group-hover:text-zinc-500 transition-colors">
                    Ver detalle →
                </span>
            </div>

            {/* Botones de acción directa (detienen propagación al card) */}
            {isAdmin && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-800/60"
                    onClick={e => e.stopPropagation()}>
                    <motion.button
                        onClick={() => onEdit(emp)}
                        className="flex-1 h-9 flex items-center justify-center gap-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-300 text-xs font-bold hover:bg-zinc-700 hover:text-zinc-100 transition-all"
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    >
                        <Pencil className="w-3.5 h-3.5" /> EDITAR
                    </motion.button>
                    <motion.button
                        onClick={() => onDelete(emp)}
                        className="flex-1 h-9 flex items-center justify-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-all"
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    >
                        <Trash2 className="w-3.5 h-3.5" /> ELIMINAR
                    </motion.button>
                </div>
            )}
        </motion.div>
    )
}

// ──────────────────────────────────────────────────────────────────────────────
// Panel Liquidaciones (sin cambios funcionales)
// ──────────────────────────────────────────────────────────────────────────────
function PanelLiquidaciones() {
    const { empleados, abonos, fletes, maestros, addAbono, deleteAbono, isAdmin, getMesActual } = useApp()
    const activos = empleados.filter(e => !e.is_deleted)
    const mesActual = getMesActual()
    const [expanded, setExpanded] = useState(null)
    const [abonoForm, setAbonoForm] = useState({ monto: '', fecha: new Date().toISOString().split('T')[0], descripcion: '' })
    const [showAbonoForm, setShowAbonoForm] = useState(null)

    const abonosDe = (empId) => abonos.filter(a => a.empleadoId === empId && a.mes === mesActual && !a.is_deleted)
    const totalAbonos = (empId) => abonosDe(empId).reduce((s, a) => s + a.monto, 0)
    const fletesDelMes = (empId) => fletes.filter(f => !f.is_deleted && f.fecha?.startsWith(mesActual) && f.empleadoId === empId)
    const totalFletesDe = (empId) => fletesDelMes(empId).reduce((s, f) => s + (f.montoCliente || 0), 0)

    const handlePDF = (emp) => {
        generarLiquidacionPDF({
            empleado: emp,
            fletesEmp: fletesDelMes(emp.id),
            abonosEmp: abonosDe(emp.id),
            mes: mesActual,
            maestros,
        })
        toast.success(`Generando PDF de ${emp.nombre} 📄`)
    }

    const handleAddAbono = (empId, nombre) => {
        if (!abonoForm.monto) return
        addAbono({ empleadoId: empId, monto: Number(abonoForm.monto), fecha: abonoForm.fecha, descripcion: abonoForm.descripcion, mes: mesActual })
        toast.success(`Abono de ${fmt(Number(abonoForm.monto))} registrado para ${nombre} ✅`)
        setAbonoForm({ monto: '', fecha: new Date().toISOString().split('T')[0], descripcion: '' })
        setShowAbonoForm(null)
    }

    const mesLabel = new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })

    return (
        <div className="space-y-3">
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider px-1">
                Mes: <span className="text-zinc-500 capitalize">{mesLabel}</span>
            </p>
            {activos.length === 0 && <div className="text-center py-10 text-zinc-600 text-sm">Sin trabajadores.</div>}
            {activos.map(emp => {
                const lista = abonosDe(emp.id)
                const total = totalAbonos(emp.id)
                const isOpen = expanded === emp.id
                return (
                    <div key={emp.id} className="glass-dark rounded-2xl border border-dark-border overflow-hidden">
                        <button onClick={() => setExpanded(isOpen ? null : emp.id)}
                            className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-all">
                            <div className="flex items-center gap-3">
                                <Avatar nombre={emp.nombre} size="md" />
                                <div className="text-left">
                                    <p className="font-bold text-zinc-200 text-sm">{emp.nombre}</p>
                                    <p className="text-xs text-zinc-600">{lista.length} abono{lista.length !== 1 ? 's' : ''} · {fletesDelMes(emp.id).length} ingreso{fletesDelMes(emp.id).length !== 1 ? 's' : ''}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {isAdmin && (
                                    <div className="text-right">
                                        <p className="text-xs text-zinc-600">Líquido</p>
                                        <p className={`font-black text-sm ${(totalFletesDe(emp.id) - totalAbonos(emp.id)) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            ${(totalFletesDe(emp.id) - totalAbonos(emp.id)).toLocaleString('es-CL')}
                                        </p>
                                    </div>
                                )}
                                {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-600" /> : <ChevronDown className="w-4 h-4 text-zinc-600" />}
                            </div>
                        </button>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                                    className="border-t border-dark-border">
                                    <div className="p-4 space-y-3 bg-zinc-900/40">
                                        {lista.length > 0 ? lista.map(a => (
                                            <div key={a.id} className="flex items-center justify-between p-3 bg-zinc-800/60 rounded-xl">
                                                <div>
                                                    <p className="text-sm font-bold text-zinc-200">{fmt(a.monto)}</p>
                                                    <p className="text-xs text-zinc-600">{a.fecha}{a.descripcion ? ` · ${a.descripcion}` : ''}</p>
                                                </div>
                                                {isAdmin && (
                                                    <button onClick={() => { deleteAbono(a.id); toast.success('Abono eliminado 🗑️') }}
                                                        className="p-2 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        )) : <p className="text-xs text-zinc-600 text-center py-2">Sin abonos este mes</p>}
                                        {isAdmin && (showAbonoForm === emp.id ? (
                                            <div className="space-y-2 pt-1">
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">$</span>
                                                    <input type="number" value={abonoForm.monto} onChange={e => setAbonoForm(p => ({ ...p, monto: e.target.value }))} placeholder="Monto"
                                                        className="w-full h-11 pl-7 pr-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-200 text-sm focus:outline-none focus:border-amber-500" />
                                                </div>
                                                <input type="date" value={abonoForm.fecha} onChange={e => setAbonoForm(p => ({ ...p, fecha: e.target.value }))}
                                                    className="w-full h-11 px-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-200 text-sm focus:outline-none focus:border-amber-500" />
                                                <input value={abonoForm.descripcion} onChange={e => setAbonoForm(p => ({ ...p, descripcion: e.target.value }))} placeholder="Descripción"
                                                    className="w-full h-11 px-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-600 text-sm focus:outline-none focus:border-amber-500" />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button onClick={() => setShowAbonoForm(null)} className="h-10 bg-zinc-700 text-zinc-300 rounded-xl text-sm font-semibold">Cancelar</button>
                                                    <button onClick={() => handleAddAbono(emp.id, emp.nombre)} className="h-10 bg-amber-500 text-white rounded-xl text-sm font-bold">Guardar</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <button onClick={() => setShowAbonoForm(emp.id)}
                                                    className="w-full h-10 border border-amber-500/30 text-amber-400 rounded-xl text-sm font-semibold hover:bg-amber-500/10 transition-all flex items-center justify-center gap-2">
                                                    <DollarSign className="w-4 h-4" /> Registrar Abono / Adelanto
                                                </button>
                                                <button onClick={() => handlePDF(emp)}
                                                    className="w-full h-10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-semibold hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2">
                                                    <Download className="w-4 h-4" /> Generar Liquidación PDF
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )
            })}
        </div>
    )
}

// ──────────────────────────────────────────────────────────────────────────────
// PERSONAL VIEW PRINCIPAL
// ──────────────────────────────────────────────────────────────────────────────
export default function PersonalView() {
    const { empleados, addEmpleado, updateEmpleado, deleteEmpleado, isAdmin } = useApp()
    const [activeTab, setActiveTab] = useState('Trabajadores')
    const [modal, setModal] = useState(null)           // null | {mode, emp?}
    const [detalle, setDetalle] = useState(null)        // empleado a mostrar en drawer
    const [confirmDelete, setConfirmDelete] = useState(null)

    const activos = empleados.filter(e => !e.is_deleted)

    const handleSave = (formData) => {
        if (modal?.mode === 'edit') {
            updateEmpleado(modal.emp.id, formData)
            toast.success(`¡Datos de ${formData.nombre} actualizados! 📝`)
        } else {
            addEmpleado(formData)
            toast.success(`¡Trabajador ${formData.nombre} agregado correctamente! ✅`)
        }
        setModal(null)
    }

    const handleDelete = (emp) => setConfirmDelete(emp)

    const confirmHandleDelete = () => {
        deleteEmpleado(confirmDelete.id)
        toast.success(`¡Trabajador movido a la papelera! 🗑️`)
        if (detalle?.id === confirmDelete.id) setDetalle(null)
        setConfirmDelete(null)
    }

    // Cuando el empleado en el drawer es actualizado, refrescar el objeto
    const handleDrawerUpdate = (id, data) => {
        updateEmpleado(id, data)
        // Actualizar el objeto local del drawer
        setDetalle(prev => prev ? { ...prev, ...data } : prev)
    }

    return (
        <div className="pb-6">
            {/* Header */}
            <div className="pt-6 pb-5 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-100">Gestión de Personal</h1>
                    <p className="text-zinc-500 text-sm mt-0.5">{activos.length} trabajador{activos.length !== 1 ? 'es' : ''} activo{activos.length !== 1 ? 's' : ''}</p>
                </div>
                {isAdmin && (
                    <motion.button onClick={() => setModal({ mode: 'add' })}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-500/30"
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                        <Plus className="w-4 h-4" /> + AGREGAR
                    </motion.button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-5 p-1 bg-zinc-900/60 rounded-2xl border border-zinc-800">
                {TABS.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-amber-500 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'
                            }`}>
                        {tab === 'Trabajadores' ? `👥 ${tab}` : `💵 ${tab}`}
                    </button>
                ))}
            </div>

            {/* Contenido */}
            <AnimatePresence mode="wait">
                {activeTab === 'Trabajadores' ? (
                    <motion.div key="trabajadores" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                        {activos.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 rounded-2xl bg-zinc-800/60 flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-zinc-600" />
                                </div>
                                <p className="text-zinc-500 font-semibold">Sin trabajadores</p>
                                {isAdmin && (
                                    <button onClick={() => setModal({ mode: 'add' })} className="mt-4 px-5 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-sm">
                                        + Agregar primer trabajador
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {activos.map(emp => (
                                        <CardTrabajador
                                            key={emp.id}
                                            emp={emp}
                                            isAdmin={isAdmin}
                                            onOpen={setDetalle}
                                            onEdit={(e) => setModal({ mode: 'edit', emp: e })}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="liquidaciones" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                        <PanelLiquidaciones />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Modal Agregar/Editar ── */}
            <AnimatePresence>
                {modal && (
                    <ModalTrabajador trabajador={modal.mode === 'edit' ? modal.emp : null}
                        onSave={handleSave} onClose={() => setModal(null)} />
                )}
            </AnimatePresence>

            {/* ── Drawer Detalle ── */}
            <AnimatePresence>
                {detalle && (
                    <DetalleTrabajador
                        empleado={detalle}
                        isAdmin={isAdmin}
                        onClose={() => setDetalle(null)}
                        onUpdate={handleDrawerUpdate}
                    />
                )}
            </AnimatePresence>

            {/* ── Confirm Delete ── */}
            <AnimatePresence>
                {confirmDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setConfirmDelete(null)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="relative z-10 w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-3xl p-6 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-7 h-7 text-rose-400" />
                            </div>
                            <h3 className="text-lg font-black text-zinc-100 mb-2">¿Eliminar trabajador?</h3>
                            <p className="text-sm text-zinc-400 mb-6">
                                <span className="font-bold text-zinc-200">{confirmDelete.nombre}</span> será movido a la papelera.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => setConfirmDelete(null)} className="h-12 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-xl font-bold text-sm">Cancelar</button>
                                <motion.button onClick={confirmHandleDelete}
                                    className="h-12 bg-rose-500 text-white rounded-xl font-black text-sm shadow-lg shadow-rose-500/30"
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                    🗑️ Eliminar
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
