import { useDb, usePages } from "providers";
import { Organizer, OrganizerInterface } from "./Organizer";
import { Panel } from "./Panel";

export interface OrganizersInterface {

}

export const Organizers: React.FC<OrganizersInterface> = ({ }) => {
  const { setCurrentPage } = usePages();
  const { organizers } = useDb();

  return (
    <Panel title="All organizers">
      <div className="items-wrapper">
        {organizers.length ?
          <>
            {organizers.map((item) => {
              if (!item) return null;
              const organizer: OrganizerInterface = item as unknown as OrganizerInterface;
              return (
                <Organizer
                  _id={organizer._id}
                  key={organizer._id}
                  columns={organizer.columns}
                  items={organizer.items}
                  name={organizer.name}
                  quantity={organizer.quantity}
                  rows={organizer.rows}
                  server={organizer.server}
                />
              );
            })}
          </>
          : <>
            <div className="empty">No organizers found</div>
            <div className="buttons">
              <button
                onClick={() => setCurrentPage("addOrganizer")}
              >Add organizer</button>
            </div>
          </>

        }
      </div>
    </Panel>
  );
};