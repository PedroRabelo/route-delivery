import { GoogleMap, InfoWindow, Marker, MarkerClusterer } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DeliveryPoints } from '../../services/types/Delivery';
import { formatCurrency, formatNumber } from "../../services/utils/formatNumber";

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

  const [infoWindowPos, setInfoWindowPos] = useState<LatLngLiteral>();
  const [renderInfoWindow, setRenderInfowWindow] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState<DeliveryPoints>({} as DeliveryPoints);

  const onLoad = useCallback((map: any) => (mapRef.current = map), []);

  function loadInfoWindow(point: DeliveryPoints) {
    setInfoWindowPos({ lat: point.latitude, lng: point.longitude });
    setInfoWindowData(point);

    setRenderInfowWindow(true);
  }

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
                  onClick={() => loadInfoWindow(point)}
                />
              ))
            }
          </MarkerClusterer>
        </>
      )}

      {renderInfoWindow &&
        <InfoWindow
          onLoad={onLoad}
          position={infoWindowPos}
        >
          <div className="bg-white border-1 p-2">
            <h1 className="mb-1">Placa: <b>{infoWindowData.placa}</b></h1>
            <h1 className="mb-1">Cliente: {infoWindowData.cliente}</h1>
            <h1>Valor: <b>{formatNumber(infoWindowData.peso)}KG</b> - <b>{formatCurrency(infoWindowData.valor)}</b></h1>
          </div>
        </InfoWindow>
      }

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