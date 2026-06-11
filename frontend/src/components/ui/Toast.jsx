import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckIcon, XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      bg: "bg-[#1e1e1e]",
      border: "border-white/10",
      text: "text-[#faf9f6]",
      icon: <CheckIcon className="w-4.5 h-4.5 text-[#d97706]" />,
    },
    error: {
      bg: "bg-rose-950",
      border: "border-rose-800",
      text: "text-rose-100",
      icon: <XMarkIcon className="w-4.5 h-4.5 text-rose-400" />,
    },
    warning: {
      bg: "bg-amber-950",
      border: "border-amber-800",
      text: "text-amber-100",
      icon: <ExclamationTriangleIcon className="w-4.5 h-4.5 text-amber-450" />,
    },
  };

  const currentConfig = config[type] || config.success;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4.5 py-3.5 rounded-xl shadow-2xl border ${currentConfig.bg} ${currentConfig.text} ${currentConfig.border} text-xs font-bold`}
    >
      {currentConfig.icon}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-slate-450 hover:text-white transition cursor-pointer"
        aria-label="Close alert"
      >
        <XMarkIcon className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
