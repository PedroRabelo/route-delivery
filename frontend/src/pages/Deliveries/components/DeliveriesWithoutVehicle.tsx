import { DeliveryPoints } from "../../../services/types/Delivery";
import { formatCurrency, formatNumber } from "../../../services/utils/formatNumber";

type Props = {
  deliveries: DeliveryPoints[] | undefined;
}

export function DeliveriesWithoutVehicle({ deliveries }: Props) {

  function getSumByKey(arr: DeliveryPoints[], key: string | number) {
    return arr.reduce((acc: number, current: { [x: string]: any; }) => acc + Number(current[key]), 0);
  }

  return (
    <div>
      <div>
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-5 shadow sm:p-4">
            <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
              {deliveries?.length} Pedidos
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-5 shadow sm:p-4">
            <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
              {deliveries?.length && formatNumber(getSumByKey(deliveries, 'peso'))}Kg de carga total
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-5 shadow sm:p-4">
            <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
              {deliveries?.length && formatCurrency(getSumByKey(deliveries, 'valor'))} Valor total
            </dd>
          </div>
        </dl>
      </div>
      <div className="mt-4 flex flex-col min-w-full">
        <div className="">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-y-auto max-h-[60vh] shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                    >
                      Cliente
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                    >
                      Carga(KG)
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                    >
                      Valor(R$)
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                    >
                      Observação
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {deliveries && deliveries?.length > 0 && deliveries.map((delivery) => (
                    <tr key={delivery.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-ellipsis">{delivery.cliente}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                        {formatNumber(delivery.peso)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                        {formatCurrency(delivery.valor)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{delivery.observacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
