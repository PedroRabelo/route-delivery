import { GoogleMap, Marker, MarkerClusterer } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DeliveryPoints } from '../../services/types/Delivery';

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

interface MapProps {
  deliveryPoints: DeliveryPoints[] | undefined;
}

export function Map({ deliveryPoints }: MapProps) {
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
      styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }]
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
      {/* {deliveryPoints && deliveryPoints.length > 0 && deliveryPoints.map((point) => (
        <Marker
          key={point.id}
          position={{ lat: Number(point.latitude), lng: Number(point.longitude) } as LatLngLiteral}
          label={{
            text: `${point.ordem}`, // codepoint from https://fonts.google.com/icons
            color: "#ffffff",
            fontSize: "18px",
          }}
        />
      ))} */}


      {deliveryPoints && deliveryPoints.length > 0 && (
        <>
          <MarkerClusterer
            maxZoom={12}
            minimumClusterSize={20}
            zoomOnClick
          >
            {(clusterer): any =>
              deliveryPoints?.map((point) => (
                <Marker
                  key={point.id}
                  position={{ lat: Number(point.latitude), lng: Number(point.longitude) } as LatLngLiteral}
                  clusterer={clusterer}
                  label={{
                    text: `${point.ordem}`, // codepoint from https://fonts.google.com/icons
                    color: "#ffffff",
                    fontSize: "18px",
                  }}
                />
              ))
            }
          </MarkerClusterer>
        </>
      )}

    </GoogleMap>
  )
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};