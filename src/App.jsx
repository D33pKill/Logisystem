import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import DashboardView from './views/DashboardView'
import FleetView from './views/FleetView'
import FinancesView from './views/FinancesView'
import AIAuditView from './views/AIAuditView'
import PricingView from './views/PricingView'
import TransactionModal from './components/TransactionModal'
import Toast from './components/Toast'

function App() {
    const [activeView, setActiveView] = useState('dashboard')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [toast, setToast] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [demoMode, setDemoMode] = useState('pro') // 'basic', 'standard', 'pro'

    const showToast = (message, type = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const handleAddTransaction = (transaction) => {
        setTransactions([transaction, ...transactions])
        setIsModalOpen(false)
        showToast('Movimiento registrado correctamente', 'success')
    }

    const renderView = () => {
        const viewProps = { transactions, onAddTransaction: () => setIsModalOpen(true), demoMode }

        switch (activeView) {
            case 'dashboard':
                return <DashboardView {...viewProps} />
            case 'fleet':
                return <FleetView demoMode={demoMode} />
            case 'finances':
                return <FinancesView transactions={transactions} demoMode={demoMode} />
            case 'ai-audit':
                return <AIAuditView />
            case 'pricing':
                return <PricingView />
            default:
                return <DashboardView {...viewProps} />
        }
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    onNewMovement={() => setIsModalOpen(true)}
                    demoMode={demoMode}
                    setDemoMode={setDemoMode}
                />

                <main className="flex-1 overflow-y-auto scrollbar-thin p-6">
                    {renderView()}
                </main>
            </div>

            {isModalOpen && (
                <TransactionModal
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddTransaction}
                />
            )}

            {toast && <Toast message={toast.message} type={toast.type} />}
        </div>
    )
}

export default App
