import esriConfig from "https://js.arcgis.com/5.0/@arcgis/core/config.js";
import Map        from "https://js.arcgis.com/5.0/@arcgis/core/Map.js";
import MapView    from "https://js.arcgis.com/5.0/@arcgis/core/views/MapView.js";

import { API_KEY, MAP_CENTER, MAP_ZOOM }     from "./config.js";
import { sectorLayer }                        from "./sectors.js";
import { callLayer }                          from "./layer.js";
import { towerLayer }                         from "./towers.js";
import { heatmapRenderer, callRenderer }      from "./renderers.js";

esriConfig.apiKey = API_KEY;

const map = new Map({ basemap: "osm", layers: [sectorLayer, callLayer, towerLayer] });

const view = new MapView({ container: "viewDiv", map, center: MAP_CENTER, zoom: MAP_ZOOM });

const toggleBtn = document.getElementById("toggleBtn");
view.ui.add(toggleBtn, "bottom-right");

let heatmapOn = false;

toggleBtn.addEventListener("click", () => {
  heatmapOn = !heatmapOn;
  callLayer.renderer = heatmapOn ? heatmapRenderer : callRenderer;
  toggleBtn.textContent = heatmapOn ? "📍 Show Markers" : "🔥 Show Heatmap";
});
