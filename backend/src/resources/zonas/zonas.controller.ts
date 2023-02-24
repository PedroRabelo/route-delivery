import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateZonaDto } from './dto/create-zona.dto';
import { ZonasService } from './zonas.service';

@Controller('zonas')
export class ZonasController {
  constructor(private readonly zonasService: ZonasService) { }

  @Post()
  create(@Body() createZonaDto: CreateZonaDto) {
    return this.zonasService.create(createZonaDto);
  }

  @Get()
  findAll() {
    return this.zonasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.zonasService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zonasService.remove(+id);
  }
}
