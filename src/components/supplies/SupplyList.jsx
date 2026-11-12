import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit3, Trash2, Layers, ArrowUpDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { productUsesSupply } from '../../utils/costing';

export const SupplyList = ({
  supplies = [],
  products = [],
  onAddSupply,
  onEditSupply,
  onDeleteSupply,
  currencySymbol = '$'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');

  const filteredSupplies = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return supplies
      .filter(supply => supply.name.toLowerCase().includes(query))
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'unit-desc') return (Number(b.unitCost) || 0) - (Number(a.unitCost) || 0);
        if (sortBy === 'unit-asc') return (Number(a.unitCost) || 0) - (Number(b.unitCost) || 0);
        return 0;
      });
  }, [supplies, searchTerm, sortBy]);

  const countProductsUsing = (supplyId) => products.filter(p => productUsesSupply(p, supplyId)).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/10">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-100">Módulo ABM</span>
          <h2 className="text-2xl font-black tracking-tight mt-0.5">ABM Insumos</h2>
          <p className="text-sm text-indigo-100/90 mt-1 max-w-xl">
            Cargá los materiales que comprás (resmas, vinilos, films). Los productos se arman con estos insumos y su costo se actualiza solo cuando cambia un precio.
          </p>
        </div>
        <button
          onClick={onAddSupply}
          className="px-5 py-3 bg-white text-indigo-700 hover:bg-indigo-50 font-bold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Nuevo Insumo</span>
        </button>
      </div>

      {/* Search & Sort */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar insumo por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-slate-50/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <option value="name-asc">Nombre (A-Z)</option>
            <option value="name-desc">Nombre (Z-A)</option>
            <option value="unit-desc">Mayor Valor Unitario</option>
            <option value="unit-asc">Menor Valor Unitario</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredSupplies.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No se encontraron insumos</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchTerm ? 'Probá con otra búsqueda.' : 'Empezá cargando tu primer insumo.'}
          </p>
          {!searchTerm && (
            <button
              onClick={onAddSupply}
              className="mt-4 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              + Agregar primer insumo
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="text-left font-bold px-4 py-3">Nombre del Insumo</th>
                <th className="text-right font-bold px-4 py-3">Cant. por Paquete</th>
                <th className="text-right font-bold px-4 py-3">Precio Paquete</th>
                <th className="text-right font-bold px-4 py-3">Valor Unitario</th>
                <th className="text-center font-bold px-4 py-3">Usado en</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSupplies.map(supply => {
                const usageCount = countProductsUsing(supply.id);
                return (
                  <tr key={supply.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-semibold text-slate-800">{supply.name}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{supply.packageQuantity}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{formatCurrency(supply.packagePrice, currencySymbol)}</td>
                    <td className="px-4 py-3 text-right font-extrabold text-indigo-700">{formatCurrency(supply.unitCost, currencySymbol)}</td>
                    <td className="px-4 py-3 text-center text-xs text-slate-500">
                      {usageCount > 0 ? `${usageCount} producto${usageCount > 1 ? 's' : ''}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditSupply(supply)}
                          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                          title="Editar insumo"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteSupply(supply)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Eliminar insumo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
