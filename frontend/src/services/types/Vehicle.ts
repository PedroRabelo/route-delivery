export type Vehicle = {
  id: number;
  placa: string;
  capacidade: number;
  ativo?: boolean;
  temRodizio: boolean;
  percentualCheio: number;
  qtdLocais: number;
  codigoFrota: number;
  pesoMinimo: number;
  qtdMinLocais: number;
};

export type VehicleZone = {
  zonaId: number;
  zona: string;
  prioridade: number;
};

export type SaveVehicleDTO = {
  placa: string;
  capacidade: number;
  temRodizio: boolean;
  percentualCheio: number;
  qtdLocais: number;
  codigoFrota: number;
  pesoMinimo: number;
  qtdMinLocais: number;
};

export type AddZoneVehicleDTO = {
  zonaId: number;
  veiculoId: number;
  prioridade: number;
};

export type UpdateZoneVehicleDTO = {
  prioridade: number;
};

export type VehicleTrack = {
  placa: string;
  latitude: number;
  longitude: number;
  ultimaPosicao: string;
  ignicao: boolean;
  velocidade: number;
};
