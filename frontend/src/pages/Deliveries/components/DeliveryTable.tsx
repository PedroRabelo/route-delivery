import classNames from "classnames";
import { useEffect, useState } from "react";
import { DeliveryVehicle } from "../../../services/types/Delivery"

type Props = {
  trucks: DeliveryVehicle[] | undefined;
  handleFilterDeliveryPoints: (licencePlate: string) => void;
  clearLicencePlate: boolean;
}

export function DeliveryTable({ trucks, handleFilterDeliveryPoints, clearLicencePlate = false }: Props) {
  const [plateSelected, setPlateSelected] = useState('');

  function handleLicensePlateClick(licencePlate: string) {
    setPlateSelected(licencePlate);
    handleFilterDeliveryPoints(licencePlate);
  }

  useEffect(() => {
    if (clearLicencePlate)
      setPlateSelected('');
  }, [clearLicencePlate]);

  return (
    <div>
      <div className="mt-4 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Placa
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Capacidade
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Locais
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Pedidos
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Carga(KG)
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Valor
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Percentual(%)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {trucks && trucks?.length > 0 && trucks.map((truck) => (
                    <tr key={truck.placa}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                        <a
                          className={classNames(plateSelected === truck.placa
                            ? "text-indigo-500"
                            : "text-gray-900",
                            "cursor-pointer text-base font-bold")}
                          onClick={() => handleLicensePlateClick(truck.placa)}>
                          {truck.placa}
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{truck.capacidade}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{truck.locais}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{truck.pedidos}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Intl.NumberFormat('pt-BR').format(truck.peso)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(truck.valor)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Intl.NumberFormat('pt-BR').format(truck.percentual)}
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
  )
}