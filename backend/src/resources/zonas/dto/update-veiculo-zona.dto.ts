import { IsNumber } from "class-validator";

export class UpdateVeiculoZonaDto {
  @IsNumber()
  prioridade: number;
}