import SimpleRenderer      from "https://js.arcgis.com/5.0/@arcgis/core/renderers/SimpleRenderer.js";
import HeatmapRenderer     from "https://js.arcgis.com/5.0/@arcgis/core/renderers/HeatmapRenderer.js";
import PictureMarkerSymbol from "https://js.arcgis.com/5.0/@arcgis/core/symbols/PictureMarkerSymbol.js";

// Individual call event — phone icon
export const callRenderer = new SimpleRenderer({
  symbol: new PictureMarkerSymbol({
    url: "images/phone.png",
    width: "20px",
    height: "20px"
  })
});

// ERB tower locations — SVG icon with built-in dark background
export const towerRenderer = new SimpleRenderer({
  symbol: new PictureMarkerSymbol({
    url: "images/erb-icon.svg",
    width: "36px",
    height: "36px"
  })
});

// Heatmap density view — call concentration by tower location
export const heatmapRenderer = new HeatmapRenderer({
  colorStops: [
    { color: "rgba(63, 40, 102, 0)",  ratio: 0     },
    { color: "#472b77",               ratio: 0.083 },
    { color: "#4e2d87",               ratio: 0.166 },
    { color: "#563098",               ratio: 0.249 },
    { color: "#5d32a8",               ratio: 0.332 },
    { color: "#6735be",               ratio: 0.415 },
    { color: "#7139d4",               ratio: 0.498 },
    { color: "#7b3ce9",               ratio: 0.581 },
    { color: "#853fff",               ratio: 0.664 },
    { color: "#a46fbf",               ratio: 0.747 },
    { color: "#c29f80",               ratio: 0.83  },
    { color: "#e0cf40",               ratio: 0.913 },
    { color: "#ffff00",               ratio: 1     }
  ],
  radius: 20,
  maxDensity: 0.01,
  minDensity: 0
});
