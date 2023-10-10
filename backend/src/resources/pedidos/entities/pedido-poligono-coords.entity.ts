import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PedidoPoligono } from "./pedido-poligono.entity";

@Entity({ name: 'PEDIDOS_POLIGONO_LAT_LONG' })
export class PedidoPoligonoCoords {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'latitude', type: 'float' })
  latitude: number;

  @Column({ name: 'longitude', type: 'float' })
  longitude: number;

  @Column({ name: "pedido_poligono_id" })
  pedidoPoligonoId: number;

  @ManyToOne(() => PedidoPoligono, (pedidoPoligono) => pedidoPoligono.coordenadas)
  @JoinColumn({ name: "pedido_poligono_id" })
  pedidoPoligono: PedidoPoligono;
}