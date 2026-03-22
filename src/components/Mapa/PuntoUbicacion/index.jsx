import { CircleMarker } from "react-leaflet";

export default function PuntoUbicacion({ posicion }) {
  if (!posicion) return null;
  return (
    <>
      <CircleMarker
        center={posicion}
        radius={20}
        pathOptions={{ color: "transparent", fillColor: "#4285F4", fillOpacity: 0.15 }}
      />
      <CircleMarker
        center={posicion}
        radius={7}
        pathOptions={{ color: "white", weight: 2, fillColor: "#4285F4", fillOpacity: 1 }}
      />
    </>
  );
}
