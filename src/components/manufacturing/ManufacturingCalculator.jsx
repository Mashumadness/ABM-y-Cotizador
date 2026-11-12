import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  Layers, 
  Zap, 
  Clock, 
  Sparkles, 
  DollarSign, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Save, 
  Settings2, 
  Check, 
  TrendingUp, 
  Package, 
  Search,
  Info,
  ShieldCheck,
  Tag,
  HelpCircle,
  Edit2,
  X
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const ManufacturingCalculator = ({ 
  supplies = [],
  products = [], 
  workshopRates = { hourlyLaborRate: 6000, hourlyElectricityRate: 1800, inkCostPerSheet: 180 }, 
  onSaveRates, 
  quickTemplates = [],
  onSaveQuickTemplates,
  onSaveNewSupply, 
  onSendToQuote, 
  onSaveToProducts,
  currencySymbol = '$' 
}) => {
  // Product to calculate
  const [productName, setProductName] = useState('Imanes Personalizados Siluetados 5x5cm');
  const [quantity, setQuantity] = useState(100);
  const [marginPercent, setMarginPercent] = useState(150); // 150% ganancia por defecto
  
  // Arma una fila de material a partir de un insumo del ABM (si existe)
  const buildMaterialFromSupply = (rowId, supplyId, materialQuantity) => {
    const supply = supplies.find(s => s.id === supplyId);
    return {
      id: rowId,
      supplyId: supply?.id || '',
      name: supply?.name || '',
      quantity: materialQuantity,
      unitCost: Number(supply?.unitCost) || 0
    };
  };

  // Materials used in this job
  const [jobMaterials, setJobMaterials] = useState(() => [
    buildMaterialFromSupply('1', 'sup-1', 5),
    buildMaterialFromSupply('2', 'sup-3', 5),
    buildMaterialFromSupply('3', 'sup-5', 5),
  ].filter(m => m.supplyId));

  // Operational variables for this specific job
  const [sheetsToPrint, setSheetsToPrint] = useState(5);
  const [inkRatePerSheet, setInkRatePerSheet] = useState(workshopRates?.inkCostPerSheet || 180);
  const [electricityMinutes, setElectricityMinutes] = useState(30);
  const [hourlyElectricityRate, setHourlyElectricityRate] = useState(workshopRates?.hourlyElectricityRate || 1800);
  const [laborMinutes, setLaborMinutes] = useState(45);
  const [hourlyLaborRate, setHourlyLaborRate] = useState(workshopRates?.hourlyLaborRate || 6000);

  // Workshop rates editor toggle & state
  const [isEditingBaseRates, setIsEditingBaseRates] = useState(false);
  const [editBaseRatesData, setEditBaseRatesData] = useState({
    hourlyLaborRate: workshopRates?.hourlyLaborRate || 6000,
    hourlyElectricityRate: workshopRates?.hourlyElectricityRate || 1800,
    inkCostPerSheet: workshopRates?.inkCostPerSheet || 180
  });

  const [ratesSavedNotice, setRatesSavedNotice] = useState(false);
  const [showPresetHelp, setShowPresetHelp] = useState(false);
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [materialSearches, setMaterialSearches] = useState({});

  useEffect(() => {
    if (workshopRates) {
      setEditBaseRatesData({
        hourlyLaborRate: workshopRates.hourlyLaborRate || 6000,
        hourlyElectricityRate: workshopRates.hourlyElectricityRate || 1800,
        inkCostPerSheet: workshopRates.inkCostPerSheet || 180
      });
      setHourlyLaborRate(workshopRates.hourlyLaborRate || 6000);
      setHourlyElectricityRate(workshopRates.hourlyElectricityRate || 1800);
      setInkRatePerSheet(workshopRates.inkCostPerSheet || 180);
    }
  }, [workshopRates]);

  // Save permanent default rates
  const handleSaveDefaultRates = (e) => {
    e.preventDefault();
    if (onSaveRates) {
      const updated = {
        hourlyLaborRate: Number(editBaseRatesData.hourlyLaborRate) || 0,
        hourlyElectricityRate: Number(editBaseRatesData.hourlyElectricityRate) || 0,
        inkCostPerSheet: Number(editBaseRatesData.inkCostPerSheet) || 0
      };
      onSaveRates(updated);
      setHourlyLaborRate(updated.hourlyLaborRate);
      setHourlyElectricityRate(updated.hourlyElectricityRate);
      setInkRatePerSheet(updated.inkCostPerSheet);
      setRatesSavedNotice(true);
      setTimeout(() => {
        setRatesSavedNotice(false);
        setIsEditingBaseRates(false);
      }, 1500);
    }
  };

  // Carga los materiales de una plantilla (solo los insumos que siguen existiendo en el ABM)
  const applyPresetMaterials = (presetRows) => {
    const materials = presetRows
      .map(([supplyId, materialQuantity], index) => buildMaterialFromSupply(`${index + 1}`, supplyId, materialQuantity))
      .filter(m => m.supplyId);
    setJobMaterials(materials);
    setMaterialSearches({});
  };

  // ==========================================
  // PLANTILLAS DE 1 CLIC
  // ==========================================
  const applyPresetTemplate = (template) => {
    setProductName(template.productName);
    setQuantity(template.quantity);
    setSheetsToPrint(template.sheetsToPrint);
    setElectricityMinutes(template.electricityMinutes);
    setLaborMinutes(template.laborMinutes);
    setMarginPercent(template.marginPercent);
    applyPresetMaterials(template.materials || []);
  };

  // Carga un producto del ABM como punto de partida del costeo
  const applyProductTemplate = (product) => {
    const inputs = product.manufacturingInputs || {};
    const productCost = Number(product.cost) || 0;
    const productPrice = Number(product.price) || 0;
    const derivedMargin = productCost > 0 ? Math.round(((productPrice - productCost) / productCost) * 100) : 150;

    setProductName(product.name);
    setQuantity(Math.max(1, Number(product.manufacturingBreakdown?.qty) || 1));
    setSheetsToPrint(Number(inputs.sheetsToPrint) || 0);
    setElectricityMinutes(Number(inputs.electricityMinutes) || 0);
    setLaborMinutes(Number(inputs.laborMinutes) || 0);
    setMarginPercent(product.marginPercent ?? derivedMargin);
    setJobMaterials((product.materials || []).map((material, index) => {
      const supply = supplies.find(s => s.id === material.supplyId);
      return {
        id: `${index + 1}`,
        supplyId: material.supplyId || '',
        name: supply?.name || material.name || '',
        quantity: Number(material.quantity) || 0,
        unitCost: Number(supply?.unitCost ?? material.unitCost) || 0
      };
    }));
    setMaterialSearches({});
  };

  const handleApplyTemplate = (template) => {
    if (template.type === 'product') {
      const product = products.find(p => p.id === template.productId);
      if (product) applyProductTemplate(product);
      return;
    }
    applyPresetTemplate(template);
  };

  const handleRemoveTemplate = (templateId) => {
    onSaveQuickTemplates?.(quickTemplates.filter(t => t.id !== templateId));
  };

  const handleAddProductTemplate = (product) => {
    const newTemplate = {
      id: `tpl-${Date.now()}`,
      type: 'product',
      productId: product.id,
      label: product.name
    };
    onSaveQuickTemplates?.([...quickTemplates, newTemplate]);
    setIsAddingTemplate(false);
    setTemplateSearch('');
  };

  const getTemplateLabel = (template) => {
    if (template.type !== 'product') return template.label;
    return products.find(p => p.id === template.productId)?.name || template.label;
  };

  // Productos del ABM que todavía no son plantilla
  const availableProductsForTemplate = products.filter(product => {
    const alreadyAdded = quickTemplates.some(t => t.type === 'product' && t.productId === product.id);
    const matchesSearch = product.name.toLowerCase().includes(templateSearch.trim().toLowerCase());
    return !alreadyAdded && matchesSearch;
  });

  // Add material row
  const handleAddMaterialRow = () => {
    const id = `mat-${Date.now()}`;
    setJobMaterials([
      ...jobMaterials,
      {
        id,
        supplyId: '',
        name: '',
        quantity: 1,
        unitCost: 0
      }
    ]);
    setMaterialSearches(prev => ({ ...prev, [id]: '' }));
  };

  const handleSelectSupply = (index, supply) => {
    const updated = [...jobMaterials];
    updated[index] = {
      ...updated[index],
      supplyId: supply.id,
      name: supply.name,
      unitCost: Number(supply.unitCost) || 0
    };
    setJobMaterials(updated);
    setMaterialSearches(prev => ({ ...prev, [updated[index].id]: supply.name }));
  };

  const filterSupplies = (query) => {
    const normalizedQuery = (query || '').trim().toLowerCase();
    return supplies.filter(supply => supply.name.toLowerCase().includes(normalizedQuery));
  };

  const handleUpdateMaterialRow = (index, field, value) => {
    const updated = [...jobMaterials];
    if (field === 'supplyId') {
      const selected = supplies.find(s => s.id === value);
      if (selected) {
        updated[index].supplyId = selected.id;
        updated[index].name = selected.name;
        updated[index].unitCost = selected.unitCost;
      }
    } else {
      updated[index][field] = value;
    }
    setJobMaterials(updated);
  };

  const handleRemoveMaterialRow = (index) => {
    const removed = jobMaterials[index];
    setJobMaterials(jobMaterials.filter((_, idx) => idx !== index));
    if (removed?.id) {
      setMaterialSearches(prev => {
        const next = { ...prev };
        delete next[removed.id];
        return next;
      });
    }
  };

  // Live Calculations
  const calculations = useMemo(() => {
    // 1. Insumos
    const materialsCost = jobMaterials.reduce((acc, item) => {
      return acc + (Number(item.quantity) || 0) * (Number(item.unitCost) || 0);
    }, 0);

    // 2. Tintas calculada por cantidad de hojas impresas
    const inkCost = (Number(sheetsToPrint) || 0) * (Number(inkRatePerSheet) || 0);

    // 3. Energía eléctrica calculada por horas/minutos
    const electricityCost = ((Number(electricityMinutes) || 0) / 60) * (Number(hourlyElectricityRate) || 0);

    // 4. Mano de obra calculada por horas/minutos
    const laborMinutesCost = ((Number(laborMinutes) || 0) / 60) * (Number(hourlyLaborRate) || 0);

    // 5. Costo Total de Producción
    const operationalCost = inkCost + electricityCost;
    const totalProductionCost = materialsCost + operationalCost + laborMinutesCost;

    const qty = Math.max(1, Number(quantity) || 1);
    const unitProductionCost = totalProductionCost / qty;

    // 6. Precio de Venta Sugerido (Costo + Margen %)
    const margin = Number(marginPercent) || 0;
    const totalPrice = totalProductionCost * (1 + margin / 100);
    const unitPrice = totalPrice / qty;
    const netProfit = totalPrice - totalProductionCost;

    return {
      materialsCost,
      inkCost,
      electricityCost,
      operationalCost,
      laborMinutesCost,
      totalProductionCost,
      unitProductionCost,
      totalPrice,
      unitPrice,
      netProfit,
      qty
    };
  }, [
    jobMaterials, 
    sheetsToPrint, 
    inkRatePerSheet, 
    electricityMinutes, 
    hourlyElectricityRate, 
    laborMinutes, 
    hourlyLaborRate, 
    marginPercent, 
    quantity
  ]);

  // Action: Send to Customer Quote Builder
  const handleSendToClientQuote = () => {
    const itemForQuote = {
      id: `custom-prod-${Date.now()}`,
      name: productName,
      category: 'Fabricación Especial',
      quantity: calculations.qty,
      price: Math.round(calculations.unitPrice),
      cost: Math.round(calculations.unitProductionCost),
      notes: `Fabricación personalizada: ${jobMaterials.map(m => `${m.name} (${m.quantity} un)`).join(' + ')}.`
    };
    onSendToQuote(itemForQuote);
  };

  // Action: Save as Product in permanent Catalog
  const handleSaveToCatalog = () => {
    const newProduct = {
      name: productName,
      category: productName.toLowerCase().includes('imán') || productName.toLowerCase().includes('iman') 
        ? 'Imanes Personalizados' 
        : 'Stickers Siluetados (Die-Cut)',
      cost: Math.round(calculations.totalProductionCost),
      price: Math.round(calculations.totalPrice),
      stock: 0,
      description: `Pack x${calculations.qty} fabricado con: ${jobMaterials.map(m => m.name).join(', ')}.`,
      // Composición del producto: se recalcula si cambian los valores de los insumos
      costMode: 'supplies',
      materials: jobMaterials
        .filter(m => m.supplyId || m.name)
        .map(({ id, supplyId, name, quantity: materialQuantity, unitCost }) => ({
          id, supplyId, name, quantity: Number(materialQuantity) || 0, unitCost: Number(unitCost) || 0
        })),
      extraCosts: Math.round(calculations.operationalCost + calculations.laborMinutesCost),
      marginPercent: Number(marginPercent) || 0,
      // Datos del trabajo para poder recargarlo como plantilla
      manufacturingInputs: {
        sheetsToPrint: Number(sheetsToPrint) || 0,
        electricityMinutes: Number(electricityMinutes) || 0,
        laborMinutes: Number(laborMinutes) || 0
      },
      manufacturingBreakdown: {
        materialsCost: Math.round(calculations.materialsCost),
        operationalCost: Math.round(calculations.operationalCost),
        laborCost: Math.round(calculations.laborMinutesCost),
        qty: calculations.qty
      }
    };
    onSaveToProducts(newProduct);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Costos de productos
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Calcula el costo sumando insumos, hojas impresas de tinta, energía eléctrica y mano de obra por hora para obtener el precio de venta final.
          </p>
        </div>

        {/* Plantillas rápidas */}
        <div className="flex flex-col items-start md:items-end gap-1.5 self-start md:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-brand-300 font-bold">
            <span>Plantillas de 1 clic:</span>
            <button
              type="button"
              onClick={() => setShowPresetHelp(!showPresetHelp)}
              className="text-slate-400 hover:text-white"
              title="¿Qué son estas plantillas?"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center md:justify-end gap-1.5">
            {quickTemplates.map(template => {
              const isMissingProduct = template.type === 'product' && !products.some(p => p.id === template.productId);
              return (
                <div key={template.id} className="relative group">
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate(template)}
                    disabled={isMissingProduct}
                    title={isMissingProduct ? 'El producto ya no existe en el ABM' : 'Cargar plantilla'}
                    className={`px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold border border-slate-700 transition-colors shadow-xs max-w-[220px] truncate ${
                      isMissingProduct ? 'text-slate-500 line-through cursor-not-allowed' : 'text-brand-200'
                    }`}
                  >
                    {template.type === 'product' && '📦 '}{getTemplateLabel(template)}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveTemplate(template.id)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white items-center justify-center shadow-md hidden group-hover:flex group-focus-within:flex"
                    title="Quitar de la lista"
                    aria-label={`Quitar ${getTemplateLabel(template)}`}
                  >
                    <X className="w-2.5 h-2.5 stroke-[3]" />
                  </button>
                </div>
              );
            })}

            {/* Agregar plantilla desde ABM Productos */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAddingTemplate(!isAddingTemplate)}
                className="px-3 py-1.5 rounded-xl border border-dashed border-brand-400/70 hover:bg-slate-800 text-xs font-bold text-brand-300 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Agregar
              </button>

              {isAddingTemplate && (
                <>
                  {/* Capa para cerrar al hacer clic afuera */}
                  <div className="fixed inset-0 z-30" onClick={() => { setIsAddingTemplate(false); setTemplateSearch(''); }} />
                  <div className="absolute z-40 right-0 mt-2 w-72 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-2">
                    <div className="relative mb-2">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        autoFocus
                        value={templateSearch}
                        onChange={(e) => setTemplateSearch(e.target.value)}
                        placeholder="Buscar en ABM Productos..."
                        className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {availableProductsForTemplate.slice(0, 20).map(product => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => handleAddProductTemplate(product)}
                          className="w-full px-3 py-2 text-left rounded-lg hover:bg-brand-50"
                        >
                          <span className="block text-xs font-semibold text-slate-800">{product.name}</span>
                          <span className="block text-[10px] text-slate-500">
                            {product.category || 'Sin categoría'} · Venta: {formatCurrency(product.price, currencySymbol)}
                          </span>
                        </button>
                      ))}
                      {availableProductsForTemplate.length === 0 && (
                        <p className="px-3 py-3 text-xs text-slate-500">
                          {products.length === 0 ? 'No hay productos en el ABM.' : 'No hay productos para agregar.'}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPresetHelp && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-950 flex items-start justify-between gap-3 animate-in fade-in">
          <div>
            <strong>💡 ¿Cómo funcionan las plantillas de 1 clic?</strong>
            <p className="mt-1">
              Al hacer clic en cualquiera de ellas (ej. <em>Imanes x100</em> o <em>Stickers Die-Cut x100</em>), se cargan automáticamente en el formulario los materiales habituales, la cantidad de hojas y los minutos estimados de taller. Puedes utilizarlas como base y luego modificar cualquier valor.
            </p>
            <p className="mt-1">
              Con <strong>+ Agregar</strong> sumás un producto del ABM Productos como plantilla (carga sus insumos, cantidad y margen). Pasá el mouse sobre una plantilla y tocá la <strong>✕</strong> para quitarla de la lista.
            </p>
          </div>
          <button
            onClick={() => setShowPresetHelp(false)}
            className="text-indigo-400 hover:text-indigo-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Manufacturing Input Formula */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Datos del Producto a Fabricar */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-600" />
              <span>1. Producto a Fabricar</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Descripción del Producto
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-brand-400"
                  placeholder="Ej. Imanes personalizados 5x5 cm con laminado"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Cantidad (Unidades)
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-brand-700 text-center focus:ring-2 focus:ring-brand-400"
                />
              </div>
            </div>
          </div>

          {/* 2. Insumos & Materiales Utilizados */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-600" />
                  <span>2. Insumos y Materiales Utilizados</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Lámina de imán, papel/vinilo autoadhesivo impreso y film laminado.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddMaterialRow}
                className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-brand-200/60"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Agregar Material</span>
              </button>
            </div>

            <div className="space-y-2">
              {jobMaterials.map((mat, index) => {
                const rowTotal = (Number(mat.quantity) || 0) * (Number(mat.unitCost) || 0);

                return (
                  <div key={mat.id || index} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 relative">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={materialSearches[mat.id] ?? mat.name ?? ''}
                          onChange={(e) => setMaterialSearches(prev => ({ ...prev, [mat.id]: e.target.value }))}
                          placeholder="Buscar insumo en ABM de insumos..."
                          className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-400"
                        />
                      </div>
                      {(materialSearches[mat.id] || '').trim().length > 0 && (materialSearches[mat.id] || '').trim().toLowerCase() !== (mat.name || '').trim().toLowerCase() && (
                        <div className="absolute z-20 top-full left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl">
                          {filterSupplies(materialSearches[mat.id]).slice(0, 12).map(supply => (
                            <button
                              key={supply.id}
                              type="button"
                              onClick={() => handleSelectSupply(index, supply)}
                              className="w-full px-3 py-2 text-left hover:bg-brand-50 border-b border-slate-100 last:border-0"
                            >
                              <span className="block text-xs font-semibold text-slate-800">{supply.name}</span>
                              <span className="block text-[10px] text-slate-500">
                                Paquete x{supply.packageQuantity} · Valor unitario: {formatCurrency(supply.unitCost, currencySymbol)}
                              </span>
                            </button>
                          ))}
                          {filterSupplies(materialSearches[mat.id]).length === 0 && (
                            <p className="px-3 py-3 text-xs text-slate-500">No se encontraron insumos en el ABM.</p>
                          )}
                        </div>
                      )}
                      {mat.name && (
                        <p className="text-[10px] text-slate-500 mt-1">
                          Seleccionado: {mat.name} · Costo unitario: {formatCurrency(mat.unitCost, currencySymbol)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-24">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">
                          Cantidad
                        </label>
                        <input
                          type="number"
                          step="any"
                          min="0.1"
                          value={mat.quantity}
                          onChange={(e) => handleUpdateMaterialRow(index, 'quantity', e.target.value)}
                          className="w-full px-2 py-1 text-xs font-bold border border-slate-200 bg-white rounded-lg text-center"
                        />
                      </div>

                      <div className="w-24 text-right">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">
                          Subtotal
                        </label>
                        <span className="text-xs font-bold text-slate-800 block py-1">
                          {formatCurrency(rowTotal, currencySymbol)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveMaterialRow(index)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors mt-2"
                        title="Quitar material"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 text-xs font-bold text-slate-700">
              Total Insumos: <span className="ml-2 text-brand-700 font-extrabold">{formatCurrency(calculations.materialsCost, currencySymbol)}</span>
            </div>
          </div>

          {/* 3. Operación de Máquinas, Tinta & Mano de Obra */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-600" />
                  <span>3. Operación de Máquinas, Tinta & Mano de Obra</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calcula la energía y mano de obra a partir del valor por hora y los minutos que lleva el trabajo.
                </p>
              </div>

              {/* Botón para editar tarifas base */}
              <button
                type="button"
                onClick={() => setIsEditingBaseRates(!isEditingBaseRates)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Configurar precios por hora y costo de tinta por defecto"
              >
                <Settings2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{isEditingBaseRates ? 'Cerrar Tarifas Base' : 'Editar Tarifas Base ($/h)'}</span>
              </button>
            </div>

            {/* Panel Desplegable: Editar Tarifas Base del Taller */}
            {isEditingBaseRates && (
              <form onSubmit={handleSaveDefaultRates} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                    ⚙️ Tarifas Base del Taller (Guardadas para futuros presupuestos)
                  </span>
                  {ratesSavedNotice && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> ¡Guardado!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Mano de Obra ($ por Hora)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editBaseRatesData.hourlyLaborRate}
                      onChange={(e) => setEditBaseRatesData({ ...editBaseRatesData, hourlyLaborRate: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-center"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5 text-center">
                      ({formatCurrency((Number(editBaseRatesData.hourlyLaborRate) || 0) / 60, currencySymbol)}/min)
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Energía Eléctrica ($ por Hora)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editBaseRatesData.hourlyElectricityRate}
                      onChange={(e) => setEditBaseRatesData({ ...editBaseRatesData, hourlyElectricityRate: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-center"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5 text-center">
                      ({formatCurrency((Number(editBaseRatesData.hourlyElectricityRate) || 0) / 60, currencySymbol)}/min)
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Tinta Promedio ($ por Hoja)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editBaseRatesData.inkCostPerSheet}
                      onChange={(e) => setEditBaseRatesData({ ...editBaseRatesData, inkCostPerSheet: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-center"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5 text-center">
                      Costo estimado por hoja impresa
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar Tarifas Base</span>
                  </button>
                </div>
              </form>
            )}

            {/* Inputs de cálculo para el trabajo actual (Perfectamente alineados) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* 1. Hojas Impresas */}
              <div className="flex flex-col justify-between">
                <div className="min-h-[38px] flex items-end mb-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase leading-snug">
                    Hojas Impresas
                  </label>
                </div>
                <input
                  type="number"
                  min="0"
                  value={sheetsToPrint}
                  onChange={(e) => setSheetsToPrint(Math.max(0, Number(e.target.value)))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-bold bg-slate-50 text-center focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>

              {/* 2. Tinta x Hoja ($) */}
              <div className="flex flex-col justify-between">
                <div className="min-h-[38px] flex items-end mb-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase leading-snug">
                    Tinta x Hoja ({currencySymbol})
                  </label>
                </div>
                <input
                  type="number"
                  min="0"
                  value={inkRatePerSheet}
                  onChange={(e) => setInkRatePerSheet(Number(e.target.value))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-bold bg-slate-50 text-center focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>

              {/* 3. Minutos Energía Eléctrica */}
              <div className="flex flex-col justify-between">
                <div className="min-h-[38px] flex items-end mb-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase leading-snug">
                    Minutos de Luz / Máquina
                  </label>
                </div>
                <input
                  type="number"
                  min="0"
                  value={electricityMinutes}
                  onChange={(e) => setElectricityMinutes(Math.max(0, Number(e.target.value)))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-bold bg-slate-50 text-center focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>

              {/* 4. Minutos Mano de Obra */}
              <div className="flex flex-col justify-between">
                <div className="min-h-[38px] flex items-end mb-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase leading-snug">
                    Minutos Mano de Obra
                  </label>
                </div>
                <input
                  type="number"
                  min="0"
                  value={laborMinutes}
                  onChange={(e) => setLaborMinutes(Math.max(0, Number(e.target.value)))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-bold bg-slate-50 text-center focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Desglose en vivo de operaciones */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-slate-500">Tinta ({sheetsToPrint} hojas @ {formatCurrency(inkRatePerSheet, currencySymbol)}): </span>
                <strong className="text-slate-800">{formatCurrency(calculations.inkCost, currencySymbol)}</strong>
              </div>
              <div>
                <span className="text-slate-500">Luz ({electricityMinutes} min @ {formatCurrency(hourlyElectricityRate, currencySymbol)}/h): </span>
                <strong className="text-slate-800">{formatCurrency(calculations.electricityCost, currencySymbol)}</strong>
              </div>
              <div>
                <span className="text-slate-500">Mano de Obra ({laborMinutes} min @ {formatCurrency(hourlyLaborRate, currencySymbol)}/h): </span>
                <strong className="text-indigo-700">{formatCurrency(calculations.laborMinutesCost, currencySymbol)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Results & Direct Quote Exporter */}
        <div className="space-y-6">
          {/* Card de Costos Internos vs Precio Cliente */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400">
                Resumen de Costos
              </span>
              <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700 font-bold">
                {calculations.qty} unidades
              </span>
            </div>

            {/* Desglose de Costos de Fabricación */}
            <div className="space-y-2 text-xs border-b border-slate-700/80 pb-4">
              <div className="flex justify-between text-slate-400">
                <span>Insumos (imán, vinilo, laminado):</span>
                <span className="text-slate-200 font-semibold">{formatCurrency(calculations.materialsCost, currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tinta ({sheetsToPrint} hojas):</span>
                <span className="text-slate-200 font-semibold">{formatCurrency(calculations.inkCost, currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Energía Eléctrica ({electricityMinutes} min):</span>
                <span className="text-slate-200 font-semibold">{formatCurrency(calculations.electricityCost, currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Mano de Obra ({laborMinutes} min):</span>
                <span className="text-slate-200 font-semibold">{formatCurrency(calculations.laborMinutesCost, currencySymbol)}</span>
              </div>

              <div className="pt-2 flex justify-between text-sm font-bold text-white border-t border-slate-800">
                <span className="text-amber-400">Costo Total Producción:</span>
                <span className="text-amber-400">{formatCurrency(calculations.totalProductionCost, currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Costo real por unidad:</span>
                <span className="font-bold text-slate-300">{formatCurrency(calculations.unitProductionCost, currencySymbol)} c/u</span>
              </div>
            </div>

            {/* Margen de Ganancia Ajustable */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-bold text-slate-300">Margen de Ganancia:</label>
                <span className="font-black text-brand-300 text-sm">+{marginPercent}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="300"
                step="5"
                value={marginPercent}
                onChange={(e) => setMarginPercent(Number(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>Mayorista (+50%)</span>
                <span>Normal (+150%)</span>
                <span>Minorista (+200%)</span>
              </div>
            </div>

            {/* Precio Final Sugerido al Cliente */}
            <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700 text-center space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-400 block">
                Precio Sugerido para el Cliente
              </span>
              <div className="text-3xl font-black text-white tracking-tight">
                {formatCurrency(calculations.totalPrice, currencySymbol)}
              </div>
              <span className="text-xs font-bold text-brand-300 block">
                {formatCurrency(calculations.unitPrice, currencySymbol)} por unidad
              </span>
              <div className="pt-2 border-t border-slate-700/60 text-[11px] text-emerald-400 font-semibold flex items-center justify-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Ganancia Neta: +{formatCurrency(calculations.netProfit, currencySymbol)}</span>
              </div>
            </div>

            {/* Botones de Acción Clave */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleSendToClientQuote}
                className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 text-white font-extrabold rounded-2xl shadow-lg shadow-brand-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>⚡ Pasar a Presupuesto del Cliente</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleSaveToCatalog}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar en ABM Productos</span>
              </button>
            </div>
          </div>

          {/* Nota de Privacidad */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>100% Privado:</strong> Al pulsar "Pasar a Presupuesto", el cliente solo recibirá la cotización formal con el producto terminado y su precio. Jamás verá tu costo de tintas, luz o mano de obra.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
