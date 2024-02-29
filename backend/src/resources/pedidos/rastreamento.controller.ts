import { Controller, Get, Param } from '@nestjs/common';
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
  routesDirection() {
    return this.rastreamentoService.routesDirection();
  }

  @Get('deliveries/:truck')
  deliveriesByTruck(@Param('truck') truck: string) {
    return this.rastreamentoService.deliveriesByTruck(truck);
  }
}
