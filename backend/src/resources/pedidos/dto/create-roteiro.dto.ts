import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreatePedidoDto } from './create-pedido.dto';

export class CreateRoteiroDto {
  @IsNotEmpty()
  dataEntrega: Date;

  @IsNumber()
  entregasPorVeiculo: number;

  @IsNumber()
  areaMaxima: number;

  @IsNotEmpty()
  pedidos: CreatePedidoDto[];
}
