import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class LocaisFilter {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  id: number;

  @IsOptional()
  @IsString()
  cep: string;

  @IsOptional()
  @IsString()
  endereco: string;
}