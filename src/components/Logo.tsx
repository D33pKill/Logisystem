import { motion, useReducedMotion } from 'framer-motion'

export default function Logo({ className = '', showText = true, size = 'default', variant = 'vertical' }) {
    const shouldReduceMotion = useReducedMotion()
    // Tamaños responsivos
    const sizeConfig = {
        small: { 
            imgSize: 'w-12 h-12', 
            containerSize: 'w-16',
            textSize: 'text-xs', 
            subtitleSize: 'text-[10px]' 
        },
        default: { 
            imgSize: 'w-32 md:w-40', 
            containerSize: 'w-40 md:w-48',
            textSize: 'text-xl md:text-2xl', 
            subtitleSize: 'text-xs md:text-sm' 
        },
        large: { 
            imgSize: 'w-48 md:w-64', 
            containerSize: 'w-56 md:w-72',
            textSize: 'text-2xl md:text-3xl', 
            subtitleSize: 'text-sm md:text-base' 
        }
    }
    
    const config = sizeConfig[size] || sizeConfig.default

    // Variante horizontal para sidebar/header
    if (variant === 'horizontal' || !showText) {
        return (
            <motion.div 
                className={`flex items-center gap-3 ${className}`}
                initial={{ opacity: 0, x: -10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ 
                    duration: shouldReduceMotion ? 0 : 0.6, 
                    ease: [0.22, 1, 0.36, 1],
                    layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                }}
                layout
            >
                <div className={`${config.imgSize} relative flex-shrink-0`}>
                    <img
                        src="/logo-transportes-lopez.png"
                        alt="Transportes Lopez SPA"
                        className="w-full h-full object-contain"
                        style={{
                            filter: 'brightness(1.05) contrast(1.08) saturate(1.12)',
                            mixBlendMode: 'normal',
                        }}
                    />
                    {/* Overlay sutil para integración con el fondo oscuro */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/3 via-transparent to-transparent pointer-events-none rounded" />
                </div>
                {showText && (
                    <div className="flex flex-col">
                        <span className={`${config.textSize} font-black tracking-tighter text-amber-500 uppercase leading-tight`}>
                            TRANSPORTES LOPEZ
                        </span>
                        <span className={`${config.subtitleSize} font-bold tracking-widest text-zinc-400 uppercase`}>
                            LOGISYSTEM
                        </span>
                    </div>
                )}
            </motion.div>
        )
    }

    return (
        <motion.div 
            className={`flex flex-col items-center justify-center ${className}`}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
                duration: shouldReduceMotion ? 0 : 0.6, 
                ease: [0.22, 1, 0.36, 1],
                layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
            }}
            layout
        >
            {/* Contenedor del Logo con efectos de integración */}
            <div className={`${config.containerSize} relative mb-4`}>
                <img
                    src="/logo-transportes-lopez.png"
                    alt="Transportes Lopez SPA"
                    className="w-full h-full object-contain relative z-10"
                    style={{
                        filter: 'brightness(1.08) contrast(1.1) saturate(1.18) drop-shadow(0 8px 24px rgba(245, 158, 11, 0.2))',
                        mixBlendMode: 'normal',
                    }}
                />
                {/* Overlay sutil para integración con el fondo - gradiente que coincide con el vortex */}
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/12 via-amber-500/5 to-transparent pointer-events-none rounded-lg z-0" />
                {/* Efecto de brillo sutil que se integra con el fondo */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-500/8 to-amber-500/3 pointer-events-none rounded-lg z-0" />
                {/* Sombra interna para profundidad */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-500/5 pointer-events-none rounded-lg z-0" />
            </div>

            {/* Texto solo si showText es true */}
            {showText && (
                <div className="text-center">
                    <h1 className={`${config.textSize} font-black tracking-tighter text-amber-500 uppercase leading-none mb-1`}>
                        TRANSPORTES LOPEZ SPA
                    </h1>
                    <p className={`${config.subtitleSize} font-bold tracking-widest text-zinc-400 uppercase`}>
                        Expertos en Primera y Última Milla
                    </p>
                </div>
            )}
        </motion.div>
    )
}
