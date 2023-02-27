export type Zone = {
  id: number;
  titulo: string;
  coordenadas: ZoneCoords[];
}

export type ZoneCoords = {
  id: number;
  latitude: number;
  longitude: number;
}

export type CreateZoneDTO = {
  titulo: string;
  coordenadas: CreateZoneCoordsDTO[];
}

export type CreateZoneCoordsDTO = {
  latitude: number;
  longitude: number;
}