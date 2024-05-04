export interface SettingsInterface {
  colors: {
    low: string;
    medium: string;
    high: string;
    empty: string;
  };

  thresholds: {
    low: number;
    high: number;
  };

  timeout: number;
}
