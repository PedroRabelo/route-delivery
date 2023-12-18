import { useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { MapRoutes } from "../../components/Maps";
import { api } from "../../lib/axios";
import { VehicleTrack } from "../../services/types/Vehicle";

export function TrackRoutes() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  const [vehicleTrack, setVehicleTrack] = useState<VehicleTrack[]>();
  const [vehicleFiltered, setVehicleFiltered] = useState<VehicleTrack[]>();
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTrack[]>([]);

  let placasFiltered: VehicleTrack[] = [];

  async function fetchTracks() {
    const response = await api.get(`/rastreamento`);

    setVehicleTrack(response.data);

    if (selectedVehicle.length > 0) {
      filterVehicles(selectedVehicle);
    } else {
      setVehicleFiltered(response.data);
    }
  }

  useEffect(() => {
    fetchTracks();

    const interval = setInterval(() => {
      fetchTracks();
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedVehicle.length > 0) {
      placasFiltered = [];
      placasFiltered.push(...selectedVehicle);
    }
  }, [selectedVehicle]);

  function filterVehicles(vehicles: VehicleTrack[]) {
    if (vehicles.length === 0) {
      setVehicleFiltered(vehicleTrack);
    } else {
      const plates = vehicles.flatMap((m) => m.placa);
      const filteredPoints = vehicles?.filter((p) => plates.includes(p.placa));

      setVehicleFiltered(filteredPoints);
    }
  }

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex">
      {vehicleFiltered && vehicleFiltered.length > 0 && (
        <div className="flex-1 grow h-[88vh]">
          <MapRoutes vehicleTrack={vehicleFiltered} />
        </div>
      )}

      <div className="absolute">
        <div className="flex flex-col">
          <div>
            <Button
              title="Filtrar"
              color="primary"
              type="button"
              onClick={() => filterVehicles(selectedVehicle)}
            />
            <div className="mt-2 inline-block min-w-full align-middle">
              <div className="relative overflow-y-auto max-h-[52vh] shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-xs font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                      ></th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-xs font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                      >
                        Placa
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-xs font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        Última posição
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-xs font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        Ligado
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-xs font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        Km/h
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {vehicleTrack &&
                      vehicleTrack?.length > 0 &&
                      vehicleTrack.map((truck, index) => (
                        <tr
                          key={index}
                          className={
                            selectedVehicle.includes(truck)
                              ? "bg-gray-50"
                              : undefined
                          }
                        >
                          <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                            {selectedVehicle.includes(truck) && (
                              <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                            )}
                            <input
                              type="checkbox"
                              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                              value={truck.placa}
                              checked={selectedVehicle.includes(truck)}
                              onChange={(e) => {
                                setSelectedVehicle(
                                  e.target.checked
                                    ? [...selectedVehicle, truck]
                                    : selectedVehicle.filter((p) => p !== truck)
                                );
                              }}
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                            {truck?.placa}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                            {truck?.ultimaPosicao}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                            {truck?.ignicao ? "SIM" : "NÃO"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                            {truck?.velocidade > 0 ? truck.velocidade : ""}
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
  );
}
