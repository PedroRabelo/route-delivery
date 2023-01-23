export async function slicePedidosIntoChunks(
  pedidos: any[],
  chunkSize: number,
) {
  const chunkPedidos = [];
  for (let i = 0; i < pedidos.length; i += chunkSize) {
    const chunk = pedidos.slice(i, i + chunkSize);
    chunkPedidos.push(chunk);
  }

  return chunkPedidos;
}
