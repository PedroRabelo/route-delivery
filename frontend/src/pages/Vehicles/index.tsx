import {
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as zod from "zod";
import { Button } from "../../components/Button";
import { FormInput } from "../../components/Form";
import { Toggle } from "../../components/Toggle/Toggle";
import { api } from "../../lib/axios";
import {
  AddZoneVehicleDTO,
  SaveVehicleDTO,
  Vehicle,
  VehicleZone,
} from "../../services/types/Vehicle";
import { Zone } from "../../services/types/Zone";
import { formatNumber } from "../../services/utils/formatNumber";
const requiredText = "Campo obrigatório";

const vehicleFormValidationSchema = zod.object({
  placa: zod.string().min(1, requiredText),
  capacidade: zod.string().min(1, requiredText),
  percentualCheio: zod.string().min(1, requiredText),
  qtdLocais: zod.string().min(1, requiredText),
  codigoFrota: zod.string().min(1, requiredText),
  qtdMinLocais: zod.string().min(1, requiredText),
  pesoMinimo: zod.string().min(1, requiredText),
});

type NewVehicleFormData = zod.infer<typeof vehicleFormValidationSchema>;

export function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>();
  const [zones, setZones] = useState<Zone[]>([]);
  const [vehicleSelected, setVehicleSelected] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [temRodizio, setTemRodizio] = useState(0);
  const [vehicleZones, setVehicleZones] = useState<VehicleZone[]>([]);
  const [zoneSelected, setZoneSelected] = useState<number>(-1);

  const newVehicleForm = useForm<NewVehicleFormData>({
    resolver: zodResolver(vehicleFormValidationSchema),
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = newVehicleForm;

  async function getVehicles() {
    try {
      const response = await api.get("/veiculos");
      setVehicles(response.data);
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function getZones() {
    try {
      const response = await api.get("/zonas");
      setZones(response.data);
    } catch (error: any) {
      alert(error.message);
    }
  }

  useEffect(() => {
    getVehicles();
    getZones();
  }, []);

  async function getVehicleZones(vehicleId: number) {
    try {
      const response = await api.get(`/veiculos/zonas/${vehicleId}`);

      if (response.data) {
        // setVehicleZones(zones.filter((zone) => response.data.includes(zone.id)));

        const vehicleZones: VehicleZone[] = [];
        await response.data.forEach((zone: VehicleZone) => {
          vehicleZones.push({
            zonaId: zone.zonaId,
            zona: zones.find((z) => z.id === zone.zonaId)?.titulo!,
            prioridade: zone.prioridade,
          });
        });
        setVehicleZones(vehicleZones);
      }
    } catch (error: any) {
      alert(error.message);
    }
  }

  const onSubmit: SubmitHandler<NewVehicleFormData> = async (data) => {
    try {
      const body: SaveVehicleDTO = {
        placa: data.placa,
        temRodizio: temRodizio === 1 ? true : false,
        capacidade: parseInt(data.capacidade),
        percentualCheio: parseInt(data.percentualCheio),
        qtdLocais: parseInt(data.qtdLocais),
        codigoFrota: parseInt(data.codigoFrota),
        qtdMinLocais: parseInt(data.qtdMinLocais),
        pesoMinimo: parseInt(data.pesoMinimo),
      };

      setIsLoading(true);

      if (vehicleSelected) {
        await api.put(`veiculos/${vehicleSelected}`, body);
      } else {
        await api.post("/veiculos", body);
      }

      getVehicles();

      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      console.log(e);
      alert(e.response.data.message);
    }
  };

  function handleEditVehicle(vehicle: Vehicle) {
    reset();

    setVehicleSelected(vehicle.id);

    setValue("placa", vehicle.placa);
    setValue("capacidade", vehicle.capacidade?.toString());
    setValue("percentualCheio", vehicle.percentualCheio?.toString());
    setValue("qtdLocais", vehicle.qtdLocais?.toString());
    setValue("codigoFrota", vehicle.codigoFrota?.toString());
    setValue("qtdMinLocais", vehicle.qtdMinLocais?.toString());
    setValue("pesoMinimo", vehicle.pesoMinimo?.toString());

    setTemRodizio(vehicle.temRodizio ? 1 : 0);

    getVehicleZones(vehicle.id);
  }

  async function handleChangeStatus(status: boolean, vehicleId: number) {
    try {
      await api.patch(`/veiculos/${vehicleId}`, { ativo: !status });

      const updatedVehicle = vehicles?.map((v) => {
        if (v.id === vehicleId) {
          return { ...v, ativo: !status };
        }

        return v;
      });

      setVehicles(updatedVehicle);
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function handleAddZone() {
    try {
      if (
        vehicleZones.length > 0 &&
        vehicleZones.some((zone) => zone.zonaId === zoneSelected)
      ) {
        alert("Zona já adicionada");
        return;
      }

      const body: AddZoneVehicleDTO = {
        zonaId: zoneSelected,
        veiculoId: vehicleSelected!,
        prioridade: vehicleZones.length + 1,
      };

      await api.post("veiculos/zona", body);

      getVehicleZones(vehicleSelected!);
      setZoneSelected(0);
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function handleRemoveZone(zoneId: number) {
    try {
      await api.delete(`veiculos/${vehicleSelected}/zona/${zoneId}`);
      getVehicleZones(vehicleSelected!);
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function handleSavePriority(
    zoneId: number,
    priority: number,
    action: "UP" | "DOWN"
  ) {
    try {
      const newPriority: number = action === "UP" ? priority - 1 : priority + 1;

      await api.patch(`veiculos/zonas/${vehicleSelected}/${zoneId}`, {
        prioridade: newPriority,
      });
      getVehicleZones(vehicleSelected!);
    } catch (error: any) {
      alert(error.message);
    }
  }

  function getSumByKey(arr: any[], key: string | number) {
    return arr.reduce(
      (acc: number, current: { [x: string]: any }) =>
        acc + Number(current[key]),
      0
    );
  }

  return (
    <div className="flex gap-2">
      <div className="container">
        <div className="flex flex-col">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-y-auto max-h-[82vh] shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Placa
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Cap.(Kg)
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Perc. Cheio(%)
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Peso Mínimo
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Máx. Locais
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Min. Locais
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Cód. Frota
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Rodízio
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Ativo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {vehicles &&
                    vehicles?.length > 0 &&
                    vehicles.map((vehicle) => (
                      <tr key={vehicle.placa}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                          <a
                            className={classNames(
                              vehicleSelected === vehicle.id
                                ? "text-indigo-500"
                                : "text-gray-900",
                              "cursor-pointer text-base font-bold"
                            )}
                            onClick={() => handleEditVehicle(vehicle)}
                          >
                            {vehicle.placa}
                          </a>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatNumber(vehicle.capacidade)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {vehicle.percentualCheio}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatNumber(vehicle.pesoMinimo)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {vehicle.qtdLocais}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {vehicle.qtdMinLocais}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {vehicle.codigoFrota}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {vehicle.temRodizio ? "SIM" : "NÃO"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <Toggle
                            enabled={vehicle.ativo!}
                            handleChangeToggle={() =>
                              handleChangeStatus(vehicle.ativo!, vehicle.id)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
                <tfoot></tfoot>
              </table>
            </div>
            <div className="pt-4">
              {vehicles?.length && (
                <div className="text-gray-900">
                  <span className="py-3 px-6 font-bold">
                    {vehicles.filter((v) => v.ativo).length} Veículos ativos
                  </span>
                  <span className="py-3 px-6 font-bold">
                    {formatNumber(
                      getSumByKey(
                        vehicles.filter((v) => v.ativo),
                        "capacidade"
                      )
                    )}
                    Kg
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container flex-col">
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
                    Peso Mínimo(Kg)
                  </label>
                  <FormInput<NewVehicleFormData>
                    id="pesoMinimo"
                    type="number"
                    name="pesoMinimo"
                    label="Peso Mínimo"
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
                    Min. Locais
                  </label>
                  <FormInput<NewVehicleFormData>
                    id="qtdMinLocais"
                    type="number"
                    name="qtdMinLocais"
                    label="Min. Locais"
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

              <div className="md:col-span-1">
                <div className="flex flex-row justify-center items-center gap-4 h-16">
                  <label className="block text-sm font-medium text-gray-700">
                    Rodízio?
                  </label>
                  <input
                    id="temRodizio"
                    name="temRodizio"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    value={temRodizio}
                    checked={temRodizio === 1 ? true : false}
                    onChange={() => setTemRodizio(temRodizio === 1 ? 0 : 1)}
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

        <div className="bg-white shadow sm:rounded-lg sm:p-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <div className="flex items-center justify-between col-span-1 mb-4">
                <span className="font-semibold pb-2">Zonas</span>
                <Button
                  title="Adicionar"
                  color="primary"
                  type="button"
                  disabled={
                    zoneSelected === -1 || vehicleSelected === undefined
                  }
                  loading={isLoading}
                  onClick={() => handleAddZone()}
                />
              </div>

              <div className="inline-block min-w-full max-w-[40vh] align-middle">
                <div className="relative overflow-y-auto max-h-[40vh] shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Nome
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {zones &&
                        zones?.length > 0 &&
                        zones.map((zone, index) => (
                          <tr key={zone.id}>
                            <td
                              className={classNames(
                                zoneSelected === zone.id && "bg-slate-400",
                                "whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6 hover:bg-slate-200 hover:cursor-pointer"
                              )}
                              onClick={() => setZoneSelected(zone.id)}
                            >
                              {zone.titulo}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-semibold pb-2 mb-8">Zonas cadastradas</h2>
              <div className="inline-block min-w-full max-w-[40vh] align-middle">
                <div className="relative overflow-y-auto max-h-[40vh] shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          <span className="sr-only">Prioridade</span>
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Nome
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Remover</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {vehicleZones &&
                        vehicleZones?.length > 0 &&
                        vehicleZones.map((zone, index) => (
                          <tr key={zone.zonaId}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                              {zone.prioridade}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                              {zone.zona}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 sm:pl-6">
                              <div className="flex flex-row gap-4">
                                {zone.prioridade > 1 && (
                                  <a
                                    className="flex flex-col items-center hover:text-cyan-900 cursor-pointer"
                                    onClick={() =>
                                      handleSavePriority(
                                        zone.zonaId,
                                        zone.prioridade,
                                        "UP"
                                      )
                                    }
                                  >
                                    <ChevronUpIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                    <span className="text-xs">Subir</span>
                                  </a>
                                )}

                                {zone.prioridade < vehicleZones.length && (
                                  <a
                                    className="flex flex-col items-center hover:text-cyan-900 cursor-pointer"
                                    onClick={() =>
                                      handleSavePriority(
                                        zone.zonaId,
                                        zone.prioridade,
                                        "DOWN"
                                      )
                                    }
                                  >
                                    <ChevronDownIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                    <span className="text-xs">Descer</span>
                                  </a>
                                )}

                                <a
                                  className="flex flex-col items-center text-red-600 hover:text-red-900 cursor-pointer"
                                  onClick={() => handleRemoveZone(zone.zonaId)}
                                >
                                  <TrashIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                  <span className="text-xs">Remover</span>
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
