import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdatePedidoVeiculoPoligonoDto {
  @IsNotEmpty()
  pedidos: number[];
  @IsNotEmpty()
  @IsNumber()
  veiculoId: number;
  @IsNotEmpty()
  @IsString()
  placa: string;
}