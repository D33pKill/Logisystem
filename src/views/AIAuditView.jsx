import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Brain, CheckCircle, Sparkles, FileText, Calendar, DollarSign, Tag, Lock, Crown, Zap } from 'lucide-react'
import { formatCurrency } from '../utils/helpers'

export default function AIAuditView({ demoMode = 'pro' }) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [processingStep, setProcessingStep] = useState(0)
    const [showResults, setShowResults] = useState(false)

    const processingSteps = [
        { icon: FileText, text: 'Leyendo documento con OCR avanzado...', delay: 800 },
        { icon: Calendar, text: 'Extrayendo fecha de factura...', delay: 1400 },
        { icon: DollarSign, text: 'Detectando monto total y conversión...', delay: 2000 },
        { icon: Tag, text: 'Clasificando categoría con IA predictiva...', delay: 2600 },
        { icon: Brain, text: 'Validando contra base de datos SII...', delay: 3200 },
        { icon: CheckCircle, text: 'Generando reporte de auditoría...', delay: 3800 },
    ]

    const mockResults = {
        date: '19/12/2024',
        amount: 450000,
        category: 'Combustible Diesel',
        vendor: 'Copec Ruta 5 Sur',
        rut: '99.520.000-7',
        invoiceNumber: 'FE-00145789',
        confidence: 98,
        suggestedAccount: 'Gastos Operacionales - Combustible',
        taxDeductible: true
    }

    const handleProcess = () => {
        if (demoMode !== 'pro') {
            alert('⚠️ La función de IA Auditoría está disponible solo en el Plan PRO IA.\n\nActiva el modo PRO desde el selector superior para ver esta funcionalidad.')
            return
        }

        setIsProcessing(true)
        setShowResults(false)
        setProcessingStep(0)

        processingSteps.forEach((step, index) => {
            setTimeout(() => {
                setProcessingStep(index + 1)

                if (index === processingSteps.length - 1) {
                    setTimeout(() => {
                        setIsProcessing(false)
                        setShowResults(true)
                    }, 800)
                }
            }, step.delay)
        })
    }

    // MODOS BÁSICO Y ESTÁNDAR: Mostrar pantalla de upgrade
    if (demoMode !== 'pro') {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">IA Auditoría PRO</h2>
                    <p className="text-slate-500">Procesamiento inteligente de facturas con Inteligencia Artificial</p>
                </div>

                {/* Locked State */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-12 shadow-xl border-2 border-slate-300 relative overflow-hidden"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                    </div>

                    <div className="relative z-10 text-center">
                        <div className="inline-block bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-full mb-6 shadow-lg">
                            <Lock className="w-16 h-16 text-white" />
                        </div>

                        <h3 className="text-3xl font-bold text-slate-800 mb-4">
                            Función Exclusiva Plan PRO IA
                        </h3>

                        <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
                            La auditoría inteligente de facturas con IA está disponible solo en el <strong>Plan PRO IA</strong>.
                            Cambia al modo PRO desde el selector superior para experimentar esta funcionalidad.
                        </p>

                        <div className="bg-white rounded-xl p-6 shadow-lg mb-8 max-w-xl mx-auto">
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center justify-center gap-2">
                                <Crown className="w-5 h-5 text-yellow-500" />
                                ¿Qué incluye esta función?
                            </h4>
                            <ul className="text-left space-y-3 text-sm text-slate-600">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>OCR Avanzado:</strong> Extracción automática de datos de facturas en papel o PDF</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>Clasificación Inteligente:</strong> IA asigna categorías contables automáticamente</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>Validación SII:</strong> Verifica autenticidad contra Servicio de Impuestos Internos</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>Reportes PDF:</strong> Genera documentos de auditoría profesionales</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span><strong>Ahorro de 42 horas/mes:</strong> vs ingreso manual de facturas</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => alert('Para cambiar de plan, contacta con ventas@logisystem.cl o llama al +56 9 1234 5678')}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all transform hover:scale-105 flex items-center gap-2"
                            >
                                <Zap className="w-5 h-5" />
                                Upgrade a PRO IA
                            </button>
                            <button
                                className="px-8 py-4 border-2 border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl font-bold text-lg transition-all"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            >
                                Cambiar Modo Demo
                            </button>
                        </div>

                        <p className="text-xs text-slate-500 mt-6">
                            💡 Tip: Cambia al <strong className="text-blue-600">Modo PRO IA</strong> en el selector del header para ver esta funcionalidad en acción
                        </p>
                    </div>
                </motion.div>

                {/* Comparison Table */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-4 text-center">Comparación de Planes</h4>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Funcionalidad</th>
                                <th className="text-center py-2">Básico</th>
                                <th className="text-center py-2">Estándar</th>
                                <th className="text-center py-2 bg-blue-50">PRO IA</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-600">
                            <tr className="border-b">
                                <td className="py-2">IA Auditoría de Facturas</td>
                                <td className="text-center">❌</td>
                                <td className="text-center">❌</td>
                                <td className="text-center bg-blue-50 font-bold text-blue-600">✅</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2">Exportación Excel</td>
                                <td className="text-center">❌</td>
                                <td className="text-center">❌</td>
                                <td className="text-center bg-blue-50 font-bold text-blue-600">✅</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2">Reportes PDF</td>
                                <td className="text-center">❌</td>
                                <td className="text-center">❌</td>
                                <td className="text-center bg-blue-50 font-bold text-blue-600">✅</td>
                            </tr>
                            <tr>
                                <td className="py-2">Validación SII Automática</td>
                                <td className="text-center">❌</td>
                                <td className="text-center">❌</td>
                                <td className="text-center bg-blue-50 font-bold text-blue-600">✅</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    // MODO PRO: Funcionalidad completa
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-3">
                    <Crown className="w-4 h-4" />
                    MODO PRO IA ACTIVADO
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">IA Auditoría PRO</h2>
                <p className="text-slate-500">Procesamiento inteligente de facturas con Inteligencia Artificial</p>
            </div>

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="text-white">
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <Brain className="w-6 h-6 text-indigo-400" />
                            Procesamiento Inteligente de Facturas
                        </h3>
                        <p className="text-slate-300 text-sm">Sube una imagen y la IA extrae todos los datos automáticamente + validación SII</p>
                    </div>
                    <div className="bg-indigo-600/20 p-4 rounded-xl border border-indigo-500/30">
                        <Sparkles className="w-12 h-12 text-indigo-400 animate-pulse" />
                    </div>
                </div>

                {/* Upload Area */}
                <div
                    className="border-2 border-dashed border-slate-600 rounded-xl p-12 mb-6 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-slate-800/50"
                    onClick={!isProcessing ? handleProcess : undefined}
                >
                    <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-white font-bold mb-1">Click para simular carga de factura</p>
                    <p className="text-slate-400 text-sm">Esta es una demostración del sistema PRO con IA</p>
                </div>

                {/* Processing Animation */}
                <AnimatePresence>
                    {isProcessing && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-3 mb-6"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>

                            {processingSteps.slice(0, processingStep).map((step, index) => {
                                const Icon = step.icon
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-3 text-white bg-slate-700/50 rounded-lg p-3"
                                    >
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <Icon className="w-5 h-5 text-indigo-400" />
                                        <span className="text-sm">{step.text}</span>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results */}
                <AnimatePresence>
                    {showResults && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                                    <p className="text-slate-400 text-xs mb-1 uppercase font-bold">N° Factura</p>
                                    <p className="text-white text-lg font-bold font-mono">{mockResults.invoiceNumber}</p>
                                </div>

                                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                                    <p className="text-slate-400 text-xs mb-1 uppercase font-bold">RUT Proveedor</p>
                                    <p className="text-white text-lg font-bold font-mono">{mockResults.rut}</p>
                                </div>

                                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                                    <p className="text-slate-400 text-xs mb-1 uppercase font-bold">Fecha detectada</p>
                                    <p className="text-white text-lg font-bold">{mockResults.date}</p>
                                </div>

                                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                                    <p className="text-slate-400 text-xs mb-1 uppercase font-bold">Monto total</p>
                                    <p className="text-white text-lg font-bold font-mono">{formatCurrency(mockResults.amount)}</p>
                                </div>

                                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                                    <p className="text-slate-400 text-xs mb-1 uppercase font-bold">Categoría</p>
                                    <p className="text-white text-lg font-bold">{mockResults.category}</p>
                                </div>

                                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                                    <p className="text-slate-400 text-xs mb-1 uppercase font-bold">Proveedor</p>
                                    <p className="text-white text-lg font-bold">{mockResults.vendor}</p>
                                </div>

                                <div className="col-span-2 bg-emerald-900/30 rounded-lg p-4 border border-emerald-500/30">
                                    <p className="text-emerald-300 text-sm font-bold mb-2">✅ Cuenta Contable Sugerida</p>
                                    <p className="text-white text-lg font-bold">{mockResults.suggestedAccount}</p>
                                    <p className="text-emerald-300 text-xs mt-2">
                                        {mockResults.taxDeductible ? '💰 Gasto deducible de impuestos' : 'No deducible'}
                                    </p>
                                </div>

                                <div className="col-span-2 bg-indigo-900/30 rounded-lg p-4 border border-indigo-500/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-indigo-300 text-sm font-bold flex items-center gap-2">
                                            <Brain className="w-4 h-4" />
                                            Nivel de Confianza IA
                                        </span>
                                        <span className="text-indigo-300 text-2xl font-bold font-mono">{mockResults.confidence}%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${mockResults.confidence}%` }}
                                            transition={{ duration: 1, delay: 0.3 }}
                                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                >
                    <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <Sparkles className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2">Ahorro de Tiempo</h4>
                    <p className="text-slate-600 text-sm">42 horas/mes ahorradas vs ingreso manual</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                >
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2">Facturas Procesadas</h4>
                    <p className="text-slate-600 text-sm">1,847 documentos este mes</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                >
                    <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2">Precisión IA</h4>
                    <p className="text-slate-600 text-sm">99% validado por usuarios reales</p>
                </motion.div>
            </div>
        </div>
    )
}
