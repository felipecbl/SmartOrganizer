import {
  AddItem,
  AddOrganizer,
  AllItems,
  Organizers,
  Settings,
} from "components";
import { usePages } from "providers";

export interface MainInterface {}
export const Main: React.FC<MainInterface> = ({}) => {
  const { currentPage } = usePages();

  return (
    <main>
      <div className="container">
        {
          {
            allItems: <AllItems />,
            addItem: <AddItem />,
            editItem: <AddItem />,
            allOrganizers: <Organizers />,
            addOrganizer: <AddOrganizer />,
            editOrganizer: <div>editOrganizer</div>,
            settings: <Settings />,
          }[currentPage]
        }
      </div>
    </main>
  );
};
