import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Calendar, Truck, DollarSign, Map, Camera } from 'lucide-react'
import { formatCurrency } from '../utils/helpers'

export default function MovementDetailModal({ movement, onClose }) {
    const [lightboxImage, setLightboxImage] = useState(null)

    if (!movement) return null

    const tagsArray = movement.tags ? movement.tags.split(', ').filter(Boolean) : []

    // Check for evidence structure (new) vs flat photos (old)
    const hasEvidenceStructure = movement.evidence && (movement.evidence.routePhotos || movement.evidence.incidentPhotos)
    const legacyPhotos = movement.photos || []

    return (
        <>
            {/* Modal Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                onClick={onClose}
            >
                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-start justify-between z-10">
                        <div className="flex-1 pr-4">
                            <h2 className="text-xl font-bold text-slate-800 leading-tight mb-1">{movement.description}</h2>
                            <div className="flex items-center gap-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase ${movement.type === 'income'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-red-100 text-red-700'
                                    }`}>
                                    {movement.type === 'income' ? 'Ingreso' : 'Gasto'}
                                </span>
                                {movement.routeId && (
                                    <span className="flex items-center gap-1 text-slate-500 text-sm font-medium">
                                        <Map className="w-3 h-3" /> Ruta #{movement.routeId}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="block text-2xl font-bold font-mono text-slate-900">
                                {formatCurrency(movement.amount)}
                            </span>
                            <button onClick={onClose} className="mt-2 text-sm text-slate-400 font-medium hover:text-slate-600">Cerrar</button>
                        </div>
                    </div>

                    {/* Alert Section - Reclamo (Nueva lógica usa 'hasComplaint' y description) */}
                    {movement.hasComplaint && (
                        <div className="mx-5 mt-5 p-4 bg-red-50 border border-red-100 rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-red-900 text-sm">Problema Reportado</p>
                                    <p className="text-sm text-red-700 mt-1 leading-relaxed">
                                        {movement.complaintDetails?.description || movement.description}
                                    </p>
                                    {movement.complaintDetails?.folio && movement.complaintDetails.folio !== 'N/A' && (
                                        <p className="text-xs text-red-500 mt-1 font-mono">Ref: {movement.complaintDetails.folio}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Body */}
                    <div className="p-6 space-y-6">

                        {/* Meta Data Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Fecha</p>
                                <p className="font-bold text-slate-800">{movement.date}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Truck className="w-3 h-3" /> Camión</p>
                                <p className="font-bold text-slate-800">{movement.truck}</p>
                            </div>
                            {movement.fuelDetails && (
                                <>
                                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                        <p className="text-xs text-blue-600 mb-1">Litros</p>
                                        <p className="font-bold text-blue-900">{movement.fuelDetails.liters}</p>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                        <p className="text-xs text-blue-600 mb-1">Kilometraje</p>
                                        <p className="font-bold text-blue-900">{movement.fuelDetails.mileage}</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Tags */}
                        {tagsArray.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Clasificación</h3>
                                <div className="flex flex-wrap gap-2">
                                    {tagsArray.map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Evidence Section */}
                        {hasEvidenceStructure ? (
                            <div className="space-y-6">
                                {/* Route Evidence */}
                                {movement.evidence.routePhotos?.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                            <Camera className="w-4 h-4" /> Fotos de Ruta
                                        </h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            {movement.evidence.routePhotos.map((url, i) => (
                                                <img key={i} src={url} onClick={() => setLightboxImage(url)} className="aspect-square object-cover rounded-lg border border-slate-200 cursor-zoom-in hover:shadow-md transition-shadow" />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Incident Evidence */}
                                {movement.evidence.incidentPhotos?.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" /> Evidencia del Problema
                                        </h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            {movement.evidence.incidentPhotos.map((url, i) => (
                                                <img key={i} src={url} onClick={() => setLightboxImage(url)} className="aspect-square object-cover rounded-lg border-2 border-red-100 cursor-zoom-in hover:shadow-md transition-shadow" />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Legacy Photos Fallback */
                            legacyPhotos.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Evidencia Adjunta</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {legacyPhotos.map((url, i) => (
                                            <img key={i} src={url} onClick={() => setLightboxImage(url)} className="aspect-square object-cover rounded-lg border border-slate-200 cursor-zoom-in" />
                                        ))}
                                    </div>
                                </div>
                            )
                        )}

                    </div>
                </motion.div>
            </motion.div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
                        onClick={() => setLightboxImage(null)}
                    >
                        <button className="absolute top-5 right-5 text-white bg-white/10 rounded-full p-2 hover:bg-white/20">
                            <X className="w-6 h-6" />
                        </button>
                        <img src={lightboxImage} className="max-w-full max-h-full object-contain" />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

function AlertTriangle({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </svg>
    )
}
