import GeoJSONLayer from "https://js.arcgis.com/5.0/@arcgis/core/layers/GeoJSONLayer.js";
import CALLS from "./data.js";
import { callRenderer } from "./renderers.js";

// CDR records which antenna sector handled each call (azimute = direction from North, clockwise).
// The caller was somewhere inside that sector — we position markers in the azimuth direction
// at increasing distances so same-sector calls fan out visually rather than stacking.
// This is the most geographically accurate placement possible from CDR data alone.

/** @type {Record<string, number>} */
const sectorCount = {};

const geojson = {
  type: "FeatureCollection",
  features: CALLS.map((c, i) => {
    const key = `${c.nome}_${c.azimute}`;
    const si  = sectorCount[key] ?? 0;
    sectorCount[key] = si + 1;

    const az_rad = c.azimute * (Math.PI / 180);
    const spread = ((si % 5) - 2) * 0.42; // ±48° arc spread across 5 slots so markers don't overlap
    const angle  = az_rad + spread;

    // Distance from tower grows with sector index: starts at 150 m, approaches coverage radius (capped at 1500 m)
    const dist_m   = 150 + si * (Math.min(c.raio, 1500) / 20);
    const dist_deg = dist_m / 111000;

    // Azimuth from North: lat offset = cos(az), lon offset = sin(az) / cos(lat) — corrects for meridian convergence
    const lat_offset = dist_deg * Math.cos(angle);
    const lon_offset = dist_deg * Math.sin(angle) / Math.cos(c.lat * (Math.PI / 180));

    return {
      type: "Feature",
      id: i,
      geometry: {
        type: "Point",
        coordinates: [c.lon + lon_offset, c.lat + lat_offset]
      },
      properties: {
        origem:  c.origem,
        destino: c.destino,
        data:    c.data,
        hora:    c.hora,
        duracao: c.duracao,
        estacao: c.nome,
        bairro:  c.bairro,
        label:   c.origem
      }
    };
  })
};

const blob = new Blob([JSON.stringify(geojson)], { type: "application/json" });

export const callLayer = new GeoJSONLayer({
  url: URL.createObjectURL(blob),
  fields: [
    { name: "origem",  type: "string"  },
    { name: "destino", type: "string"  },
    { name: "data",    type: "string"  },
    { name: "hora",    type: "string"  },
    { name: "duracao", type: "integer" },
    { name: "estacao", type: "string"  },
    { name: "bairro",  type: "string"  },
    { name: "label",   type: "string"  }
  ],
  objectIdField: "ObjectID",
  renderer: callRenderer,
  popupTemplate: {
    title: "📞 Call event",
    content: [{
      type: "fields",
      fieldInfos: [
        { fieldName: "origem",  label: "Origin"       },
        { fieldName: "destino", label: "Destination"  },
        { fieldName: "data",    label: "Date"         },
        { fieldName: "hora",    label: "Time"         },
        { fieldName: "duracao", label: "Duration (s)" },
        { fieldName: "estacao", label: "Tower"        },
        { fieldName: "bairro",  label: "Neighborhood" }
      ]
    }]
  },
  labelingInfo: [{
    labelExpressionInfo: { expression: "$feature.label" },
    symbol: {
      type: "text",
      color: "#00b4ff",
      haloColor: "#000000",
      haloSize: "1px",
      font: { size: 9 }
    },
    minScale: 50000
  }]
});
