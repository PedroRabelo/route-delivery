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
  ordemPedido: number;
};

export type DeliveryVehicle = {
  id: number;
  ordem: number;
  placa: string;
  pesoMin: number;
  capacidade: number;
  sobra: number;
  rodizio: string;
  locais: number;
  pedidos: number;
  peso: number;
  valor: number;
  percentual: number;
  poligonoId: number;
};

export type DeliveryRoute = {
  id: number;
  data: Date;
  status: string;
  dataInclusao: Date;
};

export type VehicleDeliveries = {
  vehicle: DeliveryVehicle;
  orders?: DeliveryPoints[];
};

export type CreateDeliveryPolygonDTO = {
  roteiroId: number;
  coordenadas: CreateDeliveryPolygonDTOCoordsDTO[];
};

export type CreateDeliveryPolygonDTOCoordsDTO = {
  latitude: number;
  longitude: number;
};

export type PolygonDeliveriesSummary = {
  id: number;
  locais: number;
  notas: number;
  pesoTotal: number;
  valorTotal: number;
  locaisRodizio: number;
  notasRodizio: number;
  pesoRodizio: number;
  valorRodizio: number;
  locaisForaRodizio: number;
  notasForaRodizio: number;
  pesoForaRodizio: number;
  valorForaRodizio: number;
};

export type UpdatePedidoVeiculoPoligonoDto = {
  pedidos: number[];
  veiculoId: number;
  placa: string;
  roteiroId: number;
};

type DiaSemana = {
  id: string;
  name: string;
  title: string;
};

const diasSemana: DiaSemana[] = [
  {
    id: "2",
    name: "SEGUNDA-FEIRA",
    title: "SEG",
  },
  {
    id: "3",
    name: "TERÇA-FEIRA",
    title: "TER",
  },
  {
    id: "4",
    name: "QUARTA-FEIRA",
    title: "QUA",
  },
  {
    id: "5",
    name: "QUINTA-FEIRA",
    title: "QUI",
  },
  {
    id: "6",
    name: "SEXTA-FEIRA",
    title: "SEX",
  },
];
