# Overview

This project is a GIS investigation map built to explore the ArcGIS Maps SDK for JavaScript 5.0 in a real-world forensic context. The goal was to go beyond basic pin-drop mapping and apply domain knowledge — how CDR data actually works in telecom investigations — to drive every design decision.

**Telefonemas CDR Map** visualizes 112 call events from a CDR (Call Detail Record) dataset recorded across 6 ERB (Estação Rádio Base / cell tower) sites in São Paulo, Brazil. CDR data does not capture the caller's GPS location — it records which antenna sector handled the call. The map uses the sector's azimuth (direction from North) and coverage radius from the CSV to position each call marker inside the correct antenna wedge, which is the most geographically accurate placement possible from this type of data.

**What the map shows:**
- **Orange markers** — individual call events, scattered within the antenna sector that handled each call, labeled with the origin phone number
- **Cyan tower icons** — the 6 ERB antenna locations at their exact coordinates
- **Sector wedges** — pie-slice polygons showing each antenna's 60° coverage zone; callers were physically located somewhere inside these areas
- **Heatmap mode** — toggles the call layer to a density heatmap (blue → red) showing call concentration around each tower

**How to use:**
1. Pan and zoom the map to explore call distribution across São Paulo
2. Click any call marker for details: origin number, destination, date, time, duration, and tower
3. Click any tower icon for its station ID, address, neighborhood, and total calls handled
4. Click any sector wedge for azimuth, radius, and call count
5. Use **🔥 Show Heatmap** to switch between individual markers and density view
6. Use **📡 Hide Sectors** to toggle the antenna coverage wedges on and off

The data comes from a telecommunications CDR billing extract containing call records linked to ERB metadata including azimuth and coverage radius per antenna sector.

[Software Demo Video](http://youtube.link.goes.here)

# Development Environment

**Tools**
- Any code editor (VS Code recommended)
- Any local static server — ES modules don't load over `file://`, so a server is required:
  - VS Code: [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension → click **Go Live**
  - Node.js: `npx serve .`
  - Python: `python -m http.server`
- Git + GitHub for version control

**Language & Libraries**
- Vanilla JavaScript (ES Modules — no framework, no build tool)
- [ArcGIS Maps SDK for JavaScript 5.0](https://developers.arcgis.com/javascript/latest/) loaded from CDN

**How to run**

1. Clone the repository
2. Copy `js/config.example.js` to `js/config.js` and paste your ArcGIS API key (free at [developers.arcgis.com](https://developers.arcgis.com))
3. Start any local static server from the project folder (see options above)
4. Open `http://localhost:PORT` in your browser

No install steps, no terminal commands, no build process.

# Useful Websites

* [ArcGIS Maps SDK for JavaScript — API Reference](https://developers.arcgis.com/javascript/latest/api-reference/)
* [ArcGIS Maps SDK — Sample Code](https://developers.arcgis.com/javascript/latest/sample-code/)
* [GeoJSONLayer — ArcGIS Documentation](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-GeoJSONLayer.html)
* [HeatmapRenderer — ArcGIS Documentation](https://developers.arcgis.com/javascript/latest/api-reference/esri-renderers-HeatmapRenderer.html)
* [Get a free ArcGIS API key](https://developers.arcgis.com/)
* [ES Modules in the browser — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
* [Material Design Icons (SVG paths for phone icon)](https://fonts.google.com/icons)

# Future Work

* Map legend — explain the orange call markers, cyan tower icons, sector wedges, and heatmap gradient to first-time viewers
* Info panel — overlay showing investigation summary (total calls, unique callers, active towers, date range)
* Basemap toggle — switch between dark street map and satellite imagery to give geographic context to tower locations
* Filter by caller — click a phone number to highlight only that caller's events across the map, useful for tracing individual movement patterns
* A bundler like Vite — for minification, cache-busting, tree-shaking
* Environment variables for the API key instead of hardcoding
* TypeScript for type safety on the CALLS data shape