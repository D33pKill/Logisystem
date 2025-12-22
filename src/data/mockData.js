// Datos de camiones - ahora editable desde la app
export const trucks = [
    { id: 1, model: 'Volvo FH', plate: 'ABCD-12', driver: 'Juan Pérez', route: 'Santiago-Concepción', status: 'En Ruta', profit: 12500000 },
    { id: 2, model: 'Scania R500', plate: 'WXYZ-98', driver: 'Pedro González', route: 'Valparaíso-La Serena', status: 'En Espera', profit: 11800000 },
    { id: 3, model: 'Mercedes Actros', plate: 'HJKL-34', driver: 'Carlos Muñoz', route: 'Santiago-Puerto Montt', status: 'En Ruta', profit: 10200000 },
    { id: 4, model: 'Volvo FH', plate: 'LMNO-56', driver: 'Diego Silva', route: 'Santiago-Iquique', status: 'Taller', profit: 9500000 },
]

// Transacciones iniciales con datos de ejemplo
export const initialTransactions = [
    {
        id: 1001,
        type: 'income',
        date: '2024-12-20',
        truck: 'ABCD-12',
        amount: 2450000,
        description: 'Flete Falabella - Carga general',
        tags: 'Carga Nocturna, Rural',
        photos: [
            'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400',
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
            'https://images.unsplash.com/photo-1619468129361-605ebea04b44?w=400'
        ],
        hasComplaint: true,
        complaintDetails: {
            folio: '9921',
            description: 'Caja mojada en tránsito, merma de 2 unidades'
        }
    },
    {
        id: 1002,
        type: 'expense',
        date: '2024-12-19',
        truck: 'WXYZ-98',
        amount: 850000,
        description: 'Multa TAG - Exceso de peso',
        category: 'Multas',
        tags: ''
    },
    {
        id: 1003,
        type: 'expense',
        date: '2024-12-18',
        truck: 'ABCD-12',
        amount: 380000,
        description: 'Combustible Copec Ruta 5 Sur',
        category: 'Combustible',
        tags: 'Urbano',
        fuelDetails: {
            liters: 285,
            mileage: 142850
        }
    },
    {
        id: 1004,
        type: 'income',
        date: '2024-12-17',
        truck: 'HJKL-34',
        amount: 3200000,
        description: 'Flete Sodimac - Materiales construcción',
        tags: 'IKEA, Flete',
        hasComplaint: false
    },
    {
        id: 1005,
        type: 'expense',
        date: '2024-12-16',
        truck: 'HJKL-34',
        amount: 125000,
        description: 'Peajes Ruta del Maipo',
        category: 'Peajes',
        tags: ''
    },
    {
        id: 1006,
        type: 'expense',
        date: '2024-12-15',
        truck: 'WXYZ-98',
        amount: 1500000,
        description: 'Sueldo diciembre - Pedro González',
        category: 'Sueldo Conductor',
        tags: ''
    },
    {
        id: 1007,
        type: 'income',
        date: '2024-12-14',
        truck: 'ABCD-12',
        amount: 1950000,
        description: 'Flete Copec - Combustibles',
        tags: 'Cyber, Segunda Vuelta PM',
        hasComplaint: false
    },
    {
        id: 1008,
        type: 'expense',
        date: '2024-12-13',
        truck: 'ABCD-12',
        amount: 450000,
        description: 'Mantención preventiva - Cambio aceite y filtros',
        category: 'Mantención',
        tags: ''
    },
    {
        id: 1009,
        type: 'expense',
        date: '2024-12-12',
        truck: 'HJKL-34',
        amount: 2100000,
        description: 'Indemnización accidente menor',
        category: 'Indemnizaciones',
        tags: ''
    },
    {
        id: 1010,
        type: 'income',
        date: '2024-12-11',
        truck: 'WXYZ-98',
        amount: 2800000,
        description: 'Flete Walmart - Retail',
        tags: 'Retiros AM',
        hasComplaint: true,
        complaintDetails: {
            folio: '9856',
            description: 'Retraso de 3 horas por tráfico, descuento aplicado'
        }
    }
]

// Datos mensuales para gráficos (si se necesitan en el futuro)
export const monthlyData = [
    { month: 'Jul', income: 45000000, expense: 28000000 },
    { month: 'Ago', income: 48000000, expense: 30000000 },
    { month: 'Sep', income: 52000000, expense: 32000000 },
    { month: 'Oct', income: 49000000, expense: 31000000 },
    { month: 'Nov', income: 55000000, expense: 33000000 },
    { month: 'Dic', income: 58000000, expense: 35000000 },
]
