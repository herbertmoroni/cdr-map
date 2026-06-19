import esriConfig from "https://js.arcgis.com/5.0/@arcgis/core/config.js";
import Map        from "https://js.arcgis.com/5.0/@arcgis/core/Map.js";
import MapView    from "https://js.arcgis.com/5.0/@arcgis/core/views/MapView.js";

import { API_KEY, MAP_CENTER, MAP_ZOOM } from "./config.js";
import { callLayer }                      from "./layer.js";
import { towerLayer }                     from "./towers.js";
import { heatmapRenderer, callRenderer }  from "./renderers.js";

esriConfig.apiKey = API_KEY;

// Tower layer sits on top so ERB icons are always clickable above call markers
const map = new Map({ basemap: "osm", layers: [callLayer, towerLayer] });

const view = new MapView({
  container: "viewDiv",
  map,
  center: MAP_CENTER,
  zoom:   MAP_ZOOM
});

// Toggle between scattered call markers and heatmap density view.
// Tower layer is unaffected — ERB icons remain visible in both modes.
let heatmapOn = false;

document.getElementById("toggleBtn").addEventListener("click", () => {
  heatmapOn = !heatmapOn;

  if (heatmapOn) {
    callLayer.renderer = heatmapRenderer;
    document.getElementById("toggleBtn").textContent = "📍 Show Markers";
  } else {
    callLayer.renderer = callRenderer;
    document.getElementById("toggleBtn").textContent = "🔥 Show Heatmap";
  }
});
