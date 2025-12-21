
export enum DeliveryStatus {
  PENDING = 'PENDING',
  IN_ROUTE = 'IN_ROUTE',
  DELIVERED = 'DELIVERED'
}

export interface CargoItem {
  id: string;
  name: string;
  type: string;
  quantity: number;
}

export interface Delivery {
  id: string;
  orderNumber: string;
  clientName: string;
  address: string;
  phone: string;
  timeWindow: string;
  installTime: number; // minutes
  status: DeliveryStatus;
  items: CargoItem[];
  createdAt: string;
  eta?: string;
}

export interface Settings {
  breweryName: string;
  breweryAddress: string;
  installTimePerKeg: number;
  vehicleCapacity: number;
  maxRadius: number;
  avoidTolls: boolean;
  notifyClient: boolean;
  avoidDirtRoads: boolean;
}

export type ViewType = 'HOME' | 'LIST' | 'IMPORT' | 'DETAILS' | 'SETTINGS' | 'MAP';
