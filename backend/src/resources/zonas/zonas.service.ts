import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateZonaDto } from './dto/create-zona.dto';
import { Zona } from './entities/zona.entity';

@Injectable()
export class ZonasService {

  constructor(
    @InjectRepository(Zona)
    private zonaRepository: Repository<Zona>
  ) { }

  async create(createZonaDto: CreateZonaDto) {
    try {
      const zonaExiste = await this.zonaRepository.findOne({
        where: { titulo: createZonaDto.titulo }
      });

      if (zonaExiste) {
        throw new NotFoundException('Zona já existe');
      }

      return await this.zonaRepository.save(createZonaDto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll() {
    try {
      return this.zonaRepository.find({
        order: { titulo: { direction: 'ASC' } }
      })
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} zona`;
  }

  remove(id: number) {
    try {
      this.zonaRepository.softDelete(id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
