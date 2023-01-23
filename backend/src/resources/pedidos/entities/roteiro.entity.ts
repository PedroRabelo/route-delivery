import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pedido } from './pedido.entity';

@Entity({ name: 'ROTEIROS' })
export class Roteiro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'data_entrega' })
  dataEntrega: Date;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'entregas_por_veiculo' })
  entregasPorVeiculo: number;

  @Column({ name: 'area_maxima' })
  areaMaxima: number;

  @OneToMany(() => Pedido, (pedido) => pedido.roteiro)
  pedidos: Pedido[];
}
