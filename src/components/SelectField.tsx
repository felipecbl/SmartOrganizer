import { useId, useState } from "react";

export interface SelectFieldOptionInterface {
  name: string | number;
  value: string | number;
}

export interface SelectFieldInterface {
  // value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  size?: "sm" | "md" | "lg" | "xl";
  options?: SelectFieldOptionInterface[];
  value?: string | number;
}

export const SelectField: React.FC<SelectFieldInterface> = ({ label, helperText, options, placeholder, onChange, size = "md", value }) => {
  const id = useId();
  const [initialValue, setInitialValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setInitialValue(value);
    onChange(value);
  };

  return (
    <fieldset className="fieldset text-field">

      {label && <label htmlFor={id}>{label}</label>}

      <select
        id={id}
        name={id}
        className={`size-${size}`}
        placeholder={placeholder}
        value={initialValue}
        onChange={handleChange}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>{option.name}</option>
        )
        )}

      </select>

      {helperText && <span className="helper-text">{helperText}</span>}

    </fieldset>

  );
};