import React, { useState, useEffect } from 'react';
import { X, Package, Layers, Check, Plus, Trash2 } from 'lucide-react';
import { CATEGORIES } from '../../constants/defaultData';
import { formatCurrency } from '../../utils/formatters';
import { calculateMaterialsCost, calculateSuggestedPrice, getMaterialUnitCost } from '../../utils/costing';

const DEFAULT_MARGIN_PERCENT = 150;

export const ProductModal = ({ isOpen, onClose, onSave, productToEdit, supplies = [], currencySymbol = '$' }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    cost: '',
    price: '',
    stock: '',
    description: ''
  });

  // Composición del producto
  const [costMode, setCostMode] = useState('supplies'); // 'supplies' | 'manual'
  const [materials, setMaterials] = useState([]);
  const [extraCosts, setExtraCosts] = useState('');
  const [marginPercent, setMarginPercent] = useState(DEFAULT_MARGIN_PERCENT);

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
      setCostMode(productToEdit.costMode === 'supplies' ? 'supplies' : 'manual');
      setMaterials((productToEdit.materials || []).map(m => ({ ...m })));
      setExtraCosts(productToEdit.extraCosts ? String(productToEdit.extraCosts) : '');
      setMarginPercent(productToEdit.marginPercent ?? DEFAULT_MARGIN_PERCENT);
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
      setCostMode('supplies');
      setMaterials([]);
      setExtraCosts('');
      setMarginPercent(DEFAULT_MARGIN_PERCENT);
    }
    setErrors({});
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const isSuppliesMode = costMode === 'supplies';
  const materialsCost = calculateMaterialsCost(materials, supplies);
  const suppliesModeCost = Math.round(materialsCost + (Number(extraCosts) || 0));
  const suppliesModePrice = Math.round(calculateSuggestedPrice(suppliesModeCost, marginPercent));

  const costNum = isSuppliesMode ? suppliesModeCost : Number(formData.cost) || 0;
  const priceNum = isSuppliesMode ? suppliesModePrice : Number(formData.price) || 0;
  const profit = priceNum - costNum;
  const profitPercent = costNum > 0 ? ((profit / costNum) * 100).toFixed(0) : 0;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'El nombre del producto es obligatorio.';
    if (!formData.category.trim()) errs.category = 'Selecciona o escribe una categoría.';
    if (isSuppliesMode) {
      if (!materials.some(m => m.supplyId)) errs.materials = 'Agregá al menos un insumo.';
      if (materials.some(m => !m.supplyId)) errs.materials = 'Elegí el insumo en todas las filas o quitá las vacías.';
      if (Number(marginPercent) < 0) errs.margin = 'El margen no puede ser negativo.';
    } else {
      if (formData.cost === '' || Number(formData.cost) < 0) errs.cost = 'Ingresa un costo de producción válido.';
      if (formData.price === '' || Number(formData.price) < 0) errs.price = 'Ingresa un precio de venta sugerido válido.';
    }
    if (formData.stock !== '' && Number(formData.stock) < 0) errs.stock = 'El stock no puede ser negativo.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const stock = formData.stock !== '' ? Number(formData.stock) : 0;

    if (isSuppliesMode) {
      onSave({
        ...formData,
        costMode: 'supplies',
        materials: materials.map(m => ({
          ...m,
          quantity: Number(m.quantity) || 0,
          unitCost: getMaterialUnitCost(m, supplies)
        })),
        extraCosts: Number(extraCosts) || 0,
        marginPercent: Number(marginPercent) || 0,
        cost: suppliesModeCost,
        price: suppliesModePrice,
        stock
      });
    } else {
      onSave({
        ...formData,
        costMode: 'manual',
        cost: Number(formData.cost) || 0,
        price: Number(formData.price) || 0,
        stock
      });
    }
  };

  const handleAddMaterial = () => {
    setMaterials([...materials, { id: `mat-${Date.now()}`, supplyId: '', name: '', quantity: 1, unitCost: 0 }]);
  };

  const handleChangeMaterialSupply = (index, supplyId) => {
    const supply = supplies.find(s => s.id === supplyId);
    const updated = [...materials];
    updated[index] = {
      ...updated[index],
      supplyId,
      name: supply?.name || '',
      unitCost: Number(supply?.unitCost) || 0
    };
    setMaterials(updated);
  };

  const handleChangeMaterialQuantity = (index, materialQuantity) => {
    const updated = [...materials];
    updated[index] = { ...updated[index], quantity: materialQuantity };
    setMaterials(updated);
  };

  const handleRemoveMaterial = (index) => {
    setMaterials(materials.filter((_, idx) => idx !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] flex flex-col shadow-2xl border border-slate-100">
        {/* Header (fijo) */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 pt-4 sm:pt-5 pb-4 border-b border-slate-100 shrink-0">
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

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Cuerpo (con scroll) */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-5 space-y-4">
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

          {/* Modo de costeo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              ¿Cómo se calcula el costo?
            </label>
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setCostMode('supplies')}
                className={`py-2 rounded-lg transition-all ${isSuppliesMode ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Armar con insumos
              </button>
              <button
                type="button"
                onClick={() => setCostMode('manual')}
                className={`py-2 rounded-lg transition-all ${!isSuppliesMode ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Costo manual
              </button>
            </div>
          </div>

          {isSuppliesMode ? (
            <div className="space-y-3">
              {/* Lista de insumos */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    Insumos del producto
                  </span>
                  <button
                    type="button"
                    onClick={handleAddMaterial}
                    disabled={supplies.length === 0}
                    className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-brand-200/60 disabled:opacity-50"
                  >
                    <Plus className="w-3 h-3" />
                    Agregar insumo
                  </button>
                </div>

                {supplies.length === 0 && (
                  <p className="text-[11px] text-amber-700">Todavía no cargaste insumos. Crealos primero en la pestaña ABM Insumos.</p>
                )}

                {materials.length === 0 && supplies.length > 0 && (
                  <p className="text-[11px] text-slate-500">Agregá los insumos que lleva este producto.</p>
                )}

                {materials.map((material, index) => {
                  const unitCost = getMaterialUnitCost(material, supplies);
                  const supplyMissing = material.supplyId && !supplies.some(s => s.id === material.supplyId);
                  return (
                    <div key={material.id || index} className="flex flex-wrap sm:flex-nowrap items-center gap-2 pb-2 sm:pb-0 border-b sm:border-0 border-slate-200/70 last:border-0">
                      <select
                        value={supplyMissing ? '' : material.supplyId}
                        onChange={(e) => handleChangeMaterialSupply(index, e.target.value)}
                        className="w-full sm:w-auto sm:flex-1 min-w-0 px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-400"
                      >
                        <option value="">{supplyMissing ? `${material.name} (eliminado)` : 'Elegí un insumo...'}</option>
                        {supplies.map(supply => (
                          <option key={supply.id} value={supply.id}>
                            {supply.name} — {formatCurrency(supply.unitCost, currencySymbol)} c/u
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        step="any"
                        min="0"
                        value={material.quantity}
                        onChange={(e) => handleChangeMaterialQuantity(index, e.target.value)}
                        className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-center"
                        title="Cantidad"
                      />
                      <span className="flex-1 sm:flex-none sm:w-20 text-right text-xs font-bold text-slate-700">
                        {formatCurrency((Number(material.quantity) || 0) * unitCost, currencySymbol)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterial(index)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Quitar insumo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}

                <div className="flex justify-end text-xs font-bold text-slate-700 pt-1 border-t border-slate-200/70">
                  Total insumos: <span className="ml-2 text-indigo-700">{formatCurrency(materialsCost, currencySymbol)}</span>
                </div>
                {errors.materials && <p className="text-xs text-rose-500 font-medium">{errors.materials}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Otros costos */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" title="Tinta, luz y mano de obra (se completa al guardar desde Costos de productos)">
                    Otros costos
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">{currencySymbol}</span>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      placeholder="0"
                      value={extraCosts}
                      onChange={(e) => setExtraCosts(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">Tinta, luz, mano de obra</span>
                </div>

                {/* Margen */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Margen (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={marginPercent}
                    onChange={(e) => setMarginPercent(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                      errors.margin ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                    }`}
                  />
                  {errors.margin && <p className="text-xs text-rose-500 mt-1">{errors.margin}</p>}
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

              {/* Costo y venta calculados */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/70">
                  <span className="block font-semibold text-amber-900">Costo</span>
                  <span className="block text-base font-extrabold text-amber-700">{formatCurrency(costNum, currencySymbol)}</span>
                  <span className="text-[10px] text-slate-500">Insumos + otros costos</span>
                </div>
                <div className="p-3 rounded-xl bg-brand-50 border border-brand-200/70">
                  <span className="block font-semibold text-brand-900">Venta sugerida</span>
                  <span className="block text-base font-extrabold text-brand-700">{formatCurrency(priceNum, currencySymbol)}</span>
                  <span className="text-[10px] text-slate-500">Costo + {Number(marginPercent) || 0}% de margen</span>
                </div>
              </div>
            </div>
          ) : (
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
          )}

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
                {profitPercent}% sobre costo
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

          </div>

          {/* Botones (fijos) */}
          <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-4 border-t border-slate-100 shrink-0">
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
