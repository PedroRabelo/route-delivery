import classNames from "classnames";
import { useState } from "react";

const routes = [
  {
    id: 1,
    nome: "Shopping",
    alerta: "Fora do trecho",
    status: "No local",
    tempoRestante: 12,
    distanciaRestante: 15,
    observacao: "Tempo ultrapassou 15 minutos como previsto"
  },
  {
    id: 2,
    nome: "Shopping",
    alerta: "Fora do trecho",
    status: "No local",
    tempoRestante: 12,
    distanciaRestante: 15,
    observacao: "Tempo ultrapassou 15 minutos como previsto"
  },
  {
    id: 3,
    nome: "Shopping",
    alerta: "Fora do trecho",
    status: "No local",
    tempoRestante: 12,
    distanciaRestante: 15,
    observacao: "Tempo ultrapassou 15 minutos como previsto"
  }
]


export function RoutesTable() {
  const [routeSelected, setRouteSelected] = useState<number>();

  function handleClickRoute() {

  }

  return (
    <div className="flex flex-1 overflow-x-auto max-h-full w-full shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="divide-y divide-gray-300 w-full">
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
              Nome
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Alerta
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
              Tempo Restante
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Distância Restante
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Observação
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
                    {route.id}
                  </a>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {route.nome}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {route.alerta}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {route.status}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {route.tempoRestante}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {route.distanciaRestante}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {route.observacao}
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
  )
}