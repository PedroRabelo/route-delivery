import { IsNumber, IsOptional } from "class-validator";

export class CreateCoordenadasDto {
  @IsOptional()
  zonaId?: number;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}