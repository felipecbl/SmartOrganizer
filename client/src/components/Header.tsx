import { usePages } from "providers";
// import { useDB } from "react-pouchdb";

export interface HeaderInterface {}

export const Header: React.FC<HeaderInterface> = ({}) => {
  const { setCurrentPage } = usePages();

  return (
    <header>
      <div className="container header-container">
        <div className="logo">
          <h1>Smart Organizer</h1>
        </div>

        <nav className="buttons align-right">
          <button onClick={() => setCurrentPage("allItems")}>All Items</button>
          <button onClick={() => setCurrentPage("addItem")}>Add Item</button>
          <button onClick={() => setCurrentPage("allOrganizers")}>
            All Organizers
          </button>
          <button onClick={() => setCurrentPage("addOrganizer")}>
            Add Organizer
          </button>
        </nav>
      </div>
    </header>
  );
};
