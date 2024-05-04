import { OrganizerPreview } from "components";
import { ItemInterface } from "models";
import { useDb, usePages } from "providers";
import { Trash, UploadCloud, Download } from "react-feather";

export interface OrganizerInterface {
  _id: string;
  name: string;
  items: ItemInterface[];
  quantity: number;
  server: string;
  columns: number;
  rows: number;
}

export const Organizer: React.FC<OrganizerInterface> = ({
  _id,
  name,
  columns,
  rows,
  items,
  quantity,
  server,
}) => {
  const { deleteOrganizer, importAllItems } = useDb();
  const { setCurrentPage } = usePages();

  const handleDelete = () => {
    // prompt for confirmation
    if (
      confirm(`Are you sure you want to delete ${name} and all items?`) == true
    ) {
      exportItems();
      deleteOrganizer(_id);
    }
  };

  const exportItems = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(items)], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${name}_Items.json`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const importItems = () => {
    const element = document.createElement("input");
    element.type = "file";
    element.accept = ".json";
    element.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadedItems = JSON.parse(e.target?.result as string);
        // check if the length of the uploaded items is the same as the current items
        if (uploadedItems.length !== items.length) {
          alert("The number of items does not match the current organizer");
          return;
        }

        console.log(uploadedItems);
        confirm(`Are you sure you want to replace all the items on ${name}?`) &&
          importAllItems(_id, uploadedItems);

        // display all items
        setCurrentPage("allItems");
      };
      reader.readAsText(file);
    };
    element.click();
  };

  return (
    <div id={_id} className="organizer">
      <div className="organizer__header">
        <h2 className="organizer__name">
          {name} {quantity} ({rows}x{columns})
          <div className="organizer__buttons">
            <button
              title="Download items"
              className="button-icon"
              onClick={exportItems}
            >
              <Download size={16} />
            </button>
            <button
              title="Upload items"
              className="button-icon"
              onClick={importItems}
            >
              <UploadCloud size={16} />
            </button>
            <button
              onClick={handleDelete}
              title="Delete item"
              className="button-icon danger"
            >
              <Trash size={16} />
            </button>
          </div>
        </h2>
        <div className="organizer__server">{server}</div>
      </div>

      <div className="organizer__content">
        <OrganizerPreview
          _id={_id}
          columns={columns}
          items={items}
          server={server}
        />
      </div>
    </div>
  );
};
