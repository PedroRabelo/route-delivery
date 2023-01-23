import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'PEDIDOS_LOCAIS' })
export class PedidoLocal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nome' })
  nome: string;

  @Column({ name: 'cep' })
  cep: string;

  @Column({ name: 'endereco' })
  endereco: string;

  @Column({ name: 'numero' })
  numero: string;

  @Column({ name: 'bairro' })
  bairro: string;

  @Column({ name: 'cidade' })
  cidade: string;

  @Column({ name: 'estado' })
  estado: string;

  @Column({ name: 'latitude', type: 'float' })
  latitude: number;

  @Column({ name: 'longitude', type: 'float' })
  longitude: number;
}
