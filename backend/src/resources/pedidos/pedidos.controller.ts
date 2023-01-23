import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { format, parseISO } from 'date-fns';
import { getLatLongFromAddress } from 'src/common/utils/getLatLongFromAddress';
import { readFile, utils } from 'xlsx';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { PedidoParamsDto } from './dto/pedido-params.dto';
import { UpdateRoteiroDto } from './dto/update-roteiro.dto';
import { PedidosService } from './pedidos.service';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post('upload-sheet')
  @UseInterceptors(FileInterceptor('file', { dest: '/tmp/' }))
  async uploadDeliveriesSheet(@UploadedFile() file: Express.Multer.File) {
    const readOpts = {
      cellText: false,
      cellDates: true,
    };

    const jsonOpts = {
      defval: '',
      blankrows: true,
      raw: true,
      rawNumber: true,
      dateNF: 'd"/"m"/"yyyy',
    };

    const wb = readFile(file.path, readOpts);

    const json: CreatePedidoDto[] = utils.sheet_to_json(
      wb.Sheets[wb.SheetNames[0]],
      jsonOpts,
    );

    const keys = Object.keys(json[0]);

    if (keys.length !== 15) {
      throw new Error('Arquivo fora do padrão de colunas');
    }

    const jsonFormatted: CreatePedidoDto[] = json.map((obj) => {
      return {
        entrega: obj[keys[0]],
        codigoCliente: obj[keys[1]],
        cliente: obj[keys[2]],
        ped: obj[keys[3]],
        idEntrega: obj[keys[4]],
        cep: obj[keys[5]],
        endereco: obj[keys[6]],
        numero: obj[keys[7]],
        bairro: obj[keys[8]],
        cidade: obj[keys[9]],
        estado: obj[keys[10]],
        latitude: obj[keys[11]],
        longitude: obj[keys[12]],
        total: obj[keys[13]],
        bruto: obj[keys[14]],
      };
    });

    return this.pedidosService.create(jsonFormatted);
  }

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto[]) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Post('entregas')
  generateRoutes(@Body() params: PedidoParamsDto) {
    params.startDate = format(parseISO(params.startDate), 'dd-MM-yyyy');

    return this.pedidosService.generateRoutes(params);
  }

  @Get('dia/:id')
  findAllByDate(@Param('id') id: string) {
    return this.pedidosService.findAllByRoteiro(+id);
  }

  @Get('veiculos/:id')
  getVehiclesDelivery(@Param('id') id: string) {
    return this.pedidosService.getVehiclesDelivery(+id);
  }

  @Post('retorno/:id')
  getDeliveriesReport(@Param('id') id: string, @Body() dto: UpdateRoteiroDto) {
    return this.pedidosService.getDeliveriesReport(+id, dto);
  }

  @Get('roteiro/:id')
  findRouteById(@Param('id') id: string) {
    return this.pedidosService.findRoteiroById(+id);
  }

  @Get('roteiros')
  getRoutes() {
    return this.pedidosService.getRoutes();
  }

  @Get('lat-long')
  async getCoords(@Query('endereco') endereco: string) {
    try {
      return await getLatLongFromAddress(endereco);
    } catch (error) {
      console.log(error);
    }
  }

  @Get('nao-entregues/:id')
  async getDeliveriesWithoutVehicle(@Param('id') id: string) {
    return this.pedidosService.getDeliveriesWithoutVehicle(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pedidosService.remove(+id);
  }
}
