import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateRoteiroDto {
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
