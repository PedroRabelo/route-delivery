import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'VEICULOS' })
export class Veiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'PLACA' })
  placa: string;

  @Column({ name: 'CAPACIDADE' })
  capacidade: number;

  @Column({ name: 'ativo' })
  ativo: number;
}
