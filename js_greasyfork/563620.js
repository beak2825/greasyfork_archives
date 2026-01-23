// ==UserScript==
// @name         Moomoo Radar
// @namespace    https://www.youtube.com/@x-RedDragonOficial
// @version      1.3
// @description  Real-time radar overlay for moomoo.io showing all players, distinguishing allies and enemies.
// @author       x-RedDragon
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @grant        none
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/423602/1005014/msgpack.js
// @license MIT License
// @downloadURL https://update.greasyfork.org/scripts/563620/Moomoo%20Radar.user.js
// @updateURL https://update.greasyfork.org/scripts/563620/Moomoo%20Radar.meta.js
// ==/UserScript==

/*
Created by x-RedDragonOficial
Give credit if used in other scripts.
*/

(function () {

  const entities = new Map();
  let myId = null;
  let radarLayer = null;

  function getRadarLayer() {
    if (radarLayer) return radarLayer;

    radarLayer = document.createElement("div");
    radarLayer.id = "radar-layer";

    const style = radarLayer.style;
    style.position = "fixed";
    style.left = "0";
    style.top = "0";
    style.width = "100%";
    style.height = "100%";
    style.pointerEvents = "none";

    let z = 50;
    const menu = document.getElementById("mainMenu");
    if (menu) {
      const zi = parseInt(getComputedStyle(menu).zIndex);
      if (!isNaN(zi)) z = zi - 1;
    }
    style.zIndex = z;

    document.body.appendChild(radarLayer);
    return radarLayer;
  }

  const NativeWebSocket = window.WebSocket;

  window.WebSocket = new Proxy(NativeWebSocket, {
    construct(target, args) {
      const ws = new target(...args);
      ws.binaryType = "arraybuffer";

      ws.addEventListener("message", e => {
        if (!(e.data instanceof ArrayBuffer)) return;

        const data = msgpack.decode(e.data);

        if (data[0] === "C") {
          myId = data[1][0];
        } else if (data[0] === "a") {
          entities.clear();
          const raw = data[1][0];

          for (let i = 0; i < raw.length; i += 13) {
            entities.set(raw[i], {
              x: raw[i + 1],
              y: raw[i + 2],
              team: raw[i + 7]
            });
          }
        }
      });

      return ws;
    }
  });

  function getMarker(id) {
    let el = document.getElementById("r-" + id);

    if (!el) {
      el = document.createElement("div");
      el.id = "r-" + id;

      const s = el.style;
      s.position = "fixed";
      s.width = "0";
      s.height = "0";
      s.borderStyle = "solid";
      s.borderWidth = "10px 0 10px 20px";
      s.zIndex = "1";

      getRadarLayer().appendChild(el);
    }

    return el;
  }

  function render() {
    requestAnimationFrame(render);

    if (!entities.has(myId)) return;

    const me = entities.get(myId);
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    for (const [id, ent] of entities) {
      if (id === myId) continue;

      const marker = getMarker(id);
      const st = marker.style;

      const angle = Math.atan2(ent.y - me.y, ent.x - me.x);
      const dist = Math.min(
        Math.hypot(ent.x - me.x, ent.y - me.y) / 600,
        1
      );

      st.display = "block";
      st.opacity = dist;
      st.transform = `rotate(${angle * 180 / Math.PI}deg)`;
      st.left = (cx + Math.cos(angle) * cy * dist) + "px";
      st.top = (cy + Math.sin(angle) * cy * dist) + "px";
      st.borderColor =
        ent.team === me.team
          ? "transparent transparent transparent #00ff00"
          : "transparent transparent transparent #ff0000";
    }

    document.querySelectorAll('[id^="r-"]').forEach(el => {
      const id = +el.id.slice(2);
      if (!entities.has(id)) el.remove();
    });
  }

  render();
})();
