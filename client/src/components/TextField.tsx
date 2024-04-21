import { useId } from "react";

export interface TextFieldInterface {
  value?: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  label?: string;
  helperText?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const TextField: React.FC<TextFieldInterface> = ({ label, helperText, value, placeholder, onChange, type = "text", size = "md" }) => {
  const id = useId();
  return (
    <fieldset className="fieldset text-field">

      {label && <label htmlFor={id}>{label}</label>}

      <input
        className={`size-${size}`}
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        min={0}
        onChange={(e) => onChange(e.target.value)}
      />

      {helperText && <span className="helper-text">{helperText}</span>}

    </fieldset>

  );
};