// Mock data con empresas chilenas reales
export const trucks = [
    { id: 1, model: 'Volvo FH', plate: 'GBRT45', status: 'En Ruta', driver: 'Carlos Muñoz', route: 'Santiago - Concepción', profit: 12500000 },
    { id: 2, model: 'Scania R500', plate: 'ZXTY99', status: 'En Ruta', driver: 'Pedro Silva', route: 'Valparaíso - La Serena', profit: 9200000 },
    { id: 3, model: 'Mercedes Actros', plate: 'HJKL22', status: 'Taller', driver: '-', route: '-', profit: 4100000 },
    { id: 4, model: 'Volvo FH16', plate: 'MNOP88', status: 'En Espera', driver: 'Juan González', route: '-', profit: 8750000 },
    { id: 5, model: 'Scania R730', plate: 'QRST44', status: 'En Ruta', driver: 'Luis Rojas', route: 'Santiago - Temuco', profit: 11300000 },
    { id: 6, model: 'Mercedes Arocs', plate: 'UVWX66', status: 'En Espera', driver: 'Diego Contreras', route: '-', profit: 6400000 },
    { id: 7, model: 'Volvo FMX', plate: 'ABCD11', status: 'En Ruta', driver: 'Rodrigo Soto', route: 'Rancagua - Talca', profit: 7800000 },
    { id: 8, model: 'Scania P320', plate: 'EFGH33', status: 'En Espera', driver: 'Mario Vega', route: '-', profit: 5900000 },
]

export const initialTransactions = [
    { id: 1, date: 'Hoy, 10:30', description: 'Flete Falabella (Línea Blanca)', truck: 'Volvo FH', type: 'income', amount: 1250000, status: 'completed' },
    { id: 2, date: 'Ayer, 18:15', description: 'Carga Combustible Copec (Full)', truck: 'Scania R500', type: 'expense', amount: 450000, status: 'completed' },
    { id: 3, date: 'Ayer, 14:20', description: 'Peaje Angostura', truck: 'Scania R500', type: 'expense', amount: 18400, status: 'completed' },
    { id: 4, date: '20/12, 09:45', description: 'Flete Sodimac (Materiales Construcción)', truck: 'Volvo FH', type: 'income', amount: 980000, status: 'completed' },
    { id: 5, date: '20/12, 16:30', description: 'Multa TAG - Túnel Lo Prado', truck: 'Mercedes Actros', type: 'expense', amount: 35000, status: 'pending' },
    { id: 6, date: '19/12, 11:00', description: 'Mantención Preventiva - Cambio Aceite', truck: 'Mercedes Actros', type: 'expense', amount: 158900, status: 'completed' },
    { id: 7, date: '19/12, 08:20', description: 'Flete Ruta del Maipo (Vinos)', truck: 'Scania R730', type: 'income', amount: 1450000, status: 'completed' },
    { id: 8, date: '18/12, 15:45', description: 'Peajes Ruta 5 Norte', truck: 'Volvo FH16', type: 'expense', amount: 22100, status: 'completed' },
]

export const monthlyData = [
    { month: 'Ene', income: 12000000, expense: 5000000 },
    { month: 'Feb', income: 19000000, expense: 7000000 },
    { month: 'Mar', income: 15000000, expense: 6000000 },
    { month: 'Abr', income: 17000000, expense: 6500000 },
    { month: 'May', income: 14000000, expense: 5800000 },
    { month: 'Jun', income: 18450000, expense: 6840200 },
]

export const expenseBreakdown = [
    { category: 'Combustible', amount: 4104120, percentage: 60 },
    { category: 'Mantención', amount: 1368040, percentage: 20 },
    { category: 'Peajes', amount: 684020, percentage: 10 },
    { category: 'Multas', amount: 410412, percentage: 6 },
    { category: 'Otros', amount: 273608, percentage: 4 },
]

export const pricingPlans = [
    {
        id: 'basic',
        name: 'Licencia Start-Up',
        subtitle: 'Gestión Manual',
        price: 550000,
        priceLabel: 'Pago Único',
        features: [
            { text: 'Registro de Gastos ilimitados', included: true },
            { text: 'Base de datos local segura', included: true },
            { text: 'Sin Dashboard en vivo', included: false },
            { text: 'Sin conexión a Contadora', included: false },
        ],
        cta: 'Seleccionar Básica',
        highlighted: false,
    },
    {
        id: 'pro',
        name: 'Licencia Pyme Pro',
        subtitle: 'Suite Integral',
        price: 1250000,
        priceLabel: 'Pago Único + 1 año soporte',
        badge: 'ESTÁNDAR INDUSTRIAL',
        features: [
            { text: 'Dashboard Gerencial Animado', included: true, bold: true },
            { text: 'Módulo "Espejo" para Contador', included: true, bold: true },
            { text: 'Control de Carga y Encomiendas', included: true },
            { text: 'Alertas de Multas Automatizadas', included: true },
        ],
        cta: 'Adquirir Sistema Completo',
        highlighted: true,
    },
    {
        id: 'enterprise',
        name: 'Licencia Enterprise AI',
        subtitle: 'Automatización Total',
        price: 2100000,
        priceLabel: 'Pago Único',
        features: [
            { text: 'Lectura de Facturas con IA', included: true, icon: 'robot' },
            { text: 'Predicción de Gastos Futuros', included: true, icon: 'brain' },
            { text: 'Servidor Dedicado AWS Privado', included: true, icon: 'server' },
            { text: 'API Integración PowerBI', included: true, icon: 'key' },
        ],
        cta: 'Consultar Factibilidad Técnica',
        highlighted: false,
        dark: true,
    },
]
