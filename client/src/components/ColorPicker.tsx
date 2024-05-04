import { HuePicker } from "react-color";

export interface ColorPickerInterface {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

export const ColorPicker: React.FC<ColorPickerInterface> = ({
  color,
  onChange,
  label,
}) => {
  return (
    <div className="color_picker">
      {label && <h3>{label}</h3>}
      <HuePicker
        color={color}
        width="100%"
        onChange={(color) => {
          onChange(color.hex);
        }}
      />
    </div>
  );
};
