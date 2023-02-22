/* global google */
import { DrawingManager, DrawingManagerF, GoogleMap, InfoWindow } from "@react-google-maps/api";
import { useCallback, useMemo, useRef, useState } from "react";

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

export type Bound = {
  lat: string;
  lng: string;
};

type Props = {
  handleSetBounds: (bounds: Bound[]) => void;
  polygonPath: LatLngLiteral[];
}

export function MapDrawing({ handleSetBounds, polygonPath }: Props) {
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

  const [polygon, setPolygon] = useState<google.maps.Polygon>();
  const [bounds, setBounds] = useState<Bound[]>();

  const onLoad = useCallback((map: any) => (mapRef.current = map), []);

  const onPolygonComplete = (polygon: google.maps.Polygon) => {
    setPolygon(polygon);
    var polygonBounds = polygon.getPath();
    var bounds: Bound[] = [];
    for (var i = 0; i < polygonBounds.getLength(); i++) {
      var point: Bound = {
        lat: polygonBounds.getAt(i).lat().toString(),
        lng: polygonBounds.getAt(i).lng().toString(),
      };
      bounds.push(point);
    }

    setBounds(bounds);
    handleSetBounds(bounds);
  };

  const onLoadDrawing = (drawingManager: any) => {
    console.log(drawingManager);
  };

  return (
    <GoogleMap
      zoom={10}
      center={center}
      mapContainerStyle={{ display: "flex", flexGrow: "1", height: "100%" }}
      options={options}
      onLoad={onLoad}
    >
      <DrawingManagerF
        onPolygonComplete={onPolygonComplete}
        onLoad={onLoadDrawing}
        options={{
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.POLYGON],
          },
        }}
      />
    </GoogleMap>
  )
}