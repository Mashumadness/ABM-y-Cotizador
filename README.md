# 🧲 Tiker — Taller Gráfico & Cotizador de Manufactura

Una aplicación web moderna, ágil e interactiva diseñada especialmente para el taller de manufactura gráfica **Tiker** (stickers troquelados, imanes personalizados, bobinas y packaging comercial: [tiker.com.ar](https://tiker.com.ar/)).

Construida con **React**, **Tailwind CSS**, y **Lucide Icons**, funcionando 100% en el navegador con persistencia en **`localStorage`** y con una arquitectura modular lista para conectar a **Firebase Firestore**.

---

## ⚡ El Núcleo: Costeo de Fabricación Industrial (Escandallo Interno)

A diferencia de una simple tienda de reventa, **Tiker fabrica**:
1. **Material base:** Pliegos de goma de imán flexible 0.4mm, vinilo autoadhesivo blanco, vinilo holográfico, opalina/ilustración 300g.
2. **Sustrato superior impreso:** Papel autoadhesivo fotográfico o vinilo full color HD.
3. **Acabado protector:** Film laminado en frío o calor (brillante, mate o holográfico).
4. **Consumibles de máquina:** Tinta de impresión + electricidad y desgaste del plotter de corte/impresora.
5. **Mano de obra (Hora hombre):** Minutos dedicados de operario a diseño, armado, laminado, corte siluetado y descarte.
6. **Margen de Ganancia Ajustable:** Slider interactivo de rentabilidad (+50% mayorista, +150% normal, +200% minorista).

### Doble Vista: Taller Interno vs. Presupuesto para el Cliente
- **En la Interna:** Tienes el desglose exacto de cada insumo, tinta y minutos de trabajo para asegurar que **nunca vendas por debajo del costo**.
- **Con un clic ("⚡ Pasar a Presupuesto"):** Se genera la cotización limpia para el cliente (por WhatsApp o PDF), donde el cliente **solo ve el producto terminado** (ej. *"100 Imanes personalizados siluetados 6x6cm con laminado brillante — $X total"*), protegiendo tus costos y secretos de taller.

---

## 🚀 Inicio Rápido (Cómo Ejecutar la App)

### 1. Requisitos Previos
- Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).

### 2. Instalación de dependencias
Abre una terminal en la carpeta del proyecto y ejecuta:
```bash
npm install
```
*(En Windows PowerShell, si tienes restricciones de políticas de ejecución de scripts, puedes usar `npm.cmd install`)*.

### 3. Iniciar el servidor local
```bash
npm run dev
```
*(O `npm.cmd run dev`)*.

La terminal te mostrará la dirección local, usualmente:
👉 **`http://localhost:5173`**

Abre esa URL en tu navegador y la aplicación estará lista para usar con datos de ejemplo pre-cargados.

---

## 📦 Módulos y Funcionalidades

### 1. Gestión de Productos (Inventario de Papelería)
- **ABM Completo:** Crear, editar y eliminar productos (Cuadernos, Agendas, Stickers, Blocs de notas, Tarjetas, Cajas, etc.).
- **Métricas de Ganancia en Tiempo Real:** Al ingresar el costo de insumos y el precio de venta sugerido, calcula automáticamente el margen de ganancia en monto monetario y en porcentaje sobre costo.
- **Control de Stock:** Alertas visuales de stock bajo (menor o igual a 5 unidades) o agotado.
- **Buscador & Filtros Rápidos:** Búsqueda en vivo por nombre o descripción, filtros por categorías predefinidas o personalizadas, y ordenamiento por precio, stock o ganancia.
- **Acción Rápida de Cotización:** Botón "Cotizar" directo en cada tarjeta de producto para sumarlo al presupuesto en un solo clic.
- **KPIs de Taller:** Muestra el número de productos únicos, unidades totales en stock, costo de insumos inmovilizado y valuación proyectada en venta.

### 2. Generador de Presupuestos (Cotizador)
- **Selector Dinámico:** Buscador rápido con vista previa de productos y precios para sumarlos con un clic.
- **Ítem a Medida / Personalizado:** Permite cotizar trabajos especiales o servicios que no estén cargados en el inventario fijo (ej. encuadernaciones a medida, diseño gráfico especial, grabado láser).
- **Cálculo Automático en Vivo:**
  - Subtotal por cada línea de producto según cantidad y precio editable.
  - Subtotal acumulado general.
  - Descuentos opcionales (porcentaje `%` o monto fijo `$`).
  - Recargos o costos de envío opcionales (porcentaje `%` o monto fijo `$`).
  - Total final a cobrar.
  - **Margen de Ganancia del Presupuesto:** Muestra al emprendedor cuánto dinero real gana con esa venta tras deducir costos de insumos.
- **Datos del Cliente:** Nombre del cliente/empresa, contacto (WhatsApp/Instagram) y fecha de validez del presupuesto.
- **Generación / Imprimir / Exportar a PDF:** 
  - Vista previa limpia y elegante estilo recibo membretado.
  - Estilos optimizados para impresión (`window.print()`), ocultando la interfaz de la aplicación para guardar un PDF profesional en A4 o recibo.
- **Formateador para WhatsApp:** Botón que copia un mensaje estructurado con emojis, viñetas, detalle de productos, totales y datos de pago listo para enviar al cliente por chat.

### 3. Historial de Presupuestos
- Guarda y lista automáticamente los presupuestos generados con código secuencial (ej. `#COT-0001`).
- **Estados de Presupuesto:** Permite cambiar el estado de cada cotización entre *Pendiente*, *Aprobado*, *Entregado* y *Cancelado*.
- **Métricas:** Conteo de presupuestos emitidos, aprobados y monto total de ventas confirmadas.
- **Acciones:**
  - Copiar mensaje de WhatsApp nuevamente.
  - Ver comprobante / Reimprimir / Guardar PDF.
  - Cargar/Duplicar en el cotizador para crear uno nuevo a partir de un cliente existente.
  - Eliminar con confirmación de seguridad.

### 4. Configuración del Taller & Respaldo de Datos
- Personalización de nombre del taller, eslogan, WhatsApp, Instagram, símbolo de moneda y condiciones de venta predeterminadas (ej. 50% de seña para comenzar, tiempos de entrega).
- **Copia de Seguridad (Backup):**
  - **Exportar datos (JSON):** Descarga un archivo con todo tu catálogo, historial de presupuestos y configuración.
  - **Restaurar datos:** Carga copias de seguridad previas en caso de cambiar de navegador o equipo.

---

## 🛠️ Arquitectura y Estructura de Archivos

```
ABM y Cotizador/
├── index.html                   # Entry point con fuentes y estilos base
├── package.json                 # Dependencias (React, Tailwind, Lucide)
├── vite.config.js               # Configuración del bundler Vite
├── tailwind.config.js           # Paleta de colores para papelería/taller
├── postcss.config.js            # PostCSS para Tailwind
├── README.md                    # Documentación y guía de uso
└── src/
    ├── main.jsx                 # Renderizado raíz de React
    ├── App.jsx                  # Estado global, orquestación de pestañas y modales
    ├── index.css                # Directivas Tailwind y estilos @media print
    ├── constants/
    │   └── defaultData.js       # Categorías, productos de muestra y datos por defecto
    ├── services/
    │   └── storageService.js    # Capa de abstracción de datos (localStorage -> Firestore ready)
    ├── utils/
    │   └── formatters.js        # Moneda, fechas y generador de mensajes WhatsApp
    └── components/
        ├── Navbar.jsx           # Barra de navegación, pestañas y badges
        ├── common/
        │   ├── ConfirmModal.jsx # Diálogo de confirmación para eliminar
        │   └── Toast.jsx        # Alertas flotantes animadas
        ├── products/
        │   ├── ProductList.jsx  # Grilla de productos, KPIs, filtros y buscador
        │   └── ProductModal.jsx # Formulario ABM con cálculo de márgenes
        ├── quotes/
        │   ├── QuoteBuilder.jsx # Constructor de presupuestos interactivo
        │   └── QuotePreviewModal.jsx # Vista previa, impresión/PDF y copiar WhatsApp
        ├── history/
        │   └── QuoteHistory.jsx # Listado histórico de cotizaciones y estados
        └── settings/
            └── BusinessSettingsModal.jsx # Datos del negocio y backup JSON
```

---

## ☁️ Preparado para migrar a Firebase Firestore

Toda la interacción con los datos se realiza a través de `src/services/storageService.js`. Todos los métodos (`getProducts`, `saveProduct`, `getQuotes`, `saveQuote`, etc.) devuelven `Promises` y mantienen firmas estándar.

Para migrar a Firebase:
1. Instala Firebase: `npm install firebase`
2. Configura tu `firebaseConfig.js`.
3. En `src/services/storageService.js`, reemplaza la lógica interna de `localStorage` por `getDocs`, `addDoc`, `updateDoc` y `deleteDoc` de Firestore sin tener que modificar ninguno de los componentes visuales de la aplicación.
