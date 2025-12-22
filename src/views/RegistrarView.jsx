import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Camera, AlertCircle, Droplet, Gauge, Save } from 'lucide-react'
import { trucks } from '../data/mockData'

export default function RegistrarView({ onAddTransaction, showToast }) {
    const [transactionType, setTransactionType] = useState('income')
    const [hasComplaint, setHasComplaint] = useState(false)
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        truck: 'Volvo FH',
        amount: '',
        description: '',
        category: 'Combustible',
        complaintFolio: '',
        complaintDetail: '',
        liters: '',
        mileage: ''
    })

    const categories = [
        'Combustible',
        'Peajes',
        'Sueldo Conductor',
        'Mantención',
        'Multas',
        'Indemnizaciones',
        'Otros'
    ]

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            showToast('Ingresa un monto válido', 'error')
            return
        }

        const transaction = {
            id: Date.now(),
            type: transactionType,
            date: formData.date,
            truck: formData.truck,
            amount: parseFloat(formData.amount),
            description: formData.description || (transactionType === 'income' ? 'Flete' : formData.category),
            ...(transactionType === 'income' && hasComplaint && {
                hasComplaint: true,
                complaintDetails: {
                    folio: formData.complaintFolio,
                    description: formData.complaintDetail
                }
            }),
            ...(transactionType === 'expense' && formData.category === 'Combustible' && {
                fuelDetails: {
                    liters: parseFloat(formData.liters) || 0,
                    mileage: parseFloat(formData.mileage) || 0
                }
            }),
            category: transactionType === 'expense' ? formData.category : null
        }

        onAddTransaction(transaction)
        showToast(`${transactionType === 'income' ? 'Ingreso' : 'Gasto'} registrado correctamente`, 'success')

        // Reset form
        setFormData({
            ...formData,
            amount: '',
            description: '',
            complaintFolio: '',
            complaintDetail: '',
            liters: '',
            mileage: ''
        })
        setHasComplaint(false)
    }

    const inputClass = "w-full h-12 px-4 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    const labelClass = "block text-sm font-bold text-slate-700 mb-2"

    return (
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Toggle Tipo */}
                <div>
                    <label className={labelClass}>Tipo de Movimiento</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setTransactionType('income')}
                            className={`h-12 rounded-lg font-bold text-base transition-all ${transactionType === 'income'
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                INGRESO
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setTransactionType('expense')}
                            className={`h-12 rounded-lg font-bold text-base transition-all ${transactionType === 'expense'
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <TrendingDown className="w-5 h-5" />
                                GASTO
                            </div>
                        </button>
                    </div>
                </div>

                {/* Fecha */}
                <div>
                    <label className={labelClass}>Fecha</label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className={inputClass}
                        required
                    />
                </div>

                {/* Camión */}
                <div>
                    <label className={labelClass}>Camión</label>
                    <select
                        value={formData.truck}
                        onChange={(e) => setFormData({ ...formData, truck: e.target.value })}
                        className={inputClass}
                        required
                    >
                        {trucks.map(truck => (
                            <option key={truck.id} value={truck.model}>
                                {truck.model} - {truck.plate}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Categoría (solo para gastos) */}
                <AnimatePresence>
                    {transactionType === 'expense' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <label className={labelClass}>Categoría de Gasto</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className={inputClass}
                                required
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Campos extra para Combustible */}
                <AnimatePresence>
                    {transactionType === 'expense' && formData.category === 'Combustible' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                            <p className="text-sm font-bold text-blue-900 flex items-center gap-2">
                                <Droplet className="w-4 h-4" />
                                Detalles de Combustible
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-blue-900 mb-1">Litros</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.liters}
                                        onChange={(e) => setFormData({ ...formData, liters: e.target.value })}
                                        className="w-full h-10 px-3 border border-blue-300 rounded-lg text-sm"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-900 mb-1">Kilometraje</label>
                                    <input
                                        type="number"
                                        value={formData.mileage}
                                        onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                                        className="w-full h-10 px-3 border border-blue-300 rounded-lg text-sm"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Monto */}
                <div>
                    <label className={labelClass}>Monto (CLP)</label>
                    <input
                        type="number"
                        step="1"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className={inputClass}
                        placeholder="0"
                        required
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label className={labelClass}>Descripción</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full h-20 px-4 py-3 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder={transactionType === 'income' ? 'Ej: Flete Falabella' : `Ej: ${formData.category}`}
                    />
                </div>

                {/* Switch de Reclamo (solo para ingresos) */}
                <AnimatePresence>
                    {transactionType === 'income' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                    <span className="font-bold text-red-900">¿Hubo Reclamo/Merma?</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setHasComplaint(!hasComplaint)}
                                    className={`relative w-14 h-8 rounded-full transition-colors ${hasComplaint ? 'bg-red-600' : 'bg-slate-300'
                                        }`}
                                >
                                    <motion.div
                                        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                                        animate={{ left: hasComplaint ? '28px' : '4px' }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                </button>
                            </div>

                            {/* Campos de reclamo */}
                            <AnimatePresence>
                                {hasComplaint && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                                    >
                                        <div>
                                            <label className="block text-sm font-bold text-red-900 mb-2">Folio del Reclamo</label>
                                            <input
                                                type="text"
                                                value={formData.complaintFolio}
                                                onChange={(e) => setFormData({ ...formData, complaintFolio: e.target.value })}
                                                className="w-full h-10 px-4 border border-red-300 rounded-lg"
                                                placeholder="#9921"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-red-900 mb-2">Detalle del Reclamo</label>
                                            <textarea
                                                value={formData.complaintDetail}
                                                onChange={(e) => setFormData({ ...formData, complaintDetail: e.target.value })}
                                                className="w-full h-16 px-4 py-2 border border-red-300 rounded-lg resize-none"
                                                placeholder="Ej: Caja mojada en tránsito"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            className="w-full h-12 bg-white border-2 border-red-300 text-red-700 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-red-50"
                                        >
                                            <Camera className="w-5 h-5" />
                                            Adjuntar Foto Evidencia
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Botón Foto para Gastos */}
                <AnimatePresence>
                    {transactionType === 'expense' && (
                        <motion.button
                            type="button"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="w-full h-12 bg-slate-100 border-2 border-slate-300 text-slate-700 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-200"
                        >
                            <Camera className="w-5 h-5" />
                            Adjuntar Foto Boleta/Vale
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all sticky bottom-20 md:bottom-4"
                >
                    <Save className="w-5 h-5" />
                    Guardar Movimiento
                </button>
            </form>
        </div>
    )
}
