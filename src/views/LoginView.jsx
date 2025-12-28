import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LogIn, Loader2, Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import Logo from '../components/Logo'

export default function LoginView({ onLoginSuccess }) {
    const [credentials, setCredentials] = useState({
        email: 'admin@logisystem.cl',
        password: 'demo123'
    })
    const [isLoading, setIsLoading] = useState(false)
    const [focusedField, setFocusedField] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        // Validación de credenciales
        const validEmail = 'admin@logisystem.cl'
        const validPassword = 'demo123' // Puedes cambiar esto a lo que necesites

        if (credentials.email !== validEmail || credentials.password !== validPassword) {
            await new Promise(resolve => setTimeout(resolve, 800))
            toast.error('Credenciales incorrectas')
            setIsLoading(false)
            return
        }

        // Simulación de login exitoso
        await new Promise(resolve => setTimeout(resolve, 800))

        toast.success('¡Bienvenido a LogiSystem!')
        setIsLoading(false)
        
        // Redirigir al dashboard con transición suave
        setTimeout(() => {
            onLoginSuccess()
        }, 300)
    }

    // Animación del fondo vortex
    const vortexVariants = {
        animate: {
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            transition: {
                rotate: {
                    duration: 60,
                    repeat: Infinity,
                    ease: 'linear'
                },
                scale: {
                    duration: 20,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }
            }
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 20,
                duration: 0.6
            }
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-zinc-950">
            {/* Fondo Vortex Animado - Ajustado para integrar el logo */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    variants={vortexVariants}
                    animate="animate"
                    className="absolute -top-1/2 -left-1/2 w-full h-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.05) 50%, transparent 80%)',
                        filter: 'blur(100px)'
                    }}
                />
                <motion.div
                    variants={vortexVariants}
                    animate="animate"
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(217, 119, 6, 0.1) 0%, rgba(245, 158, 11, 0.04) 50%, transparent 80%)',
                        filter: 'blur(120px)',
                        animationDelay: '10s'
                    }}
                />
                {/* Gradiente adicional para integración del logo */}
                <div 
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96"
                    style={{
                        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)',
                        filter: 'blur(60px)'
                    }}
                />
            </div>

            {/* Grid pattern overlay muy sutil - ajustado para coincidir con logo */}
            <div 
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(245, 158, 11, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.15) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Contenido principal */}
            <div className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-md"
                >
                    {/* Logo integrado nativamente con efectos de integración */}
                    <motion.div 
                        variants={itemVariants}
                        className="mb-10 flex justify-center relative"
                    >
                        {/* Efecto de halo sutil alrededor del logo */}
                        <div 
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
                                filter: 'blur(40px)',
                                transform: 'scale(1.5)'
                            }}
                        />
                        <div className="relative z-10">
                            <Logo size="large" showText={true} />
                        </div>
                    </motion.div>

                    {/* Card de login con Glassmorphism mejorado */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-zinc-900/50 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl border border-zinc-800/50"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Input Email */}
                            <div>
                                <label className="block text-sm font-semibold text-zinc-200 mb-2">
                                    Correo Electrónico
                                </label>
                                <div className="relative">
                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                                        focusedField === 'email' ? 'text-amber-500' : 'text-zinc-500'
                                    }`} />
                                    <input
                                        type="email"
                                        value={credentials.email}
                                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full h-14 pl-12 pr-4 bg-zinc-800/50 border-2 border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:bg-zinc-800/70 transition-all duration-300"
                                        placeholder="tu@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Input Password */}
                            <div>
                                <label className="block text-sm font-semibold text-zinc-200 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                                        focusedField === 'password' ? 'text-amber-500' : 'text-zinc-500'
                                    }`} />
                                    <input
                                        type="password"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full h-14 pl-12 pr-4 bg-zinc-800/50 border-2 border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:bg-zinc-800/70 transition-all duration-300"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Botón de ingreso */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group mt-8"
                                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    initial={false}
                                />
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                                        <span className="relative z-10">Ingresando...</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5 relative z-10" />
                                        <span className="relative z-10">Ingresar</span>
                                    </>
                                )}
                            </motion.button>

                            {/* Info adicional */}
                            <p className="text-xs text-center text-zinc-500 pt-2">
                                Credenciales pre-cargadas para demostración
                            </p>
                        </form>
                    </motion.div>

                    {/* Footer */}
                    <motion.p
                        variants={itemVariants}
                        className="text-center text-zinc-600 text-sm mt-8"
                    >
                        © 2024 Transportes Lopez SPA - LogiSystem Enterprise
                    </motion.p>
                </motion.div>
            </div>
        </div>
    )
}
