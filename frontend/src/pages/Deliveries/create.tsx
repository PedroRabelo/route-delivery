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
import { DeliveryPoints, DeliveryRoute, DeliveryVehicle } from '../../services/types/Delivery';
import { formatDateOnly } from '../../services/utils/formatDateOnly';
import { DeliveryTable } from './components/DeliveryTable';

const requiredText = "Campo obrigatório";

const deliveryFormValidationSchema = zod.object({
  deliveries: zod.string().min(1, requiredText),
  area: zod.string().min(1, requiredText),
});

type NewDeliveryFormData = zod.infer<typeof deliveryFormValidationSchema>

export function CreateDelivery() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [deliveryPoints, setDeliveryPoints] = useState<DeliveryPoints[]>();
  const [deliveryVehicles, setDeliveryVehicles] = useState<DeliveryVehicle[]>();
  const [route, setRoute] = useState<DeliveryRoute>();
  const [licensePlate, setLicensePlate] = useState('');
  const [deliveriesByTruck, setDeliveriesByTruck] = useState<DeliveryPoints[]>();

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
    console.log('generate routes');
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

  async function exportDeliveries(params: NewDeliveryFormData) {
    try {
      if (params.area === '' || params.deliveries === '') {
        alert('Informe a quantidade de entregas e área máxima');
        return;
      }

      const response = await api.post(`/pedidos/retorno/${id}`, params);

      const worksheet = utils.json_to_sheet(response.data);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Entregas");
      writeFile(workbook, `Entregas-${route?.data}.xlsx`);
    } catch (error) {
      console.log(error);
    }
  }

  async function filterDeliveriesByTruck(plate: string) {
    setLicensePlate(plate);
  }

  useEffect(() => {
    function filterPoints(licencePlate: string) {
      return deliveryPoints?.filter(point => point.placa === licencePlate);
    }

    if (licensePlate !== '' && licensePlate !== undefined) {
      setDeliveriesByTruck(filterPoints(licensePlate));
    }
  }, [licensePlate]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className='flex flex-col'>
      <form
        className="space-y-6 mt-0"
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="bg-white shadow sm:rounded-lg sm:p-4">
          <div className="md:grid md:grid-cols-6 md:gap-6">

            <div className="md:col-span-1">
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

            <div className="md:col-span-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entregas por caminhão
                </label>
                <FormInput<NewDeliveryFormData>
                  id="deliveries"
                  type="text"
                  name="deliveries"
                  label="Entregas por caminhão"
                  className="mb-2"
                  register={register}
                  errors={errors}
                />
              </div>
            </div>

            <div className="md:col-span-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Área Máxima(em Km²)
                </label>
                <FormInput<NewDeliveryFormData>
                  id="area"
                  type="text"
                  name="area"
                  label="Área Máxima"
                  className="mb-2"
                  register={register}
                  errors={errors}
                />
              </div>
            </div>

            <div className="flex flex-row items-center gap-2 md:col-span-3">
              <div>
                <Button title="Calcular entregas" color="primary" type="submit" disabled={isLoading} loading={isLoading} />
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

      <div className='flex-1 grow'>
        <MapLocations deliveryPoints={deliveriesByTruck} handleSetBounds={() => null} />
      </div>

      <DeliveryTable
        trucks={deliveryVehicles}
        handleFilterDeliveryPoints={(plate) => filterDeliveriesByTruck(plate)}
        clearLicencePlate={licensePlate ? false : true}
      />
    </div>
  )
}