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
  id: number;
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

export type CreateDeliveryPolygonDTO = {
  roteiroId: number;
  coordenadas: CreateDeliveryPolygonDTOCoordsDTO[];
}

export type CreateDeliveryPolygonDTOCoordsDTO = {
  latitude: number;
  longitude: number;
}

type DiaSemana = {
  id: string;
  name: string;
  title: string;
}

const diasSemana: DiaSemana[] = [
  {
    id: '2',
    name: 'SEGUNDA-FEIRA',
    title: 'SEG'
  },
  {
    id: '3',
    name: 'TERÇA-FEIRA',
    title: 'TER'
  },
  {
    id: '4',
    name: 'QUARTA-FEIRA',
    title: 'QUA'
  },
  {
    id: '5',
    name: 'QUINTA-FEIRA',
    title: 'QUI'
  },
  {
    id: '6',
    name: 'SEXTA-FEIRA',
    title: 'SEX'
  }

]