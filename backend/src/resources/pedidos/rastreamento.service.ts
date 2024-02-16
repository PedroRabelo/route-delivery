import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Veiculo } from './entities/veiculo.entity';

@Injectable()
export class RastreamentoService {
  constructor(
    @InjectRepository(Veiculo)
    private veiculoRepository: Repository<Veiculo>,
  ) { }

  async trackVehicles() {
    const veiculos = await this.veiculoRepository.query(
      `
      select 
      	VEIC.PLACA placa, 
      	RAST.LATITUDE latitude,
      	RAST.LONGITUDE longitude,
      	dbo.FormataData(RAST.DT_ULT_POSICAO, 'd/M/Y h:m:s') ultimaPosicao,
      	RAST.IGNICAO ignicao,
      	RAST.VELOCIDADE velocidade
      from 
      	MULTIPORTAL.dbo.TB_VEICULO veic
      	INNER JOIN MULTIPORTAL.DBO.TB_RASTREADOR RAST ON VEIC.FK_RASTREADOR = RAST.ID_RASTREADOR
      `,
    );

    return veiculos;
  }

  @Cron('*/30 * * * * *')
  async syncMultiportal() {
    console.log('sincronizar rastreador');
    await this.veiculoRepository.query(
      `exec MULTIPORTAL.dbo.PEGAR_TOKEN_CONSULTA
      `,
    );

    await this.veiculoRepository.query(
      `exec MULTIPORTAL.dbo.BUSCAR_ULTIMA_POSICAO
      `,
    );

    await this.veiculoRepository.query(
      `exec MULTIPORTAL.dbo.INSERIR_POSICAO_VEICULOS
      `,
    );
    console.log('sincronização concluída');
  }
}
