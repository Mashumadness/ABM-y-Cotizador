/**
 * Utilidades de costeo: insumos y productos compuestos por insumos.
 *
 * Insumo:  { id, name, packageQuantity, packagePrice, unitCost }
 *          unitCost = packagePrice / packageQuantity (valor de cada unidad, ej. cada hoja)
 *
 * Producto armado con insumos (costMode: 'supplies'):
 *          materials:   [{ id, supplyId, name, quantity, unitCost }]
 *          extraCosts:  costos de taller (tinta + luz + mano de obra) traídos desde Costos de productos
 *          marginPercent: margen aplicado para calcular la venta sugerida
 *          cost  = suma de insumos + extraCosts
 *          price = cost * (1 + marginPercent / 100)
 */

export const calculateUnitCost = (packagePrice, packageQuantity) => {
  const quantity = Number(packageQuantity) || 0;
  if (quantity <= 0) return 0;
  return (Number(packagePrice) || 0) / quantity;
};

// Convierte insumos con el formato anterior ({ unit, unitCost, category }) al formato nuevo.
export const normalizeSupply = (supply) => {
  const packageQuantity = Number(supply.packageQuantity) > 0 ? Number(supply.packageQuantity) : 1;
  const packagePrice = supply.packagePrice !== undefined
    ? Number(supply.packagePrice) || 0
    : (Number(supply.unitCost) || 0) * packageQuantity;

  return {
    id: supply.id,
    name: supply.name || '',
    packageQuantity,
    packagePrice,
    unitCost: calculateUnitCost(packagePrice, packageQuantity),
    createdAt: supply.createdAt,
    updatedAt: supply.updatedAt
  };
};

// Valor unitario vigente de un material: el del insumo en el ABM si existe, si no el guardado.
export const getMaterialUnitCost = (material, supplies = []) => {
  const supply = supplies.find(s => s.id === material.supplyId);
  return supply ? Number(supply.unitCost) || 0 : Number(material.unitCost) || 0;
};

export const calculateMaterialsCost = (materials = [], supplies = []) => {
  return materials.reduce((total, material) => {
    return total + (Number(material.quantity) || 0) * getMaterialUnitCost(material, supplies);
  }, 0);
};

export const calculateSuggestedPrice = (cost, marginPercent) => {
  return (Number(cost) || 0) * (1 + (Number(marginPercent) || 0) / 100);
};

// Recalcula costo y venta sugerida de un producto armado con insumos, usando los valores actuales.
export const recalculateProduct = (product, supplies = []) => {
  if (product.costMode !== 'supplies') return product;

  const materials = (product.materials || []).map(material => {
    const supply = supplies.find(s => s.id === material.supplyId);
    return supply
      ? { ...material, name: supply.name, unitCost: Number(supply.unitCost) || 0 }
      : material;
  });

  const materialsCost = calculateMaterialsCost(materials, supplies);
  const cost = Math.round(materialsCost + (Number(product.extraCosts) || 0));
  const price = Math.round(calculateSuggestedPrice(cost, product.marginPercent));

  return {
    ...product,
    materials,
    cost,
    price,
    manufacturingBreakdown: product.manufacturingBreakdown
      ? { ...product.manufacturingBreakdown, materialsCost: Math.round(materialsCost) }
      : product.manufacturingBreakdown
  };
};

export const productUsesSupply = (product, supplyId) => {
  return product.costMode === 'supplies' && (product.materials || []).some(m => m.supplyId === supplyId);
};
