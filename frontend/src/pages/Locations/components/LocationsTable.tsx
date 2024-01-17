import classNames from "classnames";
import { useState } from "react";
import { Location } from "../../../services/types/Location";

interface Props {
  locations: Location[];
  handleEditLocation: (location: Location) => void;
}

export function LocationsTable({ locations, handleEditLocation }: Props) {
  const [locationSelected, setLocationSelected] = useState<number>();

  function handleClickLocation(location: Location) {
    setLocationSelected(location.id)
    handleEditLocation(location)
  }

  return (
    <div className="flex flex-1 overflow-x-auto max-h-full w-full shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Cep
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Endereço
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Verificar Local
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Tempo Est. Entrega(min)
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Tempo Est. Carga(s)
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Lat/Long Manual
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Clientes no local
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Endereço coletivo
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Zona de risco
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Nome
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Observação
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Restrição Horário
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {locations &&
            locations?.length > 0 &&
            locations.map((location) => (
              <tr key={location.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                  <a
                    className={classNames(
                      locationSelected === location.id
                        ? "text-indigo-500"
                        : "text-gray-900",
                      "cursor-pointer text-base font-bold"
                    )}
                    onClick={() => handleClickLocation(location)}
                  >
                    {location.id}
                  </a>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {location.cep}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {location.endereco}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {location.verificarLocal}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {location.tempoEstimadoEntrega}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {location.tempoEstimadoCarga}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {location.latLongManual}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {location.clientesLocal}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {location.enderecoColetivo}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {location.zonaRisco}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {location.nome}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {location.observacao}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {location.restritivoHorario}
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
  )
}