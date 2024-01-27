import { IsBoolean, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateLocalDto {
  @IsOptional()
  @IsString()
  nome: string;

  @IsOptional()
  @IsBoolean()
  verificarLocal: boolean;

  @IsOptional()
  @IsString()
  tempoEstimadoEntrega: string;

  @IsOptional()
  @IsString()
  tempoEstimadoCarga: string;

  @IsOptional()
  @IsBoolean()
  latLongManual: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  clientesLocal: number;

  @IsOptional()
  @IsBoolean()
  enderecoColetivo: boolean;

  @IsOptional()
  @IsBoolean()
  zonaRisco: boolean;

  @IsOptional()
  @IsString()
  observacao: string;

  @IsOptional()
  @IsBoolean()
  restritivoHorario: boolean;

  @IsOptional()
  @IsNumber()
  latitude: number;

  @IsOptional()
  @IsNumber()
  longitude: number;
}