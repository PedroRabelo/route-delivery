import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { convertLatLongFloat } from 'src/common/utils/convertLatLongFloat';
import { slicePedidosIntoChunks } from 'src/common/utils/sliceArrayIntoChunks';
import { validadeFileData } from 'src/common/utils/validadeFileData';
import { Repository } from 'typeorm';
import { ChangeVeiculoPedido } from './dto/change-veiculo-pedido.dto';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { PedidoParamsDto } from './dto/pedido-params.dto';
import { UpdateRoteiroDto } from './dto/update-roteiro.dto';
import { Pedido } from './entities/pedido.entity';
import { Roteiro } from './entities/roteiro.entity';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
    @InjectRepository(Roteiro)
    private roteiroRepository: Repository<Roteiro>,
  ) { }

  async create(createPedidoDto: CreatePedidoDto[]) {
    try {
      let dataFormatada: Date;

      console.log(createPedidoDto[0].entrega instanceof Date);


      if (createPedidoDto[0].entrega instanceof Date) {
        dataFormatada = createPedidoDto[0].entrega;
      } else {
        const dataEntregaString = (createPedidoDto[0].entrega as string).toString();

        const dataEntregaSplit = dataEntregaString.split('/');

        dataFormatada = new Date(
          +dataEntregaSplit[2],
          +dataEntregaSplit[1] - 1,
          +dataEntregaSplit[0],
        );
      }

      for await (const pedido of createPedidoDto) {
        const pedidoValido = validadeFileData(pedido);

        if (
          pedidoValido.latitude.toString() !== null ||
          pedidoValido.latitude.toString() !== ''
        ) {
          pedidoValido.latitude = convertLatLongFloat(pedidoValido.latitude);
        }

        if (
          pedidoValido.longitude.toString() !== null ||
          pedidoValido.longitude.toString() !== ''
        ) {
          pedidoValido.longitude = convertLatLongFloat(pedidoValido.longitude);
        }

        pedidoValido.entrega = dataFormatada;
      }

      console.log(dataFormatada);

      const roteiroCadastrado = await this.roteiroRepository.findOne({
        where: { dataEntrega: dataFormatada },
      });

      let roteiro = new Roteiro();
      if (roteiroCadastrado) {
        await this.pedidoRepository.query(
          'delete from PEDIDOS where Entrega = @0',
          [dataFormatada],
        );
        roteiro = roteiroCadastrado;

        roteiro.status = 'AGUARDANDO_LAT_LONG';
        await this.roteiroRepository.save(roteiro);
      } else {
        const novoRoteiro = new Roteiro();
        novoRoteiro.dataEntrega = dataFormatada;
        novoRoteiro.status = 'AGUARDANDO_LAT_LONG';

        await this.roteiroRepository.save(novoRoteiro);
        roteiro = novoRoteiro;
      }

      roteiro.pedidos = [];
      for await (const dto of createPedidoDto) {
        const pedido = new Pedido(dto);
        pedido.roteiro = roteiro;
        roteiro.pedidos.push(pedido);
      }

      const chunkPedidos = await slicePedidosIntoChunks(roteiro.pedidos, 100);

      try {
        chunkPedidos.map(async (pedidos) => {
          await this.pedidoRepository.save(pedidos);
        });

        // this.getEnderecosPedidos(roteiro.id);

        return {
          id: roteiro.id,
          data: roteiro.dataEntrega,
          status: roteiro.status,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //@Cron(CronExpression.EVERY_MINUTE)
  getEnderecosPedidos(roteiroId: number) {
    try {
      console.log(`exec [VERIFICA_CADASTRO] ${roteiroId}`);

      this.roteiroRepository.query('exec [VERIFICA_CADASTRO] @0', [roteiroId]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async generateRoutes(params: PedidoParamsDto) {
    try {
      console.log(
        `exec [RT_SP2] '${params.startDate}', ${params.distance}, ${params.area1}, ${params.area2}`,
      );

      await this.pedidoRepository.query('exec [RT_SP2] @0, @1, @2, @3', [
        params.startDate,
        params.distance,
        params.area1,
        params.area2,
      ]);

      return 'OK';
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAllByRoteiro(id: number): Promise<Pedido[]> {
    return await this.pedidoRepository.query(
      `
      SELECT 
        PED.ID as id, 
        VEIC.PLACA as placa, 
        PED.CLIENTE as cliente, 
        PED.LATITUDE as latitude, 
        PED.LONGITUDE as longitude, 
        VEIC.ORD_CAR as ordem,
        PED.Bruto as peso,
        PED.Total as valor
      FROM 
        PEDIDOS PED 
        INNER JOIN VEICULOS VEIC ON VEIC.ID = PED.ID_VEICULO 
      WHERE 
        PED.roteiroId = @0
      `,
      [id],
    );
  }

  async getVehiclesDelivery(id: number) {
    return await this.pedidoRepository.query(
      `
      SELECT
        VEIC.ID as id,
        VEIC.ORD_CAR as ordem,
        VEIC.PLACA as placa,
        VEIC.CAPACIDADE as capacidade,
        VEIC.RODIZIO as rodizio,
        COUNT(DISTINCT(id_pedidos_locais)) as locais,
        COUNT(*) as pedidos,
        SUM(PED.BRUTO) as peso,
        SUM(PED.TOTAL) as valor,
        (SUM(PED.BRUTO) * 100) / VEIC.CAPACIDADE as percentual
      FROM 
        PEDIDOS PED
        INNER JOIN VEICULOS VEIC ON VEIC.ID = PED.ID_VEICULO
      WHERE 
        PED.roteiroId=@0
      GROUP BY VEIC.ID, VEIC.ORD_CAR,VEIC.PLACA,VEIC.CAPACIDADE,VEIC.RODIZIO
      ORDER BY percentual
      `,
      [id],
    );
  }

  async getDeliveriesReport(id: number, dto: UpdateRoteiroDto) {
    await this.roteiroRepository.save({
      id: id,
      status: 'PROCESSADO',
      distancia: dto.distance,
      area1: dto.area1,
      area2: dto.area2,
    });

    return await this.pedidoRepository.query(
      `
      SELECT
        CONVERT(VARCHAR,ped.ENTREGA,103) entrega,
        COD_CLIENTE codigoCliente,
        cliente,
        ped,
        id_entrega identrega,
        cep,
        endereco,
        numero,
        bairro,
        cidade,
        estado,
        latitude,
        longitude,
        total,
        bruto,
        vei.PLACA placa,
        obs
      FROM
        PEDIDOS ped
        LEFT JOIN VEICULOS vei on ped.ID_VEICULO = vei.ID 
      WHERE
        roteiroId= @0
      `,
      [id],
    );
  }

  async getRoutes() {
    try {
      const roteiros = await this.roteiroRepository.find({
        order: { dataEntrega: 'DESC' },
      });
      return roteiros?.map((res) => ({
        id: res.id,
        data: res.dataEntrega,
        status: res.status,
      }));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findRoteiroById(id: number) {
    try {
      const roteiro = await this.roteiroRepository.findOne({
        where: { id },
      });

      if (roteiro === null) {
        throw new Error('Roteiro não encontrado com o id informado');
      }

      return {
        id: roteiro.id,
        data: roteiro.dataEntrega,
        status: roteiro.status,
        area1: roteiro.area1,
        area2: roteiro.area2,
        distance: roteiro.distancia,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getDeliveriesWithoutVehicle(id: number) {
    return await this.pedidoRepository.query(
      `
      SELECT
        PED.ID as id, 
        PED.COD_CLIENTE as codigoCliente,
        '' as placa, 
        PED.CLIENTE as cliente, 
        PED.LATITUDE as latitude, 
        PED.LONGITUDE as longitude, 
        0 as ordem,
        PED.Bruto as peso,
        PED.Total as valor,
        PED.OBS as observacao 
      FROM 
        PEDIDOS PED 
      WHERE 
        PED.ID_VEICULO IS NULL 
        AND PED.roteiroId = @0  
      `,
      [id],
    );
  }

  async remove(id: number): Promise<void> {
    await this.pedidoRepository.delete(id);
  }

  async changeVehicles(dto: ChangeVeiculoPedido) {
    const pedidosVeiculo1 = await this.pedidoRepository.find({
      where: {
        roteiro: { id: dto.roteiroId },
        veiculoId: dto.veiculo1Id
      }
    });

    const pedidosVeiculo2 = await this.pedidoRepository.find({
      where: {
        roteiro: { id: dto.roteiroId },
        veiculoId: dto.veiculo2Id
      }
    });

    const novoVeiculoPedidos1: Pedido[] = pedidosVeiculo1.map((vei1) => {
      return {
        ...vei1,
        veiculoId: dto.veiculo2Id,
        placa: dto.placa2,
      }
    });

    const novoVeiculoPedidos2: Pedido[] = pedidosVeiculo2.map((vei2) => {
      return {
        ...vei2,
        veiculoId: dto.veiculo1Id,
        placa: dto.placa1,
      }
    });

    await this.pedidoRepository.save(novoVeiculoPedidos1);
    await this.pedidoRepository.save(novoVeiculoPedidos2);
  }
}
