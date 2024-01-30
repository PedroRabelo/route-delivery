import { useLoadScript } from "@react-google-maps/api";
import { useRef, useState } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { DeliveriesTable } from "./components/DeliveriesTable";
import { MapDeliveries } from "./components/MapDeliveries";
import { RoutesTable } from "./components/RoutesTable";

export function Monitoring() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY
  });

  const inputNomeRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        Carregando...
      </div>
    )
  }

  function filterDeliveries() {

  }

  return (
    <div className="flex flex-1 flex-col w-full h-full gap-2">
      <div className="flex h-[40vh]">
        <div className="w-1/3">
          <DeliveriesTable />
        </div>
        <div className="w-2/3">
          <MapDeliveries />
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <span className="text-sm font-semibold text-gray-900 mr-2 mb-1">Filtros:</span>
        <div className="md:grid md:grid-cols-12 md:gap-6">
          <div className="flex items-center gap-1 md:col-span-1">
            <label className="text-sm font-medium text-gray-700 mb-1">Nome:</label>
            <Input
              ref={inputNomeRef}
              id="nome"
              label="Nome"
              name="nome"
              size="small"
            />
          </div>

          <div className="md:col-span-2">
            <Button
              title="Filtrar"
              color="primary"
              type="button"
              onClick={() => filterDeliveries()}
              loading={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="flex h-[41vh]">
        <RoutesTable />
      </div>
    </div>
  )
}