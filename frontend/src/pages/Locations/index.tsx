import { useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { api } from "../../lib/axios";
import { Location } from "../../services/types/Location";
import { EditLocation } from "./components/EditLocation";
import { LocationsTable } from "./components/LocationsTable";
import { MapAddress } from "./components/MapAddress";

/* TODO
 - Formulário de editar
 - Botão filtrar
*/


export function Locations() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY
  });

  const [openLocation, setOpenLocation] = useState(false)
  const [locations, setLocations] = useState<Location[]>([])
  const [locationSelected, setLocationSelected] = useState<Location | null>(null);

  async function fetchLocations() {
    const response = await api.get(`/pedidos-locais`);

    setLocations(response.data)
  }

  function editLocation(location: Location) {
    setOpenLocation(true);
    setLocationSelected(location)
  }

  useEffect(() => {
    fetchLocations();
  }, [])

  if (locations.length === 0 && !isLoaded) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        Carregando...
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col w-full h-full gap-2">
      <div className="h-[40vh]">
        <MapAddress
          locations={locations}
        />
      </div>

      <div className="flex gap-2 items-center">
        <span className="text-sm font-semibold text-gray-900 mr-2">Filtros:</span>
        <div className="md:grid md:grid-cols-12 md:gap-6">

          <div className="flex items-center gap-1 md:col-span-1">
            <label className="text-sm font-medium text-gray-700 mb-1">ID:</label>
            <Input
              id="id"
              label="ID"
              name="id"
              size="small"
            />
          </div>

          <div className="flex items-center gap-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1">CEP:</label>
            <Input
              id="cep"
              label="CEP"
              name="cep"
              size="small"
            />
          </div>

          <div className="flex items-center gap-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1">Endereço:</label>
            <Input
              id="address"
              label="address"
              name="address"
              size="small"
            />
          </div>

          <div className="md:col-span-2">
            <Button
              title="Filtrar"
              color="primary"
              type="button"

            />
          </div>
        </div>
      </div>

      <div className="h-[41vh]">
        <LocationsTable
          locations={locations}
          handleEditLocation={(location) => editLocation(location)}
        />
      </div>

      {locationSelected &&
        <EditLocation
          openLocation={openLocation}
          handleCloseLocation={() => setOpenLocation(false)}
          location={locationSelected}
        />
      }

    </div>
  )
}