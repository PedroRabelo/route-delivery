import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoordenadasDto } from './dto/create-coordenadas.dto';
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';
import { ZonaCoords } from './entities/zona-coords.entity';
import { Zona } from './entities/zona.entity';

@Injectable()
export class ZonasService {

  constructor(
    @InjectRepository(Zona)
    private zonaRepository: Repository<Zona>,
    @InjectRepository(ZonaCoords)
    private zonaCoordsRepository: Repository<ZonaCoords>
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

  async updateZona(zonaId: number, updateZonaDto: UpdateZonaDto) {
    try {
      const zonaExiste = await this.zonaRepository.findOne({
        where: { titulo: updateZonaDto.titulo }
      });

      if (zonaExiste && zonaExiste.id !== zonaId) {
        throw new NotFoundException(
          'Título informado já está cadastrado para outra zona',
        );
      }

      await this.zonaCoordsRepository.delete({
        zona: {
          id: zonaId
        }
      });

      const coords: CreateCoordenadasDto[] = updateZonaDto.coordenadas.map((coord) => {
        return {
          zonaId,
          latitude: coord.latitude,
          longitude: coord.longitude
        }
      })

      await this.zonaCoordsRepository.save(coords);

      const zonaData: UpdateZonaDto = {
        titulo: updateZonaDto.titulo
      }

      await this.zonaRepository.update(zonaId, zonaData);
    } catch (error) {
      console.log(error);
      throw error;
    }
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
