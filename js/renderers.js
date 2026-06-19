import SimpleRenderer      from "https://js.arcgis.com/5.0/@arcgis/core/renderers/SimpleRenderer.js";
import HeatmapRenderer     from "https://js.arcgis.com/5.0/@arcgis/core/renderers/HeatmapRenderer.js";
import PictureMarkerSymbol from "https://js.arcgis.com/5.0/@arcgis/core/symbols/PictureMarkerSymbol.js";

export const callRenderer = new SimpleRenderer({
  symbol: new PictureMarkerSymbol({ url: "images/phone-icon.svg", width: "28px", height: "28px" })
});

export const towerRenderer = new SimpleRenderer({
  symbol: new PictureMarkerSymbol({ url: "images/erb-icon.svg", width: "36px", height: "36px" })
});

export const heatmapRenderer = new HeatmapRenderer({
  colorStops: [
    { color: "rgba(0, 0, 0, 0)", ratio: 0   }, // transparent where there are no calls
    { color: "#2b83ba",          ratio: 0.2 }, // blue   — low density
    { color: "#abdda4",          ratio: 0.4 }, // green
    { color: "#ffffbf",          ratio: 0.6 }, // yellow
    { color: "#fdae61",          ratio: 0.8 }, // orange
    { color: "#d7191c",          ratio: 1   }  // red    — high density
  ],
  radius: 20
});
