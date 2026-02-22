import React from "react";
// import { type FieldError } from "react-hook-form";

interface Option {
  value: number | string;
  label: string;
}

interface SelectProps {
  label: string;
  options: Option[];
  error?: string;
  registration: any; // dari react-hook-form register
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  registration,
}) => {
  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700">
        {label}
      </label>
      <select
        className="w-full px-3 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:outline-none text-gray-700"
        defaultValue=""
        {...registration}
      >
        <option className="text-gray-700" value="">Pilih {label}</option>
        {options.map((opt) => (
          <option className="text-gray-700" key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default Select;