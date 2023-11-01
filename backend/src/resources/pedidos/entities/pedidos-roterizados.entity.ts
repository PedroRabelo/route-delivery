import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'PEDIDOS_ROTERIZADOS' })
export class PedidosRoterizados {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pedido_id' })
  pedidoId: number;

  @Column({ name: 'veiculo_id' })
  veiculoId: number;
}