import { motion } from 'framer-motion'
import { useCountUp } from '../hooks/useCountUp'
import { formatCurrency } from '../utils/helpers'
import { cn } from '../utils/helpers'

export default function KPICard({ title, value, icon: Icon, trend, borderColor, iconBg, delay = 0 }) {
    const animatedValue = useCountUp(value, 1500)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className={cn(
                'bg-white p-6 rounded-xl shadow-sm border-r-4 hover:shadow-md transition-all group',
                borderColor
            )}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1 font-mono tracking-tight">
                        {formatCurrency(animatedValue)}
                    </h3>
                </div>
                <div className={cn('p-3 rounded-xl group-hover:scale-110 transition-transform', iconBg)}>
                    {Icon && <Icon className="w-6 h-6" />}
                </div>
            </div>
            {trend && (
                <div className="flex items-center text-xs text-slate-500">
                    <span className={cn(
                        'font-bold px-2 py-0.5 rounded mr-2 flex items-center',
                        trend.positive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                    )}>
                        {trend.icon} {trend.value}
                    </span>
                    <span>{trend.label}</span>
                </div>
            )}
        </motion.div>
    )
}
