import React from "react";

export default function Input({
  label,
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  textarea = false,
  rows = 4,
  className = "",
  disabled = false,
  ...props
}) {
  const inputBaseStyle =
    "block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 text-sm text-slate-900 placeholder-slate-450 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const paddingStyle = Icon ? "pl-11 pr-4" : "px-4";

  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-bold text-slate-700 uppercase tracking-wide"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Icon className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
        )}

        {textarea ? (
          <textarea
            id={id}
            name={name}
            rows={rows}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${inputBaseStyle} ${Icon ? "pl-11 pt-3" : "p-4"} resize-none`}
            {...props}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${inputBaseStyle} ${paddingStyle}`}
            {...props}
          />
        )}
      </div>
      {error && <p className="text-xs font-semibold text-rose-600 mt-1">{error}</p>}
    </div>
  );
}
