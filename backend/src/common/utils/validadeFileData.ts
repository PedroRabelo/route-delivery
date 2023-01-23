import { CreatePedidoDto } from 'src/resources/pedidos/dto/create-pedido.dto';

export function validadeFileData(order: CreatePedidoDto) {
  // Validar se campo numero tem algum dado inválido
  if (
    order.numero === 's/n' ||
    order.numero === 'S/N' ||
    order.numero === 'SN'
  ) {
    order.numero = '';
  }

  return order;
}
