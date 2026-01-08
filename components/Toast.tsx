import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

type ToastType = 'SUCCESS' | 'ERROR' | 'INFO';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'SUCCESS') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-20 md:bottom-10 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 w-full max-w-md px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md animate-in slide-in-from-bottom-5 fade-in duration-300
              ${toast.type === 'SUCCESS' ? 'bg-[#1a1a1a]/90 border-green-900/50 text-white' : ''}
              ${toast.type === 'ERROR' ? 'bg-[#1a1a1a]/90 border-red-900/50 text-white' : ''}
              ${toast.type === 'INFO' ? 'bg-[#1a1a1a]/90 border-blue-900/50 text-white' : ''}
            `}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center shrink-0
              ${toast.type === 'SUCCESS' ? 'bg-green-900/30 text-green-500' : ''}
              ${toast.type === 'ERROR' ? 'bg-red-900/30 text-red-500' : ''}
              ${toast.type === 'INFO' ? 'bg-blue-900/30 text-blue-500' : ''}
            `}>
                {toast.type === 'SUCCESS' && <CheckCircle size={18} fill="currentColor" className="text-green-500/20 stroke-green-500"/>}
                {toast.type === 'ERROR' && <AlertCircle size={18} />}
                {toast.type === 'INFO' && <Info size={18} />}
            </div>
            
            <p className="flex-1 text-sm font-bold">{toast.message}</p>
            
            <button onClick={() => removeToast(toast.id)} className="text-gray-500 hover:text-white transition">
                <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};