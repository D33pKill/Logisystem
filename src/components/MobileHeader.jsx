import { Truck, Calendar } from 'lucide-react'
import { getCurrentDate } from '../utils/helpers'

export default function MobileHeader() {
    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
            <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800">LogiSystem</h1>
                        <p className="text-xs text-slate-500">Gestión Logística</p>
                    </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">{getCurrentDate()}</span>
                </div>
            </div>
        </header>
    )
}
