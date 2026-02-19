import React from "react";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, required = false, className = "", onChange, ...props },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
        )}

        <input
          ref={ref}
          autoComplete="off"
          className={`
            w-full px-3 py-2 border rounded-lg shadow-sm transition
            focus:outline-none focus:ring-2 text-gray-700
            ${
              error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            }
            ${className}
          `}
          onChange={(e) => {
            // optional: clear error when user types
            if (error && props.name && (props as any).clearError) {
              (props as any).clearError(props.name);
            }

            onChange?.(e);
          }}
          {...props}
        />

        {error && (
          <p className="mt-1 text-sm text-red-600 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
