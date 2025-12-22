import { useState } from 'react'
import MobileHeader from './components/MobileHeader'
import BottomNav from './components/BottomNav'
import DesktopSidebar from './components/DesktopSidebar'
import RegistrarView from './views/RegistrarView'
import MovimientosView from './views/MovimientosView'
import CamionesView from './views/CamionesView'
import Toast from './components/Toast'
import { initialTransactions, trucks as initialTrucks } from './data/mockData'

function App() {
    const [activeView, setActiveView] = useState('registrar')
    const [transactions, setTransactions] = useState(initialTransactions)
    const [trucks, setTrucks] = useState(initialTrucks)
    const [toast, setToast] = useState(null)

    const showToast = (message, type = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const handleAddTransaction = (transaction) => {
        setTransactions([transaction, ...transactions])
    }

    const handleAddTruck = (truck) => {
        setTrucks([...trucks, truck])
        showToast(`Camión ${truck.model} agregado correctamente`, 'success')
    }

    const handleDeleteTruck = (truckId) => {
        setTrucks(trucks.filter(t => t.id !== truckId))
        showToast('Camión eliminado', 'success')
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile Header - visible on all screens */}
            <MobileHeader />

            {/* Desktop Sidebar - hidden on mobile */}
            <DesktopSidebar
                activeView={activeView}
                setActiveView={setActiveView}
            />

            {/* Main Content */}
            <main className="md:ml-64 p-4 pb-20 md:pb-4">
                {activeView === 'registrar' && (
                    <RegistrarView
                        onAddTransaction={handleAddTransaction}
                        showToast={showToast}
                        trucks={trucks}
                    />
                )}

                {activeView === 'movimientos' && (
                    <MovimientosView transactions={transactions} />
                )}

                {activeView === 'camiones' && (
                    <CamionesView
                        trucks={trucks}
                        onAddTruck={handleAddTruck}
                        onDeleteTruck={handleDeleteTruck}
                    />
                )}
            </main>

            {/* Mobile Bottom Navigation - hidden on desktop */}
            <BottomNav
                activeView={activeView}
                setActiveView={setActiveView}
            />

            {/* Toast Notifications */}
            {toast && <Toast message={toast.message} type={toast.type} />}
        </div>
    )
}

export default App
