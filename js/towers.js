import GeoJSONLayer from "https://js.arcgis.com/5.0/@arcgis/core/layers/GeoJSONLayer.js";
import CALLS from "./data.js";
import { towerRenderer } from "./renderers.js";

const seen = new Set();
const uniqueTowers = CALLS.filter(c => seen.has(c.nome) ? false : seen.add(c.nome));

/** @type {Record<string, number>} */
const callsPerTower = CALLS.reduce((acc, c) => {
  acc[c.nome] = (acc[c.nome] ?? 0) + 1;
  return acc;
}, {});

const geojson = {
  type: "FeatureCollection",
  features: uniqueTowers.map((t, i) => ({
    type: "Feature",
    id: i,
    geometry: { type: "Point", coordinates: [t.lon, t.lat] },
    properties: {
      nome:       t.nome,
      estacao:    t.estacao,
      bairro:     t.bairro,
      logradouro: t.logradouro,
      totalCalls: callsPerTower[t.nome]
    }
  }))
};

const blob = new Blob([JSON.stringify(geojson)], { type: "application/json" });

export const towerLayer = new GeoJSONLayer({
  url: URL.createObjectURL(blob),
  fields: [
    { name: "nome",       type: "string"  },
    { name: "estacao",    type: "string"  },
    { name: "bairro",     type: "string"  },
    { name: "logradouro", type: "string"  },
    { name: "totalCalls", type: "integer" }
  ],
  objectIdField: "ObjectID",
  renderer: towerRenderer,
  popupTemplate: {
    title: "📡 {nome}",
    content: [{
      type: "fields",
      fieldInfos: [
        { fieldName: "estacao",    label: "Station ID"    },
        { fieldName: "bairro",     label: "Neighborhood"  },
        { fieldName: "logradouro", label: "Address"       },
        { fieldName: "totalCalls", label: "Calls handled" }
      ]
    }]
  }
});
