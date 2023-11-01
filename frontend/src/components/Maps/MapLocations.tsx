import { DrawingManagerF, GoogleMap, InfoWindow, Marker, MarkerClusterer, Polygon } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DeliveryPoints } from '../../services/types/Delivery';
import { formatCurrency, formatNumber } from "../../services/utils/formatNumber";
import { Bound } from "./MapDrawing";

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

interface MapProps {
  deliveryPoints: DeliveryPoints[] | undefined;
  drawingEnable?: boolean;
  handleSetBounds: (bounds: Bound[]) => void;
  polygonPath: Bound[];
}

export function MapLocations({ deliveryPoints, drawingEnable, handleSetBounds, polygonPath }: MapProps) {
  const mapRef = useRef<GoogleMap>();
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager>();
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
  const [bounds, setBounds] = useState<Bound[]>([])

  const onLoad = useCallback((map: any) => (mapRef.current = map), []);

  function loadInfoWindow(point: DeliveryPoints) {
    setInfoWindowPos({ lat: point.latitude, lng: point.longitude });
    setInfoWindowData(point);

    setRenderInfowWindow(true);
  }

  const onPolygonComplete = (polygon: google.maps.Polygon) => {
    drawingManagerRef?.current?.setDrawingMode(null);
    var polygonBounds = polygon.getPath();
    var boundsArr: Bound[] = [];
    for (var i = 0; i < polygonBounds.getLength(); i++) {
      var point: Bound = {
        lat: polygonBounds.getAt(i).lat(),
        lng: polygonBounds.getAt(i).lng(),
      };
      boundsArr.push(point);
    }

    handleSetBounds(boundsArr);
    setBounds(boundsArr);
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

      {drawingEnable && bounds.length === 0 &&
        <>
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
        </>
      }

      <Polygon
        onLoad={(event) => onLoadPolygon(event)}
        paths={polygonPath}
        options={polygonOptions}
      />
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