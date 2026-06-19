import SimpleRenderer    from "https://js.arcgis.com/4.29/@arcgis/core/renderers/SimpleRenderer.js";
import HeatmapRenderer   from "https://js.arcgis.com/4.29/@arcgis/core/renderers/HeatmapRenderer.js";
import PictureMarkerSymbol from "https://js.arcgis.com/4.29/@arcgis/core/symbols/PictureMarkerSymbol.js";

// Individual call point — phone icon
export const clusterRenderer = new SimpleRenderer({
  symbol: new PictureMarkerSymbol({
    url: "images/phone.png",
    width: "20px",
    height: "20px"
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

// featureReductionConfig is exported as a plain object so it can be safely
// reused both at layer creation and when the heatmap toggle restores clustering
export const featureReductionConfig = {
  type: "cluster",
  // SVG icon with built-in dark background — readable on any basemap
  symbol: {
    type: "picture-marker",
    url: "images/erb-icon.svg",
    width: "36px",
    height: "36px"
  },
  // Small radius keeps each of the 6 tower locations as a separate cluster bubble;
  // points at the exact same coordinates always cluster regardless of radius
  clusterRadius: "15px",
  popupTemplate: {
    title: "Cluster: {cluster_count} calls",
    content: "Zoom in to see individual call events."
  },
  labelingInfo: [{
    labelExpressionInfo: { expression: "$feature.cluster_count" },
    symbol: {
      type: "text",
      color: "#ffffff",
      font: { size: 10, weight: "bold" }
    }
  }]
};
