import { MapIcon, MapPinIcon, QueueListIcon, TableCellsIcon, TruckIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { utils, writeFile } from "xlsx";
import * as zod from 'zod';
import { Button } from "../../components/Button";
import { FormInput } from "../../components/Form";
import { api } from "../../lib/axios";
import { DeliveryPoints, DeliveryRoute, DeliveryVehicle, VehicleDeliveries } from "../../services/types/Delivery";
import { formatDateOnly } from "../../services/utils/formatDateOnly";
import { DeliveriesMap } from "./components/DeliveriesMap";
import { DeliveriesVehicle } from "./components/DeliveriesVehicles";
import { DeliveriesWithoutVehicle } from "./components/DeliveriesWithoutVehicle";

const requiredText = "Campo obrigatório";

const deliveryFormValidationSchema = zod.object({
  distance: zod.string().min(1, requiredText),
  area1: zod.string().min(1, requiredText),
  area2: zod.string().min(1, requiredText),
});

type NewDeliveryFormData = zod.infer<typeof deliveryFormValidationSchema>

const tabs = [
  { id: 1, name: 'Mapa', icon: MapIcon },
  { id: 2, name: 'Rotas', icon: MapPinIcon },
  { id: 3, name: 'Pedidos sem veículo', icon: QueueListIcon },
  // { id: 4, name: 'Simulações', icon: TableCellsIcon },
  { id: 5, name: 'Veículos', icon: TruckIcon },
]

export function RoutesDelivery() {

  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [tabSelected, setTabSelected] = useState(1);
  const [vehicleDeliveries, setVehicleDeliveries] = useState<VehicleDeliveries>();
  const [deliveryPoints, setDeliveryPoints] = useState<DeliveryPoints[]>();
  const [deliveryVehicles, setDeliveryVehicles] = useState<DeliveryVehicle[]>();
  const [deliveryWithoutVehicle, setDeliveryWithoutVehicle] = useState<DeliveryPoints[]>();
  const [route, setRoute] = useState<DeliveryRoute>();
  const [licensePlate, setLicensePlate] = useState('');

  const newDeliveryForm = useForm<NewDeliveryFormData>({
    resolver: zodResolver(deliveryFormValidationSchema),
  })

  const { formState: { errors }, handleSubmit, register, getValues } = newDeliveryForm

  useEffect(() => {
    async function getRoute() {
      const response = await api.get(`/pedidos/roteiro/${id}`);

      setRoute(response.data);
    }

    try {
      getRoute();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onSubmit: SubmitHandler<NewDeliveryFormData> = async (data) => {
    setDeliveryPoints([]);
    setLicensePlate('');

    const body = {
      startDate: route?.data,
      ...data
    }

    try {
      setIsLoading(true);
      await api.post("/pedidos/entregas", body);

      if (route?.data) {
        await fetchDeliveriesPoints();
        await fetchDeliveriesVehicles();
        await fetchDeliveriesWithoutVehicle();
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }

  async function fetchDeliveriesPoints() {
    const response = await api.get(`/pedidos/dia/${id}`);

    setDeliveryPoints(response.data);
  }

  async function fetchDeliveriesVehicles() {
    const response = await api.get(`/pedidos/veiculos/${id}`);

    setDeliveryVehicles(response.data);
  }

  async function fetchDeliveriesWithoutVehicle() {
    const response = await api.get(`/pedidos/nao-entregues/${id}`);

    setDeliveryWithoutVehicle(response.data);
  }

  async function fetchUpdateDeliveries() {
    fetchDeliveriesPoints();
    fetchDeliveriesVehicles();
    fetchDeliveriesWithoutVehicle();
  }

  async function exportDeliveries(params: NewDeliveryFormData) {
    try {
      if (params.area1 === '' || params.area2 === '' || params.distance === '') {
        alert('Informe a distância e os quadrantes');
        return;
      }

      setIsLoading(true);
      const response = await api.post(`/pedidos/retorno/${id}`, params);

      const worksheet = utils.json_to_sheet(response.data);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Entregas");
      writeFile(workbook, `Entregas-${route?.data}.xlsx`);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="p-4 shadow-lg rounded-lg md:flex md:items-center md:justify-between bg-gray-100">
        <div className="flex-1">
          <h2 className="text-sm font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
            Data da entrega
          </h2>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {route && route.data !== null &&
              <label className="block text-lg font-bold text-gray-700 mb-1">
                {formatDateOnly(route.data)}
              </label>
            }
          </h2>
        </div>
        <div className="pl-8">
          <form
            className="space-y-6 mt-0"
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <div className="md:grid md:grid-cols-12 md:gap-6">
                <div className="md:col-span-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Distância
                    </label>
                    <FormInput<NewDeliveryFormData>
                      id="distance"
                      type="text"
                      name="distance"
                      label="Distância"
                      className="mb-2"
                      register={register}
                      errors={errors}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quadrante 1(Km²)
                    </label>
                    <FormInput<NewDeliveryFormData>
                      id="area1"
                      type="text"
                      name="area1"
                      label="Quadrante 1"
                      className="mb-2"
                      register={register}
                      errors={errors}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quadrante 2(Km²)
                    </label>
                    <FormInput<NewDeliveryFormData>
                      id="area2"
                      type="text"
                      name="area2"
                      label="Quadrante 2"
                      className="mb-2"
                      register={register}
                      errors={errors}
                    />
                  </div>
                </div>

                <div className="flex flex-row items-center gap-2 md:col-span-4">
                  <div>
                    <Button
                      title="Calcular entregas"
                      color="primary"
                      type="submit"
                      disabled={isLoading}
                      loading={isLoading}
                    />
                  </div>
                  <div>
                    <Button
                      title="Exportar arquivo"
                      color="primary"
                      type="button"
                      onClick={() => exportDeliveries(getValues())}
                      disabled={isLoading}
                      loading={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="shadow-lg rounded-lg md:flex md:items-center md:justify-around bg-gray-100">
        <div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <a
                    key={tab.id}
                    href="#"
                    className={classNames(
                      tab.id === tabSelected
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium'
                    )}
                    aria-current={tab.id === tabSelected ? 'page' : undefined}
                    onClick={() => setTabSelected(tab.id)}
                  >
                    <tab.icon
                      className={classNames(
                        tab.id === tabSelected ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500',
                        '-ml-0.5 mr-2 h-5 w-5'
                      )}
                      aria-hidden="true"
                    />
                    <span>{tab.name}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        {tabSelected == 1 &&
          <DeliveriesMap
            deliveryPoints={deliveryPoints}
            deliveryVehicles={deliveryVehicles}
            deliveryWithoutVehicle={deliveryWithoutVehicle}
          />
        }
        {tabSelected == 2 &&
          <DeliveriesVehicle
            trucks={deliveryVehicles}
            handleFetchUpdateDeliveries={() => fetchUpdateDeliveries()}
            deliveryPoints={deliveryPoints}
          />
        }
        {tabSelected == 3 &&
          <DeliveriesWithoutVehicle
            deliveries={deliveryWithoutVehicle}
          />
        }

      </div>
    </div>
  )
}