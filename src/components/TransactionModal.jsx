import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, TrendingDown, TrendingUp } from 'lucide-react'

export default function TransactionModal({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        type: 'income',
        description: '',
        truck: 'Volvo FH',
        amount: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        const transaction = {
            id: Date.now(),
            date: 'Ahora',
            description: formData.description,
            truck: formData.truck,
            type: formData.type,
            amount: parseInt(formData.amount),
            status: 'completed',
        }

        onSave(transaction)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', duration: 0.3 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-slate-900 text-white px-8 py-5 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg">Registrar Nueva Operación</h3>
                        <p className="text-xs text-slate-400">Ingresa gastos o ingresos manualmente</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8">
                    {/* Type Selection */}
                    <div className="flex gap-4 mb-6">
                        <label className="flex-1 cursor-pointer">
                            <input
                                type="radio"
                                name="type"
                                value="income"
                                checked={formData.type === 'income'}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="peer hidden"
                            />
                            <div className="border-2 border-slate-200 rounded-xl p-3 text-center peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 transition-all hover:bg-gray-50">
                                <TrendingDown className="w-5 h-5 mx-auto mb-1" />
                                <div className="text-sm font-bold">Ingreso (Flete)</div>
                            </div>
                        </label>

                        <label className="flex-1 cursor-pointer">
                            <input
                                type="radio"
                                name="type"
                                value="expense"
                                checked={formData.type === 'expense'}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="peer hidden"
                            />
                            <div className="border-2 border-slate-200 rounded-xl p-3 text-center peer-checked:border-red-500 peer-checked:bg-red-50 peer-checked:text-red-700 transition-all hover:bg-gray-50">
                                <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                                <div className="text-sm font-bold">Gasto (Salida)</div>
                            </div>
                        </label>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                Descripción / Carga
                            </label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ej: Flete Cemento Melón"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                    Camión
                                </label>
                                <select
                                    value={formData.truck}
                                    onChange={(e) => setFormData({ ...formData, truck: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option>Volvo FH</option>
                                    <option>Scania R500</option>
                                    <option>Mercedes Actros</option>
                                    <option>Volvo FH16</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                    Monto (CLP)
                                </label>
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg transition-transform transform active:scale-95 flex justify-center items-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                Guardar y Procesar
                            </button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    )
}
