import { useEffect, useState } from "react";
import { Panel } from "./Panel";
import { ColorField } from "./ColorField";
import { TextField } from "./TextField";
import { useDb, usePages } from "providers";

export interface SettingsInterface {}

export const Settings: React.FC<SettingsInterface> = ({}) => {
  const [lowColor, setLowColor] = useState("");
  const [mediumColor, setMediumColor] = useState("");
  const [highColor, setHighColor] = useState("");

  const [lowThreshold, setLowThreshold] = useState(0);
  const [highThreshold, setHighThreshold] = useState(0);
  const [timeout, setTimeout] = useState(0);
  const { settings, saveSettings } = useDb();
  const { setCurrentPage } = usePages();

  useEffect(() => {
    if (!settings) return;

    setLowColor(settings.colors.low);
    setMediumColor(settings.colors.medium);
    setHighColor(settings.colors.high);
    setLowThreshold(settings.thresholds.low);
    setHighThreshold(settings.thresholds.high);
    setTimeout(settings.timeout);
  }, [settings]);

  const handleSaveSettings = () => {
    saveSettings(
      {
        colors: {
          low: lowColor,
          medium: mediumColor,
          high: highColor,
          empty: "000000",
        },
        thresholds: {
          low: lowThreshold,
          high: highThreshold,
        },
        timeout,
      },
      (res) => {
        if (!res.success) {
          alert("Error saving settings");
          return;
        }
        setCurrentPage("allItems");
      }
    );
  };

  return (
    <Panel title="Settings">
      <h3>Colors</h3>
      <p>Set LED colors for the thresholds </p>

      <ColorField
        label="Low"
        color={`#${lowColor}`}
        onChange={(color) => setLowColor(color)}
        helperText="Used when quantity is below the low threshold"
      />
      <ColorField
        label="Medium"
        color={`#${mediumColor}`}
        onChange={(color) => setMediumColor(color)}
        helperText="Used when quantity is between the low and high thresholds"
      />
      <ColorField
        label="High"
        color={`#${highColor}`}
        onChange={(color) => setHighColor(color)}
        helperText="Used when quantity is above the high threshold"
      />

      <hr />
      <h3>Thresholds</h3>
      <TextField
        label="Low"
        type="number"
        value={lowThreshold}
        onChange={(e) => setLowThreshold(parseInt(e))}
      />
      <TextField
        label="High"
        type="number"
        value={highThreshold}
        onChange={(e) => setHighThreshold(parseInt(e))}
      />
      <hr />

      <h3>Other settings</h3>

      <TextField
        label="Timeout in seconds"
        type="number"
        value={timeout}
        onChange={(e) => setTimeout(parseInt(e))}
        helperText="Time in seconds before the LED turns off"
      />

      <div className="buttons">
        <button
          className="button danger"
          onClick={() => setCurrentPage("allItems")}
        >
          Cancel
        </button>
        <button className="button" onClick={handleSaveSettings}>
          Save
        </button>
      </div>
    </Panel>
  );
};
