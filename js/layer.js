import GeoJSONLayer from "https://js.arcgis.com/5.0/@arcgis/core/layers/GeoJSONLayer.js";
import CALLS from "./data.js";
import { callRenderer } from "./renderers.js";

// Golden angle (137.508°) spiral — deterministic scatter with no overlap bias.
// Applied per-tower so each tower's calls fan out evenly around it.
// 6 unique ERB coordinates cover all 112 calls; without scatter, all points at
// the same tower stack invisibly on a single pixel.
const GOLDEN = 137.508 * (Math.PI / 180);
/** @type {Record<string, number>} */
const towerCount = {};

const geojson = {
  type: "FeatureCollection",
  features: CALLS.map((c, i) => {
    const ti    = towerCount[c.nome] ?? 0;
    towerCount[c.nome] = ti + 1;

    // Radius grows with sqrt(ti) — inner calls pack tightly, outer calls spread.
    // 0.002° base ≈ 220m; max ~20 calls per tower → max offset ~0.009° ≈ 850m
    const angle = ti * GOLDEN;
    const r     = 0.002 * Math.sqrt(ti + 1);

    return {
      type: "Feature",
      id: i,
      geometry: {
        type: "Point",
        coordinates: [c.lon + r * Math.cos(angle), c.lat + r * Math.sin(angle)]
      },
      properties: {
        origem:  c.origem,
        destino: c.destino,
        data:    c.data,  // DD/MM/YYYY from CSV parser
        hora:    c.hora,
        duracao: c.duracao,
        estacao: c.nome,
        bairro:  c.bairro,
        label:   `...${c.origem.slice(-4)} ${c.hora.slice(0, 5)}`
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
