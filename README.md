# Overview

{Important!  Do not say in this section that this is college assignment.  Talk about what you are trying to accomplish as a software engineer to further your learning.}

{Provide a description the map software that you wrote. Describe how to use your software.  Describe the source of the data that you used.}

{Describe your purpose for writing this software.}

{Provide a link to your YouTube demonstration.  It should be a 4-5 minute demo of the software running and a walkthrough of the code.}

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
- [ArcGIS Maps SDK for JavaScript 4.29](https://developers.arcgis.com/javascript/latest/) loaded from CDN

**How to run**

1. Clone the repository
2. Copy `js/config.example.js` to `js/config.js` and paste your ArcGIS API key (free at [developers.arcgis.com](https://developers.arcgis.com))
3. Start any local static server from the project folder (see options above)
4. Open `http://localhost:PORT` in your browser

No install steps, no terminal commands, no build process.

# Useful Websites

{Make a list of websites that you found helpful in this project}
* [Web Site Name](http://url.link.goes.here)
* [Web Site Name](http://url.link.goes.here)

# Future Work

{Make a list of things that you need to fix, improve, and add in the future.}
* A bundler like Vite — for minification, cache-busting, tree-shaking
* Environment variables for the API key instead of hardcoding
* TypeScript for type safety on the CALLS data shape