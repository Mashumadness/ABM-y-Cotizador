import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Store, 
  Phone, 
  Camera, 
  FileText,
  DollarSign,
  Database
} from 'lucide-react';
import { storageService } from '../../services/storageService';

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

export const BusinessSettingsModal = ({ 
  isOpen, 
  onClose, 
  businessInfo, 
  onSaveBusinessInfo,
  onDataReloaded,
  onShowToast
}) => {
  const [formData, setFormData] = useState({ ...businessInfo });
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveBusinessInfo(formData);
    onClose();
  };

  const handleExportBackup = async () => {
    try {
      setIsExporting(true);
      const data = await storageService.exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-papeleria-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      if (onShowToast) onShowToast('Copia de seguridad descargada con éxito', 'success');
    } catch (err) {
      console.error(err);
      if (onShowToast) onShowToast('Error al exportar datos', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        await storageService.importAllData(json);
        if (onShowToast) onShowToast('Datos restaurados correctamente', 'success');
        if (onDataReloaded) onDataReloaded();
        onClose();
      } catch (err) {
        console.error('Error al importar:', err);
        if (onShowToast) onShowToast('Archivo inválido o dañado', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Datos de tu Taller / Emprendimiento</h2>
              <p className="text-xs text-slate-500">Aparecen en el membrete de presupuestos y mensajes de WhatsApp</p>
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
          {/* Nombre y Eslogan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nombre del Negocio *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Eslogan / Subtítulo
              </label>
              <input
                type="text"
                placeholder="Ej. Taller de diseño & encuadernación"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-400"
              />
            </div>
          </div>

          {/* Contacto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                WhatsApp de Contacto
              </label>
              <input
                type="text"
                placeholder="+54 9 11 1234-5678"
                value={formData.whatsapp || ''}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Usuario de Instagram
              </label>
              <input
                type="text"
                placeholder="@tu.emprendimiento"
                value={formData.instagram || ''}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-400"
              />
            </div>
          </div>

          {/* Moneda y Validez */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Símbolo de Moneda
              </label>
              <input
                type="text"
                placeholder="$ o USD"
                value={formData.currencySymbol || '$'}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Validez de Presupuesto (días)
              </label>
              <input
                type="number"
                min="1"
                value={formData.defaultValidityDays || 15}
                onChange={(e) => setFormData({ ...formData, defaultValidityDays: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-400"
              />
            </div>
          </div>

          {/* Términos por defecto */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Términos, Seña y Plazos por Defecto
            </label>
            <textarea
              rows="3"
              value={formData.defaultNotes || ''}
              onChange={(e) => setFormData({ ...formData, defaultNotes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:ring-2 focus:ring-brand-400"
              placeholder="Ej. Seña del 50%, demoras de producción, retiros y envíos..."
            />
          </div>

          {/* Sección de Respaldo / Backup Local */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Database className="w-4 h-4 text-brand-600" />
              <span>Respaldo y Seguridad de Datos</span>
            </span>
            <p className="text-xs text-slate-500 mb-3">
              Descarga una copia en formato JSON para guardar en tu computadora o transferir a otro equipo.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportBackup}
                disabled={isExporting}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Copia (JSON)</span>
              </button>

              <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Restaurar Copia</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm shadow-md shadow-brand-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Configuración</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
