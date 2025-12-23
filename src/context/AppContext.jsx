import { createContext, useContext, useState } from 'react'
import { initialTransactions, trucks as initialTrucks } from '../data/mockData'

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
    
    // Flota de camiones (con estructura actualizada)
    const [trucks, setTrucks] = useState(
        initialTrucks.map(truck => ({
            id: truck.id,
            plate: truck.plate,
            model: truck.model || '',
            is_own: true, // Por defecto son propios los existentes
            provider_name: null,
            truck_photo_url: null,
            document_photo_url: null,
            // Campos legacy para compatibilidad
            driver: truck.driver,
            route: truck.route,
            status: truck.status,
            profit: truck.profit
        }))
    )

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

    const addTruck = (truck) => {
        const newTruck = {
            id: Date.now(),
            ...truck
        }
        setTrucks([...trucks, newTruck])
        return newTruck
    }

    const deleteTruck = (truckId) => {
        setTrucks(trucks.filter(t => t.id !== truckId))
    }

    const value = {
        employees,
        transactions,
        trucks,
        addEmployee,
        addTransaction,
        addTruck,
        deleteTruck,
        setEmployees,
        setTransactions,
        setTrucks
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

