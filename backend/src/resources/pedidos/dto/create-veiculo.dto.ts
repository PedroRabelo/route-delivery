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

  @IsBoolean()
  @IsOptional()
  temRodizio: boolean;

  @IsNumber()
  percentualCheio: number;

  @IsNumber()
  qtdLocais: number;

  @IsNumber()
  @IsOptional()
  codigoFrota: number;

  @IsNumber()
  @IsOptional()
  prioridade: number;

  @IsNumber()
  @IsOptional()
  pesoMinimo: number;

  @IsNumber()
  @IsOptional()
  qtdMinLocais: number;
}
