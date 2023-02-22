import { Injectable } from '@nestjs/common';
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';

@Injectable()
export class ZonasService {
  create(createZonaDto: CreateZonaDto) {
    return 'This action adds a new zona';
  }

  findAll() {
    return `This action returns all zonas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} zona`;
  }

  update(id: number, updateZonaDto: UpdateZonaDto) {
    return `This action updates a #${id} zona`;
  }

  remove(id: number) {
    return `This action removes a #${id} zona`;
  }
}
