import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { ProductList } from './components/products/ProductList';
import { ProductModal } from './components/products/ProductModal';
import { QuoteBuilder } from './components/quotes/QuoteBuilder';
import { QuoteHistory } from './components/history/QuoteHistory';
import { ManufacturingCalculator } from './components/manufacturing/ManufacturingCalculator';
import { BusinessSettingsModal } from './components/settings/BusinessSettingsModal';
import { ConfirmModal } from './components/common/ConfirmModal';
import { Toast } from './components/common/Toast';
import { storageService } from './services/storageService';

export function App() {
  const [activeTab, setActiveTab] = useState('manufacturing'); // Defaults to 'manufacturing' for quick costing!
  const [products, setProducts] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [workshopRates, setWorkshopRates] = useState({ hourlyRate: 6000, inkCostPerA4: 180, powerMachineCostPerA4: 90 });
  const [businessInfo, setBusinessInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active Quote in progress for the client
  const [quoteState, setQuoteState] = useState({
    clientName: '',
    clientContact: '',
    validUntil: '',
    notes: '',
    items: [],
    discount: { type: 'percentage', value: 0 },
    surcharge: { type: 'percentage', value: 0 }
  });

  // Modals & Dialogs
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Confirmation modal
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    danger: true
  });

  // Toasts
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 3500);
  }, []);

  // Initial load
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [storedProducts, storedQuotes, storedBiz, storedSupplies, storedRates] = await Promise.all([
        storageService.getProducts(),
        storageService.getQuotes(),
        storageService.getBusinessInfo(),
        storageService.getSupplies(),
        storageService.getWorkshopRates()
      ]);

      setProducts(storedProducts);
      setQuotes(storedQuotes);
      setBusinessInfo(storedBiz);
      setSupplies(storedSupplies);
      setWorkshopRates(storedRates);

      // Initialize default valid date for quote
      const defaultDays = storedBiz?.defaultValidityDays || 15;
      const validDate = new Date();
      validDate.setDate(validDate.getDate() + defaultDays);

      setQuoteState(prev => ({
        ...prev,
        validUntil: prev.validUntil || validDate.toISOString().split('T')[0],
        notes: prev.notes || storedBiz?.defaultNotes || ''
      }));
    } catch (err) {
      console.error('Error al inicializar datos:', err);
      showToast('Error al cargar datos locales', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // ==========================================
  // HANDLERS: COSTEO DE FABRICACIÓN
  // ==========================================
  const handleSendManufacturingToQuote = (quoteItem) => {
    setQuoteState(prev => ({
      ...prev,
      items: [...prev.items, quoteItem]
    }));
    showToast(`"${quoteItem.name}" añadido al presupuesto del cliente`, 'success');
    setActiveTab('quotes');
  };

  const handleSaveManufacturingToCatalog = async (productData) => {
    try {
      await storageService.saveProduct(productData);
      const updated = await storageService.getProducts();
      setProducts(updated);
      showToast(`"${productData.name}" guardado en el catálogo fijo`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al guardar en catálogo', 'error');
    }
  };

  const handleSaveWorkshopRates = async (newRates) => {
    try {
      await storageService.saveWorkshopRates(newRates);
      setWorkshopRates(newRates);
      showToast('Tarifas base del taller actualizadas', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al guardar tarifas', 'error');
    }
  };

  // ==========================================
  // HANDLERS: PRODUCTOS
  // ==========================================
  const handleOpenAddProduct = () => {
    setProductToEdit(null);
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setProductToEdit(prod);
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    try {
      if (productToEdit) {
        await storageService.updateProduct({ ...productToEdit, ...formData });
        showToast('Producto actualizado exitosamente', 'success');
      } else {
        await storageService.saveProduct(formData);
        showToast('Producto agregado al catálogo', 'success');
      }
      const updated = await storageService.getProducts();
      setProducts(updated);
      setProductModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Error al guardar el producto', 'error');
    }
  };

  const handleDeleteProduct = (prod) => {
    setConfirmState({
      isOpen: true,
      title: '¿Eliminar producto?',
      message: `Se eliminará "${prod.name}" del catálogo.`,
      danger: true,
      onConfirm: async () => {
        try {
          await storageService.deleteProduct(prod.id);
          const updated = await storageService.getProducts();
          setProducts(updated);
          showToast('Producto eliminado', 'info');
        } catch (err) {
          console.error(err);
          showToast('No se pudo eliminar el producto', 'error');
        } finally {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleQuickAddToQuote = (prod) => {
    const existingIndex = quoteState.items.findIndex(item => item.productId === prod.id);
    if (existingIndex >= 0) {
      const updated = [...quoteState.items];
      updated[existingIndex].quantity = (Number(updated[existingIndex].quantity) || 1) + 1;
      setQuoteState(prev => ({ ...prev, items: updated }));
    } else {
      const newItem = {
        id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: prod.id,
        name: prod.name,
        category: prod.category,
        cost: Number(prod.cost) || 0,
        price: Number(prod.price) || 0,
        quantity: 1,
        notes: ''
      };
      setQuoteState(prev => ({ ...prev, items: [...prev.items, newItem] }));
    }
    showToast(`"${prod.name}" añadido al cotizador`, 'success');
    setActiveTab('quotes');
  };

  // ==========================================
  // HANDLERS: COTIZADOR & HISTORIAL
  // ==========================================
  const handleSaveQuote = async (fullQuote) => {
    try {
      const saved = await storageService.saveQuote(fullQuote);
      const updatedQuotes = await storageService.getQuotes();
      setQuotes(updatedQuotes);
      showToast(`Presupuesto #${saved.code} guardado con éxito`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al guardar el presupuesto', 'error');
    }
  };

  const handleUpdateQuoteStatus = async (id, newStatus) => {
    try {
      await storageService.updateQuoteStatus(id, newStatus);
      const updated = await storageService.getQuotes();
      setQuotes(updated);
      showToast(`Estado actualizado a: ${newStatus}`, 'info');
    } catch (err) {
      console.error(err);
      showToast('Error al actualizar estado', 'error');
    }
  };

  const handleDeleteQuote = (quote) => {
    setConfirmState({
      isOpen: true,
      title: '¿Eliminar presupuesto del historial?',
      message: `Se eliminará el presupuesto #${quote.code} de ${quote.clientName || 'Cliente'}.`,
      danger: true,
      onConfirm: async () => {
        try {
          await storageService.deleteQuote(quote.id);
          const updated = await storageService.getQuotes();
          setQuotes(updated);
          showToast('Presupuesto eliminado del historial', 'info');
        } catch (err) {
          console.error(err);
          showToast('Error al eliminar presupuesto', 'error');
        } finally {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleLoadQuoteIntoBuilder = (quote) => {
    setQuoteState({
      clientName: quote.clientName || '',
      clientContact: quote.clientContact || '',
      validUntil: quote.validUntil || '',
      notes: quote.notes || '',
      items: quote.items || [],
      discount: quote.discount || { type: 'percentage', value: 0 },
      surcharge: quote.surcharge || { type: 'percentage', value: 0 }
    });
    setActiveTab('quotes');
    showToast(`Presupuesto #${quote.code} cargado en el cotizador`, 'info');
  };

  // ==========================================
  // HANDLERS: CONFIGURACIÓN
  // ==========================================
  const handleSaveBusinessInfo = async (newInfo) => {
    try {
      await storageService.saveBusinessInfo(newInfo);
      setBusinessInfo(newInfo);
      showToast('Configuración de Tiker actualizada', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al guardar configuración', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-300">Cargando Taller Tiker...</p>
        </div>
      </div>
    );
  }

  const symbol = businessInfo?.currencySymbol || '$';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navbar Superior */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        productCount={products.length}
        quoteItemsCount={quoteState.items.length}
        historyCount={quotes.length}
        businessInfo={businessInfo}
        onOpenSettings={() => setSettingsModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Pestaña: Costos de productos (Taller Interno) */}
        {activeTab === 'manufacturing' && (
          <ManufacturingCalculator
            supplies={supplies}
            products={products}
            workshopRates={workshopRates}
            onSaveRates={handleSaveWorkshopRates}
            onSendToQuote={handleSendManufacturingToQuote}
            onSaveToProducts={handleSaveManufacturingToCatalog}
            currencySymbol={symbol}
          />
        )}

        {/* Pestaña: Cotizador para Cliente (WhatsApp & PDF) */}
        {activeTab === 'quotes' && (
          <QuoteBuilder
            products={products}
            quoteState={quoteState}
            setQuoteState={setQuoteState}
            onSaveQuote={handleSaveQuote}
            businessInfo={businessInfo}
            onNavigateToProducts={() => setActiveTab('products')}
            onShowToast={showToast}
          />
        )}

        {/* Pestaña: Catálogo de Productos */}
        {activeTab === 'products' && (
          <ProductList
            products={products}
            onAddProduct={handleOpenAddProduct}
            onEditProduct={handleOpenEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onQuickAddToQuote={handleQuickAddToQuote}
            currencySymbol={symbol}
          />
        )}

        {/* Pestaña: Historial */}
        {activeTab === 'history' && (
          <QuoteHistory
            quotes={quotes}
            onDeleteQuote={handleDeleteQuote}
            onUpdateQuoteStatus={handleUpdateQuoteStatus}
            onLoadQuoteIntoBuilder={handleLoadQuoteIntoBuilder}
            businessInfo={businessInfo}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Modales */}
      <ProductModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        currencySymbol={symbol}
      />

      <BusinessSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        businessInfo={businessInfo}
        onSaveBusinessInfo={handleSaveBusinessInfo}
        onDataReloaded={loadInitialData}
        onShowToast={showToast}
      />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
        danger={confirmState.danger}
      />

      {/* Notificaciones Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
export default App;
