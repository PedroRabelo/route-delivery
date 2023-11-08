import { useLoadScript } from "@react-google-maps/api";
import { Bound, MapLocations } from "../../../components/Maps";
import { DeliveryPoints, DeliveryVehicle } from "../../../services/types/Delivery";
import DeliveryTab from "./DeliveryTab";
import { useEffect, useState } from "react";
import { FilterMapDeliveries } from "./FilterMapDeliveries";
import { Button } from "../../../components/Button";
import { CreateRoute } from "./CreateRoute";

interface MapProps {
  deliveryPoints: DeliveryPoints[] | undefined;
  deliveryVehicles: DeliveryVehicle[] | undefined;
  deliveryWithoutVehicle: DeliveryPoints[] | undefined;
  areaRodizio: Bound[];
}

const libraries: (
  | "places"
  | "drawing"
  | "geometry"
  | "localContext"
  | "visualization"
)[] = ["drawing"];

export function DeliveriesMap({ deliveryPoints, deliveryVehicles, deliveryWithoutVehicle, areaRodizio }: MapProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: libraries,
  });

  const [tabBarSelected, setTabBarSelected] = useState('Não Entregues');
  const [deliveriesFiltered, setDeliveriesFiltered] = useState(deliveryPoints);
  const [drawingEnable, setDrawingEnable] = useState(false);
  const [bounds, setBounds] = useState<Bound[]>([]);

  let totalEntregues = 0;
  let totalNaoEntregues = 0;

  totalEntregues = deliveryPoints?.length!;
  totalNaoEntregues = deliveryWithoutVehicle?.length!;

  useEffect(() => {
    setDeliveriesFiltered(deliveryWithoutVehicle)
  }, [deliveryWithoutVehicle])

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
    if (points.length === 0) {
      setDeliveriesFiltered(deliveryWithoutVehicle)
    } else {
      setDeliveriesFiltered(points)
    }
  }

  function cleanPolygon() {
    setBounds([]);
    window.location.reload();
  }

  /* Filtrar pedidos do veículo
  1 - Criar componente para ser exibido quando filtrar por veículo
  2 - Neste componente irá exibir os pedidos agrupado por veículo, com a opção de filtrar os pedidos no mapa
  3 - Opção para transferir pedido selecionado para outro veículo
  4 - Modal para selecionar o veículo

  */

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-col gap-4 w-2/6">
        <div className="flex justify-between">
          <DeliveryTab
            handleChangeTabBar={(tab) => setTabBarSelected(tab)}
            deliveries={{ withTruck: totalEntregues, noTruck: totalNaoEntregues }}
          />
          {bounds.length === 0 &&
            <Button
              title="Polígono"
              color="primary"
              type="button"
              onClick={() => setDrawingEnable(true)}
            />
          }
          {bounds.length > 0 &&
            <Button
              title="Limpar Polígono"
              color="primary"
              type="button"
              onClick={() => cleanPolygon()}
            />
          }
        </div>
        {bounds.length > 0 ?
          <CreateRoute
            bounds={bounds}
            deliveryVehicles={deliveryVehicles}
          /> :
          <FilterMapDeliveries
            tabBarSelected={tabBarSelected}
            deliveryVehicles={deliveryVehicles}
            deliveryWithoutVehicles={deliveryWithoutVehicle}
            handleFilterByVehicles={(vehicles) => filterPointsByVehicle(vehicles)}
            handleFilterPoints={(points) => filterPoints(points)}
          />
        }
      </div>
      <div className='flex-1 grow h-[66vh]'>
        <MapLocations
          deliveryPoints={deliveriesFiltered}
          drawingEnable={drawingEnable}
          handleSetBounds={(bounds) => setBounds(bounds)}
          polygonPath={areaRodizio}
        />
      </div>
    </div>
  )
}