import { OrganizerInterface } from "models";
import { useCallback, useEffect, useState } from "react";
import { Panel } from "./Panel";
import { TextField } from "./TextField";
import { useDb, usePages } from "providers";
import { TextSelect } from "components";
import { RefreshCcw } from "react-feather";

export interface AddOrganizerInterface {}

export const AddOrganizer: React.FC<AddOrganizerInterface> = ({}) => {
  const { setCurrentPage } = usePages();
  const { addOrganizer, devices, fetchDevices } = useDb();
  const [organizerQuantity, setOrganizerQuantity] = useState<number>(1);

  // useEffect(() => {
  //   console.log(devices);
  // }, [devices]);

  const initialOrganizer: OrganizerInterface = {
    name: "",
    _id: "",
    ip: "",
    items: [],
    quantity: organizerQuantity,
    server: "",
    columns: 1,
    rows: 1,
  };

  const getDeviceIp = (deviceName: string) => {
    if (!devices) return "";
    const device = devices?.find((device) => device.name === deviceName);
    if (!device) return "";
    return device.ip;
  };

  const [organizer, setOrganizer] =
    useState<OrganizerInterface>(initialOrganizer);

  useEffect(() => {
    setOrganizerQuantity(organizer.columns * organizer.rows);
  }, [organizer.columns, organizer.rows]);

  // useEffect(() => {
  //   setOrganizer({ ...organizer, quantity: organizerQuantity });
  // }, [organizerQuantity, setOrganizer]);

  const insertOrganizer = useCallback(async () => {
    // eslint-disable-next-line prefer-spread
    organizer.items = Array.apply(null, Array(organizerQuantity)).map(() => {
      return { empty: true };
    });
    await addOrganizer(organizer);
    setCurrentPage("allItems");
  }, [addOrganizer, organizer, organizerQuantity, setCurrentPage]);

  return (
    <Panel title="Add organizer">
      <div className="form">
        <TextField
          label="Name"
          placeholder="Organizer name"
          type="text"
          value={organizer.name}
          onChange={(name) => {
            setOrganizer({ ...organizer, name });
          }}
        />

        <TextSelect
          label={
            <>
              Server <RefreshCcw size={12} />
            </>
          }
          placeholder="Server"
          type="text"
          value={organizer.server}
          onLabelClick={() => {
            fetchDevices();
          }}
          onChange={(server) => {
            setOrganizer({ ...organizer, server, ip: getDeviceIp(server) });
          }}
          options={devices?.map((device) => {
            return { value: device.ip, label: device.name };
          })}
        />

        <TextField
          label="Rows"
          placeholder="Rows"
          type="number"
          value={organizer.rows ?? 0}
          onChange={(rows) => {
            setOrganizer({
              ...organizer,
              rows: isNaN(parseInt(rows)) ? 0 : parseInt(rows),
            });
          }}
        />
        <TextField
          label="Columns"
          placeholder="Columns"
          type="number"
          value={organizer.columns ?? 0}
          onChange={(columns) => {
            setOrganizer({
              ...organizer,
              columns: isNaN(parseInt(columns)) ? 0 : parseInt(columns),
            });
          }}
        />
      </div>

      <div className="buttons">
        <button
          className="button danger"
          onClick={() => setCurrentPage("allItems")}
        >
          Cancel
        </button>
        <button onClick={insertOrganizer}>Add Organizer</button>
      </div>
    </Panel>
  );
};
