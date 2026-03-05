import Select from "react-select";

export type Option = { value: number | string; label: string };

type Props = {
  label?: string;
  value: number | string | null;
  onChange: (val: number | string | null) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  isDisabled?: boolean;
};

export default function SearchSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Ketik untuk mencari...",
  error,
  isDisabled,
}: Props) {
  const selected = options.find((o) => String(o.value) === String(value)) ?? null;

  return (
    <div className="space-y-1">
      {label ? <div className="text-sm font-medium text-black">{label}</div> : null}

      <Select
        isDisabled={isDisabled}
        value={selected}
        onChange={(opt) => onChange(opt ? (opt.value as any) : null)}
        options={options}
        placeholder={placeholder}
        isClearable
        classNamePrefix="rs"
        styles={{
          option: (base, state) => ({
            ...base,
            color: "black",
            backgroundColor: state.isFocused ? "#f3f4f6" : "white",
          }),
          singleValue: (base) => ({
            ...base,
            color: "black",
          }),
          input: (base) => ({
            ...base,
            color: "black",
          }),
          placeholder: (base) => ({
            ...base,
            color: "#6b7280",
          }),
        }}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <style>{`
        .rs__control {
          border-radius: 0.5rem;
          border-color: #d1d5db;
          min-height: 42px;
        }
        .rs__control--is-focused {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,.25);
        }
        .rs__value-container {
          padding: 0 0.75rem;
        }
        .rs__indicatorSeparator {
          display: none;
        }
      `}</style>
    </div>
  );
}