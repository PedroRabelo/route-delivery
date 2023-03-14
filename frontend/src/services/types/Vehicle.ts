export type Vehicle = {
  id: number;
  placa: string;
  capacidade: number;
  ativo?: boolean;
  temRodizio: boolean;
  percentualCheio: number;
  qtdLocais: number;
  codigoFrota: number;
  prioridade: number;
  pesoMinimo: number;
};

export type VehicleZone = {
  zonaId: number;
  zona: string;
  prioridade: number;
}

export type SaveVehicleDTO = {
  placa: string;
  capacidade: number;
  temRodizio: boolean;
  percentualCheio: number;
  qtdLocais: number;
  codigoFrota: number;
  prioridade: number;
  pesoMinimo: number;
}

export type AddZoneVehicleDTO = {
  zonaId: number;
  veiculoId: number;
  prioridade: number;
}

export type UpdateZoneVehicleDTO = {
  prioridade: number
}
