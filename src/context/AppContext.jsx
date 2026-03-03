import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
    maestrosIniciales,
    camionesIniciales,
    tarifasIniciales,
    empleadosIniciales,
    fletesIniciales,
    gastosIniciales,
    abonosIniciales,
    auditLogInicial,
    USUARIOS
} from '../data/mockData'

const AppContext = createContext()

const STORAGE_KEYS = {
    MAESTROS: 'logisystem_maestros',
    CAMIONES: 'logisystem_camiones',
    TARIFAS: 'logisystem_tarifas',
    EMPLEADOS: 'logisystem_empleados',
    FLETES: 'logisystem_fletes',
    GASTOS: 'logisystem_gastos',
    ABONOS: 'logisystem_abonos',
    AUDIT_LOG: 'logisystem_audit_log',
    CURRENT_USER: 'logisystem_current_user',
    // Legacy (mantener para compatibilidad)
    TRANSACTIONS: 'logisystem_transactions',
    ACCOUNTS: 'logisystem_accounts',
}

const load = (key, fallback) => {
    try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : fallback
    } catch {
        return fallback
    }
}

const save = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
        console.error(`Error saving ${key}:`, e)
    }
}

export const useApp = () => {
    const ctx = useContext(AppContext)
    if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider')
    return ctx
}

export const AppProvider = ({ children }) => {
    // ─── Usuario / Rol ─────────────────────────────────────────────────────────
    const [currentUser, setCurrentUser] = useState(() =>
        load(STORAGE_KEYS.CURRENT_USER, null)
    )

    // ─── Tablas Maestras ───────────────────────────────────────────────────────
    const [maestros, setMaestrosState] = useState(() =>
        load(STORAGE_KEYS.MAESTROS, maestrosIniciales)
    )

    // ─── Flota ────────────────────────────────────────────────────────────────
    const [camiones, setCamionesState] = useState(() =>
        load(STORAGE_KEYS.CAMIONES, camionesIniciales)
    )

    const [tarifas, setTarifasState] = useState(() =>
        load(STORAGE_KEYS.TARIFAS, tarifasIniciales)
    )

    // ─── Empleados ────────────────────────────────────────────────────────────
    const [empleados, setEmpleadosState] = useState(() => {
        const stored = load(STORAGE_KEYS.EMPLEADOS, null)
        if (!stored) return empleadosIniciales
        // Merge: agrega campos nuevos a registros viejos sin sobreescribir valores existentes
        const defaults = {
            email: '', notas: '', tipoContrato: 'planta',
            fechaIngreso: '', vencimientoLicencia: '', estado: 'disponible'
        }
        return stored.map(e => ({ ...defaults, ...e }))
    })

    // ─── Operaciones ──────────────────────────────────────────────────────────
    const [fletes, setFletesState] = useState(() =>
        load(STORAGE_KEYS.FLETES, fletesIniciales)
    )

    const [gastos, setGastosState] = useState(() =>
        load(STORAGE_KEYS.GASTOS, gastosIniciales)
    )

    const [abonos, setAbonosState] = useState(() =>
        load(STORAGE_KEYS.ABONOS, abonosIniciales)
    )

    // ─── Auditoría ─────────────────────────────────────────────────────────────
    const [auditLog, setAuditLogState] = useState(() =>
        load(STORAGE_KEYS.AUDIT_LOG, auditLogInicial)
    )

    // ─── Persistencia automática ──────────────────────────────────────────────
    useEffect(() => { save(STORAGE_KEYS.CURRENT_USER, currentUser) }, [currentUser])
    useEffect(() => { save(STORAGE_KEYS.MAESTROS, maestros) }, [maestros])
    useEffect(() => { save(STORAGE_KEYS.CAMIONES, camiones) }, [camiones])
    useEffect(() => { save(STORAGE_KEYS.TARIFAS, tarifas) }, [tarifas])
    useEffect(() => { save(STORAGE_KEYS.EMPLEADOS, empleados) }, [empleados])
    useEffect(() => { save(STORAGE_KEYS.FLETES, fletes) }, [fletes])
    useEffect(() => { save(STORAGE_KEYS.GASTOS, gastos) }, [gastos])
    useEffect(() => { save(STORAGE_KEYS.ABONOS, abonos) }, [abonos])
    useEffect(() => { save(STORAGE_KEYS.AUDIT_LOG, auditLog) }, [auditLog])

    // ─── Helpers ───────────────────────────────────────────────────────────────
    const logAction = useCallback((action, detail = '') => {
        const entry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            user: currentUser?.nombre || 'Sistema',
            role: currentUser?.role || 'desconocido',
            action,
            detail
        }
        setAuditLogState(prev => [entry, ...prev].slice(0, 200))
    }, [currentUser])

    // ─── AUTH ──────────────────────────────────────────────────────────────────
    const login = (email, password) => {
        const user = USUARIOS.find(u => u.email === email && u.password === password)
        if (!user) return null
        const safeUser = { id: user.id, nombre: user.nombre, email: user.email, role: user.role }
        setCurrentUser(safeUser)
        return safeUser
    }

    const logout = () => {
        setCurrentUser(null)
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    }

    // ─── MAESTROS CRUD ─────────────────────────────────────────────────────────
    const addMaestro = (seccion, nombre) => {
        const nuevo = { id: Date.now(), nombre, is_deleted: false }
        setMaestrosState(prev => ({
            ...prev,
            [seccion]: [...prev[seccion], nuevo]
        }))
        logAction(`Agregó ${seccion}`, nombre)
        return nuevo
    }

    const deleteMaestro = (seccion, id) => {
        setMaestrosState(prev => ({
            ...prev,
            [seccion]: prev[seccion].map(item =>
                item.id === id ? { ...item, is_deleted: true } : item
            )
        }))
        const item = maestros[seccion]?.find(i => i.id === id)
        logAction(`Eliminó ${seccion}`, item?.nombre || id)
    }

    // ─── CAMIONES CRUD ─────────────────────────────────────────────────────────
    const addCamion = (data) => {
        const nuevo = { id: Date.now(), is_deleted: false, ...data }
        setCamionesState(prev => [...prev, nuevo])
        logAction('Agregó camión', `${data.patente} - ${data.modelo}`)
        return nuevo
    }

    const updateCamion = (id, data) => {
        setCamionesState(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
        logAction('Actualizó camión', `ID ${id}`)
    }

    const deleteCamion = (id) => {
        const c = camiones.find(x => x.id === id)
        setCamionesState(prev => prev.map(x => x.id === id ? { ...x, is_deleted: true } : x))
        logAction('Eliminó camión', c?.patente || id)
    }

    // ─── TARIFAS CRUD ──────────────────────────────────────────────────────────
    const upsertTarifa = (camionId, tipoOperacionId, monto) => {
        setTarifasState(prev => {
            const idx = prev.findIndex(t => t.camionId === camionId && t.tipoOperacionId === tipoOperacionId && !t.is_deleted)
            if (idx >= 0) {
                const updated = [...prev]
                updated[idx] = { ...updated[idx], monto }
                return updated
            }
            return [...prev, { id: Date.now(), camionId, tipoOperacionId, monto, is_deleted: false }]
        })
        logAction('Actualizó tarifa', `Camión ${camionId} / Op ${tipoOperacionId}: $${monto?.toLocaleString('es-CL')}`)
    }

    const deleteTarifa = (id) => {
        setTarifasState(prev => prev.map(t => t.id === id ? { ...t, is_deleted: true } : t))
        logAction('Eliminó tarifa', `ID ${id}`)
    }

    const getTarifaValor = (camionId, tipoOperacionId) => {
        const tarifa = tarifas.find(
            t => t.camionId === camionId && t.tipoOperacionId === tipoOperacionId && !t.is_deleted
        )
        return tarifa?.monto ?? null
    }

    // ─── EMPLEADOS ─────────────────────────────────────────────────────────────
    const addEmpleado = (data) => {
        const nuevo = { id: Date.now(), is_deleted: false, ...data }
        setEmpleadosState(prev => [...prev, nuevo])
        logAction('Agregó chofer', data.nombre)
        return nuevo
    }

    const updateEmpleado = (id, data) => {
        setEmpleadosState(prev => prev.map(e => e.id === id ? { ...e, ...data } : e))
        logAction('Actualizó chofer', `ID ${id}`)
    }

    const deleteEmpleado = (id) => {
        const e = empleados.find(x => x.id === id)
        setEmpleadosState(prev => prev.map(x => x.id === id ? { ...x, is_deleted: true } : x))
        logAction('Eliminó chofer', e?.nombre || id)
    }

    // ─── FLETES ────────────────────────────────────────────────────────────────
    const addFlete = (data) => {
        const camion = camiones.find(c => c.id === data.camionId)
        const tarifa = getTarifaValor(data.camionId, data.tipoOperacionId)
        const montoBase = data.aplicarIva ? Math.round(data.montoCliente / 1.19) : data.montoCliente
        const utilidad = tarifa !== null ? montoBase - tarifa : null

        const nuevo = {
            id: Date.now(),
            fecha: data.fecha,
            camionId: data.camionId,
            patente: camion?.patente || 'N/A',
            folio: data.folio,
            montoCliente: data.montoCliente,
            tipoOperacionId: data.tipoOperacionId,
            aplicarIva: data.aplicarIva || false,
            montoBase,
            tarifaCamion: tarifa,
            utilidad,
            descripcion: data.descripcion || '',
            is_deleted: false,
            creadoPor: currentUser?.nombre || 'Sistema',
            creadoEn: new Date().toISOString()
        }
        setFletesState(prev => [nuevo, ...prev])
        logAction('Registró flete', `Folio ${data.folio} - Patente ${nuevo.patente}`)
        return nuevo
    }

    const deleteFlete = (id) => {
        const f = fletes.find(x => x.id === id)
        setFletesState(prev => prev.map(x => x.id === id ? { ...x, is_deleted: true } : x))
        logAction('Eliminó flete', `Folio ${f?.folio || id}`)
    }

    // ─── GASTOS ────────────────────────────────────────────────────────────────
    const addGasto = (data) => {
        const camion = camiones.find(c => c.id === data.camionId)
        const nuevo = {
            id: Date.now(),
            fecha: data.fecha,
            camionId: data.camionId,
            patente: camion?.patente || 'N/A',
            categoriaId: data.categoriaId,
            bancoId: data.bancoId,
            monto: data.monto,
            descripcion: data.descripcion || '',
            is_deleted: false,
            creadoPor: currentUser?.nombre || 'Sistema',
            creadoEn: new Date().toISOString()
        }
        setGastosState(prev => [nuevo, ...prev])
        logAction('Registró gasto', `${data.descripcion} - $${data.monto?.toLocaleString('es-CL')}`)
        return nuevo
    }

    const deleteGasto = (id) => {
        const g = gastos.find(x => x.id === id)
        setGastosState(prev => prev.map(x => x.id === id ? { ...x, is_deleted: true } : x))
        logAction('Eliminó gasto', g?.descripcion || id)
    }

    // ─── ABONOS ────────────────────────────────────────────────────────────────
    const addAbono = (data) => {
        const empleado = empleados.find(e => e.id === data.empleadoId)
        const nuevo = {
            id: Date.now(),
            empleadoId: data.empleadoId,
            nombreEmpleado: empleado?.nombre || 'N/A',
            monto: data.monto,
            fecha: data.fecha,
            descripcion: data.descripcion || '',
            mes: data.mes, // 'YYYY-MM'
            is_deleted: false,
            creadoPor: currentUser?.nombre || 'Sistema',
            creadoEn: new Date().toISOString()
        }
        setAbonosState(prev => [nuevo, ...prev])
        logAction('Registró abono', `${empleado?.nombre} - $${data.monto?.toLocaleString('es-CL')}`)
        return nuevo
    }

    const deleteAbono = (id) => {
        const a = abonos.find(x => x.id === id)
        setAbonosState(prev => prev.map(x => x.id === id ? { ...x, is_deleted: true } : x))
        logAction('Eliminó abono', `ID ${id} - ${a?.nombreEmpleado || ''}`)
    }

    // ─── KPIs CALCULADOS ───────────────────────────────────────────────────────
    const getMesActual = () => {
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    }

    const getKPIs = () => {
        const mesActual = getMesActual()
        const fletesActivos = fletes.filter(f => !f.is_deleted)
        const gastosActivos = gastos.filter(g => !g.is_deleted)

        const ingresosMes = fletesActivos
            .filter(f => f.fecha?.startsWith(mesActual))
            .reduce((sum, f) => sum + (f.montoCliente || 0), 0)

        const egresosMes = gastosActivos
            .filter(g => g.fecha?.startsWith(mesActual))
            .reduce((sum, g) => sum + (g.monto || 0), 0)

        const saldoCaja = fletesActivos.reduce((sum, f) => sum + (f.montoCliente || 0), 0)
            - gastosActivos.reduce((sum, g) => sum + (g.monto || 0), 0)

        return { ingresosMes, egresosMes, saldoCaja }
    }

    // ─── LIQUIDACIÓN ───────────────────────────────────────────────────────────
    const getLiquidacionEmpleado = (empleadoId, mes) => {
        // Suma de fletes donde el empleado es el responsable (por camión asignado)
        // En esta versión: los fletes no tienen chofer directo, 
        // pero los abonos sí están ligados al empleado
        const abonosMes = abonos
            .filter(a => a.empleadoId === empleadoId && a.mes === mes && !a.is_deleted)
            .reduce((sum, a) => sum + a.monto, 0)

        return { totalAbonos: abonosMes }
    }

    const value = {
        // Auth
        currentUser,
        login,
        logout,
        isAdmin: currentUser?.role === 'admin',
        isOperador: currentUser?.role === 'operador',

        // Maestros
        maestros,
        addMaestro,
        deleteMaestro,

        // Camiones / Flota
        camiones,
        addCamion,
        updateCamion,
        deleteCamion,

        // Tarifas
        tarifas,
        upsertTarifa,
        deleteTarifa,
        getTarifaValor,

        // Empleados
        empleados,
        addEmpleado,
        updateEmpleado,
        deleteEmpleado,

        // Fletes
        fletes,
        addFlete,
        deleteFlete,

        // Gastos
        gastos,
        addGasto,
        deleteGasto,

        // Abonos
        abonos,
        addAbono,
        deleteAbono,
        getLiquidacionEmpleado,

        // Auditoría
        auditLog,
        logAction,

        // KPIs
        getKPIs,
        getMesActual,
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}
