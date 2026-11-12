import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  Calendar, 
  User, 
  Phone, 
  Camera, 
  FileText,
  Save
} from 'lucide-react';
import { formatCurrency, formatDate, generateWhatsAppText } from '../../utils/formatters';

const InstagramIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const QuotePreviewModal = ({ 
  isOpen, 
  onClose, 
  quote, 
  businessInfo, 
  onSaveToHistory 
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen || !quote) return null;

  const symbol = businessInfo?.currencySymbol || '$';

  const handleCopyWhatsApp = async () => {
    try {
      const text = generateWhatsAppText(quote, businessInfo);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Error al copiar texto:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    if (onSaveToHistory) {
      onSaveToHistory(quote);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-4">
        {/* Actions Bar (Hidden when printing) */}
        <div className="no-print bg-slate-900 text-white p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Vista Previa de Presupuesto
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Copiar WhatsApp */}
            <button
              onClick={handleCopyWhatsApp}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
              }`}
              title="Copiar texto listo para pegar en WhatsApp"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Copiado!' : 'Copiar para WhatsApp'}</span>
            </button>

            {/* Imprimir / PDF */}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
              title="Imprimir o guardar como PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>

            {/* Guardar */}
            {onSaveToHistory && (
              <button
                onClick={handleSave}
                disabled={saved}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  saved
                    ? 'bg-brand-500 text-white'
                    : 'bg-brand-600 hover:bg-brand-500 text-white active:scale-95'
                }`}
                title="Guardar este presupuesto en el historial"
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{saved ? 'Guardado' : 'Guardar'}</span>
              </button>
            )}

            {/* Cerrar */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Container */}
        <div className="p-6 sm:p-10 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0 print-container">
          {/* Header Membrete */}
          <div className="border-b-2 border-slate-900 pb-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <img 
                  src="/logo-tiker.png" 
                  alt="Tiker Logo" 
                  className="h-14 w-auto object-contain mb-2 print:h-12" 
                />
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                  Tiker
                </h1>
                <p className="text-xs text-slate-600 mt-1 whitespace-pre-line font-medium leading-relaxed">
                  {businessInfo?.tagline || 'Stickers UV y papelería creativa. Packs, pizarras y más.\nPersonalizados para tu emprendimiento 💛'}
                </p>
                
                <div className="text-xs text-slate-600 mt-2.5 space-y-1">
                  {businessInfo?.whatsapp && (
                    <div className="flex items-center gap-1.5 font-medium">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{businessInfo.whatsapp}</span>
                    </div>
                  )}
                  {businessInfo?.instagram && (
                    <div className="flex items-center gap-1.5 font-medium">
                      <InstagramIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{businessInfo.instagram}</span>
                    </div>
                  )}
                  {businessInfo?.address && (
                    <p className="text-slate-400">{businessInfo.address}</p>
                  )}
                </div>
              </div>

              {/* Code & Dates */}
              <div className="sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-100">
                <div className="inline-block bg-slate-900 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-md mb-2">
                  #{quote.code || 'COTIZACION'}
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>
                    <span className="text-slate-400 font-medium">Fecha de Emisión: </span>
                    <strong className="text-slate-800">{formatDate(quote.createdAt || new Date())}</strong>
                  </div>
                  {quote.validUntil && (
                    <div>
                      <span className="text-slate-400 font-medium">Válido hasta: </span>
                      <strong className="text-slate-800">{formatDate(quote.validUntil)}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Datos del Cliente */}
            <div className="mt-6 pt-4 border-t border-slate-200/60 bg-brand-50/40 p-3.5 rounded-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Presupuesto para:
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-600" />
                  <span>{quote.clientName || 'Cliente Particular'}</span>
                </div>
                {quote.clientContact && (
                  <div className="text-xs text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{quote.clientContact}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabla de Productos / Ítems */}
          <div className="mb-6">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px] font-bold">
                  <th className="pb-2">Descripción</th>
                  <th className="pb-2 text-center w-16">Cant.</th>
                  <th className="pb-2 text-right w-24">Unitario</th>
                  <th className="pb-2 text-right w-24">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quote.items.map((item, idx) => {
                  const itemPrice = Number(item.price) || 0;
                  const itemQty = Number(item.quantity) || 1;
                  const rowTotal = itemPrice * itemQty;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 pr-2">
                        <span className="font-semibold text-slate-800 block">{item.name}</span>
                        {item.notes && (
                          <span className="text-xs text-slate-400 italic block mt-0.5">{item.notes}</span>
                        )}
                      </td>
                      <td className="py-2.5 text-center font-bold text-slate-700">
                        {itemQty}
                      </td>
                      <td className="py-2.5 text-right text-slate-600">
                        {formatCurrency(itemPrice, symbol)}
                      </td>
                      <td className="py-2.5 text-right font-bold text-slate-800">
                        {formatCurrency(rowTotal, symbol)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totales y Descuentos */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-slate-200">
            {/* Notas / Condiciones */}
            <div className="flex-1 text-xs text-slate-500">
              {quote.notes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-1 text-[11px] uppercase tracking-wider">
                    Condiciones & Entrega:
                  </span>
                  <p className="whitespace-pre-line leading-relaxed text-slate-600">{quote.notes}</p>
                </div>
              )}
            </div>

            {/* Desglose Numérico */}
            <div className="w-full sm:w-64 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(quote.subtotal, symbol)}</span>
              </div>

              {quote.discount && Number(quote.discount.value) > 0 && (
                <div className="flex items-center justify-between text-emerald-700">
                  <span>
                    Descuento {quote.discount.type === 'percentage' ? `(${quote.discount.value}%)` : ''}:
                  </span>
                  <span className="font-semibold">-{formatCurrency(quote.discount.amount, symbol)}</span>
                </div>
              )}

              {quote.surcharge && Number(quote.surcharge.value) > 0 && (
                <div className="flex items-center justify-between text-slate-700">
                  <span>
                    Recargo / Envío {quote.surcharge.type === 'percentage' ? `(${quote.surcharge.value}%)` : ''}:
                  </span>
                  <span className="font-semibold">+{formatCurrency(quote.surcharge.amount, symbol)}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t-2 border-slate-900 text-base sm:text-lg font-black text-slate-900">
                <span>TOTAL:</span>
                <span className="text-brand-700">{formatCurrency(quote.total, symbol)}</span>
              </div>
            </div>
          </div>

          {/* Pie de página del presupuesto */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
            <p>¡Gracias por confiar en nuestro trabajo!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
