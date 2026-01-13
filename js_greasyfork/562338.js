// ==UserScript==
// @name  Porn_client
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
// @downloadURL https://update.greasyfork.org/scripts/562338/Porn_client.user.js
// @updateURL https://update.greasyfork.org/scripts/562338/Porn_client.meta.js
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
      delay: 0.01,
      range: 9.9,
      jitter: 2,
    },
    ui: {
      modListPos: { x: 15, y: 60 },
      settingsPos: { x: 15, y: 60 },
      toggleListBtnPos: { x: 15, y: 10 },
      toggleSettingsBtnPos: { x: 15, y: 10 }
    }
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
        cursor: 'move',
      });
      document.body.appendChild(this.box);
      this.makeDraggable(this.box);
    }

    makeDraggable(element) {
      let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

      element.onmousedown = dragMouseDown;

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // ドラッグ用のハンドルは全体
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
      }

      function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
      }
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
  /* 9. STYLES (オレンジと黒のカラーテーマ)                             */
  /* ------------------------------------------------------------------ */
  const style = document.createElement('style');
  style.textContent = `
  :root {
      --bg-main: rgba(15, 15, 15, 0.95);
      --accent: #ff6b00;  /* オレンジ */
      --accent-dark: #cc5500;
      --accent-light: #ff8c3a;
      --success: #ff9100;  /* オレンジ系の成功色 */
      --danger: #ff3300;   /* 赤オレンジ */
      --text: #ffffff;
      --font: 'Inter', 'Segoe UI', Roboto, sans-serif;
  }

  .modern-ui-panel {
      position: fixed;
      background: linear-gradient(135deg, rgba(30, 15, 0, 0.9), rgba(15, 7, 0, 0.95));
      backdrop-filter: blur(12px) saturate(180%);
      -webkit-backdrop-filter: blur(12px) saturate(180%);
      color: var(--text);
      font-family: var(--font);
      border: 1px solid rgba(255, 107, 0, 0.3);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(255, 107, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      z-index: 999999;
      overflow: hidden;
      transition: all 0.2s ease-in-out;
      cursor: default;
      user-select: none;
  }

  .ui-header {
      background: linear-gradient(90deg, rgba(255, 107, 0, 0.2), rgba(255, 107, 0, 0.1));
      padding: 10px 15px;
      font-weight: bold;
      font-size: 13px;
      border-bottom: 1px solid rgba(255, 107, 0, 0.3);
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-shadow: 0 0 10px rgba(255, 107, 0, 0.5);
      cursor: move !important;
  }

  /* Module List */
  #mod-list {
      top: ${config.ui.modListPos.y}px;
      left: ${config.ui.modListPos.x}px;
      width: 180px;
  }
  .mod-item {
      padding: 8px 15px;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.2s;
      border-left: 3px solid transparent;
  }
  .mod-item:hover {
      background: rgba(255, 107, 0, 0.1);
      border-left: 3px solid var(--accent);
  }
  .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      box-shadow: 0 0 8px currentColor;
  }

  /* Settings Panel */
  #settings-panel {
      top: ${config.ui.settingsPos.y}px;
      right: ${config.ui.settingsPos.x}px;
      width: 260px;
  }
  .settings-content { padding: 15px; }

  .setting-group { margin-bottom: 15px; }
  .setting-label {
      font-size: 11px;
      text-transform: uppercase;
      color: var(--accent-light);
      margin-bottom: 8px;
      display: block;
      letter-spacing: 0.5px;
  }

  .input-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      padding: 5px 0;
  }
  .input-row span { font-size: 13px; }

  input[type="number"], input[type="text"] {
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 107, 0, 0.3);
      color: white;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12px;
      width: 65px;
      outline: none;
      transition: all 0.2s;
  }
  input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 8px rgba(255, 107, 0, 0.4);
  }

  /* Circular Toggle Buttons */
  .icon-btn {
      position: fixed;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(255, 107, 0, 0.9), rgba(204, 85, 0, 0.9));
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 107, 0, 0.5);
      color: white;
      cursor: pointer;
      z-index: 1000000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      transition: all 0.2s;
      box-shadow: 0 4px 15px rgba(255, 107, 0, 0.3);
      user-select: none;
  }
  .icon-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(255, 107, 0, 0.4);
  }
  .icon-btn:active {
      transform: scale(0.95);
  }
  #toggle-list-btn {
      top: ${config.ui.toggleListBtnPos.y}px;
      left: ${config.ui.toggleListBtnPos.x}px;
      background: linear-gradient(135deg, rgba(255, 107, 0, 0.9), rgba(204, 85, 0, 0.9));
  }
  #toggle-settings-btn {
      top: ${config.ui.toggleSettingsBtnPos.y}px;
      right: ${config.ui.toggleSettingsBtnPos.x}px;
      background: linear-gradient(135deg, rgba(255, 107, 0, 0.9), rgba(204, 85, 0, 0.9));
  }

  hr {
      border: 0;
      border-top: 1px solid rgba(255, 107, 0, 0.2);
      margin: 10px 0;
  }

  /* スライダースタイル */
  input[type="range"] {
      width: 100%;
      height: 5px;
      -webkit-appearance: none;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 5px;
      outline: none;
  }

  input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--accent);
      cursor: pointer;
      box-shadow: 0 0 10px rgba(255, 107, 0, 0.5);
  }

  /* スクロールバー */
  ::-webkit-scrollbar {
      width: 8px;
  }

  ::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
      background: var(--accent);
      border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
      background: var(--accent-light);
  }

  /* ドラッグ中スタイル */
  .dragging {
      opacity: 0.8;
      box-shadow: 0 10px 40px rgba(255, 107, 0, 0.5) !important;
  }
`;
  document.head.appendChild(style);

  /* ------------------------------------------------------------------ */
  /* 10. ドラッグ機能ユーティリティ                                      */
  /* ------------------------------------------------------------------ */
  function makeDraggable(element, isPanel = false) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      // 入力要素上でのドラッグを防ぐ
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      e = e || window.event;
      e.preventDefault();

      // パネルの場合はヘッダー部分のみドラッグ可能
      if (isPanel) {
        const header = element.querySelector('.ui-header');
        if (header && !header.contains(e.target) && e.target !== header) {
          return;
        }
      }

      element.classList.add('dragging');
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
      element.style.transition = 'none'; // ドラッグ中はアニメーションを無効化
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      // 新しい位置を計算
      let newTop = element.offsetTop - pos2;
      let newLeft = element.offsetLeft - pos1;

      // 画面外に出ないように制限
      const maxTop = window.innerHeight - element.offsetHeight;
      const maxLeft = window.innerWidth - element.offsetWidth;

      newTop = Math.max(10, Math.min(newTop, maxTop));
      newLeft = Math.max(10, Math.min(newLeft, maxLeft));

      // 位置を設定
      element.style.top = newTop + "px";

      // ボタンかパネルかで位置設定を変更
      if (element.id === 'toggle-list-btn' || element.id === 'toggle-settings-btn') {
        // ボタンの場合：left/rightを設定
        if (element.id === 'toggle-list-btn') {
          element.style.left = newLeft + "px";
          element.style.right = 'auto';
          config.ui.toggleListBtnPos = { x: newLeft, y: newTop };
        } else {
          element.style.right = (window.innerWidth - newLeft - element.offsetWidth) + "px";
          element.style.left = 'auto';
          config.ui.toggleSettingsBtnPos = { x: window.innerWidth - newLeft - element.offsetWidth, y: newTop };
        }
      } else {
        // パネルの場合
        element.style.left = newLeft + "px";
        if (element.id === 'mod-list') {
          config.ui.modListPos = { x: newLeft, y: newTop };
        } else if (element.id === 'settings-panel') {
          config.ui.settingsPos = { x: window.innerWidth - newLeft - element.offsetWidth, y: newTop };
        }
      }
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
      element.classList.remove('dragging');
      element.style.transition = 'all 0.2s ease-in-out'; // アニメーションを復活
    }
  }

  /* ------------------------------------------------------------------ */
  /* 11. MODULE LIST                                                     */
  /* ------------------------------------------------------------------ */
  const listBox = document.createElement('div');
  listBox.id = 'mod-list';
  listBox.className = 'modern-ui-panel';
  listBox.style.top = `${config.ui.modListPos.y}px`;
  listBox.style.left = `${config.ui.modListPos.x}px`;
  document.body.appendChild(listBox);

  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'toggle-list-btn';
  toggleBtn.className = 'icon-btn';
  toggleBtn.innerHTML = '☰';
  toggleBtn.style.top = `${config.ui.toggleListBtnPos.y}px`;
  toggleBtn.style.left = `${config.ui.toggleListBtnPos.x}px`;
  document.body.appendChild(toggleBtn);

  // トグルボタンをドラッグ可能にする
  makeDraggable(toggleBtn);

  toggleBtn.onclick = (e) => {
    // ドラッグ操作でない場合のみトグル
    if (!e.target.classList.contains('dragging')) {
      listBox.style.display = listBox.style.display === 'none' ? 'block' : 'none';
    }
  };

  function refreshList() {
    listBox.innerHTML = `<div class="ui-header">
      Porn_client
      <span style="color:var(--accent-light); font-size:10px;">v1.0.0</span>
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

    // ドラッグ機能を再設定
    makeDraggable(listBox, true);
  }
  refreshList();

  const gear = document.createElement('button');
  gear.id = 'toggle-settings-btn';
  gear.className = 'icon-btn';
  gear.innerHTML = '⚙';
  gear.style.top = `${config.ui.toggleSettingsBtnPos.y}px`;
  gear.style.right = `${config.ui.toggleSettingsBtnPos.x}px`;
  document.body.appendChild(gear);

  // 設定ボタンをドラッグ可能にする
  makeDraggable(gear);

  gear.onclick = (e) => {
    // ドラッグ操作でない場合のみトグル
    if (!e.target.classList.contains('dragging')) {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      if (panel.style.display === 'block') {
        drawKeyInputs();
      }
    }
  };

  const panel = document.createElement('div');
  panel.id = 'settings-panel';
  panel.className = 'modern-ui-panel';
  panel.style.display = 'none';
  panel.style.top = `${config.ui.settingsPos.y}px`;
  panel.style.right = `${config.ui.settingsPos.x}px`;
  document.body.appendChild(panel);

  function drawKeyInputs() {
    const kb = panel.querySelector('#kb-container');
    if (!kb) return;

    kb.innerHTML = '';
    Object.keys(config.keyMap).forEach((code) => {
      const mod = config.keyMap[code];
      const row = document.createElement('div');
      row.className = 'input-row';
      row.innerHTML = `
          <span>${mod}</span>
          <input type="text" data-mod="${mod}" value="${code}" style="width: 80px;">
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

  // 設定パネルのコンテンツ
  panel.innerHTML = `
  <div class="ui-header">
      <span>Settings</span>
      <span style="color:var(--accent-light); font-size:10px;">v1.0.0</span>
  </div>
  <div class="settings-content">
      <label class="setting-label">Keybinds</label>
      <div id="kb-container"></div>
      <hr>
      <label class="setting-label">Killaura</label>
      <div class="input-row">
          <span>Delay (ms)</span>
          <input id="ka-d" type="number" value="${config.killaura.delay}" step="0.01" min="0.01" max="100">
      </div>
      <div class="input-row">
          <span>Range</span>
          <input id="ka-r" type="number" value="${config.killaura.range}" step="0.1" min="1" max="20">
      </div>
      <div class="input-row">
          <span>Jitter</span>
          <input id="ka-j" type="number" value="${config.killaura.jitter}" step="0.1" min="0" max="10">
      </div>
  </div>
`;

  // 設定パネルをドラッグ可能にする
  makeDraggable(panel, true);

  // Listeners
  panel.querySelector('#ka-d').onchange = (e) =>
    (config.killaura.delay = +e.target.value);
  panel.querySelector('#ka-r').onchange = (e) =>
    (config.killaura.range = +e.target.value);
  panel.querySelector('#ka-j').onchange = (e) =>
    (config.killaura.jitter = +e.target.value);

  /* ------------------------------------------------------------------ */
  /* 12. KEY LISTENER                                                    */
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
  /* 13. ウィンドウリサイズ時の位置調整                                 */
  /* ------------------------------------------------------------------ */
  window.addEventListener('resize', () => {
    // ボタンの位置を調整
    const buttons = ['toggle-list-btn', 'toggle-settings-btn'];
    buttons.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const maxX = window.innerWidth - btn.offsetWidth;
        const maxY = window.innerHeight - btn.offsetHeight;

        let newX = rect.left;
        let newY = rect.top;

        if (newX > maxX) newX = maxX;
        if (newY > maxY) newY = maxY;

        if (newX < 10) newX = 10;
        if (newY < 10) newY = 10;

        btn.style.top = newY + 'px';
        if (id === 'toggle-list-btn') {
          btn.style.left = newX + 'px';
          config.ui.toggleListBtnPos = { x: newX, y: newY };
        } else {
          btn.style.right = (window.innerWidth - newX - btn.offsetWidth) + 'px';
          config.ui.toggleSettingsBtnPos = { x: window.innerWidth - newX - btn.offsetWidth, y: newY };
        }
      }
    });

    // パネルの位置を調整
    const panels = ['mod-list', 'settings-panel'];
    panels.forEach(id => {
      const panel = document.getElementById(id);
      if (panel && panel.style.display !== 'none') {
        const rect = panel.getBoundingClientRect();
        const maxX = window.innerWidth - panel.offsetWidth;
        const maxY = window.innerHeight - panel.offsetHeight;

        let newX = rect.left;
        let newY = rect.top;

        if (newX > maxX) newX = maxX;
        if (newY > maxY) newY = maxY;

        if (newX < 10) newX = 10;
        if (newY < 10) newY = 10;

        panel.style.top = newY + 'px';
        panel.style.left = newX + 'px';

        if (id === 'mod-list') {
          config.ui.modListPos = { x: newX, y: newY };
        } else {
          config.ui.settingsPos = { x: window.innerWidth - newX - panel.offsetWidth, y: newY };
        }
      }
    });
  });

  /* ------------------------------------------------------------------ */
  /* 14. MAIN LOOP                                                       */
  /* ------------------------------------------------------------------ */
  (function loop() {
    modules.forEach((m) => m.enabled && m.onRender());
    requestAnimationFrame(loop);
  })();
}), 2000);