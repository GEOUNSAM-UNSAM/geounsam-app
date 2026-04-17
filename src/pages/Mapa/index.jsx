import { useState, useMemo, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { getMarcadores, getCategorias, getSedes } from "../../services/edificios";
import { crearIcono } from "../../utils/crearIcono";
import { useGeolocalizacion } from "../../hooks/useGeolocalizacion";

import PuntoUbicacion from "../../components/Mapa/PuntoUbicacion";
import BotonGPS from "../../components/Mapa/BotonGPS";
import FiltrosCategorias from "../../components/Mapa/FiltrosCategorias";
import DetalleSeleccion from "../../components/Mapa/DetalleSeleccion";
import VistaPlano from "./VistaPlano";
import PLANOS from "../../components/Planos";

function ZoomAlSeleccionar({ marcador }) {
  const map = useMap();
  useEffect(() => {
    if (marcador) {
      map.flyTo(marcador.coords, 18, { duration: 0.5 });
    }
  }, [marcador, map]);
  return null;
}

function CambiarVista({ coords, zoom }) {
  const map = useMap();
  const prevRef = useRef(null);

  useEffect(() => {
    const key = `${coords[0]},${coords[1]},${zoom}`;
    if (prevRef.current !== key) {
      map.setView(coords, zoom);
      prevRef.current = key;
    }
  }, [coords, zoom, map]);

  return null;
}

const categorias = getCategorias();
const sedes = getSedes();

function tienePlanoImplementado(marcador) {
  return Boolean(marcador?.planoId && PLANOS[marcador.planoId]);
}

export default function Mapa() {
  const [categoriaActiva, setCategoriaActiva] = useState("Edificios");
  const [sedeActiva] = useState("miguelete");
  const [marcadorSeleccionado, setMarcadorSeleccionado] = useState(null);
  const [edificioPlano, setEdificioPlano] = useState(null);
  const mapRef = useRef(null);

  const { ubicacionUsuario, gpsActivo, centrarEnUsuario } = useGeolocalizacion(mapRef);

  const sede = sedes[sedeActiva];

  const marcadoresFiltrados = useMemo(() => {
    return getMarcadores({ sede: sedeActiva, categoria: categoriaActiva });
  }, [categoriaActiva, sedeActiva]);

  if (edificioPlano) {
    return (
      <VistaPlano
        edificio={edificioPlano}
        onBack={() => setEdificioPlano(null)}
      />
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-68px-64px)] relative bg-neutral-white">
      <FiltrosCategorias
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onCategoriaChange={(id) => {
          setCategoriaActiva(id);
          setMarcadorSeleccionado(null);
        }}
      />

      {/* Mapa Leaflet */}
      <div className="flex-1 relative z-0">
        <MapContainer
          center={sede.coords}
          zoom={sede.zoom}
          className="h-full w-full"
          zoomControl={false}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution=""
            maxZoom={19}
          />
          <CambiarVista coords={sede.coords} zoom={sede.zoom} />
          <ZoomAlSeleccionar marcador={marcadorSeleccionado} />
          <PuntoUbicacion posicion={ubicacionUsuario} />

          {marcadoresFiltrados.map((marcador) => {
            const isSelected = marcadorSeleccionado?.id === marcador.id;
            return (
              <Marker
                key={marcador.id}
                position={marcador.coords}
                icon={crearIcono(marcador.tipo, isSelected)}
                eventHandlers={{
                  click: () => setMarcadorSeleccionado(marcador),
                }}
              >
                {isSelected && (
                  <Tooltip direction="top" offset={[0, -22]} permanent className="marker-tooltip">
                    {marcador.nombre}
                  </Tooltip>
                )}
              </Marker>
            );
          })}
        </MapContainer>

        <BotonGPS gpsActivo={gpsActivo} onClick={centrarEnUsuario} />
      </div>

      <DetalleSeleccion
        marcadorSeleccionado={marcadorSeleccionado}
        onVerPlano={(m) => setEdificioPlano(m)}
        puedeVerPlano={tienePlanoImplementado}
      />
    </div>
  );
}
