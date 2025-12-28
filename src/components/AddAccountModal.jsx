import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Building2, Wallet } from 'lucide-react'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

export default function AddAccountModal({ isOpen, onClose, onAccountAdded }) {
    const { accounts, addAccount } = useApp()
    const [formData, setFormData] = useState({
        name: '',
        type: 'banco'
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.name || !formData.name.trim()) {
            toast.error('El nombre de la cuenta es obligatorio')
            return
        }

        // Verificar que no exista una cuenta con el mismo nombre
        const exists = accounts.some(acc => 
            acc.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
        )

        if (exists) {
            toast.error('Ya existe una cuenta con ese nombre')
            return
        }

        setIsSubmitting(true)

        const newAccountData = {
            name: formData.name.trim(),
            type: formData.type,
            is_active: true
        }

        setTimeout(() => {
            const addedAccount = addAccount(newAccountData)
            toast.success(`Cuenta "${newAccountData.name}" agregada correctamente`)
            setFormData({ name: '', type: 'banco' })
            setIsSubmitting(false)
            
            // Notificar al componente padre para actualizar selector con el ID generado
            if (onAccountAdded && addedAccount) {
                onAccountAdded(addedAccount.id)
            }
            
            onClose()
        }, 500)
    }

    if (!isOpen) return null

    const inputClass = "w-full h-12 px-4 border border-dark-border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-dark-surface2 text-dark-text placeholder-dark-text2 shadow-sm"
    const labelClass = "block text-sm font-bold text-dark-text mb-1"

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-[201] flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="glass-dark rounded-2xl p-6 w-full max-w-md shadow-2xl border border-dark-border">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                                        <Plus className="w-5 h-5 text-accent" />
                                    </div>
                                    <h2 className="text-xl font-bold text-dark-text">Nueva Cuenta Bancaria</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-lg bg-dark-surface2 flex items-center justify-center hover:bg-dark-border transition-colors"
                                >
                                    <X className="w-5 h-5 text-dark-text" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className={labelClass}>
                                        Nombre de la Cuenta <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text2 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className={`${inputClass} pl-10`}
                                            placeholder="Ej: Banco Santander, Banco de Chile..."
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Tipo de Cuenta <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text2 w-5 h-5" />
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className={`${inputClass} pl-10`}
                                            required
                                        >
                                            <option value="banco">Banco</option>
                                            <option value="efectivo">Efectivo</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <motion.button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 h-12 bg-dark-surface2 text-dark-text rounded-xl font-bold hover:bg-dark-border transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Cancelar
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 h-12 bg-gradient-to-r from-accent to-accent-light text-white rounded-xl font-bold hover:shadow-lg shadow-accent/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                    >
                                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

