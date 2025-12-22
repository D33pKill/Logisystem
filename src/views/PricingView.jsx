import { motion } from 'framer-motion'
import { Check, X, Sparkles, Shield } from 'lucide-react'
import { pricingPlans } from '../data/mockData'
import { formatCurrency } from '../utils/helpers'

export default function PricingView() {
    return (
        <div className="max-w-7xl mx-auto py-10 space-y-16">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">Inversión en Infraestructura Digital</h2>
                <p className="text-slate-500 max-w-2xl mx-auto">
                    Estas no son suscripciones mensuales. Estás adquiriendo la licencia perpetua del software para tu empresa.
                    Un activo digital que aumenta la valoración de tu flota.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end px-4">
                {pricingPlans.map((plan, index) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className={`rounded-2xl p-8 relative ${plan.highlighted
                                ? 'bg-white shadow-2xl border-2 border-blue-600 transform md:scale-110 z-10'
                                : plan.dark
                                    ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl border border-slate-700'
                                    : 'bg-white shadow-lg border border-slate-200 opacity-90 hover:opacity-100 transition-all transform hover:-translate-y-1'
                            }`}
                    >
                        {/* Badge */}
                        {plan.badge && (
                            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-bold shadow-lg tracking-wide">
                                {plan.badge}
                            </div>
                        )}

                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${plan.highlighted ? 'text-blue-600' : plan.dark ? 'text-indigo-400' : 'text-slate-500'
                                }`}>
                                {plan.name}
                            </div>
                            <h3 className={`text-2xl font-bold mb-4 ${plan.dark ? 'text-white' : 'text-slate-800'}`}>
                                {plan.subtitle}
                            </h3>
                            <div className="mb-6">
                                <span className={`text-5xl font-bold font-mono ${plan.dark ? 'text-white' : 'text-slate-800'}`}>
                                    {formatCurrency(plan.price)}
                                </span>
                                <span className={`text-xs font-bold uppercase block mt-1 ${plan.dark ? 'text-slate-400' : 'text-slate-400'
                                    }`}>
                                    {plan.priceLabel}
                                </span>
                            </div>
                        </div>

                        {/* Features */}
                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature, fIndex) => (
                                <li key={fIndex} className="flex items-start text-sm">
                                    {feature.included ? (
                                        <Check className={`w-5 h-5 mr-3 flex-shrink-0 ${plan.highlighted ? 'text-blue-600' : plan.dark ? 'text-indigo-400' : 'text-green-500'
                                            }`} />
                                    ) : (
                                        <X className="w-5 h-5 mr-3 flex-shrink-0 text-slate-300" />
                                    )}
                                    <span className={`${feature.bold ? 'font-bold' : ''
                                        } ${feature.included
                                            ? plan.dark ? 'text-white' : 'text-slate-700'
                                            : 'text-slate-300 line-through'
                                        }`}>
                                        {feature.text}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA Button */}
                        <button
                            className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all transform active:scale-95 ${plan.highlighted
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : plan.dark
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-500'
                                        : 'border-2 border-slate-200 text-slate-600 hover:border-slate-400'
                                }`}
                        >
                            {plan.cta}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Guarantee */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center max-w-2xl mx-auto"
            >
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield className="w-6 h-6 text-blue-600" />
                        <h4 className="font-semibold text-slate-900">Garantía de 30 días</h4>
                    </div>
                    <p className="text-sm text-slate-700">
                        Si no estás satisfecho con LogiSystem, te devolvemos el 100% de tu inversión. Sin preguntas.
                    </p>
                </div>
            </motion.div>

            {/* Additional Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center"
            >
                <Sparkles className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">¿Necesitas una solución personalizada?</h3>
                <p className="text-indigo-100 mb-6">
                    Contáctanos para una consultoría técnica gratuita y descubre cómo podemos adaptar el sistema a tus necesidades específicas.
                </p>
                <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-indigo-50 transition-colors">
                    Agendar Consultoría Gratuita
                </button>
            </motion.div>
        </div>
    )
}
