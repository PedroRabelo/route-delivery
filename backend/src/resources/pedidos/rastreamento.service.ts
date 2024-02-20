import { Injectable } from '@nestjs/common';
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

  async trackRoutes() {
    const veiculos = await this.veiculoRepository.query(
      `
      SELECT DISTINCT 
	      ar.Id as id,
	      ar.Placa as placa,
	      p.Cliente as cliente,
	      ar.Motorista as motorista,
	      ar.InicioRota as inicioRota,
	      ar.ChegaPrevista as chegadaPrevista,
	      ar.TempoViagem as tempoViagem,
	      ar.Distancia as distancia,
	      ar.Status as status
      FROM 
	      APP_ROTA ar 
	      INNER JOIN PEDIDOS p on ar.DocId = p.Ped
	      INNER JOIN MULTIPORTAL.dbo.TB_RASTREADOR tr on ar.Id = tr.ID_ROTA 
      WHERE 
      	tr.ID_ROTA > 0
      ORDER BY
        ar.InicioRota;
      `,
    );

    return veiculos;
  }

  async routesDirection() {
    const routes = await this.veiculoRepository.query(
      `
      SELECT
    	  arc.id as id,
    	  arc.id_rota as rotaId,
    	  arc.point_lat as latitude,
    	  arc.point_lon as longitude
      FROM 
    	  APP_ROTA_CAMINHO arc 
    	  INNER JOIN MULTIPORTAL.dbo.TB_RASTREADOR tr on arc.id_rota = tr.ID_ROTA 
      WHERE 
    	  tr.ID_ROTA is not null
      ORDER BY 
    	  arc.id_rota, arc.id;
      `
    );

    return routes;
  }

  //@Cron('*/30 * * * * *')
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
