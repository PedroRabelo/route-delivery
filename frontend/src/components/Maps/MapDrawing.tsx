/* global google */
import { DrawingManagerF, DrawingManagerProps, GoogleMap, Polygon } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

export type Bound = {
  lat: string;
  lng: string;
};

type Props = {
  handleSetBounds: (bounds: Bound[]) => void;
  polygonPath: LatLngLiteral[];
  clearMap: boolean;
}

export function MapDrawing({ handleSetBounds, polygonPath, clearMap }: Props) {
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

  const [polygon, setPolygon] = useState<google.maps.Polygon>();

  const onLoad = useCallback((map: any) => (mapRef.current = map), []);

  const onPolygonComplete = (polygon: google.maps.Polygon) => {
    drawingManagerRef?.current?.setDrawingMode(null);
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

    handleSetBounds(bounds);
  };

  const onLoadDrawing = (drawingManager: any) => {
    drawingManagerRef.current = drawingManager;
  };

  const onLoadPolygon = (polygon: google.maps.Polygon) => {
    polygonRefs.current = polygon;
  }

  useEffect(() => {
    if (clearMap) {
      console.log('limpar o mapa');
      () => useCallback((map: any) => (mapRef.current = map), []);

    }

  }, [clearMap]);

  const paths = [
    { lat: -23.372218107809367, lng: -46.762026603271494 },
    { lat: -23.554880081172303, lng: -46.54641991381837 },
    { lat: -23.569985596127424, lng: -46.778506095458994 },
    { lat: -23.433973524540477, lng: -46.92270165209962 }
  ]

  const polygonOptions = {
    fillOpacity: 0.3,
    fillColor: '#ff0000',
    strokeColor: '#ff0000',
    strokeWeight: 2,
    draggable: true,
    editable: true
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
        paths={paths}
        options={polygonOptions}
      />


    </GoogleMap>
  )
}