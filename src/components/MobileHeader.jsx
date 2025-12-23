import { Truck, Calendar, LogOut, Settings } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCurrentDate } from '../utils/helpers'
import Logo from './Logo'

export default function MobileHeader({ onLogout, foldOptimization, onToggleFoldOptimization }) {
    const [showSettings, setShowSettings] = useState(false)
    return (
        <>
            <header className="glass-dark border-b border-dark-border sticky top-0 z-40 backdrop-blur-xl transition-all duration-300">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center">
                        <Logo size="small" showText={true} variant="horizontal" />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-dark-text2 bg-dark-surface2 px-3 py-2 rounded-lg border border-dark-border">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{getCurrentDate()}</span>
                        </div>
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={`p-2 rounded-lg transition-all ${
                                showSettings 
                                    ? 'bg-dark-surface2 text-amber-500' 
                                    : 'text-dark-text2 hover:bg-dark-surface2'
                            }`}
                            title="Configuración"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onLogout}
                            className="p-2 text-dark-text2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all"
                            title="Cerrar Sesión"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Modal de Configuración - Fuera del header para mejor z-index */}
            <AnimatePresence>
                {showSettings && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                            onClick={() => setShowSettings(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed bottom-20 left-4 right-4 bg-dark-surface border border-dark-border rounded-2xl p-5 z-[101] shadow-2xl max-w-md mx-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-dark-text">Configuración</h3>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="text-dark-text2 hover:text-dark-text w-8 h-8 flex items-center justify-center rounded-lg hover:bg-dark-surface2 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-dark-surface2 border border-dark-border/50">
                                    <div className="flex-1 mr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-semibold text-dark-text">Optimización para Plegables</span>
                                            <span className="text-[10px] font-bold text-amber-500/70 uppercase px-1.5 py-0.5 bg-amber-500/10 rounded">Beta</span>
                                        </div>
                                        <p className="text-xs text-dark-text2 mt-1">
                                            Activa el modo adaptativo para dispositivos plegables
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onToggleFoldOptimization()
                                        }}
                                        className={`relative w-14 h-7 rounded-full transition-colors duration-300 flex-shrink-0 ${
                                            foldOptimization ? 'bg-amber-500' : 'bg-zinc-700'
                                        }`}
                                    >
                                        <motion.div
                                            className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-lg"
                                            animate={{ left: foldOptimization ? 'calc(100% - 1.5rem)' : '0.125rem' }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
