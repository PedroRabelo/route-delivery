export type TrackVehicle = {
  id: number;
  placa: string;
  cliente: string;
  motorista: string;
  inicioRota: Date;
  chegadaPrevista: Date;
  tempoViagem: string;
  distancia: string;
  status: string
}

export type RoutesCoords = {
  id: number;
  rotaId: number;
  latitude: number;
  longitude: number;
}

export type RouteDirection = {
  rotaId: number;
  options: {
    strokeOpacity: number;
    strokeColor: string;
    strokeWeight: number;
    draggable: boolean;
    editable: boolean;
  };
  coords: {
    lat: number;
    lng: number;
  }[]
}

export type TruckDeliveries = {
  rotaId: number;
  pedidoId: number;
  cliente: string;
  status: number;
  tipoServico: string;
}