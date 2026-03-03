// ========================================
// TABLAS MAESTRAS (Datos Configurables)
// ========================================

export const maestrosIniciales = {
    bancos: [
        { id: 1, nombre: 'Banco Estado', is_deleted: false },
        { id: 2, nombre: 'Santander', is_deleted: false },
        { id: 3, nombre: 'Banco de Chile', is_deleted: false },
        { id: 4, nombre: 'Caja Chica', is_deleted: false },
    ],
    tiposOperacion: [
        { id: 1, nombre: 'Sanday', is_deleted: false },
        { id: 2, nombre: 'Victicket', is_deleted: false },
        { id: 3, nombre: 'F3', is_deleted: false },
        { id: 4, nombre: 'Lof 1 Estancilla', is_deleted: false },
    ],
    categoriasGasto: [
        { id: 1, nombre: 'Combustible', is_deleted: false },
        { id: 2, nombre: 'Peajes', is_deleted: false },
        { id: 3, nombre: 'Mecánica', is_deleted: false },
        { id: 4, nombre: 'Repuestos', is_deleted: false },
        { id: 5, nombre: 'Sueldo Chofer', is_deleted: false },
        { id: 6, nombre: 'Multas', is_deleted: false },
    ]
}

// ========================================
// FLOTA DE CAMIONES
// ========================================

export const camionesIniciales = [
    {
        id: 1,
        patente: 'ABCD-12',
        modelo: 'Volvo FH',
        tipo: 'propio',       // 'propio' | 'subcontratado'
        proveedor: null,
        is_deleted: false
    },
    {
        id: 2,
        patente: 'WXYZ-98',
        modelo: 'Scania R500',
        tipo: 'propio',
        proveedor: null,
        is_deleted: false
    }
]

// ========================================
// TARIFAS: camión × tipo de operación
// ========================================
// tarifa = lo que el camión cobra por ese tipo de ruta (costo para calcular utilidad)

export const tarifasIniciales = [
    { id: 1, camionId: 1, tipoOperacionId: 1, monto: 150000, is_deleted: false }, // ABCD-12 / Sanday
    { id: 2, camionId: 1, tipoOperacionId: 2, monto: 180000, is_deleted: false }, // ABCD-12 / Victicket
    { id: 3, camionId: 2, tipoOperacionId: 1, monto: 140000, is_deleted: false }, // WXYZ-98 / Sanday
    { id: 4, camionId: 2, tipoOperacionId: 3, monto: 200000, is_deleted: false }, // WXYZ-98 / F3
]

// ========================================
// CHOFERES / EMPLEADOS
// ========================================

export const empleadosIniciales = [
    {
        id: 1,
        nombre: 'Pedro González',
        rut: '12.345.678-9',
        telefono: '+56 9 1234 5678',
        email: 'pedro.gonzalez@transportes.cl',
        cargo: 'Chofer',
        estado: 'disponible',
        tipoContrato: 'planta',        // 'planta' | 'externo'
        fechaIngreso: '2022-03-15',
        vencimientoLicencia: '2026-08-20',
        notas: 'Chofer de confianza para rutas largas. Excelente manejo en ruta sur.',
        is_deleted: false
    },
    {
        id: 2,
        nombre: 'Juan Pérez',
        rut: '13.456.789-0',
        telefono: '+56 9 8765 4321',
        email: 'juan.perez@transportes.cl',
        cargo: 'Chofer',
        estado: 'disponible',
        tipoContrato: 'externo',
        fechaIngreso: '2023-07-01',
        vencimientoLicencia: '2025-12-31',
        notas: '',
        is_deleted: false
    }
]

// ========================================
// FLETES (Ingresos de rutas)
// ========================================

export const fletesIniciales = []

// ========================================
// GASTOS
// ========================================

export const gastosIniciales = []

// ========================================
// ABONOS / ADELANTOS a choferes
// ========================================

export const abonosIniciales = []

// ========================================
// LOG DE AUDITORÍA
// ========================================

export const auditLogInicial = []

// ========================================
// USUARIOS DEL SISTEMA
// ========================================

export const USUARIOS = [
    {
        id: 1,
        nombre: 'Fito (Administrador)',
        email: 'admin@logisystem.cl',
        password: 'admin123',
        role: 'admin'
    },
    {
        id: 2,
        nombre: 'Operador',
        email: 'operador@logisystem.cl',
        password: 'op123',
        role: 'operador'
    }
]

// Datos mensuales para gráficos (futuro)
export const monthlyData = [
    { month: 'Jul', income: 45000000, expense: 28000000 },
    { month: 'Ago', income: 48000000, expense: 30000000 },
    { month: 'Sep', income: 52000000, expense: 32000000 },
    { month: 'Oct', income: 49000000, expense: 31000000 },
    { month: 'Nov', income: 55000000, expense: 33000000 },
    { month: 'Dic', income: 58000000, expense: 35000000 },
]
