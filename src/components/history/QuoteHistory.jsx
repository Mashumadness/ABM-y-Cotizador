import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Eye, 
  Printer, 
  Copy, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Send, 
  RotateCw, 
  FileText, 
  User, 
  Calendar,
  DollarSign
} from 'lucide-react';
import { formatCurrency, formatDate, generateWhatsAppText } from '../../utils/formatters';
import { QuotePreviewModal } from '../quotes/QuotePreviewModal';

export const QuoteHistory = ({ 
  quotes = [], 
  onDeleteQuote, 
  onUpdateQuoteStatus, 
  onLoadQuoteIntoBuilder, 
  businessInfo,
  onShowToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [previewQuote, setPreviewQuote] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const symbol = businessInfo?.currencySymbol || '$';

  // Stats
  const stats = useMemo(() => {
    let totalAmount = 0;
    let approvedAmount = 0;
    let countApproved = 0;
    let countPending = 0;

    quotes.forEach(q => {
      const val = Number(q.total) || 0;
      totalAmount += val;
      if (q.status === 'Aprobado' || q.status === 'Entregado') {
        approvedAmount += val;
        countApproved++;
      } else if (q.status === 'Pendiente') {
        countPending++;
      }
    });

    return {
      totalQuotes: quotes.length,
      totalAmount,
      approvedAmount,
      countApproved,
      countPending
    };
  }, [quotes]);

  // Filtered quotes
  const filteredQuotes = useMemo(() => {
    return quotes.filter(q => {
      const matchesSearch = 
        (q.clientName && q.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (q.code && q.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (q.clientContact && q.clientContact.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [quotes, searchTerm, statusFilter]);

  const handleCopyWhatsApp = async (quote) => {
    try {
      const text = generateWhatsAppText(quote, businessInfo);
      await navigator.clipboard.writeText(text);
      setCopiedId(quote.id);
      if (onShowToast) onShowToast('¡Texto copiado para WhatsApp!', 'success');
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Aprobado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Entregado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cancelado':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Pendiente':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600">
            Registro Histórico
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-0.5">
            Presupuestos Emitidos
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Consulta cotizaciones anteriores, cambia su estado, reimprímelas o reenvíalas por WhatsApp en un clic.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Total Emitidos</span>
            <span className="text-xl font-bold text-slate-800">{stats.totalQuotes}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Pendientes</span>
            <span className="text-xl font-bold text-amber-700">{stats.countPending}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Aprobados / Entregados</span>
            <span className="text-xl font-bold text-emerald-700">{stats.countApproved}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Venta Aprobada</span>
            <span className="text-lg font-bold text-indigo-700">{formatCurrency(stats.approvedAmount, symbol)}</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por cliente, contacto o número de presupuesto (#COT-0001)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {['ALL', 'Pendiente', 'Aprobado', 'Entregado', 'Cancelado'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'ALL' ? 'Todos' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Quotes List / Table */}
      {filteredQuotes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No hay presupuestos guardados</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'ALL'
              ? 'No se encontraron coincidencias para los filtros aplicados.'
              : 'Cuando armes presupuestos en el Cotizador y hagas clic en "Guardar", quedarán registrados aquí.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredQuotes.map((quote) => {
              const isCopied = copiedId === quote.id;

              return (
                <div
                  key={quote.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/70 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Code, Client & Date */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded-md">
                        #{quote.code}
                      </span>
                      <select
                        value={quote.status || 'Pendiente'}
                        onChange={(e) => onUpdateQuoteStatus(quote.id, e.target.value)}
                        className={`text-xs font-bold px-2 py-0.5 rounded-md border cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-400 ${getStatusBadge(
                          quote.status || 'Pendiente'
                        )}`}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Aprobado">Aprobado</option>
                        <option value="Entregado">Entregado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                      <span className="text-xs text-slate-400">
                        {formatDate(quote.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="font-bold text-sm text-slate-900">
                        {quote.clientName || 'Cliente Particular'}
                      </span>
                      {quote.clientContact && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {quote.clientContact}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500">
                      {quote.items?.length || 0} producto(s):{' '}
                      <span className="text-slate-700 italic">
                        {quote.items?.map((it) => `${it.name} (${it.quantity})`).join(', ') || 'Sin ítems'}
                      </span>
                    </p>
                  </div>

                  {/* Right: Total & Action Buttons */}
                  <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Total</span>
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        {formatCurrency(quote.total, symbol)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Copiar WhatsApp */}
                      <button
                        onClick={() => handleCopyWhatsApp(quote)}
                        className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                        title="Copiar texto para WhatsApp"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Ver / Imprimir */}
                      <button
                        onClick={() => setPreviewQuote(quote)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                        title="Ver detalle / Imprimir / PDF"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Cargar en cotizador */}
                      {onLoadQuoteIntoBuilder && (
                        <button
                          onClick={() => onLoadQuoteIntoBuilder(quote)}
                          className="p-2 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl transition-colors"
                          title="Duplicar o continuar editando en el Cotizador"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                      )}

                      {/* Eliminar */}
                      <button
                        onClick={() => onDeleteQuote(quote)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Eliminar del historial"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de Vista Previa para reimprimir o reenviar */}
      <QuotePreviewModal
        isOpen={Boolean(previewQuote)}
        onClose={() => setPreviewQuote(null)}
        quote={previewQuote}
        businessInfo={businessInfo}
      />
    </div>
  );
};
