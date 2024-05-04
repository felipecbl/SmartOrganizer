import { ApiResponse, ItemInterface, TItem } from "models";
import { Panel } from "./Panel";
import { TextField } from "./TextField";
import { useEffect, useMemo, useState } from "react";
import { AddOrganizer } from "./AddOrganizer";
import { SelectField } from "./SelectField";
import { useDb, usePages } from "providers";
import { ensureNumber } from "utils";
import amazon from "assets/images/amazon.svg";
import aliexpress from "assets/images/aliexpress.ico";

import { Trash } from "react-feather";
import { Copy } from "react-feather";

export interface AddItemInterface {}

export const AddItem: React.FC<AddItemInterface> = ({}) => {
  const { setCurrentPage, params } = usePages();
  const { organizers, addItem, updateItem, deleteItem, findLocation } = useDb();
  const [displayAddOrganizer, setDisplayAddOrganizer] =
    useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState<number>(
    ensureNumber(params?.data?.position ?? -1)
  );
  const [availablePositions, setAvailablePositions] = useState<number[]>([]);
  const [selectedOrganizerId, setSelectedOrganizerId] = useState<string>(
    params?.data?.organizerId ?? organizers[0]?._id
  );
  const editing = useMemo(() => params?.data?.type === "editItem", [params]);

  const handleInsert = () => {
    addItem(
      selectedOrganizerId,
      { ...item, position: selectedPosition },
      selectedPosition,
      (res: ApiResponse) => {
        if (!(res as ApiResponse).success) {
          alert(res.data);
          return;
        }

        setCurrentPage("allItems");
      }
    );
  };

  const handleUpdate = () => {
    updateItem(selectedOrganizerId, item, (res: ApiResponse) => {
      if (!res.success) {
        alert("Error updating item");
        return;
      }
      setCurrentPage("allItems");
    });
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${item.name}?`) == true) {
      deleteItem(
        selectedOrganizerId,
        item.position,

        () => setCurrentPage("allItems")
      );
    }
  };

  const handleDuplicateItem = () => {
    alert(`Duplicating item into position ${selectedPosition + 1}`);
    addItem(
      selectedOrganizerId,
      { ...item, position: selectedPosition, name: item.name + " copy" },
      selectedPosition,
      (res: ApiResponse) => {
        if (!(res as ApiResponse).success) {
          alert(res.data);
          return;
        }

        setCurrentPage("allItems");
      }
    );
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

    const organizer = organizers.find(
      (organizer) => organizer._id === selectedOrganizerId
    );
    const positions = organizer?.items.map((item: TItem, index: number) =>
      item.empty ? index : -1
    );
    if (!positions) return;

    setAvailablePositions(positions.filter((position) => position !== -1));
  }, [organizers, selectedOrganizerId, selectedPosition]);

  useEffect(() => {
    if (availablePositions.length === 0) {
      setSelectedPosition(-1);
    } else {
      if (selectedPosition === -1 || selectedPosition === undefined) {
        setSelectedPosition(ensureNumber(availablePositions[0]));
      }
    }
  }, [availablePositions, selectedPosition]);

  useEffect(() => {
    if (!params) return;
    if (params.data?.type === "editItem") {
      const organizer = organizers.find(
        (organizer) => organizer._id === params.data?.organizerId
      );
      const item = organizer?.items.find(
        (item) => !item.empty && item.position === params.data?.position
      );
      if (!item) return;
      setItem(item as ItemInterface);
    }
  }, [params, organizers]);

  return (
    <>
      {organizers && organizers?.length > 0 && !displayAddOrganizer ? (
        <Panel title={editing ? "Edit item" : "Add item"}>
          <div className="form">
            {editing && (
              <div className="buttons top-right">
                <button
                  onClick={handleDuplicateItem}
                  title="Duplicate item"
                  className="button-icon"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={handleDelete}
                  title="Delete item"
                  className="button-icon danger "
                >
                  <Trash size={16} />
                </button>
              </div>
            )}
            {!editing && (
              <SelectField
                label="Select organizer"
                placeholder="Select organizer"
                value={selectedOrganizerId}
                options={organizers.map((organizer) => {
                  if (!organizer) return { name: "", value: "" };
                  return { name: organizer.name, value: organizer._id };
                })}
                onChange={(id) => {
                  setSelectedOrganizerId(id as string);
                }}
              />
            )}
            {/*
            <div className="buttons">
              <button onClick={() => setDisplayAddOrganizer(true)}>Add organizer</button>
            </div> */}

            <TextField
              label="Item name"
              placeholder="Item name"
              type="text"
              value={item.name}
              onChange={(name) => {
                setItem({ ...item, name });
              }}
            />
            <TextField
              label="Description"
              placeholder="Description"
              type="text"
              value={item.description ?? ""}
              onChange={(description) => {
                setItem({ ...item, description });
              }}
            />
            <TextField
              label="Quantity"
              placeholder="Quantity"
              type="number"
              value={item.quantity ?? 0}
              onChange={(quantity) => {
                setItem({
                  ...item,
                  quantity: isNaN(parseInt(quantity)) ? 0 : parseInt(quantity),
                });
              }}
            />
            <SelectField
              label="Select position"
              placeholder="Select position"
              value={selectedPosition}
              options={availablePositions.map((position) => {
                return { name: position + 1, value: position };
              })}
              onChange={(position) => {
                findLocation(selectedOrganizerId, ensureNumber(position), true);
                setSelectedPosition(ensureNumber(position));
                setItem({ ...item, position: ensureNumber(position) });
              }}
            />

            <TextField
              label="Tags"
              placeholder="Tags"
              type="text"
              value={item.tags.join(",")}
              onChange={(tags) => {
                setItem({ ...item, tags: tags.split(",") });
              }}
              helperText="Separate tags with a comma, optional"
            />

            <div className="add_item__image_wrap">
              <TextField
                label="Image"
                placeholder="Image"
                type="text"
                value={item.image}
                onChange={(image) => {
                  setItem({ ...item, image });
                }}
              />
              {item.image && (
                <img className="add_item__image" src={item.image} />
              )}
            </div>

            <div className="add_item__image_wrap">
              <TextField
                label="Link"
                placeholder="Link"
                type="text"
                value={item.link}
                onChange={(link) => {
                  setItem({ ...item, link });
                }}
              />
              {item.link &&
                (item.link.includes("amazon") ? (
                  <img className="add_item__image" src={amazon} />
                ) : item.link.includes("aliexpress") ? (
                  <img className="add_item__image" src={aliexpress} />
                ) : (
                  <></>
                ))}
            </div>
          </div>
          <div className="buttons">
            <button
              className="button danger"
              onClick={() => setCurrentPage("allItems")}
            >
              Cancel
            </button>
            {editing ? (
              <button onClick={handleUpdate}>Update Item</button>
            ) : (
              <button onClick={handleInsert}>Add Item</button>
            )}
          </div>
        </Panel>
      ) : (
        <>
          {displayAddOrganizer ? (
            <AddOrganizer />
          ) : (
            <Panel title="Add item">
              <p>No organizers found</p>
              <div className="buttons">
                <button onClick={() => setDisplayAddOrganizer(true)}>
                  Add organizer
                </button>
              </div>
            </Panel>
          )}
        </>
      )}
    </>
  );
};
