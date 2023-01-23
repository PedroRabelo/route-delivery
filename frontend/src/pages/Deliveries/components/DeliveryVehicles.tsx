import { ChevronDownIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { TableHead } from "../../../components/TableHead/TableHead";
import { useSortableTable } from "../../../hooks/useSortableTable";
import { DeliveryVehicle } from "../../../services/types/Delivery"
import { formatCurrency, formatNumber } from "../../../services/utils/formatNumber";

type Props = {
  trucks: DeliveryVehicle[] | undefined;
  handleFilterDeliveryPoints: (licencePlate: string) => void;
}

const columns = [
  { label: "Ordem", accessor: "order", sortable: true },
  { label: "Placa", accessor: "plate", sortable: false },
  { label: "Capacidade", accessor: "capacity", sortable: true },
  { label: "Locais", accessor: "locations", sortable: true },
  { label: "Pedidos", accessor: "orders", sortable: true },
  { label: "Carga(KG)", accessor: "load", sortable: true },
  { label: "Valor(R$)", accessor: "amount", sortable: true },
  { label: "(%)", accessor: "percentage", sortable: true },
];

export default function DeliveryVehicles({ trucks, handleFilterDeliveryPoints }: Props) {

  const [plateSelected, setPlateSelected] = useState('');

  //const [tableData, handleSorting] = useSortableTable(trucks, columns);

  function handleLicensePlateClick(licencePlate: string) {
    setPlateSelected(licencePlate);
    handleFilterDeliveryPoints(licencePlate);
  }

  function getSumByKey(arr: DeliveryVehicle[], key: string | number) {
    return arr.reduce((acc: number, current: { [x: string]: any; }) => acc + Number(current[key]), 0);
  }

  function getPercentAvg(arr: DeliveryVehicle[]) {
    const bruto = getSumByKey(arr, 'peso');
    const capacidade = getSumByKey(arr, 'capacidade');

    return (bruto * 100) / capacidade;
  }

  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-y-auto max-h-[60vh] shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <TableHead
                columns={columns}
              />
              <tbody className="divide-y divide-gray-200 bg-white">
                {trucks && trucks?.length > 0 && trucks.map((truck) => (
                  <tr key={truck.placa}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{truck.ordem}</td>
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
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{truck.capacidade}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{truck.locais}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{truck.pedidos}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatNumber(truck.peso)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatCurrency(truck.valor)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatCurrency(truck.percentual)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {trucks?.length && <tr className="text-gray-900">
                  <th scope="row" className="py-3 font-semibold text-center">Total</th>
                  <td className="py-3 px-6 text-center">
                    {trucks?.length}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {getSumByKey(trucks, 'capacidade')}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {getSumByKey(trucks, 'locais')}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {getSumByKey(trucks, 'pedidos')}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {formatNumber(getSumByKey(trucks, 'peso'))}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {formatCurrency(getSumByKey(trucks, 'valor'))}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {formatNumber(getPercentAvg(trucks))}
                  </td>
                </tr>}
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
