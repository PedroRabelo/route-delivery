import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { Fragment, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as zod from 'zod'
import { Button } from '../../../components/Button'
import { FormInput } from '../../../components/Form'
import { TextAreaInput } from '../../../components/Form/FormTextarea'
import { api } from '../../../lib/axios'
import { Location } from '../../../services/types/Location'

type Props = {
  handleCloseLocation: () => void;
  openLocation: boolean;
  location: Location;
  fetchLocations: () => void;
}

const locationFormValidationSchema = zod.object({
  nome: zod.string(),
  verificarLocal: zod.boolean(),
  tempoEstimadoEntrega: zod.string(),
  tempoEstimadoCarga: zod.string(),
  latLongManual: zod.boolean(),
  clientesLocal: zod.string(),
  enderecoColetivo: zod.boolean(),
  zonaRisco: zod.boolean(),
  observacao: zod.string(),
  restritivoHorario: zod.boolean(),
});

type EditLocationFormData = zod.infer<typeof locationFormValidationSchema>


export function EditLocation({ handleCloseLocation, openLocation, location, fetchLocations }: Props) {
  const {
    bairro,
    cep,
    cidade,
    clientesLocal,
    endereco,
    enderecoColetivo,
    estado,
    id,
    latLongManual,
    latitude,
    longitude,
    nome,
    numero,
    observacao,
    restritivoHorario,
    tempoEstimadoCarga,
    tempoEstimadoEntrega,
    verificarLocal,
    zonaRisco
  } = location

  const [isLoading, setIsLoading] = useState(false);

  const [temVerificaLocal, setTemVerificaLocal] = useState(verificarLocal ? 1 : 0);
  const [temLatLongManual, setTemLatLongManual] = useState(latLongManual ? 1 : 0);
  const [temEndColetivo, setTemEndColetivo] = useState(enderecoColetivo ? 1 : 0);
  const [temZonaRisco, setTemZonaRisco] = useState(zonaRisco ? 1 : 0);
  const [temRestricao, setTemRestricao] = useState(restritivoHorario ? 1 : 0);

  const editLocationForm = useForm<EditLocationFormData>({
    resolver: zodResolver(locationFormValidationSchema),
    defaultValues: {
      nome,
      verificarLocal,
      tempoEstimadoEntrega,
      tempoEstimadoCarga,
      latLongManual,
      clientesLocal: clientesLocal?.toString(),
      enderecoColetivo,
      zonaRisco,
      observacao,
      restritivoHorario
    }
  })

  const { formState: { errors }, handleSubmit, register, reset } = editLocationForm

  const onSubmit: SubmitHandler<EditLocationFormData> = async (data) => {
    try {
      setIsLoading(true);

      await api.patch(`pedidos-locais/${id}`, {
        ...data,
        verificarLocal: temVerificaLocal === 1 ? true : false,
        latLongManual: temLatLongManual === 1 ? true : false,
        enderecoColetivo: temEndColetivo === 1 ? true : false,
        zonaRisco: temZonaRisco === 1 ? true : false,
        restritivoHorario: temRestricao === 1 ? true : false,
      })

      reset()
      setIsLoading(false)
      handleCloseLocation()
      fetchLocations()
    } catch (e: any) {
      setIsLoading(false);
      console.log(e);
      alert(e.response.data.message);
    }
  }

  const enderecoCompleto = `${endereco}, ${numero} ${bairro} - ${cidade}-${estado}`

  return (
    <Transition.Root show={openLocation} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => handleCloseLocation()}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <form
                    className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-indigo-700 px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-white">
                            Editar Local
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => handleCloseLocation()}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-indigo-300">
                            {location.id} - CEP: {location.cep}
                          </p>
                          <p className="text-sm text-indigo-300">
                            {enderecoCompleto}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                          <div className="space-y-6 pb-5 pt-6">
                            <div>
                              <label
                                htmlFor="nome"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Nome
                              </label>
                              <div className="mt-1">
                                <FormInput<EditLocationFormData>
                                  id="nome"
                                  type="text"
                                  name="nome"
                                  label="Nome"
                                  className="mb-2"
                                  register={register}
                                  errors={errors}
                                  size='small'
                                />
                              </div>
                            </div>

                            <div className='flex justify-between gap-2'>
                              <div>
                                <label
                                  htmlFor="tempoEstimadoEntrega"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Tempo Est. Entrega
                                </label>
                                <div className="mt-1">
                                  <FormInput<EditLocationFormData>
                                    id="tempoEstimadoEntrega"
                                    type="text"
                                    name="tempoEstimadoEntrega"
                                    label="Tempo Est. Entrega"
                                    className="mb-2"
                                    register={register}
                                    errors={errors}
                                    size='small'
                                  />
                                </div>
                              </div>

                              <div>
                                <label
                                  htmlFor="tempoEstimadoCarga"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Tempo Est. Carga
                                </label>
                                <div className="mt-1">
                                  <FormInput<EditLocationFormData>
                                    id="tempoEstimadoCarga"
                                    type="text"
                                    name="tempoEstimadoCarga"
                                    label="Tempo Est. Carga"
                                    className="mb-2"
                                    register={register}
                                    errors={errors}
                                    size='small'
                                  />
                                </div>
                              </div>

                              <div>
                                <label
                                  htmlFor="clientesLocal"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Clientes no local
                                </label>
                                <div className="mt-1">
                                  <FormInput<EditLocationFormData>
                                    id="clientesLocal"
                                    type="number"
                                    name="clientesLocal"
                                    label="Clientes no local"
                                    className="mb-2"
                                    register={register}
                                    errors={errors}
                                    size='small'
                                  />
                                </div>
                              </div>
                            </div>

                            <fieldset>
                              <div className="space-y-3">
                                <div className="relative flex items-start">
                                  <div className="absolute flex h-6 items-center">
                                    <input
                                      id="verificarLocal"
                                      name="verificarLocal"
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      value={temVerificaLocal}
                                      checked={temVerificaLocal === 1 ? true : false}
                                      onChange={() => setTemVerificaLocal(temVerificaLocal === 1 ? 0 : 1)}
                                    />
                                  </div>
                                  <div className="pl-7 text-sm leading-6">
                                    <label htmlFor="privacy-public" className="font-medium text-gray-900">
                                      Verificar local
                                    </label>
                                  </div>
                                </div>
                                <div>
                                  <div className="relative flex items-start">
                                    <div className="absolute flex h-6 items-center">
                                      <input
                                        id="latLongManual"
                                        name="latLongManual"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        value={temLatLongManual}
                                        checked={temLatLongManual === 1 ? true : false}
                                        onChange={() => setTemLatLongManual(temLatLongManual === 1 ? 0 : 1)}
                                      />
                                    </div>
                                    <div className="pl-7 text-sm leading-6">
                                      <label htmlFor="privacy-private-to-project" className="font-medium text-gray-900">
                                        Latitude/Longitude Manual
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="relative flex items-start">
                                    <div className="absolute flex h-6 items-center">
                                      <input
                                        id="enderecoColetivo"
                                        name="enderecoColetivo"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        value={temEndColetivo}
                                        checked={temEndColetivo === 1 ? true : false}
                                        onChange={() => setTemEndColetivo(temEndColetivo === 1 ? 0 : 1)}
                                      />
                                    </div>
                                    <div className="pl-7 text-sm leading-6">
                                      <label htmlFor="privacy-private" className="font-medium text-gray-900">
                                        Endereço coletivo
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="relative flex items-start">
                                    <div className="absolute flex h-6 items-center">
                                      <input
                                        id="zonaRisco"
                                        name="zonaRisco"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        value={temZonaRisco}
                                        checked={temZonaRisco === 1 ? true : false}
                                        onChange={() => setTemZonaRisco(temZonaRisco === 1 ? 0 : 1)}
                                      />
                                    </div>
                                    <div className="pl-7 text-sm leading-6">
                                      <label htmlFor="privacy-private" className="font-medium text-gray-900">
                                        Zona de risco
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="relative flex items-start">
                                    <div className="absolute flex h-6 items-center">
                                      <input
                                        id="restritivoHorario"
                                        name="restritivoHorario"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        value={temRestricao}
                                        checked={temRestricao === 1 ? true : false}
                                        onChange={() => setTemRestricao(temRestricao === 1 ? 0 : 1)}
                                      />
                                    </div>
                                    <div className="pl-7 text-sm leading-6">
                                      <label htmlFor="privacy-private" className="font-medium text-gray-900">
                                        Restrição de horário
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </fieldset>

                            <div>
                              <label
                                htmlFor="description"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Observação
                              </label>
                              <div className="mt-1">
                                <TextAreaInput<EditLocationFormData>
                                  id="observacao"
                                  name="observacao"
                                  className="mb-2"
                                  register={register}
                                  errors={errors}
                                />
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <Button
                        title="Editar"
                        color="primary"
                        type="submit"
                        disabled={isLoading}
                        loading={isLoading}
                      />
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
