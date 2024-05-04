import { useId } from "react";
import { HuePicker } from "react-color";

export interface ColorFieldInterface {
  color?: string;
  onChange: (color: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  style?: React.CSSProperties;
  size?: "sm" | "md" | "lg" | "xl";
}

export const ColorField: React.FC<ColorFieldInterface> = ({
  label,
  helperText,
  color,
  placeholder,
  onChange,
  style,
  size = "md",
}) => {
  const id = useId();

  return (
    <fieldset className="fieldset color_field">
      {label && <label htmlFor={id}>{label}</label>}

      <div className="input_wrap">
        <HuePicker
          color={color}
          width="100%"
          onChange={(color) => {
            onChange(color.hex.replace("#", ""));
          }}
        />
        <div className="input_wrap__color_field">
          <div
            className="color_picker__preview"
            style={{ backgroundColor: color }}
          ></div>
          <input
            className={`size-${size}`}
            id={id}
            type={"text"}
            value={color}
            placeholder={placeholder}
            min={0}
            style={style}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>

      {helperText && <span className="helper-text">{helperText}</span>}
    </fieldset>
  );
};
