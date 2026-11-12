/**
 * Servicio de Almacenamiento Modular
 * 
 * Abstrae el almacenamiento de datos en localStorage para funcionar 100% offline.
 * Preparado para migrar a Firebase Firestore reemplazando estas funciones.
 */

import { 
  INITIAL_PRODUCTS, 
  DEFAULT_BUSINESS_INFO, 
  INITIAL_SUPPLIES, 
  INITIAL_WORKSHOP_RATES 
} from '../constants/defaultData';

const KEYS = {
  PRODUCTS: 'tiker_products_v2',
  QUOTES: 'tiker_quotes_v2',
  BUSINESS: 'tiker_business_v2',
  SUPPLIES: 'tiker_supplies_v2',
  RATES: 'tiker_rates_v2'
};

export const storageService = {
  // ==========================================
  // PRODUCTOS (Catálogo / Inventario)
  // ==========================================
  getProducts: async () => {
    try {
      const data = localStorage.getItem(KEYS.PRODUCTS);
      if (!data) {
        localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return [];
    }
  },

  saveProduct: async (productData) => {
    try {
      const current = await storageService.getProducts();
      const newProduct = {
        ...productData,
        id: productData.id || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        createdAt: productData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const updated = [newProduct, ...current];
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));
      return newProduct;
    } catch (error) {
      console.error('Error al guardar producto:', error);
      throw error;
    }
  },

  updateProduct: async (product) => {
    try {
      const current = await storageService.getProducts();
      const updated = current.map(p => (p.id === product.id ? { ...product, updatedAt: new Date().toISOString() } : p));
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));
      return product;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const current = await storageService.getProducts();
      const updated = current.filter(p => p.id !== id);
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  },

  // ==========================================
  // INSUMOS & MATERIALES DE PRODUCCIÓN
  // ==========================================
  getSupplies: async () => {
    try {
      const data = localStorage.getItem(KEYS.SUPPLIES);
      if (!data) {
        localStorage.setItem(KEYS.SUPPLIES, JSON.stringify(INITIAL_SUPPLIES));
        return INITIAL_SUPPLIES;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al obtener insumos:', error);
      return INITIAL_SUPPLIES;
    }
  },

  saveSupply: async (supplyData) => {
    try {
      const current = await storageService.getSupplies();
      const newSupply = {
        ...supplyData,
        id: supplyData.id || `sup-${Date.now()}`
      };
      const updated = [...current, newSupply];
      localStorage.setItem(KEYS.SUPPLIES, JSON.stringify(updated));
      return newSupply;
    } catch (error) {
      console.error('Error al guardar insumo:', error);
      throw error;
    }
  },

  updateSupply: async (supply) => {
    try {
      const current = await storageService.getSupplies();
      const updated = current.map(s => (s.id === supply.id ? supply : s));
      localStorage.setItem(KEYS.SUPPLIES, JSON.stringify(updated));
      return supply;
    } catch (error) {
      console.error('Error al actualizar insumo:', error);
      throw error;
    }
  },

  deleteSupply: async (id) => {
    try {
      const current = await storageService.getSupplies();
      const updated = current.filter(s => s.id !== id);
      localStorage.setItem(KEYS.SUPPLIES, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error al eliminar insumo:', error);
      throw error;
    }
  },

  // ==========================================
  // TARIFAS DE TALLER (Hora Hombre, Luz, Tinta)
  // ==========================================
  getWorkshopRates: async () => {
    try {
      const data = localStorage.getItem(KEYS.RATES);
      return data ? { ...INITIAL_WORKSHOP_RATES, ...JSON.parse(data) } : INITIAL_WORKSHOP_RATES;
    } catch (error) {
      console.error('Error al obtener tarifas:', error);
      return INITIAL_WORKSHOP_RATES;
    }
  },

  saveWorkshopRates: async (rates) => {
    try {
      localStorage.setItem(KEYS.RATES, JSON.stringify(rates));
      return rates;
    } catch (error) {
      console.error('Error al guardar tarifas:', error);
      throw error;
    }
  },

  // ==========================================
  // PRESUPUESTOS (Cotizaciones)
  // ==========================================
  getQuotes: async () => {
    try {
      const data = localStorage.getItem(KEYS.QUOTES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al obtener presupuestos:', error);
      return [];
    }
  },

  saveQuote: async (quoteData) => {
    try {
      const current = await storageService.getQuotes();
      const quoteNumber = current.length + 1;
      const formattedCode = `COT-${String(quoteNumber).padStart(4, '0')}`;
      
      const newQuote = {
        ...quoteData,
        id: quoteData.id || `quote-${Date.now()}`,
        code: quoteData.code || formattedCode,
        createdAt: quoteData.createdAt || new Date().toISOString(),
        status: quoteData.status || 'Pendiente'
      };
      
      const updated = [newQuote, ...current];
      localStorage.setItem(KEYS.QUOTES, JSON.stringify(updated));
      return newQuote;
    } catch (error) {
      console.error('Error al guardar presupuesto:', error);
      throw error;
    }
  },

  updateQuoteStatus: async (id, newStatus) => {
    try {
      const current = await storageService.getQuotes();
      const updated = current.map(q => (q.id === id ? { ...q, status: newStatus, updatedAt: new Date().toISOString() } : q));
      localStorage.setItem(KEYS.QUOTES, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }
  },

  deleteQuote: async (id) => {
    try {
      const current = await storageService.getQuotes();
      const updated = current.filter(q => q.id !== id);
      localStorage.setItem(KEYS.QUOTES, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error al eliminar presupuesto:', error);
      throw error;
    }
  },

  // ==========================================
  // PERFIL DEL EMPRENDIMIENTO (Configuración)
  // ==========================================
  getBusinessInfo: async () => {
    try {
      const data = localStorage.getItem(KEYS.BUSINESS);
      return data ? { ...DEFAULT_BUSINESS_INFO, ...JSON.parse(data) } : DEFAULT_BUSINESS_INFO;
    } catch (error) {
      console.error('Error al obtener info de negocio:', error);
      return DEFAULT_BUSINESS_INFO;
    }
  },

  saveBusinessInfo: async (info) => {
    try {
      localStorage.setItem(KEYS.BUSINESS, JSON.stringify(info));
      return info;
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      throw error;
    }
  },

  // ==========================================
  // COPIAS DE SEGURIDAD (Backup & Restauración)
  // ==========================================
  exportAllData: async () => {
    const products = await storageService.getProducts();
    const quotes = await storageService.getQuotes();
    const business = await storageService.getBusinessInfo();
    const supplies = await storageService.getSupplies();
    const rates = await storageService.getWorkshopRates();
    return {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      products,
      quotes,
      business,
      supplies,
      rates
    };
  },

  importAllData: async (importedData) => {
    if (!importedData || typeof importedData !== 'object') {
      throw new Error('Archivo de respaldo no válido.');
    }
    if (importedData.products && Array.isArray(importedData.products)) {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(importedData.products));
    }
    if (importedData.quotes && Array.isArray(importedData.quotes)) {
      localStorage.setItem(KEYS.QUOTES, JSON.stringify(importedData.quotes));
    }
    if (importedData.business && typeof importedData.business === 'object') {
      localStorage.setItem(KEYS.BUSINESS, JSON.stringify(importedData.business));
    }
    if (importedData.supplies && Array.isArray(importedData.supplies)) {
      localStorage.setItem(KEYS.SUPPLIES, JSON.stringify(importedData.supplies));
    }
    if (importedData.rates && typeof importedData.rates === 'object') {
      localStorage.setItem(KEYS.RATES, JSON.stringify(importedData.rates));
    }
    return true;
  }
};
