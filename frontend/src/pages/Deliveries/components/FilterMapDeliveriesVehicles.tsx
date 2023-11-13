import { Fragment, useEffect, useState } from "react";
import { DeliveryPoints } from "../../../services/types/Delivery";
import { Button } from "../../../components/Button";
import { formatCurrency, formatNumber } from "../../../services/utils/formatNumber";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  deliveryPoints: DeliveryPoints[] | undefined;
  handleFilterPoints: (points: DeliveryPoints[]) => void
}

export function FilterMapDeliveriesVehicles({
  deliveryPoints,
  handleFilterPoints
}: Props) {
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryPoints[]>([]);
  const [deliveries, setDeliveries] = useState(deliveryPoints)
  const [open, setOpen] = useState(true)

  function filterDeliveries() {
    console.log(selectedDelivery)
    if (selectedDelivery.length === 0) {
      handleFilterPoints(deliveries!)
    } else {
      handleFilterPoints(selectedDelivery)
    }
  }

  function changeVehicle() {
    setOpen(true)
  }

  const plates = Array.from(new Set(deliveries!.map((item) => item.placa)));

  /* Filtrar pedidos do veículo
1 - Criar componente para ser exibido quando filtrar por veículo - OK
2 - Neste componente irá exibir os pedidos agrupado por veículo, com a opção de filtrar os pedidos no mapa - OK
3 - Opção para transferir pedido selecionado para outro veículo 
4 - Modal para selecionar o veículo

*/

  return (
    <>
      <div className="mt-2 flex flex-col min-w-full">
        <div className="flex gap-3">
          <Button
            title="Filtrar"
            color="primary"
            type="button"
            onClick={() => filterDeliveries()}
          />
          <Button
            title="Alterar veículo"
            color="primary"
            type="button"
            onClick={() => changeVehicle()}
          />
        </div>
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="overflow-auto max-h-[50vh] shadow ring-1 ring-black ring-opacity-5">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">

                  </th>
                  <th
                    scope="col"
                    className="x-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Placa
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

              {plates.length > 0 && plates.map((plate) => (
                <tbody className="divide-y divide-gray-200 bg-white">
                  {deliveries && deliveries?.length > 0 && deliveries.filter((d) => d.placa === plate).map((delivery) => (
                    <tr key={delivery.id}>
                      <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                        {selectedDelivery.includes(delivery) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                        )}
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                          value={delivery.id}
                          checked={selectedDelivery.includes(delivery)}
                          onChange={(e) =>
                            setSelectedDelivery(
                              e.target.checked
                                ? [...selectedDelivery, delivery]
                                : selectedDelivery.filter((p) => p !== delivery)
                            )
                          }
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-ellipsis">
                        {delivery.placa}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                        {formatNumber(delivery.peso)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                        {formatCurrency(delivery.valor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-xs">
                    <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                      <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                        <div className="px-4 sm:px-6">
                          <div className="flex items-start justify-between">
                            <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                              Panel title
                            </Dialog.Title>
                            <div className="ml-3 flex h-7 items-center">
                              <button
                                type="button"
                                className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                onClick={() => setOpen(false)}
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                          <span>Veículos</span>
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 justify-end px-4 py-4">
                        <button
                          type="button"
                          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}