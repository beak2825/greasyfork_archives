// ==UserScript==
// @name        Wplace Dark Mode
// @namespace   awoone.scripts
// @match       https://wplace.live/*
// @grant       none
// @version     1.2.0
// @author      awo
// @description Dark mode do mapa sem sobrescrever window.fetch (não conflita com outros scripts).
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/548315/Wplace%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/548315/Wplace%20Dark%20Mode.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const MAP_STYLE_URL = "https://maps.wplace.live/styles/liberty";
  const MODE_KEY = "wplace-darkmode-mode";

  const storage = {
    get: (key, def = null) => {
      try {
        return localStorage.getItem(key) ?? def;
      } catch {
        return def;
      }
    },
    set: (key, val) => {
      try {
        localStorage.setItem(key, val);
      } catch {}
    },
  };

  const getMode = () => storage.get(MODE_KEY, "dark");
  const isDark = () => getMode() === "dark";

  function applyThemeVars() {
    const dark = isDark();
    const id = "wplace-dm-rootvars";
    let style = document.getElementById(id);

    if (!style) {
      style = document.createElement("style");
      style.id = id;
      document.head.appendChild(style);
    }

    style.textContent = dark
      ? `
        :root {
          --color-base-100: #1b1e24;
          --color-base-200: #262b36;
          --color-base-300: #151922;
          --color-base-content: #f5f6f9;
          --noise: 0;
        }
        #color-0 { background-color: white !important; }
      `
      : `
        :root {
          --color-base-100: #ffffff;
          --color-base-200: #f0f0f0;
          --color-base-300: #e0e0e0;
          --color-base-content: #000000;
          --noise: 0;
        }
      `;
  }

  const originalFetch = window.fetch;
  window.fetch = async (req, options) => {
    const res = await originalFetch(req, options);
    if (!isDark() || res.url !== MAP_STYLE_URL) return res;

    try {
      const json = await res.json();
      const patched = applyLibertyDarkTheme(json);
      return new Response(JSON.stringify(patched), {
        headers: res.headers,
        status: res.status,
        statusText: res.statusText,
      });
    } catch {
      return res;
    }
  };

  function applyLibertyDarkTheme(styleObj) {
    if (!styleObj?.layers) return styleObj;

    for (const layer of styleObj.layers) {
      const p = layer.paint || (layer.paint = {});
      switch (layer.id) {
        case "background":
          p["background-color"] = "#272e40";
          break;
        case "water":
          p["fill-color"] = "#000d2a";
          break;
        case "waterway_tunnel":
        case "waterway_river":
        case "waterway_other":
          p["line-color"] = "#000d2a";
          break;
        case "natural_earth":
          p["raster-brightness-max"] = 0.4;
          break;
        case "landcover_ice":
          p["fill-color"] = "#475677";
          break;
        case "landcover_sand":
          p["fill-color"] = "#775f47";
          break;
        case "park":
          layer.paint = { "fill-color": "#0e4957", "fill-opacity": 0.7 };
          break;
        case "park_outline":
          p["line-opacity"] = 0;
          break;
        case "landuse_pitch":
        case "landuse_track":
        case "landuse_school":
          p["fill-color"] = "#3e4966";
          break;
        case "landuse_cemetery":
          p["fill-color"] = "#3b3b57";
          break;
        case "landuse_hospital":
          p["fill-color"] = "#663e3e";
          break;
        case "building":
          p["fill-color"] = "#1c3b69";
          break;
        case "building_3d":
          p["fill-extrusion-color"] = "#1c3b69";
          break;
        case "waterway_line_label":
        case "water_name_point_label":
        case "water_name_line_label":
          p["text-color"] = "#8bb6f8";
          p["text-halo-color"] = "rgba(0,0,0,0.7)";
          break;
        case "tunnel_path_pedestrian":
        case "road_path_pedestrian":
        case "bridge_path_pedestrian":
          p["line-color"] = "#7c8493";
          break;
        case "bridge_path_pedestrian_casing":
          p["line-color"] = "#3b4d65";
          break;
        case "road_minor":
        case "tunnel_service_track":
        case "tunnel_minor":
        case "road_service_track":
        case "bridge_service_track":
        case "bridge_street":
          p["line-color"] = "#3b4d65";
          break;
        case "tunnel_link":
        case "tunnel_secondary_tertiary":
        case "tunnel_trunk_primary":
        case "tunnel_motorway":
          p["line-color"] = "#4a627e";
          break;
        case "label_other":
        case "label_state":
        case "poi_r20":
        case "poi_r7":
        case "poi_r1":
        case "highway_name_minor":
          p["text-color"] = "#91a0b5";
          p["text-halo-color"] = "rgba(0,0,0,0.7)";
          break;
        case "poi_transit":
        case "highway_name_path":
        case "highway_name_major":
          p["text-color"] = "#cde0fe";
          p["text-halo-color"] = "rgba(0,0,0,0.7)";
          break;
        case "label_village":
        case "label_town":
        case "label_city":
        case "label_city_capital":
        case "label_country_3":
        case "label_country_2":
        case "label_country_1":
          p["text-color"] = "#e4e5e9";
          p["text-halo-color"] = "rgba(0,0,0,0.7)";
          break;
        case "airport":
          p["text-color"] = "#92b7fe";
          p["text-halo-color"] = "rgba(0,0,0,0.7)";
          break;
        case "aeroway_fill":
          p["fill-color"] = "#2a486c";
          break;
        case "aeroway_runway":
          p["line-color"] = "#253d61";
          break;
        case "aeroway_taxiway":
          p["line-color"] = "#3d5b77";
          break;
        case "boundary_3":
          p["line-color"] = "#707784";
          break;
      }
    }

    return JSON.parse(
      JSON.stringify(styleObj)
        .replaceAll("#e9ac77", "#476889")
        .replaceAll("#fc8", "#476889")
        .replaceAll("#fea", "#3d5b77")
        .replaceAll("#cfcdca", "#3b4d65")
    );
  }

  function updateBtnIcon(btn, mode) {
    btn.innerHTML =
      mode === "dark"
        ? `<svg width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30.457 30.457" fill="currentColor" class="size-3.5"><path d="M29.693,14.49c-0.469-0.174-1-0.035-1.32,0.353c-1.795,2.189-4.443,3.446-7.27,3.446c-5.183,0-9.396-4.216-9.396-9.397c0-2.608,1.051-5.036,2.963-6.835c0.366-0.347,0.471-0.885,0.264-1.343c-0.207-0.456-0.682-0.736-1.184-0.684C5.91,0.791,0,7.311,0,15.194c0,8.402,6.836,15.238,15.238,15.238c8.303,0,14.989-6.506,15.219-14.812C30.471,15.118,30.164,14.664,29.693,14.49z"/></svg>`
        : `<svg width="24px" height="24px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 12.5H22M3 12.5H6M12.5 6V3M12.5 22V19M17.3891 7.61091L19.5104 5.48959M5.48959 19.5104L7.61091 17.3891M7.61091 7.61091L5.48959 5.48959M19.5104 19.5104L17.3891 17.3891M16 12.5C16 14.433 14.433 16 12.5 16C10.567 16 9 14.433 9 12.5C9 10.567 10.567 9 12.5 9C14.433 9 16 10.567 16 12.5Z" stroke="#121923" stroke-width="1.2"/></svg>`;
  }

  function injectBtn(container) {
    if (!container || container.querySelector("#darkmode-toggle-btn")) return;

    const btn = document.createElement("button");
    btn.title = "Dark/Light";
    btn.className = "btn btn-sm btn-circle";
    btn.id = "darkmode-toggle-btn";
    updateBtnIcon(btn, getMode());

    btn.addEventListener("click", () => {
      storage.set(MODE_KEY, isDark() ? "light" : "dark");
      location.reload();
    });

    const wrapper = document.createElement("div");
    wrapper.className = "indicator";
    wrapper.appendChild(btn);
    container.appendChild(wrapper);
  }

  function observeContainer() {
    const selector = ".absolute.left-2.top-2.flex-col";
    const container = document.querySelector(selector);
    if (container) injectBtn(container);

    new MutationObserver(() => {
      const target = document.querySelector(selector);
      if (target) injectBtn(target);
    }).observe(document.body, { childList: true, subtree: true });
  }

  applyThemeVars();
  document.addEventListener("DOMContentLoaded", observeContainer);
})();
