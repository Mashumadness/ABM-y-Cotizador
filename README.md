# 💛 Tiker — Cotizador & ABM de Productos

Aplicación web desarrollada para **Tiker** ([tiker.com.ar](https://tiker.com.ar/)): stickers personalizados, imanes, pizarras, packaging y papelería creativa para emprendedores.

Construida con **React**, **Tailwind CSS** y **Lucide Icons**, funcionando de manera local y offline con persistencia en el navegador (`localStorage`).

---

## ✨ ¿Qué hace esta aplicación?

### 1. Costos de productos (Cálculo interno)
Calcula en el momento el costo real de fabricar cualquier producto personalizado combinando:
- **Materiales e insumos:** Hojas de goma de imán flexible, vinilo autoadhesivo blanco/holográfico, papel fotográfico autoadhesivo y film laminado protector (brillo/mate).
- **Hojas impresas & Tinta:** Costo estimado de tinta calculado por la cantidad de hojas impresas de la tirada.
- **Energía eléctrica:** Tarifa por hora de máquinas/luz y cálculo automático según los minutos que tome el trabajo.
- **Mano de obra:** Tarifa por hora de trabajo de taller y cálculo automático según los minutos dedicados a diseño, armado, corte y descarte.
- **Margen de ganancia:** Control deslizable para definir la rentabilidad deseada (+50% mayorista, +150% estándar, +200% minorista).
- **Plantillas rápidas de 1 clic:** Botones para cargar en un segundo las recetas habituales (Imanes x100, Stickers Die-Cut x100, Holográficos x50, Planchas A4 x10).
- **Botón "Pasar a Presupuesto":** Traslada el producto terminado al presupuesto del cliente con un solo clic.

### 2. Cotizador para el Cliente
- **Privacidad total:** El cliente nunca ve los costos internos de tinta, luz ni materiales; solo ve la descripción del producto final terminado y su precio.
- **Botón "Copiar para WhatsApp":** Genera un mensaje prolijo con emojis, detalle ordenado de productos, subtotales, notas de seña/entrega y datos de contacto listo para pegar en el chat.
- **Imprimir / Guardar en PDF:** Vista previa con el logo oficial de Tiker, datos de Instagram (`@tiker_st`), WhatsApp y condiciones comerciales lista para imprimir o descargar en PDF.
- **Descuentos y Recargos:** Opciones para aplicar descuentos o costos de envío en porcentaje o monto fijo.

### 3. ABM Productos (Inventario)
- Crear, editar y eliminar productos con control de stock y alertas cuando queda poco stock.
- Filtros por categorías (Imanes, Stickers siluetados, Stickers UV, Planchas, Packaging, etc.).
- Botón directo "Cotizar" para sumar cualquier producto del catálogo al presupuesto con un clic.

### 4. Historial de Presupuestos
- Registro de presupuestos emitidos con código secuencial (ej. `#COT-0001`).
- Control de estados: *Pendiente*, *Aprobado*, *Entregado*, *Cancelado*.
- Opciones para reimprimir, reenviar a WhatsApp o duplicar un presupuesto anterior.

### 5. Copia de Seguridad & Configuración
- Personalización de tarifas base de taller (costo de hora de mano de obra, hora de luz y tinta por hoja).
- Descarga y restauración de copias de seguridad en formato JSON.

---

## 🚀 Cómo usar la aplicación

### Opción 1: Con el Acceso Directo del Escritorio (Recomendado)
Haz doble clic sobre el acceso directo **`Tiker - Cotizador`** que está en tu Escritorio de Windows. Se iniciará el servidor y se abrirá automáticamente en tu navegador.

### Opción 2: Desde la Terminal
```powershell
cd "C:\Users\msuar\Desktop\ABM y Cotizador"
npm.cmd run dev
```
Luego abre en tu navegador: **`http://localhost:5173`**

---

## 🐙 Comandos de Git para el día a día

Para guardar y subir cambios a GitHub:
```powershell
# 1. Preparar archivos modificados
git add .

# 2. Guardar con mensaje
git commit -m "Detalle de los cambios"

# 3. Subir a GitHub
git push
```
*(Repositorio: [https://github.com/Mashumadness/abm-y-cotizador](https://github.com/Mashumadness/abm-y-cotizador))*
