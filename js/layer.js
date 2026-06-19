import GeoJSONLayer from "https://js.arcgis.com/5.0/@arcgis/core/layers/GeoJSONLayer.js";
import CALLS from "./data.js";
import { clusterRenderer, featureReductionConfig } from "./renderers.js";

// Build GeoJSON from CDR records
const geojson = {
  type: "FeatureCollection",
  features: CALLS.map((c, i) => ({
    type: "Feature",
    id: i,
    geometry: { type: "Point", coordinates: [c.lon, c.lat] },
    properties: {
      origem:  c.origem,
      destino: c.destino,
      data:    c.data, // already DD/MM/YYYY from the CSV parser
      hora:    c.hora,
      duracao: c.duracao,
      estacao: c.nome,
      bairro:  c.bairro,
      label:   `...${c.origem.slice(-4)} ${c.hora.slice(0, 5)}`
    }
  }))
};

// Blob URL lets GeoJSONLayer consume in-memory data without a server
const blob = new Blob([JSON.stringify(geojson)], { type: "application/json" });
const url  = URL.createObjectURL(blob);

// 6 unique ERB coordinates cover all 112 calls — clustering prevents stacked points
// from appearing as a single marker at each tower location
export const layer = new GeoJSONLayer({
  url,
  // Explicit field declarations prevent ArcGIS from auto-detecting types
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
  renderer: clusterRenderer,
  featureReduction: featureReductionConfig,
  popupTemplate: {
    title: "📞 Call event",
    content: [{
      type: "fields",
      fieldInfos: [
        { fieldName: "origem",  label: "Origin"        },
        { fieldName: "destino", label: "Destination"   },
        { fieldName: "data",    label: "Date"          },
        { fieldName: "hora",    label: "Time"          },
        { fieldName: "duracao", label: "Duration (s)"  },
        { fieldName: "estacao", label: "Tower"         },
        { fieldName: "bairro",  label: "Neighborhood"  }
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
    minScale: 50000 // labels appear only when zoomed in enough to see individual markers
  }]
});
