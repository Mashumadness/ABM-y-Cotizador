export const CATEGORIES = [
  'Imanes Personalizados',
  'Stickers Siluetados (Die-Cut)',
  'Stickers en Plancha (Kiss-Cut)',
  'Stickers Holográficos',
  'Stickers UV',
  'Etiquetas en Bobina / Rollo',
  'Packaging & Cajas',
  'Tarjetas & Tags de Emprendimiento',
  'Cierrabolsas & Papelería',
  'Otros a Medida'
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-tiker-1',
    name: 'Imanes Personalizados Siluetados 5x5 cm (Pack x100)',
    category: 'Imanes Personalizados',
    cost: 8500,
    price: 24500,
    stock: 15,
    description: 'Imán 0.4mm con papel autoadhesivo impreso a full color y laminado brillante protector UV.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-tiker-2',
    name: 'Stickers Troquelados Individuales Die-Cut 5cm (Pack x100)',
    category: 'Stickers Siluetados (Die-Cut)',
    cost: 4200,
    price: 13900,
    stock: 30,
    description: 'Vinilo autoadhesivo resistente al agua, corte al ras siluetado con liner individual.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-tiker-3',
    name: 'Planchas A4 de Stickers Troquelados Kiss-Cut (Pack x10)',
    category: 'Stickers en Plancha (Kiss-Cut)',
    cost: 3200,
    price: 9800,
    stock: 25,
    description: '10 planchas A4 con los stickers troquelados listos para despegar, full color HD.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-tiker-4',
    name: 'Stickers Holográficos Prisma 5cm (Pack x50)',
    category: 'Stickers Holográficos',
    cost: 2900,
    price: 8900,
    stock: 20,
    description: 'Vinilo con base holográfica reflectiva arcoíris, acabado ultra brillante.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-tiker-5',
    name: 'Tags Colgantes Perforados 9x5cm (Pack x100)',
    category: 'Tarjetas & Tags de Emprendimiento',
    cost: 2400,
    price: 6800,
    stock: 18,
    description: 'Papel ilustración 300g con laminado mate y perforación de 4mm para hilo.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-tiker-6',
    name: 'Cierrabolsas Circulares 4cm (Pack x200)',
    category: 'Cierrabolsas & Papelería',
    cost: 2100,
    price: 6500,
    stock: 40,
    description: 'Papel autoadhesivo troquelado en círculos perfecto para envíos y empaques.',
    createdAt: new Date().toISOString()
  }
];

// Insumos: el valor unitario (por hoja / unidad) se calcula como precio del paquete / cantidad por paquete.
export const INITIAL_SUPPLIES = [
  { id: 'sup-1', name: 'Lámina de Imán Flexible 0.4mm (A4)', packageQuantity: 10, packagePrice: 4500, unitCost: 450 },
  { id: 'sup-2', name: 'Vinilo Autoadhesivo Blanco Glossy (A4)', packageQuantity: 20, packagePrice: 4400, unitCost: 220 },
  { id: 'sup-3', name: 'Papel Autoadhesivo Fotográfico 135g (A4)', packageQuantity: 100, packagePrice: 14000, unitCost: 140 },
  { id: 'sup-4', name: 'Vinilo Holográfico Prisma (A4)', packageQuantity: 10, packagePrice: 3800, unitCost: 380 },
  { id: 'sup-5', name: 'Film Laminado Protector Frío Brillante (A4)', packageQuantity: 50, packagePrice: 4500, unitCost: 90 },
  { id: 'sup-6', name: 'Film Laminado Mate Soft-Touch (A4)', packageQuantity: 50, packagePrice: 5500, unitCost: 110 },
  { id: 'sup-7', name: 'Papel Ilustración 300g (A4)', packageQuantity: 100, packagePrice: 12000, unitCost: 120 }
];

// Plantillas de 1 clic de Costos de productos.
// type 'preset': trabajo predefinido. type 'product': referencia a un producto del ABM (productId).
export const INITIAL_QUICK_TEMPLATES = [
  {
    id: 'tpl-imanes',
    type: 'preset',
    label: '🧲 Imanes x100',
    productName: 'Imanes Personalizados Siluetados (Pack x100)',
    quantity: 100, sheetsToPrint: 5, electricityMinutes: 30, laborMinutes: 45, marginPercent: 160,
    materials: [['sup-1', 5], ['sup-3', 5], ['sup-5', 5]]
  },
  {
    id: 'tpl-stickers-diecut',
    type: 'preset',
    label: '✂️ Stickers Die-Cut x100',
    productName: 'Stickers Vinilo Siluetados Die-Cut 5cm (Pack x100)',
    quantity: 100, sheetsToPrint: 4, electricityMinutes: 25, laborMinutes: 40, marginPercent: 180,
    materials: [['sup-2', 4], ['sup-5', 4]]
  },
  {
    id: 'tpl-holograficos',
    type: 'preset',
    label: '✨ Holográficos x50',
    productName: 'Stickers Holográficos Prisma 5cm (Pack x50)',
    quantity: 50, sheetsToPrint: 2, electricityMinutes: 15, laborMinutes: 25, marginPercent: 200,
    materials: [['sup-4', 2], ['sup-5', 2]]
  },
  {
    id: 'tpl-planchas-a4',
    type: 'preset',
    label: '📄 Planchas A4 x10',
    productName: 'Planchas A4 de Stickers Troquelados Kiss-Cut (Pack x10)',
    quantity: 10, sheetsToPrint: 10, electricityMinutes: 20, laborMinutes: 30, marginPercent: 170,
    materials: [['sup-2', 10]]
  }
];

export const INITIAL_WORKSHOP_RATES = {
  hourlyLaborRate: 6000,       // $6000 la hora de mano de obra ($100/minuto)
  hourlyElectricityRate: 1800, // $1800 la hora de energía eléctrica / máquina ($30/minuto)
  inkCostPerSheet: 180         // $180 de tinta aproximado x hoja impresa
};

export const DEFAULT_BUSINESS_INFO = {
  name: 'Tiker',
  tagline: 'Stickers UV y papelería creativa. Packs, pizarras y más.\nPersonalizados para tu emprendimiento 💛',
  owner: 'Tiker',
  website: 'https://tiker.com.ar',
  whatsapp: '1164934119',
  instagram: '@tiker_st',
  email: 'hola@tiker.com.ar',
  address: '',
  currencySymbol: '$',
  defaultValidityDays: 15,
  defaultNotes: '• Presupuesto válido por 15 días corridos.\n• Seña del 50% requerida para iniciar producción.\n• Tiempo de elaboración: 3 a 5 días hábiles tras confirmación de diseño.\n• Envíos a todo el país o retiro acordado.'
};
