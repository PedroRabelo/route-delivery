import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VeiculoZona } from '../zonas/entities/veiculo-zona.entity';
import { PedidoLocal } from './entities/pedido-local.entity';
import { PedidoPoligonoCoords } from './entities/pedido-poligono-coords.entity';
import { PedidoPoligono } from './entities/pedido-poligono.entity';
import { Pedido } from './entities/pedido.entity';
import { PedidosRoterizados } from './entities/pedidos-roterizados.entity';
import { Roteiro } from './entities/roteiro.entity';
import { Veiculo } from './entities/veiculo.entity';
import { PedidosLocaisController } from './pedidos-locais.controller';
import { PedidosLocaisService } from './pedidos-locais.service';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { RastreamentoController } from './rastreamento.controller';
import { RastreamentoService } from './rastreamento.service';
import { VeiculosController } from './veiculos.controller';
import { VeiculosService } from './veiculos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pedido,
      Roteiro,
      Veiculo,
      VeiculoZona,
      PedidoPoligono,
      PedidoPoligonoCoords,
      PedidosRoterizados,
      PedidoLocal
    ]),
  ],
  controllers: [PedidosController, VeiculosController, RastreamentoController, PedidosLocaisController],
  providers: [PedidosService, VeiculosService, RastreamentoService, PedidosLocaisService],
})
export class PedidosModule { }
