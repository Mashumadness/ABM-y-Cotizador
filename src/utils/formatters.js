/**
 * Formateadores y utilidades de texto
 */

export const formatCurrency = (amount, symbol = '$') => {
  const num = Number(amount) || 0;
  return `${symbol} ${num.toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return dateInput;
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Genera el texto formateado optimizado para enviar por WhatsApp
 */
export const generateWhatsAppText = (quote, businessInfo) => {
  const symbol = businessInfo?.currencySymbol || '$';
  const bizName = businessInfo?.name || 'Papelería Creativa';
  
  let text = `✨ *PRESUPUESTO — ${bizName.toUpperCase()}* ✨\n`;
  text += `📋 *Comprobante:* #${quote.code || 'COT'}\n`;
  text += `📅 *Fecha:* ${formatDate(quote.createdAt)}\n`;
  if (quote.validUntil) {
    text += `⏳ *Válido hasta:* ${formatDate(quote.validUntil)}\n`;
  }
  text += `👤 *Cliente:* ${quote.clientName || 'Cliente'}\n`;
  if (quote.clientContact) {
    text += `📱 *Contacto:* ${quote.clientContact}\n`;
  }
  text += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `📦 *DETALLE DE PRODUCTOS:*\n\n`;

  quote.items.forEach((item, index) => {
    const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
    text += `${index + 1}. *${item.name}*\n`;
    text += `   ▸ ${item.quantity} un. x ${formatCurrency(item.price, symbol)} = *${formatCurrency(itemTotal, symbol)}*\n`;
    if (item.notes) {
      text += `   _(Detalle: ${item.notes})_\n`;
    }
  });

  text += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `💰 *Subtotal:* ${formatCurrency(quote.subtotal, symbol)}\n`;

  if (quote.discount && Number(quote.discount.value) > 0) {
    const descLabel = quote.discount.type === 'percentage' 
      ? `Descuento (${quote.discount.value}%):` 
      : `Descuento:`;
    text += `🎁 *${descLabel}* -${formatCurrency(quote.discount.amount, symbol)}\n`;
  }

  if (quote.surcharge && Number(quote.surcharge.value) > 0) {
    const recLabel = quote.surcharge.type === 'percentage' 
      ? `Recargo (${quote.surcharge.value}%):` 
      : `Recargo / Envío:`;
    text += `➕ *${recLabel}* +${formatCurrency(quote.surcharge.amount, symbol)}\n`;
  }

  text += `\n⭐ *TOTAL FINAL:* *${formatCurrency(quote.total, symbol)}* ⭐\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (quote.notes) {
    text += `📝 *Condiciones y Notas:*\n${quote.notes}\n\n`;
  }

  if (businessInfo?.instagram) {
    text += `📸 Instagram: ${businessInfo.instagram}\n`;
  }
  if (businessInfo?.whatsapp) {
    text += `💬 WhatsApp: ${businessInfo.whatsapp}\n`;
  }
  text += `\n¡Gracias por confiar en nuestro trabajo! 💛`;

  return text;
};
