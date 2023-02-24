import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Zona } from "./zona.entity";

@Entity({ name: 'ZONAS_LAT_LONG' })
export class ZonaCoords {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'latitude', type: 'float' })
  latitude: number;

  @Column({ name: 'longitude', type: 'float' })
  longitude: number;

  @ManyToOne(() => Zona, (roteiro) => roteiro.coordenadas)
  @JoinColumn({ name: "zona_id" })
  zona: Zona;
}