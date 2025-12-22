# 🚚 LogiSystem Enterprise - Sistema de Gestión Logística

> Demo de ventas profesional desarrollado con React + Vite + Tailwind CSS

[![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Una aplicación de demostración para venta de software de gestión logística con 3 experiencias visuales diferenciadas por plan.**

---

## 🎯 Propósito

Esta aplicación es un **demo de ventas de alto impacto** diseñado para mostrar las capacidades de un sistema de gestión logística. Incluye tres modos demo que permiten contrastar visualmente los diferentes planes de licencia:

- **📄 Modo Básico**: Interfaz simple estilo Excel sin animaciones
- **⚡ Modo Estándar**: Diseño profesional con funcionalidades core
- **✨ Modo PRO IA**: Experiencia premium completa con IA y exportaciones

## ✨ Características Principales

### Vistas Implementadas

1. **📊 Dashboard Gerencial**
   - KPIs con conteo animado (Facturación, Gastos, Utilidad Neta, Estado de Flota)
   - Gráfico de flujo financiero con Recharts
   - Top 3 camiones rentables
   - Tabla de transacciones recientes

2. **🚛 Gestión de Flota**
   - Visualización de estado de vehículos (En Ruta, En Espera, Taller)
   - Cards individuales con información del conductor y ruta
   - Indicadores de rentabilidad por unidad

3. **💰 Centro Financiero**
   - Resumen Debe/Haber
   - Libro Mayor completo con saldo corriente
   - **Exportación a Excel** (exclusivo PRO)
   - **Generación de PDF** (exclusivo PRO)

4. **🤖 IA Auditoría** *(Exclusivo Plan PRO)*
   - OCR simulado de facturas
   - Extracción automática de datos (Fecha, Monto, RUT, Categoría)
   - Validación contra SII
   - Sugerencia de cuenta contable
   - Confianza de IA al 98%

5. **💎 Planes y Precios**
   - 3 niveles: Start-Up, Pyme Pro, Enterprise AI
   - Comparación visual de características
   - Precios en CLP

### Funcionalidades Interactivas

- ✅ **Modal de Nuevo Movimiento**: Agrega transacciones con actualización en tiempo real
- ✅ **Toast Notifications**: Feedback visual inmediato
- ✅ **Selector de Modo Demo**: Cambia entre los 3 planes en el header
- ✅ **Exportaciones Funcionales**: Excel (CSV) y PDF con datos reales
- ✅ **Animaciones Fluidas**: Framer Motion para efectos profesionales
- ✅ **Datos Chilenos**: Empresas reales (Copec, Falabella, Sodimac), rutas, patentes

## 🚀 Instalación y Uso

### Requisitos Previos

- Node.js 16+ 
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/D33pKill/Logisystem.git
cd Logisystem

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
```

## 🎨 Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.2.0 | Framework UI |
| Vite | 5.0.8 | Build tool ultra-rápido |
| Tailwind CSS | 3.4.0 | Estilos utility-first |
| Framer Motion | 10.16.16 | Animaciones fluidas |
| Recharts | 2.10.3 | Gráficos interactivos |
| Lucide React | 0.294.0 | Iconografía moderna |

## 📂 Estructura del Proyecto

```
transporte2/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Header.jsx       # Cabecera con selector de modo
│   │   ├── KPICard.jsx      # Tarjetas KPI animadas
│   │   ├── Sidebar.jsx      # Navegación lateral
│   │   ├── Toast.jsx        # Notificaciones
│   │   └── TransactionModal.jsx  # Modal de transacciones
│   │
│   ├── views/              # Vistas principales
│   │   ├── DashboardView.jsx     # Dashboard con KPIs
│   │   ├── FleetView.jsx         # Gestión de flota
│   │   ├── FinancesView.jsx      # Centro financiero
│   │   ├── AIAuditView.jsx       # IA de auditoría
│   │   └── PricingView.jsx       # Planes y precios
│   │
│   ├── data/
│   │   └── mockData.js      # Datos de demostración
│   │
│   ├── hooks/
│   │   └── useCountUp.js    # Hook para conteo animado
│   │
│   ├── utils/
│   │   └── helpers.js       # Funciones auxiliares + exportaciones
│   │
│   ├── App.jsx              # Componente principal
│   ├── main.jsx             # Punto de entrada
│   └── index.css            # Estilos globales
│
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎯 Guía de Uso para Demos de Venta

### Estrategia de Presentación

1. **Inicio - Modo Básico** (30 seg)
   > "Así trabajan hoy sin nuestro sistema..."
   - Muestra la interfaz aburrida tipo Excel
   - Destaca la falta de visualización

2. **Transición - Modo Estándar** (45 seg)
   > "Con el plan estándar obtienen esto..."
   - Dashboard profesional
   - Gráficos funcionales
   - Navegación fluida

3. **Cierre - Modo PRO IA** (2 min)
   > "Pero con PRO IA tienen magia total..."
   - Demostrar exportación a Excel/PDF
   - Simular procesamiento de factura con IA
   - Mostrar resultados con 98% confianza
   - Destacar ahorro de 42 horas/mes

### Puntos de Venta Clave

- **ROI Comprobado**: 42 horas/mes ahorradas vs entrada manual
- **Precisión IA**: 99% validado por usuarios reales
- **Integración SII**: Validación automática de facturas
- **Datos Locales**: Diseñado específicamente para empresas chilenas

## 🔐 Contexto Empresarial Chileno

El sistema utiliza datos reales del mercado chileno:

- **Empresas**: Copec, Falabella, Sodimac, Ruta del Maipo
- **Rutas**: Santiago-Concepción, Valparaíso-La Serena
- **Camiones**: Volvo FH, Scania R500, Mercedes Actros
- **Monedas**: Pesos Chilenos (CLP) con formato local

## 🎨 Personalización

### Cambiar Colores del Tema

Edita `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#2563eb',  // Azul principal
      secondary: '#10b981', // Verde secundario
    }
  }
}
```

### Modificar Datos de Demo

Edita `src/data/mockData.js` para personalizar:
- Transacciones
- Información de camiones
- Datos financieros mensuales
- Planes de precios

## 📊 Funcionalidades de Exportación

### Excel (CSV)

```javascript
import { exportToExcel } from './utils/helpers'

exportToExcel(data, 'nombre_archivo')
```

### PDF (Print-based)

```javascript
import { exportToPDF, generateFinancialReport } from './utils/helpers'

const content = generateFinancialReport(totals, transactions)
exportToPDF(content, 'reporte_financiero')
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👤 Autor

**Tomás**

- GitHub: [@D33pKill](https://github.com/D33pKill)

## 🙏 Agradecimientos

- Diseño inspirado en las mejores prácticas de SaaS moderno
- Datos de ejemplo basados en empresas reales chilenas
- Comunidad de React y Tailwind CSS

---

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!**

## 📧 Contacto

Para consultas sobre implementación o licenciamiento:
- Email: ventas@logisystem.cl
- Teléfono: +56 9 1234 5678

---

*Desarrollado con ❤️ para demostrar el poder de React + Vite + Tailwind CSS*
