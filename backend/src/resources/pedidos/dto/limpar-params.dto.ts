import { IsNotEmpty } from 'class-validator';

export class LimparParamsDto {
  @IsNotEmpty()
  startDate: string;
}
