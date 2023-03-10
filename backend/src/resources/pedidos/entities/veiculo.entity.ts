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
  ativo: boolean;

  @Column({ name: 'RODIZIO' })
  rodizio: string;

  @Column({ name: 'PERC_CHEIO' })
  percentualCheio: number;

  @Column({ name: 'MAX_LOCAL' })
  qtdLocais: number;

  @Column({ name: 'COD_FROTA' })
  codigoFrota: number;

  @Column({ name: 'PRIORIDADE' })
  prioridade: number;

  @Column({ name: 'VERIFICA_RODIZIO' })
  temRodizio: boolean;

  @Column({ name: 'CAPACIDADE_LIBERADA' })
  capacidadeLiberada: number;

  @Column({ name: 'PESO_MINIMO' })
  pesoMinimo: number;

}
