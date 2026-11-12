import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  User, 
  Phone, 
  Calendar, 
  Clock, 
  FileText, 
  DollarSign, 
  Percent, 
  Sparkles, 
  Printer, 
  Share2, 
  RotateCcw, 
  Save, 
  PlusCircle, 
  Package, 
  Tag, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { QuotePreviewModal } from './QuotePreviewModal';

export const QuoteBuilder = ({ 
  products = [], 
  quoteState, 
  setQuoteState, 
  onSaveQuote, 
  businessInfo,
  onNavigateToProducts,
  onShowToast
}) => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [searchProductQuery, setSearchProductQuery] = useState('');
  
  // Custom manual item form
  const [isCustomItemOpen, setIsCustomItemOpen] = useState(false);
  const [customItem, setCustomItem] = useState({ name: '', price: '', quantity: 1, cost: 0, notes: '' });

  const symbol = businessInfo?.currencySymbol || '$';

  // Available products matching search for quick selector
  const matchingProducts = useMemo(() => {
    if (!searchProductQuery.trim()) return products.slice(0, 15);
    const q = searchProductQuery.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.category && p.category.toLowerCase().includes(q))
    );
  }, [products, searchProductQuery]);

  // Add existing product to quote
  const handleAddProduct = (product) => {
    if (!product) return;

    const existingIndex = quoteState.items.findIndex(item => item.productId === product.id);
    if (existingIndex >= 0) {
      // Increase quantity
      const updated = [...quoteState.items];
      updated[existingIndex].quantity = (Number(updated[existingIndex].quantity) || 1) + 1;
      setQuoteState(prev => ({ ...prev, items: updated }));
    } else {
      // Add new line
      const newItem = {
        id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        name: product.name,
        category: product.category,
        cost: Number(product.cost) || 0,
        price: Number(product.price) || 0,
        quantity: 1,
        notes: ''
      };
      setQuoteState(prev => ({ ...prev, items: [...prev.items, newItem] }));
    }

    setSearchProductQuery('');
    setSelectedProductId('');
    if (onShowToast) onShowToast(`Agregado: ${product.name}`, 'info');
  };

  // Add custom manual item
  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (!customItem.name.trim() || Number(customItem.price) < 0) return;

    const newItem = {
      id: `custom-${Date.now()}`,
      productId: null,
      name: customItem.name,
      category: 'A Medida / Especial',
      cost: Number(customItem.cost) || 0,
      price: Number(customItem.price) || 0,
      quantity: Number(customItem.quantity) || 1,
      notes: customItem.notes || ''
    };

    setQuoteState(prev => ({ ...prev, items: [...prev.items, newItem] }));
    setCustomItem({ name: '', price: '', quantity: 1, cost: 0, notes: '' });
    setIsCustomItemOpen(false);
  };

  // Update item field
  const handleUpdateItem = (index, field, value) => {
    const updated = [...quoteState.items];
    updated[index] = { ...updated[index], [field]: value };
    setQuoteState(prev => ({ ...prev, items: updated }));
  };

  // Remove item
  const handleRemoveItem = (index) => {
    const updated = quoteState.items.filter((_, idx) => idx !== index);
    setQuoteState(prev => ({ ...prev, items: updated }));
  };

  // Reset quote
  const handleResetQuote = () => {
    if (window.confirm('¿Seguro que deseas vaciar este presupuesto y comenzar uno nuevo?')) {
      const defaultDays = businessInfo?.defaultValidityDays || 15;
      const validDate = new Date();
      validDate.setDate(validDate.getDate() + defaultDays);

      setQuoteState({
        clientName: '',
        clientContact: '',
        validUntil: validDate.toISOString().split('T')[0],
        notes: businessInfo?.defaultNotes || '',
        items: [],
        discount: { type: 'percentage', value: 0 },
        surcharge: { type: 'percentage', value: 0 }
      });
    }
  };

  // Calculations
  const calculations = useMemo(() => {
    let subtotal = 0;
    let totalCost = 0;

    quoteState.items.forEach(item => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      const cost = Number(item.cost) || 0;
      subtotal += price * qty;
      totalCost += cost * qty;
    });

    // Discount
    let discountAmount = 0;
    const discVal = Number(quoteState.discount?.value) || 0;
    if (discVal > 0) {
      if (quoteState.discount.type === 'percentage') {
        discountAmount = (subtotal * discVal) / 100;
      } else {
        discountAmount = discVal;
      }
    }

    // Surcharge / Shipping
    let surchargeAmount = 0;
    const surVal = Number(quoteState.surcharge?.value) || 0;
    if (surVal > 0) {
      if (quoteState.surcharge.type === 'percentage') {
        surchargeAmount = (subtotal * surVal) / 100;
      } else {
        surchargeAmount = surVal;
      }
    }

    const total = Math.max(0, subtotal - discountAmount + surchargeAmount);
    const estimatedProfit = total - totalCost;

    return {
      subtotal,
      totalCost,
      discountAmount,
      surchargeAmount,
      total,
      estimatedProfit
    };
  }, [quoteState.items, quoteState.discount, quoteState.surcharge]);

  // Prepared full quote object for saving / preview
  const currentFullQuote = useMemo(() => {
    return {
      ...quoteState,
      subtotal: calculations.subtotal,
      totalCost: calculations.totalCost,
      discount: {
        ...quoteState.discount,
        amount: calculations.discountAmount
      },
      surcharge: {
        ...quoteState.surcharge,
        amount: calculations.surchargeAmount
      },
      total: calculations.total,
      estimatedProfit: calculations.estimatedProfit
    };
  }, [quoteState, calculations]);

  const handleOpenPreview = () => {
    if (quoteState.items.length === 0) {
      alert('Agrega al menos un producto al presupuesto antes de generarlo.');
      return;
    }
    setShowPreviewModal(true);
  };

  const handleSaveToHistory = () => {
    if (quoteState.items.length === 0) {
      alert('Agrega productos antes de guardar.');
      return;
    }
    onSaveQuote(currentFullQuote);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600">
            Cotizador Interactivo
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-0.5">
            Armar Presupuesto para Cliente
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Selecciona productos de tu catálogo, ajusta cantidades, añade descuentos y genera una cotización lista para enviar por WhatsApp o imprimir.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <button
            onClick={handleResetQuote}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200 flex items-center gap-1.5"
            title="Vaciar presupuesto actual"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar</span>
          </button>

          <button
            onClick={handleSaveToHistory}
            disabled={quoteState.items.length === 0}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Guardar</span>
          </button>

          <button
            onClick={handleOpenPreview}
            disabled={quoteState.items.length === 0}
            className="px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/20 active:scale-95 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Generar / Imprimir</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col (2/3): Products Selector & Lines */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selector de Productos */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Package className="w-4 h-4 text-brand-600" />
                <span>Agregar Productos al Presupuesto</span>
              </h3>

              <button
                type="button"
                onClick={() => setIsCustomItemOpen(!isCustomItemOpen)}
                className="text-xs text-brand-600 hover:text-brand-700 font-semibold underline flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{isCustomItemOpen ? 'Cerrar ítem personalizado' : '+ Ítem a medida / servicio'}</span>
              </button>
            </div>

            {/* Custom Item Form Dropdown */}
            {isCustomItemOpen && (
              <form onSubmit={handleAddCustomItem} className="p-4 bg-brand-50/50 rounded-2xl border border-brand-200/60 space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-brand-900">
                  Agregar producto personalizado o trabajo especial:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Nombre del trabajo (ej. Grabado láser en tapa)"
                      value={customItem.name}
                      onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      placeholder={`Precio venta (${symbol})`}
                      value={customItem.price}
                      onChange={(e) => setCustomItem({ ...customItem, price: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <input
                      type="number"
                      min="1"
                      placeholder="Cantidad"
                      value={customItem.quantity}
                      onChange={(e) => setCustomItem({ ...customItem, quantity: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Detalles / notas de fabricación (opcional)"
                      value={customItem.notes}
                      onChange={(e) => setCustomItem({ ...customItem, notes: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCustomItemOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold"
                  >
                    Agregar al Presupuesto
                  </button>
                </div>
              </form>
            )}

            {/* Quick search & select from existing inventory */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar en el catálogo de papelería para agregar (ej. Cuaderno, Plancha, Memo)..."
                  value={searchProductQuery}
                  onChange={(e) => setSearchProductQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              {/* Horizontal / Grid of quick items */}
              {matchingProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                  {matchingProducts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleAddProduct(p)}
                      className="p-2.5 rounded-xl border border-slate-200/80 hover:border-brand-300 hover:bg-brand-50/40 text-left transition-all flex items-start justify-between gap-2 group"
                    >
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-bold text-brand-600 uppercase block truncate">
                          {p.category}
                        </span>
                        <span className="text-xs font-bold text-slate-800 block truncate group-hover:text-brand-600">
                          {p.name}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {formatCurrency(p.price, symbol)}
                        </span>
                      </div>
                      <Plus className="w-4 h-4 text-slate-400 group-hover:text-brand-600 shrink-0 mt-1" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-2">
                  No se encontraron productos coincidentes en el inventario.
                </p>
              )}
            </div>
          </div>

          {/* Listado de ítems en el Presupuesto Actual */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>Líneas del Presupuesto</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-700">
                  {quoteState.items.length} ítems
                </span>
              </h3>
            </div>

            {quoteState.items.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                  <Package className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700">El presupuesto aún no tiene productos</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Selecciona productos del buscador superior o pulsa "+ Ítem a medida".
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {quoteState.items.map((item, index) => {
                  const itemPrice = Number(item.price) || 0;
                  const itemQty = Number(item.quantity) || 1;
                  const rowSubtotal = itemPrice * itemQty;

                  return (
                    <div key={item.id || index} className="p-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Title & Notes */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                            <span className="text-sm font-bold text-slate-800">{item.name}</span>
                          </div>
                          
                          {/* Item Custom Notes */}
                          <input
                            type="text"
                            placeholder="Detalle especial (ej. Tapa lila, hojas rayadas, nombre Sofia)..."
                            value={item.notes || ''}
                            onChange={(e) => handleUpdateItem(index, 'notes', e.target.value)}
                            className="mt-1 w-full text-xs text-slate-600 bg-transparent placeholder:text-slate-400 border-b border-transparent hover:border-slate-300 focus:border-brand-500 focus:outline-none py-0.5 transition-colors"
                          />
                        </div>

                        {/* Quantity, Price & Subtotal */}
                        <div className="flex items-center gap-3">
                          {/* Cantidad */}
                          <div className="w-20">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase">
                              Cantidad
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)}
                              className="w-full px-2 py-1 text-xs font-bold border border-slate-200 rounded-lg text-center focus:ring-2 focus:ring-brand-400 focus:outline-none"
                            />
                          </div>

                          {/* Precio unitario */}
                          <div className="w-24">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase">
                              P. Unitario
                            </label>
                            <input
                              type="number"
                              step="any"
                              min="0"
                              value={item.price}
                              onChange={(e) => handleUpdateItem(index, 'price', e.target.value)}
                              className="w-full px-2 py-1 text-xs font-bold border border-slate-200 rounded-lg text-right focus:ring-2 focus:ring-brand-400 focus:outline-none"
                            />
                          </div>

                          {/* Total de fila */}
                          <div className="w-24 text-right">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase">
                              Subtotal
                            </label>
                            <span className="text-xs font-extrabold text-slate-800 block py-1">
                              {formatCurrency(rowSubtotal, symbol)}
                            </span>
                          </div>

                          {/* Eliminar fila */}
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors mt-3"
                            title="Quitar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col (1/3): Client Info, Discounts, Notes & Summary Card */}
        <div className="space-y-6">
          {/* Datos del Cliente */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" />
              <span>Datos del Cliente</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nombre del Cliente / Empresa
              </label>
              <input
                type="text"
                placeholder="Ej. Sofía Martínez, Tienda Flor de Loto"
                value={quoteState.clientName}
                onChange={(e) => setQuoteState({ ...quoteState, clientName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                WhatsApp / Teléfono / Instagram
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Ej. +54 9 11 9876-5432 o @sofia.art"
                  value={quoteState.clientContact}
                  onChange={(e) => setQuoteState({ ...quoteState, clientContact: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Fecha de Validez del Presupuesto
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  value={quoteState.validUntil || ''}
                  onChange={(e) => setQuoteState({ ...quoteState, validUntil: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
            </div>
          </div>

          {/* Ajustes: Descuento & Recargo */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-brand-600" />
              <span>Descuentos y Recargos</span>
            </h3>

            {/* Descuento */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600">
                Descuento Opcional
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={quoteState.discount?.value || ''}
                  onChange={(e) => setQuoteState({
                    ...quoteState,
                    discount: { ...quoteState.discount, value: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-400"
                />
                <select
                  value={quoteState.discount?.type || 'percentage'}
                  onChange={(e) => setQuoteState({
                    ...quoteState,
                    discount: { ...quoteState.discount, type: e.target.value }
                  })}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold"
                >
                  <option value="percentage">%</option>
                  <option value="fixed">{symbol}</option>
                </select>
              </div>
            </div>

            {/* Recargo / Costo de Envío */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600">
                Recargo o Envío
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={quoteState.surcharge?.value || ''}
                  onChange={(e) => setQuoteState({
                    ...quoteState,
                    surcharge: { ...quoteState.surcharge, value: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-400"
                />
                <select
                  value={quoteState.surcharge?.type || 'percentage'}
                  onChange={(e) => setQuoteState({
                    ...quoteState,
                    surcharge: { ...quoteState.surcharge, type: e.target.value }
                  })}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold"
                >
                  <option value="percentage">%</option>
                  <option value="fixed">{symbol}</option>
                </select>
              </div>
            </div>

            {/* Notas / Condiciones del Presupuesto */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Condiciones & Términos
              </label>
              <textarea
                rows="3"
                placeholder="Condiciones de pago, tiempo de entrega, seña requerida..."
                value={quoteState.notes || ''}
                onChange={(e) => setQuoteState({ ...quoteState, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
          </div>

          {/* Resumen Final de Costos & Ganancia */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-brand-300">
              Total del Presupuesto
            </h4>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>Subtotal ({quoteState.items.length} productos):</span>
                <span className="font-semibold text-white">{formatCurrency(calculations.subtotal, symbol)}</span>
              </div>

              {calculations.discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Descuento aplicado:</span>
                  <span>-{formatCurrency(calculations.discountAmount, symbol)}</span>
                </div>
              )}

              {calculations.surchargeAmount > 0 && (
                <div className="flex items-center justify-between text-rose-300">
                  <span>Recargo / Envío:</span>
                  <span>+{formatCurrency(calculations.surchargeAmount, symbol)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
                <span className="text-sm font-bold text-white">TOTAL FINAL:</span>
                <span className="text-2xl font-black text-brand-300">
                  {formatCurrency(calculations.total, symbol)}
                </span>
              </div>
            </div>

            {/* Margen de ganancia calculado para el emprendedor */}
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-medium">Ganancia Taller:</span>
              </div>
              <span className="font-bold text-emerald-400">
                +{formatCurrency(calculations.estimatedProfit, symbol)}
              </span>
            </div>

            {/* Botón Principal Generar */}
            <button
              onClick={handleOpenPreview}
              disabled={quoteState.items.length === 0}
              className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-rose-500 hover:from-brand-600 hover:to-rose-600 disabled:opacity-40 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-5 h-5" />
              <span>Generar / Enviar Cotización</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Vista Previa */}
      <QuotePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        quote={currentFullQuote}
        businessInfo={businessInfo}
        onSaveToHistory={() => {
          onSaveQuote(currentFullQuote);
          setShowPreviewModal(false);
        }}
      />
    </div>
  );
};
