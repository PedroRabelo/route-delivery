import { Controller, Get } from '@nestjs/common';
import { RastreamentoService } from './rastreamento.service';

@Controller('rastreamento')
export class RastreamentoController {
  constructor(private readonly rastreamentoService: RastreamentoService) {}

  @Get()
  getVeiculos() {
    return this.rastreamentoService.trackVehicles();
  }
}
