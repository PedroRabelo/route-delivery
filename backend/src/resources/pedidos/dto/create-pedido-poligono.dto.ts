import { IsNotEmpty, IsNumber } from "class-validator";
import { CreatePedidoPoligonoCoords } from "./create-pedido-poligono-coords.dto";

export class CreatePedidoPoligonoDto {
  @IsNumber()
  roteiroId: number;

  @IsNotEmpty()
  coordenadas: CreatePedidoPoligonoCoords[];
}