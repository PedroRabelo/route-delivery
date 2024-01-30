import { GoogleMap } from "@react-google-maps/api";
import { useCallback, useMemo, useRef } from "react";

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

export function MapDeliveries() {
  const mapRef = useRef<GoogleMap>();
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: -23.5298971, lng: -46.749152 }),
    []
  );

  const options = useMemo<MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      fullscreenControl: true,
      mapTypeId: "roadmap",
      mapTypeControl: true,
      styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
    }),
    []
  );

  const onLoad = useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  return (
    <GoogleMap
      zoom={10}
      center={center}
      mapContainerStyle={{ display: "flex", flexGrow: "1", width: "100%", height: "100%" }}
      options={options}
      onLoad={onLoad}
    >

    </GoogleMap>
  )
}