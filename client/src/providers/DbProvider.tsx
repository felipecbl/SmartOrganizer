import {
  ItemInterface,
  OrganizerInterface,
  DeviceInterface,
  ApiResponse,
  SettingsInterface,
} from "models";
import { useContext, createContext, useState, useEffect } from "react";

export interface DbProviderInterface {
  children: React.ReactNode;
}

export interface DbContextInterface {
  organizers: OrganizerInterface[];
  settings: SettingsInterface;
  fetchOrganizers: () => void;
  addOrganizer: (organizer: OrganizerInterface) => void;
  deleteOrganizer: (organizerId: string) => void;

  addItem: (
    organizerId: string,
    item: ItemInterface,
    itemPosition: number,
    callback?: (res: ApiResponse) => void
  ) => void;
  updateItem: (
    organizerId: string,
    item: ItemInterface,
    callback?: (res: ApiResponse) => void
  ) => void;
  deleteItem: (
    organizerId: string,
    itemPosition: number,
    callback?: () => void
  ) => void;

  devices: DeviceInterface[];
  fetchDevices: () => void;
  fetchSettings: () => void;
  saveSettings: (
    settings: SettingsInterface,
    callback?: (res: ApiResponse) => void
  ) => void;

  findLocation: (server: string, index: number, blink?: boolean) => void;

  importAllItems: (
    organizerId: string,
    items: ItemInterface[],
    callback?: () => void
  ) => void;
}

export const DbContext = createContext<DbContextInterface>({
  organizers: [],
  settings: {} as SettingsInterface,
  fetchOrganizers: () => {},
  addOrganizer: () => {},
  deleteOrganizer: () => {},

  addItem: () => {},
  updateItem: () => {},
  deleteItem: () => {},

  devices: [],
  fetchDevices: () => {},

  findLocation: () => {},
  importAllItems: () => {},

  fetchSettings: () => {},
  saveSettings: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useDb = () => useContext(DbContext);

export const DbProvider: React.FC<DbProviderInterface> = ({ children }) => {
  const [organizers, setOrganizers] = useState<OrganizerInterface[]>([]);
  const [devices, setDevices] = useState<DeviceInterface[]>([]);
  const [settings, setSettings] = useState<SettingsInterface>(
    {} as SettingsInterface
  );

  const apiUrl =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_DEV_API_URL
      : import.meta.env.VITE_API_URL;

  const fetchOrganizers = async () => {
    const res = await fetch(`${apiUrl}organizers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const organizers = await res.json();
    setOrganizers(organizers.data);
  };

  const fetchDevices = async () => {
    const res = await fetch(`${apiUrl}settings/devices`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const devices = await res.json();
    setDevices(devices.data);
  };

  useEffect(() => {
    fetchOrganizers();
    fetchDevices();
    fetchSettings();
  }, []);

  const addOrganizer = async (organizer: OrganizerInterface) => {
    const res = await fetch(`${apiUrl}organizers/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(organizer),
    });

    const organizers = await res.json();
    if (organizers.error) {
      return;
    }

    fetchOrganizers();
  };

  const deleteOrganizer = async (organizerId: string) => {
    const res = await fetch(`${apiUrl}organizers/delete?id=${organizerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const organizers = await res.json();
    if (organizers.error) {
      return;
    }

    fetchOrganizers();
  };

  const addItem = async (
    organizerId: string,
    item: ItemInterface,
    itemPosition: number,
    callback?: (res: ApiResponse) => void
  ) => {
    const res = await fetch(`${apiUrl}organizers/addItem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ organizerId, item, itemPosition }),
    });

    const organizers = await res.json();
    if (organizers.error) {
      return;
    }

    fetchOrganizers();
    if (callback) {
      callback(organizers);
    }
  };

  const updateItem = async (
    organizerId: string,
    item: ItemInterface,
    callback?: (res: ApiResponse) => void
  ) => {
    const res = await fetch(`${apiUrl}organizers/updateItem`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ organizerId, item }),
    });

    const organizers = await res.json();

    if (organizers.error) {
      return;
    }

    fetchOrganizers();
    if (callback) {
      callback(organizers);
    }
  };

  const deleteItem = async (
    organizerId: string,
    itemPosition: number,
    callback?: () => void
  ) => {
    const res = await fetch(`${apiUrl}organizers/deleteItem`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ organizerId, itemPosition }),
    });

    const organizers = await res.json();

    if (callback) {
      callback();
    }

    if (organizers.error) {
      return;
    }

    fetchOrganizers();
  };

  const findLocation = async (
    organizerId: string,
    index: number,
    blink?: boolean,
    callback?: () => void
  ) => {
    const res = await fetch(`${apiUrl}organizers/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ organizerId, index, blink }),
    });

    const find = await res.json();
    if (find.error) {
      return;
    }

    if (callback) {
      callback();
    }
  };

  const importAllItems = async (
    organizerId: string,
    items: ItemInterface[],
    callback?: () => void
  ) => {
    const res = await fetch(`${apiUrl}organizers/import`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ organizerId, items }),
    });

    const find = await res.json();
    if (find.error) {
      return;
    }

    if (callback) {
      callback();
    }
  };

  const fetchSettings = async () => {
    const res = await fetch(`${apiUrl}settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const settings = await res.json();
    setSettings(settings.data[0]);
  };

  const saveSettings = async (
    newSettings: SettingsInterface,
    callback?: (res: ApiResponse) => void
  ) => {
    const res = await fetch(`${apiUrl}settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ settings: newSettings }),
    });

    const settings = await res.json();
    if (settings.error) {
      return;
    }

    // fetchSettings();
    if (callback) {
      callback(settings);
    }
  };

  return (
    <DbContext.Provider
      value={{
        organizers,
        settings,
        addOrganizer,
        fetchOrganizers,
        deleteOrganizer,
        addItem,
        updateItem,
        deleteItem,
        devices,
        fetchDevices,
        findLocation,
        importAllItems,
        fetchSettings,
        saveSettings,
      }}
    >
      {children}
    </DbContext.Provider>
  );
};
