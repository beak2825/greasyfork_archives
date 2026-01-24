// ==UserScript==
// @name         GoyWare v3
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  Bloxd tool & Utils
// @author       marcus
// @match        https://bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563819/GoyWare%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/563819/GoyWare%20v3.meta.js
// ==/UserScript==

/*
 * GoyWare V3 - Bloxd.io Utility Tool
 * 
 * Features:
 * - Killaura: Auto-attacks nearby players
 * - ESP: See players through walls
 * - Bhop: Automatic bunny hopping (anticheat bypass)
 * - CoordsList: Shows player coordinates
 * 
 * Usage:
 * - Click the ☰ button to toggle module list
 * - Click the ⚙ button to open settings
 * - Click on modules to toggle them
 * - Set keybinds in the settings panel
 * 
 * Also works as F12 console injection - just paste the code!
 */

(function() {
  'use strict';
  
  // Handle both userscript and console injection contexts
  let win = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
  
  // If already injected, don't run again
  if (win.goywareV2Loaded) {
    console.warn('[GoyWare V2] Already loaded!');
    return;
  }
  win.goywareV2Loaded = true;
  
  setTimeout((() => {
  /* ------------------------------------------------------------------ */
  /* 1. CONFIG                                                           */
  /* ------------------------------------------------------------------ */
  const config = {
    keyMap: {
    },
    killaura: {
      delay: 2,
      range: 7,
      jitter: 2,
    },
    bhop: {
      speed: 1.2,
      jumpDelay: 0,
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
 
  /* ---------- Bhop (Bunny Hop) - Anticheat Bypass ---------- */
  class Bhop extends Module {
    constructor() {
      super('Bhop');
      this.bhopInterval = null;
      this.moveState = null;
      this.movement = null;
      this.bunnyhopping = false;
      this.lastGroundTime = 0;
      this.jumpCooldown = 50; // ms between jumps to appear legit
    }
    
    getImpKey() {
      try {
        const entities = B.noa.entities;
        const target = util.values(entities)[2];
        if (typeof target === "object" && target !== null) {
          return Object.keys(target).find((k) => typeof target[k] === "object" && target[k]?.moveState);
        }
        return null;
      } catch (e) {
        return null;
      }
    }
    
    bhopTick() {
      try {
        const impKey = this.getImpKey();
        if (!impKey) return;
        
        this.moveState = B.noa.entities?.[impKey]?.moveState?.list?.[0];
        this.movement = B.noa.entities?.[impKey]?.movement?.list?.[0];
        if (!this.moveState) return;

        const touchScreen = B.noa.entities.getState(1, "receivesInputs")?.isTouchscreen ?? false;
        const noaValues = util.values(B.noa);
        const isAlive = noaValues[30]?.[1]?.[1]?._isAlive ?? true;
        
        if (!isAlive) {
          // Reset speed multiplier when dead
          if (this.moveState.speedMultiplier?.multipliers) {
            this.moveState.speedMultiplier.multipliers.bhop = 1;
          }
          return;
        }
        
        // Don't bhop while crouching, standing still, or flying
        if (this.moveState.crouching || this.moveState.speed < 0.05 || this.movement?._flying) {
          if (this.bunnyhopping) {
            if (touchScreen) {
              this.moveState.jumping = false;
            } else {
              if (B.noa?.inputs?.state) {
                B.noa.inputs.state.jump = false;
              }
            }
            this.bunnyhopping = false;
          }
          return;
        }
        
        if (!this.bunnyhopping) this.bunnyhopping = true;

        const isOnGround = this.movement?.isOnGround?.() ?? false;
        const now = performance.now();

        if (isOnGround) {
          // Add small random delay to appear more human-like
          const timeSinceGround = now - this.lastGroundTime;
          if (timeSinceGround >= this.jumpCooldown + Math.random() * 20) {
            if (touchScreen) {
              this.moveState.jumping = true;
            } else {
              if (B.noa?.inputs?.state) {
                B.noa.inputs.state.jump = true;
              }
            }
            this.lastGroundTime = now;
          }
        } else {
          // Release jump when in air
          if (touchScreen) {
            this.moveState.jumping = false;
          } else {
            if (B.noa?.inputs?.state) {
              B.noa.inputs.state.jump = false;
            }
          }
        }
      } catch (e) {
        // Silently fail
      }
    }
    
    onEnable() {
      this.bhopInterval = setInterval(() => this.bhopTick(), 5);
    }
    
    onDisable() {
      if (this.bhopInterval) {
        clearInterval(this.bhopInterval);
        this.bhopInterval = null;
      }
      if (B.noa?.inputs?.state) {
        B.noa.inputs.state.jump = false;
      }
      this.bunnyhopping = false;
    }
  }
 
  /* ------------------------------------------------------------------ */
  /* 8. MODULE COLLECTION                                                */
  /* ------------------------------------------------------------------ */
  const modules = [new Killaura(), new CoordsList(), new ESP(), new Bhop()];
 
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
      transition: box-shadow 0.3s ease,
                  border-color 0.3s ease;
  }
  
  .modern-ui-panel:hover {
      box-shadow: 0 12px 40px rgba(0,0,0,0.5);
      border-color: rgba(255,255,255,0.15);
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
      transition: background 0.2s ease;
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
      transition: background 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                  transform 0.15s ease,
                  padding-left 0.2s ease;
      position: relative;
  }
  .mod-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--accent);
      transform: scaleY(0);
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .mod-item:hover {
      background: rgba(255,255,255,0.08);
      transform: translateX(3px);
      padding-left: 18px;
  }
  .mod-item:hover::before {
      transform: scaleY(1);
  }
  .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      box-shadow: 0 0 8px currentColor;
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                  box-shadow 0.2s ease;
  }
  .mod-item:hover .status-dot {
      transform: scale(1.2);
      box-shadow: 0 0 12px currentColor;
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
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  input:hover {
      border-color: rgba(255,255,255,0.2);
      background: rgba(0,0,0,0.4);
  }
  input:focus {
      border-color: var(--accent);
      background: rgba(0,0,0,0.5);
      box-shadow: 0 0 0 2px rgba(114, 137, 218, 0.2);
      transform: scale(1.02);
  }
  
  /* Keybind inputs - more clickable */
  input[data-mod] {
      cursor: pointer;
      text-align: center;
      font-weight: 500;
  }
  input[data-mod]:hover {
      border-color: var(--accent);
      background: rgba(114, 137, 218, 0.1);
  }
  input[data-mod]::placeholder {
      color: rgba(255,255,255,0.4);
      font-style: italic;
  }

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
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  .icon-btn:hover {
      transform: scale(1.1) translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
      border-color: rgba(255,255,255,0.2);
      background: rgba(15, 15, 15, 0.95);
  }
  .icon-btn:active {
      transform: scale(0.95) translateY(0);
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  #toggle-list-btn { top: 10px; left: 15px; }
  #toggle-settings-btn { top: 10px; right: 15px; }
 
  hr {
      border: 0;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin: 10px 0;
      transition: border-color 0.3s ease, margin 0.3s ease;
  }
  
  /* Smooth transitions for all interactive elements */
  * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
  }
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
    
    // Show all modules, not just ones with existing keybinds
    modules.forEach((module) => {
      const modName = module.name;
      // Find existing keybind for this module
      let existingKey = null;
      for (const code in config.keyMap) {
        if (config.keyMap[code] === modName) {
          existingKey = code;
          break;
        }
      }
      
      const row = document.createElement('div');
      row.className = 'input-row';
      row.innerHTML = `
          <span>${modName}</span>
          <input type="text" data-mod="${modName}" placeholder="Press key..." value="${existingKey || ''}">
      `;
      kb.appendChild(row);
    });

    kb.querySelectorAll('input').forEach((inp) => {
      // Add click listener to capture key press
      inp.addEventListener('click', function() {
        this.value = '';
        this.placeholder = 'Press any key...';
        const self = this;
        const keyListener = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const keyCode = e.code;
          const modName = self.dataset.mod;
          
          // Remove old keybind for this module
          for (const c in config.keyMap) {
            if (config.keyMap[c] === modName) delete config.keyMap[c];
          }
          
          // Remove old keybind if key was bound to another module
          if (config.keyMap[keyCode]) {
            delete config.keyMap[keyCode];
          }
          
          // Set new keybind
          if (keyCode && keyCode !== 'Escape') {
            config.keyMap[keyCode] = modName;
            self.value = keyCode;
            self.placeholder = 'Press key...';
          } else {
            self.value = '';
            self.placeholder = 'Press key...';
          }
          
          win.removeEventListener('keydown', keyListener, true);
        };
        win.addEventListener('keydown', keyListener, true);
      });
      
      // Also allow manual text input
      inp.onchange = (e) => {
        const modName = e.target.dataset.mod;
        const newCode = e.target.value.trim();
        
        if (!newCode) {
          // Remove keybind if input is empty
          for (const c in config.keyMap) {
            if (config.keyMap[c] === modName) delete config.keyMap[c];
          }
          return;
        }
        
        // Remove old keybind for this module
        for (const c in config.keyMap) {
          if (config.keyMap[c] === modName) delete config.keyMap[c];
        }
        
        // Remove old keybind if key was bound to another module
        if (config.keyMap[newCode]) {
          delete config.keyMap[newCode];
        }
        
        // Set new keybind
        config.keyMap[newCode] = modName;
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
  
  console.log('[GoyWare V2] Loaded successfully!');
})();

