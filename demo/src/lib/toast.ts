type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

type Listener = (toast: Toast) => void;

const listeners = new Set<Listener>();

export function toast(message: string, type: ToastType = "success") {
  const t: Toast = { id: `${Date.now()}-${Math.random()}`, message, type };
  listeners.forEach((fn) => fn(t));
}

export function onToast(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export type { Toast, ToastType };
