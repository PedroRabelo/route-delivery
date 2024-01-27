import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'PEDIDOS_LOCAIS' })
export class PedidoLocal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nome_local' })
  nome: string;

  @Column({ name: 'cep' })
  cep: string;

  @Column({ name: 'ENDERECO_GOOGLE' })
  endereco: string;

  @Column({ name: 'numero' })
  numero: string;

  @Column({ name: 'bairro' })
  bairro: string;

  @Column({ name: 'CIDADE_GOOGLE' })
  cidade: string;

  @Column({ name: 'ESTADO_GOOGLE' })
  estado: string;

  @Column({ name: 'latitude', type: 'float' })
  latitude: number;

  @Column({ name: 'longitude', type: 'float' })
  longitude: number;

  @Column({ name: 'verificar_local' })
  verificarLocal: boolean;

  @Column({ name: 'tempo_estimado_entrega' })
  tempoEstimadoEntrega: string;

  @Column({ name: 'tempo_estimado_carga' })
  tempoEstimadoCarga: string;

  @Column({ name: 'lat_long_manual' })
  latLongManual: boolean;

  @Column({ name: 'clientes_local' })
  clientesLocal: number;

  @Column({ name: 'endereco_coletivo' })
  enderecoColetivo: boolean;

  @Column({ name: 'zona_risco' })
  zonaRisco: boolean;

  @Column({ name: 'observacao' })
  observacao: string;

  @Column({ name: 'restritivo_horario' })
  restritivoHorario: boolean
}
