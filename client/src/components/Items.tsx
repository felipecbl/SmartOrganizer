import { ItemInterface, OrganizerInterface } from "models";
import { useMemo, useState } from "react";
import { Item } from "./Item";
import { Panel } from "./Panel";
import { Search } from "components";
import { useDb } from "providers";

export interface AllItemsInterface {}

export const AllItems: React.FC<AllItemsInterface> = ({}) => {
  const [search, setSearch] = useState<string>("");
  const { organizers } = useDb();

  const allItems = useMemo(() => {
    if (!organizers.length) return [];

    const items: ItemInterface[] = [];

    organizers.forEach((i) => {
      const organizer = i as unknown as OrganizerInterface;
      if (!i || !organizer.items) return;

      organizer.items.forEach((item) => {
        if (item && !item.empty) {
          item.organizerName = organizer.name;
          item.organizerId = organizer._id;
          items.push(item as ItemInterface);
        }
      });
    });

    let filteredItems: ItemInterface[] = items;

    if (search) {
      filteredItems = items.filter((item) => {
        return (
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description?.toLowerCase().includes(search.toLowerCase()) ||
          item.tags?.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
        );
      });
    }

    return filteredItems;
  }, [organizers, search]);

  return (
    <>
      <Search onChange={setSearch} />

      <Panel title={`All items (${allItems.length})`}>
        <div className="items-wrapper">
          {allItems.map((item, index) => (
            <Item
              key={`${item.organizerName}-${item._id}-${index}`}
              _id={item._id}
              description={item.description}
              link={item.link}
              image={item.image}
              name={item.name}
              organizerName={item.organizerName ?? ""}
              organizerId={item.organizerId}
              position={item.position}
              quantity={item.quantity}
              tags={item.tags}
              empty={item.empty}
            />
          ))}
        </div>
      </Panel>
    </>
  );
};
