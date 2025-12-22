import { motion } from 'framer-motion'
import { CheckCircle, Info } from 'lucide-react'

export default function Toast({ message, type = 'success' }) {
    const icons = {
        success: CheckCircle,
        info: Info,
    }

    const colors = {
        success: 'bg-emerald-600',
        info: 'bg-blue-600',
    }

    const Icon = icons[type]

    return (
        <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className={`fixed top-20 right-5 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50`}
        >
            <Icon className="w-5 h-5" />
            <span className="font-bold text-sm">{message}</span>
        </motion.div>
    )
}
