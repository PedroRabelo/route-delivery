import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreatePedidoDto {
  @IsDate()
  entrega: Date;

  @IsString()
  codigoCliente: string;

  @IsString()
  cliente: string;

  @IsNumber()
  ped: number;

  @IsString()
  idEntrega: string;

  @IsString()
  cep: string;

  @IsString()
  endereco: string;

  @IsNumber()
  numero: string;

  @IsString()
  bairro: string;

  @IsString()
  cidade: string;

  @IsString()
  estado: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  total: number;

  @IsNumber()
  bruto: number;

  @IsString()
  tipoServico: string;
}
