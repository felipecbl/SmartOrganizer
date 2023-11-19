import { TItem } from "models";
import { usePages } from "providers";
import { useMemo, } from "react";
import { findLocation } from "utils";

export interface OrganizerPreviewInterface {
  _id: string;
  items: TItem[];
  columns: number;
  server: string;
}

export const OrganizerPreview: React.FC<OrganizerPreviewInterface> = ({ _id, items, columns, server }) => {
  const { setCurrentPage } = usePages();
  const rowsItems = useMemo(() => {
    const initial = [];

    for (let i = 0; i < items.length; i += columns) {
      const row = items.slice(i, i + columns);
      initial.push(row);
    }
    return initial;
  }, [items, columns]);

  const generateRows = (item: TItem, index: number, rIndex: number) => {
    let quantityClass = "";
    if (item.empty) {
      quantityClass = "empty";
    } else {
      if (item.quantity === 0) { quantityClass = "red"; }
      if (item.quantity > 0) { quantityClass = "yellow"; }
      if (item.quantity >= 10) { quantityClass = "green"; }
    }

    return (
      <div
        className={`organizer__preview__item quantity__${quantityClass}`}
        key={index}
        onClick={() => {
          const position = rIndex * columns + index;
          if (item.empty) {
            setCurrentPage("addItem", {
              data: {
                organizerId: _id,
                position: position
              }
            });
          } else {
            findLocation(server, position, item.quantity);
          }
        }}
      >
        {(rIndex * columns) + index + 1}
      </div>
    );
  };

  return (
    <div className="organizer__preview">
      {rowsItems.map((row, rindex) => {
        return (
          <div className="organizer__preview__row" key={rindex} data-colunms={columns}>
            {row.map((item, index) => generateRows(item, index, rindex))}
          </div>
        );
      })}
    </div>
  );
};