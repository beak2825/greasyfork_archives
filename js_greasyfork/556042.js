// ==UserScript==
// @name         Refavorited+
// @namespace    lobo-refavorited-plus
// @version      0.6
// @description  More favorite for wplace.live
// @author       lobo (forked from allanf181)
// @license      MIT
// @match        *://wplace.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wplace.live
// @homepageURL  https://github.com/olob0/wplace-refavorited-plus
// @require      https://cdn.jsdelivr.net/npm/fuzzysort@3.1.0/fuzzysort.min.js
// @require      https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4
// @require      https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556042/Refavorited%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/556042/Refavorited%2B.meta.js
// ==/UserScript==

(function () {
  `use strict`;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css";
  document.head.appendChild(link);

  const __VERSION = GM_info.script.version;
  const __NAME = GM_info.script.name;

  const pageWindow = unsafeWindow;
  let lastClickedPixelInfo = null;
  let modalHasInjected = false;
  let favButtonListHasInjected = false;
  let observerInjectFavListButtonExecuted = false;
  let lastTilesVersion = null;

  console.log = (...args) =>
    pageWindow.console.log(
      `%c[${__NAME}] INFO:`,
      "color: #d6d6d6; font-weight: bold;",
      ...args
    );
  console.error = (...args) =>
    pageWindow.console.log(
      `%c[${__NAME}] ERROR:`,
      "color: #ff3636; font-weight: bold;",
      ...args
    );
  console.warn = (...args) =>
    pageWindow.console.log(
      `%c[${__NAME}] WARN:`,
      "color: #fff236; font-weight: bold;",
      ...args
    );

  console.log("hooking fetch");
  const originalFetch = pageWindow.fetch.bind(pageWindow);

  pageWindow.fetch = function (url, options) {
    try {
      const urlString = String(url);
      if (urlString.startsWith("https://backend.wplace.live/s0/pixel/")) {
        const urlObj = new URL(urlString);
        const pathParts = urlObj.pathname.split("/");
        const params = urlObj.searchParams;
        const tile = [parseInt(pathParts[3]), parseInt(pathParts[4])];
        const pixel = [parseInt(params.get("x")), parseInt(params.get("y"))];

        lastClickedPixelInfo = { tile, pixel };

        console.log(
          `detected last clicked pixel at ${JSON.stringify(
            lastClickedPixelInfo
          )}`
        );

        window.requestAnimationFrame(updateFavPlusButtonState);
      }
    } catch (e) {
      console.error("fetch hook error:", e);
    }

    return originalFetch.apply(this, arguments);
  };

  async function getLatestTilesVersion() {
    const response = await fetch(
      "https://api.github.com/repos/samuelscheit/wplace-archive/tags"
    );
    if (response.ok) {
      const data = await response.json();
      return data.length > 0 ? data[0].name : null;
    }
    return null;
  }

  function truncate(text, maxLength = 50) {
    if (typeof text !== "string") return "";
    return text.length > maxLength ? text.slice(0, maxLength - 1) + "…" : text;
  }

  function waitForElement(selector) {
    return new Promise((resolve) => {
      const elementNow = document.querySelector(selector);
      if (elementNow) return resolve(elementNow);
      const observer = new MutationObserver((mutations) => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  function getLatLngFromPos(tile, pixel) {
  const TILE_SIZE_PX = 1000.0;
  const ZOOM_LEVEL = 11.0;
  const n = Math.pow(2, ZOOM_LEVEL);

  const x = tile[0] + pixel[0] / TILE_SIZE_PX;
  const y = tile[1] + pixel[1] / TILE_SIZE_PX;

  const lon = (x / n) * 360.0 - 180.0;
  const lat =
    (Math.atan(Math.sinh(Math.PI * (1 - 2 * (y / n)))) * 180.0) / Math.PI;

  return [lat, lon];
}

  function pixelInfoToPos(tile, pixel) {
    return { coords: getLatLngFromPos(tile, pixel), pixel: pixel, tile: tile };
  }

  function addFavorite(title, tile, pixel) {
    let favorites = getAllFavorites();
    favorites.push({ title: title, posObj: pixelInfoToPos(tile, pixel) });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    console.log("adding favorite: " + title);
  }

  function removeFavorite(posObj) {
    console.log("remove favorite");
    let favorites = getAllFavorites().filter(
      (fav) =>
        !(
          fav.posObj.pixel[0] === posObj.pixel[0] &&
          fav.posObj.pixel[1] === posObj.pixel[1] &&
          fav.posObj.tile[0] === posObj.tile[0] &&
          fav.posObj.tile[1] === posObj.tile[1]
        )
    );
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  function findFavoriteByPos(tile, pixel) {
    return getAllFavorites().find(
      (fav) =>
        fav.posObj.pixel[0] === pixel[0] &&
        fav.posObj.pixel[1] === pixel[1] &&
        fav.posObj.tile[0] === tile[0] &&
        fav.posObj.tile[1] === tile[1]
    );
  }

  function getAllFavorites() {
    console.log("get all favorites");

    return JSON.parse(localStorage.getItem("favorites") || "[]");
  }

  const markerIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
      <path fill="#000a" d="m183-51 79-338L-1-617l346-29 135-319 135 319 346 29-263 228 79 338-297-180L183-51Z"/>
      <path d="m293-203.08 49.62-212.54-164.93-142.84 217.23-18.85L480-777.69l85.08 200.38 217.23 18.85-164.93 142.84L667-203.08 480-315.92 293-203.08Z"/>
    </svg>`;

  const favPlusIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" class="size-4.5">
        <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"></path>
    </svg>Fav+`;

  function createStarMarker(fav) {
    const el = document.createElement("div");

    el.setAttribute("data-tip", `${truncate(fav.title || "")}`);

    el.className = "cursor-pointer z-20 tooltip";
    el.style.wordBreak = "break-all";

    el.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      width="28" height="28">
      <path fill="#000a"
        d="m183-51 79-338L-1-617l346-29 135-319 135 319 346 29-263 228 79 338-297-180L183-51Z"/>
      <path fill="#facc15"
        d="m293-203.08 49.62-212.54-164.93-142.84 217.23-18.85L480-777.69l85.08 200.38 217.23 18.85-164.93 142.84L667-203.08 480-315.92 293-203.08Z"/>
    </svg>
  `;

    el.style.cursor = "pointer";
    return el;
  }

  function getOpacityFromZoom(zoom) {
    if (zoom >= 10.6) return 0.3;
    return 1.0;
  }

  function openMapLibreInstance() {
    document.querySelector("#favorite-modal").removeAttribute("open");

    const existingOverlay = document.getElementById("wplace-map-overlay");

    if (existingOverlay) existingOverlay.remove();

    const overlay = document.createElement("div");

    overlay.id = "wplace-map-overlay";
    overlay.className =
      "fixed inset-0 z-[99999] bg-black/90 w-screen h-screen flex flex-col";
    document.body.appendChild(overlay);

    const mapCanvas = document.createElement("div");

    mapCanvas.id = "wplace-map-canvas";
    mapCanvas.className = "absolute inset-0 w-full h-full bg-[#141414]";
    overlay.appendChild(mapCanvas);

    const closeBtn = document.createElement("button");

    closeBtn.className =
      "absolute top-4 right-4 btn btn-circle btn-error z-[100000] shadow-lg";
    closeBtn.innerHTML = "✕";
    closeBtn.onclick = () => {
      overlay.remove();
      document.querySelector("#favorite-modal").setAttribute("open", "true");
    };
    overlay.appendChild(closeBtn);

    const actionBar = document.createElement("div");

    actionBar.id = "fav-map-action-bar";
    actionBar.className =
      "absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-base-100 p-4 rounded-xl shadow-xl z-[100000] hidden flex-col items-center gap-2 border border-base-300 min-w-[200px]";
    actionBar.innerHTML = `
        <span id="fav-target-name" class="font-bold text-lg text-center truncate w-full block"></span>
        <button id="fav-go-btn" class="btn btn-primary w-full shadow-md">Go</button>
    `;
    overlay.appendChild(actionBar);

    const favorites = getAllFavorites();

    const features = favorites.map((fav) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [fav.posObj.coords[1], fav.posObj.coords[0]], // [Lon, Lat]
      },
      properties: {
        title: fav.title,
        lat: fav.posObj.coords[0],
        lng: fav.posObj.coords[1],
      },
    }));

    const map = new maplibregl.Map({
      container: "wplace-map-canvas",
      style: {
        version: 8,
        sources: {
          "osm-dark": {
            type: "raster",
            tiles: ["https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "",
          },
          tiles: {
            type: "raster",
            tiles: [
              `https://wplace_cdn.samuelscheit.com/wplace-samuelscheit/tiles/${lastTilesVersion}/{z}/{x}/{y}.png`,
            ],
            scheme: "xyz",
            maxzoom: 11,
          },
        },
        layers: [
          {
            id: `osm-dark`,
            type: "raster",
            source: `osm-dark`,
            paint: {
              "raster-resampling": "nearest",
              "raster-opacity": 1,
            },
          },
          {
            id: `tiles`,
            type: "raster",
            source: `tiles`,
            paint: {
              "raster-resampling": "nearest",
              "raster-opacity": 1,
            },
          },
        ],
      },
      center: [0, 0],
      zoom: 1,
      dragRotate: false,
      doubleClickZoom: false,
      pitch: 0,
      maxPitch: 0,
      attributionControl: false,
      renderWorldCopies: false,
    });

    map.touchZoomRotate.disableRotation(),
      map.on("load", () => {
        map.addSource("favorites", {
          type: "geojson",
          data: { type: "FeatureCollection", features: features },
        });

        favorites.forEach((fav) => {
          const markerEl = createStarMarker(fav);

          new maplibregl.Marker({
            element: markerEl,
            anchor: "bottom",
            opacity: getOpacityFromZoom(map.getZoom()),
          })
            .setLngLat([fav.posObj.coords[1], fav.posObj.coords[0]])
            .addTo(map);

          markerEl.addEventListener("click", () => {
            map.flyTo({
              center: [fav.posObj.coords[1], fav.posObj.coords[0]],
              zoom: Math.max(map.getZoom(), 15),
              speed: 1.2,
            });

            const bar = document.getElementById("fav-map-action-bar");
            document.getElementById("fav-target-name").innerText = fav.title;
            bar.classList.remove("hidden");
            bar.classList.add("flex");

            document.getElementById("fav-go-btn").onclick = () => {
              pageWindow.location.href = `https://wplace.live/?lat=${fav.posObj.coords[0]}&lng=${fav.posObj.coords[1]}&zoom=15`;
            };
          });
        });

        map.addLayer({
          id: "favorites-labels",
          type: "symbol",
          source: "favorites",
          layout: {
            "text-field": ["get", "title"],
            "text-variable-anchor": ["top", "bottom"],
            "text-radial-offset": 1,
            "text-size": 12,
            "text-font": ["Open Sans Regular"],
          },
          paint: {
            "text-color": "#ffffff",
            "text-halo-color": "#000000",
            "text-halo-width": 2,
          },
        });

        map.on(
          "mouseenter",
          "favorites-points",
          () => (map.getCanvas().style.cursor = "pointer")
        );
        map.on(
          "mouseleave",
          "favorites-points",
          () => (map.getCanvas().style.cursor = "")
        );
      });
  }

  function createTd(...lines) {
    const td = document.createElement("td");
    td.className = "fav-td truncate";
    td.innerHTML = lines.flat().join("<br/>");
    return td;
  }

  function renderFavoritesTable(favorites) {
    const tableBody = document.querySelector("#favorite-table-body");
    if (!tableBody) return;
    tableBody.innerHTML = "";
    favorites.forEach((fav, index) => {
      const row = document.createElement("tr");
      row.classList.add(index % 2 === 0 ? "bg-base-100" : "bg-base-200");
      const coords = fav.posObj.coords;
      const tilePixel = [
        `(${fav.posObj.tile[0]}, ${fav.posObj.tile[1]})`,
        `(${fav.posObj.pixel[0]}, ${fav.posObj.pixel[1]})`,
      ];
      const coordsParsed = [
        `${coords[0].toFixed(5)}`,
        `${coords[1].toFixed(5)}`,
      ];

      const tdTitle = createTd(fav.title);
      const tdTilePixel = createTd(tilePixel);
      const tdCoords = createTd(coordsParsed);
      const tdButtons = createTd("");
      tdButtons.innerHTML = `
        <button class="btn btn-sm btn-primary btn-soft" data-coords='${JSON.stringify(
          coords
        )}'>Visit</button>
        <button class="btn btn-sm btn-error btn-soft" data-posobj='${JSON.stringify(
          fav.posObj
        )}'>Delete</button>`;

      row.append(tdTitle, tdTilePixel, tdCoords, tdButtons);
      tableBody.appendChild(row);
    });

    tableBody.querySelectorAll("button.btn-primary").forEach((button) => {
      button.onclick = function () {
        let coords = JSON.parse(this.getAttribute("data-coords"));
        pageWindow.location.href = `https://wplace.live/?lat=${coords[0]}&lng=${coords[1]}&zoom=15`;
      };
    });
    tableBody.querySelectorAll("button.btn-error").forEach((button) => {
      button.onclick = function () {
        if (!confirm("Are you sure you want to delete this favorite?")) return;
        removeFavorite(JSON.parse(this.getAttribute("data-posobj")));
        filterAndRenderFavorites(
          document.querySelector("#favorite-search").value
        );
      };
    });
  }

  function filterAndRenderFavorites(searchTerm) {
    const allFavorites = getAllFavorites();

    if (!searchTerm) {
      renderFavoritesTable(allFavorites);
      return;
    }

    renderFavoritesTable(
      fuzzysort
        .go(searchTerm, allFavorites, { key: "title" })
        .map((result) => result.obj)
    );
  }

  function updateFavPlusButtonState() {
    const button = document.querySelector("#favplusbutton");
    if (!button) return;
    if (
      lastClickedPixelInfo &&
      findFavoriteByPos(lastClickedPixelInfo.tile, lastClickedPixelInfo.pixel)
    ) {
      button.classList.add("text-yellow-400");
    } else {
      button.classList.remove("text-yellow-400");
    }
  }

  function onFavPlusButtonClick() {
    if (!lastClickedPixelInfo) {
      alert("No position data available. Click on the map first.");
      return;
    }

    const { tile, pixel } = lastClickedPixelInfo;
    const existingFav = findFavoriteByPos(tile, pixel);

    if (existingFav) {
      removeFavorite(existingFav.posObj);
      this.classList.remove("text-yellow-400");
    } else {
      let title = prompt("Enter a title for this favorite:");
      if (!title) return;

      addFavorite(title, tile, pixel);
      this.classList.add("text-yellow-400");
    }
  }

  async function registerModalEvents() {
    console.log("registering modal events...");

    console.log("- event search input");
    (await waitForElement("#favorite-search")).addEventListener("input", (e) =>
      filterAndRenderFavorites(e.target.value)
    );

    console.log("- event close modal buton");
    (
      await waitForElement("#favorite-modal label[for='favorite-modal']")
    ).addEventListener("click", () =>
      document.querySelector("#favorite-modal").removeAttribute("open")
    );

    console.log("- event open map button");
    (await waitForElement("#open-map-btn")).addEventListener(
      "click",
      openMapLibreInstance
    );

    console.log("- event import button");
    (await waitForElement("#import-favorites")).addEventListener(
      "click",
      function () {
        let base64 = prompt("Paste your favorites base64 string here:");
        if (!base64) return;
        try {
          let favorites = JSON.parse(atob(base64));
          if (!Array.isArray(favorites)) {
            throw new Error("Invalid format");
          }
          for (const fav of favorites) {
            if (
              typeof fav.title !== "string" ||
              typeof fav.posObj !== "object" ||
              !Array.isArray(fav.posObj.coords) ||
              !Array.isArray(fav.posObj.pixel) ||
              !Array.isArray(fav.posObj.tile)
            ) {
              throw new Error("Invalid format");
            }
            if (
              fav.posObj.coords.length !== 2 ||
              fav.posObj.pixel.length !== 2 ||
              fav.posObj.tile.length !== 2
            ) {
              throw new Error("Invalid format");
            }
            if (
              typeof fav.posObj.coords[0] !== "number" ||
              typeof fav.posObj.coords[1] !== "number" ||
              typeof fav.posObj.pixel[0] !== "number" ||
              typeof fav.posObj.pixel[1] !== "number" ||
              typeof fav.posObj.tile[0] !== "number" ||
              typeof fav.posObj.tile[1] !== "number"
            ) {
              throw new Error("Invalid format");
            }
          }
          let confirmImport = confirm(
            `This will overwrite your current favorites with ${favorites.length} favorites. Are you sure?`
          );
          if (!confirmImport) return;
          localStorage.setItem("favorites", JSON.stringify(favorites));
          filterAndRenderFavorites("");
          alert("Import successful.");
        } catch (e) {
          alert("Failed to import favorites: " + e.message);
        }
      }
    );

    console.log("- event export button");
    (await waitForElement("#export-favorites")).addEventListener(
      "click",
      function () {
        let base64 = btoa(localStorage.getItem("favorites") || "[]");
        navigator.clipboard.writeText(base64).then(
          () => alert("Favorites exported to clipboard."),
          () => alert("Failed to copy to clipboard.")
        );
      }
    );
  }

  // run when DOM loads
  (async function () {
    let mainDiv = await waitForElement("body > div");

    if (!mainDiv) {
      console.warn("'boy > div' not found. using 'document.body' fallback");
      mainDiv = document.body; // Fallback
    }

    const modalHTML = `
<div id="favorite-modal" class="modal">
  <div class="modal-box max-w-4xl max-h-11/12 p-4">
    <div class="flex items-center gap-2 mb-2">
      <svg class="size-6" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
        <path d="m183-51 79-338L-1-617l346-29 135-319 135 319 346 29-263 228 79 338-297-180L183-51Z"></path>
        <path d="m293-203.08 49.62-212.54-164.93-142.84 217.23-18.85L480-777.69l85.08 200.38 217.23 18.85-164.93 142.84L667-203.08 480-315.92 293-203.08Z"></path>
      </svg>
      <h3 class="font-bold text-lg">${__NAME} <span class="text-sm">v${__VERSION}</span></h3>
      <div class="ml-auto space-x-2">
        <button type="button" id="open-map-btn" class="btn btn-sm btn-accent btn-soft">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Map
        </button>
        <button type="button" id="import-favorites" class="btn btn-sm btn-primary btn-soft">Import</button>
        <button type="button" id="export-favorites" class="btn btn-sm btn-primary btn-soft">Export</button>
        <label for="favorite-modal" class="btn btn-sm btn-circle">✕</label>
      </div>
    </div>
    <div class="my-3">
        <input type="text" id="favorite-search" placeholder="Type to search..." class="input input-bordered w-full outline-none" />
    </div>
    
    <table class="fav-table-header table-fixed w-full" aria-hidden="false">
      <colgroup>
        <col style="width:30%">
        <col style="width:23.333%">
        <col style="width:23.333%">
        <col style="width:23.333%">
      </colgroup>
      <thead class="bg-base-300 font-bold">
        <tr>
          <th class="fav-th text-left">Title</th>
          <th class="fav-th text-left">Tile/Pixel</th>
          <th class="fav-th text-left">Coords</th>
          <th class="fav-th text-left">Actions</th>
        </tr>
      </thead>
    </table>

    <div class="fav-table-body-wrapper mt-0">
      <table id="favorite-table" class="fav-table-body table-fixed w-full" aria-hidden="false">
        <colgroup>
          <col style="width:30%">
          <col style="width:23.333%">
          <col style="width:23.333%">
          <col style="width:23.333%">
        </colgroup>
        <tbody id="favorite-table-body">

        </tbody>
      </table>
    </div>
    
    <p class="text-sm mt-3 text-center">By ${GM_info.script.author} - <a class="text-primary underline" href="https://github.com/olob0/wplace-refavorited-plus/issues/new/choose" target="_blank">report a bug</a> - <a class="text-primary underline" href="https://github.com/olob0/wplace-refavorited-plus" target="_blank">GitHub</a></p>
  </div>
</div>`;

    const observerMainDiv = new MutationObserver(async () => {
      const selector = document.querySelector("div#favorite-modal");

      if (!selector) {
        mainDiv.insertAdjacentHTML("beforeend", modalHTML);

        if (!modalHasInjected) {
          console.log("modal injected");
        } else {
          console.warn("modal re-injected");
        }

        lastTilesVersion = await getLatestTilesVersion();

        console.log("lastTilesVersion:", lastTilesVersion);

        await registerModalEvents();

        modalHasInjected = true;
      }
    });

    if (!mainDiv) {
      console.error("mainDiv not found");
      return;
    }

    console.log("observing changes to inject modal...");
    observerMainDiv.observe(mainDiv, {
      childList: true,
      subtree: false,
    });

    // fav button

    const pixelMenuSelector = await waitForElement('body div[class*="pinch"]');

    const observerPixelMenu = new MutationObserver(() => {
      const selector = pixelMenuSelector.querySelector(
        'div[class*="absolute"][class*="bottom-"] > div[class*="bg-base-"] div div[class*="hide-scrollbar"]:has(button[class*="btn-primary"])'
      );

      if (!selector) {
        return;
      }

      if (!document.getElementById("favplusbutton")) {
        const btn = document.createElement("button");
        btn.id = "favplusbutton";
        btn.className = "btn btn-primary btn-soft";
        btn.innerHTML = favPlusIcon;
        btn.onclick = onFavPlusButtonClick;

        selector.appendChild(btn);

        console.log("fav button injected and event registerd");

        updateFavPlusButtonState();
      }
    });

    if (!pixelMenuSelector) {
      console.error("pixelMenuSelector not found");
      return;
    }

    console.log("observing changes to inject fav button...");
    observerPixelMenu.observe(pixelMenuSelector, {
      childList: true,
      subtree: false,
    });

    // fav list button

    async function injectFavListButton() {
      observerInjectFavListButtonExecuted = false;

      const rightButtonsContainer = await waitForElement(
        'div[class*="top-"][class*="right-"]'
      );

      const observerButtonsDiv = new MutationObserver(async () => {
        observerInjectFavListButtonExecuted = true;

        const selector = await waitForElement(
          'div[class*="top-"][class*="right-"] div div:has(button[title])'
        );

        if (selector) {
          if (selector.querySelectorAll("button[title]").length < 3) {
            console.log(
              "< 3 buttons founded inside right buttons container. ignoring"
            );
            return;
          }

          if (!selector.querySelector("button#favorite-list")) {
            let element = document.createElement("button");
            selector.appendChild(element);

            element.outerHTML = `<button id="favorite-list" class="btn btn-square relative shadow-md" title="${__NAME} list" >${markerIcon}</button>`;

            if (!favButtonListHasInjected) {
              console.log("fav list button injected");
            } else {
              console.warn("fav list button re-injected");
            }

            document
              .querySelector("button#favorite-list")
              .addEventListener("click", () => {
                document
                  .querySelector("#favorite-modal")
                  .setAttribute("open", "true");
                filterAndRenderFavorites("");
              });

            console.log("fav list button event registred");
          }
        }
      });

      if (!rightButtonsContainer) {
        return;
      }

      observerButtonsDiv.observe(rightButtonsContainer, {
        childList: true,
        subtree: true,
      });
    }

    await injectFavListButton();

    // for some reason, sometimes observer don't trigger. For this cases, this is an very idiot fallback

    setTimeout(() => {
      if (!observerInjectFavListButtonExecuted) {
        console.warn(
          "injectFavListButtonCallback executed from timeout! Observer don't trigged"
        );
        injectFavListButton();
      }
    }, 5000);
  })();
})();
