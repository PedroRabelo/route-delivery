import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVeiculoZonaDto } from '../zonas/dto/create-veiculo-zona.dto';
import { VeiculoZona } from '../zonas/entities/veiculo-zona.entity';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';
import { Veiculo } from './entities/veiculo.entity';

@Injectable()
export class VeiculosService {
  constructor(
    @InjectRepository(Veiculo)
    private veiculoRepository: Repository<Veiculo>,
    @InjectRepository(VeiculoZona)
    private veiculoZonaRepository: Repository<VeiculoZona>
  ) { }

  async create(createVeiculoDto: CreateVeiculoDto) {
    try {
      const veiculoExiste = await this.veiculoRepository.findOne({
        where: { placa: createVeiculoDto.placa },
      });

      if (veiculoExiste) {
        throw new NotFoundException('Veículo já existe');
      }

      const capacidadeLiberada = (createVeiculoDto.capacidade * createVeiculoDto.percentualCheio) / 100;

      const data = {
        ativo: true,
        capacidadeLiberada,
        ...createVeiculoDto,
      };

      return await this.veiculoRepository.save(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getVeiculos() {
    try {
      return await this.veiculoRepository.find({
        order: { capacidade: { direction: 'DESC' } },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateVeiculo(veiculoId: number, updateVeiculoDto: UpdateVeiculoDto) {
    try {
      const veiculoExiste = await this.veiculoRepository.findOne({
        where: { placa: updateVeiculoDto.placa },
      });

      if (veiculoExiste && veiculoExiste.id !== veiculoId) {
        throw new NotFoundException(
          'Placa informada já está cadastrada para outro veículo',
        );
      }

      const capacidadeLiberada = (updateVeiculoDto.capacidade * updateVeiculoDto.percentualCheio) / 100;

      const data = {
        capacidadeLiberada,
        ...updateVeiculoDto
      }

      await this.veiculoRepository.update(veiculoId, data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateStatusVeiculo(
    veiculoId: number,
    updateVeiculoDto: UpdateVeiculoDto,
  ) {
    try {
      await this.veiculoRepository.update(veiculoId, updateVeiculoDto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteVeiculo() {
    try {
      //this.veiculoRepository.delete()
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async saveVeiculoZona(createVeiculoZonaDto: CreateVeiculoZonaDto) {
    try {
      await this.veiculoZonaRepository.save(createVeiculoZonaDto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllZonas(veiculoId: number) {
    try {
      const response = await this.veiculoZonaRepository.find({
        where: {
          veiculoId
        },
        select: {
          zonaId: true
        }
      });

      const zones = response.map((zone) => zone['zonaId'])
      return zones;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async removeVeiculoZona(veiculoId: number, zonaId: number) {
    try {
      await this.veiculoZonaRepository.delete({
        veiculoId,
        zonaId
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
