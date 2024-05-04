import { usePages } from "providers";
import { useState } from "react";
import { Menu } from "react-feather";

import icon from "../assets/images/icon.png";

export interface HeaderInterface {}

export const Header: React.FC<HeaderInterface> = ({}) => {
  const { setCurrentPage } = usePages();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header>
      <div className="container header-container">
        <div className="logo">
          <h1>
            <img src={icon} alt="Smart Organizer" />
            Smart Organizer
          </h1>
        </div>

        <nav>
          {/* menu trigger for mobile*/}
          <button className="menu-trigger button-icon" onClick={toggleMenu}>
            <Menu size={16} />
          </button>
          {/* menu items */}
          <div
            className={`buttons align-right${menuOpen ? " open" : ""}`}
            onClick={toggleMenu}
          >
            <button onClick={() => setCurrentPage("allItems")}>
              All Items
            </button>
            <button onClick={() => setCurrentPage("addItem")}>Add Item</button>
            <button onClick={() => setCurrentPage("allOrganizers")}>
              All Organizers
            </button>
            <button onClick={() => setCurrentPage("addOrganizer")}>
              Add Organizer
            </button>
            <button onClick={() => setCurrentPage("settings")}>Settings</button>
          </div>
        </nav>
      </div>
    </header>
  );
};
