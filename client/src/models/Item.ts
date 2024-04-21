export interface ItemInterface {
  _id: string;
  empty: false;
  name: string;
  image?: string;
  description?: string;
  link?: string;
  tags: string[];
  quantity: number;
  position: number;
  organizerName: string;
  organizerId: string;
}

export interface EmptyItemInterface {
  empty: true;
}

export type TItem = ItemInterface | EmptyItemInterface;
