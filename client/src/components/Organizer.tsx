import { OrganizerPreview } from "components";
import { ItemInterface } from "models";
import { useDb } from "providers";

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
  const { deleteOrganizer } = useDb();

  const handleDelete = () => {
    // prompt for confirmation
    if (
      confirm(`Are you sure you want to delete ${name} and all items?`) == true
    ) {
      deleteOrganizer(_id);
    }
  };

  return (
    <div id={_id} className="organizer">
      <div className="organizer__header">
        <h2 className="organizer__name">
          {name} {quantity} ({rows}x{columns})
        </h2>
        <div className="organizer__server">{server}</div>
        <div className="buttons">
          <button className="danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
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
