import { Body, Controller, Get, Param, Patch, Query } from "@nestjs/common"
import { UpdateLocalDto } from "./dto/update-local"
import { PedidosLocaisService } from "./pedidos-locais.service"

@Controller('pedidos-locais')
export class PedidosLocaisController {
  constructor(private readonly pedidosLocaisService: PedidosLocaisService) { }

  @Get()
  listPedidosLocais(
    @Query('id') id: number,
    @Query('cep') cep: string,
    @Query('endereco') endereco: string
  ) {
    return this.pedidosLocaisService.listPedidosLocais({
      id,
      cep,
      endereco
    })
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLocalDto,
  ) {
    return this.pedidosLocaisService.update(+id, dto)
  }

}