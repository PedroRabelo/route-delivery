import { useParams } from "react-router-dom";
import { Button } from "../../../components/Button";
import { Bound } from "../../../components/Maps";
import { CreateDeliveryPolygonDTO, CreateDeliveryPolygonDTOCoordsDTO, DeliveryPoints, DeliveryVehicle } from "../../../services/types/Delivery";
import { useState } from "react";
import { api } from "../../../lib/axios";
import { formatCurrency, formatNumber } from "../../../services/utils/formatNumber";
import SelectMenu from "../../../components/SelectMenu/SelectMenu";

type Props = {
  handleFilterPoints?: (points: DeliveryPoints[]) => void;
  bounds: Bound[];
  deliveryVehicles: DeliveryVehicle[] | undefined;
}

export function CreateRoute({ handleFilterPoints, bounds, deliveryVehicles }: Props) {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [deliveriesPolygon, setDeliveriesPolygon] = useState<DeliveryPoints[]>([])

  async function fetchDeliveriesByPolygon() {
    try {
      const coords: CreateDeliveryPolygonDTOCoordsDTO[] = [];

      bounds.map((bound) => {
        coords.push({
          latitude: bound.lat,
          longitude: bound.lng
        })
      })

      const body: CreateDeliveryPolygonDTO = {
        roteiroId: +id!,
        coordenadas: coords
      }

      setIsLoading(true);
      const response = await api.post('pedidos/pedido-poligono', body);

      //Recebe os pedidos para mostrar na tela

      setIsLoading(false)
    } catch (e: any) {
      setIsLoading(false);
      console.log(e);
      alert(e.response.data.message);
    }
  };

  return (
    <div className="mt-2 flex flex-col gap-3">
      <div className="flex justify-between">
        <Button
          title="Filtrar pedidos do polígono"
          color="primary"
          type="button"
          disabled={isLoading}
          loading={isLoading}
          onClick={() => fetchDeliveriesByPolygon()}
        />
        <Button
          title="Salvar"
          color="primary"
          type="submit"
          disabled={isLoading}
          loading={isLoading}
        />
      </div>
      {deliveryVehicles && deliveryVehicles.length > 0 &&
        <SelectMenu
          vehicles={deliveryVehicles}
        />
      }

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
              {deliveriesPolygon && deliveriesPolygon?.length > 0 && deliveriesPolygon.map((delivery) => (
                <tr key={delivery.id}>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-ellipsis">
                    {delivery.placa}
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
  )
}