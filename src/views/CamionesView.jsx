import { useState } from 'react'
import { Truck, Plus, Edit2, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CamionesView({ trucks, onAddTruck, onDeleteTruck }) {
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        model: '',
        plate: '',
        driver: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.model || !formData.plate) {
            alert('⚠️ Completa al menos el modelo y patente del camión')
            return
        }

        const newTruck = {
            id: Date.now(),
            model: formData.model,
            plate: formData.plate.toUpperCase(),
            driver: formData.driver || 'Sin asignar',
            route: '-',
            status: 'En Espera',
            profit: 0
        }

        onAddTruck(newTruck)

        // Reset form
        setFormData({ model: '', plate: '', driver: '' })
        setShowForm(false)
    }

    const inputClass = "w-full h-12 px-4 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
    const labelClass = "block text-sm font-bold text-slate-700 mb-2"

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header con botón */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Gestión de Camiones</h2>
                    <p className="text-sm text-slate-500">Administra tu flota de vehículos</p>
                </div>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span className="hidden md:inline">Agregar Camión</span>
                </button>
            </div>

            {/* Formulario para agregar */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-6"
                    >
                        <h3 className="text-lg font-bold text-blue-900 mb-4">Nuevo Camión</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={labelClass}>Modelo del Camión *</label>
                                <input
                                    type="text"
                                    value={formData.model}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                    className={inputClass}
                                    placeholder="Ej: Volvo FH, Scania R500, Mercedes Actros"
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Patente *</label>
                                <input
                                    type="text"
                                    value={formData.plate}
                                    onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                                    className={inputClass}
                                    placeholder="ABCD-12"
                                    maxLength="8"
                                    required
                                />
                                <p className="text-xs text-slate-500 mt-1">Formato: 4 letras - 2 números</p>
                            </div>

                            <div>
                                <label className={labelClass}>Conductor Asignado (Opcional)</label>
                                <input
                                    type="text"
                                    value={formData.driver}
                                    onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                                    className={inputClass}
                                    placeholder="Nombre del conductor"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                                >
                                    Guardar Camión
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false)
                                        setFormData({ model: '', plate: '', driver: '' })
                                    }}
                                    className="px-6 h-12 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lista de camiones */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                    Flota Registrada ({trucks.length} {trucks.length === 1 ? 'camión' : 'camiones'})
                </h3>

                {trucks.length === 0 ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
                        <Truck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 text-lg font-medium">No hay camiones registrados</p>
                        <p className="text-slate-400 text-sm">Agrega tu primer camión para comenzar</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {trucks.map((truck, index) => (
                            <motion.div
                                key={truck.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <Truck className="w-6 h-6 text-blue-600" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-800 text-lg">{truck.model}</h4>
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-mono font-bold rounded">
                                                    {truck.plate}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-slate-600">
                                                <span>👤 {truck.driver}</span>
                                                {truck.route !== '-' && <span>📍 {truck.route}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botón eliminar */}
                                    <button
                                        onClick={() => {
                                            if (confirm(`¿Eliminar ${truck.model} (${truck.plate})?`)) {
                                                onDeleteTruck(truck.id)
                                            }
                                        }}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Eliminar camión"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
