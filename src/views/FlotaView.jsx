import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, Truck, X, Upload, FileText, Image as ImageIcon, Building2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FlotaView({ showToast }) {
    const { trucks, addTruck, deleteTruck } = useApp()
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        plate: '',
        model: '',
        is_own: true,
        provider_name: '',
        truck_photo_url: null,
        document_photo_url: null
    })
    const [truckPhotoFile, setTruckPhotoFile] = useState(null)
    const [documentPhotoFile, setDocumentPhotoFile] = useState(null)

    const handleTruckPhotoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setTruckPhotoFile(file)
            const url = URL.createObjectURL(file)
            setFormData({ ...formData, truck_photo_url: url })
        }
    }

    const handleDocumentPhotoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setDocumentPhotoFile(file)
            const url = URL.createObjectURL(file)
            setFormData({ ...formData, document_photo_url: url })
        }
    }

    const formatPlate = (value) => {
        // Formato patente chilena: XX-XX-XX (6 caracteres + 2 guiones)
        const cleanValue = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6)
        if (cleanValue.length <= 2) return cleanValue
        if (cleanValue.length <= 4) return `${cleanValue.slice(0, 2)}-${cleanValue.slice(2)}`
        return `${cleanValue.slice(0, 2)}-${cleanValue.slice(2, 4)}-${cleanValue.slice(4)}`
    }

    const handlePlateChange = (e) => {
        const formatted = formatPlate(e.target.value)
        setFormData({ ...formData, plate: formatted })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.plate) {
            showToast('La patente es obligatoria', 'error')
            return
        }

        // Validación si es externo
        if (!formData.is_own) {
            if (!formData.provider_name || !formData.provider_name.trim()) {
                showToast('El nombre del proveedor es obligatorio para camiones externos', 'error')
                return
            }
        }

        const newTruck = {
            plate: formData.plate,
            model: formData.model || '',
            is_own: formData.is_own,
            provider_name: formData.is_own ? null : formData.provider_name,
            truck_photo_url: formData.truck_photo_url,
            document_photo_url: formData.is_own ? null : formData.document_photo_url
        }

        addTruck(newTruck)
        showToast(`Camión ${formData.plate} agregado correctamente`, 'success')

        // Reset form
        setFormData({
            plate: '',
            model: '',
            is_own: true,
            provider_name: '',
            truck_photo_url: null,
            document_photo_url: null
        })
        setTruckPhotoFile(null)
        setDocumentPhotoFile(null)
        setShowForm(false)
    }

    const handleDelete = (truckId, plate) => {
        if (window.confirm(`¿Eliminar el camión ${plate}?`)) {
            deleteTruck(truckId)
            showToast('Camión eliminado', 'success')
        }
    }

    const inputClass = "w-full h-12 px-4 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
    const labelClass = "block text-sm font-bold text-slate-700 mb-1"

    return (
        <div className="max-w-2xl mx-auto pb-24">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Flota</h1>
                <p className="text-slate-600">Gestión de Camiones</p>
            </div>

            {/* Lista de Camiones */}
            <div className="space-y-3 mb-20">
                {trucks.map((truck) => (
                    <motion.div
                        key={truck.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
                    >
                        <div className="flex items-start gap-4">
                            {/* Foto del camión o icono por defecto */}
                            <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {truck.truck_photo_url ? (
                                    <img 
                                        src={truck.truck_photo_url} 
                                        alt={`Camión ${truck.plate}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Truck className="w-8 h-8 text-slate-400" />
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-bold text-slate-900 text-lg">
                                        {truck.plate}
                                    </h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        truck.is_own 
                                            ? 'bg-blue-100 text-blue-700' 
                                            : 'bg-orange-100 text-orange-700'
                                    }`}>
                                        {truck.is_own ? 'Propio' : 'Externo'}
                                    </span>
                                </div>

                                {truck.model && (
                                    <p className="text-sm text-slate-600 mb-1">
                                        {truck.model}
                                    </p>
                                )}

                                {!truck.is_own && truck.provider_name && (
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <Building2 className="w-3 h-3" />
                                        {truck.provider_name}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={() => handleDelete(truck.id, truck.plate)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar camión"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}

                {trucks.length === 0 && (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                        <Truck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 text-lg font-medium">No hay camiones registrados</p>
                        <p className="text-slate-400 text-sm">Agrega tu primer camión para comenzar</p>
                    </div>
                )}
            </div>

            {/* Botón Flotante */}
            <button
                onClick={() => setShowForm(true)}
                className="fixed bottom-24 right-4 md:right-auto md:left-1/2 md:transform md:-translate-x-1/2 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl shadow-blue-600/30 flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all z-40"
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Modal Formulario */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-900">Nuevo Camión</h2>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Patente */}
                                <div>
                                    <label className={labelClass}>
                                        Patente <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.plate}
                                        onChange={handlePlateChange}
                                        className={inputClass}
                                        placeholder="XX-XX-XX"
                                        maxLength={8}
                                        required
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Formato: 2 letras - 2 letras - 2 números</p>
                                </div>

                                {/* Marca/Modelo */}
                                <div>
                                    <label className={labelClass}>Marca / Modelo</label>
                                    <input
                                        type="text"
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        className={inputClass}
                                        placeholder="Ej: Volvo FH, Scania R500"
                                    />
                                </div>

                                {/* Switch Es Propio */}
                                <div className="p-4 rounded-xl border-2 border-slate-200 bg-slate-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                                formData.is_own ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                                            }`}>
                                                <Truck className="w-6 h-6" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`font-bold ${formData.is_own ? 'text-blue-900' : 'text-orange-900'}`}>
                                                    ¿Es Propio?
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    {formData.is_own ? 'Camión de la empresa' : 'Camión externo/subcontrato'}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newIsOwn = !formData.is_own
                                                setFormData({ 
                                                    ...formData, 
                                                    is_own: newIsOwn,
                                                    provider_name: newIsOwn ? '' : formData.provider_name,
                                                    document_photo_url: newIsOwn ? null : formData.document_photo_url
                                                })
                                                if (newIsOwn) {
                                                    setDocumentPhotoFile(null)
                                                }
                                            }}
                                            className={`relative w-14 h-8 rounded-full transition-colors ${
                                                formData.is_own ? 'bg-blue-500' : 'bg-orange-500'
                                            }`}
                                        >
                                            <motion.div 
                                                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md" 
                                                animate={{ left: formData.is_own ? '4px' : '28px' }} 
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Campos condicionales para camión externo */}
                                {!formData.is_own && (
                                    <AnimatePresence>
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-4 bg-orange-50 p-5 rounded-xl border border-orange-200"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <Building2 className="w-5 h-5 text-orange-600" />
                                                <h4 className="font-bold text-orange-900">Datos del Proveedor</h4>
                                            </div>

                                            <div>
                                                <label className={labelClass}>
                                                    Nombre del Proveedor / Dueño <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.provider_name}
                                                    onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })}
                                                    className={inputClass}
                                                    placeholder="Ej: Juan Pérez Transportes"
                                                    required={!formData.is_own}
                                                />
                                            </div>

                                            <div>
                                                <label className={labelClass}>
                                                    Foto Contrato / Acuerdo Pago
                                                </label>
                                                {documentPhotoFile ? (
                                                    <div className="relative p-4 bg-white border-2 border-orange-300 rounded-xl mt-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="w-5 h-5 text-orange-600" />
                                                                <span className="text-sm font-bold text-orange-900">
                                                                    {documentPhotoFile.name}
                                                                </span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setDocumentPhotoFile(null)
                                                                    setFormData({ ...formData, document_photo_url: null })
                                                                }}
                                                                className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label className="block p-4 border-2 border-dashed border-orange-300 rounded-xl cursor-pointer hover:bg-white hover:border-orange-400 transition-all text-center mt-2 bg-white">
                                                        <Upload className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                                                        <span className="text-sm font-bold text-orange-700">
                                                            Subir Contrato (PDF o Foto)
                                                        </span>
                                                        <input
                                                            type="file"
                                                            accept=".pdf,image/*"
                                                            onChange={handleDocumentPhotoChange}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                )}

                                {/* Foto del Camión (siempre visible) */}
                                <div>
                                    <label className={labelClass}>
                                        Foto del Camión
                                    </label>
                                    {truckPhotoFile ? (
                                        <div className="relative mt-2">
                                            <img 
                                                src={formData.truck_photo_url} 
                                                alt="Foto del camión"
                                                className="w-full h-48 object-cover rounded-xl border-2 border-slate-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setTruckPhotoFile(null)
                                                    setFormData({ ...formData, truck_photo_url: null })
                                                }}
                                                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="block p-6 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-all text-center mt-2">
                                            <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                            <span className="text-sm font-bold text-slate-600">
                                                Subir Foto del Camión
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleTruckPhotoChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 h-12 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 h-12 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

