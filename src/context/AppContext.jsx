import { createContext, useContext, useState, useEffect } from 'react'
import { initialTransactions, trucks as initialTrucks } from '../data/mockData'

const AppContext = createContext()

// Claves para localStorage
const STORAGE_KEYS = {
    TRANSACTIONS: 'logisystem_transactions',
    TRUCKS: 'logisystem_trucks',
    EMPLOYEES: 'logisystem_employees',
    ACCOUNTS: 'logisystem_accounts',
    CONFIG: 'logisystem_config'
}

// Funciones helper para localStorage
const loadFromStorage = (key, defaultValue) => {
    try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : defaultValue
    } catch (error) {
        console.error(`Error loading ${key} from localStorage:`, error)
        return defaultValue
    }
}

const saveToStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error)
    }
}

export const useApp = () => {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('useApp debe usarse dentro de AppProvider')
    }
    return context
}

export const AppProvider = ({ children }) => {
    // Empleados - cargar desde localStorage o usar datos iniciales
    const [employees, setEmployeesState] = useState(() => {
        const saved = loadFromStorage(STORAGE_KEYS.EMPLOYEES, null)
        if (saved) return saved

        // Datos iniciales: 2 choferes de ejemplo para que Fito pueda probar inmediatamente
        return [
            {
                id: 1,
                nombre: 'Pedro González',
                rut: '12.345.678-9',
                fechaNacimiento: '1985-03-15',
                cargo: 'Chofer',
                contratoUrl: null
            },
            {
                id: 2,
                nombre: 'Juan Pérez',
                rut: '13.456.789-0',
                fechaNacimiento: '1988-07-22',
                cargo: 'Chofer',
                contratoUrl: null
            }
        ]
    })

    // Cuentas bancarias - cargar desde localStorage o usar datos iniciales
    const [accounts, setAccountsState] = useState(() => {
        const saved = loadFromStorage(STORAGE_KEYS.ACCOUNTS, null)
        if (saved) return saved

        // 3 cuentas por defecto: Banco Estado, Santander y Caja Chica
        return [
            { id: 1, name: 'Banco Estado', type: 'banco', is_active: true },
            { id: 2, name: 'Santander', type: 'banco', is_active: true },
            { id: 3, name: 'Caja Chica', type: 'efectivo', is_active: true }
        ]
    })

    // Transacciones - cargar desde localStorage o iniciar vacío para demo limpia
    const [transactions, setTransactionsState] = useState(() => {
        const saved = loadFromStorage(STORAGE_KEYS.TRANSACTIONS, null)
        if (saved) return saved
        // Iniciar vacío para que Fito vea balance en $0
        return []
    })

    // Flota de camiones - cargar desde localStorage o usar datos iniciales
    const [trucks, setTrucksState] = useState(() => {
        const saved = loadFromStorage(STORAGE_KEYS.TRUCKS, null)
        if (saved) return saved

        // 2 camiones de ejemplo para que Fito pueda probar inmediatamente
        return [
            {
                id: 1,
                plate: 'ABCD-12',
                model: 'Volvo FH',
                is_own: true,
                provider_name: null,
                photo_url: null,
                contract_url: null,
                truck_photo_url: null,
                document_photo_url: null
            },
            {
                id: 2,
                plate: 'WXYZ-98',
                model: 'Scania R500',
                is_own: true,
                provider_name: null,
                photo_url: null,
                contract_url: null,
                truck_photo_url: null,
                document_photo_url: null
            }
        ]
    })

    // Sincronizar con localStorage cuando cambien los estados
    useEffect(() => {
        saveToStorage(STORAGE_KEYS.EMPLOYEES, employees)
    }, [employees])

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.ACCOUNTS, accounts)
    }, [accounts])

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions)
    }, [transactions])

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.TRUCKS, trucks)
    }, [trucks])

    // Wrappers que actualizan el estado (localStorage se guarda automáticamente vía useEffect)
    const setEmployees = (newEmployees) => {
        setEmployeesState(newEmployees)
    }

    const setAccounts = (newAccounts) => {
        setAccountsState(newAccounts)
    }

    const setTransactions = (newTransactions) => {
        setTransactionsState(newTransactions)
    }

    const setTrucks = (newTrucks) => {
        setTrucksState(newTrucks)
    }

    const addEmployee = (employee) => {
        const newEmployee = {
            id: Date.now(),
            ...employee
        }
        const updated = [...employees, newEmployee]
        setEmployees(updated)
        return newEmployee
    }

    const addTransaction = (transaction) => {
        const newTransaction = {
            id: Date.now(),
            status: 'active', // Estado por defecto
            ...transaction
        }
        const updated = [newTransaction, ...transactions]
        setTransactions(updated)
        return newTransaction
    }

    const voidTransaction = (id) => {
        const updated = transactions.map(t =>
            t.id === id ? { ...t, status: 'voided' } : t
        )
        setTransactions(updated)
    }

    const addTruck = (truck) => {
        const newTruck = {
            id: Date.now(),
            ...truck
        }
        const updated = [...trucks, newTruck]
        setTrucks(updated)
        return newTruck
    }

    const deleteTruck = (truckId) => {
        const updated = trucks.filter(t => t.id !== truckId)
        setTrucks(updated)
    }

    const addAccount = (account) => {
        const newAccount = {
            id: Date.now(),
            ...account
        }
        const updated = [...accounts, newAccount]
        setAccounts(updated)
        return newAccount
    }

    const value = {
        employees,
        transactions,
        trucks,
        accounts,
        addEmployee,
        addTransaction,
        voidTransaction,
        addTruck,
        deleteTruck,
        addAccount,
        setEmployees,
        setTransactions,
        setTrucks,
        setAccounts
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

