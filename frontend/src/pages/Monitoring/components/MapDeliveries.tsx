import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../../lib/axios";
import { RouteDirection, RoutesCoords } from "../../../services/types/Route";

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

export function MapDeliveries() {
  const mapRef = useRef<GoogleMap>();
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: -23.5298971, lng: -46.749152 }),
    []
  );

  const [isLoading, setIsLoading] = useState(false)
  const [routes, setRoutes] = useState<RouteDirection[]>([])

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

  async function getRoutes() {
    setIsLoading(true)

    const response: RoutesCoords[] = await (await api.get('rastreamento/direction')).data

    if (response.length > 0) {
      // let grouped: { rotaId: number, coords: LatLngLiteral } = await response.reduce(
      //   (result: any, currentValue: any) => {
      //     (result[currentValue['rotaId']] = result[currentValue['rotaId']] || []).push(currentValue);
      //     return result;
      //   }, {});

      var rota: number = 0;
      var coords: RouteDirection[] = []
      var index: number = -1;
      for (var i = 0; i < response.length; i++) {
        if (coords.length === 0 || rota !== response[i].rotaId) {
          coords.push({
            rotaId: rota,
            options: {
              strokeOpacity: 1,
              strokeColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase()}`,
              strokeWeight: 2,
              draggable: false,
              editable: false
            },
            coords: []
          })
          ++index;
          response.filter(r => r.rotaId === rota).map(f => coords[index].coords.push({
            lat: Number(f.latitude),
            lng: Number(f.longitude)
          }))
          rota = response[i].rotaId;
        }
      }
      setRoutes(coords)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    getRoutes()

    const interval = setInterval(() => {
      getRoutes();
    }, 45000);

    return () => clearInterval(interval);
  }, [])

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

      {routes.length > 0 && routes.map(r => (
        <div key={r.rotaId}>
          <Marker
            position={r.coords[0]}
            label={{
              text: `${r.rotaId}`,
              color: '#fff'
            }}
          />
          <Marker
            position={r.coords[r.coords.length - 1]}
            label={{
              text: `${r.rotaId}`,
              color: '#fff'
            }}
          />
          <Polyline
            path={r.coords}
            options={r.options}
          />
        </div>
      ))}
    </GoogleMap>
  )
}