import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';
import { VeiculosService } from './veiculos.service';

@Controller('veiculos')
export class VeiculosController {
  constructor(private readonly veiculosService: VeiculosService) {}

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
}
