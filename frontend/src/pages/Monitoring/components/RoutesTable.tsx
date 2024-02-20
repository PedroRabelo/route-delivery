import classNames from "classnames";
import { useEffect, useState } from "react";
import { api } from "../../../lib/axios";
import { TrackVehicle } from "../../../services/types/Route";
import { formatDatetime } from "../../../services/utils/formatDateOnly";

export function RoutesTable() {
  const [routeSelected, setRouteSelected] = useState<number>()
  const [isLoading, setIsLoading] = useState(false)
  const [routes, setRoutes] = useState<TrackVehicle[]>([])

  async function getRoutes() {
    setIsLoading(true)

    const response = await api.get('rastreamento/routes')

    setRoutes(response.data)

    setIsLoading(false)
  }

  useEffect(() => {
    getRoutes()
  }, [])

  function handleClickRoute() {

  }

  return (
    <div className="flex flex-1 overflow-x-auto max-h-full w-full shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      {isLoading &&
        <div className="flex w-full h-full justify-center items-center">
          Carregando...
        </div>
      }

      <table className="divide-y divide-gray-300 w-full">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Placa
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Motorista
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
              Início
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Previsão Chegada
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Tempo Restante
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Distância
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {routes &&
            routes?.length > 0 &&
            routes.map((route) => (
              <tr key={route.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                  <a
                    className={classNames(
                      routeSelected === route.id
                        ? "text-indigo-500"
                        : "text-gray-900",
                      "cursor-pointer text-base font-bold"
                    )}
                    onClick={() => handleClickRoute()}
                  >
                    {route.placa}
                  </a>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {route.motorista}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {route.cliente}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {formatDatetime(route.inicioRota)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {formatDatetime(route.chegadaPrevista)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {route.tempoViagem}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {route.distancia}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {route.status}
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
  )
}