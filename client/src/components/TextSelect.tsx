import { useId, useRef, useState } from "react";
import { useClickOutside } from "hooks";

export interface TextSelectInterface {
  value?: string | number;
  onChange: (value: string) => void;
  onLabelClick?: () => void;
  placeholder?: string;
  type?: string;
  label?: string;
  helperText?: string;
  size?: "sm" | "md" | "lg" | "xl";
  options?: { value: string; label: string }[];
}

export const TextSelect: React.FC<TextSelectInterface> = ({
  options,
  label,
  helperText,
  value,
  placeholder,
  onChange,
  type = "text",
  size = "md",
  onLabelClick,
}) => {
  const id = useId();
  const selectRef = useRef<HTMLSelectElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  useClickOutside(selectRef, () => setIsFocused(false));

  return (
    <fieldset className="fieldset text-field text-select">
      {label && (
        <label
          onClick={(e) => {
            if (onLabelClick) {
              e.preventDefault();
              onLabelClick();
            }
          }}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        className={`size-${size}`}
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        min={0}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
      />

      <div className="input-wrapper">
        {isFocused && options && (
          <select
            ref={selectRef}
            id={`select-${id}`}
            className="text-select__dropdown"
            size={options.length}
          >
            {options.map((option) => {
              return (
                <option
                  key={option.value}
                  value={option.value}
                  onClick={() => {
                    onChange(option.label);
                    setIsFocused(false);
                  }}
                >
                  {option.label}
                </option>
              );
            })}
          </select>
        )}
      </div>
      {helperText && <span className="helper-text">{helperText}</span>}
    </fieldset>
  );
};
