import {
  GoogleMap,
  Marker,
  MarkerClusterer
} from "@react-google-maps/api";
import { useCallback, useMemo, useRef, useState } from "react";
import { Location } from "../../../services/types/Location";

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

interface MapProps {
  locations: Location[] | undefined;
}

export function MapAddress({ locations }: MapProps) {
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

  const [infoWindowPos, setInfoWindowPos] = useState<LatLngLiteral>();
  const [renderInfoWindow, setRenderInfowWindow] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState<Location>(
    {} as Location
  );

  const onLoad = useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  function filterLocation(location: Location) {
    console.log(location)
  }

  function handleChangeBounds(bounds: google.maps.LatLng) {
    console.log(bounds.toJSON())
  }

  return (
    <GoogleMap
      zoom={10}
      center={center}
      mapContainerStyle={{ display: "flex", flexGrow: "1", width: "100%", height: "100%" }}
      options={options}
      onLoad={onLoad}
    >
      {locations && locations.length > 0 && (
        <>
          <MarkerClusterer maxZoom={12} minimumClusterSize={20} zoomOnClick>
            {(clusterer): any =>
              locations?.map((point) => (
                <Marker
                  key={point.id}
                  draggable={true}
                  onDragEnd={(ev) => handleChangeBounds(ev.latLng!)}
                  position={
                    {
                      lat: Number(point.latitude),
                      lng: Number(point.longitude),
                    } as LatLngLiteral
                  }
                  clusterer={clusterer}
                  label={{
                    text: `${point.id}`, // codepoint from https://fonts.google.com/icons
                    color: "#ffffff",
                    fontSize: "11px",
                  }}
                  onClick={() => filterLocation(point)}
                />
              ))
            }
          </MarkerClusterer>
        </>
      )}
    </GoogleMap>
  );
}
