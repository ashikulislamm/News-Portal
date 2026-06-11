import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  const baseStyle =
    "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const variants = {
    primary:
      "bg-[var(--color-accent)] text-white shadow-lg shadow-amber-600/15 hover:shadow-amber-600/25 hover:bg-amber-600",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/15 hover:shadow-rose-600/25",
    dark:
      "bg-[#1e1e1e] hover:bg-[#b91c1c] text-white shadow-md",
    outline:
      "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300",
  };

  const selectedVariant = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${selectedVariant} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-1 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
