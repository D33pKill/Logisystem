import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Calendar, Truck, DollarSign } from 'lucide-react'
import { formatCurrency } from '../utils/helpers'

export default function MovementDetailModal({ movement, onClose }) {
    const [lightboxImage, setLightboxImage] = useState(null)

    if (!movement) return null

    const tagsArray = movement.tags ? movement.tags.split(', ').filter(Boolean) : []

    return (
        <>
            {/* Modal Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between z-10">
                        <div className="flex-1 pr-4">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">{movement.description}</h2>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${movement.type === 'income'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                    {movement.type === 'income' ? 'INGRESO' : 'GASTO'}
                                </span>
                                <span className="text-3xl font-bold font-mono text-slate-900">
                                    {formatCurrency(movement.amount)}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors flex-shrink-0"
                        >
                            <X className="w-6 h-6 text-slate-600" />
                        </button>
                    </div>

                    {/* Alert Section - Reclamo */}
                    {movement.hasComplaint && movement.complaintDetails && (
                        <div className="mx-6 mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold">⚠️</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-red-900 mb-1">Reclamo reportado</p>
                                    <p className="text-sm text-red-700">
                                        <span className="font-bold">Folio:</span> {movement.complaintDetails.folio}
                                    </p>
                                    <p className="text-sm text-red-700 mt-1">
                                        {movement.complaintDetails.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Context Section - Grid */}
                    <div className="p-6 space-y-6">
                        {/* Tags */}
                        {tagsArray.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-slate-700 mb-3">Etiquetas del Viaje</h3>
                                <div className="flex flex-wrap gap-2">
                                    {tagsArray.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-bold"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Data Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-slate-600" />
                                <div>
                                    <p className="text-xs text-slate-600">Fecha</p>
                                    <p className="font-bold text-slate-900">{movement.date}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <Truck className="w-5 h-5 text-slate-600" />
                                <div>
                                    <p className="text-xs text-slate-600">Patente</p>
                                    <p className="font-bold text-slate-900 font-mono">{movement.truck}</p>
                                </div>
                            </div>

                            {movement.fuelDetails && movement.fuelDetails.liters > 0 && (
                                <>
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                        <span className="text-2xl">🛢️</span>
                                        <div>
                                            <p className="text-xs text-blue-700">Litros Combustible</p>
                                            <p className="font-bold text-blue-900">{movement.fuelDetails.liters} L</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                        <span className="text-2xl">🚗</span>
                                        <div>
                                            <p className="text-xs text-blue-700">Kilometraje</p>
                                            <p className="font-bold text-blue-900">{movement.fuelDetails.mileage.toLocaleString()} km</p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {movement.category && (
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <FileText className="w-5 h-5 text-slate-600" />
                                    <div>
                                        <p className="text-xs text-slate-600">Categoría</p>
                                        <p className="font-bold text-slate-900">{movement.category}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Photo Gallery */}
                        {movement.photos && movement.photos.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-slate-700 mb-3">Evidencia Adjunta</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {movement.photos.map((photoUrl, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setLightboxImage(photoUrl)}
                                            className="aspect-square rounded-lg overflow-hidden border-2 border-slate-200 hover:border-blue-500 transition-colors cursor-pointer group relative"
                                        >
                                            <img
                                                src={photoUrl}
                                                alt={`Evidencia ${index + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold">
                                                    Ver
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Haz clic en una imagen para ampliar</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4">
                        <button
                            onClick={onClose}
                            className="w-full h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </motion.div>
            </motion.div>

            {/* Lightbox for full-size images */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
                        onClick={() => setLightboxImage(null)}
                    >
                        <button
                            onClick={() => setLightboxImage(null)}
                            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        <motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            src={lightboxImage}
                            alt="Vista completa"
                            className="max-w-full max-h-full object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
