import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Calendar, Truck, DollarSign, Map, Camera, AlertTriangle } from 'lucide-react'
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
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="glass-dark rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-dark-border"
                >
                    {/* Header */}
                    <div className="sticky top-0 glass-dark border-b border-dark-border p-5 flex items-start justify-between z-10">
                        <div className="flex-1 pr-4">
                            <h2 className="text-xl font-bold text-dark-text leading-tight mb-1">{movement.description}</h2>
                            <div className="flex items-center gap-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase ${movement.type === 'income'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {movement.type === 'income' ? 'Ingreso' : 'Gasto'}
                                </span>
                                {movement.routeId && (
                                    <span className="flex items-center gap-1 text-dark-text2 text-sm font-medium">
                                        <Map className="w-3 h-3" /> Ruta #{movement.routeId}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="block text-2xl font-bold font-mono text-dark-text">
                                {formatCurrency(movement.amount)}
                            </span>
                            <button onClick={onClose} className="mt-2 text-sm text-dark-text2 font-medium hover:text-dark-text">Cerrar</button>
                        </div>
                    </div>

                    {/* Alert Section - Reclamo */}
                    {movement.hasComplaint && (
                        <div className="mx-5 mt-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-red-400 text-sm">Problema Reportado</p>
                                    <p className="text-sm text-red-300 mt-1 leading-relaxed">
                                        {movement.complaintDetails?.description || movement.description}
                                    </p>
                                    {movement.complaintDetails?.folio && movement.complaintDetails.folio !== 'N/A' && (
                                        <p className="text-xs text-red-400 mt-1 font-mono">Ref: {movement.complaintDetails.folio}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Body */}
                    <div className="p-6 space-y-6">

                        {/* Meta Data Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-dark-surface2 rounded-xl border border-dark-border">
                                <p className="text-xs text-dark-text2 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Fecha</p>
                                <p className="font-bold text-dark-text">{movement.date}</p>
                            </div>
                            <div className="p-3 bg-dark-surface2 rounded-xl border border-dark-border">
                                <p className="text-xs text-dark-text2 mb-1 flex items-center gap-1"><Truck className="w-3 h-3" /> Camión</p>
                                <p className="font-bold text-dark-text">{movement.truck}</p>
                            </div>
                            {movement.fuelDetails && (
                                <>
                                    <div className="p-3 bg-accent/10 rounded-xl border border-accent/30">
                                        <p className="text-xs text-accent mb-1">Litros</p>
                                        <p className="font-bold text-accent">{movement.fuelDetails.liters}</p>
                                    </div>
                                    <div className="p-3 bg-accent/10 rounded-xl border border-accent/30">
                                        <p className="text-xs text-accent mb-1">Kilometraje</p>
                                        <p className="font-bold text-accent">{movement.fuelDetails.mileage}</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Tags */}
                        {tagsArray.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-dark-text2 uppercase tracking-widest mb-3">Clasificación</h3>
                                <div className="flex flex-wrap gap-2">
                                    {tagsArray.map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-dark-surface2 text-dark-text rounded-lg text-xs font-bold border border-dark-border">
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
                                        <h3 className="text-sm font-bold text-dark-text mb-3 flex items-center gap-2">
                                            <Camera className="w-4 h-4" /> Fotos de Ruta
                                        </h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            {movement.evidence.routePhotos.map((url, i) => (
                                                <img key={i} src={url} onClick={() => setLightboxImage(url)} className="aspect-square object-cover rounded-lg border border-dark-border cursor-zoom-in hover:shadow-lg transition-shadow" />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Incident Evidence */}
                                {movement.evidence.incidentPhotos?.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" /> Evidencia del Problema
                                        </h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            {movement.evidence.incidentPhotos.map((url, i) => (
                                                <img key={i} src={url} onClick={() => setLightboxImage(url)} className="aspect-square object-cover rounded-lg border-2 border-red-500/50 cursor-zoom-in hover:shadow-lg transition-shadow" />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Legacy Photos Fallback */
                            legacyPhotos.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-dark-text2 uppercase tracking-widest mb-3">Evidencia Adjunta</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {legacyPhotos.map((url, i) => (
                                            <img key={i} src={url} onClick={() => setLightboxImage(url)} className="aspect-square object-cover rounded-lg border border-dark-border cursor-zoom-in" />
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

