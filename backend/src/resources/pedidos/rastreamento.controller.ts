import { Controller, Get } from '@nestjs/common';
import { RastreamentoService } from './rastreamento.service';

@Controller('rastreamento')
export class RastreamentoController {
  constructor(private readonly rastreamentoService: RastreamentoService) { }

  @Get()
  getVeiculos() {
    return this.rastreamentoService.trackVehicles();
  }

  @Get('routes')
  trackRoutes() {
    return this.rastreamentoService.trackRoutes();
  }

  @Get('direction')
  RoutesDirection() {
    return this.rastreamentoService.routesDirection();
  }
}
