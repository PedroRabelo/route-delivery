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
};

export type SaveVehicleDTO = {
  placa: string;
  capacidade: number;
  temRodizio: boolean;
  percentualCheio: number;
  qtdLocais: number;
  codigoFrota: number;
  prioridade: number;
}
