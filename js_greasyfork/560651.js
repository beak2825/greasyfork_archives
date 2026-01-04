// ==UserScript==
// @name  GoyWare V2
// @match *://unblockedbloxd.us/*
// @match *://bloxdunblocked.com/*
// @match *://bloxdunblocked.space/*
// @match *://bloxdunblocked.org/*
// @match *://bloxdunblocked.work/*
// @match *://unbloxd.com/*
// @match *://unbloxd.site/*
// @match *://bloxd.com/*
// @match *://bloxd.dev/*
// @match *://bloxed.space/*
// @match *://bloxed.net/*
// @match *://bloxdio.space/*
// @match *://bloxdk12.com/*
// @match *://playbloxd.com/*
// @match *://bedwars.space/*
// @match *://bedwarsonline.net/*
// @match *://buildhub.work/*
// @match *://buildhub.club/*
// @match *://skillhub.vip/*
// @match *://classcraft.space/*
// @match *://classcraft.site/*
// @match *://collabspace.space/*
// @match *://creativebuilding.site/*
// @match *://creativebuilding.space/*
// @match *://buildminecreate.com/*
// @match *://iogamesunblocked.com/*
// @match *://unblockedgames.club/*
// @match *://math.wales/*
// @match *://math.cmyru/*
// @match *://math.icu/*
// @match *://geometry.com.de/*
// @match *://geometry.quest/*
// @match *://geometries.top/*
// @match *://trigonometry.website/*
// @match *://geology.top/*
// @match *://archeology.top/*
// @match *://doodlecube.io/*
// @match *://eviltower.io/*
// @match *://bloxdhop.io/*
// @match *://bloxd.io/*
// @grant unsafeWindow
// @license MIT
// @description Bloxd Tool
// @run-at       document-end
// @version 0.0.1.20251230132204
// @namespace https://greasyfork.org/users/1553832
// @downloadURL https://update.greasyfork.org/scripts/560651/GoyWare%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/560651/GoyWare%20V2.meta.js
// ==/UserScript==

// permission granted by all authors to post

let win = unsafeWindow ? unsafeWindow: window

setTimeout((() => {
  /* ------------------------------------------------------------------ */
  /* 1. CONFIG                                                           */
  /* ------------------------------------------------------------------ */
  const config = {
    keyMap: {
      KeyR: 'Killaura',
      KeyH: 'ESP',
      KeyL: 'CoordsList',
    },
    killaura: {
      delay: 2,
      range: 7,
      jitter: 2,
    },
  };

  /* ------------------------------------------------------------------ */
  /* 2. UTILS                                                            */
  /* ------------------------------------------------------------------ */
  const util = {
    keys(o) {
      return Object.keys(o ?? {});
    },
    values(o) {
      return this.keys(o).map((k) => o[k]);
    },
    assign(t, ...s) {
      return Object.assign(t, ...s);
    },
  };

  /* ------------------------------------------------------------------ */
  /* 3. WEBPACK / NOA HOOK                                               */
  /* ------------------------------------------------------------------ */
  const B = {
    wpRequire: null,
    _cachedNoa: null,
    get noa() {
      return (
        this?._cachedNoa ||
          (this._cachedNoa = util
            .values(this.bloxdProps)
            .find((e) => e?.entities)),
        this._cachedNoa
      );
    },
    init() {
      let e = Object.getOwnPropertyDescriptors(win),
        t = Object.keys(e).find((t2) => e[t2]?.set?.toString().includes('++'));
      let n = (win[t] = win[t]);
      let i = Math.floor(9999999 * Math.random() + 1);
      n.push([[i], {}, (e2) => (this.wpRequire = e2)]);
      this.bloxdProps = util
        .values(this.findModule('nonBlocksClient:'))
        .find((e2) => 'object' == typeof e2);
    },
    findModule(e) {
      let t = this.wpRequire.m;
      for (let n in t) {
        let o = t[n];
        if (o && o.toString().includes(e)) return this.wpRequire(n);
      }
      return null;
    },
  };
  B.init();

  /* ------------------------------------------------------------------ */
  /* 4. GAME WRAPPER                                                     */
  /* ------------------------------------------------------------------ */
  const game = {
    getPosition(id) {
      return B.noa.entities.getState(id, "position").position;
    },
    getMoveState(id) {
      return util.values(B.noa.entities)[36](id);
    },
    get registry() {
      return util.values(B.noa)[17];
    },
    get getSolidity() {
      return util.values(this.registry)[5];
    },
    get getBlockID() {
      return B.noa.bloxd[
        Object.getOwnPropertyNames(B.noa.bloxd.constructor.prototype)[3]
      ].bind(B.noa.bloxd);
    },
    get getHeldItem() {
      return util.values(B.noa.entities).find((n) => {
        return (
          'function' == typeof n &&
          1 === n.length &&
          (n = n.toString()).includes(').') &&
          n.toString().length < 30 &&
          !n.includes(').op')
        );
      }); // for the skids here
    },
    safeHeld(id) {
      try {
        return this.getHeldItem(id);
      } catch {
        return null;
      }
    },
    get playerList() {
      return Object.values(B.noa.bloxd.getPlayerIds())
        .filter((p) => p !== 1 && this.safeHeld(p))
        .map(Number);
    },
    get doAttack() {
      const h = this.safeHeld(1);
      return (h?.doAttack || h.breakingItem.doAttack).bind(h);
    },
    touchingWall() {
      const p = this.getPosition(1),
        r = 0.35;
      const off = [
        [0, 0, 0],
        [r, 0, 0],
        [-r, 0, 0],
        [0, 0, r],
        [0, 0, -r],
        [r, 0, r],
        [r, 0, -r],
        [-r, 0, r],
        [-r, 0, -r],
      ];
      for (const [ox, oy, oz] of off)
        for (const y of [0, 1, 2]) {
          const id = this.getBlockID(
            Math.floor(p[0] + ox),
            Math.floor(p[1] + oy + y),
            Math.floor(p[2] + oz)
          );
          if (this.getSolidity(id)) return true;
        }
      return false;
    },
    get rendering() {
      return util.values(B.noa)[12];
    },
  };

  /* ------------------------------------------------------------------ */
  /* 5. MATH                                                             */
  /* ------------------------------------------------------------------ */
  const math = {
    norm(v) {
      const s = v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
      if (s) {
        const i = 1 / Math.sqrt(s);
        return [v[0] * i, v[1] * i, v[2] * i];
      }
      return v;
    },
    dist(a, b) {
      const dx = b[0] - a[0],
        dy = b[1] - a[1],
        dz = b[2] - a[2];
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    },
    randInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive
    },
  };

  /* ------------------------------------------------------------------ */
  /* 6. MODULE BASE                                                      */
  /* ------------------------------------------------------------------ */
  class Module {
    constructor(name) {
      this.name = name;
      this.enabled = false;
    }
    onEnable() {}
    onDisable() {}
    onRender() {}
    toggle() {
      this.enabled ? this.disable() : this.enable();
    }
    enable() {
      this.enabled = true;
      this.onEnable();
    }
    disable() {
      this.enabled = false;
      this.onDisable();
    }
  }

  /* ------------------------------------------------------------------ */
  /* 7. MODULES                                                          */
  /* ------------------------------------------------------------------ */
  class Killaura extends Module {
    constructor() {
      super('Killaura');
      this.nextTime = 0;
      this.currentTarget = null;
      this.graceUntil = 0;
    }

    onRender() {
      const now = performance.now();
      const me = game.getPosition(1);

      // pick nearest visible player each frame
      let best = null,
        bestDist = Infinity;
      game.playerList.forEach((pid) => {
        const pos = game.getPosition(pid);
        if (!pos) return;
        const dist = math.dist(me, pos);
        if (dist <= config.killaura.range && dist < bestDist) {
          best = {
            pid,
            pos,
          };
          bestDist = dist;
        }
      });
      this.currentTarget = best;

      if (!best) return;
      const dir = math.norm([
        best.pos[0] - me[0],
        best.pos[1] - me[1],
        best.pos[2] - me[2],
      ]);
      if (now >= this.nextTime) {
        game.safeHeld(1)?.trySwingBlock?.();
        game.getMoveState(1)?.setArmsAreSwinging?.();
        game.doAttack(dir, String(best.pid), 'HeadMesh');
        this.nextTime =
          now + config.killaura.delay + math.randInt(0, config.killaura.jitter);
      }
    }
  }

  /* ---------- helper: username ---------- */
  function getUsername(pid) {
    return B.noa.bloxd.entityNames[pid].entityName;
  }

  /* ---------- CoordsList (now with names) ---------- */
  class CoordsList extends Module {
    constructor() {
      super('CoordsList');
      this.box = document.createElement('div');
      util.assign(this.box.style, {
        position: 'fixed',
        top: '10px',
        left: '150px',
        background: 'rgba(0,0,0,.6)',
        color: '#fff',
        padding: '6px 8px',
        borderRadius: '4px',
        font: '12px monospace',
        whiteSpace: 'pre',
        zIndex: 999998,
        display: 'none',
      });
      document.body.appendChild(this.box);
    }
    onEnable() {
      this.box.style.display = 'block';
    }
    onDisable() {
      this.box.style.display = 'none';
    }
    onRender() {
      const lines = game.playerList.flatMap((pid) => {
        const pos = game.getPosition(pid);
        if (!pos) return [];
        const [x, y, z] = pos.map((n) => n.toFixed(1));
        return `${getUsername(pid)} : (${x},${y},${z})`;
      });
      this.box.textContent = lines.join('\n');
    }
  }

  /* ---------- ESP (works through walls) ---------- */
  class ESP extends Module {
    constructor() {
      super('ESP');
    }

    apply(enable) {
      const thinMeshes = Object.values(game.rendering).find(
        (value) => value?.thinMeshes
      )?.thinMeshes;

      if (!Array.isArray(thinMeshes)) {
        return;
      }
      const renderingGroupId = 2;
      for (const item of thinMeshes) {
        if (
          item?.meshVariations?.__DEFAULT__?.mesh &&
          typeof item?.meshVariations?.__DEFAULT__?.mesh.renderingGroupId ===
            'number'
        ) {
          item.meshVariations.__DEFAULT__.mesh.renderingGroupId =
            renderingGroupId;
        }
      }
    }
    onEnable() {
      this.apply(true);
    }
    onDisable() {
      this.apply(false);
    }
    onRender() {
      if (this.enabled) this.apply(true);
    } // handle newly-spawned players
  }

  /* ------------------------------------------------------------------ */
  /* 8. MODULE COLLECTION                                                */
  /* ------------------------------------------------------------------ */
  const modules = [new Killaura(), new CoordsList(), new ESP()];

  /* ------------------------------------------------------------------ */
  /* 9. STYLES (Modern Glassmorphism & Typography)                      */
  /* ------------------------------------------------------------------ */
  const style = document.createElement('style');
  style.textContent = `
  :root {
      --bg-main: rgba(15, 15, 15, 0.85);
      --accent: #7289da;
      --success: #43b581;
      --danger: #f04747;
      --text: #ffffff;
      --font: 'Inter', 'Segoe UI', Roboto, sans-serif;
  }

  .modern-ui-panel {
      position: fixed;
      background: var(--bg-main);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      color: var(--text);
      font-family: var(--font);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      z-index: 999999;
      overflow: hidden;
      transition: all 0.2s ease-in-out;
  }

  .ui-header {
      background: rgba(255,255,255,0.05);
      padding: 10px 15px;
      font-weight: bold;
      font-size: 13px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
  }

  /* Module List */
  #mod-list { top: 60px; left: 15px; width: 180px; }
  .mod-item {
      padding: 8px 15px;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background 0.2s;
  }
  .mod-item:hover { background: rgba(255,255,255,0.05); }
  .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      box-shadow: 0 0 8px currentColor;
  }

  /* Settings Panel */
  #settings-panel { top: 60px; right: 15px; width: 260px; }
  .settings-content { padding: 15px; }
  
  .setting-group { margin-bottom: 15px; }
  .setting-label { font-size: 11px; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px; display: block; }
  
  .input-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .input-row span { font-size: 13px; }

  input[type="number"], input[type="text"] {
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.1);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      width: 65px;
      outline: none;
  }
  input:focus { border-color: var(--accent); }

  /* Circular Toggle Buttons */
  .icon-btn {
      position: fixed;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--bg-main);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      color: white;
      cursor: pointer;
      z-index: 1000000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      transition: transform 0.1s;
  }
  .icon-btn:active { transform: scale(0.9); }
  #toggle-list-btn { top: 10px; left: 15px; }
  #toggle-settings-btn { top: 10px; right: 15px; }

  hr { border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 10px 0; }
`;
  document.head.appendChild(style);

  /* ------------------------------------------------------------------ */
  /* 10. MODULE LIST                                                     */
  /* ------------------------------------------------------------------ */
  const listBox = document.createElement('div');
  listBox.id = 'mod-list';
  listBox.className = 'modern-ui-panel';
  document.body.appendChild(listBox);

  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'toggle-list-btn';
  toggleBtn.className = 'icon-btn';
  toggleBtn.innerHTML = '☰';
  document.body.appendChild(toggleBtn);

  toggleBtn.onclick = () => {
    listBox.style.display = listBox.style.display === 'none' ? 'block' : 'none';
  };

  function refreshList() {
    listBox.innerHTML = `<div class="ui-header">
      GoyWare
           <span style="opacity:0.5; font-size:10px;">v12.29.25</span>
                           </div>`;
    modules.forEach((m) => {
      const row = document.createElement('div');
      row.className = 'mod-item';
      row.innerHTML = `
          <span>${m.name}</span>
          <div class="status-dot" style="color: ${
            m.enabled ? 'var(--success)' : 'var(--danger)'
          }; background: currentColor;"></div>
      `;
      row.onclick = () => {
        m.toggle();
        refreshList();
      };
      listBox.appendChild(row);
    });
  }
  refreshList();

  const gear = document.createElement('button');
  gear.id = 'toggle-settings-btn';
  gear.className = 'icon-btn';
  gear.innerHTML = '⚙';
  document.body.appendChild(gear);

  const panel = document.createElement('div');
  panel.id = 'settings-panel';
  panel.className = 'modern-ui-panel';
  panel.style.display = 'none';
  panel.innerHTML = `
  <div class="ui-header">
      <span>Settings</span>
      <span style="opacity:0.5; font-size:10px;">v12.29.25</span>
  </div>
  <div class="settings-content">
      <label class="setting-label">Keybinds</label>
      <div id="kb-container"></div>
      <hr>
      <label class="setting-label">Killaura</label>
      <div class="input-row">
          <span>Delay (ms)</span>
          <input id="ka-d" type="number" value="${config.killaura.delay}">
      </div>
      <div class="input-row">
          <span>Range</span>
          <input id="ka-r" type="number" value="${config.killaura.range}">
      </div>
      <div class="input-row">
          <span>Jitter</span>
          <input id="ka-j" type="number" value="${config.killaura.jitter}">
      </div>
  </div>
`;
  document.body.appendChild(panel);

  gear.onclick = () => {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  };

  function drawKeyInputs() {
    const kb = panel.querySelector('#kb-container');
    kb.innerHTML = '';
    Object.keys(config.keyMap).forEach((code) => {
      const mod = config.keyMap[code];
      const row = document.createElement('div');
      row.className = 'input-row';
      row.innerHTML = `
          <span>${mod}</span>
          <input type="text" data-mod="${mod}" value="${code}">
      `;
      kb.appendChild(row);
    });

    kb.querySelectorAll('input').forEach((inp) => {
      inp.onchange = (e) => {
        const mod = e.target.dataset.mod;
        const newCode = e.target.value;
        for (const c in config.keyMap) {
          if (config.keyMap[c] === mod) delete config.keyMap[c];
        }
        config.keyMap[newCode] = mod;
      };
    });
  }

  drawKeyInputs();

  // Listeners
  panel.querySelector('#ka-d').onchange = (e) =>
    (config.killaura.delay = +e.target.value);
  panel.querySelector('#ka-r').onchange = (e) =>
    (config.killaura.range = +e.target.value);
  panel.querySelector('#ka-j').onchange = (e) =>
    (config.killaura.jitter = +e.target.value);

  /* ------------------------------------------------------------------ */
  /* 11. KEY LISTENER                                                    */
  /* ------------------------------------------------------------------ */
  win.addEventListener(
    'keydown',
    (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const modName = config.keyMap[e.code];
      if (!modName) return;
      e.preventDefault();
      const m = modules.find((x) => x.name === modName);
      m.toggle();
      refreshList();
    },
    true
  );

  /* ------------------------------------------------------------------ */
  /* 12. MAIN LOOP                                                       */
  /* ------------------------------------------------------------------ */
  (function loop() {
    modules.forEach((m) => m.enabled && m.onRender());
    requestAnimationFrame(loop);
  })();
}), 2000);
