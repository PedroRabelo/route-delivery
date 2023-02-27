import { Route, Routes } from 'react-router-dom'
import { DefaultLayout } from './layouts/DefaultLayout'
import { Clients } from './pages/Clients'

import Deliveries from './pages/Deliveries'
import { CreateDelivery } from './pages/Deliveries/create'
import { DeliveryLocations } from './pages/Deliveries/locations'
import { Vehicles } from './pages/Vehicles'
import Zones from './pages/Zones'


export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Deliveries />} />
        <Route path="/delivery-create/:id" element={<CreateDelivery />} />
        <Route path="/delivery-locations/:id" element={<DeliveryLocations />} />

        <Route path="/zonas" element={<Zones />} />
        <Route path="/veiculos" element={<Vehicles />} />
        <Route path="/clientes" element={<Clients />} />
      </Route>
    </Routes>
  )
}
