import { ItemQuantity } from "components";
import { useDb } from "providers";
import { ensureNumber /*, findLocation*/ } from "utils";
import { ItemInterface } from "models";

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
    updateItem(organizerId, item);
  };

  return (
    <div id={_id} className="item">
      <div className="item__image">
        <a href={link}>
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
            onClick={() =>
              // findLocation("wled-so-office", ensureNumber(position), quantity)
              findLocation(organizerId, ensureNumber(position))
            }
          >
            Find {organizerName} [{ensureNumber(position) + 1}]
          </button>
        </div>
      </div>
      <button className="item__edit">✎</button>
    </div>
  );
};
