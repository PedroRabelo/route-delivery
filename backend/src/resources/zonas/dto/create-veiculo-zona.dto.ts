import { IsNumber } from "class-validator";

export class CreateVeiculoZonaDto {
  @IsNumber()
  zonaId: number;

  @IsNumber()
  veiculoId: number;

  @IsNumber()
  prioridade: number;
}