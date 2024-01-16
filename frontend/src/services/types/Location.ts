export type Location = {
  id: number;
  nome: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  latitude: number;
  longitude: number;
  verificarLocal: boolean;
  tempoEstimadoEntrega: string;
  tempoEstimadoCarga: string;
  latLongManual: boolean;
  clientesLocal: number;
  enderecoColetivo: boolean;
  zonaRisco: boolean;
  observacao: string;
  restritivoHorario: boolean;
}