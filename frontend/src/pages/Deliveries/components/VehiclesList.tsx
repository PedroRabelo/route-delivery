import { useEffect, useState } from "react";
import { DeliveryPoints } from "../../../services/types/Delivery";
import { SaveVehicleDTO, Vehicle } from "../../../services/types/Vehicle";
import * as zod from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../../lib/axios";
import { formatNumber } from "../../../services/utils/formatNumber";
import { FormInput } from "../../../components/Form";
import { Button } from "../../../components/Button";
import classNames from "classnames";
import { Toggle } from "../../../components/Toggle/Toggle";

type Props = {
  deliveries?: DeliveryPoints[];
};

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

export function VehiclesList({ deliveries }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>();
  const [vehicleSelected, setVehicleSelected] = useState<number>();
  const [temRodizio, setTemRodizio] = useState(0);

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

  useEffect(() => {
    getVehicles();
  }, []);

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

        setVehicleSelected(undefined);
      } else {
        await api.post("/veiculos", body);
      }

      getVehicles();

      reset();
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
  }

  function getSumByKey(arr: any[], key: string | number) {
    return arr.reduce(
      (acc: number, current: { [x: string]: any }) =>
        acc + Number(current[key]),
      0
    );
  }

  function filterVehiclesActive() {
    return vehicles && vehicles.length > 0
      ? vehicles?.filter((veh) => veh.ativo)
      : [];
  }

  function filterLoadAvailable() {
    let available: number = 0;
    vehicles
      ?.filter((veh) => veh.ativo)
      .map((v) => {
        available = available + (v.capacidade * v.percentualCheio) / 100;
      });
    return available;
  }

  return (
    <div className="flex h-full flex-col divide-y divide-gray-200 bg-gray-50 shadow-4xl">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-4">
        <div className="flex flex-row justify-center text-gray-900 font-medium pl-4">
          <div className="flex gap-6 justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-medium">Veículos</span>
              <p>Total: {vehicles?.length}</p>
              <p>Ativos: {vehicles?.filter((veh) => veh.ativo).length}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium">Capacidade</span>
              <p>
                Disponível:{" "}
                {formatNumber(
                  getSumByKey(filterVehiclesActive(), "capacidade")
                )}
                KG
              </p>
              <p>Liberada: {formatNumber(filterLoadAvailable())}KG</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium">Carga</span>
              <p>
                Peso total:{" "}
                {deliveries?.length &&
                  formatNumber(getSumByKey(deliveries, "peso"))}
                KG
              </p>
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

          <div className="mt-4 flex flex-col">
            <div>
              <div className="inline-block min-w-full py-2 align-middle">
                <div className="overflow-y-auto max-h-[69vh] shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
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
                              {vehicle.capacidade}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {vehicle.percentualCheio}
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
                    <tfoot>
                      {vehicles?.length && (
                        <tr className="text-gray-900">
                          <td className="py-3 px-6 text-left">
                            {vehicles.filter((v) => v.ativo).length} Veículos
                            ativos
                          </td>
                          <td className="py-3 px-6 text-left">
                            {formatNumber(
                              getSumByKey(
                                vehicles.filter((v) => v.ativo),
                                "capacidade"
                              )
                            )}
                            Kg
                          </td>
                        </tr>
                      )}
                    </tfoot>
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
