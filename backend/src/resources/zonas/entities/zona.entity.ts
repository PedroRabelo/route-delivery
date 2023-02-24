import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ZonaCoords } from "./zona-coords.entity";

@Entity({ name: 'ZONAS' })
export class Zona {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'titulo' })
  titulo: string;

  @DeleteDateColumn({ name: 'data_exclusao' })
  dataExclusao: Date

  @OneToMany(() => ZonaCoords, (coords) => coords.zona, { eager: true, cascade: true })
  coordenadas: ZonaCoords[];
}
