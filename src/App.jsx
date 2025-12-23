import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'react-hot-toast'
import { AppProvider, useApp } from './context/AppContext'
import { useFoldOptimization } from './hooks/useFoldOptimization'
import { useWindowWidth } from './hooks/useWindowWidth'
import LoginView from './views/LoginView'
import MobileHeader from './components/MobileHeader'
import BottomNav from './components/BottomNav'
import DesktopSidebar from './components/DesktopSidebar'
import InicioView from './views/InicioView'
import RegistrarView from './views/RegistrarView'
import PersonalView from './views/PersonalView'
import FlotaView from './views/FlotaView'
import MovimientosView from './views/MovimientosView'

function AppContent() {
    const { transactions, trucks } = useApp()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [activeView, setActiveView] = useState('inicio')
    const [customTags, setCustomTags] = useState([])
    const [foldOptimization, toggleFoldOptimization] = useFoldOptimization()
    const windowWidth = useWindowWidth()
    
    // Lógica: En modo clásico siempre mostrar BottomNav y MobileHeader, en modo adaptativo depender del ancho
    const shouldShowSidebar = foldOptimization && windowWidth >= 600
    const shouldShowBottomNav = !foldOptimization || (foldOptimization && windowWidth < 600)
    const shouldShowMobileHeader = !foldOptimization || (foldOptimization && windowWidth < 600)

    useEffect(() => {
        // Siempre limpiar sesión al cargar para forzar login
        localStorage.removeItem('logisystem_auth')
        setIsAuthenticated(false)
    }, [])

    const handleLoginSuccess = () => {
        localStorage.setItem('logisystem_auth', 'true')
        setIsAuthenticated(true)
    }

    const handleLogout = () => {
        localStorage.removeItem('logisystem_auth')
        setIsAuthenticated(false)
        setActiveView('inicio')
    }

    const showToast = (message, type = 'success') => {
        if (type === 'success') {
            toast.success(message)
        } else {
            toast.error(message)
        }
    }

    const handleAddCustomTag = (tag) => {
        setCustomTags([...customTags, tag])
    }

    // Si no está autenticado, mostrar login
    if (!isAuthenticated) {
        return (
            <>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#18181b',
                            color: '#e4e4e7',
                            border: '1px solid #3f3f46',
                        },
                        success: {
                            iconTheme: {
                                primary: '#d97706',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
                <LoginView onLoginSuccess={handleLoginSuccess} />
            </>
        )
    }

    // Transiciones de página
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    }

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#18181b',
                        color: '#e4e4e7',
                        border: '1px solid #3f3f46',
                    },
                    success: {
                        iconTheme: {
                            primary: '#d97706',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            <div className="min-h-screen bg-dark-bg">
                {/* Mobile Header - Lógica condicional según toggle */}
                {shouldShowMobileHeader && (
                    <MobileHeader 
                        onLogout={handleLogout}
                        foldOptimization={foldOptimization}
                        onToggleFoldOptimization={toggleFoldOptimization}
                    />
                )}

                {/* Desktop Sidebar - Lógica condicional según toggle */}
                {shouldShowSidebar && (
                    <DesktopSidebar
                        activeView={activeView}
                        setActiveView={setActiveView}
                        onLogout={handleLogout}
                        foldOptimization={foldOptimization}
                        onToggleFoldOptimization={toggleFoldOptimization}
                    />
                )}

                {/* Main Content con transiciones - Adaptativo según toggle */}
                <main className={`p-4 pb-20 transition-all duration-300 ${
                    shouldShowSidebar ? 'ml-64 pb-4' : ''
                }`}>
                    <AnimatePresence mode="wait">
                        {activeView === 'inicio' && (
                            <motion.div
                                key="inicio"
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                            >
                                <InicioView onNavigate={setActiveView} />
                            </motion.div>
                        )}

                        {activeView === 'registrar' && (
                            <motion.div
                                key="registrar"
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                            >
                                <RegistrarView
                                    showToast={showToast}
                                    customTags={customTags}
                                    onAddCustomTag={handleAddCustomTag}
                                />
                            </motion.div>
                        )}

                        {activeView === 'personal' && (
                            <motion.div
                                key="personal"
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                            >
                                <PersonalView
                                    showToast={showToast}
                                />
                            </motion.div>
                        )}

                        {activeView === 'flota' && (
                            <motion.div
                                key="flota"
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                            >
                                <FlotaView
                                    showToast={showToast}
                                />
                            </motion.div>
                        )}

                        {activeView === 'movimientos' && (
                            <motion.div
                                key="movimientos"
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                            >
                                <MovimientosView
                                    showToast={showToast}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                {/* Mobile Bottom Navigation - Lógica condicional según toggle */}
                {shouldShowBottomNav && (
                    <BottomNav
                        activeView={activeView}
                        setActiveView={setActiveView}
                    />
                )}
            </div>
        </>
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
