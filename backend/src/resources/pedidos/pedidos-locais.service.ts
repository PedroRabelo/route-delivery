import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Like, MoreThan, Repository } from "typeorm";
import { LocaisFilter } from "./dto/locais-filter.dto";
import { UpdateLocalDto } from "./dto/update-local";
import { PedidoLocal } from "./entities/pedido-local.entity";

@Injectable()
export class PedidosLocaisService {
  constructor(
    @InjectRepository(PedidoLocal)
    private pedidoLocaisRepository: Repository<PedidoLocal>
  ) { }

  async listPedidosLocais(filters: LocaisFilter) {
    const where: FindOptionsWhere<PedidoLocal>[] = [];

    if (filters.id !== undefined && !Number.isNaN(filters.id)) {
      where.push({ id: filters.id })
    }

    if (filters.cep !== undefined && filters.cep !== '') {
      where.push({ cep: filters.cep })
    }

    if (filters.endereco !== undefined && filters.endereco !== '') {
      where.push({ endereco: Like(`%${filters.endereco}%`) })
    }

    if (where.length === 0) {
      where.push({ id: MoreThan(0) })
    }

    return await this.pedidoLocaisRepository.find({
      where,
      order: {
        id: 'ASC'
      }
    })
  }

  async update(id: number, dto: UpdateLocalDto) {
    try {
      await this.pedidoLocaisRepository.update(id, dto)
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}