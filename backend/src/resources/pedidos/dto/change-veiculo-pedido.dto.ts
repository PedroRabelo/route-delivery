import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChangeVeiculoPedido {
  @IsNumber()
  @IsNotEmpty()
  roteiroId: number;

  @IsNumber()
  @IsNotEmpty()
  veiculo1Id: number;

  @IsString()
  @IsNotEmpty()
  placa1: string;

  @IsNumber()
  @IsNotEmpty()
  veiculo2Id: number;

  @IsString()
  @IsNotEmpty()
  placa2: string;
}