import { IsNotEmpty, IsString } from "class-validator";
import { CreateCoordenadasDto } from "./create-coordenadas.dto";

export class CreateZonaDto {
  @IsString()
  titulo: string;
  @IsNotEmpty()
  coordenadas: CreateCoordenadasDto[];
}
