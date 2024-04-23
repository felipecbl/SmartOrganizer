import { TItem } from "./Item";

export interface OrganizerInterface {
  _id: string;
  name: string;
  ip: string;
  quantity: number;
  rows: number;
  columns: number;
  items: TItem[];
  server: string;
}
