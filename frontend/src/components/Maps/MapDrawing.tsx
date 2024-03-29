/* global google */
import { DrawingManagerF, GoogleMap, Polygon } from "@react-google-maps/api";
import { useCallback, useMemo, useRef } from "react";

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

export type Bound = {
  lat: number;
  lng: number;
};

type Props = {
  handleSetBounds: (bounds: Bound[]) => void;
  polygonPath: Bound[];
}

export function MapDrawing({ handleSetBounds, polygonPath }: Props) {
  const mapRef = useRef<GoogleMap>();
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager>();
  const polygonRefs = useRef<google.maps.Polygon>();
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

  const onPolygonComplete = (polygon: google.maps.Polygon) => {
    drawingManagerRef?.current?.setDrawingMode(null);
    var polygonBounds = polygon.getPath();
    var bounds: Bound[] = [];
    for (var i = 0; i < polygonBounds.getLength(); i++) {
      var point: Bound = {
        lat: polygonBounds.getAt(i).lat(),
        lng: polygonBounds.getAt(i).lng(),
      };
      bounds.push(point);
    }

    handleSetBounds(bounds);
  };

  const onLoadDrawing = (drawingManager: any) => {
    drawingManagerRef.current = drawingManager;
  };

  const onLoadPolygon = (polygon: google.maps.Polygon) => {
    console.log("polygon: ", polygon);
  }

  const polygonOptions = {
    fillOpacity: 0.3,
    fillColor: '#ff0000',
    strokeColor: '#ff0000',
    strokeWeight: 2,
    draggable: false,
    editable: false
  }

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

      <Polygon
        onLoad={(event) => onLoadPolygon(event)}
        paths={polygonPath}
        options={polygonOptions}
      />

    </GoogleMap>
  )
}