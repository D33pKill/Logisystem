import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { AppProvider, useApp } from './context/AppContext'
import LoginView from './views/LoginView'
import BottomNav from './components/BottomNav'
import DesktopSidebar from './components/DesktopSidebar'
import InicioView from './views/InicioView'
import OperacionesView from './views/OperacionesView'
import PersonalView from './views/PersonalView'
import AjustesView from './views/AjustesView'
import PerfilView from './views/PerfilView'

const toastConfig = {
    duration: 3500,
    style: {
        background: '#18181b',
        color: '#e4e4e7',
        border: '1px solid #3f3f46',
        fontSize: '15px',
        padding: '14px 18px',
    },
    success: { iconTheme: { primary: '#d97706', secondary: '#fff' } },
    error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
}

const pageVariants = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.22 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.14 } }
}

function AppContent() {
    const { currentUser, logout } = useApp()
    const [activeView, setActiveView] = useState('inicio')

    useEffect(() => { setActiveView('inicio') }, [currentUser?.id])

    if (!currentUser) {
        return (
            <>
                <Toaster position="top-right" toastOptions={toastConfig} />
                <LoginView onLoginSuccess={() => { }} />
            </>
        )
    }

    return (
        <>
            <Toaster position="top-right" toastOptions={toastConfig} />

            {/* Layout raíz: sidebar + contenido */}
            <div className="flex min-h-screen bg-dark-bg">

                {/* Sidebar — solo desktop (md+) */}
                <DesktopSidebar activeView={activeView} setActiveView={setActiveView} />

                {/* Zona de contenido — empuja a la derecha del sidebar en desktop */}
                <div className="flex-1 flex flex-col min-h-screen md:ml-64">
                    <main className="flex-1 px-4 pt-2 pb-24 md:pb-8 md:px-8 md:pt-6 max-w-4xl mx-auto w-full">
                        <AnimatePresence mode="wait">
                            {activeView === 'inicio' && (
                                <motion.div key="inicio" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                                    <InicioView onNavigate={setActiveView} />
                                </motion.div>
                            )}
                            {activeView === 'operaciones' && (
                                <motion.div key="operaciones" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                                    <OperacionesView onNavigate={setActiveView} />
                                </motion.div>
                            )}
                            {activeView === 'personal' && (
                                <motion.div key="personal" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                                    <PersonalView />
                                </motion.div>
                            )}
                            {activeView === 'ajustes' && (
                                <motion.div key="ajustes" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                                    <AjustesView />
                                </motion.div>
                            )}
                            {activeView === 'perfil' && (
                                <motion.div key="perfil" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                                    <PerfilView onLogout={logout} onNavigate={setActiveView} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>

                    {/* Bottom Nav — solo mobile (oculto en md+) */}
                    <BottomNav activeView={activeView} setActiveView={setActiveView} />
                </div>
            </div>
        </>
    )
}

export default function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    )
}
