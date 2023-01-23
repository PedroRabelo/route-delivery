export type Delivery = {
  id: string;
  startDate: Date;
  routeName: string;
  origin: string;
  originLatitude: string;
  originLongitude: string;
};

export type DeliveryPoints = {
  id: number;
  codigoCliente: string;
  placa: string;
  cliente: string;
  latitude: number;
  longitude: number;
  ordem: string;
  peso: number;
  valor: number;
  observacao: string;
};

export type DeliveryVehicle = {
  ordem: number;
  placa: string;
  capacidade: number;
  rodizio: string;
  locais: number;
  pedidos: number;
  peso: number;
  valor: number;
  percentual: number;
};

export type DeliveryRoute = {
  id: number;
  data: Date;
  status: string;
};

export type VehicleDeliveries = {
  vehicle: DeliveryVehicle;
  orders?: DeliveryPoints[];
};
