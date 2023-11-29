import { IsNotEmpty, IsNumber } from 'class-validator';

export class PedidoParamsDto {
  @IsNotEmpty()
  @IsNumber()
  roteiroId: number;

  @IsNotEmpty()
  @IsNumber()
  distance: number;

  @IsNotEmpty()
  @IsNumber()
  area1: number;

  @IsNotEmpty()
  @IsNumber()
  area2: number;
}
