import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../../components/Button";
import { Bound } from "../../../components/Maps";
import SelectMenu from "../../../components/SelectMenu/SelectMenu";
import { api } from "../../../lib/axios";
import {
  CreateDeliveryPolygonDTO,
  CreateDeliveryPolygonDTOCoordsDTO,
  DeliveryPoints,
  DeliveryVehicle,
  PolygonDeliveriesSummary,
  UpdatePedidoVeiculoPoligonoDto,
} from "../../../services/types/Delivery";
import { Vehicle } from "../../../services/types/Vehicle";
import {
  formatCurrency,
  formatNumber,
} from "../../../services/utils/formatNumber";

type Props = {
  handleFilterPoints?: (points: DeliveryPoints[]) => void;
  bounds: Bound[];
};

export function CreateRoute({ handleFilterPoints, bounds }: Props) {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [deliveriesPolygon, setDeliveriesPolygon] = useState<DeliveryPoints[]>(
    []
  );
  const [deliveriesSummary, setDeliveriesSummary] =
    useState<PolygonDeliveriesSummary>();
  const [tabSelected, setTabSelected] = useState<"Resumo" | "Pedidos">(
    "Resumo"
  );
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleSelected, setVehicleSelected] = useState<Vehicle>();

  async function fetchDeliveriesByPolygon() {
    try {
      const coords: CreateDeliveryPolygonDTOCoordsDTO[] = [];

      bounds.map((bound) => {
        coords.push({
          latitude: bound.lat,
          longitude: bound.lng,
        });
      });

      const body: CreateDeliveryPolygonDTO = {
        roteiroId: +id!,
        coordenadas: coords,
      };

      setIsLoading(true);
      const response = await api.post("pedidos/pedido-poligono", body);

      setDeliveriesPolygon(response.data.pedidos);
      setDeliveriesSummary(response.data.resumo[0]);
      setVehicles(response.data.veiculos);

      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      console.log(e);
      alert(e.response.data.message);
    }
  }

  useEffect(() => {
    if (bounds.length > 0) {
      fetchDeliveriesByPolygon();
    }
  }, [bounds]);

  async function saveRoute() {
    if (vehicleSelected === undefined) {
      alert("Selecione um veículo");
      return;
    }

    const payload: UpdatePedidoVeiculoPoligonoDto = {
      pedidos: deliveriesPolygon.map((d) => d.id),
      veiculoId: vehicleSelected!.id,
      placa: vehicleSelected!.placa,
      roteiroId: +id!,
    };

    setIsLoading(true);
    await api.post("/pedidos/roterizar-poligono", payload);
    setIsLoading(false);

    alert("Rota salva com sucesso.");
    window.location.reload();
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        <div className="flex flex-1 justify-around bg-gray-100">
          <a
            onClick={() => {
              setTabSelected("Resumo");
            }}
            className={classNames(
              tabSelected === "Resumo"
                ? "bg-cyan-600 text-white"
                : "text-gray-600 hover:text-gray-800",
              "flex flex-row px-1 py-2 font-medium text-sm rounded-md cursor-pointer"
            )}
            aria-current={tabSelected ? "page" : undefined}
          >
            Resumo
          </a>
          <a
            onClick={() => {
              setTabSelected("Pedidos");
            }}
            className={classNames(
              tabSelected === "Pedidos"
                ? "bg-cyan-600 text-white"
                : "text-gray-600 hover:text-gray-800",
              "flex flex-row px-1 py-2 font-medium text-sm rounded-md cursor-pointer"
            )}
            aria-current={tabSelected ? "page" : undefined}
          >
            Pedidos
          </a>
        </div>
        <Button
          title="Salvar"
          color="primary"
          type="button"
          disabled={isLoading}
          loading={isLoading}
          onClick={() => saveRoute()}
        />
      </div>
      {tabSelected === "Resumo" && deliveriesSummary !== undefined && (
        <div>
          <div>
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-2 shadow sm:p-2">
                <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                  {deliveriesSummary?.locais} Pedidos
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-2 shadow sm:p-2">
                <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                  {deliveriesSummary?.notas} Notas
                </dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-2 shadow sm:p-2">
                <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                  {formatNumber(deliveriesSummary?.pesoTotal!)} Kg Carga total
                </dd>
              </div>

              <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-2 shadow sm:p-2">
                <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                  {formatCurrency(deliveriesSummary?.valorTotal!)} Total
                </dd>
              </div>

              {deliveriesSummary.locaisRodizio > 0 && (
                <>
                  <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-2 shadow sm:p-2">
                    <span className="text-red-400 font-bold">
                      Dentro do rodízio
                    </span>
                    <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                      {deliveriesSummary?.locaisRodizio} pedidos
                    </dd>
                    <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                      {deliveriesSummary?.notasRodizio} notas
                    </dd>
                    <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                      {formatNumber(deliveriesSummary?.pesoRodizio!)} Kg carga
                    </dd>
                    <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                      {formatCurrency(deliveriesSummary?.valorRodizio!)} Total
                    </dd>
                  </div>
                  <div className="overflow-hidden rounded-lg bg-gray-100 px-4 py-2 shadow sm:p-2">
                    <span className="text-green-400 font-bold">
                      Fora do rodízio
                    </span>
                    <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                      {deliveriesSummary?.locaisForaRodizio} pedidos
                    </dd>
                    <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                      {deliveriesSummary?.notasForaRodizio} notas
                    </dd>
                    <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                      {formatNumber(deliveriesSummary?.pesoForaRodizio!)} Kg
                      carga
                    </dd>
                    <dd className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                      {formatCurrency(deliveriesSummary?.valorForaRodizio!)}{" "}
                      Total
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </div>
      )}

      {tabSelected === "Pedidos" && (
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="overflow-auto max-h-[37vh] shadow ring-1 ring-black ring-opacity-5">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
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
                {deliveriesPolygon &&
                  deliveriesPolygon?.length > 0 &&
                  deliveriesPolygon.map((delivery) => (
                    <tr key={delivery.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-ellipsis">
                        {delivery.cliente.substring(0, 20)}
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
            </table>
          </div>
        </div>
      )}

      {vehicles && vehicles.length > 0 && deliveriesSummary !== undefined && (
        <SelectMenu
          vehicles={vehicles}
          handleSelectVehicle={(vehicle) => setVehicleSelected(vehicle)}
          deliveriesWeight={deliveriesSummary?.pesoTotal}
        />
      )}
    </div>
  );
}
