import { GoogleMap, Marker, MarkerClusterer } from "@react-google-maps/api";
import { useCallback, useMemo, useRef, useState } from "react";
import { VehicleTrack } from "../../services/types/Vehicle";

import TruckIcon from "../../assets/truck.svg";

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

interface MapRoutesProps {
  vehicleTrack: VehicleTrack[];
}

export function MapRoutes({ vehicleTrack }: MapRoutesProps) {
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
      styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
    }),
    []
  );

  const onLoad = useCallback((map: any) => (mapRef.current = map), []);

  return (
    <GoogleMap
      zoom={10}
      center={center}
      mapContainerStyle={{ display: "flex", flexGrow: "1", height: "100%" }}
      options={options}
      onLoad={onLoad}
    >
      {vehicleTrack && vehicleTrack.length > 0 && (
        <>
          <MarkerClusterer maxZoom={12} minimumClusterSize={20} zoomOnClick>
            {(clusterer): any =>
              vehicleTrack?.map((point) => (
                <Marker
                  key={point.placa}
                  position={
                    {
                      lat: Number(point.latitude),
                      lng: Number(point.longitude),
                    } as LatLngLiteral
                  }
                  clusterer={clusterer}
                  label={{
                    text: `${point.placa}`, // codepoint from https://fonts.google.com/icons
                    color: "#ffffff",
                    fontSize: "6px",
                  }}
                  // icon={{
                  //   path: "M240-160q-50 0-85-35t-35-85H40v-440q0-33 23.5-56.5T120-800h560v160h120l120 160v200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H360q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T280-280q0-17-11.5-28.5T240-320q-17 0-28.5 11.5T200-280q0 17 11.5 28.5T240-240ZM120-360h32q17-18 39-29t49-11q27 0 49 11t39 29h272v-360H120v360Zm600 120q17 0 28.5-11.5T760-280q0-17-11.5-28.5T720-320q-17 0-28.5 11.5T680-280q0 17 11.5 28.5T720-240Zm-40-200h170l-90-120h-80v120ZM360-540Z",
                  //   fillColor: "#000",
                  //   fillOpacity: 1,
                  //   anchor: new google.maps.Point(0, 20),
                  //   strokeWeight: 1,
                  //   strokeColor: "#000",
                  //   scale: 0.025,
                  // }}
                />
              ))
            }
          </MarkerClusterer>
        </>
      )}
    </GoogleMap>
  );
}
