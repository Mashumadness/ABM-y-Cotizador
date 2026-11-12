import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  PlusCircle, 
  Check, 
  AlertTriangle,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const ProductList = ({ 
  products = [], 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct, 
  onQuickAddToQuote,
  currencySymbol = '$' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('name-asc'); // 'name-asc', 'price-desc', 'price-asc', 'stock-asc', 'profit-desc'

  // Extract unique categories from current products
  const availableCategories = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(set).sort();
  }, [products]);

  // Inventory stats
  const stats = useMemo(() => {
    let totalStock = 0;
    let inventoryCost = 0;
    let inventoryValue = 0;

    products.forEach(p => {
      const stock = Number(p.stock) || 0;
      const cost = Number(p.cost) || 0;
      const price = Number(p.price) || 0;

      totalStock += stock;
      inventoryCost += cost * stock;
      inventoryValue += price * stock;
    });

    return {
      totalProducts: products.length,
      totalStock,
      inventoryCost,
      inventoryValue,
      potentialProfit: inventoryValue - inventoryCost
    };
  }, [products]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'price-desc') return (Number(b.price) || 0) - (Number(a.price) || 0);
        if (sortBy === 'price-asc') return (Number(a.price) || 0) - (Number(b.price) || 0);
        if (sortBy === 'stock-asc') return (Number(a.stock) || 0) - (Number(b.stock) || 0);
        if (sortBy === 'stock-desc') return (Number(b.stock) || 0) - (Number(a.stock) || 0);
        if (sortBy === 'profit-desc') {
          const profitA = (Number(a.price) || 0) - (Number(a.cost) || 0);
          const profitB = (Number(b.price) || 0) - (Number(b.cost) || 0);
          return profitB - profitA;
        }
        return 0;
      });
  }, [products, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & Quick Metrics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-600 via-rose-600 to-pink-600 rounded-3xl p-6 text-white shadow-lg shadow-brand-500/10">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-brand-100">Módulo ABM</span>
          <h2 className="text-2xl font-black tracking-tight mt-0.5">ABM Productos</h2>
          <p className="text-sm text-brand-100/90 mt-1 max-w-xl">
            Gestiona, crea y edita tus productos de stickers, imanes y papelería para cotizar rápido con tus clientes.
          </p>
        </div>
        <button
          onClick={onAddProduct}
          className="px-5 py-3 bg-white text-brand-700 hover:bg-brand-50 font-bold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Artículos Únicos</span>
            <span className="text-xl font-bold text-slate-800">{stats.totalProducts}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Stock Total Unidades</span>
            <span className="text-xl font-bold text-slate-800">{stats.totalStock}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block" title="Costo total acumulado de materiales">Costo de Insumos</span>
            <span className="text-lg font-bold text-slate-800">{formatCurrency(stats.inventoryCost, currencySymbol)}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block" title="Valor proyectado a precio de venta">Valuación en Venta</span>
            <span className="text-lg font-bold text-emerald-700">{formatCurrency(stats.inventoryValue, currencySymbol)}</span>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por nombre, descripción o categoría (ej. Cuaderno, Holográfico)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-slate-50/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="name-asc">Nombre (A-Z)</option>
              <option value="name-desc">Nombre (Z-A)</option>
              <option value="price-desc">Mayor Precio</option>
              <option value="price-asc">Menor Precio</option>
              <option value="profit-desc">Mayor Ganancia Unitaria</option>
              <option value="stock-asc">Menor Stock (Reponer)</option>
              <option value="stock-desc">Mayor Stock</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas ({products.length})
          </button>
          {availableCategories.map((cat) => {
            const count = products.filter(p => p.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No se encontraron productos</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== 'ALL'
              ? 'Prueba modificando la búsqueda o quitando los filtros de categoría.'
              : 'Empieza agregando tu primer producto de papelería al catálogo.'}
          </p>
          {(searchTerm || selectedCategory !== 'ALL') ? (
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('ALL'); }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-brand-700 bg-brand-50 rounded-xl hover:bg-brand-100 transition-colors"
            >
              Restablecer filtros
            </button>
          ) : (
            <button
              onClick={onAddProduct}
              className="mt-4 px-5 py-2.5 text-xs font-bold text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-colors shadow-sm"
            >
              + Agregar primer producto
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const cost = Number(product.cost) || 0;
            const price = Number(product.price) || 0;
            const profit = price - cost;
            const profitPercent = cost > 0 ? ((profit / cost) * 100).toFixed(0) : 0;
            const stock = Number(product.stock) || 0;

            const isLowStock = stock > 0 && stock <= 5;
            const isOutOfStock = stock === 0;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Top Card Info */}
                <div className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100">
                      <Tag className="w-3 h-3" />
                      {product.category || 'General'}
                    </span>

                    {/* Stock Status Badge */}
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700">
                        Agotado
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        <AlertTriangle className="w-3 h-3" />
                        Poco Stock ({stock})
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-500">
                        Stock: <strong className="text-slate-700">{stock}</strong> un.
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-800 text-base leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Pricing & Profit Grid */}
                <div className="px-5 py-3 bg-slate-50/70 border-t border-b border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-slate-500 font-medium">Costo de Insumos:</span>
                    <span className="font-semibold text-slate-600">{formatCurrency(cost, currencySymbol)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-slate-800 font-bold">Precio de Venta:</span>
                    <span className="font-extrabold text-base text-brand-700">{formatCurrency(price, currencySymbol)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-emerald-700 font-semibold">Ganancia estimada:</span>
                    <span className="text-emerald-700 font-bold">
                      +{formatCurrency(profit, currencySymbol)} <span className="text-[10px] font-normal">({profitPercent}%)</span>
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-3 bg-white flex items-center justify-between gap-2">
                  <button
                    onClick={() => onQuickAddToQuote(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-brand-50 hover:bg-brand-600 hover:text-white text-brand-700 font-bold rounded-xl text-xs transition-all active:scale-95 border border-brand-100"
                    title="Agregar al Cotizador de Presupuestos"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Cotizar</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditProduct(product)}
                      className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                      title="Editar producto"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Eliminar producto"
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
  );
};
