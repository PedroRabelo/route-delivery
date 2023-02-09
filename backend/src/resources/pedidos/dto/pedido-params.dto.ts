import { IsNotEmpty, IsNumber } from 'class-validator';

export class PedidoParamsDto {
  @IsNotEmpty()
  startDate: string;

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
