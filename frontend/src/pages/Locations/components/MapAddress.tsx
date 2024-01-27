import {
  GoogleMap,
  Marker,
  MarkerClusterer
} from "@react-google-maps/api";
import { useCallback, useMemo, useRef, useState } from "react";
import { api } from "../../../lib/axios";
import { Location } from "../../../services/types/Location";

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

interface MapProps {
  locations: Location[] | undefined;
  fetchLocations: () => void;
}

export function MapAddress({ locations, fetchLocations }: MapProps) {
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

  const [locationSelected, setLocationSelected] = useState<Location>();

  const onLoad = useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  function filterLocation(location: Location) {
    setLocationSelected(location)
  }

  async function handleChangeBounds(bounds: google.maps.LatLng) {
    if (locationSelected) {
      await api.patch(`pedidos-locais/${locationSelected.id}`, {
        latLongManual: true,
        latitude: bounds.lat(),
        longitude: bounds.lng()
      })
      fetchLocations()
      alert("Coordenadas alterada com sucesso")
    }
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
                  draggable={locationSelected !== undefined}
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
                    color: "#000",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}

                  icon={{
                    path: "M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z",
                    fillColor: `${locationSelected !== undefined && point.id === locationSelected.id ? '#27DF67' : '#E61C1C'}`,
                    fillOpacity: 1,
                    anchor: new google.maps.Point(0, 20),
                    strokeWeight: 1,
                    strokeColor: `${locationSelected !== undefined && point.id === locationSelected.id ? '#27DF67' : '#E61C1C'}`,
                    scale: 0.04,
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
