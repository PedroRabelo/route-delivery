import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CreateVeiculoZonaDto } from '../zonas/dto/create-veiculo-zona.dto';
import { UpdateVeiculoZonaDto } from '../zonas/dto/update-veiculo-zona.dto';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';
import { VeiculosService } from './veiculos.service';

@Controller('veiculos')
export class VeiculosController {
  constructor(private readonly veiculosService: VeiculosService) { }

  @Post()
  create(@Body() createVeiculoDto: CreateVeiculoDto) {
    return this.veiculosService.create(createVeiculoDto);
  }

  @Get()
  getVeiculos() {
    return this.veiculosService.getVeiculos();
  }

  @Patch(':id')
  updateStatusVeiculo(
    @Param('id') id: string,
    @Body() updateVeiculoDto: UpdateVeiculoDto,
  ) {
    return this.veiculosService.updateStatusVeiculo(+id, updateVeiculoDto);
  }

  @Put(':id')
  updateVeiculo(
    @Param('id') id: string,
    @Body() updateVeiculoDto: UpdateVeiculoDto,
  ) {
    return this.veiculosService.updateVeiculo(+id, updateVeiculoDto);
  }

  @Post('zona')
  createVeiculoZona(@Body() createVeiculoZonaDto: CreateVeiculoZonaDto) {
    return this.veiculosService.saveVeiculoZona(createVeiculoZonaDto);
  }

  @Patch('zonas/:veiculoId/:zonaId')
  updateZonaVeiculo(
    @Param('veiculoId') id: string,
    @Param('zonaId') zonaId: string,
    @Body() updateVeiculoZonaDto: UpdateVeiculoZonaDto,
  ) {
    return this.veiculosService.updateZonaVeiculo(+id, +zonaId, updateVeiculoZonaDto);
  }

  @Get('zonas/:veiculoId')
  getVeiculoZonas(@Param('veiculoId') veiculoId: string) {
    return this.veiculosService.getAllZonas(+veiculoId);
  }

  @Delete(':veiculoId/zona/:id')
  deleteZona(@Param('veiculoId') veiculoId: string, @Param('id') id: string) {
    return this.veiculosService.removeVeiculoZona(+veiculoId, +id);
  }

  @Delete(':veiculoId/')
  deleteVeiculo(@Param('veiculoId') veiculoId: string) {
    return this.veiculosService.deleteVeiculo(+veiculoId);
  }
}
