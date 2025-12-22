import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Camera, AlertCircle, Droplet, Save, X, Plus, Map, AlertTriangle, User, Calendar, FileText, Upload } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function RegistrarView({ onAddTransaction, showToast, trucks, customTags = [], onAddCustomTag }) {
    const { employees, addTransaction } = useApp()
    const [transactionType, setTransactionType] = useState('income')
    const [hasComplaint, setHasComplaint] = useState(false)
    const [selectedTags, setSelectedTags] = useState([])
    const [newTagInput, setNewTagInput] = useState('')
    const [showTagInput, setShowTagInput] = useState(false)

    // Separate photo states
    const [routePhotos, setRoutePhotos] = useState([])
    const [incidentPhotos, setIncidentPhotos] = useState([])
    const [expensePhotos, setExpensePhotos] = useState([])

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        truck: trucks[0]?.plate || '',
        routeId: '',
        amount: '',
        description: '',
        category: 'Combustible', // Expense only
        liters: '', // Expense only
        mileage: '', // Expense only
        selectedEmployee: '', // Para Sueldo/Anticipo
        mesPago: '', // Para Sueldo/Anticipo
        liquidacionFile: null // Para Sueldo/Anticipo
    })

    const categories = ['Combustible', 'Peajes', 'Sueldo', 'Anticipo', 'Mantención', 'Multas', 'Indemnizaciones', 'Otros']
    
    const isSueldoOrAnticipo = formData.category === 'Sueldo' || formData.category === 'Anticipo'
    const predefinedTags = ['Carga Nocturna', 'Rural', 'Urbano', 'Cyber', 'IKEA', 'Segunda Vuelta PM', 'Retiros AM', 'Flete']
    const allTags = [...predefinedTags, ...customTags]

    const handleAddCustomTag = () => {
        const trimmedTag = newTagInput.trim()
        if (!trimmedTag) { showToast('Ingresa un nombre', 'error'); return }
        if (allTags.includes(trimmedTag)) { showToast('Etiqueta existente', 'error'); return }
        onAddCustomTag(trimmedTag)
        setNewTagInput('')
        setShowTagInput(false)
        showToast(`Etiqueta "${trimmedTag}" creada`, 'success')
    }

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) setSelectedTags(selectedTags.filter(t => t !== tag))
        else setSelectedTags([...selectedTags, tag])
    }

    const handlePhotoChange = (e, index, type) => {
        const file = e.target.files[0]
        if (!file) return

        const newPhoto = { id: Date.now() + index, file, url: URL.createObjectURL(file) }

        if (type === 'route') {
            const current = [...routePhotos]
            current[index] = newPhoto
            setRoutePhotos(current)
        } else if (type === 'incident') {
            const current = [...incidentPhotos]
            current[index] = newPhoto
            setIncidentPhotos(current)
        } else {
            const current = [...expensePhotos]
            current[index] = newPhoto
            setExpensePhotos(current)
        }
    }

    const removePhoto = (index, type) => {
        if (type === 'route') {
            URL.revokeObjectURL(routePhotos[index]?.url)
            const current = [...routePhotos]
            current[index] = null
            setRoutePhotos(current)
        } else if (type === 'incident') {
            URL.revokeObjectURL(incidentPhotos[index]?.url)
            const current = [...incidentPhotos]
            current[index] = null
            setIncidentPhotos(current)
        } else {
            URL.revokeObjectURL(expensePhotos[index]?.url)
            const current = [...expensePhotos]
            current[index] = null
            setExpensePhotos(current)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            showToast('Ingresa un monto válido', 'error')
            return
        }

        if (transactionType === 'income' && !formData.routeId) {
            showToast('El ID de Ruta es obligatorio', 'error')
            return
        }

        if (transactionType === 'income' && hasComplaint && !formData.description) {
            showToast('Debes describir el problema/merma', 'error')
            return
        }

        let finalPhotos = []
        let evidence = null

        if (transactionType === 'income') {
            const rPhotos = routePhotos.filter(Boolean).map(p => p.url)
            const iPhotos = incidentPhotos.filter(Boolean).map(p => p.url)
            finalPhotos = [...rPhotos, ...iPhotos]
            evidence = {
                routePhotos: rPhotos,
                incidentPhotos: iPhotos
            }
        } else {
            finalPhotos = expensePhotos.filter(Boolean).map(p => p.url)
        }

        const tagsString = selectedTags.join(', ')

        const transaction = {
            id: Date.now(),
            type: transactionType,
            date: formData.date,
            truck: formData.truck,
            amount: parseFloat(formData.amount),

            description: transactionType === 'income'
                ? `Ruta #${formData.routeId}`
                : (formData.description || formData.category),

            routeId: formData.routeId,
            tags: tagsString,
            photos: finalPhotos,
            evidence: evidence,

            ...(transactionType === 'income' && hasComplaint && {
                hasComplaint: true,
                complaintDetails: {
                    folio: 'N/A',
                    description: formData.description
                }
            }),

            ...(transactionType === 'expense' && formData.category === 'Combustible' && {
                fuelDetails: {
                    liters: parseFloat(formData.liters) || 0,
                    mileage: parseFloat(formData.mileage) || 0
                }
            }),
            ...(transactionType === 'expense' && isSueldoOrAnticipo && {
                employeeDetails: {
                    employeeId: formData.selectedEmployee,
                    employeeName: employees.find(e => e.id.toString() === formData.selectedEmployee)?.nombre || '',
                    mesPago: formData.mesPago,
                    liquidacionUrl: formData.liquidacionFile ? URL.createObjectURL(formData.liquidacionFile) : null
                }
            }),
            category: transactionType === 'expense' ? formData.category : null
        }

        // Usar addTransaction del contexto si está disponible, sino usar el prop
        if (addTransaction) {
            addTransaction(transaction)
        } else {
            onAddTransaction(transaction)
        }
        showToast(`${transactionType === 'income' ? 'Ingreso' : 'Gasto'} registrado correctamente`, 'success')

        setFormData({
            ...formData,
            amount: '',
            description: '',
            routeId: '',
            liters: '',
            mileage: '',
            selectedEmployee: '',
            mesPago: '',
            liquidacionFile: null
        })
        setHasComplaint(false)
        setSelectedTags([])
        setRoutePhotos([])
        setIncidentPhotos([])
        setExpensePhotos([])
    }

    // Photo Grid - Force horizontal with explicit classes instead of dynamic string construction
    // Fixed: grid-cols-${count} was not working because tailwind scans for full class names
    const renderPhotoGrid = (photosState, type, count = 4) => (
        <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: count }).map((_, index) => {
                const photo = photosState[index]
                return (
                    <div key={index} className="relative aspect-square">
                        {photo ? (
                            <div className="relative w-full h-full group">
                                <img src={photo.url} alt="Evidencia" className="w-full h-full object-cover rounded-lg border border-slate-200 shadow-sm" />
                                <button type="button" onClick={() => removePhoto(index, type)} className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"><X className="w-3 h-3" /></button>
                            </div>
                        ) : (
                            <label className="w-full h-full bg-white border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-all group">
                                <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoChange(e, index, type)} className="hidden" />
                                <Plus className="w-8 h-8 text-slate-300 group-hover:text-slate-500 transition-colors" />
                            </label>
                        )}
                    </div>
                )
            })}
        </div>
    )

    const inputClass = "w-full h-12 px-4 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
    const labelClass = "block text-sm font-bold text-slate-700 mb-1"

    return (
        <div className="max-w-2xl mx-auto pb-24">
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* TIPO DE MOVIMIENTO */}
                <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setTransactionType('income')}
                        className={`h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${transactionType === 'income' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                        <TrendingUp className="w-6 h-6" /> INGRESO
                    </button>
                    <button type="button" onClick={() => setTransactionType('expense')}
                        className={`h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${transactionType === 'expense' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                        <TrendingDown className="w-6 h-6" /> GASTO
                    </button>
                </div>

                {transactionType === 'income' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* 1. SECCIÓN ENCABEZADO (Box con fondo blanco y borde suave) */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Datos Principales</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Fecha</label>
                                    <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Patente</label>
                                    <select value={formData.truck} onChange={(e) => setFormData({ ...formData, truck: e.target.value })} className={`${inputClass} font-bold`} required>
                                        {trucks.map(t => <option key={t.id} value={t.plate}>{t.plate}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>N° de Ruta / Folio <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input type="number" value={formData.routeId} onChange={(e) => setFormData({ ...formData, routeId: e.target.value })} className={`${inputClass} pl-10 font-bold text-lg`} placeholder="Ej: 99420" required />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Monto Total</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                    <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className={`${inputClass} pl-8 text-emerald-700 font-bold text-lg`} placeholder="0" required />
                                </div>
                            </div>
                        </div>

                        {/* 2. SECCIÓN RUTA (Box Gris Claro para Diferenciar) */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                    <Camera className="w-4 h-4 text-slate-600" />
                                </div>
                                <h3 className="font-bold text-slate-700">Evidencia de Ruta</h3>
                            </div>

                            {renderPhotoGrid(routePhotos, 'route', 4)}

                            <div className="mt-6 pt-4 border-t border-slate-200">
                                <label className={labelClass}>Etiquetas del Viaje</label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {allTags.map(tag => (
                                        <button key={tag} type="button" onClick={() => toggleTag(tag)}
                                            className={`px-3 py-1.5 rounded-full font-bold text-xs transition-all border shadow-sm ${selectedTags.includes(tag) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3. SWITCH PROBLEMA (Box Flotante) */}
                        <div className={`p-4 rounded-xl border-2 transition-all shadow-sm ${hasComplaint ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${hasComplaint ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`font-bold ${hasComplaint ? 'text-red-900' : 'text-slate-700'}`}>¿Hubo Merma o Problema?</span>
                                        <span className="text-xs text-slate-500">Activa para reportar incidencias</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setHasComplaint(!hasComplaint)}
                                    className={`relative w-14 h-8 rounded-full transition-colors ${hasComplaint ? 'bg-red-500' : 'bg-slate-300'}`}
                                >
                                    <motion.div className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md" animate={{ left: hasComplaint ? '28px' : '4px' }} />
                                </button>
                            </div>
                        </div>

                        {/* 4. SECCIÓN INCIDENCIA (Box Rojo) */}
                        <AnimatePresence>
                            {hasComplaint && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-red-50 p-5 rounded-2xl border border-red-200 shadow-sm mt-2">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                                <AlertCircle className="w-4 h-4 text-red-600" />
                                            </div>
                                            <h3 className="font-bold text-red-800">Detalle de Incidencia</h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-red-900 mb-1">Comentario del Problema</label>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    className="w-full h-24 px-4 py-3 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white shadow-sm"
                                                    placeholder="Describe el daño, rechazo o problema..."
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-red-900 mb-2">Fotos de Respaldo</label>
                                                {renderPhotoGrid(incidentPhotos, 'incident', 4)}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                ) : (
                    // --- MODO GASTO ---
                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Registro de Gasto</h3>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Fecha</label>
                                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Patente</label>
                                <select value={formData.truck} onChange={(e) => setFormData({ ...formData, truck: e.target.value })} className={inputClass} required>
                                    {trucks.map(t => <option key={t.id} value={t.plate}>{t.plate}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Categoría</label>
                            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value, selectedEmployee: '', mesPago: '', liquidacionFile: null })} className={inputClass} required>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        {/* Lógica Reactiva: Si es Sueldo o Anticipo */}
                        {isSueldoOrAnticipo ? (
                            <AnimatePresence>
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4 bg-blue-50 p-5 rounded-xl border border-blue-200"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="w-5 h-5 text-blue-600" />
                                        <h4 className="font-bold text-blue-900">Datos del Trabajador</h4>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Seleccionar Trabajador <span className="text-red-500">*</span></label>
                                        <select
                                            value={formData.selectedEmployee}
                                            onChange={(e) => setFormData({ ...formData, selectedEmployee: e.target.value })}
                                            className={inputClass}
                                            required
                                        >
                                            <option value="">-- Seleccione un trabajador --</option>
                                            {employees.map(emp => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.nombre} - {emp.cargo}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Mes de Pago <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <input
                                                type="month"
                                                value={formData.mesPago}
                                                onChange={(e) => setFormData({ ...formData, mesPago: e.target.value })}
                                                className={`${inputClass} pl-10`}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Adjuntar Liquidación</label>
                                        {formData.liquidacionFile ? (
                                            <div className="relative p-4 bg-white border-2 border-blue-300 rounded-xl mt-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-5 h-5 text-blue-600" />
                                                        <span className="text-sm font-bold text-blue-900">
                                                            {formData.liquidacionFile.name}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, liquidacionFile: null })}
                                                        className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="block p-4 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all text-center mt-2 bg-white">
                                                <Upload className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                                <span className="text-sm font-bold text-blue-700">
                                                    Subir Liquidación (PDF o Foto)
                                                </span>
                                                <input
                                                    type="file"
                                                    accept=".pdf,image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0]
                                                        if (file) {
                                                            setFormData({ ...formData, liquidacionFile: file })
                                                        }
                                                    }}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <>
                                {formData.category === 'Combustible' && (
                                    <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <div>
                                            <label className="text-xs font-bold text-blue-800">Litros</label>
                                            <input type="number" step="0.1" value={formData.liters} onChange={(e) => setFormData({ ...formData, liters: e.target.value })} className="w-full h-10 px-2 rounded border border-blue-200 bg-white" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-blue-800">KM</label>
                                            <input type="number" value={formData.mileage} onChange={(e) => setFormData({ ...formData, mileage: e.target.value })} className="w-full h-10 px-2 rounded border border-blue-200 bg-white" />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className={labelClass}>Boleta / Comprobante</label>
                                    {renderPhotoGrid(expensePhotos, 'expense', 4)}
                                </div>
                            </>
                        )}

                        <div>
                            <label className={labelClass}>Monto</label>
                            <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className={inputClass} placeholder="$0" required />
                        </div>

                        <div>
                            <label className={labelClass}>Nota (Opcional)</label>
                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full h-20 px-4 py-2 border border-slate-300 rounded-lg bg-white" />
                        </div>
                    </div>
                )}

                <button type="submit" className="w-full h-14 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all sticky bottom-4 z-20 hover:bg-slate-800">
                    <Save className="w-5 h-5 inline mr-2" />
                    Guardar
                </button>
            </form>
        </div>
    )
}
