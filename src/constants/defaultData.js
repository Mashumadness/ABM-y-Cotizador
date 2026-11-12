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

export const INITIAL_SUPPLIES = [
  {
    id: 'sup-1',
    name: 'Lámina de Imán Flexible 0.4mm',
    unit: 'Hoja A4',
    unitCost: 450,
    category: 'Sustrato Base'
  },
  {
    id: 'sup-2',
    name: 'Vinilo Autoadhesivo Blanco Glossy',
    unit: 'Hoja A4',
    unitCost: 220,
    category: 'Sustrato de Impresión'
  },
  {
    id: 'sup-3',
    name: 'Papel Autoadhesivo Fotográfico 135g',
    unit: 'Hoja A4',
    unitCost: 140,
    category: 'Sustrato de Impresión'
  },
  {
    id: 'sup-4',
    name: 'Vinilo Holográfico Prisma',
    unit: 'Hoja A4',
    unitCost: 380,
    category: 'Sustrato de Impresión'
  },
  {
    id: 'sup-5',
    name: 'Film Laminado Protector Frío (Brillante)',
    unit: 'Hoja A4',
    unitCost: 90,
    category: 'Laminado & Acabado'
  },
  {
    id: 'sup-6',
    name: 'Film Laminado Mate Soft-Touch',
    unit: 'Hoja A4',
    unitCost: 110,
    category: 'Laminado & Acabado'
  },
  {
    id: 'sup-7',
    name: 'Papel Ilustración 300g (Tags y Tarjetas)',
    unit: 'Hoja A4',
    unitCost: 120,
    category: 'Sustrato Base'
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
