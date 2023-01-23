import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateRoteiroDto {
  @IsNotEmpty()
  @IsNumber()
  deliveries: number;

  @IsNotEmpty()
  @IsNumber()
  area: number;
}
