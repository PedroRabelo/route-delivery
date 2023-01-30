import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Roteiro } from './roteiro.entity';

@Entity({ name: 'PEDIDOS' })
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'Entrega' })
  entrega: Date;

  @Column({ name: 'cod_cliente' })
  codigoCliente: string;

  @Column({ name: 'Cliente' })
  cliente: string;

  @Column({ name: 'Ped' })
  ped: number;

  @Column({ name: 'id_entrega' })
  idEntrega: string;

  @Column({ name: 'CEP' })
  cep: string;

  @Column({ name: 'Endereco' })
  endereco: string;

  @Column({ name: 'Numero' })
  numero: string;

  @Column({ name: 'Bairro' })
  bairro: string;

  @Column({ name: 'Cidade' })
  cidade: string;

  @Column({ name: 'Estado' })
  estado: string;

  @Column({ name: 'latitude', type: 'float' })
  latitude: number;

  @Column({ name: 'longitude', type: 'float' })
  longitude: number;

  @Column({ name: 'Total', type: 'float' })
  total: number;

  @Column({ name: 'Bruto', type: 'float' })
  bruto: number;

  @Column({ name: 'ID_VEICULO' })
  veiculoId: number;

  @Column({ name: 'PLACA' })
  placa: string;

  @ManyToOne(() => Roteiro, (roteiro) => roteiro.pedidos)
  roteiro: Roteiro;

  constructor(partial: Partial<Pedido>) {
    Object.assign(this, partial);
  }
}
