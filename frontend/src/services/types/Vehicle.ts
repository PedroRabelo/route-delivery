export type Vehicle = {
  id: number;
  placa: string;
  capacidade: number;
  ativo?: boolean;
  rodizio: string;
  percentualCheio: number;
  qtdLocais: number;
  codigoFrota: number;
};

export type SaveVehicleDTO = {
  placa: string;
  capacidade: number;
  rodizio: string;
  percentualCheio: number;
  qtdLocais: number;
  codigoFrota: number;
}
