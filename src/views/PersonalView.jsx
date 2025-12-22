import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, User, FileText, X, Upload, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PersonalView({ showToast }) {
    const { employees, addEmployee } = useApp()
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        nombre: '',
        rut: '',
        fechaNacimiento: '',
        cargo: '',
        contratoUrl: null
    })
    const [contratoFile, setContratoFile] = useState(null)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setContratoFile(file)
            const url = URL.createObjectURL(file)
            setFormData({ ...formData, contratoUrl: url })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.nombre || !formData.rut || !formData.fechaNacimiento || !formData.cargo) {
            showToast('Completa todos los campos obligatorios', 'error')
            return
        }

        addEmployee({
            nombre: formData.nombre,
            rut: formData.rut,
            fechaNacimiento: formData.fechaNacimiento,
            cargo: formData.cargo,
            contratoUrl: formData.contratoUrl
        })

        showToast(`Empleado ${formData.nombre} agregado correctamente`, 'success')

        // Reset form
        setFormData({
            nombre: '',
            rut: '',
            fechaNacimiento: '',
            cargo: '',
            contratoUrl: null
        })
        setContratoFile(null)
        setShowForm(false)
    }

    const formatRut = (value) => {
        // Formato RUT chileno: 12.345.678-9
        const cleanValue = value.replace(/[^0-9kK]/g, '')
        if (cleanValue.length <= 1) return cleanValue
        
        const body = cleanValue.slice(0, -1)
        const dv = cleanValue.slice(-1).toUpperCase()
        
        const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        return `${formattedBody}-${dv}`
    }

    const handleRutChange = (e) => {
        const formatted = formatRut(e.target.value)
        setFormData({ ...formData, rut: formatted })
    }

    const inputClass = "w-full h-12 px-4 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
    const labelClass = "block text-sm font-bold text-slate-700 mb-1"

    return (
        <div className="max-w-2xl mx-auto pb-24">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Personal</h1>
                <p className="text-slate-600">Gestión de Recursos Humanos</p>
            </div>

            {/* Lista de Empleados */}
            <div className="space-y-3 mb-20">
                {employees.map((employee) => (
                    <motion.div
                        key={employee.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 text-lg mb-1">
                                        {employee.nombre}
                                    </h3>
                                    <p className="text-sm text-slate-600 mb-2">
                                        {employee.cargo}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        RUT: {employee.rut}
                                    </p>
                                </div>
                            </div>
                            {employee.contratoUrl && (
                                <a
                                    href={employee.contratoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-blue-100 transition-colors"
                                >
                                    <FileText className="w-4 h-4" />
                                    Ver Contrato
                                </a>
                            )}
                        </div>
                    </motion.div>
                ))}
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
                                <h2 className="text-xl font-bold text-slate-900">Nuevo Empleado</h2>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className={labelClass}>Nombre Completo <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        className={inputClass}
                                        placeholder="Ej: Juan Pérez"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>RUT <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.rut}
                                        onChange={handleRutChange}
                                        className={inputClass}
                                        placeholder="12.345.678-9"
                                        maxLength={12}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Fecha de Nacimiento <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            type="date"
                                            value={formData.fechaNacimiento}
                                            onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                                            className={`${inputClass} pl-10`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>Cargo <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.cargo}
                                        onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                                        className={inputClass}
                                        placeholder="Ej: Chofer, Administrador, etc."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Adjuntar Contrato</label>
                                    <div className="mt-2">
                                        {contratoFile ? (
                                            <div className="relative p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-5 h-5 text-blue-600" />
                                                        <span className="text-sm font-bold text-blue-900">
                                                            {contratoFile.name}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setContratoFile(null)
                                                            setFormData({ ...formData, contratoUrl: null })
                                                        }}
                                                        className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="block p-6 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-all text-center">
                                                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                                <span className="text-sm font-bold text-slate-600">
                                                    Subir PDF o Foto
                                                </span>
                                                <input
                                                    type="file"
                                                    accept=".pdf,image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
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

