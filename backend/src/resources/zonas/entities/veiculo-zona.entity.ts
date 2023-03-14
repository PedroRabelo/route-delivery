import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'VEICULOS_ZONAS' })
export class VeiculoZona {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "zona_id" })
  zonaId: number;

  @Column({ name: "veiculo_id" })
  veiculoId: number;

  @Column(({ name: "prioridade" }))
  prioridade: number;
}