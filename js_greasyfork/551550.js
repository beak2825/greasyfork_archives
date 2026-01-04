// ==UserScript==
// @name         Drawaria Geometry Dash Drawer
// @namespace    drawaria.modded.gddrawer
// @version      1.0.0
// @description  A module to draw Geometry Dash icons and objects on the canvas using a pixel-to-line algorithm.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gdbrowser.com
// @require      https://kit.fontawesome.com/a7a0b82b9e.js
// @downloadURL https://update.greasyfork.org/scripts/551550/Drawaria%20Geometry%20Dash%20Drawer.user.js
// @updateURL https://update.greasyfork.org/scripts/551550/Drawaria%20Geometry%20Dash%20Drawer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Standalone Utilities and QBit Replacements ---

    // === 1. Notification System (replaces ModBase.notify) ===
    function notify(level, message, moduleName = "GD Drawer") {
        let color = "#6c757d"; // log
        if (level === "error") color = "#dc3545";
        else if (level === "warning") color = "#ffc107";
        else if (level === "info") color = "#17a2b8";
        else if (level === "success") color = "#28a745";

        console.log(`%c${moduleName}: ${message}`, `color: ${color}`);

        const loggingContainer = document.getElementById("chatbox_messages");
        if (loggingContainer) {
            const chatmessage = createElement("div", { className: `chatmessage systemchatmessage5`, style: `color: ${color};`, dataset: { ts: Date.now().toString() } }, [`${moduleName}: ${message}`]);
            loggingContainer.appendChild(chatmessage);
            loggingContainer.scrollTop = loggingContainer.scrollHeight;
        }
    }

    // === 2. domMake Replacements (for building UI) ===
    function createElement(tag, attrs = {}, children = []) {
        const el = document.createElement(tag);
        for (const attr in attrs) {
            if (attr === "className") {
                el.className = attrs[attr];
            } else if (attr === "style") {
                 el.style.cssText = attrs[attr];
            } else if (attr === "title") {
                el.setAttribute("title", attrs[attr]);
            } else if (attr === "checked") {
                el.checked = attrs[attr];
            } else if (attr === "dataset") {
                 for (const key in attrs.dataset) {
                    el.dataset[key] = attrs.dataset[key];
                 }
            } else {
                el.setAttribute(attr, attrs[attr]);
            }
        }
        children.forEach(child => {
            if (typeof child === "string") {
                el.innerHTML += child; // Use innerHTML for text with icons/HTML
            } else if (child) {
                el.appendChild(child);
            }
        });
        return el;
    }

    function createButton(content, className = "artfx-button", attrs = {}) {
        const btn = createElement("button", { className: className, ...attrs });
        if (typeof content === "string") {
            btn.innerHTML = content;
        } else {
            // Assumes content is already an element if not a string
            btn.appendChild(content);
        }
        return btn;
    }

    function createTree(tag, attrs, children) {
        return createElement(tag, attrs, children);
    }

    function createRow(attrs = {}, children = []) {
        const row = createElement("div", { className: "module-btn-group", ...attrs });
        children.forEach(child => {
            if (child) row.appendChild(child);
        });
        row.appendAll = (...elements) => elements.forEach(el => row.appendChild(el));
        return row;
    }


    // === 3. Socket Management (replaces globalThis.sockets and _getGameSocket) ===
    const activeSockets = [];
    if (window.WebSocket) {
        const originalWebSocketSend = WebSocket.prototype.send;
        WebSocket.prototype.send = function(...args) {
            if (this.url.includes("drawaria.online/socket.io") && activeSockets.indexOf(this) === -1) {
                activeSockets.push(this);
                this.addEventListener('close', () => {
                    const pos = activeSockets.indexOf(this);
                    if (~pos) activeSockets.splice(pos, 1);
                });
            }
            return originalWebSocketSend.apply(this, args);
        };
    }

    function getPrimarySocket(skipNotification = false) {
        const primarySocket = activeSockets.find(s => s.readyState === WebSocket.OPEN);
        if (!primarySocket) {
            if (!skipNotification) notify("warning", "No active WebSocket connections found.", "GD Drawer");
            return null;
        }
        return primarySocket;
    }

    // === 4. General Utilities ===
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));


    // --- Adapted GeometryDashCubeOnlineDrawer Class ---
    class GeometryDashCubeOnlineDrawerStandalone {
      _identifier = 'gddrawer';
      _containerId = `${this._identifier}-menu-container`;
      _contentId = `${this._identifier}-content`;

      _currentCategory = 'cubes';
      _currentIconId = 1;
      _canvasBrushImg = null;
      _currentRotation = 0;
      _ui = {};
      _mainCanvas = null;
      _canvasClickHandler = null;
      _canvasClickHandlerAttached = false;
      _isActive = false;
      _isDrawingIcon = false;


      _categories = {
        cubes: { prefix: 'cube_', maxId: 485, icon: 'fas fa-cube', name: 'Cubos' },
        ships: { prefix: 'ship_', maxId: 169, icon: 'fas fa-plane', name: 'Naves' },
        balls: { prefix: 'ball_', maxId: 118, icon: 'fas fa-circle', name: 'Bolas' },
        ufos: { prefix: 'ufo_', maxId: 149, icon: 'fas fa-space-shuttle', name: 'OVNIs' },
        waves: { prefix: 'wave_', maxId: 96, icon: 'fas fa-wave-square', name: 'Ondas' },
        robots: { prefix: 'robot_', maxId: 68, icon: 'fas fa-robot', name: 'Robots' },
        spiders: { prefix: 'spider_', maxId: 69, icon: 'fas fa-spider', name: 'Arañas' },
        swings: { prefix: 'swing_', maxId: 43, icon: 'fas fa-wind', name: 'Swings' },
        jetpacks: { prefix: 'jetpack_', maxId: 8, icon: 'fas fa-rocket', name: 'Jetpacks' },
        difficulties: { name: 'Dificultades', icon: 'fas fa-star' },
        extras: { name: 'Extras', icon: 'fas fa-plus' },
        gauntlets: { name: 'Guanteletes', icon: 'fas fa-dice' },
        editor_blocks: { name: 'Bloques Editor', icon: 'fas fa-th-large' }
      };

      _difficulties = {
        easy: 'easy.png', normal: 'normal.png', hard: 'hard.png', harder: 'harder.png',
        insane: 'insane.png', 'demon-easy': 'demon-easy.png', 'demon-medium': 'demon-medium.png',
        'demon-hard': 'demon-hard.png', 'demon-insane': 'demon-insane.png', 'demon-extreme': 'demon-extreme.png',
        unrated: 'unrated.png', auto: 'auto.png'
      };
      _difficultyModifiers = ['-featured', '-epic', '-legendary', '-mythic'];

      _extras = {
        like: 'like.png', star: 'star.png', moon: 'moon.png', coin: 'coin.png',
        silvercoin: 'silvercoin.png', download: 'download.png', youtube: 'youtube.png',
        time: 'time.png', orbs: 'orbs.png', refresh: 'refresh.png', magnify: 'magnify.png'
      };

      _gauntlets = {
        fire: 'fire.png', ice: 'ice.png', poison: 'poison.png', shadow: 'shadow.png',
        lava: 'lava.png', bonus: 'bonus.png', chaos: 'chaos.png', demon: 'demon.png',
        time: 'time.png', crystal: 'crystal.png', magic: 'magic.png', spike: 'spike.png',
        monster: 'monster.png', doom: 'doom.png', death: 'death.png', forest: 'forest.png',
        force: 'force.png', water: 'water.png', haunted: 'haunted.png', power: 'power.png',
        halloween: 'halloween.png', treasure: 'treasure.png', inferno: 'inferno.png', portal: 'portal.png',
        strange: 'strange.png', fantasy: 'fantasy.png', christmas: 'christmas.png', mystery: 'mystery.png',
        cursed: 'cursed.png', cyborg: 'cyborg.png', castle: 'castle.png', world: 'world.png',
        galaxy: 'galaxy.png', universe: 'universe.png', discord: 'discord.png', ncs_i: 'ncs_i.png',
        ncs_ii: 'ncs_ii.png', space: 'space.png', cosmos: 'cosmos.png'
      };


      _editorBlocks = {
        spike: 'https://static.wikia.nocookie.net/geometry-dash-level-editor/images/c/cc/Retouch_2024112913572713.png',
        block: 'https://raw.githubusercontent.com/GDColon/GDBrowser/refs/heads/master/assets/objects/blocks/classic.png',
        portal: 'https://static.wikia.nocookie.net/geometry-dash-fan-ideas/images/d/de/CubePortal.png'
      };


      _editorBlockDefaultOptimizations = {
        delayPerSegment: 100,
        delayPerRow: 200,
        qualityFactor: 3,
        targetSize: 40
      };

      constructor() {
        this._canvasClickHandler = this._handleCanvasClick.bind(this);
        this._createMenuStructure();
        this._onStartup();
      }

      _onStartup() {
        this._mainCanvas = document.getElementById("canvas");
        this._loadInterface();
        this._setupEventListeners();
        this._loadIconImage('cubes', 1);
        this._setModuleActive(false);
        notify("info", " 'GD Drawer' Loaded. Click the square icon to open.", "GD Drawer");
      }

      _createMenuStructure() {
          const menuContainer = createTree("div", {
              id: this._containerId,
              className: "gd-drawer-menu",
              style: `
                  position: fixed;
                  top: 10%;
                  left: 50px;
                  width: 300px;
                  display: none;
              `
          });

          const header = createTree("div", {
              className: "gd-drawer-menu-header",
              style: `
                  padding: 8px;
                  background-color: #007bff; /* Primary color fallback */
                  color: white;
                  cursor: grab;
                  border-top-left-radius: .25rem;
                  border-top-right-radius: .25rem;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
              `
          }, [createTree("span", {}, ["🔳 GD Cubes & Objects"]), createButton("X", "btn-close-menu")]);

          header.querySelector(".btn-close-menu").addEventListener("click", () => {
              menuContainer.style.display = "none";
              this._setModuleActive(false);
          });

          const content = createTree("div", {
              id: this._contentId,
              className: "gd-drawer-menu-content",
              style: `padding: 10px;`
          });

          menuContainer.append(header, content);
          document.body.appendChild(menuContainer);
          this._makeDraggable(menuContainer, header);

          this._ui.menuContainer = menuContainer;
          this._ui.section = content;
          this._ui.header = header;
      }

      _makeDraggable(element, handle = element) {
          let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

          const dragMouseDown = (e) => {
              e = e || window.event;
              e.preventDefault();
              pos3 = e.clientX;
              pos4 = e.clientY;
              document.onmouseup = closeDragElement;
              document.onmousemove = elementDrag;
          };

          const elementDrag = (e) => {
              e = e || window.event;
              e.preventDefault();
              pos1 = pos3 - e.clientX;
              pos2 = pos4 - e.clientY;
              pos3 = e.clientX;
              pos4 = e.clientY;
              element.style.top = (element.offsetTop - pos2) + "px";
              element.style.left = (element.offsetLeft - pos1) + "px";
          };

          const closeDragElement = () => {
              document.onmouseup = null;
              document.onmousemove = null;
          };

          handle.onmousedown = dragMouseDown;
      }


      _loadInterface() {
        const container = createTree("div", { id: `${this._identifier}-container`, className: "module-section" });
        this._ui.section.appendChild(container);

        // Toggle Button
        const moduleToggleGroup = createTree("div", { className: "module-btn-group", style: "margin-bottom:10px;" });
        this._ui.moduleToggleButton = createButton('<i class="fas fa-power-off"></i> Activar Módulo', 'module-toggle-button');
        this._ui.moduleToggleButton.addEventListener('click', () => this._toggleModuleActive());
        moduleToggleGroup.appendChild(this._ui.moduleToggleButton);
        container.appendChild(moduleToggleGroup);

        container.appendChild(createTree("div", { className: "module-section-title" }, ["GD Cubes & Objects Drawer"]));

        // Category Navigation
        const categoryNav = createTree("div", { className: "module-btn-group", style: "flex-wrap: wrap; margin-bottom: 15px;" });
        Object.keys(this._categories).forEach(catKey => {
            const catInfo = this._categories[catKey];
            const name = catInfo.name || catKey.charAt(0).toUpperCase() + catKey.slice(1).replace('_', ' ');
            const iconClass = catInfo.icon;
            const button = createButton(`<i class="${iconClass}"></i> ${name}`, 'artfx-button category-nav-button');
            button.addEventListener('click', () => this._changeCategory(catKey));
            categoryNav.appendChild(button);
            this._ui[`${catKey}NavButton`] = button;
        });
        container.appendChild(categoryNav);

        // Preview and General Nav
        const previewContainer = createTree("div", { style: "display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:10px;" });
        this._ui.previewCanvas = createTree("canvas", { id: `${this._identifier}-previewCanvas`, width: "96", height: "96", style: "border:1px solid var(--CE-color);background:#222;" });
        previewContainer.appendChild(this._ui.previewCanvas);
        container.appendChild(previewContainer);


        this._ui.commonControlsSection = createTree('div', { id: `${this._identifier}-common-controls` });
        this._ui.commonControlsSection.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:10px;">
                <button id="${this._identifier}-prevBtn" class="artfx-button special">←</button>
                <button id="${this._identifier}-nextBtn" class="artfx-button special">→</button>
            </div>
            <div id="${this._identifier}-info" style="text-align:center;margin-top:5px;font-size:0.9em;color:var(--info);"></div>
            <div class="module-btn-group" style="flex-wrap:wrap;margin-top:15px;">
                <input type="number" id="${this._identifier}-iconIdInput" min="1" value="1" placeholder="ID del Icono" class="module-form-control" style="flex:1 1 60%;">
                <button id="${this._identifier}-acceptIconBtn" class="artfx-button" style="flex:1 1 35%;">Aceptar ID</button>
                <button id="${this._identifier}-randomIconBtn" class="artfx-button special" style="width:100%;">Icono Random</button>
            </div>
        `;
        container.appendChild(this._ui.commonControlsSection);

        this._ui.prevBtn = this._ui.commonControlsSection.querySelector(`#${this._identifier}-prevBtn`);
        this._ui.nextBtn = this._ui.commonControlsSection.querySelector(`#${this._identifier}-nextBtn`);
        this._ui.info = this._ui.commonControlsSection.querySelector(`#${this._identifier}-info`);
        this._ui.iconIdInput = this._ui.commonControlsSection.querySelector(`#${this._identifier}-iconIdInput`);
        this._ui.acceptIconBtn = this._ui.commonControlsSection.querySelector(`#${this._identifier}-acceptIconBtn`);
        this._ui.randomIconBtn = this._ui.commonControlsSection.querySelector(`#${this._identifier}-randomIconBtn`);

        // Difficulties Section
        this._ui.difficultiesSection = createTree('div', { id: `${this._identifier}-difficulties-section`, style: "display:none;" });
        let diffButtonsHtml = Object.keys(this._difficulties).map(dKey => `<button class="artfx-button difficulty-button" data-diff="${dKey}">${dKey.charAt(0).toUpperCase() + dKey.slice(1).replace('-', ' ')}</button>`).join('');
        let modTogglesHtml = this._difficultyModifiers.map(mod => `
            <div style="display:flex;align-items:center;flex:1 1 48%;">
                <input type="checkbox" id="${this._identifier}-mod${mod.replace('-', '')}Toggle" class="difficulty-modifier-toggle" data-mod="${mod}" style="margin-right:5px; transform: scale(1.5);">
                <label for="${this._identifier}-mod${mod.replace('-', '')}Toggle" style="font-size:0.9em;color:var(--CE-color);">${mod.slice(1).charAt(0).toUpperCase() + mod.slice(2)}</label>
            </div>
        `).join('');
        this._ui.difficultiesSection.innerHTML = `
            <div class="module-section-title" style="margin-top:15px;">Dificultades</div>
            <div class="module-btn-group" style="flex-wrap:wrap;">${diffButtonsHtml}</div>
            <div class="module-section-title" style="margin-top:15px;">Modificadores</div>
            <div class="module-btn-group" style="flex-wrap:wrap; justify-content:space-between;">
                ${modTogglesHtml}
                <button id="${this._identifier}-clearModsBtn" class="artfx-button danger" style="width:100%;">Limpiar Modificadores</button>
            </div>
        `;
        container.appendChild(this._ui.difficultiesSection);
        this._ui.difficultyButtons = this._ui.difficultiesSection.querySelectorAll('.difficulty-button');
        this._ui.difficultyModToggles = this._ui.difficultiesSection.querySelectorAll('.difficulty-modifier-toggle');
        this._ui.clearModsBtn = this._ui.difficultiesSection.querySelector(`#${this._identifier}-clearModsBtn`);


        // Extras Section
        this._ui.extrasSection = createTree('div', { id: `${this._identifier}-extras-section`, style: "display:none;" });
        this._ui.extrasSection.innerHTML = `
            <div class="module-section-title" style="margin-top:15px;">Extras</div>
            <div class="module-btn-group" style="flex-wrap:wrap;">
                ${Object.keys(this._extras).map(eKey => `<button class="artfx-button extra-button" data-extra="${eKey}" style="flex:1 1 30%;">${eKey.charAt(0).toUpperCase() + eKey.slice(1)}</button>`).join('')}
            </div>
        `;
        container.appendChild(this._ui.extrasSection);
        this._ui.extraButtons = this._ui.extrasSection.querySelectorAll('.extra-button');


        // Gauntlets Section
        this._ui.gauntletsSection = createTree('div', { id: `${this._identifier}-gauntlets-section`, style: "display:none;" });
        this._ui.gauntletsSection.innerHTML = `
            <div class="module-section-title" style="margin-top:15px;">Guanteletes</div>
            <div class="module-btn-group" style="flex-wrap:wrap;">
                ${Object.keys(this._gauntlets).map(gKey => `<button class="artfx-button gauntlet-button" data-gauntlet="${gKey}" style="flex:1 1 30%;">${gKey.charAt(0).toUpperCase() + gKey.slice(1)}</button>`).join('')}
            </div>
        `;
        container.appendChild(this._ui.gauntletsSection);
        this._ui.gauntletButtons = this._ui.gauntletsSection.querySelectorAll('.gauntlet-button');


        // Editor Blocks Section
        this._ui.editorBlocksSection = createTree('div', { id: `${this._identifier}-editorblocks-section`, style: "display:none;" });
        this._ui.editorBlocksSection.innerHTML = `
            <div class="module-section-title" style="margin-top:15px;">Bloques del Editor</div>
            <div class="module-btn-group" style="flex-wrap:wrap;">
                ${Object.keys(this._editorBlocks).map(ebKey => `<button class="artfx-button editor-block-button" data-eblock="${ebKey}" style="flex:1 1 30%;">${ebKey.charAt(0).toUpperCase() + ebKey.slice(1)}</button>`).join('')}
            </div>
            <div class="module-btn-group" style="margin-top:10px;">
                <button id="${this._identifier}-rotateBlockBtn" class="artfx-button special" style="width:100%;"><i class="fas fa-sync-alt"></i> Rotar Objeto</button>
            </div>
        `;
        container.appendChild(this._ui.editorBlocksSection);
        this._ui.editorBlockButtons = this._ui.editorBlocksSection.querySelectorAll('.editor-block-button');
        this._ui.rotateBlockBtn = this._ui.editorBlocksSection.querySelector(`#${this._identifier}-rotateBlockBtn`);


        // Editor Block Optimization Section
        this._ui.editorBlockOptimizationSection = createTree('div', { id: `${this._identifier}-eb-opt-section`, style: "display:none;" });
        this._ui.editorBlockOptimizationSection.innerHTML = `
            <div class="module-section-title" style="margin-top:15px;">Optimización (Bloques Editor)</div>
            <div class="module-btn-group" style="flex-wrap:wrap; justify-content:space-between;">
                <div style="flex:1 1 48%;"><label for="${this._identifier}-ebDelayPerSegmentInput">Delay Seg. (ms):</label><input type="number" id="${this._identifier}-ebDelayPerSegmentInput" min="0" max="500" value="${this._editorBlockDefaultOptimizations.delayPerSegment}" title="Retraso por segmento de línea (ms)" class="module-form-control"></div>
                <div style="flex:1 1 48%;"><label for="${this._identifier}-ebDelayPerRowInput">Delay Fila (ms):</label><input type="number" id="${this._identifier}-ebDelayPerRowInput" min="0" max="1000" value="${this._editorBlockDefaultOptimizations.delayPerRow}" title="Retraso por fila de píxeles (ms)" class="module-form-control"></div>
                <div style="flex:1 1 48%;"><label for="${this._identifier}-ebQualityFactorInput">Calidad (1-10):</label><input type="number" id="${this._identifier}-ebQualityFactorInput" min="1" max="10" value="${this._editorBlockDefaultOptimizations.qualityFactor}" title="Factor de calidad (1=mejor, 10=peor, más rápido)" class="module-form-control"></div>
                <div style="flex:1 1 48%;"><label for="${this._identifier}-ebTargetSizeInput">Tamaño Obj. (px):</label><input type="number" id="${this._identifier}-ebTargetSizeInput" min="10" max="100" value="${this._editorBlockDefaultOptimizations.targetSize}" title="Tamaño objetivo del objeto en píxeles (en el canvas)" class="module-form-control"></div>
            </div>
        `;
        container.appendChild(this._ui.editorBlockOptimizationSection);

        this._ui.ebDelaySegmentInput = this._ui.editorBlockOptimizationSection.querySelector(`#${this._identifier}-ebDelayPerSegmentInput`);
        this._ui.ebDelayPerRowInput = this._ui.editorBlockOptimizationSection.querySelector(`#${this._identifier}-ebDelayPerRowInput`);
        this._ui.ebQualityFactorInput = this._ui.editorBlockOptimizationSection.querySelector(`#${this._identifier}-ebQualityFactorInput`);
        this._ui.ebTargetSizeInput = this._ui.editorBlockOptimizationSection.querySelector(`#${this._identifier}-ebTargetSizeInput`);


        // General Optimization Section
        container.appendChild(createTree("div", { class: "module-section-title", style: "margin-top:15px;" }, ["Optimización de Dibujo (General)"]));
        const optSettingsGrid = createTree("div", { class: "module-btn-group", style: "flex-wrap:wrap; justify-content:space-between;" });

        this._ui.delayPerSegmentInput = createTree("input", { type: "number", id: `${this._identifier}-delayPerSegmentInput`, min: "0", max: "50", value: "40", title: "Retraso por segmento de línea (ms)", class: "module-form-control" });
        this._ui.delayPerSegmentLabel = createTree("label", { for: `${this._identifier}-delayPerSegmentInput` }, ["Delay Seg. (ms):"]);
        optSettingsGrid.append(createTree("div", { style: "flex:1 1 48%;" }, [this._ui.delayPerSegmentLabel, this._ui.delayPerSegmentInput]));

        this._ui.delayPerRowInput = createTree("input", { type: "number", id: `${this._identifier}-delayPerRowInput`, min: "0", max: "200", value: "50", title: "Retraso por fila de píxeles (ms)", class: "module-form-control" });
        this._ui.delayPerRowLabel = createTree("label", { for: `${this._identifier}-delayPerRowInput` }, ["Delay Fila (ms):"]);
        optSettingsGrid.append(createTree("div", { style: "flex:1 1 48%;" }, [this._ui.delayPerRowLabel, this._ui.delayPerRowInput]));

        this._ui.qualityFactorInput = createTree("input", { type: "number", id: `${this._identifier}-qualityFactorInput`, min: "1", max: "5", value: "4", title: "Factor de calidad (1=mejor, 5=peor, más rápido)", class: "module-form-control" });
        this._ui.qualityFactorLabel = createTree("label", { for: `${this._identifier}-qualityFactorInput` }, ["Calidad (1-5):"]);
        optSettingsGrid.append(createTree("div", { style: "flex:1 1 48%;" }, [this._ui.qualityFactorLabel, this._ui.qualityFactorInput]));

        this._ui.autoClearBeforeDrawToggle = createTree("input", { type: "checkbox", id: `${this._identifier}-autoClearToggle`, checked: false, title: "Limpiar el canvas antes de dibujar cada cubo", style: "margin-right: 5px; transform: scale(1.5);" });
        this._ui.autoClearBeforeDrawLabel = createTree("label", { for: `${this._identifier}-autoClearToggle`, style: "flex-grow: 1; text-align: left;" }, ["Auto-Limpiar antes de dibujar"]);
        optSettingsGrid.append(createTree("div", { style: "flex:1 1 48%; display:flex; align-items:center; flex-direction:row;" }, [this._ui.autoClearBeforeDrawToggle, this._ui.autoClearBeforeDrawLabel]));

        container.appendChild(optSettingsGrid);


        this._ui.status = createTree("div", { style: "text-align:center;margin-top:10px;font-size:0.85em;color:var(--info);" }, ["Haz clic en el canvas principal para dibujar el icono."]);
        container.appendChild(this._ui.status);
      }

      _setupEventListeners() {

        this._ui.prevBtn.addEventListener('click', () => this._changeIconId(-1));
        this._ui.nextBtn.addEventListener('click', () => this._changeIconId(1));
        this._ui.iconIdInput.addEventListener('change', () => this._loadIconImage(this._currentCategory, parseInt(this._ui.iconIdInput.value) || 1));
        this._ui.acceptIconBtn.addEventListener('click', () => this._loadIconImage(this._currentCategory, parseInt(this._ui.iconIdInput.value) || 1));
        this._ui.randomIconBtn.addEventListener('click', () => this._loadRandomIcon());


        Object.keys(this._categories).forEach(catKey => {
            this._ui[`${catKey}NavButton`].addEventListener('click', () => this._changeCategory(catKey));
        });

        this._ui.difficultyButtons.forEach(button => {
          button.addEventListener('click', () => this._loadDifficultyIcon(button.dataset.diff));
        });
        this._ui.difficultyModToggles.forEach(checkbox => {
          checkbox.addEventListener('change', () => this._loadDifficultyIcon(this._ui.difficultiesSection.querySelector('.difficulty-button.active')?.dataset.diff));
        });
        this._ui.clearModsBtn.addEventListener('click', () => this._clearDifficultyModifiers());


        this._ui.extraButtons.forEach(button => {
          button.addEventListener('click', () => this._loadExtraIcon(button.dataset.extra));
        });


        this._ui.gauntletButtons.forEach(button => {
          button.addEventListener('click', () => this._loadGauntletIcon(button.dataset.gauntlet));
        });


        this._ui.editorBlockButtons.forEach(button => {
          button.addEventListener('click', () => this._loadEditorBlock(button.dataset.eblock));
        });

        this._ui.rotateBlockBtn.addEventListener('click', () => this._rotateBrushImage());
      }

      _toggleModuleActive() {
        this._setModuleActive(!this._isActive);
      }

      _setModuleActive(active) {
        this._isActive = active;
        if (active) {
          this._hookCanvasClick();
          this._ui.moduleToggleButton.innerHTML = '<i class="fas fa-power-off"></i> Desactivar Módulo';
          this._ui.moduleToggleButton.classList.add('active');
          this._changeCategory(this._currentCategory); // Ensure UI reflects current category state
        } else {
          this._unhookCanvasClick();
          this._ui.moduleToggleButton.innerHTML = '<i class="fas fa-power-off"></i> Activar Módulo';
          this._ui.moduleToggleButton.classList.remove('active');
          this._isDrawingIcon = false;
          this._ui.status.textContent = "Módulo inactivo. Actívalo para usarlo.";
        }

        const controlsToToggle = [
            this._ui.prevBtn, this._ui.nextBtn, this._ui.iconIdInput, this._ui.acceptIconBtn,
            this._ui.randomIconBtn, this._ui.delayPerSegmentInput, this._ui.delayPerRowInput,
            this._ui.qualityFactorInput, this._ui.autoClearBeforeDrawToggle,
            this._ui.ebDelaySegmentInput, this._ui.ebDelayPerRowInput, this._ui.ebQualityFactorInput,
            this._ui.ebTargetSizeInput, this._ui.rotateBlockBtn, this._ui.clearModsBtn
        ];

        controlsToToggle.forEach(el => {
          if (el) el.disabled = !active;
        });

        this._ui.previewCanvas.style.opacity = active ? '1' : '0.5';

        Object.values(this._ui).forEach(element => {
            if (element && element.classList && element.classList.contains('category-nav-button')) {
                element.disabled = !active;
            }
        });

        // Toggle visibility/display of sections
        const display = active ? 'block' : 'none';

        // Only show the currently active category section when the module is active
        this._ui.commonControlsSection.style.display = 'none';
        this._ui.difficultiesSection.style.display = 'none';
        this._ui.extrasSection.style.display = 'none';
        this._ui.gauntletsSection.style.display = 'none';
        this._ui.editorBlocksSection.style.display = 'none';
        this._ui.editorBlockOptimizationSection.style.display = 'none';

        if (active) {
            const sectionMap = {
                'cubes': this._ui.commonControlsSection,
                'ships': this._ui.commonControlsSection,
                'balls': this._ui.commonControlsSection,
                'ufos': this._ui.commonControlsSection,
                'waves': this._ui.commonControlsSection,
                'robots': this._ui.commonControlsSection,
                'spiders': this._ui.commonControlsSection,
                'swings': this._ui.commonControlsSection,
                'jetpacks': this._ui.commonControlsSection,
                'difficulties': this._ui.difficultiesSection,
                'extras': this._ui.extrasSection,
                'gauntlets': this._ui.gauntletsSection,
                'editor_blocks': this._ui.editorBlocksSection,
            };
            const currentSection = sectionMap[this._currentCategory];
            if (currentSection) currentSection.style.display = 'block';
            if (this._currentCategory === 'editor_blocks') {
                this._ui.editorBlockOptimizationSection.style.display = 'block';
            }
        }
      }

      _changeCategory(newCategory) {
        // Hide all specific sections
        this._ui.commonControlsSection.style.display = 'none';
        this._ui.difficultiesSection.style.display = 'none';
        this._ui.extrasSection.style.display = 'none';
        this._ui.gauntletsSection.style.display = 'none';
        this._ui.editorBlocksSection.style.display = 'none';
        this._ui.editorBlockOptimizationSection.style.display = 'none';

        // Clear active states on buttons
        Object.values(this._ui).forEach(element => {
            if (element && element.classList && element.classList.contains('category-nav-button')) {
                element.classList.remove('active');
            }
        });

        this._ui.difficultyButtons.forEach(btn => btn.classList.remove('active'));
        this._ui.extraButtons.forEach(btn => btn.classList.remove('active'));
        this._ui.gauntletButtons.forEach(btn => btn.classList.remove('active'));
        this._ui.editorBlockButtons.forEach(btn => btn.classList.remove('active'));

        this._currentCategory = newCategory;
        this._currentRotation = 0; // Reset rotation on category change

        // Show relevant section and load default/current icon
        if (newCategory === 'difficulties') {
            this._ui.difficultiesSection.style.display = 'block';
            // Try to load the currently selected difficulty, or 'easy' if none
            const activeDiffButton = this._ui.difficultiesSection.querySelector('.difficulty-button.active') || this._ui.difficultiesSection.querySelector('.difficulty-button[data-diff="easy"]');
            if (activeDiffButton) {
                this._loadDifficultyIcon(activeDiffButton.dataset.diff);
                activeDiffButton.classList.add('active');
            }
        } else if (newCategory === 'extras') {
            this._ui.extrasSection.style.display = 'block';
        } else if (newCategory === 'gauntlets') {
            this._ui.gauntletsSection.style.display = 'block';
        } else if (newCategory === 'editor_blocks') {
            this._ui.editorBlocksSection.style.display = 'block';
            this._ui.editorBlockOptimizationSection.style.display = 'block';
            const defaultBlock = Object.keys(this._editorBlocks)[0];
            if (defaultBlock) {
                this._loadEditorBlock(defaultBlock);
                this._ui.editorBlocksSection.querySelector(`.editor-block-button[data-eblock="${defaultBlock}"]`)?.classList.add('active');
            }
        } else {
            this._ui.commonControlsSection.style.display = 'block';
            this._currentIconId = 1;
            this._loadIconImage(this._currentCategory, this._currentIconId);
        }

        const newCategoryButton = this._ui[`${newCategory}NavButton`];
        if (newCategoryButton) {
            newCategoryButton.classList.add('active');
        }
        this._ui.status.textContent = `Categoría: ${this._categories[newCategory].name || newCategory.charAt(0).toUpperCase() + newCategory.slice(1).replace('_', ' ')}.`;
      }

      _updateInfo() {
        if (this._categories[this._currentCategory] && this._categories[this._currentCategory].maxId) {
          this._ui.info.textContent = `Icono #${this._currentIconId} / ${this._categories[this._currentCategory].maxId}`;
          this._ui.iconIdInput.max = this._categories[this._currentCategory].maxId;
          this._ui.iconIdInput.style.display = 'block';
          this._ui.acceptIconBtn.style.display = 'block';
          this._ui.randomIconBtn.style.display = 'block';
        } else {
          this._ui.info.textContent = `Selecciona un icono`;
          this._ui.iconIdInput.style.display = 'none';
          this._ui.acceptIconBtn.style.display = 'none';
          this._ui.randomIconBtn.style.display = 'none';
        }
      }

      _changeIconId(delta) {
        if (!this._categories[this._currentCategory] || !this._categories[this._currentCategory].maxId) return;
        let n = this._currentIconId + delta;
        n = clamp(n, 1, this._categories[this._currentCategory].maxId);
        this._loadIconImage(this._currentCategory, n);
      }

      _loadRandomIcon() {
        if (!this._categories[this._currentCategory] || !this._categories[this._currentCategory].maxId) return;
        const maxId = this._categories[this._currentCategory].maxId;
        const randomId = Math.floor(Math.random() * maxId) + 1;
        this._loadIconImage(this._currentCategory, randomId);
      }

      async _loadIconImage(categoryKey, id) {
        if (!this._isActive) return;
        const category = this._categories[categoryKey];
        if (!category || !category.prefix) return;

        this._currentCategory = categoryKey;
        this._currentIconId = clamp(id, 1, category.maxId);
        this._ui.iconIdInput.value = this._currentIconId;
        this._updateInfo();

        const imageUrl = `https://gdbrowser.com/iconkit/premade/${category.prefix}${this._currentIconId}.png`;
        this._ui.status.textContent = `Cargando ${categoryKey.slice(0, -1)} #${this._currentIconId}...`;

        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          this._canvasBrushImg = img;
          this._currentRotation = 0;
          this._drawPreviewWithRotation(img, 0);
          this._ui.status.textContent = "Listo. Haz click en el canvas principal para dibujar.";
        };
        img.onerror = () => {
          this._canvasBrushImg = null;
          this._drawPreviewError();
          notify("error", `Error al cargar icono GD: ${categoryKey} #${this._currentIconId}.`);
          this._ui.status.textContent = "Error al cargar imagen.";
        };
        img.src = imageUrl;
      }

      async _loadDifficultyIcon(difficultyKey) {
        if (!this._isActive) return;
        this._currentCategory = 'difficulties';

        this._ui.difficultyButtons.forEach(btn => btn.classList.remove('active'));
        const clickedButton = this._ui.difficultiesSection.querySelector(`.difficulty-button[data-diff="${difficultyKey}"]`);
        if(clickedButton) clickedButton.classList.add('active');

        this._ui.status.textContent = `Cargando ${difficultyKey} ...`;
        this._drawPreviewWithRotation(null, 0);
        this._currentRotation = 0;
        this._canvasBrushImg = null;

        let activeModifiers = [];
        this._ui.difficultyModToggles.forEach(checkbox => {
          if (checkbox.checked) {
            activeModifiers.push(checkbox.dataset.mod);
          }
        });

        const tryLoad = async (url) => {
            return new Promise(resolve => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    this._canvasBrushImg = img;
                    this._drawPreviewWithRotation(img, 0);
                    this._ui.status.textContent = "Listo. Haz click para dibujar la dificultad.";
                    resolve(true);
                };
                img.onerror = () => {
                    resolve(false);
                };
                img.src = url;
            });
        };

        let loaded = false;
        if (activeModifiers.length > 0) {
            const baseName = this._difficulties[difficultyKey].replace('.png', '');
            for (const mod of activeModifiers) {
                const modifiedUrl = `https://gdbrowser.com/assets/difficulties/${baseName}${mod}.png`;
                loaded = await tryLoad(modifiedUrl);
                if (loaded) break;
            }
        }
        if (!loaded) {
            const imageUrl = `https://gdbrowser.com/assets/difficulties/${this._difficulties[difficultyKey]}`;
            loaded = await tryLoad(imageUrl);
        }

        if (!loaded) {
            this._canvasBrushImg = null;
            this._drawPreviewError();
            notify("error", `Error al cargar dificultad GD: ${difficultyKey}.`);
            this._ui.status.textContent = "Error al cargar imagen de dificultad.";
        }
      }

      _clearDifficultyModifiers() {
        this._ui.difficultyModToggles.forEach(checkbox => checkbox.checked = false);

        const currentDiff = this._ui.difficultiesSection.querySelector('.difficulty-button.active')?.dataset.diff;
        if(currentDiff) this._loadDifficultyIcon(currentDiff);
      }

      async _loadExtraIcon(extraKey) {
        if (!this._isActive) return;
        this._currentCategory = 'extras';
        this._ui.extraButtons.forEach(btn => btn.classList.remove('active'));
        const clickedButton = this._ui.extrasSection.querySelector(`.extra-button[data-extra="${extraKey}"]`);
        if(clickedButton) clickedButton.classList.add('active');

        const imageUrl = `https://gdbrowser.com/assets/${this._extras[extraKey]}`;
        this._ui.status.textContent = `Cargando extra: ${extraKey}...`;
        this._drawPreviewWithRotation(null, 0);
        this._currentRotation = 0;

        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          this._canvasBrushImg = img;
          this._drawPreviewWithRotation(img, 0);
          this._ui.status.textContent = "Listo. Haz click para dibujar el extra.";
        };
        img.onerror = () => {
          this._canvasBrushImg = null;
          this._drawPreviewError();
          notify("error", `Error al cargar extra GD: ${extraKey}.`);
          this._ui.status.textContent = "Error al cargar extra.";
        };
        img.src = imageUrl;
      }

      async _loadGauntletIcon(gauntletKey) {
        if (!this._isActive) return;
        this._currentCategory = 'gauntlets';
        this._ui.gauntletButtons.forEach(btn => btn.classList.remove('active'));
        const clickedButton = this._ui.gauntletsSection.querySelector(`.gauntlet-button[data-gauntlet="${gauntletKey}"]`);
        if(clickedButton) clickedButton.classList.add('active');

        const imageUrl = `https://gdbrowser.com/assets/gauntlets/${this._gauntlets[gauntletKey]}`;
        this._ui.status.textContent = `Cargando gauntlet: ${gauntletKey}...`;
        this._drawPreviewWithRotation(null, 0);
        this._currentRotation = 0;

        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          this._canvasBrushImg = img;
          this._drawPreviewWithRotation(img, 0);
          this._ui.status.textContent = "Listo. Haz click para dibujar el guantelete.";
        };
        img.onerror = () => {
          this._canvasBrushImg = null;
          this._drawPreviewError();
          notify("error", `Error al cargar guantelete GD: ${gauntletKey}.`);
          this._ui.status.textContent = "Error al cargar guantelete.";
        };
        img.src = imageUrl;
      }


      async _loadEditorBlock(blockKey) {
        if (!this._isActive) return;
        this._currentCategory = 'editor_blocks';
        this._ui.editorBlockButtons.forEach(btn => btn.classList.remove('active'));
        const clickedButton = this._ui.editorBlocksSection.querySelector(`.editor-block-button[data-eblock="${blockKey}"]`);
        if(clickedButton) clickedButton.classList.add('active');

        const imageUrl = this._editorBlocks[blockKey];
        if (!imageUrl) {
            notify("error", `Bloque del editor GD no encontrado: ${blockKey}.`);
            this._ui.status.textContent = "Error: bloque no encontrado.";
            this._drawPreviewError();
            return;
        }

        this._ui.status.textContent = `Cargando bloque: ${blockKey}...`;
        this._drawPreviewWithRotation(null, 0);

        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          this._canvasBrushImg = img;
          this._currentRotation = 0;
          this._drawPreviewWithRotation(img, this._currentRotation);
          this._ui.status.textContent = "Listo. Haz click para dibujar el bloque.";
        };
        img.onerror = () => {
          this._canvasBrushImg = null;
          this._drawPreviewError();
          notify("error", `Error al cargar bloque del editor GD: ${blockKey}.`);
          this._ui.status.textContent = "Error al cargar bloque.";
        };
        img.src = imageUrl;
      }


      _drawPreviewWithRotation(img, angle) {
        const ctx = this._ui.previewCanvas.getContext("2d");
        const previewSize = 96;
        ctx.clearRect(0, 0, previewSize, previewSize);

        if (!img) {
          ctx.fillStyle = "var(--danger)";
          ctx.font = "14px Arial";
          ctx.fillText("NO IMG", 18, 55);
          return;
        }

        ctx.save();
        ctx.translate(previewSize / 2, previewSize / 2);
        ctx.rotate(angle * Math.PI / 180);

        let drawWidth, drawHeight;
        const maxDim = Math.max(img.width, img.height);
        const scale = previewSize / maxDim * 0.9;
        drawWidth = img.width * scale;
        drawHeight = img.height * scale;

        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();
      }


      _drawPreviewError() {
        const ctx = this._ui.previewCanvas.getContext("2d");
        ctx.clearRect(0, 0, 96, 96);
        ctx.fillStyle = "var(--danger)";
        ctx.font = "14px Arial";
        ctx.fillText("NO IMG", 18, 55);
      }


      _rotateBrushImage() {
        if (!this._canvasBrushImg || this._currentCategory !== 'editor_blocks') {
            return;
        }

        this._currentRotation = (this._currentRotation + 90) % 360;
        this._drawPreviewWithRotation(this._canvasBrushImg, this._currentRotation);

        this._ui.status.textContent = `Objeto rotado a ${this._currentRotation}°. Listo para dibujar.`;
      }


      _hookCanvasClick() {
        if (!this._mainCanvas) {
            this._mainCanvas = document.getElementById("canvas");
            if (!this._mainCanvas) return;
        }
        if (!this._canvasClickHandlerAttached) {
          this._mainCanvas.addEventListener("click", this._canvasClickHandler);
          this._canvasClickHandlerAttached = true;
          notify("info", "Canvas click handler attached.", "GD Drawer");
        }
      }

      _unhookCanvasClick() {
        if (this._mainCanvas && this._canvasClickHandlerAttached) {
          this._mainCanvas.removeEventListener("click", this._canvasClickHandler);
          this._canvasClickHandlerAttached = false;
          notify("info", "Canvas click handler detached.", "GD Drawer");
        }
      }

      async _handleCanvasClick(ev) {
        if (this._isDrawingIcon || !this._isActive || !this._canvasBrushImg || !this._mainCanvas) {
            return;
        }

        const socket = getPrimarySocket();
        if (!socket) {
            this._ui.status.textContent = "¡Sin conexión! (Revisa la consola)";
            return;
        }

        this._isDrawingIcon = true;

        const rect = this._mainCanvas.getBoundingClientRect();
        const clickX_display_px = ev.clientX - rect.left;
        const clickY_display_px = ev.clientY - rect.top;

        const scaleToInternalCanvas = this._mainCanvas.width / rect.width;
        const clickX_internal_px = clickX_display_px * scaleToInternalCanvas;
        const clickY_internal_px = clickY_display_px * scaleToInternalCanvas;


        let delayPerSegment, delayPerRow, qualityFactor, targetDrawingSize_px;
        const autoClear = this._ui.autoClearBeforeDrawToggle.checked;

        if (this._currentCategory === 'editor_blocks') {
            delayPerSegment = parseInt(this._ui.ebDelaySegmentInput.value) || this._editorBlockDefaultOptimizations.delayPerSegment;
            delayPerRow = parseInt(this._ui.ebDelayPerRowInput.value) || this._editorBlockDefaultOptimizations.delayPerRow;
            qualityFactor = parseInt(this._ui.ebQualityFactorInput.value) || this._editorBlockDefaultOptimizations.qualityFactor;
            targetDrawingSize_px = parseInt(this._ui.ebTargetSizeInput.value) || this._editorBlockDefaultOptimizations.targetSize;
        } else {
            delayPerSegment = parseInt(this._ui.delayPerSegmentInput.value) || 1;
            delayPerRow = parseInt(this._ui.delayPerRowInput.value) || 20;
            qualityFactor = parseInt(this._ui.qualityFactorInput.value) || 1;
            targetDrawingSize_px = 64;
        }


        this._ui.status.textContent = "Dibujando objeto GD...";


        if (autoClear) {
            await this._clearCanvas(socket);
            await delay(100);
        }

        const originalImgWidth = this._canvasBrushImg.width;
        const originalImgHeight = this._canvasBrushImg.height;

        let rotatedTempCanvas = document.createElement("canvas");
        let tempCtx = rotatedTempCanvas.getContext("2d");


        let rotatedWidth = originalImgWidth;
        let rotatedHeight = originalImgHeight;
        if (this._currentRotation === 90 || this._currentRotation === 270) {
            rotatedWidth = originalImgHeight;
            rotatedHeight = originalImgWidth;
        }
        rotatedTempCanvas.width = rotatedWidth;
        rotatedTempCanvas.height = rotatedHeight;


        tempCtx.save();
        tempCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
        tempCtx.rotate(this._currentRotation * Math.PI / 180);

        tempCtx.drawImage(this._canvasBrushImg, -originalImgWidth / 2, -originalImgHeight / 2);
        tempCtx.restore();


        const imgData = tempCtx.getImageData(0, 0, rotatedWidth, rotatedHeight).data;


        const scaleFactor_drawing = targetDrawingSize_px / Math.max(rotatedWidth, rotatedHeight);

        let currentLineStart_asset_px = null;
        let currentLineColor = null;
        let totalLinesDrawn = 0;

        for (let py = 0; py < rotatedHeight; py += qualityFactor) {
            if (!this._isActive || !this._isDrawingIcon) {
                break;
            }

            currentLineStart_asset_px = null;
            currentLineColor = null;

            for (let px = 0; px < rotatedWidth; px += qualityFactor) {
                const idx = (py * rotatedWidth + px) * 4;
                const r = imgData[idx], g = imgData[idx+1], b = imgData[idx+2], a = imgData[idx+3];
                const hexColor = "#" + [r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');

                if (a > 10) {
                    if (currentLineStart_asset_px === null) {
                        currentLineStart_asset_px = px;
                        currentLineColor = hexColor;
                    } else if (hexColor !== currentLineColor) {
                        const startX_draw = clickX_internal_px + (currentLineStart_asset_px - rotatedWidth/2) * scaleFactor_drawing;
                        const startY_draw = clickY_internal_px + (py - rotatedHeight/2) * scaleFactor_drawing;
                        const endX_draw = clickX_internal_px + (px - qualityFactor - rotatedWidth/2) * scaleFactor_drawing;
                        const endY_draw = startY_draw;

                        const thickness = Math.max(1, Math.round(scaleFactor_drawing * qualityFactor));
                        this._sendDrawCommand(socket, [startX_draw, startY_draw], [endX_draw, endY_draw], currentLineColor, thickness);
                        totalLinesDrawn++;

                        currentLineStart_asset_px = px;
                        currentLineColor = hexColor;
                    }
                } else {
                    if (currentLineStart_asset_px !== null) {
                        const startX_draw = clickX_internal_px + (currentLineStart_asset_px - rotatedWidth/2) * scaleFactor_drawing;
                        const startY_draw = clickY_internal_px + (py - rotatedHeight/2) * scaleFactor_drawing;
                        const endX_draw = clickX_internal_px + (px - qualityFactor - rotatedWidth/2) * scaleFactor_drawing;
                        const endY_draw = startY_draw;

                        const thickness = Math.max(1, Math.round(scaleFactor_drawing * qualityFactor));
                        this._sendDrawCommand(socket, [startX_draw, startY_draw], [endX_draw, endY_draw], currentLineColor, thickness);
                        totalLinesDrawn++;

                        currentLineStart_asset_px = null;
                        currentLineColor = null;
                    }
                }
            }

            if (currentLineStart_asset_px !== null) {
                const startX_draw = clickX_internal_px + (currentLineStart_asset_px - rotatedWidth/2) * scaleFactor_drawing;
                const startY_draw = clickY_internal_px + (py - rotatedHeight/2) * scaleFactor_drawing;
                const endX_draw = clickX_internal_px + (rotatedWidth - 1 - rotatedWidth/2) * scaleFactor_drawing;
                const endY_draw = startY_draw;

                const thickness = Math.max(1, Math.round(scaleFactor_drawing * qualityFactor));
                this._sendDrawCommand(socket, [startX_draw, startY_draw], [endX_draw, endY_draw], currentLineColor, thickness);
                totalLinesDrawn++;

                currentLineStart_asset_px = null;
                currentLineColor = null;
            }
            await delay(delayPerRow);
        }

        this._isDrawingIcon = false;
        notify("success", `Objeto GD dibujado en el canvas (${totalLinesDrawn} líneas). Visible para todos.`);
        this._ui.status.textContent = "Listo. Haz click de nuevo para otro objeto.";
      }


      _sendDrawCommand(socket, start_px, end_px, color, thickness) {
          if (!this._mainCanvas) {
              console.error("Error: _mainCanvas is null in _sendDrawCommand. Cannot send drawing command.");
              return;
          }
          const normX1 = (start_px[0] / this._mainCanvas.width);
          const normY1 = (start_px[1] / this._mainCanvas.height);
          const normX2 = (end_px[0] / this._mainCanvas.width);
          const normY2 = (end_px[1] / this._mainCanvas.height);

          const ctx = this._mainCanvas.getContext('2d');
          ctx.strokeStyle = color;
          ctx.lineWidth = thickness;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(start_px[0], start_px[1]);
          ctx.lineTo(end_px[0], end_px[1]);
          ctx.stroke();

          // Drawaria protocol uses negative thickness for brush tool
          socket.send(`42["drawcmd",0,[${normX1.toFixed(4)},${normY1.toFixed(4)},${normX2.toFixed(4)},${normY2.toFixed(4)},false,${0 - thickness},"${color}",0,0,{}]]`);
      }

      async _clearCanvas(socket) {
        if (!this._mainCanvas) return;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;

        const ctx = this._mainCanvas.getContext('2d');
        ctx.clearRect(0, 0, this._mainCanvas.width, this._mainCanvas.height);

        const w = this._mainCanvas.width;
        const h = this._mainCanvas.height;
        const clearThickness = 2000;
        const clearColor = '#FFFFFF';
        const steps = 5;

        for (let i = 0; i <= steps; i++) {
            // Horizontal sweeps (using pixel coordinates)
            this._sendDrawCommand(socket, [0, (i / steps) * h], [w, (i / steps) * h], clearColor, clearThickness);
            await delay(5);
            // Vertical sweeps (using pixel coordinates)
            this._sendDrawCommand(socket, [(i / steps) * w, 0], [(i / steps) * w, h], clearColor, clearThickness);
            await delay(5);
        }
        notify("success", "Lienzo limpiado para todos.");
      }
    }

    // --- Style Injection ---
    GM_addStyle(`
        /* Custom Variables for standalone appearance, mimicking CE */
        :root {
            --light: #f8f9fa;
            --dark: #212529;
            --primary: #007bff;
            --secondary: #6c757d;
            --success: #28a745;
            --info: #17a2b8;
            --danger: #dc3545;
            --warning: #ffc107;

            /* GD-Themed CE-like Variables */
            --CE-bg_color: #1a1a1a;   /* Dark background */
            --CE-color: #f8f9fa;      /* Light text color */
            --CE-input-bg: #444;      /* Dark input background */
            --CE-btn-special: #007bff; /* Blue color (Primary) */
            --CE-btn-active: #ff8c00;  /* Dark Orange active color */
        }

        .gd-drawer-menu {
            line-height: normal;
            font-size: 1rem;
            background-color: var(--CE-bg_color);
            border: 1px solid var(--CE-color);
            border-radius: .25rem;
            box-shadow: 0 4px 8px rgba(0,0,0,0.5);
            z-index: 9999;
            font-family: Arial, sans-serif;
            color: var(--CE-color);
            max-height: 80vh;
            overflow-y: auto;
        }

        .gd-drawer-menu-header {
            cursor: grab;
            background-color: #0080ff !important; /* Brighter GD Blue */
        }

        .gd-drawer-menu .btn-close-menu {
            background-color: var(--danger);
            color: white;
            padding: 3px 8px;
            font-size: 0.8em;
            border: none;
            line-height: 1;
            border-radius: .25rem;
            cursor: pointer;
        }

        .module-section-title {
            text-align: center;
            font-weight: bold;
            color: var(--CE-btn-active);
            margin: 10px 0;
            font-size: 1.1em;
            border-bottom: 1px dashed var(--CE-color);
            padding-bottom: 5px;
        }

        .module-btn-group {
            display: flex;
            gap: 5px;
            margin-bottom: 5px;
        }

        /* General Button Style */
        .artfx-button {
            padding: 5px 10px;
            font-size: 0.9em;
            cursor: pointer;
            border: 1px solid var(--secondary);
            border-radius: .25rem;
            background-color: var(--secondary);
            color: var(--dark);
            transition: background-color 0.2s, color 0.2s, border-color 0.2s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            text-align: center;
        }
        .artfx-button.special {
            background-color: var(--CE-btn-special);
            color: white;
            border-color: var(--CE-btn-special);
        }
        .artfx-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .artfx-button i {
            margin-right: 5px;
        }

        /* Category Buttons */
        .category-nav-button {
            flex: 1 1 30%;
            font-size: 0.8em;
            padding: 5px;
            background-color: var(--CE-input-bg);
            color: var(--CE-color);
            border-color: var(--CE-input-bg);
        }
        .category-nav-button.active, .difficulty-button.active, .extra-button.active, .gauntlet-button.active, .editor-block-button.active {
            background-color: var(--CE-btn-active) !important;
            color: white !important;
            border-color: var(--CE-btn-active) !important;
        }

        /* Toggle Button */
        .module-toggle-button {
            width: 100%;
            background-color: var(--danger);
            color: white;
            font-weight: bold;
        }
        .module-toggle-button.active {
            background-color: var(--success);
        }

        /* Form Controls */
        .module-form-control {
            padding: 5px;
            border: 1px solid var(--secondary);
            border-radius: .25rem;
            background-color: var(--CE-input-bg);
            color: var(--CE-color);
            text-align: center;
        }

        /* Input and Label Layout */
        .module-btn-group > div {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .module-btn-group > div label {
            font-size: 0.8em;
            color: var(--CE-color);
        }
        .module-btn-group > div input[type="number"] {
             width: 100%;
        }
    `);

    // --- Module Initialization ---
    function initializeGDDrawer() {
        if (document.body && document.getElementById("canvas")) {
            const drawer = new GeometryDashCubeOnlineDrawerStandalone();

            // Floating toggle button
            const toggleButton = createElement("button", {
                id: "open-gd-drawer-menu",
                style: `
                    position: fixed;
                    bottom: 80px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background-color: #0080ff; /* GD Blue */
                    color: white;
                    border: none;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    font-size: 1.5em;
                    cursor: pointer;
                    z-index: 9998;
                `
            }, ['🔳']);

            document.body.appendChild(toggleButton);

            toggleButton.addEventListener("click", () => {
                const menu = document.getElementById(drawer._containerId);
                if (menu) {
                    const isVisible = menu.style.display === "block";
                    menu.style.display = isVisible ? "none" : "block";
                    if (!isVisible) {
                        notify("info", "GD Drawer Menu opened.", "GD Drawer");
                        if (!drawer._canvasBrushImg) {
                            drawer._loadIconImage(drawer._currentCategory, drawer._currentIconId);
                        }
                    } else {
                        notify("info", "GD Drawer Menu closed.", "GD Drawer");
                        drawer._setModuleActive(false);
                    }
                }
            });

        } else {
            setTimeout(initializeGDDrawer, 100);
        }
    }

    initializeGDDrawer();

})();