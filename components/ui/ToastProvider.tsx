"use client";

import { createContext, useContext, useState } from "react";

type Toast = {
  message: string;
  type?: "success" | "error";
};

type ToastContextType = {
  showToast: (toast: Toast) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

  function showToast(toast: Toast) {
    setToast(toast);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div className="fixed top-6 right-6 z-50">
          <div
            className={`px-4 py-2 rounded-lg shadow-lg text-sm font-medium ${
              toast.type === "error"
                ? "bg-red-600 text-white"
                : "bg-gold text-midnight"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}