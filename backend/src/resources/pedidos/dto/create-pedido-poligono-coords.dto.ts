import { IsNumber } from "class-validator";

export class CreatePedidoPoligonoCoords {
  @IsNumber()
  pedidoPoligonoId?: number;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}