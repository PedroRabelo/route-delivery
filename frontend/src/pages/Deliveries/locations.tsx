import { zodResolver } from '@hookform/resolvers/zod';
import { useLoadScript } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from 'react-router-dom';
import { utils, writeFile } from 'xlsx';
import * as zod from 'zod';
import { Button } from "../../components/Button";
import { FormInput } from "../../components/Form";
import { MapLocations } from '../../components/Maps';
import { api } from '../../lib/axios';
import { DeliveryPoints, DeliveryRoute, DeliveryVehicle, VehicleDeliveries } from '../../services/types/Delivery';
import { formatDateOnly } from '../../services/utils/formatDateOnly';
import { DeliveriesInfo } from './components/DeliveriesInfo';
import DeliveriesWithoutVehicle from './components/DeliveriesWithoutVehicle';
import DeliveryTab from './components/DeliveryTab';
import DeliveryVehicles from './components/DeliveryVehicles';
import Vehicles from './components/Vehicles';

const requiredText = "Campo obrigatório";

const deliveryFormValidationSchema = zod.object({
  distance: zod.string().min(1, requiredText),
  area1: zod.string().min(1, requiredText),
  area2: zod.string().min(1, requiredText),
});

type NewDeliveryFormData = zod.infer<typeof deliveryFormValidationSchema>


export function DeliveryLocations() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [deliveryPoints, setDeliveryPoints] = useState<DeliveryPoints[]>();
  const [deliveryVehicles, setDeliveryVehicles] = useState<DeliveryVehicle[]>();
  const [deliveryWithoutVehicle, setDeliveryWithoutVehicle] = useState<DeliveryPoints[]>();
  const [route, setRoute] = useState<DeliveryRoute>();
  const [licensePlate, setLicensePlate] = useState('');
  const [deliveriesByTruck, setDeliveriesByTruck] = useState<DeliveryPoints[]>();
  const [tabBarSelected, setTabBarSelected] = useState('Entregues');
  const [vehicleDeliveries, setVehicleDeliveries] = useState<VehicleDeliveries>();
  const [openVehicles, setOpenVehicles] = useState(false);

  let totalEntregues = 0;
  let totalNaoEntregues = 0;

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
    setDeliveriesByTruck(response.data);
  }

  async function fetchDeliveriesVehicles() {
    const response = await api.get(`/pedidos/veiculos/${id}`);

    setDeliveryVehicles(response.data);
  }

  async function fetchDeliveriesWithoutVehicle() {
    const response = await api.get(`/pedidos/nao-entregues/${id}`);

    setDeliveryWithoutVehicle(response.data);
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

  async function openDeliveriesByTruck(plate: string) {
    async function filterVehicle(licensePlate: string) {
      return deliveryVehicles?.find(vehicle => vehicle.placa === licensePlate);
    }

    const vehicle = await filterVehicle(plate);

    if (vehicle) {
      setVehicleDeliveries({ vehicle, orders: deliveryPoints });
      setLicensePlate(plate);
    }
  }

  function clearVehicleFilter() {
    setLicensePlate('');
    setDeliveriesByTruck(deliveryPoints);
  }

  useEffect(() => {
    function filterPoints(licencePlate: string) {
      return deliveryPoints?.filter(point => point.placa === licencePlate);
    }

    if (licensePlate !== '' && licensePlate !== undefined) {
      setDeliveriesByTruck(filterPoints(licensePlate));
    }
  }, [licensePlate]);

  useEffect(() => {
    if (tabBarSelected === 'Entregues') {
      setDeliveriesByTruck(deliveryPoints);
    } else if (tabBarSelected === 'Não Entregues') {
      setDeliveriesByTruck(deliveryWithoutVehicle);
    }
  }, [tabBarSelected]);

  totalEntregues = deliveryPoints?.length!;
  totalNaoEntregues = deliveryWithoutVehicle?.length!;

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex gap-2">
      <div className="container">
        <div className='flex-1 grow h-[88vh]'>
          <MapLocations deliveryPoints={deliveriesByTruck} />
        </div>
      </div>
      <div className="container flex-col">
        <form
          className="space-y-6 mt-0"
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="bg-white shadow sm:rounded-lg sm:p-4">
            <div className="md:grid md:grid-cols-12 md:gap-6">

              <div className="md:col-span-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Entrega
                  </label>
                  <div className="mt-1 flex rounded-md">
                    {route && route.data !== null &&
                      <label className="block text-lg font-bold text-gray-700 mb-1">
                        {formatDateOnly(route.data)}
                      </label>
                    }
                  </div>
                </div>
              </div>

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

        {licensePlate && licensePlate !== '' && (
          <DeliveriesInfo
            handleClearVehicle={() => clearVehicleFilter()}
            vehicleDeliveries={vehicleDeliveries!}
          />
        )}

        {licensePlate === '' && (
          <div className="pt-4 px-4 sm:px-6 lg:px-8 shadow sm:rounded-lg">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto pt-4">
                <DeliveryTab
                  handleChangeTabBar={(tab) => setTabBarSelected(tab)}
                  deliveries={{ withTruck: totalEntregues, noTruck: totalNaoEntregues }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  title="Veículos"
                  color="primary"
                  type="button"
                  disabled={isLoading}
                  loading={isLoading}
                  onClick={() => setOpenVehicles(true)}
                />
              </div>
            </div>

            {
              tabBarSelected === 'Entregues' && (
                <DeliveryVehicles
                  trucks={deliveryVehicles}
                  handleFilterDeliveryPoints={(plate) => openDeliveriesByTruck(plate)}
                  handleFetchDeliveryVehicles={() => fetchDeliveriesVehicles()}
                />
              )
            }

            {
              tabBarSelected === 'Não Entregues' && (
                <DeliveriesWithoutVehicle
                  deliveries={deliveryWithoutVehicle}
                />
              )
            }
          </div>
        )}
      </div>

      <Vehicles openVehicles={openVehicles} handleCloseVehicles={() => setOpenVehicles(false)} />
    </div>
  )
}