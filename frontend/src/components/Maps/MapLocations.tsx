import {
  DrawingManagerF,
  GoogleMap,
  InfoWindow,
  Marker,
  MarkerClusterer,
  Polygon,
} from "@react-google-maps/api";
import { useCallback, useMemo, useRef, useState } from "react";
import { DeliveryPoints } from "../../services/types/Delivery";
import {
  formatCurrency,
  formatNumber,
} from "../../services/utils/formatNumber";
import { Bound } from "./MapDrawing";

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

interface MapProps {
  deliveryPoints: DeliveryPoints[] | undefined;
  drawingEnable?: boolean;
  handleSetBounds: (bounds: Bound[]) => void;
  polygonPath: Bound[];
}

export function MapLocations({
  deliveryPoints,
  drawingEnable,
  handleSetBounds,
  polygonPath,
}: MapProps) {
  const mapRef = useRef<GoogleMap>();
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager>();
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: -23.5298971, lng: -46.749152 }),
    []
  );
  const polygonRef = useRef<google.maps.Polygon>();
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
  const [infoWindowData, setInfoWindowData] = useState<DeliveryPoints>(
    {} as DeliveryPoints
  );
  const [bounds, setBounds] = useState<Bound[]>([]);

  const onLoad = useCallback((map: any) => {
    mapRef.current = map;
  }, []);

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

    polygonRef.current?.setPaths(polygon.getPath());

    polygon.setVisible(false);
  };

  const onPolygonEditComplete = (polygon: google.maps.Polygon) => {
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

    polygonRef.current?.setPaths(polygon.getPath());
  };

  const onLoadDrawing = (drawingManager: any) => {
    drawingManagerRef.current = drawingManager;
  };

  const onLoadPolygon = (polygon: google.maps.Polygon) => {
    polygonRef.current = polygon;
  };

  const onLoadPolygonRouter = (polygon: google.maps.Polygon) => { };

  const polygonOptions = {
    fillOpacity: 0.3,
    fillColor: "#ff0000",
    strokeColor: "#ff0000",
    strokeWeight: 2,
    draggable: false,
    editable: false,
  };

  function markerColor(tipoServico: string, coletivo: boolean, restrito: boolean) {

    let color;
    if (tipoServico === 'entrega') color = "#111"
    if (tipoServico === 'reentrega') color = "#2f6deb"
    if (tipoServico === 'devolucao') color = "#932feb"
    if (tipoServico === 'retira-food') color = "#a14f20"

    if (restrito && !coletivo) {
      return {
        path: "M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z",
        fillColor: `${color}`,
        fillOpacity: 1,
        anchor: new google.maps.Point(0, 20),
        scale: 0.02,
      }
    }

    if (coletivo && !restrito) {
      return {
        path: "M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z",
        fillColor: `${color}`,
        fillOpacity: 1,
        anchor: new google.maps.Point(0, 20),
        scale: 0.02,
      }
    }

    if (coletivo && restrito) {
      return {
        path: "M800-520q-17 0-28.5-11.5T760-560q0-17 11.5-28.5T800-600q17 0 28.5 11.5T840-560q0 17-11.5 28.5T800-520Zm-40-120v-200h80v200h-80ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z",
        fillColor: `${color}`,
        fillOpacity: 1,
        anchor: new google.maps.Point(0, 20),
        scale: 0.02,
      }
    }

    return {
      path: "M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z",
      fillColor: `${color}`,
      fillOpacity: 1,
      anchor: new google.maps.Point(0, 20),
      scale: 0.02,
    }
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
          <MarkerClusterer maxZoom={12} minimumClusterSize={20} zoomOnClick>
            {(clusterer): any =>
              deliveryPoints?.map((point) => (
                <Marker
                  key={point.id}
                  position={
                    {
                      lat: Number(point.latitude),
                      lng: Number(point.longitude),
                    } as LatLngLiteral
                  }
                  clusterer={clusterer}
                  label={{
                    text: `${point.ordem}`, // codepoint from https://fonts.google.com/icons
                    color: "#111",
                    fontSize: "14px",
                  }}

                  icon={markerColor(point.tipo, point.coletivo, point.horarioRestrito)}
                  onClick={() => loadInfoWindow(point)}
                />
              ))
            }
          </MarkerClusterer>
        </>
      )}

      {renderInfoWindow && (
        <InfoWindow
          onLoad={onLoad}
          position={infoWindowPos}
          onCloseClick={() => setRenderInfowWindow(false)}
        >
          <div className="bg-white border-1 p-2">
            <h1 className="mb-1">
              Placa: <b>{infoWindowData.placa}</b>
            </h1>
            <h1 className="mb-1">Cliente: {infoWindowData.cliente}</h1>
            <h1>
              Valor: <b>{formatNumber(infoWindowData.peso)}KG</b> -{" "}
              <b>{formatCurrency(infoWindowData.valor)}</b>
            </h1>
          </div>
        </InfoWindow>
      )}

      {bounds.length === 0 && (
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
      )}

      {bounds.length !== 0 && (
        <Polygon
          onLoad={(event) => onLoadPolygon(event)}
          paths={bounds}
          options={defaultOptions}
          draggable={true}
          editable={true}
          onMouseUp={() => onPolygonEditComplete(polygonRef.current!)}
        />
      )}

      <Polygon
        onLoad={(event) => onLoadPolygonRouter(event)}
        paths={polygonPath}
        options={polygonOptions}
      />
    </GoogleMap>
  );
}

const defaultOptions = {
  strokeWeight: 3,
  clickable: false,
  draggable: false,
  editable: true,
  visible: true,
  fillOpacity: 0.3,
  fillColor: "#52c754",
  strokeColor: "#52c754",
};
