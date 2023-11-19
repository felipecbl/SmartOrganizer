import { useState } from "react";

export interface ItemQuantitynterface {
  value: number;
  onChange: (value: number) => void;
}

export const ItemQuantity: React.FC<ItemQuantitynterface> = ({ value, onChange }) => {
  const [initialValue, setInitialValue] = useState(value);
  return (
    <div className="item-quantity">
      <button className="item-quantity__button"
        disabled={initialValue === 0}
        onClick={() => {
          if (initialValue > 0) {
            setInitialValue(initialValue - 1);
            onChange(initialValue - 1);
          }
        }}>
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
      </button>

      <span className="item-quantity__value" >{initialValue}</span>

      <button className="item-quantity__button" onClick={() => { setInitialValue(initialValue + 1); onChange(initialValue + 1); }}>
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" /></svg>
      </button>
    </div>

  );
};