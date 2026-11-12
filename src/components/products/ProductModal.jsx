import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, DollarSign, Package, Tag, Layers, Check } from 'lucide-react';
import { CATEGORIES } from '../../constants/defaultData';
import { formatCurrency } from '../../utils/formatters';

export const ProductModal = ({ isOpen, onClose, onSave, productToEdit, currencySymbol = '$' }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cuadernos',
    cost: '',
    price: '',
    stock: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [customCategory, setCustomCategory] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        category: productToEdit.category || 'Cuadernos',
        cost: productToEdit.cost !== undefined ? productToEdit.cost : '',
        price: productToEdit.price !== undefined ? productToEdit.price : '',
        stock: productToEdit.stock !== undefined ? productToEdit.stock : '',
        description: productToEdit.description || ''
      });
      setCustomCategory(!CATEGORIES.includes(productToEdit.category));
    } else {
      setFormData({
        name: '',
        category: CATEGORIES[0],
        cost: '',
        price: '',
        stock: '10',
        description: ''
      });
      setCustomCategory(false);
    }
    setErrors({});
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const costNum = Number(formData.cost) || 0;
  const priceNum = Number(formData.price) || 0;
  const profit = priceNum - costNum;
  const marginPercent = costNum > 0 ? ((profit / costNum) * 100).toFixed(0) : 0;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'El nombre del producto es obligatorio.';
    if (!formData.category.trim()) errs.category = 'Selecciona o escribe una categoría.';
    if (formData.cost === '' || Number(formData.cost) < 0) errs.cost = 'Ingresa un costo de producción válido.';
    if (formData.price === '' || Number(formData.price) < 0) errs.price = 'Ingresa un precio de venta sugerido válido.';
    if (formData.stock !== '' && Number(formData.stock) < 0) errs.stock = 'El stock no puede ser negativo.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      cost: Number(formData.cost) || 0,
      price: Number(formData.price) || 0,
      stock: formData.stock !== '' ? Number(formData.stock) : 0
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {productToEdit ? 'Editar Producto de Papelería' : 'Nuevo Producto de Papelería'}
              </h2>
              <p className="text-xs text-slate-500">
                {productToEdit ? 'Actualiza los costos, precios o stock' : 'Carga un nuevo ítem a tu catálogo de taller'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nombre del Producto *
            </label>
            <input
              type="text"
              placeholder="Ej. Cuaderno A5 Tapa Dura floreado, Stickers vinilo x20"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                errors.name ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 bg-slate-50/50 hover:bg-white'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>}
          </div>

          {/* Categoría */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Categoría *
              </label>
              <button
                type="button"
                onClick={() => {
                  setCustomCategory(!customCategory);
                  if (customCategory) setFormData({ ...formData, category: CATEGORIES[0] });
                }}
                className="text-xs text-brand-600 hover:text-brand-700 font-semibold underline"
              >
                {customCategory ? 'Elegir de la lista' : '+ Nueva categoría'}
              </button>
            </div>

            {customCategory ? (
              <input
                type="text"
                placeholder="Escribe el nombre de la categoría (ej. Sellos, Cintas)"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            ) : (
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
            {errors.category && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.category}</p>}
          </div>

          {/* Costo, Precio y Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Costo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" title="Materiales e insumos">
                Costo ({currencySymbol}) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">{currencySymbol}</span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0.00"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  className={`w-full pl-7 pr-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                    errors.cost ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.cost && <p className="text-xs text-rose-500 mt-1">{errors.cost}</p>}
            </div>

            {/* Precio Venta */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Venta Sug. ({currencySymbol}) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">{currencySymbol}</span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full pl-7 pr-3 py-2 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                    errors.price ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 text-slate-800'
                  }`}
                />
              </div>
              {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Stock Disp.
              </label>
              <input
                type="number"
                min="0"
                placeholder="Ej. 15"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
          </div>

          {/* Margen Calculado en Vivo */}
          <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/60 flex items-center justify-between text-xs">
            <div>
              <span className="text-emerald-800 font-semibold block">Margen de Ganancia estimado:</span>
              <span className="text-slate-500">Precio de venta menos costo de insumos</span>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-sm text-emerald-700 block">
                +{formatCurrency(profit, currencySymbol)}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${profit > 0 ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'}`}>
                {marginPercent}% sobre costo
              </span>
            </div>
          </div>

          {/* Descripción / Notas de confección */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Detalles / Especificaciones (Opcional)
            </label>
            <textarea
              rows="2"
              placeholder="Ej. Papel Chambril 90g, tapas duras 2mm, anillado ring wire cobre, medidas 15x21cm"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-brand-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{productToEdit ? 'Guardar Cambios' : 'Crear Producto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
