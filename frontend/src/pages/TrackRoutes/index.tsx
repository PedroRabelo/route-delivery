import { useState } from "react";
import { MapRoutes } from "../../components/Maps";
import { DeliveryVehicle } from "../../services/types/Delivery";
import {
  formatCurrency,
  formatNumber,
} from "../../services/utils/formatNumber";

export function TrackRoutes() {
  const [deliveryVehicles, setDeliveryVehicles] = useState<DeliveryVehicle[]>();

  return (
    <div className="flex">
      <div className="flex-1 grow h-[88vh]">
        <MapRoutes />
      </div>

      <div className="absolute">
        <div className="flex flex-col">
          <div>
            {/* <Button
              title="Filtrar"
              color="primary"
              type="button"
              onClick={() => handleFilterByVehicles(selectedVehicle)}
            /> */}
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
                        <tr key={truck.placa}>
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
      </div>
    </div>
  );
}
