import {
  ItemInterface,
  OrganizerInterface,
  DeviceInterface,
  ApiResponse,
} from "models";
import { useContext, createContext, useState, useEffect } from "react";

export interface DbProviderInterface {
  children: React.ReactNode;
}

export interface DbContextInterface {
  organizers: OrganizerInterface[];
  fetchOrganizers: () => void;
  addOrganizer: (organizer: OrganizerInterface) => void;
  deleteOrganizer: (organizerId: string) => void;

  addItem: (
    organizerId: string,
    item: ItemInterface,
    itemPosition: number,
    callback?: () => void
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

  findLocation: (server: string, index: number) => void;
}

export const DbContext = createContext<DbContextInterface>({
  organizers: [],
  fetchOrganizers: () => {},
  addOrganizer: () => {},
  deleteOrganizer: () => {},

  addItem: () => {},
  updateItem: () => {},
  deleteItem: () => {},

  devices: [],
  fetchDevices: () => {},

  findLocation: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useDb = () => useContext(DbContext);

export const DbProvider: React.FC<DbProviderInterface> = ({ children }) => {
  const [organizers, setOrganizers] = useState<OrganizerInterface[]>([]);
  const [devices, setDevices] = useState<DeviceInterface[]>([]);

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
    console.log("fetching devices");

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
    callback?: () => void
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
      callback();
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
    callback?: () => void
  ) => {
    const res = await fetch(`${apiUrl}organizers/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ organizerId, index }),
    });

    const find = await res.json();
    if (find.error) {
      return;
    }

    if (callback) {
      callback();
    }
  };

  return (
    <DbContext.Provider
      value={{
        organizers,
        addOrganizer,
        fetchOrganizers,
        deleteOrganizer,
        addItem,
        updateItem,
        deleteItem,
        devices,
        fetchDevices,
        findLocation,
      }}
    >
      {children}
    </DbContext.Provider>
  );
};
