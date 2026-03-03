import { useState } from 'react'
import { motion } from 'framer-motion'
import { LogIn, Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import Logo from '../components/Logo'
import { useApp } from '../context/AppContext'

export default function LoginView({ onLoginSuccess }) {
    const { login } = useApp()
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [focusedField, setFocusedField] = useState(null)
    const [showPass, setShowPass] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 700))

        const user = login(credentials.email, credentials.password)
        if (!user) {
            toast.error('Credenciales incorrectas')
            setIsLoading(false)
            return
        }

        const roleLabel = user.role === 'admin' ? '¡Bienvenido, Administrador!' : '¡Bienvenido, Operador!'
        toast.success(roleLabel)
        setIsLoading(false)
        setTimeout(() => onLoginSuccess(user), 300)
    }

    const fillDemo = (role) => {
        if (role === 'admin') setCredentials({ email: 'admin@logisystem.cl', password: 'admin123' })
        else setCredentials({ email: 'operador@logisystem.cl', password: 'op123' })
    }

    const vortexVariants = {
        animate: {
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            transition: {
                rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
                scale: { duration: 20, repeat: Infinity, ease: 'easeInOut' }
            }
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-zinc-950">
            {/* Fondo Vortex */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    variants={vortexVariants}
                    animate="animate"
                    className="absolute -top-1/2 -left-1/2 w-full h-full"
                    style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, rgba(217,119,6,0.05) 50%, transparent 80%)', filter: 'blur(100px)' }}
                />
                <motion.div
                    variants={vortexVariants}
                    animate="animate"
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full"
                    style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.1) 0%, rgba(245,158,11,0.04) 50%, transparent 80%)', filter: 'blur(120px)' }}
                />
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-md"
                >
                    {/* Logo */}
                    <motion.div variants={itemVariants} className="mb-10 flex justify-center">
                        <Logo size="large" showText={true} />
                    </motion.div>

                    {/* Card */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-zinc-900/60 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-zinc-800/50"
                    >
                        <h2 className="text-2xl font-bold text-zinc-100 mb-1 text-center">Iniciar Sesión</h2>
                        <p className="text-zinc-500 text-sm text-center mb-8">Transportes López SPA</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-zinc-300 mb-2">Correo Electrónico</label>
                                <div className="relative">
                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-amber-500' : 'text-zinc-500'}`} />
                                    <input
                                        type="email"
                                        value={credentials.email}
                                        onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full h-14 pl-12 pr-4 bg-zinc-800/60 border-2 border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-all text-base"
                                        placeholder="tu@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-zinc-300 mb-2">Contraseña</label>
                                <div className="relative">
                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-amber-500' : 'text-zinc-500'}`} />
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        value={credentials.password}
                                        onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full h-14 pl-12 pr-12 bg-zinc-800/60 border-2 border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-all text-base"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Botón Ingresar */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            >
                                {isLoading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /><span>Ingresando...</span></>
                                ) : (
                                    <><LogIn className="w-5 h-5" /><span>Ingresar</span></>
                                )}
                            </motion.button>
                        </form>

                        {/* Accesos rápidos demo */}
                        <div className="mt-6 pt-5 border-t border-zinc-800">
                            <p className="text-xs text-zinc-600 text-center mb-3 uppercase font-semibold tracking-wider">Acceso Demo</p>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => fillDemo('admin')}
                                    className="py-2.5 px-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-all"
                                >
                                    👑 Admin (Fito)
                                </button>
                                <button
                                    onClick={() => fillDemo('operador')}
                                    className="py-2.5 px-3 bg-zinc-800/60 border border-zinc-700 rounded-xl text-zinc-400 text-xs font-semibold hover:bg-zinc-800 transition-all"
                                >
                                    🚚 Operador
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    <motion.p variants={itemVariants} className="text-center text-zinc-700 text-xs mt-6">
                        © 2025 Transportes López SPA — LogiSystem
                    </motion.p>
                </motion.div>
            </div>
        </div>
    )
}
