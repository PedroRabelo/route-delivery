import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteRouteVehicleDTO {
  @IsNumber()
  @IsNotEmpty()
  roteiroId: number;

  @IsNumber()
  @IsNotEmpty()
  veiculoId: number;
}