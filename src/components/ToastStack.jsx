import { CheckCircleIcon, AlertCircleIcon, InfoCircleIcon } from "./icons";

const ICONS = {
  success: CheckCircleIcon,
  error: AlertCircleIcon,
  info: InfoCircleIcon,
};

export default function ToastStack({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || InfoCircleIcon;
        return (
          <div key={toast.id} className={`toast toast--${toast.type || "info"}`}>
            <Icon className="toast__icon" />
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
