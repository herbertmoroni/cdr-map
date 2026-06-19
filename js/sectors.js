import GeoJSONLayer    from "https://js.arcgis.com/5.0/@arcgis/core/layers/GeoJSONLayer.js";
import SimpleRenderer   from "https://js.arcgis.com/5.0/@arcgis/core/renderers/SimpleRenderer.js";
import SimpleFillSymbol from "https://js.arcgis.com/5.0/@arcgis/core/symbols/SimpleFillSymbol.js";
import CALLS from "./data.js";

// CDR sector visualization: each unique (tower, azimuth) pair maps to a pie-slice polygon
// showing the coverage zone where the caller was physically located.
// This is standard forensic CDR mapping — the call was handled by this sector,
// so the caller was somewhere inside this wedge.

const HALF_ANGLE_DEG = 30; // standard 60° sector sweep (±30° from antenna face)
const ARC_STEPS      = 10; // points along the arc for a smooth wedge edge
const MAX_RADIUS_M   = 1500;

/** @type {Record<string, { lat:number, lon:number, azimute:number, raio:number, nome:string, bairro:string, count:number }>} */
const sectorMap = {};
for (const c of CALLS) {
  const key = `${c.nome}_${c.azimute}`;
  if (!sectorMap[key]) {
    sectorMap[key] = { lat: c.lat, lon: c.lon, azimute: c.azimute, raio: c.raio, nome: c.nome, bairro: c.bairro, count: 0 };
  }
  sectorMap[key].count++;
}

function wedgeRing(lat, lon, azimuth_deg, radius_m) {
  const lat_rad  = lat * (Math.PI / 180);
  const dist_deg = Math.min(radius_m, MAX_RADIUS_M) / 111000;
  const ring     = [[lon, lat]]; // apex at tower

  // Arc from left edge to right edge of sector
  for (let step = 0; step <= ARC_STEPS; step++) {
    const angle_deg = (azimuth_deg - HALF_ANGLE_DEG) + (2 * HALF_ANGLE_DEG * step / ARC_STEPS);
    const angle_rad = angle_deg * (Math.PI / 180);
    // Azimuth from North: lat offset = cos(az), lon offset = sin(az) / cos(lat)
    ring.push([
      lon + dist_deg * Math.sin(angle_rad) / Math.cos(lat_rad),
      lat + dist_deg * Math.cos(angle_rad)
    ]);
  }

  ring.push([lon, lat]); // close back to apex
  return ring;
}

const geojson = {
  type: "FeatureCollection",
  features: Object.entries(sectorMap).map(([, s], i) => ({
    type: "Feature",
    id: i,
    geometry: { type: "Polygon", coordinates: [wedgeRing(s.lat, s.lon, s.azimute, s.raio)] },
    properties: {
      nome:    s.nome,
      azimute: s.azimute,
      raio:    s.raio,
      calls:   s.count,
      bairro:  s.bairro
    }
  }))
};

const blob = new Blob([JSON.stringify(geojson)], { type: "application/json" });

export const sectorLayer = new GeoJSONLayer({
  url: URL.createObjectURL(blob),
  fields: [
    { name: "nome",    type: "string"  },
    { name: "azimute", type: "integer" },
    { name: "raio",    type: "integer" },
    { name: "calls",   type: "integer" },
    { name: "bairro",  type: "string"  }
  ],
  objectIdField: "ObjectID",
  renderer: new SimpleRenderer({
    symbol: new SimpleFillSymbol({
      color:   [0, 180, 255, 0.12],
      outline: { color: [0, 180, 255, 0.7], width: 1 }
    })
  }),
  popupTemplate: {
    title: "📡 {nome} — sector {azimute}°",
    content: [{
      type: "fields",
      fieldInfos: [
        { fieldName: "azimute", label: "Azimuth"       },
        { fieldName: "raio",    label: "Radius (m)"    },
        { fieldName: "calls",   label: "Calls handled" },
        { fieldName: "bairro",  label: "Neighborhood"  }
      ]
    }]
  }
});
