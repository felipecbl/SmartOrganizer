import { ItemQuantity } from "components";
import { useDb, usePages } from "providers";
import { ensureNumber } from "utils";
import { ApiResponse, ItemInterface } from "models";
import { Edit2 } from "react-feather";

export const Item: React.FC<ItemInterface> = ({
  _id,
  description = "",
  link = "",
  image,
  name,
  organizerName,
  organizerId,
  position,
  quantity,
  tags = [],
}) => {
  const { updateItem, findLocation } = useDb();
  const { setCurrentPage } = usePages();

  const handleQuantityChange = (value: number) => {
    const item: ItemInterface = {
      _id,
      name,
      description,
      link,
      quantity: value,
      position,
      tags,
      image,
      organizerName,
      organizerId,
      empty: false,
    };
    updateItem(organizerId, item, (res: ApiResponse) => {
      if (!res.success) {
        alert("Error updating item");
        return;
      }
    });
  };

  return (
    <div id={_id} className="item">
      <div className="item__image">
        <a href={link} target="_blank">
          <img
            src={image === "" ? "https://via.placeholder.com/180" : image}
            alt={name}
          />
        </a>
      </div>

      <div className="item__data">
        <h3>{name}</h3>
        <span className="item__description">{description}</span>
        <span className="item__tags">
          {tags.map((tag) => (
            <span className="item__tag" key={tag}>
              {tag}
            </span>
          ))}
        </span>
        <ItemQuantity value={quantity} onChange={handleQuantityChange} />

        <div className="buttons">
          <button
            className="item__location "
            onClick={() => findLocation(organizerId, ensureNumber(position))}
          >
            Find {organizerName} [{ensureNumber(position) + 1}]
          </button>
        </div>
      </div>
      <button
        className="item__edit button-icon"
        title="Edit Item"
        onClick={() => {
          setCurrentPage("editItem", {
            data: { organizerId, position, type: "editItem" },
          });
        }}
      >
        <Edit2 size={16} />
      </button>
    </div>
  );
};
