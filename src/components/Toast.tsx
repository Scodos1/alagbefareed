import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

type Toast = { id: number; message: string; type: 'success' | 'error' | 'info' };
type ToastContextValue = { push: (msg: string, type?: Toast['type']) => void };

const ToastContext = createContext<ToastContextValue>({ push: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-md text-sm shadow-lg border fade-in ${
              t.type === 'error'
                ? 'bg-[color:var(--color-surface)] border-[color:var(--color-accent)] text-[color:var(--color-accent)]'
                : t.type === 'success'
                ? 'bg-[color:var(--color-fg)] text-[color:var(--color-bg)] border-transparent'
                : 'bg-[color:var(--color-surface)] border-[color:var(--color-border-strong)]'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
