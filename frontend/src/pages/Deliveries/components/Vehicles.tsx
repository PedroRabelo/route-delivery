import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import { Fragment, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import * as zod from 'zod';
import { Button } from '../../../components/Button';
import { FormInput, SelectInput } from '../../../components/Form';
import { Toggle } from '../../../components/Toggle/Toggle';
import { api } from '../../../lib/axios';
import { SaveVehicleDTO, Vehicle } from '../../../services/types/Vehicle';
import { DeliveryPoints } from '../../../services/types/Delivery'
import { formatNumber } from '../../../services/utils/formatNumber';

type Props = {
  handleCloseVehicles: () => void;
  openVehicles: boolean;
}

const requiredText = "Campo obrigatório";

const vehicleFormValidationSchema = zod.object({
  placa: zod.string().min(1, requiredText),
  rodizio: zod.string().min(1, requiredText),
  capacidade: zod.string().min(1, requiredText),
  percentualCheio: zod.string().min(1, requiredText),
  qtdLocais: zod.string().min(1, requiredText),
  codigoFrota: zod.string().min(1, requiredText)
});

type NewVehicleFormData = zod.infer<typeof vehicleFormValidationSchema>

type DiaSemana = {
  id: string;
  name: string;
  title: string;
}
const diasSemana: DiaSemana[] = [
  {
    id: '2',
    name: 'SEGUNDA-FEIRA',
    title: 'SEG'
  },
  {
    id: '3',
    name: 'TERÇA-FEIRA',
    title: 'TER'
  },
  {
    id: '4',
    name: 'QUARTA-FEIRA',
    title: 'QUA'
  },
  {
    id: '5',
    name: 'QUINTA-FEIRA',
    title: 'QUI'
  },
  {
    id: '6',
    name: 'SEXTA-FEIRA',
    title: 'SEX'
  }

]

export default function Vehicles({ handleCloseVehicles, openVehicles }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>();
  const [vehicleSelected, setVehicleSelected] = useState<number>();
  const [deliveries, setDeliveries] = useState<DeliveryPoints[]>();

  const { id } = useParams();


  const newVehicleForm = useForm<NewVehicleFormData>({
    resolver: zodResolver(vehicleFormValidationSchema),
  })

  const { formState: { errors }, handleSubmit, register, reset, setValue } = newVehicleForm

  async function getVehicles() {
    try {
      const response = await api.get('/veiculos');
      setVehicles(response.data);
    } catch (error: any) {
      alert(error.message)
    }
  }

  async function getDeliveries() {
    try {
      const response = await api.get(`/pedidos/dia/${id}`);
      setDeliveries(response.data);
    } catch (error: any) {
      alert(error.message)
    }
  }

  useEffect(() => {
    getVehicles();
    getDeliveries();
  }, []);



  async function handleChangeStatus(status: boolean, vehicleId: number) {
    try {
      await api.patch(`/veiculos/${vehicleId}`, { ativo: !status });

      const updatedVehicle = vehicles?.map(v => {
        if (v.id === vehicleId) {
          return { ...v, ativo: !status }
        }

        return v;
      });

      setVehicles(updatedVehicle);
    } catch (error: any) {
      alert(error.message)
    }
  }

  const onSubmit: SubmitHandler<NewVehicleFormData> = async (data) => {
    try {

      const body: SaveVehicleDTO = {
        placa: data.placa,
        rodizio: data.rodizio,
        capacidade: parseInt(data.capacidade),
        percentualCheio: parseInt(data.percentualCheio),
        qtdLocais: parseInt(data.qtdLocais),
        codigoFrota: parseInt(data.codigoFrota)
      }

      setIsLoading(true);

      if (vehicleSelected) {
        await api.put(`veiculos/${vehicleSelected}`, body);

        setVehicleSelected(undefined);
      } else {
        await api.post('/veiculos', body);
      }

      getVehicles();

      reset();
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      console.log(e);
      alert(e.response.data.message);
    }
  }

  function handleEditVehicle(vehicle: Vehicle) {
    reset();

    setVehicleSelected(vehicle.id);

    setValue("placa", vehicle.placa);
    setValue("rodizio", vehicle?.rodizio);
    setValue("capacidade", vehicle.capacidade?.toString());
    setValue("percentualCheio", vehicle.percentualCheio?.toString());
    setValue("qtdLocais", vehicle.qtdLocais?.toString());
    setValue("codigoFrota", vehicle.codigoFrota?.toString());
  }

  function getSumByKey(arr: any[], key: string | number) {
    return arr.reduce((acc: number, current: { [x: string]: any; }) => acc + Number(current[key]), 0);
  }

  function filterVehiclesActive() {
    return vehicles && vehicles.length > 0 ? vehicles?.filter((veh) => veh.ativo) : [];
  }

  return (
    <Transition.Root show={openVehicles} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => handleCloseVehicles()}>
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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-4xl">
                  <div className="flex h-full flex-col divide-y divide-gray-200 bg-gray-50 shadow-4xl">
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">Veículos</Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              onClick={() => handleCloseVehicles()}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-2">
                        <div>
                          <div className='flex flex-row justify-between text-gray-900 font-medium'>
                            <p>Qtd. veículos ativos: {vehicles?.filter((veh) => veh.ativo).length}</p>
                            <p>Capacidade disponível: {formatNumber(getSumByKey(filterVehiclesActive(), 'capacidade'))}KG</p>
                            <p>Peso total:</p>{deliveries?.length && <p>{formatNumber(getSumByKey(deliveries, 'peso'))}KG</p>}
                            <p>Quantidade de entregas: {deliveries?.length}</p>
                          </div>
                        </div>

                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-2">
                        <form
                          className="space-y-4 mt-0"
                          autoComplete="off"
                          onSubmit={handleSubmit(onSubmit)}
                        >
                          <div className="bg-white shadow sm:rounded-lg sm:p-4">
                            <div className="md:grid md:grid-cols-4 md:gap-4">

                              <div className="md:col-span-1">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Placa
                                  </label>
                                  <FormInput<NewVehicleFormData>
                                    id="placa"
                                    type="text"
                                    name="placa"
                                    label="Placa"
                                    className="mb-2"
                                    register={register}
                                    errors={errors}
                                  />
                                </div>
                              </div>

                              <div className="md:col-span-1">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rodízio
                                  </label>
                                  <SelectInput<NewVehicleFormData>
                                    id="rodizio"
                                    name="rodizio"
                                    className="mb-2"
                                    options={diasSemana}
                                    register={register}
                                    errors={errors}
                                  />
                                </div>
                              </div>

                              <div className="md:col-span-1">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Capacidade(Kg)
                                  </label>
                                  <FormInput<NewVehicleFormData>
                                    id="area"
                                    type="number"
                                    name="capacidade"
                                    label="Capacidade"
                                    className="mb-2"
                                    register={register}
                                    errors={errors}
                                  />
                                </div>
                              </div>

                              <div className="md:col-span-1">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Perc. Cheio(%)
                                  </label>
                                  <FormInput<NewVehicleFormData>
                                    id="percCheio"
                                    type="number"
                                    name="percentualCheio"
                                    label="Perc. Cheio"
                                    className="mb-2"
                                    register={register}
                                    errors={errors}
                                  />
                                </div>
                              </div>

                              <div className="md:col-span-1">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Máx. Locais
                                  </label>
                                  <FormInput<NewVehicleFormData>
                                    id="maxLocais"
                                    type="number"
                                    name="qtdLocais"
                                    label="Máx. Locais"
                                    className="mb-2"
                                    register={register}
                                    errors={errors}
                                  />
                                </div>
                              </div>

                              <div className="md:col-span-1">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cód. Frota
                                  </label>
                                  <FormInput<NewVehicleFormData>
                                    id="codFrota"
                                    type="number"
                                    name="codigoFrota"
                                    label="Cod. Frota"
                                    className="mb-2"
                                    register={register}
                                    errors={errors}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center md:col-span-1">
                                <Button
                                  title="Adicionar"
                                  color="primary"
                                  type="submit"
                                  disabled={isLoading}
                                  loading={isLoading}
                                />
                              </div>
                            </div>
                          </div>
                        </form>

                        <div className="mt-4 flex flex-col">
                          <div>
                            <div className="inline-block min-w-full py-2 align-middle">
                              <div className="overflow-y-auto max-h-[69vh] shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Placa
                                      </th>
                                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Rodízio
                                      </th>
                                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Capacidade(Kg)
                                      </th>
                                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Perc. Cheio(%)
                                      </th>
                                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Máx Locais
                                      </th>
                                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Cód. Frota
                                      </th>
                                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Ativo
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 bg-white">
                                    {vehicles && vehicles?.length > 0 && vehicles.map((vehicle) => (
                                      <tr key={vehicle.placa}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                          <a
                                            className={classNames(vehicleSelected === vehicle.id
                                              ? "text-indigo-500"
                                              : "text-gray-900",
                                              "cursor-pointer text-base font-bold")}
                                            onClick={() => handleEditVehicle(vehicle)}>
                                            {vehicle.placa}
                                          </a>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{vehicle.rodizio}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{vehicle.capacidade}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{vehicle.percentualCheio}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{vehicle.qtdLocais}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{vehicle.codigoFrota}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                          <Toggle enabled={vehicle.ativo!} handleChangeToggle={() => handleChangeStatus(vehicle.ativo!, vehicle.id)} />
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot>
                                    {vehicles?.length && <tr className="text-gray-900">
                                      <td className="py-3 px-6 text-left">
                                        {vehicles?.length} Veículos
                                      </td>
                                      <td className="py-3 px-6 text-left">
                                        {getSumByKey(vehicles, 'capacidade')}Kg
                                      </td>
                                    </tr>}
                                  </tfoot>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
