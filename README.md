# 🚚 LogiSystem - Gestión Logística Mobile-First

> Aplicación web responsive para gestión de movimientos logísticos en terreno

[![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

**Aplicación diseñada específicamente para uso en terreno desde dispositivos móviles, con interfaz táctil optimizada.**

---

## 🎯 Diseño Mobile-First

Esta aplicación está diseñada **priorizando el uso móvil** para conductores y personal en terreno:

- 📱 **Optimizada para móviles**: Interfaz táctil con botones grandes (mín. 44px)
- 💻 **Responsive Desktop**: Se adapta automáticamente a pantallas grandes
- 🎨 **Bottom Navigation**: Navegación inferior estilo app nativa en móvil
- 📊 **Vistas Adaptativas**: Cards en móvil, tablas en desktop

## ✨ Características Principales

### 📝 Registrar Movimientos

**Formulario Inteligente** con campos condicionales:

- **Toggle Ingreso/Gasto**: Botones grandes diferenciados por color
- **Si es INGRESO**:
  - Campos: Fecha, Camión, Monto, Descripción
  - ✅ Switch "¿Hubo Reclamo/Merma?"
  - Si activado → inputs para folio y detalle + botón adjuntar foto

- **Si es GASTO**:
  - Categorías: Combustible, Peajes, Sueldo, Mantención, Multas, Indemnizaciones, Otros
  - Si es Combustible → campos extra: Litros y Kilometraje
  - Botón adjuntar foto de boleta/vale

### 📊 Ver Movimientos

**Vista Adaptativa** según dispositivo:

**Móvil (< 768px)**:
- Cards verticales con información resumida
- Monto destacado
- Badge de alerta si tiene reclamo
- Touch-friendly

**Desktop (≥ 768px)**:
- Tabla detallada con todas las columnas
- Filas con fondo rojo si hay reclamo
- Más información visible

**Funcionalidades**:
- 🔍 Búsqueda por folio, descripción o patente
- 📈 Resumen financiero (Ingresos - Gastos = Saldo)
- 📥 Exportación a Excel (CSV)

## 🚀 Instalación y Uso

```bash
# Clonar repositorio
git clone https://github.com/D33pKill/Logisystem.git
cd Logisystem

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

La aplicación estará en `http://localhost:3000`

## 📱 Navegación

### Mobile

Bottom Navigation fija con 2 pestañas:
- **📝 Registrar**: Formulario de nuevo movimiento
- **📋 Movimientos**: Historial y búsqueda

### Desktop

Sidebar lateral izquierda con las mismas opciones.

## 📂 Estructura del Proyecto

```
src/
├── components/
│   ├── BottomNav.jsx           # Navegación inferior móvil
│   ├── MobileHeader.jsx         # Cabecera simple
│   ├── DesktopSidebar.jsx       # Sidebar para desktop
│   ├── Toast.jsx                # Notificaciones
│   └── KPICard.jsx              # (Reutilizable)
│
├── views/
│   ├── RegistrarView.jsx        # Formulario inteligente
│   └── MovimientosView.jsx      # Historial adaptativo
│
├── data/
│   └── mockData.js              # Datos de ejemplo
│
├── hooks/
│   └── useCountUp.js            # Hook de animación
│
├── utils/
│   └── helpers.js               # Funciones auxiliares
│
├── App.jsx                      # Componente principal
├── main.jsx                     # Punto de entrada
└── index.css                    # Estilos globales
```

## 🎨 Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| React 18 | Framework UI |
| Vite 5 | Build tool ultra-rápido |
| Tailwind CSS | Estilos utility-first |
| Framer Motion | Animaciones suaves |
| Lucide React | Iconografía moderna |

## 💡 Características de Diseño

### Touch-Friendly

- ✅ Todos los botones ≥ 44px de altura
- ✅ Inputs grandes (h-12 mínimo)
- ✅ Espaciado generoso (padding 4-6)
- ✅ Texto legible (≥ 16px base)

### Responsive Breakpoints

```css
mobile:  < 768px   (sm/default)
desktop: ≥ 768px   (md)
```

### Colores

- **Primario**: Blue-600 (Acciones)
- **Éxito**: Emerald-600 (Ingresos)
- **Peligro**: Red-600 (Gastos/Reclamos)
- **Neutro**: Slate-900/600 (Textos)

## 📊 Datos de Ejemplo

La aplicación incluye 10 transacciones de ejemplo con:

- ✅ Ingreso con reclamo (Falabella - Caja mojada)
- ✅ Multa TAG de alto monto
- ✅ Combustible con litros y kilometraje
- ✅ Varios otros casos realistas

## 🔐 Contexto Chileno

- **Empresas**: Falabella, Sodimac, Copec, Walmart
- **Rutas**: Santiago-Concepción, Valparaíso-La Serena
- **Camiones**: Volvo FH, Scania R500, Mercedes Actros
- **Moneda**: Pesos Chilenos (CLP)

## 📱 Testing Móvil

Para probar en dispositivo real:

```bash
# Obtener IP local
ipconfig  # Windows
ifconfig  # macOS/Linux

# Acceder desde móvil
http://TU_IP_LOCAL:3000
```

Ejemplo: `http://192.168.1.100:3000`

## 🤝 Contribución

Pull requests son bienvenidos. Para cambios mayores, abre un issue primero.

## 📄 Licencia

MIT © 2024 LogiSystem

## 👤 Autor

**Tomás**
- GitHub: [@D33pKill](https://github.com/D33pKill)

---

**⭐ Si este proyecto te fue útil, considera darle una estrella!**

## 📧 Contacto

Para consultas o soporte:
- Email: contacto@logisystem.cl
- Teléfono: +56 9 1234 5678

---

*Desarrollado con ❤️ para conductores en terreno*
