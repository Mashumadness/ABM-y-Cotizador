import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-indigo-500" />
  };

  const borderColors = {
    success: 'border-emerald-200 bg-emerald-50/90 text-emerald-900',
    error: 'border-rose-200 bg-rose-50/90 text-rose-900',
    info: 'border-indigo-200 bg-indigo-50/90 text-indigo-900'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm animate-bounce-short transition-all duration-300">
      <div className={`flex items-center gap-2.5 ${borderColors[toast.type || 'info']} px-3 py-2 rounded-lg border`}>
        {icons[toast.type || 'info']}
        <span className="text-sm font-medium">{toast.message}</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 rounded-full transition-colors ml-2"
        >
          <X className="w-4 h-4 opacity-70 hover:opacity-100" />
        </button>
      </div>
    </div>
  );
};
