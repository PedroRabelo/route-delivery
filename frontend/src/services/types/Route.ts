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

export type RouteDirection = {
  id: number;
  rotaId: number;
  latitude: number;
  longitude: number;
}