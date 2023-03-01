import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { Roteiro } from './entities/roteiro.entity';
import { Veiculo } from './entities/veiculo.entity';
import { VeiculosController } from './veiculos.controller';
import { VeiculosService } from './veiculos.service';
import { VeiculoZona } from '../zonas/entities/veiculo-zona.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, Roteiro, Veiculo, VeiculoZona])],
  controllers: [PedidosController, VeiculosController],
  providers: [PedidosService, VeiculosService],
})
export class PedidosModule { }
