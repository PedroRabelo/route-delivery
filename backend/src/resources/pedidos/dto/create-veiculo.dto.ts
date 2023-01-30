import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVeiculoDto {
  @IsString()
  @IsNotEmpty()
  placa: string;

  @IsNumber()
  @IsNotEmpty()
  capacidade: number;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @IsString()
  @IsNotEmpty()
  rodizio: string;

  @IsNumber()
  percentualCheio: number;

  @IsNumber()
  qtdLocais: number;

  @IsNumber()
  @IsOptional()
  codigoFrota: number;
}
