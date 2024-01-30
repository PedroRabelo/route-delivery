import { Route, Routes } from "react-router-dom";
import { DefaultLayout } from "./layouts/DefaultLayout";
import { Clients } from "./pages/Clients";

import Deliveries from "./pages/Deliveries";
import { CreateDelivery } from "./pages/Deliveries/create";
import { DeliveryLocations } from "./pages/Deliveries/locations";
import { RoutesDelivery } from "./pages/Deliveries/routes-delivery";
import { Locations } from "./pages/Locations";
import { Monitoring } from "./pages/Monitoring";
import { TrackRoutes } from "./pages/TrackRoutes";
import { Vehicles } from "./pages/Vehicles";
import Zones from "./pages/Zones";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Deliveries />} />
        <Route path="/delivery-create/:id" element={<CreateDelivery />} />
        <Route path="/delivery-locations/:id" element={<DeliveryLocations />} />
        <Route path="/routes-delivery/:id" element={<RoutesDelivery />} />

        <Route path="/zonas" element={<Zones />} />
        <Route path="/veiculos" element={<Vehicles />} />
        <Route path="/clientes" element={<Clients />} />
        <Route path="/rastreamento" element={<TrackRoutes />} />
        <Route path="/locais" element={<Locations />} />
        <Route path="/monitoramento" element={<Monitoring />} />
      </Route>
    </Routes>
  );
}
