import { TItem } from "models";
import { useDb, usePages } from "providers";
import { useMemo } from "react";
import { findLocation } from "utils";

export interface OrganizerPreviewInterface {
  _id: string;
  items: TItem[];
  columns: number;
  server: string;
}

export const OrganizerPreview: React.FC<OrganizerPreviewInterface> = ({
  _id,
  items,
  columns,
  server,
}) => {
  const { setCurrentPage } = usePages();
  const rowsItems = useMemo(() => {
    const initial = [];

    for (let i = 0; i < items.length; i += columns) {
      const row = items.slice(i, i + columns);
      initial.push(row);
    }
    return initial;
  }, [items, columns]);
  const { settings } = useDb();

  const generateRows = (item: TItem, index: number, rIndex: number) => {
    let quantityClass = "";
    const { low, high } = settings.thresholds;
    if (item.empty) {
      quantityClass = "empty";
    } else {
      if (item.quantity === low) {
        quantityClass = "red";
      }
      if (item.quantity > low) {
        quantityClass = "yellow";
      }
      if (item.quantity >= high) {
        quantityClass = "green";
      }
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
                position: position,
                type: "addItem",
              },
            });
          } else {
            findLocation(server, position, item.quantity);
          }
        }}
      >
        {rIndex * columns + index + 1}
      </div>
    );
  };

  return (
    <div className="organizer__preview">
      {rowsItems.map((row, rIndex) => {
        return (
          <div
            className="organizer__preview__row"
            key={rIndex}
            data-colunms={columns}
          >
            {row.map((item, index) => generateRows(item, index, rIndex))}
          </div>
        );
      })}
    </div>
  );
};
