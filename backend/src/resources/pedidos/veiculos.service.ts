import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';
import { Veiculo } from './entities/veiculo.entity';

@Injectable()
export class VeiculosService {
  constructor(
    @InjectRepository(Veiculo)
    private veiculoRepository: Repository<Veiculo>,
  ) { }

  async create(createVeiculoDto: CreateVeiculoDto) {
    try {
      const veiculoExiste = await this.veiculoRepository.findOne({
        where: { placa: createVeiculoDto.placa },
      });

      if (veiculoExiste) {
        throw new NotFoundException('Veículo já existe');
      }

      const data = {
        ativo: true,
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
      return this.veiculoRepository.find({
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

      this.veiculoRepository.update(veiculoId, updateVeiculoDto);
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
      this.veiculoRepository.update(veiculoId, updateVeiculoDto);
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
}
