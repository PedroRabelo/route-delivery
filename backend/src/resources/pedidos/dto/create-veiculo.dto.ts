import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVeiculoDto {
  @IsString()
  @IsNotEmpty()
  placa: string;

  @IsNumber()
  @IsNotEmpty()
  capacidade: number;

  @IsNumber()
  @IsOptional()
  ativo?: number;
}
