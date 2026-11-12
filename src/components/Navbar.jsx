import React from 'react';
import { 
  Package, 
  Calculator, 
  History, 
  Settings, 
  Sparkles,
  HardDrive,
  Wrench,
  FileText
} from 'lucide-react';

export const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  productCount = 0, 
  quoteItemsCount = 0, 
  historyCount = 0,
  businessInfo,
  onOpenSettings
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <img 
              src={`${import.meta.env.BASE_URL}logo-tiker.png`} 
              alt="Tiker Logo" 
              className="h-11 w-auto object-contain drop-shadow-xs hover:scale-105 transition-transform cursor-pointer" 
              onClick={() => setActiveTab('manufacturing')}
            />
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/70">
            {/* Costos de productos */}
            <button
              onClick={() => setActiveTab('manufacturing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'manufacturing'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Calculator className="w-4 h-4 text-brand-400" />
              <span>Costos de productos</span>
            </button>

            {/* Cotizador para Cliente */}
            <button
              onClick={() => setActiveTab('quotes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'quotes'
                  ? 'bg-white text-brand-700 shadow-xs shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Cotizador Cliente</span>
              {quoteItemsCount > 0 && (
                <span className="text-[11px] px-2 py-0.2 rounded-full font-bold bg-emerald-100 text-emerald-800 animate-pulse">
                  {quoteItemsCount}
                </span>
              )}
            </button>

            {/* ABM Productos */}
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'products'
                  ? 'bg-white text-brand-700 shadow-xs shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>ABM Productos</span>
              {productCount > 0 && (
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-medium ${
                  activeTab === 'products' ? 'bg-brand-100 text-brand-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {productCount}
                </span>
              )}
            </button>

            {/* Historial */}
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'history'
                  ? 'bg-white text-brand-700 shadow-xs shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Historial</span>
              {historyCount > 0 && (
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-medium ${
                  activeTab === 'history' ? 'bg-brand-100 text-brand-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {historyCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-500 bg-slate-100 rounded-lg border border-slate-200" title="Almacenado localmente en tu navegador">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              <span>Modo Local</span>
            </div>

            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200 flex items-center gap-1.5"
              title="Configuración de Tiker"
            >
              <Settings className="w-5 h-5 text-slate-600" />
              <span className="text-xs font-bold hidden sm:inline text-slate-600">Configuración</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 text-[11px]">
          <button
            onClick={() => setActiveTab('manufacturing')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg font-bold ${
              activeTab === 'manufacturing' ? 'text-slate-900 bg-slate-100' : 'text-slate-500'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Costos de productos</span>
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg font-bold ${
              activeTab === 'quotes' ? 'text-brand-600 bg-brand-50' : 'text-slate-500'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Cotizador {quoteItemsCount > 0 ? `(${quoteItemsCount})` : ''}</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg font-bold ${
              activeTab === 'products' ? 'text-brand-600 bg-brand-50' : 'text-slate-500'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>ABM Productos</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg font-bold ${
              activeTab === 'history' ? 'text-brand-600 bg-brand-50' : 'text-slate-500'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Historial</span>
          </button>
        </div>
      </div>
    </header>
  );
};
