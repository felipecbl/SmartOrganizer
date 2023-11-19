import { useState } from "react";
import { Panel } from "./Panel";
import { TextField } from "./TextField";

export interface SearchInterface {
  onChange: (value: string) => void;
}

export const Search: React.FC<SearchInterface> = ({ onChange }) => {
  const [search, setSearch] = useState<string>("");

  const handleSearch = (value: string) => {
    setSearch(value);

    // debounce
    setTimeout(() => {
      onChange(value);
    }, 500);
  };

  return (
    <Panel>
      <div className="form">
        <TextField
          size="xl"
          placeholder="Search item"
          type="text"
          value={search}
          onChange={handleSearch}
          helperText="Search for an item"
        />
      </div>
    </Panel>
  );
};