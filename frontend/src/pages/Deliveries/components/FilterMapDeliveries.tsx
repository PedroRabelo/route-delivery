import { useState } from "react";
import {
  DeliveryPoints,
  DeliveryVehicle,
} from "../../../services/types/Delivery";
import {
  formatCurrency,
  formatNumber,
} from "../../../services/utils/formatNumber";
import { Button } from "../../../components/Button";

type Props = {
  tabBarSelected: string;
  deliveryVehicles: DeliveryVehicle[] | undefined;
  deliveryWithoutVehicles: DeliveryPoints[] | undefined;
  handleFilterByVehicles: (vehicles: DeliveryVehicle[]) => void;
  handleFilterPoints: (points: DeliveryPoints[]) => void;
};

export function FilterMapDeliveries({
  tabBarSelected,
  deliveryVehicles,
  deliveryWithoutVehicles,
  handleFilterByVehicles,
  handleFilterPoints,
}: Props) {
  const [selectedVehicle, setSelectedVehicle] = useState<DeliveryVehicle[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryPoints[]>(
    []
  );

  return (
    <>
      {tabBarSelected === "Entregues" && (
        <div className="mt-2 flex flex-col">
          <div>
            <Button
              title="Filtrar"
              color="primary"
              type="button"
              onClick={() => handleFilterByVehicles(selectedVehicle)}
            />
            <div className="mt-2 inline-block min-w-full align-middle">
              <div className="relative overflow-y-auto max-h-[52vh] shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-xs font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                      ></th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-xs font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                      ></th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-xs font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                      >
                        Placa
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-xs font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        Carga(KG)
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-xs font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        Valor(R$)
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-xs font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        Carga(%)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {deliveryVehicles &&
                      deliveryVehicles?.length > 0 &&
                      deliveryVehicles.map((truck) => (
                        <tr
                          key={truck.placa}
                          className={
                            selectedVehicle.includes(truck)
                              ? "bg-gray-50"
                              : undefined
                          }
                        >
                          <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                            {selectedVehicle.includes(truck) && (
                              <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                            )}
                            <input
                              type="checkbox"
                              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                              value={truck.placa}
                              checked={selectedVehicle.includes(truck)}
                              onChange={(e) =>
                                setSelectedVehicle(
                                  e.target.checked
                                    ? [...selectedVehicle, truck]
                                    : selectedVehicle.filter((p) => p !== truck)
                                )
                              }
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                            {truck.ordem}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                            {truck.placa}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                            {formatNumber(truck.peso)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                            {formatCurrency(truck.valor)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                            {formatNumber(truck.percentual)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {tabBarSelected === "Não Entregues" && (
        <div className="mt-2 flex flex-col min-w-full">
          <div className="">
            <Button
              title="Filtrar"
              color="primary"
              type="button"
              onClick={() => handleFilterPoints(selectedDelivery)}
            />
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-auto max-h-[50vh] shadow ring-1 ring-black ring-opacity-5">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      ></th>
                      <th
                        scope="col"
                        className="x-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Cliente
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Carga(KG)
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Valor(R$)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {deliveryWithoutVehicles &&
                      deliveryWithoutVehicles?.length > 0 &&
                      deliveryWithoutVehicles.map((delivery) => (
                        <tr key={delivery.id}>
                          <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                            {selectedDelivery.includes(delivery) && (
                              <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                            )}
                            <input
                              type="checkbox"
                              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                              value={delivery.placa}
                              checked={selectedDelivery.includes(delivery)}
                              onChange={(e) =>
                                setSelectedDelivery(
                                  e.target.checked
                                    ? [...selectedDelivery, delivery]
                                    : selectedDelivery.filter(
                                        (p) => p !== delivery
                                      )
                                )
                              }
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-ellipsis">
                            {delivery.cliente.substring(0, 20)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                            {formatNumber(delivery.peso)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                            {formatCurrency(delivery.valor)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {delivery.observacao}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
