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

  @Column({ name: 'area_1' })
  area1: number;

  @Column({ name: 'area_2' })
  area2: number;

  @Column({ name: 'distancia' })
  distancia: number;

  @Column({ name: 'data_inclusao' })
  dataInclusao: Date;

  @OneToMany(() => Pedido, (pedido) => pedido.roteiro)
  pedidos: Pedido[];
}
