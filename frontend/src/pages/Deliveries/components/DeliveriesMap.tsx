import { useLoadScript } from "@react-google-maps/api";
import { MapLocations } from "../../../components/Maps";
import { DeliveryPoints } from "../../../services/types/Delivery";

interface MapProps {
  deliveryPoints: DeliveryPoints[] | undefined;
}

export function DeliveriesMap({ deliveryPoints }: MapProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className='flex-1 grow h-[66vh]'>
      <MapLocations deliveryPoints={deliveryPoints} />
    </div>
  )
}