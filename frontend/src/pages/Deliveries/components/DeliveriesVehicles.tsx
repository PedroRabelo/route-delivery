import {
  ArrowPathRoundedSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { MoonLoader } from "react-spinners";
import { api } from "../../../lib/axios";
import {
  DeliveryPoints,
  DeliveryVehicle,
} from "../../../services/types/Delivery";
import {
  formatCurrency,
  formatNumber,
} from "../../../services/utils/formatNumber";
import { DeliveriesInfo } from "./DeliveriesInfo";
import { VehicleDeliveries } from "../../../services/types/Delivery";

type Props = {
  trucks: DeliveryVehicle[] | undefined;
  deliveryPoints: DeliveryPoints[] | undefined;
  handleFetchUpdateDeliveries: () => void;
};

export function DeliveriesVehicle({
  trucks,
  handleFetchUpdateDeliveries,
  deliveryPoints,
}: Props) {
  const { id } = useParams();

  const checkbox = useRef<HTMLInputElement>({} as HTMLInputElement);

  const [plateSelected, setPlateSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<DeliveryVehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [vehicleDeliveries, setVehicleDeliveries] =
    useState<VehicleDeliveries>();
  const [deliveriesByTruck, setDeliveriesByTruck] =
    useState<DeliveryPoints[]>();

  useLayoutEffect(() => {
    if (trucks && trucks.length > 0) {
      const isIndeterminate =
        selectedVehicle.length > 0 && selectedVehicle.length < trucks.length;
      setChecked(selectedVehicle.length === trucks.length);
      setIndeterminate(isIndeterminate);
      if (checkbox !== undefined)
        checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedVehicle]);

  useEffect(() => {
    function filterPoints(licencePlate: string) {
      return deliveryPoints?.filter((point) => point.placa === licencePlate);
    }

    if (plateSelected !== "" && plateSelected !== undefined) {
      setDeliveriesByTruck(filterPoints(plateSelected));
    }
  }, [plateSelected]);

  async function openDeliveriesByTruck(plate: string) {
    async function filterVehicle(licensePlate: string) {
      return trucks?.find((vehicle) => vehicle.placa === licensePlate);
    }

    const vehicle = await filterVehicle(plate);

    if (vehicle) {
      setVehicleDeliveries({ vehicle, orders: deliveryPoints });
      setPlateSelected(plate);
    }
  }

  function clearVehicleFilter() {
    setPlateSelected("");
    setDeliveriesByTruck(deliveriesByTruck);
  }

  async function handleTruckChange() {
    if (selectedVehicle.length > 2) {
      alert("Informe apenas 2 veículos para fazer a troca");
      return;
    }

    if (selectedVehicle[0].peso >= selectedVehicle[1].capacidade) {
      alert(
        `A capacidade do veículo ${selectedVehicle[1].placa} não suporta a carga`
      );
      return;
    }

    if (selectedVehicle[1].peso >= selectedVehicle[0].capacidade) {
      alert(
        `A capacidade do veículo ${selectedVehicle[0].placa} não suporta a carga`
      );
      return;
    }

    setLoading(true);
    const payload = {
      roteiroId: id,
      veiculo1Id: selectedVehicle[0].id,
      placa1: selectedVehicle[0].placa,
      ordem1: selectedVehicle[0].ordem,
      veiculo2Id: selectedVehicle[1].id,
      placa2: selectedVehicle[1].placa,
      ordem2: selectedVehicle[1].ordem,
    };

    await api.post(`/pedidos/alterar-veiculos`, payload);

    handleFetchUpdateDeliveries();

    setSelectedVehicle([]);

    alert("Troca de veículo realizada com sucesso.");
    setLoading(false);
  }

  async function deleteRoute(vehicleId: number) {
    setLoading(true);
    await api.put("pedidos/desfazer-rota", {
      roteiroId: id,
      veiculoId: vehicleId,
    });

    handleFetchUpdateDeliveries();

    alert("Rota removida com sucesso.");
    setLoading(false);
  }

  function getSumByKey(arr: DeliveryVehicle[], key: string | number) {
    return arr.reduce(
      (acc: number, current: { [x: string]: any }) =>
        acc + Number(current[key]),
      0
    );
  }

  function getPercentAvg(arr: DeliveryVehicle[]) {
    const bruto = getSumByKey(arr, "peso");
    const capacidade = getSumByKey(arr, "capacidade");

    return (bruto * 100) / capacidade;
  }

  function filterVehiclesUsed() {
    return trucks?.filter((t) => t.ordem !== 99);
  }

  return (
    <div>
      {plateSelected && plateSelected !== "" && (
        <DeliveriesInfo
          handleClearVehicle={() => clearVehicleFilter()}
          vehicleDeliveries={vehicleDeliveries!}
        />
      )}

      {plateSelected === "" && (
        <>
          <div>
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-6">
              <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-5 shadow sm:p-4">
                <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                  {filterVehiclesUsed()?.length} Veículos utilizados
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-5 shadow sm:p-4">
                <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                  {trucks?.length &&
                    formatNumber(getSumByKey(trucks, "capacidade"))}{" "}
                  Kg Cap.
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-5 shadow sm:p-4">
                <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                  {trucks?.length && getSumByKey(trucks, "locais")} Locais
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-5 shadow sm:p-4">
                <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                  {trucks?.length && getSumByKey(trucks, "pedidos")} Pedidos
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-5 shadow sm:p-4">
                <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                  {trucks?.length && formatNumber(getSumByKey(trucks, "peso"))}{" "}
                  Kg Carga total
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-5 shadow sm:p-4">
                <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                  {trucks?.length &&
                    formatCurrency(getSumByKey(trucks, "valor"))}{" "}
                  Total
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-4 flex flex-col min-w-full">
            <div className="">
              <div className="inline-block min-w-full align-middle">
                <div className="relative overflow-y-auto max-h-[55vh] shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                        >
                          {selectedVehicle.length > 0 && (
                            <div className="flex items-center space-x-3 bg-gray-50 sm:left-16">
                              <button
                                type="button"
                                disabled={selectedVehicle.length < 2}
                                className="inline-flex rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                                onClick={() => handleTruckChange()}
                              >
                                {loading && (
                                  <MoonLoader
                                    color="#164e63"
                                    size={18}
                                    className="h-3 w-3"
                                  />
                                )}
                                {!loading && (
                                  <ArrowPathRoundedSquareIcon className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          )}
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                        >
                          Ordem
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                        >
                          Placa
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                        >
                          Capacidade(KG)
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                        >
                          Locais
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                        >
                          Pedidos
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
                          (%)
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                        >
                          <span className="sr-only">Desfazer rota</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {trucks &&
                        trucks?.length > 0 &&
                        filterVehiclesUsed()!.map((truck) => (
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
                                      : selectedVehicle.filter(
                                          (p) => p !== truck
                                        )
                                  )
                                }
                              />
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {truck.ordem}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                              <a
                                className={classNames(
                                  plateSelected === truck.placa
                                    ? "text-indigo-500"
                                    : "text-gray-900",
                                  "cursor-pointer text-base font-bold"
                                )}
                                onClick={() =>
                                  openDeliveriesByTruck(truck.placa)
                                }
                              >
                                {truck.placa}
                              </a>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                              {truck.capacidade}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                              {truck.locais}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                              {truck.pedidos}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {formatNumber(truck.peso)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {formatCurrency(truck.valor)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {formatCurrency(truck.percentual)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {truck.ordem !== 99 && (
                                <a
                                  className="flex flex-col items-center text-red-600 hover:text-red-900 cursor-pointer"
                                  onClick={() => deleteRoute(truck.id)}
                                >
                                  <TrashIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                  <span className="text-xs">Remover</span>
                                </a>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
