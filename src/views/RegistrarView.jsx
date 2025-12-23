import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Camera, AlertCircle, Droplet, Save, X, Plus, Map, AlertTriangle, User, Calendar, FileText, Upload, Truck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

export default function RegistrarView({ showToast, customTags = [], onAddCustomTag }) {
    const { employees, trucks, accounts, addTransaction } = useApp()
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
        liquidacionFile: null, // Para Sueldo/Anticipo
        providerName: '', // Para Pago Proveedor
        externalPlate: '', // Para Pago Proveedor
        accountId: '', // Cuenta (destino para ingresos, origen para gastos)
        // Campos de incidencia
        incidence_type: '',
        item_count: '',
        responsible: '',
        incidence_photo_url: null,
        document_url: null
    })

    const categories = [
        { value: 'Combustible', label: 'Combustible' },
        { value: 'Peajes', label: 'Peajes' },
        { value: 'Sueldo', label: 'Sueldo' },
        { value: 'Anticipo', label: 'Anticipo' },
        { value: 'Mantención', label: 'Mantención' },
        { value: 'Multas', label: 'Multas' },
        { value: 'Indemnizaciones', label: 'Indemnizaciones' },
        { value: 'pago_proveedor', label: 'Pago Proveedor / Subcontrato' },
        { value: 'Otros', label: 'Otros' }
    ]
    
    const isSueldoOrAnticipo = formData.category === 'Sueldo' || formData.category === 'Anticipo'
    const isPagoProveedor = formData.category === 'pago_proveedor'
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

        // Validación de cuenta
        if (!formData.accountId) {
            showToast(transactionType === 'income' ? 'Debes seleccionar una cuenta de destino' : 'Debes seleccionar una cuenta de origen', 'error')
            return
        }

        // Validación de incidencia
        if (transactionType === 'income' && hasComplaint) {
            if (!formData.incidence_type) {
                showToast('Debes seleccionar el tipo de incidencia', 'error')
                return
            }
        }

        // Validación para pago_proveedor
        if (transactionType === 'expense' && isPagoProveedor) {
            if (!formData.providerName || !formData.providerName.trim()) {
                showToast('El nombre del proveedor es obligatorio', 'error')
                return
            }
            if (!formData.externalPlate || !formData.externalPlate.trim()) {
                showToast('La patente del camión externo es obligatoria', 'error')
                return
            }
        }

        // Validación para gastos internos (no pago_proveedor)
        if (transactionType === 'expense' && !isPagoProveedor && !formData.truck) {
            showToast('Debes seleccionar un camión', 'error')
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
            truck: isPagoProveedor ? formData.externalPlate : formData.truck,
            amount: parseFloat(formData.amount),

            description: transactionType === 'income'
                ? `Ruta #${formData.routeId}`
                : (formData.description || (isPagoProveedor ? `Pago a ${formData.providerName}` : formData.category)),

            routeId: formData.routeId,
            tags: tagsString,
            photos: finalPhotos,
            evidence: evidence,

            accountId: formData.accountId,
            accountName: accounts.find(a => a.id.toString() === formData.accountId)?.name || '',
            ...(transactionType === 'income' && hasComplaint && {
                hasComplaint: true,
                complaintDetails: {
                    folio: 'N/A',
                    description: formData.description,
                    incidence_type: formData.incidence_type,
                    item_count: formData.item_count ? parseInt(formData.item_count) : null,
                    responsible: formData.responsible,
                    document_url: formData.document_url ? URL.createObjectURL(formData.document_url) : null
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
            ...(transactionType === 'expense' && isPagoProveedor && {
                providerDetails: {
                    providerName: formData.providerName,
                    externalPlate: formData.externalPlate
                }
            }),
            category: transactionType === 'expense' ? formData.category : null
        }

        // Simular guardado con delay
        const loadingToast = toast.loading('Guardando...', { id: 'save' })
        
        setTimeout(() => {
            if (addTransaction) {
                addTransaction(transaction)
            }
            toast.success(`${transactionType === 'income' ? 'Ingreso' : 'Gasto'} registrado correctamente`, { id: 'save' })
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
            liquidacionFile: null,
            providerName: '',
            externalPlate: '',
            accountId: '',
            incidence_type: '',
            item_count: '',
            responsible: '',
            incidence_photo_url: null,
            document_url: null
        })
        setHasComplaint(false)
        setSelectedTags([])
        setRoutePhotos([])
        setIncidentPhotos([])
        setExpensePhotos([])
        }, 1000)
    }

    // Photo Grid - Force horizontal with explicit classes instead of dynamic string construction
    const renderPhotoGrid = (photosState, type, count = 4) => (
        <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: count }).map((_, index) => {
                const photo = photosState[index]
                return (
                    <div key={index} className="relative aspect-square">
                        {photo ? (
                            <div className="relative w-full h-full group">
                                <img src={photo.url} alt="Evidencia" className="w-full h-full object-cover rounded-lg border border-dark-border shadow-sm" />
                                <button type="button" onClick={() => removePhoto(index, type)} className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"><X className="w-3 h-3" /></button>
                            </div>
                        ) : (
                            <label className="w-full h-full bg-dark-surface2 border-2 border-dashed border-dark-border rounded-xl flex items-center justify-center cursor-pointer hover:bg-dark-surface hover:border-accent/50 transition-all group">
                                <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoChange(e, index, type)} className="hidden" />
                                <Plus className="w-8 h-8 text-dark-text2 group-hover:text-accent transition-colors" />
                            </label>
                        )}
                    </div>
                )
            })}
        </div>
    )

    const inputClass = "w-full h-12 px-4 border border-dark-border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-dark-surface2 text-dark-text placeholder-dark-text2 shadow-sm"
    const labelClass = "block text-sm font-bold text-dark-text mb-1"

    return (
        <div className="max-w-2xl mx-auto pb-24">
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* TIPO DE MOVIMIENTO - Adaptativo para pantallas estrechas */}
                <div className="grid grid-cols-2 gap-3 flex-wrap">
                    <motion.button 
                        type="button" 
                        onClick={() => setTransactionType('income')}
                        className={`h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${transactionType === 'income' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-dark-surface2 text-dark-text2 hover:bg-dark-surface'}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <TrendingUp className="w-6 h-6" /> INGRESO
                    </motion.button>
                    <motion.button 
                        type="button" 
                        onClick={() => setTransactionType('expense')}
                        className={`h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${transactionType === 'expense' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-dark-surface2 text-dark-text2 hover:bg-dark-surface'}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <TrendingDown className="w-6 h-6" /> GASTO
                    </motion.button>
                </div>

                {transactionType === 'income' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* 1. SECCIÓN ENCABEZADO */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-dark p-5 rounded-2xl border border-dark-border shadow-lg space-y-4"
                        >
                            <h3 className="text-xs font-bold text-dark-text2 uppercase tracking-wider mb-2">Datos Principales</h3>

                            <div className="grid grid-cols-1 fold:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Fecha</label>
                                    <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Patente</label>
                                    <select value={formData.truck} onChange={(e) => setFormData({ ...formData, truck: e.target.value })} className={`${inputClass} font-bold`} required>
                                        {trucks.filter(t => t.is_own !== false).map(t => (
                                            <option key={t.id} value={t.plate}>
                                                {t.plate} {t.model ? `- ${t.model}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>N° de Ruta / Folio <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text2 w-5 h-5" />
                                    <input type="number" value={formData.routeId} onChange={(e) => setFormData({ ...formData, routeId: e.target.value })} className={`${inputClass} pl-10 font-bold text-lg`} placeholder="Ej: 99420" required />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Monto Total</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text2 font-bold">$</span>
                                    <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className={`${inputClass} pl-8 text-emerald-400 font-bold text-lg`} placeholder="0" required />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Cuenta de Destino <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    value={formData.accountId} 
                                    onChange={(e) => setFormData({ ...formData, accountId: e.target.value })} 
                                    className={inputClass}
                                    required
                                >
                                    <option value="">-- Seleccione una cuenta --</option>
                                    {accounts.filter(acc => acc.is_active).map(account => (
                                        <option key={account.id} value={account.id}>
                                            {account.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-dark-text2 mt-1">¿Dónde entra la plata?</p>
                            </div>
                        </motion.div>

                        {/* 2. SECCIÓN RUTA */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-dark-surface2 p-5 rounded-2xl border border-dark-border shadow-lg"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-full bg-dark-surface flex items-center justify-center">
                                    <Camera className="w-4 h-4 text-dark-text" />
                                </div>
                                <h3 className="font-bold text-dark-text">Evidencia de Ruta</h3>
                            </div>

                            {renderPhotoGrid(routePhotos, 'route', 4)}

                            <div className="mt-6 pt-4 border-t border-dark-border">
                                <label className={labelClass}>Etiquetas del Viaje</label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {allTags.map(tag => (
                                        <button key={tag} type="button" onClick={() => toggleTag(tag)}
                                            className={`px-3 py-1.5 rounded-full font-bold text-xs transition-all border shadow-sm ${selectedTags.includes(tag) ? 'bg-accent text-white border-accent' : 'bg-dark-surface text-dark-text2 border-dark-border hover:border-accent/50'}`}>
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* 3. SWITCH INCIDENCIA/MERMA */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={`p-4 rounded-xl border-2 transition-all shadow-sm ${hasComplaint ? 'bg-red-500/10 border-red-500/50' : 'glass-dark border-dark-border'}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${hasComplaint ? 'bg-red-500/20 text-red-400' : 'bg-dark-surface2 text-dark-text2'}`}>
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`font-bold ${hasComplaint ? 'text-red-400' : 'text-dark-text'}`}>¿Hubo Incidencia / Merma?</span>
                                        <span className="text-xs text-dark-text2">Activa para reportar incidencias detalladas</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newValue = !hasComplaint
                                        setHasComplaint(newValue)
                                        if (!newValue) {
                                            setFormData({
                                                ...formData,
                                                incidence_type: '',
                                                item_count: '',
                                                responsible: '',
                                                incidence_photo_url: null,
                                                document_url: null
                                            })
                                            setIncidentPhotos([])
                                        }
                                    }}
                                    className={`relative w-14 h-8 rounded-full transition-colors ${hasComplaint ? 'bg-red-500' : 'bg-dark-border'}`}
                                >
                                    <motion.div className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md" animate={{ left: hasComplaint ? '28px' : '4px' }} />
                                </button>
                            </div>
                        </motion.div>

                        {/* 4. SECCIÓN INCIDENCIA DETALLADA (Box Rojo) */}
                        <AnimatePresence>
                            {hasComplaint && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-red-500/10 p-5 rounded-2xl border border-red-500/50 shadow-lg mt-2">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                                <AlertCircle className="w-4 h-4 text-red-400" />
                                            </div>
                                            <h3 className="font-bold text-red-400">Detalle de Incidencia / Merma</h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-red-400 mb-1">
                                                        Tipo de Incidencia <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        value={formData.incidence_type}
                                                        onChange={(e) => setFormData({ ...formData, incidence_type: e.target.value })}
                                                        className="w-full h-12 px-4 border border-red-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-dark-surface2 text-dark-text shadow-sm"
                                                        required
                                                    >
                                                        <option value="">-- Seleccione --</option>
                                                        <option value="Merma">Merma</option>
                                                        <option value="Rechazo">Rechazo</option>
                                                        <option value="Daño">Daño</option>
                                                        <option value="Otro">Otro</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-red-400 mb-1">
                                                        Cantidad de Bultos Afectados
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={formData.item_count}
                                                        onChange={(e) => setFormData({ ...formData, item_count: e.target.value })}
                                                        className="w-full h-12 px-4 border border-red-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-dark-surface2 text-dark-text shadow-sm"
                                                        placeholder="0"
                                                        min="0"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-red-400 mb-1">
                                                    Responsable (Quien recibe/rechaza)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.responsible}
                                                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                                                    className="w-full h-12 px-4 border border-red-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-dark-surface2 text-dark-text shadow-sm"
                                                    placeholder="Nombre del responsable"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-red-400 mb-1">Comentario / Descripción</label>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    className="w-full h-24 px-4 py-3 border border-red-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-dark-surface2 text-dark-text shadow-sm"
                                                    placeholder="Describe el daño, rechazo o problema en detalle..."
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-red-400 mb-2">Fotos de Evidencia</label>
                                                {renderPhotoGrid(incidentPhotos, 'incident', 4)}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-red-400 mb-2">
                                                    Adjuntar Excel / Informe de Rechazo
                                                </label>
                                                {formData.document_url ? (
                                                    <div className="relative p-4 bg-dark-surface2 border-2 border-red-500/50 rounded-xl">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="w-5 h-5 text-red-400" />
                                                                <span className="text-sm font-bold text-red-300">
                                                                    {formData.document_url.name || 'Documento adjuntado'}
                                                                </span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, document_url: null })}
                                                                className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label className="block p-4 border-2 border-dashed border-red-500/50 rounded-xl cursor-pointer hover:bg-dark-surface2 hover:border-red-500/80 transition-all text-center bg-dark-surface2">
                                                        <Upload className="w-6 h-6 text-red-400 mx-auto mb-2" />
                                                        <span className="text-sm font-bold text-red-400">
                                                            Subir Excel (.xlsx, .xls) o PDF
                                                        </span>
                                                        <input
                                                            type="file"
                                                            accept=".xlsx,.xls,.pdf"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0]
                                                                if (file) {
                                                                    setFormData({ ...formData, document_url: file })
                                                                    toast.success(`Archivo "${file.name}" seleccionado`)
                                                                }
                                                            }}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                ) : (
                    // --- MODO GASTO ---
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-5 glass-dark p-5 rounded-2xl border border-dark-border shadow-lg"
                    >
                        <h3 className="text-xs font-bold text-dark-text2 uppercase tracking-wider mb-2">Registro de Gasto</h3>

                        <div className={`grid gap-3 ${isPagoProveedor ? 'grid-cols-1' : 'grid-cols-1 fold:grid-cols-2'}`}>
                            <div>
                                <label className={labelClass}>Fecha</label>
                                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={inputClass} required />
                            </div>
                            {!isPagoProveedor && (
                                <div>
                                    <label className={labelClass}>Patente</label>
                                    <select value={formData.truck} onChange={(e) => setFormData({ ...formData, truck: e.target.value })} className={inputClass} required>
                                        {trucks.filter(t => t.is_own !== false).map(t => (
                                            <option key={t.id} value={t.plate}>
                                                {t.plate} {t.model ? `- ${t.model}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Campos para Pago Proveedor */}
                        {isPagoProveedor && (
                            <AnimatePresence>
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4 bg-dark-surface2 p-5 rounded-xl border border-dark-border"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Truck className="w-5 h-5 text-dark-text" />
                                        <h4 className="font-bold text-dark-text">Datos del Proveedor</h4>
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Nombre del Proveedor / Dueño <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.providerName}
                                            onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                                            className={inputClass}
                                            placeholder="Ej: Juan Pérez Transportes"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Patente del Camión Externo <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.externalPlate}
                                            onChange={(e) => setFormData({ ...formData, externalPlate: e.target.value.toUpperCase() })}
                                            className={inputClass}
                                            placeholder="XX-XX-XX"
                                            maxLength={8}
                                            required
                                        />
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        )}
                        <div>
                            <label className={labelClass}>Categoría</label>
                            <select 
                                value={formData.category} 
                                onChange={(e) => setFormData({ 
                                    ...formData, 
                                    category: e.target.value, 
                                    selectedEmployee: '', 
                                    mesPago: '', 
                                    liquidacionFile: null,
                                    providerName: '',
                                    externalPlate: ''
                                })} 
                                className={inputClass} 
                                required
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Lógica Reactiva: Si es Sueldo o Anticipo */}
                        {isSueldoOrAnticipo ? (
                            <AnimatePresence>
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4 bg-accent/10 p-5 rounded-xl border border-accent/30"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="w-5 h-5 text-accent" />
                                        <h4 className="font-bold text-accent">Datos del Trabajador</h4>
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
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text2 w-5 h-5" />
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
                                            <div className="relative p-4 bg-dark-surface2 border-2 border-accent/50 rounded-xl mt-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-5 h-5 text-accent" />
                                                        <span className="text-sm font-bold text-accent">
                                                            {formData.liquidacionFile.name}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, liquidacionFile: null })}
                                                        className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="block p-4 border-2 border-dashed border-accent/50 rounded-xl cursor-pointer hover:bg-dark-surface2 hover:border-accent/80 transition-all text-center mt-2 bg-dark-surface2">
                                                <Upload className="w-6 h-6 text-accent mx-auto mb-2" />
                                                <span className="text-sm font-bold text-accent">
                                                    Subir Liquidación (PDF o Foto)
                                                </span>
                                                <input
                                                    type="file"
                                                    accept=".pdf,image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0]
                                                        if (file) {
                                                            setFormData({ ...formData, liquidacionFile: file })
                                                            toast.success(`Archivo "${file.name}" seleccionado`)
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
                                    <div className="grid grid-cols-2 gap-4 bg-accent/10 p-4 rounded-lg border border-accent/30">
                                        <div>
                                            <label className="text-xs font-bold text-accent">Litros</label>
                                            <input type="number" step="0.1" value={formData.liters} onChange={(e) => setFormData({ ...formData, liters: e.target.value })} className="w-full h-10 px-2 rounded border border-accent/30 bg-dark-surface2 text-dark-text" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-accent">KM</label>
                                            <input type="number" value={formData.mileage} onChange={(e) => setFormData({ ...formData, mileage: e.target.value })} className="w-full h-10 px-2 rounded border border-accent/30 bg-dark-surface2 text-dark-text" />
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
                            <label className={labelClass}>
                                Cuenta de Origen <span className="text-red-500">*</span>
                            </label>
                            <select 
                                value={formData.accountId} 
                                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })} 
                                className={inputClass}
                                required
                            >
                                <option value="">-- Seleccione una cuenta --</option>
                                {accounts.filter(acc => acc.is_active).map(account => (
                                    <option key={account.id} value={account.id}>
                                        {account.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-dark-text2 mt-1">¿De dónde sale la plata?</p>
                        </div>

                        <div>
                            <label className={labelClass}>Monto</label>
                            <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className={inputClass} placeholder="$0" required />
                        </div>

                        <div>
                            <label className={labelClass}>Nota (Opcional)</label>
                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full h-20 px-4 py-2 border border-dark-border rounded-lg bg-dark-surface2 text-dark-text placeholder-dark-text2" />
                        </div>
                    </motion.div>
                )}

                <motion.button 
                    type="submit" 
                    className="w-full h-14 bg-gradient-to-r from-accent to-accent-light text-white rounded-xl font-bold text-lg shadow-xl shadow-accent/30 active:scale-[0.98] transition-all sticky bottom-4 z-20 hover:shadow-accent/50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Save className="w-5 h-5 inline mr-2" />
                    Guardar
                </motion.button>
            </form>
        </div>
    )
}
