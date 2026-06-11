import React from "react";
import Button from "./Button";

export default function Alert({
  title = "Something went wrong",
  message,
  type = "error",
  onAction,
  actionLabel = "Try Again",
  emoji = "📡",
  className = "",
}) {
  const styles = {
    error: {
      bg: "bg-rose-50/50",
      border: "border-rose-100",
      titleText: "text-[#b91c1c]",
      btnVariant: "danger",
    },
    warning: {
      bg: "bg-amber-50/50",
      border: "border-amber-100",
      titleText: "text-amber-700",
      btnVariant: "primary",
    },
    info: {
      bg: "bg-sky-50/50",
      border: "border-sky-100",
      titleText: "text-sky-700",
      btnVariant: "outline",
    },
  };

  const currentStyle = styles[type] || styles.error;

  return (
    <div
      className={`border text-center py-12 px-6 rounded-3xl max-w-xl mx-auto shadow-sm my-10 ${currentStyle.bg} ${currentStyle.border} ${className}`}
    >
      {emoji && <span className="text-5xl mb-4 block select-none">{emoji}</span>}
      <h3 className={`font-black text-lg mb-2 ${currentStyle.titleText}`}>{title}</h3>
      {message && <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto leading-relaxed">{message}</p>}
      {onAction && (
        <Button onClick={onAction} variant={currentStyle.btnVariant} className="px-6 py-2.5 text-xs font-black uppercase">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
