import { useLoadScript } from "@react-google-maps/api";
import { MapLocations } from "../../../components/Maps";
import { DeliveryPoints, DeliveryVehicle } from "../../../services/types/Delivery";
import DeliveryTab from "./DeliveryTab";
import { useEffect, useState } from "react";
import { FilterMapDeliveries } from "./FilterMapDeliveries";
import { Button } from "../../../components/Button";

interface MapProps {
  deliveryPoints: DeliveryPoints[] | undefined;
  deliveryVehicles: DeliveryVehicle[] | undefined;
  deliveryWithoutVehicle: DeliveryPoints[] | undefined
}

export function DeliveriesMap({ deliveryPoints, deliveryVehicles, deliveryWithoutVehicle }: MapProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  const [tabBarSelected, setTabBarSelected] = useState('Entregues');
  const [deliveriesFiltered, setDeliveriesFiltered] = useState(deliveryPoints);

  let totalEntregues = 0;
  let totalNaoEntregues = 0;

  totalEntregues = deliveryPoints?.length!;
  totalNaoEntregues = deliveryWithoutVehicle?.length!;

  useEffect(() => {
    setDeliveriesFiltered(deliveryPoints)
  }, [deliveryPoints])

  useEffect(() => {
    if (tabBarSelected === 'Entregues') {
      setDeliveriesFiltered(deliveryPoints);
    } else if (tabBarSelected === 'Não Entregues') {
      setDeliveriesFiltered(deliveryWithoutVehicle);
    }
  }, [tabBarSelected]);

  function filterPointsByVehicle(vehicles: DeliveryVehicle[]) {
    if (vehicles.length === 0) {
      setDeliveriesFiltered(deliveryPoints)
    } else {
      const plates = vehicles.flatMap(m => m.placa);
      const filteredPoints = deliveryPoints?.filter(p => plates.includes(p.placa))

      setDeliveriesFiltered(filteredPoints)
    }
  }

  function filterPoints(points: DeliveryPoints[]) {
    // TODO Continuar aqui
  }

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-col gap-4 w-2/6">
        <div className="flex justify-between">
          <DeliveryTab
            handleChangeTabBar={(tab) => setTabBarSelected(tab)}
            deliveries={{ withTruck: totalEntregues, noTruck: totalNaoEntregues }}
          />
          <div className="flex flex-col gap-2">

          </div>
        </div>
        <FilterMapDeliveries
          tabBarSelected={tabBarSelected}
          deliveryVehicles={deliveryVehicles}
          deliveryWithoutVehicles={deliveryWithoutVehicle}
          handleFilterByVehicles={(vehicles) => filterPointsByVehicle(vehicles)}
          handleFilterPoints={(points) => filterPoints(points)}
        />
      </div>
      <div className='flex-1 grow h-[66vh]'>
        <MapLocations deliveryPoints={deliveriesFiltered} />
      </div>
    </div>
  )
}