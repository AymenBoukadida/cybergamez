"use client";

import { clsx } from "clsx";
import { CheckCircle2, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastContextValue = { showToast: (message: string) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used within ToastProvider");
  return value;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const nextId = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (!toast) return;
    timer.current = setTimeout(() => {
      timer.current = null;
      setToast(null);
    }, 4000);
  }, [clearTimer, toast]);

  useEffect(() => {
    if (!toast) return;
    startTimer();
    return clearTimer;
  }, [toast, startTimer, clearTimer]);

  const showToast = useCallback((message: string) => {
    nextId.current += 1;
    setToast({ id: nextId.current, message });
  }, []);

  const dismiss = useCallback(() => {
    clearTimer();
    setToast(null);
  }, [clearTimer]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className={clsx(
            "fixed bottom-4 left-1/2 z-[70] flex w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 items-start gap-3",
            "rounded-xl border border-line bg-surface-2 px-4 py-3 shadow-2xl",
            "sm:bottom-auto sm:left-auto sm:right-6 sm:top-20 sm:translate-x-0",
          )}
          onMouseEnter={clearTimer}
          onMouseLeave={startTimer}
          onFocus={clearTimer}
          onBlur={startTimer}
        >
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-ok" aria-hidden="true" />
          <p className="flex-1 text-sm text-text">{toast.message}</p>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={dismiss}
            className="focus-ring -m-1 rounded-lg p-1 text-muted transition-colors hover:text-text"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}
