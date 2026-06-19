import esriConfig from "https://js.arcgis.com/5.0/@arcgis/core/config.js";
import Map        from "https://js.arcgis.com/5.0/@arcgis/core/Map.js";
import MapView    from "https://js.arcgis.com/5.0/@arcgis/core/views/MapView.js";

import { API_KEY, MAP_CENTER, MAP_ZOOM } from "./config.js";
import { layer }                          from "./layer.js";
import { heatmapRenderer, clusterRenderer, featureReductionConfig } from "./renderers.js";

esriConfig.apiKey = API_KEY;

const map = new Map({ basemap: "osm", layers: [layer] });

const view = new MapView({
  container: "viewDiv",
  map,
  center: MAP_CENTER,
  zoom:   MAP_ZOOM
});

// Toggle between clustered marker view and heatmap density view
let heatmapOn = false;

document.getElementById("toggleBtn").addEventListener("click", () => {
  heatmapOn = !heatmapOn;

  if (heatmapOn) {
    layer.featureReduction = null;
    layer.renderer = heatmapRenderer;
    document.getElementById("toggleBtn").textContent = "📍 Show Markers";
  } else {
    layer.renderer = clusterRenderer;
    layer.featureReduction = featureReductionConfig;
    document.getElementById("toggleBtn").textContent = "🔥 Show Heatmap";
  }
});
