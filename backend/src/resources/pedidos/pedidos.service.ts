import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { convertLatLongFloat } from 'src/common/utils/convertLatLongFloat';
import { slicePedidosIntoChunks } from 'src/common/utils/sliceArrayIntoChunks';
import { validadeFileData } from 'src/common/utils/validadeFileData';
import { Repository } from 'typeorm';
import { ChangeVeiculoPedido } from './dto/change-veiculo-pedido.dto';
import { CreatePedidoPoligonoDto } from './dto/create-pedido-poligono.dto';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { DeleteRouteVehicleDTO } from './dto/delete-route-vehicle.dto';
import { PedidoParamsDto } from './dto/pedido-params.dto';
import { UpdatePedidoVeiculoPoligonoDto } from './dto/update-pedido-veiculo-poligono.dto';
import { UpdateRoteiroDto } from './dto/update-roteiro.dto';
import { PedidoPoligono } from './entities/pedido-poligono.entity';
import { Pedido } from './entities/pedido.entity';
import { PedidosRoterizados } from './entities/pedidos-roterizados.entity';
import { Roteiro } from './entities/roteiro.entity';
import { Veiculo } from './entities/veiculo.entity';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
    @InjectRepository(Roteiro)
    private roteiroRepository: Repository<Roteiro>,
    @InjectRepository(Veiculo)
    private veiculoRepository: Repository<Veiculo>,
    @InjectRepository(PedidoPoligono)
    private pedidoPoligonoRepository: Repository<PedidoPoligono>,
    @InjectRepository(PedidosRoterizados)
    private pedidoRoterizadoRepository: Repository<PedidosRoterizados>,
  ) { }

  async create(createPedidoDto: CreatePedidoDto[]) {
    try {
      let dataFormatada: Date;

      if (createPedidoDto[0].entrega instanceof Date) {
        dataFormatada = createPedidoDto[0].entrega;
      } else {
        const dataEntregaString = (
          createPedidoDto[0].entrega as string
        ).toString();

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

      let roteiro = new Roteiro();

      const novoRoteiro = new Roteiro();
      novoRoteiro.dataEntrega = dataFormatada;
      novoRoteiro.status = 'AGUARDANDO_LAT_LONG';
      novoRoteiro.dataInclusao = new Date();

      await this.roteiroRepository.save(novoRoteiro);
      roteiro = novoRoteiro;

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
          dataInclusao: roteiro.dataInclusao,
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
        `exec [RT_SP2] ${params.roteiroId}, ${params.distance}, ${params.area1}, ${params.area2}`,
      );

      await this.pedidoRepository.query('exec [RT_SP2] @0, @1, @2, @3', [
        params.roteiroId,
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
        PED.Total as valor,
        PED.ordem as ordemPedido
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
        EXEC SP_BuscaEntregasPorRoteiro @0
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
        order: { id: 'DESC' },
      });

      return roteiros?.map((res) => ({
        id: res.id,
        data: res.dataEntrega,
        status: res.status,
        dataInclusao: res.dataInclusao,
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
        veiculoId: dto.veiculo1Id,
      },
    });

    const pedidosVeiculo2 = await this.pedidoRepository.find({
      where: {
        roteiro: { id: dto.roteiroId },
        veiculoId: dto.veiculo2Id,
      },
    });

    if (pedidosVeiculo1 !== null && pedidosVeiculo1.length > 0) {
      const novoVeiculoPedidos1: Pedido[] = pedidosVeiculo1.map((vei1) => {
        return {
          ...vei1,
          veiculoId: dto.veiculo2Id,
          placa: dto.placa2,
        };
      });

      await this.pedidoRepository.save(novoVeiculoPedidos1);
    }

    if (pedidosVeiculo2 !== null && pedidosVeiculo2.length > 0) {
      const novoVeiculoPedidos2: Pedido[] = pedidosVeiculo2.map((vei2) => {
        return {
          ...vei2,
          veiculoId: dto.veiculo1Id,
          placa: dto.placa1,
        };
      });

      await this.pedidoRepository.save(novoVeiculoPedidos2);
    }

    await this.veiculoRepository.update(dto.veiculo1Id, { ordem: dto.ordem2 });
    await this.veiculoRepository.update(dto.veiculo2Id, { ordem: dto.ordem1 });
  }

  async removeVehicleRoute(dto: DeleteRouteVehicleDTO) {
    try {
      const deliveries = await this.pedidoRepository.find({
        where: {
          veiculoId: dto.veiculoId,
          roteiro: {
            id: dto.roteiroId,
          },
        },
      });

      if (deliveries.length === 0) {
        throw new Error('Nenhum pedido encontrado com o veículo informado.');
      }

      deliveries.map(async (d) => {
        await this.pedidoRepository.update(d.id, {
          veiculoId: null,
          placa: null,
        });
      });

      await this.veiculoRepository.update(dto.veiculoId, {
        possuiPedidos: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async createPedidoPoligono(createPedidoPoligonoDto: CreatePedidoPoligonoDto) {
    try {
      const pedidoPoligono = await this.pedidoPoligonoRepository.save(
        createPedidoPoligonoDto,
      );

      await this.pedidoRepository.query(`EXEC gerar_poligono_pedidos @0, @1`, [
        createPedidoPoligonoDto.roteiroId,
        pedidoPoligono.id,
      ]);

      const resumo = await this.pedidoRepository.query(
        `
        SELECT 
          pp.ID id,
        	pp.locais,
        	pp.notas,
        	pp.peso_total pesoTotal,
        	pp.valor_total valorTotal,
        	pp.loc_rod locaisRodizio,
        	pp.notas_rod notasRodizio,
        	pp.peso_rod pesoRodizio,
        	pp.valor_rod valorRodizio,
        	pp.loc_fora_Rod locaisForaRodizio,
        	pp.notas_fora_rod notasForaRodizio,
        	pp.peso_fora_rod pesoForaRodizio,
        	pp.valor_fora_rod valorForaRodizio
        FROM 
        	PEDIDOS_POLIGONO pp  
        WHERE 
        	pp.ID = @0;
        `,
        [pedidoPoligono.id],
      );

      const pedidos = await this.pedidoRepository.query(
        `
        SELECT 
         ped.ID as id, 
         vei.PLACA as placa, 
         ped.CLIENTE as cliente, 
         ped.LATITUDE as latitude, 
         ped.LONGITUDE as longitude, 
         ped.ordem as ordem,
         ped.Bruto as peso,
         ped.Total as valor
        FROM 
        	PEDIDOS_POLIGONO_ITENS ppi 
        	INNER JOIN PEDIDOS ped on ppi.pedido_id = ped.ID 
         	LEFT JOIN VEICULOS vei ON vei.ID = ped.ID_VEICULO 
        WHERE
        	ppi.pedido_poligono_id = @0
        ORDER BY 
        	1;
        `,
        [pedidoPoligono.id],
      );

      const veiculos = await this.veiculoRepository.query(
        `
        SELECT 
        	v.ID id,
        	v.PLACA placa,
        	v.CAPACIDADE capacidade,
        	v.ativo ativo,
        	v.ESTA_RODIZIO temRodizio,
        	v.PERC_CHEIO percentualCheio,
        	v.MAX_LOCAL qtdLocais,
        	v.COD_FROTA codigoFrota,
        	v.PESO_MINIMO pesoMinimo,
        	v.MIN_LOCAL qtdMinLocais
        FROM 
        	dbo.VEICULOS v 
        WHERE 
        	v.ativo = 1
        	AND USADO = 0
        ORDER BY 
        	PRI_ESCOLHA 
        `,
      );

      return {
        resumo,
        pedidos,
        veiculos,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async saveDeliveriesPolygon(dto: UpdatePedidoVeiculoPoligonoDto) {
    // const ordem = await this.pedidoRepository.query(
    //   `
    //   select max(ISNULL(v.ORD_CAR , 0) + 1) ordem from VEICULOS v inner join PEDIDOS p on v.ID  = p.ID_VEICULO where p.roteiroId = @0
    //   `,
    //   [dto.roteiroId],
    // );

    dto.pedidos.map(async (d) => {
      await this.pedidoRepository.update(d, {
        veiculoId: dto.veiculoId,
        placa: dto.placa,
      });
      await this.pedidoRoterizadoRepository.save({
        pedidoId: d,
        veiculoId: dto.veiculoId,
      });
    });

    await this.veiculoRepository.update(dto.veiculoId, { possuiPedidos: true });
  }

  async getAreaRodizio() {
    const area = await this.pedidoRepository.query(
      `
      SELECT
        arll.ID id,
        arll.LATITUDE latitude,
        arll.LONGITUDE longitude 
      FROM
        AREA_RODIZIO_LAT_LONG arll 
      ORDER BY
        ID
      `,
    );

    if (area.length > 0) {
      area.push(area[0]);
    }

    return area;
  }

  async clearRoutesByDate(routeDate: string) {
    await this.pedidoRepository.query(
      `
        exec limpar_tudo @0
      `,
      [routeDate],
    );
  }

  async clearPolygonByDate(routeDate: string) {
    await this.pedidoRepository.query(
      `
        exec limpar_poligono @0
      `,
      [routeDate],
    );
  }
}
