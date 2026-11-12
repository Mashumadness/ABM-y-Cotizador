import React, { useState, useEffect } from 'react';
import { X, Layers, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { calculateUnitCost } from '../../utils/costing';

export const SupplyModal = ({ isOpen, onClose, onSave, supplyToEdit, currencySymbol = '$' }) => {
  const [formData, setFormData] = useState({ name: '', packageQuantity: '', packagePrice: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (supplyToEdit) {
      setFormData({
        name: supplyToEdit.name || '',
        packageQuantity: supplyToEdit.packageQuantity ?? '',
        packagePrice: supplyToEdit.packagePrice ?? ''
      });
    } else {
      setFormData({ name: '', packageQuantity: '', packagePrice: '' });
    }
    setErrors({});
  }, [supplyToEdit, isOpen]);

  if (!isOpen) return null;

  const unitCost = calculateUnitCost(formData.packagePrice, formData.packageQuantity);

  const validate = () => {
    const validationErrors = {};
    if (!formData.name.trim()) validationErrors.name = 'El nombre del insumo es obligatorio.';
    if (formData.packageQuantity === '' || Number(formData.packageQuantity) <= 0) {
      validationErrors.packageQuantity = 'Ingresá una cantidad mayor a 0.';
    }
    if (formData.packagePrice === '' || Number(formData.packagePrice) < 0) {
      validationErrors.packagePrice = 'Ingresá un precio válido.';
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      name: formData.name.trim(),
      packageQuantity: Number(formData.packageQuantity),
      packagePrice: Number(formData.packagePrice),
      unitCost
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {supplyToEdit ? 'Editar Insumo' : 'Nuevo Insumo'}
              </h2>
              <p className="text-xs text-slate-500">
                Cargá el precio del paquete y se calcula el valor de cada unidad
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
              Nombre del Insumo *
            </label>
            <input
              type="text"
              autoFocus
              placeholder="Ej. Resma papel autoadhesivo A4"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                errors.name ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 bg-slate-50/50 hover:bg-white'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Cantidad por paquete */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Cantidad por Paquete *
              </label>
              <input
                type="number"
                step="any"
                min="0"
                placeholder="Ej. 100"
                value={formData.packageQuantity}
                onChange={(e) => setFormData({ ...formData, packageQuantity: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                  errors.packageQuantity ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                }`}
              />
              {errors.packageQuantity && <p className="text-xs text-rose-500 mt-1">{errors.packageQuantity}</p>}
            </div>

            {/* Precio del paquete */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Precio del Paquete *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">{currencySymbol}</span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="Ej. 5000"
                  value={formData.packagePrice}
                  onChange={(e) => setFormData({ ...formData, packagePrice: e.target.value })}
                  className={`w-full pl-7 pr-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                    errors.packagePrice ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.packagePrice && <p className="text-xs text-rose-500 mt-1">{errors.packagePrice}</p>}
            </div>
          </div>

          {/* Valor unitario calculado */}
          <div className="p-3 bg-gradient-to-r from-indigo-50 to-sky-50 rounded-xl border border-indigo-200/60 flex items-center justify-between text-xs">
            <div>
              <span className="text-indigo-900 font-semibold block">Valor Unitario</span>
              <span className="text-slate-500">Precio del paquete ÷ cantidad por paquete</span>
            </div>
            <span className="font-extrabold text-base text-indigo-700">
              {formatCurrency(unitCost, currencySymbol)}
            </span>
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
              <span>{supplyToEdit ? 'Guardar Cambios' : 'Crear Insumo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
