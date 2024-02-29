import { useEffect, useState } from "react";
import { api } from "../../../lib/axios";
import { TruckDeliveries } from "../../../services/types/Route";

interface Props {
  truck: string;
}

export function DeliveriesTable({ truck }: Props) {
  const [deliveries, setDeliveries] = useState<TruckDeliveries[]>([])

  async function getDeliveries() {
    if (truck !== '' && truck !== undefined) {
      const response = await api.get(`rastreamento/deliveries/${truck}`)

      setDeliveries(response.data)
    }
  }

  useEffect(() => {
    getDeliveries()
  }, [truck])

  return (
    <div className="flex flex-1 overflow-x-auto max-h-full w-full shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="divide-y divide-gray-300 w-full h-full">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Pedido
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Cliente
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Tipo
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {deliveries &&
            deliveries?.length > 0 &&
            deliveries.map((delivery) => (
              <tr key={delivery.rotaId}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-xs sm:pl-6">
                  {delivery.pedidoId}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                  {delivery.cliente}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                  {delivery.status}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                  {delivery.tipoServico}
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
  )
}