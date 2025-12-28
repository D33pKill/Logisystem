# REPORTE TÉCNICO EJECUTIVO - LOGISYSTEM
## Análisis de Arquitectura y Funcionalidades para Guía de Usuario

**Fecha:** Diciembre 2024  
**Versión:** 1.0  
**Objetivo:** Documentación técnica completa del sistema LogiSystem para la creación de guía de usuario final

---

## 1. ARQUITECTURA DE DATOS (ESTADO GLOBAL)

### 1.1. Contexto Global: `AppContext.jsx`

El sistema utiliza React Context API (`AppContext`) como estado global centralizado, con persistencia automática en `localStorage` del navegador. Todos los datos se guardan automáticamente cuando cambian y se cargan al iniciar la aplicación.

**Claves de almacenamiento en localStorage:**
- `logisystem_transactions`: Transacciones financieras
- `logisystem_trucks`: Flota de camiones
- `logisystem_employees`: Personal/empleados
- `logisystem_accounts`: Cuentas bancarias
- `logisystem_config`: Configuraciones (no implementado actualmente)

**Mecanismo de persistencia:**
- Cada estado tiene un `useEffect` que detecta cambios y guarda automáticamente en localStorage
- Carga inicial: Si existe data en localStorage, se carga. Si no, se usan datos iniciales del archivo `mockData.js`
- Manejo de errores: Funciones `loadFromStorage` y `saveToStorage` con try-catch para prevenir fallos

### 1.2. Estructura de Datos: Transacciones

**Objeto Transaction (Campos Base):**
```javascript
{
    id: Number,                    // ID único generado con Date.now()
    type: String,                  // 'income' | 'expense'
    date: String,                  // Formato ISO: 'YYYY-MM-DD'
    truck: String,                 // Patente del camión (ej: 'ABCD-12')
    amount: Number,                // Monto en pesos chilenos (CLP)
    description: String,           // Descripción del movimiento
    routeId: String,               // ID de ruta/folio (solo para ingresos)
    tags: String,                  // Etiquetas separadas por comas (ej: 'Carga Nocturna, Rural')
    photos: Array[String],         // Array de URLs (blob URLs) de fotos
    evidence: Object,              // Objeto con estructura { routePhotos: [], incidentPhotos: [] }
    accountId: Number,             // ID de la cuenta bancaria
    accountName: String,           // Nombre de la cuenta (ej: 'Banco Estado')
    category: String | null        // Solo para gastos: 'Combustible', 'Peajes', 'Sueldo', etc.
}
```

**Campos Condicionales por Tipo de Transacción:**

**Para Ingresos (type: 'income'):**
- `hasComplaint: Boolean` - Indica si tiene incidencia asociada
- `complaintDetails: Object` - Detalles de la incidencia (solo si hasComplaint === true):
  ```javascript
  {
      folio: String,              // Número de folio (actualmente 'N/A')
      description: String,        // Descripción detallada de la incidencia
      incidence_type: String,     // 'Merma' | 'Rechazo' | 'Daño' | 'Otro'
      item_count: Number | null,  // Cantidad de bultos afectados
      responsible: String,        // Nombre del responsable
      document_url: String | null // URL del documento adjunto (Excel/PDF)
  }
  ```

**Para Gastos (type: 'expense'):**
- Si `category === 'Combustible'`:
  ```javascript
  fuelDetails: {
      liters: Number,    // Litros de combustible
      mileage: Number    // Kilometraje
  }
  ```

- Si `category === 'Sueldo' || category === 'Anticipo'`:
  ```javascript
  employeeDetails: {
      employeeId: Number,        // ID del empleado
      employeeName: String,      // Nombre del empleado
      mesPago: String,           // Formato 'YYYY-MM'
      liquidacionUrl: String | null // URL del PDF/foto de liquidación
  }
  ```

- Si `category === 'pago_proveedor'`:
  ```javascript
  providerDetails: {
      providerName: String,      // Nombre del proveedor
      externalPlate: String      // Patente del camión externo
  }
  ```

### 1.3. Estructura de Datos: Camiones (Trucks)

**Objeto Truck:**
```javascript
{
    id: Number,                    // ID único
    plate: String,                 // Patente en formato chileno (ej: 'ABCD-12')
    model: String,                 // Marca/Modelo (ej: 'Volvo FH')
    is_own: Boolean,               // true = Propio, false = Subcontratado
    provider_name: String | null,  // Nombre del proveedor (solo si is_own === false)
    photo_url: String | null,      // URL de foto del camión (blob URL)
    contract_url: String | null,   // URL del contrato PDF/foto (solo si is_own === false)
    truck_photo_url: String | null // Alias legacy para photo_url
}
```

**Campos Legacy (compatibilidad):**
- `driver: String`
- `route: String`
- `status: String`
- `profit: Number`

### 1.4. Estructura de Datos: Empleados (Employees)

**Objeto Employee:**
```javascript
{
    id: Number,                    // ID único
    nombre: String,                // Nombre completo
    rut: String,                   // RUT en formato chileno (ej: '12.345.678-9')
    fechaNacimiento: String,       // Formato ISO: 'YYYY-MM-DD'
    cargo: String,                 // Cargo (ej: 'Chofer', 'Administrador')
    contratoUrl: String | null     // URL del contrato PDF/foto (blob URL)
}
```

### 1.5. Estructura de Datos: Cuentas Bancarias (Accounts)

**Objeto Account:**
```javascript
{
    id: Number,                    // ID único
    name: String,                  // Nombre de la cuenta (ej: 'Banco Estado')
    type: String,                  // 'banco' | 'efectivo'
    is_active: Boolean             // Indica si la cuenta está activa
}
```

**Cuentas iniciales predefinidas:**
1. Banco Estado (banco)
2. Caja Chica (efectivo)
3. Santander (banco)

### 1.6. Relaciones entre Datos

**Vinculación de Incidencias a Transacciones:**
- Las incidencias NO son entidades independientes
- Se almacenan como una propiedad anidada dentro de la transacción de ingreso
- Relación 1:1: Una transacción de ingreso puede tener máximo una incidencia
- Campo clave: `transaction.hasComplaint === true` y `transaction.complaintDetails` contiene los datos

**Relación Transacciones ↔ Cuentas:**
- Campo `accountId` en cada transacción vincula a la cuenta bancaria
- Campo `accountName` se calcula automáticamente buscando en el array de accounts
- Para ingresos: `accountId` = cuenta de destino (donde entra el dinero)
- Para gastos: `accountId` = cuenta de origen (de donde sale el dinero)

**Relación Transacciones ↔ Camiones:**
- Campo `truck` contiene la patente (String)
- Para gastos con categoría "Pago Proveedor": `truck` contiene la patente del camión externo (no de la flota propia)
- Filtrado: En formularios de ingreso y gastos internos, solo se muestran camiones con `is_own === true`

---

## 2. FLUJOS DE USUARIO (USER JOURNEYS)

### 2.1. Flujo: Registro de Ingreso con Incidencia

**Paso 1: Selección de Tipo**
- Usuario hace clic en botón "INGRESO" en `RegistrarView`
- `transactionType` se establece a `'income'`
- Se muestra el formulario de ingreso

**Paso 2: Datos Principales (Sección Obligatoria)**
- **Fecha:** Input tipo `date`, valor por defecto = fecha actual
- **Patente:** Select que muestra solo camiones propios (`is_own !== false`)
- **N° de Ruta / Folio:** Input `number`, campo obligatorio (`required`)
- **Monto Total:** Input `number`, formato moneda
- **Cuenta de Destino:** Select obligatorio que muestra cuentas activas (`is_active === true`)

**Paso 3: Evidencia de Ruta (Opcional pero recomendado)**
- Grid de 4 slots para fotos
- Usuario puede subir hasta 4 fotos usando el input `file` con `accept="image/*"` y `capture="environment"`
- Cada foto se convierte en blob URL usando `URL.createObjectURL(file)`
- Se almacenan en estado local `routePhotos` como array de objetos `{ id, file, url }`
- **Etiquetas del Viaje:** Sistema de tags seleccionables múltiples
  - Tags predefinidos: 'Carga Nocturna', 'Rural', 'Urbano', 'Cyber', 'IKEA', 'Segunda Vuelta PM', 'Retiros AM', 'Flete'
  - Tags personalizados: Se pueden agregar dinámicamente desde el formulario
  - Se almacenan como String separado por comas: `tags: 'Tag1, Tag2, Tag3'`

**Paso 4: Activación de Incidencia**
- Usuario activa el switch "¿Hubo Incidencia / Merma?"
- Estado `hasComplaint` cambia a `true`
- Aparece sección de incidencia con animación `AnimatePresence` (Framer Motion)

**Paso 5: Detalle de Incidencia (Si está activado)**
- **Tipo de Incidencia:** Select obligatorio con opciones:
  - 'Merma'
  - 'Rechazo'
  - 'Daño'
  - 'Otro'
- **Cantidad de Bultos Afectados:** Input `number`, opcional
- **Responsable:** Input texto, nombre de quien recibe/rechaza
- **Comentario / Descripción:** Textarea, descripción detallada
- **Fotos de Evidencia:** Grid de 4 slots para fotos de la incidencia
  - Se almacenan en `incidentPhotos` (separado de `routePhotos`)
- **Adjuntar Excel / Informe de Rechazo:** Input `file` con `accept=".xlsx,.xls,.pdf"`
  - Se almacena el archivo File object en `formData.document_url`
  - Al guardar, se convierte a blob URL

**Paso 6: Validaciones y Guardado**
Validaciones ejecutadas:
1. Monto debe ser > 0
2. RouteId es obligatorio para ingresos
3. AccountId es obligatorio
4. Si `hasComplaint === true`: `incidence_type` es obligatorio

Al hacer clic en "Guardar":
- Se construye objeto `transaction` con todos los campos
- Si hay incidencia: Se agregan `hasComplaint: true` y `complaintDetails` con spread operator condicional
- Fotos se procesan: `routePhotos` y `incidentPhotos` se convierten a array de URLs
- Se crea objeto `evidence: { routePhotos: [...], incidentPhotos: [...] }`
- Se llama `addTransaction(transaction)` del contexto
- La transacción se agrega al inicio del array (más reciente primero)
- Se muestra toast de éxito y se resetea el formulario

### 2.2. Flujo: Registro de Camión Subcontratado

**Paso 1: Acceso al Formulario**
- Usuario navega a vista "Flota"
- Hace clic en botón flotante "+" (bottom-right en mobile, centrado en desktop)
- Se abre modal con formulario

**Paso 2: Datos Básicos**
- **Patente:** Input texto con formateo automático
  - Función `formatPlate()`: Convierte entrada a formato chileno `XX-XX-XX`
  - Limpia caracteres no alfanuméricos, máximo 6 caracteres
  - Auto-formatea con guiones: `AB` → `AB-CD` → `AB-CD-12`
  - Campo obligatorio
- **Marca / Modelo:** Input texto, opcional

**Paso 3: Switch "¿Es Propio?"**
- Valor inicial: `is_own = true`
- Si usuario cambia a `false`:
  - Aparece sección "Datos del Proveedor" con animación `AnimatePresence`
  - Se limpian campos de proveedor si estaban llenos

**Paso 4: Campos Condicionales para Camión Externo**
Solo se muestran si `is_own === false`:
- **Nombre del Proveedor / Dueño:** Input texto, obligatorio
- **Foto Contrato / Acuerdo Pago:** Input `file` con `accept=".pdf,image/*"`, obligatorio
  - Al seleccionar archivo, se muestra preview con nombre y botón de eliminar
  - Se almacena como blob URL en `formData.contract_url`

**Paso 5: Foto del Camión (Siempre visible, opcional)**
- Input `file` con `accept="image/*"`
- Al seleccionar, se muestra preview de imagen
- Se almacena blob URL en `formData.photo_url`

**Paso 6: Validaciones Específicas**
- Patente es obligatoria siempre
- Si `is_own === false`:
  - `provider_name` es obligatorio (validación con trim)
  - `contract_url` es obligatorio
- Si validación falla: Se muestra toast de error y se detiene el proceso

**Paso 7: Guardado**
- Se construye objeto `truck`:
  ```javascript
  {
      plate: formData.plate,
      model: formData.model || '',
      photo_url: formData.photo_url,
      is_own: formData.is_own,
      provider_name: formData.is_own ? null : formData.provider_name,
      contract_url: formData.is_own ? null : formData.contract_url
  }
  ```
- Se llama `addTruck(truck)` del contexto
- Se guarda en localStorage automáticamente
- Se muestra toast de éxito y se cierra el modal

### 2.3. Flujo: Lógica de Cuentas Bancarias en Movimientos

**Concepto Fundamental:**
Las cuentas bancarias funcionan como "origen" o "destino" del dinero según el tipo de transacción.

**Para Ingresos (type: 'income'):**
- Campo: **"Cuenta de Destino"**
- Texto de ayuda: "¿Dónde entra la plata?"
- `accountId` almacena el ID de la cuenta
- `accountName` se calcula buscando en array `accounts`:
  ```javascript
  accountName: accounts.find(a => a.id.toString() === formData.accountId)?.name || ''
  ```
- Validación: Campo obligatorio (`required`)

**Para Gastos (type: 'expense'):**
- Campo: **"Cuenta de Origen"**
- Texto de ayuda: "¿De dónde sale la plata?"
- Mismo mecanismo de almacenamiento que ingresos
- Validación: Campo obligatorio

**Selector de Cuentas:**
- Solo muestra cuentas con `is_active === true`
- Formato: `<option value={account.id}>{account.name}</option>`
- Primera opción siempre es: `"-- Seleccione una cuenta --"` con `value=""`

**Persistencia:**
- Las cuentas se almacenan en `localStorage` bajo clave `logisystem_accounts`
- Cuentas iniciales predefinidas se cargan solo si no hay data guardada
- No hay funcionalidad de crear/editar cuentas desde la UI actual (solo lectura)

---

## 3. LÓGICA DE INTERFAZ Y ADAPTABILIDAD

### 3.1. Switch "Optimización para Plegables"

**Ubicación del Control:**
- Mobile: Modal de configuración accesible desde icono de Settings en `MobileHeader`
- Desktop: Switch en el footer del `DesktopSidebar`

**Implementación Técnica:**
- Hook personalizado: `useFoldOptimization()` ubicado en `src/hooks/useFoldOptimization.js`
- Estado persistente en localStorage: Clave `'foldOptimization'`
- Valor por defecto: `false` (Modo Clásico)
- Función `toggle()`: Cambia el valor boolean y guarda automáticamente

**Lógica de Renderizado Condicional (App.jsx):**

```javascript
const shouldShowSidebar = foldOptimization && windowWidth >= 600
const shouldShowBottomNav = !foldOptimization || (foldOptimization && windowWidth < 600)
const shouldShowMobileHeader = !foldOptimization || (foldOptimization && windowWidth < 600)
```

**Comportamiento según Modo:**

**Modo Clásico (foldOptimization === false):**
- Siempre muestra `BottomNav` (navegación inferior)
- Siempre muestra `MobileHeader` (header superior móvil)
- Nunca muestra `DesktopSidebar`
- Layout fijo independiente del ancho de pantalla

**Modo Adaptativo (foldOptimization === true):**
- Usa hook `useWindowWidth()` para detectar ancho en tiempo real
- Breakpoint: 600px
- Si `windowWidth >= 600px`:
  - Muestra `DesktopSidebar` (sidebar izquierdo fijo de 256px)
  - Oculta `BottomNav`
  - Oculta `MobileHeader`
  - Main content tiene `margin-left: 256px` (`ml-64` en Tailwind)
- Si `windowWidth < 600px`:
  - Muestra `BottomNav`
  - Muestra `MobileHeader`
  - Oculta `DesktopSidebar`
  - Main content sin margin

### 3.2. Transiciones de Layout con Framer Motion

**Cuando cambia el ancho de pantalla en Modo Adaptativo:**
- `useWindowWidth()` detecta cambios con event listener `resize`
- React re-renderiza automáticamente
- Componentes se montan/desmontan con `AnimatePresence` de Framer Motion
- Transiciones CSS: `transition-all duration-300` en elementos principales

**Transiciones Específicas:**
- Main content: `transition-all duration-300` para el cambio de margin
- Sidebar: Animación de entrada/salida con `motion.div` y variantes
- BottomNav: Transición suave al ocultar/mostrar

**Tailwind Classes Responsivas para Galaxy Fold:**
- Breakpoint personalizado `fold:` en `tailwind.config.js`
- Valor del breakpoint: `600px`
- Configuración en `tailwind.config.js`:
  ```javascript
  screens: {
      'fold': '600px',  // Breakpoint personalizado para Galaxy Fold
      // ... otros breakpoints estándar
  }
  ```
- Ejemplos de uso:
  - `grid-cols-1 fold:grid-cols-2`: 1 columna en móvil, 2 en pantalla plegada (≥600px)
  - `hidden fold:table-cell`: Oculta en móvil, muestra en pantalla ancha (≥600px)
  - `fold:grid-cols-2 lg:grid-cols-3`: 2 columnas en fold (≥600px), 3 en desktop grande (≥1024px)
  - `grid-cols-1 fold:grid-cols-2 gap-4`: Grid adaptativo con gap

### 3.3. Hook useWindowWidth

**Implementación:**
- Ubicación: `src/hooks/useWindowWidth.js`
- Retorna el ancho actual de la ventana
- Se inicializa con `window.innerWidth` o 1024 como fallback
- Listener `resize` se registra en `useEffect`
- Cleanup: Remueve listener al desmontar componente

**Uso:**
```javascript
const windowWidth = useWindowWidth()
// windowWidth es un Number que se actualiza en tiempo real
```

---

## 4. FUNCIONALIDADES ESPECIALES DE LA DEMO

### 4.1. Botón "Exportar Reporte (Excel)" en Dashboard

**Ubicación:** Vista `InicioView`, sección "Últimas Incidencias"

**Funcionamiento Técnico:**

**Paso 1: Recolección de Datos**
- Filtra todas las transacciones donde `hasComplaint === true` y `complaintDetails` existe
- NO se limita a las 3 últimas mostradas en la tabla
- Mapea cada incidencia a un objeto con estructura plana para CSV:

```javascript
{
    Fecha: transaction.date,
    Ruta: transaction.routeId || 'N/A',
    Tipo: complaintDetails.incidence_type || 'Merma',
    Descripción: complaintDetails.description || 'Sin descripción',
    Patente: transaction.truck,
    Responsable: complaintDetails.responsible || 'N/A',
    Folio: complaintDetails.folio || 'N/A',
    'Cantidad Afectada': complaintDetails.item_count || '',
    Monto: transaction.amount,
    'Cuenta': transaction.accountName || 'N/A'
}
```

**Paso 2: Generación de CSV**
- Si no hay incidencias: Crea un array con un objeto que contiene headers y mensaje "No hay incidencias registradas"
- Extrae headers del primer objeto: `Object.keys(exportData[0])`
- Construye contenido CSV:
  - Primera línea: Headers separados por comas
  - Líneas siguientes: Valores de cada objeto
  - Escapado de valores: Si un valor contiene comas, comillas dobles o saltos de línea, se envuelve en comillas dobles y se escapan comillas internas (`""`)

**Paso 3: Creación y Descarga del Archivo**
- Crea `Blob` con contenido CSV y BOM UTF-8 (`\ufeff`) para compatibilidad con Excel
- Tipo MIME: `'text/csv;charset=utf-8;'`
- Crea elemento `<a>` temporal
- Asigna `href` con `URL.createObjectURL(blob)`
- Asigna `download` con nombre: `reporte-incidencias-YYYY-MM-DD.csv`
- Hace clic programático: `link.click()`
- Limpia: Remueve el elemento del DOM y revoca el blob URL con `URL.revokeObjectURL()`

**Paso 4: Feedback al Usuario**
- Muestra toast de loading mientras procesa
- Toast de éxito incluye cantidad de incidencias exportadas: `"Reporte descargado correctamente (X incidencias)"`
- Botón se deshabilita durante el proceso (`disabled={isExporting}`)

**Nota Importante:**
- El botón dice "Exportar Reporte (Excel)" pero genera un archivo `.csv`
- Excel puede abrir archivos CSV directamente
- El BOM UTF-8 asegura que caracteres especiales se muestren correctamente en Excel

### 4.2. Manejo de Subida de Archivos (Fotos/PDFs)

**Arquitectura General:**
- NO hay subida real a servidor
- Todos los archivos se manejan en memoria del navegador usando Blob URLs
- `URL.createObjectURL(file)` crea una URL temporal válida solo en la sesión actual
- Al recargar la página, las blob URLs se invalidan

**Tipos de Archivos Soportados:**

**1. Fotos/Imágenes:**
- Inputs con `accept="image/*"` y `capture="environment"` (permite usar cámara en móviles)
- Ubicaciones:
  - Evidencia de Ruta (hasta 4 fotos)
  - Fotos de Incidencia (hasta 4 fotos)
  - Fotos de Gastos/Comprobantes (hasta 4 fotos)
  - Foto del Camión (1 foto)

**2. Documentos PDF/Excel:**
- Inputs con `accept=".xlsx,.xls,.pdf"` o `accept=".pdf,image/*"`
- Ubicaciones:
  - Excel/Informe de Rechazo en incidencias
  - Contrato/Acuerdo de Pago para camiones subcontratados
  - Liquidación de Sueldo/Anticipo

**Flujo Técnico de Manejo de Fotos:**

**Al Seleccionar Archivo:**
```javascript
const handlePhotoChange = (e, index, type) => {
    const file = e.target.files[0]
    if (!file) return
    
    const newPhoto = { 
        id: Date.now() + index, 
        file: file,                    // Objeto File original
        url: URL.createObjectURL(file) // Blob URL para mostrar preview
    }
    
    // Se almacena en estado local según tipo
    if (type === 'route') setRoutePhotos([...routePhotos, newPhoto])
    // ... etc
}
```

**Al Guardar Transacción:**
- Se filtran fotos válidas: `routePhotos.filter(Boolean).map(p => p.url)`
- Solo se guardan las URLs (strings), no los objetos File
- Se estructura en objeto `evidence: { routePhotos: [...], incidentPhotos: [...] }`

**Al Eliminar Foto:**
```javascript
const removePhoto = (index, type) => {
    URL.revokeObjectURL(photos[index]?.url) // Libera memoria del blob
    // Remueve del array de estado
}
```

**Manejo de Documentos (PDFs/Excel):**
- Se almacena el objeto `File` directamente en el estado: `formData.document_url = file`
- Al guardar, se convierte a blob URL: `URL.createObjectURL(formData.document_url)`
- Se guarda solo la URL string en la transacción final

**Limitaciones y Consideraciones:**
- Las blob URLs son válidas solo durante la sesión del navegador
- No hay validación de tamaño de archivo
- No hay compresión de imágenes
- Los archivos ocupan memoria del navegador (puede ser problemático con muchos archivos grandes)
- Al exportar/importar datos desde localStorage, las URLs se pierden (son temporales)

---

## 5. FORMULARIOS: CAMPOS DETALLADOS

### 5.1. Formulario de Ingreso (RegistrarView - transactionType === 'income')

**Sección: Datos Principales**
1. **Fecha** (input type="date")
   - Valor por defecto: Fecha actual
   - Formato: YYYY-MM-DD
   - Requerido: Sí

2. **Patente** (select)
   - Opciones: Camiones con `is_own !== false`
   - Formato: `{plate} - {model}` o solo `{plate}`
   - Requerido: Sí

3. **N° de Ruta / Folio** (input type="number")
   - Placeholder: "Ej: 99420"
   - Requerido: Sí
   - Validación: Debe tener valor

4. **Monto Total** (input type="number")
   - Prefijo visual: "$"
   - Estilo: Texto emerald-400, font-bold, text-lg
   - Requerido: Sí
   - Validación: Debe ser > 0

5. **Cuenta de Destino** (select)
   - Opciones: Cuentas con `is_active === true`
   - Requerido: Sí
   - Texto ayuda: "¿Dónde entra la plata?"

**Sección: Evidencia de Ruta**
6. **Fotos de Evidencia** (input type="file" múltiple, hasta 4)
   - Accept: "image/*"
   - Capture: "environment" (cámara)
   - Grid: 4 columnas

7. **Etiquetas del Viaje** (sistema de tags)
   - Tags predefinidos: 8 opciones
   - Múltiple selección
   - Almacenamiento: String separado por comas

**Sección: Incidencia (Condicional)**
8. **Switch "¿Hubo Incidencia / Merma?"** (toggle button)
   - Valores: true/false
   - Visual: Fondo rojo cuando activo

9. **Tipo de Incidencia** (select) - Requerido si incidencia activa
   - Opciones: 'Merma', 'Rechazo', 'Daño', 'Otro'

10. **Cantidad de Bultos Afectados** (input type="number")
    - Opcional
    - Min: 0

11. **Responsable** (input type="text")
    - Placeholder: "Nombre del responsable"
    - Opcional

12. **Comentario / Descripción** (textarea)
    - Placeholder: "Describe el daño, rechazo o problema en detalle..."
    - Opcional
    - Altura: h-24

13. **Fotos de Evidencia** (input type="file" múltiple, hasta 4)
    - Similar a evidencia de ruta
    - Grid: 4 columnas

14. **Adjuntar Excel / Informe de Rechazo** (input type="file")
    - Accept: ".xlsx,.xls,.pdf"
    - Opcional

### 5.2. Formulario de Gasto (RegistrarView - transactionType === 'expense')

**Sección: Datos Principales**
1. **Fecha** (input type="date")
   - Requerido: Sí

2. **Patente** (select) - Condicional
   - Solo se muestra si `category !== 'pago_proveedor'`
   - Opciones: Camiones con `is_own !== false`
   - Requerido: Sí (si no es pago_proveedor)

3. **Categoría** (select)
   - Opciones: 8 categorías predefinidas
   - Requerido: Sí
   - Al cambiar, resetea campos condicionales

**Sección: Datos del Proveedor (Solo si category === 'pago_proveedor')**
4. **Nombre del Proveedor / Dueño** (input type="text")
   - Placeholder: "Ej: Juan Pérez Transportes"
   - Requerido: Sí (si es pago_proveedor)

5. **Patente del Camión Externo** (input type="text")
   - Placeholder: "XX-XX-XX"
   - MaxLength: 8
   - Auto-uppercase
   - Requerido: Sí (si es pago_proveedor)

**Sección: Datos del Trabajador (Solo si category === 'Sueldo' || 'Anticipo')**
6. **Seleccionar Trabajador** (select)
   - Opciones: Lista completa de empleados
   - Formato: "{nombre} - {cargo}"
   - Requerido: Sí

7. **Mes de Pago** (input type="month")
   - Formato: YYYY-MM
   - Requerido: Sí

8. **Adjuntar Liquidación** (input type="file")
   - Accept: ".pdf,image/*"
   - Opcional

**Sección: Combustible (Solo si category === 'Combustible')**
9. **Litros** (input type="number" step="0.1")
   - Opcional

10. **KM** (input type="number")
    - Opcional

**Sección: General**
11. **Boleta / Comprobante** (input type="file" múltiple, hasta 4)
    - Accept: "image/*"
    - Grid: 4 columnas
    - Opcional

12. **Cuenta de Origen** (select)
    - Opciones: Cuentas activas
    - Requerido: Sí
    - Texto ayuda: "¿De dónde sale la plata?"

13. **Monto** (input type="number")
    - Placeholder: "$0"
    - Requerido: Sí
    - Validación: Debe ser > 0

14. **Nota** (textarea)
    - Opcional
    - Altura: h-20

### 5.3. Formulario de Camión (FlotaView)

1. **Patente** (input type="text")
   - Placeholder: "XX-XX-XX"
   - MaxLength: 8
   - Auto-formateo a formato chileno
   - Requerido: Sí

2. **Marca / Modelo** (input type="text")
   - Placeholder: "Ej: Volvo FH, Scania R500"
   - Opcional

3. **Switch "¿Es Propio?"** (toggle button)
   - Valores: true/false
   - Por defecto: true

4. **Nombre del Proveedor / Dueño** (input type="text") - Condicional
   - Solo si `is_own === false`
   - Requerido: Sí (si es externo)
   - Placeholder: "Ej: Juan Pérez Transportes"

5. **Foto Contrato / Acuerdo Pago** (input type="file") - Condicional
   - Solo si `is_own === false`
   - Accept: ".pdf,image/*"
   - Requerido: Sí (si es externo)

6. **Foto del Camión** (input type="file")
   - Accept: "image/*"
   - Opcional
   - Preview de imagen al seleccionar

### 5.4. Formulario de Empleado (PersonalView)

1. **Nombre Completo** (input type="text")
   - Placeholder: "Ej: Juan Pérez"
   - Requerido: Sí

2. **RUT** (input type="text")
   - Placeholder: "12.345.678-9"
   - MaxLength: 12
   - Auto-formateo a formato chileno (función `formatRut()`)
   - Formato: `XXX.XXX.XXX-X` (puntos cada 3 dígitos, guión antes del dígito verificador)
   - Requerido: Sí

3. **Fecha de Nacimiento** (input type="date")
   - Formato: YYYY-MM-DD
   - Icono: Calendario (lucide-react)
   - Requerido: Sí

4. **Cargo** (input type="text")
   - Placeholder: "Ej: Chofer, Administrador, etc."
   - Requerido: Sí

5. **Adjuntar Contrato** (input type="file")
   - Accept: ".pdf,image/*"
   - Opcional
   - Preview con nombre de archivo cuando está seleccionado
   - Botón para eliminar archivo seleccionado

---

## 6. NOTAS ADICIONALES PARA EL EQUIPO DE DOCUMENTACIÓN

### 6.1. Persistencia de Datos
- Todos los datos persisten en localStorage del navegador
- Al limpiar caché del navegador, se pierden todos los datos
- No hay sincronización entre dispositivos
- Los datos son específicos del dominio y navegador

### 6.2. Credenciales de Login
- Email: `admin@logisystem.cl`
- Contraseña: `demo123`
- La sesión persiste en localStorage bajo clave `logisystem_auth`

### 6.3. Validaciones de Formularios
- Validaciones se ejecutan tanto en HTML5 (`required`) como en JavaScript
- Mensajes de error se muestran mediante toasts (react-hot-toast)
- Los formularios no se envían si hay errores

### 6.4. Animaciones y UX
- La aplicación usa Framer Motion para todas las animaciones
- Transiciones suaves entre vistas (duration: 0.3s)
- AnimatePresence para animaciones de entrada/salida
- Feedback visual inmediato en todas las acciones

### 6.5. Navegación
- 5 vistas principales: Inicio, Registrar, Personal, Flota, Movimientos
- Navegación mediante estado local `activeView` en App.jsx
- No hay routing real (React Router), es SPA con cambio de vistas condicional

---

---

## 7. DETALLES ADICIONALES DE IMPLEMENTACIÓN

### 7.1. Formateo Automático de Campos

**Patente Chilena:**
- Función: `formatPlate(value)` en `FlotaView.jsx`
- Lógica:
  1. Limpia caracteres no alfanuméricos
  2. Convierte a mayúsculas
  3. Limita a 6 caracteres
  4. Formatea dinámicamente: `AB` → `AB-CD` → `AB-CD-12`
- Ejemplo: Usuario escribe "ABCD12" → Se muestra "AB-CD-12"

**RUT Chileno:**
- Función: `formatRut(value)` en `PersonalView.jsx`
- Lógica:
  1. Limpia caracteres no numéricos (excepto 'k' y 'K' para dígito verificador)
  2. Separa cuerpo y dígito verificador
  3. Formatea cuerpo con puntos cada 3 dígitos desde la derecha
  4. Une con guión: `{cuerpo}-{dv}`
- Ejemplo: Usuario escribe "123456789" → Se muestra "12.345.678-9"

### 7.2. Sistema de Tags/Etiquetas

**Tags Predefinidos (8 opciones):**
1. Carga Nocturna
2. Rural
3. Urbano
4. Cyber
5. IKEA
6. Segunda Vuelta PM
7. Retiros AM
8. Flete

**Tags Personalizados:**
- Se pueden agregar dinámicamente desde el formulario de ingreso
- Se almacenan en estado local `customTags` en `App.jsx`
- Persistencia: Actualmente NO persisten entre recargas (solo en sesión)
- Validación: No permite tags duplicados

**Almacenamiento:**
- En transacción: String separado por comas: `"Tag1, Tag2, Tag3"`
- Al recuperar: Se puede dividir con `.split(', ')` para obtener array

### 7.3. Categorías de Gastos Predefinidas

1. **Combustible**
   - Campos adicionales: Litros, Kilometraje (KM)
   - Genera objeto `fuelDetails` en la transacción

2. **Peajes**
   - Sin campos adicionales

3. **Sueldo**
   - Campos adicionales: Trabajador (select), Mes de Pago, Liquidación (archivo)
   - Genera objeto `employeeDetails` en la transacción

4. **Anticipo**
   - Mismos campos que Sueldo
   - Genera objeto `employeeDetails`

5. **Mantención**
   - Sin campos adicionales

6. **Multas**
   - Sin campos adicionales

7. **Indemnizaciones**
   - Sin campos adicionales

8. **Pago Proveedor / Subcontrato**
   - Campos adicionales: Nombre del Proveedor, Patente Externa
   - Genera objeto `providerDetails` en la transacción
   - NO requiere seleccionar camión de la flota propia

9. **Otros**
   - Sin campos adicionales

### 7.4. Estructura de Colores y Temas

**Esquema de Colores (definido en `tailwind.config.js`):**

**Colores Oscuros (Dark Theme):**
- `dark-bg`: #09090b (zinc-950) - Fondo principal
- `dark-surface`: #18181b (zinc-900) - Superficies de componentes
- `dark-surface2`: #27272a (zinc-800) - Superficies secundarias
- `dark-border`: #3f3f46 (zinc-700) - Bordes
- `dark-text`: #e4e4e7 (zinc-200) - Texto principal
- `dark-text2`: #a1a1aa (zinc-400) - Texto secundario

**Colores de Acento:**
- `accent`: #d97706 (amber-600) - Color principal
- `accent-light`: #f59e0b (amber-500) - Variante clara
- `accent-dark`: #b45309 (amber-700) - Variante oscura

**Colores Funcionales:**
- Éxito/Ingresos: Emerald-500 (#10b981)
- Error/Gastos: Rose-500 (#f43f5e)
- Advertencia/Incidencias: Red-400 (#f87171)
- Información: Blue-400 (#60a5fa)

### 7.5. Breakpoints Responsivos

**Breakpoints Tailwind Estándar:**
- `xs`: 375px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Breakpoint Personalizado:**
- `fold`: 600px (específico para Galaxy Fold y dispositivos plegables)

**Uso en el Código:**
- `useWindowWidth()` usa 600px como breakpoint para cambiar layout
- Tailwind usa `fold:` prefix para aplicar estilos en pantallas ≥600px
- Ejemplo: `fold:grid-cols-2` aplica 2 columnas cuando el ancho es ≥600px

---

**Fin del Reporte Técnico**

