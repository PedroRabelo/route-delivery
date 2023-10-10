import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PedidoPoligonoCoords } from "./pedido-poligono-coords.entity";

@Entity({ name: 'PEDIDOS_POLIGONO' })
export class PedidoPoligono {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "roteiro_id" })
  roteiroId: number;

  @OneToMany(() => PedidoPoligonoCoords, (coords) => coords.pedidoPoligono, { eager: true, cascade: true })
  coordenadas: PedidoPoligonoCoords[];
}