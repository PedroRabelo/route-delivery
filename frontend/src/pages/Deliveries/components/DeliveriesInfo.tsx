import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  DeliveryPoints,
  VehicleDeliveries,
} from "../../../services/types/Delivery";
import {
  formatCurrency,
  formatNumber,
} from "../../../services/utils/formatNumber";

type Props = {
  handleClearVehicle: () => void;
  vehicleDeliveries: VehicleDeliveries;
};

export function DeliveriesInfo({
  handleClearVehicle,
  vehicleDeliveries,
}: Props) {
  const { vehicle, orders } = vehicleDeliveries;

  function filterOrders(licensePlate: string) {
    return orders?.filter((point) => point.placa === licensePlate);
  }

  const ordersFiltered = filterOrders(vehicle.placa);

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg mt-4">
      <div className="flex justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={() => handleClearVehicle()}
          className="inline-flex items-center px-0 py-0 border border-transparent text-base font-medium rounded-md"
        >
          <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Voltar
        </button>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Pedidos por Veículo
        </h3>
      </div>

      <div className="flex gap-4 p-4">
        <span className="text-md font-semibold">Placa: {vehicle.placa}</span>
        <span className="text-md font-semibold">
          Capacidade: {formatNumber(vehicle.capacidade)}Kg
        </span>
      </div>

      <div>
        <dl className="mt-0 grid grid-cols-1 gap-5 sm:grid-cols-5">
          <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-5 shadow sm:p-4">
            <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
              {vehicle.pedidos} Pedidos
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-5 shadow sm:p-4">
            <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
              {vehicle.locais} Locais
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-5 shadow sm:p-4">
            <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
              {formatNumber(vehicle.peso)} Kg
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-5 shadow sm:p-4">
            <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
              {formatCurrency(vehicle.valor)}
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-5 shadow sm:p-4">
            <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
              {formatNumber(vehicle.percentual)}%
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-4">
        <div className="overflow-y-auto max-h-[45vh] shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {ordersFiltered &&
                ordersFiltered?.length > 0 &&
                ordersFiltered.map((delivery) => (
                  <tr key={delivery.id}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-ellipsis">
                      {delivery.ordemPedido}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-ellipsis">
                      {delivery.cliente}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatNumber(delivery.peso)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatCurrency(delivery.valor)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
