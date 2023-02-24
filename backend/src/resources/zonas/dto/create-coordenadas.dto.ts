import { IsNumber } from "class-validator";

export class CreateCoordenadasDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}