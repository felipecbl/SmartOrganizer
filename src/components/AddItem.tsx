import { ItemInterface, TItem, } from "models";
import { Panel } from "./Panel";
import { TextField } from "./TextField";
import { useEffect, useState } from "react";
import { AddOrganizer } from "./AddOrganizer";
import { SelectField } from "./SelectField";
import { useDb, usePages } from "providers";
import { ensureNumber } from "utils";

export interface AddItemInterface {
}

export const AddItem: React.FC<AddItemInterface> = ({ }) => {
  const { setCurrentPage, params } = usePages();
  const { organizers, addItem } = useDb();
  const [displayAddOrganizer, setDisplayAddOrganizer] = useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState<number>(params?.data?.position ?? 0);
  const [availablePositions, setAvailablePositions] = useState<number[]>([]);
  const [selectedOrganizerId, setSelectedOrganizerId] = useState<string>(params?.data?.organizerId ?? "");

  const handleInsert = () => {
    addItem(selectedOrganizerId, item, selectedPosition, () => setCurrentPage("allItems"));
  };

  const [item, setItem] = useState<ItemInterface>({
    name: "",
    description: "",
    empty: false,
    quantity: 0,
    _id: "",
    position: selectedPosition,
    tags: [],
    image: "",
    link: "",
    organizerName: "",
    organizerId: selectedOrganizerId,
  });

  useEffect(() => {
    if (!selectedOrganizerId) return;

    const organizer = organizers.find((organizer) => organizer._id === selectedOrganizerId);
    const positions = organizer?.items.map((item: TItem, index: number) => item.empty ? index : -1);
    if (!positions) return;

    setAvailablePositions(positions.filter((position) => position !== -1));
  }, [organizers, selectedOrganizerId]);

  return (
    <>
      {(organizers && organizers?.length > 0 && !displayAddOrganizer) ?
        <Panel title="Add item" >

          <div className="form">
            <SelectField
              label="Select organizer"
              placeholder="Select organizer"
              value={selectedOrganizerId}
              options={organizers.map((organizer) => {
                if (!organizer) return { name: "", value: "" };
                return { name: (organizer).name, value: organizer._id };
              })}
              onChange={(id) => { setSelectedOrganizerId(id as string); }}
            />
            {/*
            <div className="buttons">
              <button onClick={() => setDisplayAddOrganizer(true)}>Add organizer</button>
            </div> */}

            <TextField
              label="Item name"
              placeholder="Item name"
              type="text"
              value={item.name}
              onChange={(name) => { setItem({ ...item, name }); }}
            />
            <TextField
              label="Description"
              placeholder="Description"
              type="text"
              value={item.description ?? ""}
              onChange={(description) => { setItem({ ...item, description }); }}
            />
            <TextField
              label="Quantity"
              placeholder="Quantity"
              type="number"
              value={item.quantity ?? 0}
              onChange={(quantity) => { setItem({ ...item, quantity: isNaN(parseInt(quantity)) ? 0 : parseInt(quantity) }); }}
            />
            <SelectField
              label="Select position"
              placeholder="Select position"
              value={selectedPosition}
              options={availablePositions.map((position) => {
                return { name: position + 1, value: position };
              })}
              onChange={(position) => {
                setSelectedPosition(ensureNumber(position));
                setItem({ ...item, position: ensureNumber(position) });
              }}
            />

            <TextField
              label="Tags"
              placeholder="Tags"
              type="text"
              value={item.tags.join(",")}
              onChange={(tags) => { setItem({ ...item, tags: tags.split(",") }); }}
              helperText="Separate tags with a comma, optional"
            />

            <TextField
              label="Image"
              placeholder="Image"
              type="text"
              value={item.image}
              onChange={(image) => { setItem({ ...item, image }); }}
            />

            <TextField
              label="Link"
              placeholder="Link"
              type="text"
              value={item.link}
              onChange={(link) => { setItem({ ...item, link }); }}
            />

          </div>
          <div className="buttons">
            <button className="button danger" onClick={() => setCurrentPage("allItems")}>Cancel</button>
            <button onClick={handleInsert}>Add item</button>
          </div>

        </Panel>
        :
        <>
          {displayAddOrganizer ? <AddOrganizer />
            :
            <Panel title="Add item" >
              <p>No organizers found</p>
              <div className="buttons">
                <button onClick={() => setDisplayAddOrganizer(true)}>Add organizer</button>
              </div>
            </Panel>
          }
        </>
      }
    </>

  );
};