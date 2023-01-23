import { IsNotEmpty, IsNumber } from 'class-validator';

export class PedidoParamsDto {
  @IsNotEmpty()
  startDate: string;

  @IsNotEmpty()
  @IsNumber()
  deliveries: number;

  @IsNotEmpty()
  @IsNumber()
  area: number;
}
