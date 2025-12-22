import { createContext, useContext, useState } from 'react'
import { initialTransactions } from '../data/mockData'

const AppContext = createContext()

export const useApp = () => {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('useApp debe usarse dentro de AppProvider')
    }
    return context
}

export const AppProvider = ({ children }) => {
    // Empleado ficticio pre-cargado
    const [employees, setEmployees] = useState([
        {
            id: 1,
            nombre: 'Pedro González',
            rut: '12.345.678-9',
            fechaNacimiento: '1985-03-15',
            cargo: 'Chofer',
            contratoUrl: null
        }
    ])

    const [transactions, setTransactions] = useState(initialTransactions)

    const addEmployee = (employee) => {
        const newEmployee = {
            id: Date.now(),
            ...employee
        }
        setEmployees([...employees, newEmployee])
        return newEmployee
    }

    const addTransaction = (transaction) => {
        const newTransaction = {
            id: Date.now(),
            ...transaction
        }
        setTransactions([newTransaction, ...transactions])
        return newTransaction
    }

    const value = {
        employees,
        transactions,
        addEmployee,
        addTransaction,
        setEmployees,
        setTransactions
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

