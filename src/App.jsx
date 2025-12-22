import { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import MobileHeader from './components/MobileHeader'
import BottomNav from './components/BottomNav'
import DesktopSidebar from './components/DesktopSidebar'
import InicioView from './views/InicioView'
import RegistrarView from './views/RegistrarView'
import PersonalView from './views/PersonalView'
import MovimientosView from './views/MovimientosView'
import CamionesView from './views/CamionesView'
import Toast from './components/Toast'
import { trucks as initialTrucks } from './data/mockData'

function AppContent() {
    const { transactions } = useApp()
    const [activeView, setActiveView] = useState('inicio')
    const [trucks, setTrucks] = useState(initialTrucks)
    const [customTags, setCustomTags] = useState([])
    const [toast, setToast] = useState(null)

    const showToast = (message, type = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }


    const handleAddTruck = (truck) => {
        setTrucks([...trucks, truck])
        showToast(`Camión ${truck.model} agregado correctamente`, 'success')
    }

    const handleDeleteTruck = (truckId) => {
        setTrucks(trucks.filter(t => t.id !== truckId))
        showToast('Camión eliminado', 'success')
    }

    const handleAddCustomTag = (tag) => {
        setCustomTags([...customTags, tag])
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
                {activeView === 'inicio' && (
                    <InicioView />
                )}

                {activeView === 'registrar' && (
                    <RegistrarView
                        showToast={showToast}
                        trucks={trucks}
                        customTags={customTags}
                        onAddCustomTag={handleAddCustomTag}
                    />
                )}

                {activeView === 'personal' && (
                    <PersonalView
                        showToast={showToast}
                    />
                )}

                {activeView === 'movimientos' && (
                    <MovimientosView
                        showToast={showToast}
                    />
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

function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    )
}

export default App
