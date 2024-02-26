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
  coords: {
    lat: number;
    lng: number;
  }[]
}