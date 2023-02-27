import { useLoadScript } from "@react-google-maps/api";
import { Bound, MapDrawing } from "../../components/Maps/MapDrawing";
import * as zod from 'zod';
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "../../components/Form";
import { Button } from "../../components/Button";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { CreateZoneCoordsDTO, CreateZoneDTO, Zone, ZoneCoords } from "../../services/types/Zone";
import { api } from "../../lib/axios";
import { DataTableActions } from "../../components/DataTable/data-table-actions";
import { TrashIcon } from "@heroicons/react/24/outline";

const libraries: (
  | "places"
  | "drawing"
  | "geometry"
  | "localContext"
  | "visualization"
)[] = ["drawing"];

const requiredText = "Campo obrigatório";

const zoneFormValidationSchema = zod.object({
  titulo: zod.string().min(1, requiredText),
})

type NewZoneFormData = zod.infer<typeof zoneFormValidationSchema>

export default function Zones() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: libraries,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [zones, setZones] = useState<Zone[]>([]);
  const [zoneSelected, setZoneSelected] = useState<number>();
  const [bounds, setBounds] = useState<Bound[]>([]);

  const newZoneForm = useForm<NewZoneFormData>({
    resolver: zodResolver(zoneFormValidationSchema),
  })

  const { formState: { errors }, handleSubmit, register, setValue } = newZoneForm

  async function getZones() {
    try {
      const response = await api.get('zonas')
      setZones(response.data);
    } catch (error: any) {
      alert(error.message)
    }
  }

  useEffect(() => {
    getZones();
  }, []);

  const onSubmit: SubmitHandler<NewZoneFormData> = async (data) => {
    if (bounds?.length === 0) {
      alert('Informe a área no mapa');
      return;
    }

    try {
      const coords: CreateZoneCoordsDTO[] = [];

      bounds.map((bound) => {
        coords.push({
          latitude: bound.lat,
          longitude: bound.lng
        })
      })

      const body: CreateZoneDTO = {
        titulo: data.titulo,
        coordenadas: coords
      }

      setIsLoading(true);

      if (zoneSelected) {
        await api.put(`zonas/${zoneSelected}`, body);

        setZoneSelected(undefined);
      } else {
        await api.post('zonas', body);
      }

      window.location.reload();
      setBounds([]);

      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      console.log(e);
      alert(e.response.data.message);
    }
  }

  function handleEditZone(zone: Zone) {
    const coords: Bound[] = []
    zone.coordenadas.map((coord) => {
      coords.push({
        lat: coord.latitude,
        lng: coord.longitude
      })
    })

    setBounds(coords);

    setValue("titulo", zone.titulo);

    setZoneSelected(zone.id);
  }

  async function deleteZone(id: number) {
    try {
      await api.delete(`zonas/${id}`)
      getZones();
    } catch (error: any) {
      alert(error.message)
    }
  }

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="col-span-3">
        <div className='flex-1 grow h-[88vh]'>
          <MapDrawing
            handleSetBounds={(bounds) => setBounds(bounds)}
            polygonPath={bounds}
          />
        </div>
      </div>
      <div className="col-span-1 flex-col">
        <form
          className="space-y-6 mt-0"
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="bg-white shadow sm:rounded-lg sm:p-4">
            <div className="md:grid md:grid-cols-4 md:gap-4">
              <div className="md:col-span-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <FormInput<NewZoneFormData>
                    id="title"
                    type="text"
                    name="titulo"
                    label="Título"
                    className="mb-2"
                    register={register}
                    errors={errors}
                  />
                </div>
              </div>
              <div className="flex items-center md:col-span-1">
                <div>
                  <Button
                    title="Salvar"
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                    loading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="mt-8 flex flex-col">
          <h2 className="font-semibold pb-2">Zonas cadastradas</h2>
          <div>
            <div className="inline-block min-w-full align-middle">
              <div className="relative overflow-y-auto max-h-[60vh] shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
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
                    {zones && zones?.length > 0 && zones.map((zone) => (
                      <tr key={zone.titulo}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                          <a
                            className={classNames(zoneSelected === zone.id
                              ? "text-indigo-500"
                              : "text-gray-900",
                              "cursor-pointer text-base font-bold")}
                            onClick={() => handleEditZone(zone)}>
                            {zone.titulo}
                          </a>
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                          <a
                            className="flex flex-col items-center text-red-600 hover:text-red-900 cursor-pointer"
                            onClick={() => deleteZone(zone.id)}
                          >
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="text-xs">Remover</span>
                          </a>
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
  )
}