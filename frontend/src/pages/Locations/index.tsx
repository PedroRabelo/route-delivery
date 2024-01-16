import { useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { Location } from "../../services/types/Location";
import { EditLocation } from "./components/EditLocation";
import { MapAddress } from "./components/MapAddress";

export function Locations() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY
  });

  const [openLocation, setOpenLocation] = useState(false)
  const [locations, setLocations] = useState<Location[]>([])

  async function fetchLocations() {
    const response = await api.get(`/pedidos/locais`);

    setLocations(response.data)
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
      <div className="h-[50vh] bg-red-300">
        <MapAddress
          locations={locations}
        />
      </div>
      <div className="h-[38vh]">
        <span>Grid de locais</span>
      </div>

      <EditLocation openLocation={openLocation} handleCloseLocation={() => setOpenLocation(false)} />
    </div>
  )
}