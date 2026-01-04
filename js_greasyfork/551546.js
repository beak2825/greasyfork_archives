// ==UserScript==
// @name         Drawaria Minecraft Drawer
// @namespace    drawaria.modded.minecraftdrawer
// @version      1.0.0
// @description  A module to draw Minecraft-themed pixel art on the canvas using a pixel-to-line algorithm.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @require      https://kit.fontawesome.com/a7a0b82b9e.js
// @downloadURL https://update.greasyfork.org/scripts/551546/Drawaria%20Minecraft%20Drawer.user.js
// @updateURL https://update.greasyfork.org/scripts/551546/Drawaria%20Minecraft%20Drawer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Standalone Utilities and QBit Replacements ---

    // === 1. Notification System (replaces ModBase.notify) ===
    function notify(level, message, moduleName = "Minecraft Drawer") {
        let color = "#6c757d"; // log
        if (level === "error") color = "#dc3545";
        else if (level === "warning") color = "#ffc107";
        else if (level === "info") color = "#17a2b8";
        else if (level === "success") color = "#28a745";

        console.log(`%c${moduleName}: ${message}`, `color: ${color}`);

        const loggingContainer = document.getElementById("chatbox_messages");
        if (loggingContainer) {
            const chatmessage = document.createElement("div");
            chatmessage.className = `chatmessage systemchatmessage5`;
            chatmessage.dataset.ts = Date.now().toString();
            chatmessage.style.color = color;
            chatmessage.textContent = `${moduleName}: ${message}`;
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
            } else {
                el.setAttribute(attr, attrs[attr]);
            }
        }
        children.forEach(child => {
            if (typeof child === "string") {
                el.appendChild(document.createTextNode(child));
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
            btn.appendChild(content);
        }
        return btn;
    }

    // Simple div container creator (replaces domMake.Tree)
    function createTree(tag, attrs, children) {
        return createElement(tag, attrs, children);
    }

    // Simple row container creator (replaces domMake.Row)
    function createRow(attrs = {}, children = []) {
        const row = createElement("div", { className: "module-btn-group", ...attrs });
        children.forEach(child => {
            if (child) row.appendChild(child);
        });
        // Add a helper for appendAll if needed for complex structures, otherwise use standard appendChild
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
            if (!skipNotification) notify("warning", "No active WebSocket connections found.", "Minecraft Drawer");
            return null;
        }
        return primarySocket;
    }

    // === 4. General Utilities ===
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    // --- Adapted MinecraftDrawer Class ---
    class MinecraftDrawerStandalone {

      _identifier = 'minecraftdrawer';
      _containerId = `${this._identifier}-menu-container`;
      _contentId = `${this._identifier}-content`;

      _minecraftImages = {
        mobs: [
          "https://minecraft.wiki/images/Allay_JE1_BE1.png",
          "https://minecraft.wiki/images/Cod.png",
          "https://minecraft.wiki/images/Salmon.png",
          "https://minecraft.wiki/images/Skeleton_Horse.png",
          "https://minecraft.wiki/images/Strider.png",
          "https://minecraft.wiki/images/Wandering_Trader.png",
          "https://minecraft.wiki/images/Bee.png",
          "https://minecraft.wiki/images/Dolphin.png",
          "https://minecraft.wiki/images/Drowned.png",
          "https://minecraft.wiki/images/Iron_Golem_JE2_BE2.png",
          "https://minecraft.wiki/images/Llama.png",
          "https://minecraft.wiki/images/Piglin.png",
          "https://minecraft.wiki/images/Endermite.png",
          "https://minecraft.wiki/images/Ender_Dragon.png",
          "https://minecraft.wiki/images/Zombie_Villager.png",
          "https://minecraft.wiki/images/Skeleton_Horseman.png",
          "https://minecraft.wiki/images/Agent.png",
          "https://minecraft.wiki/images/Beast_Boy.png",
          "https://minecraft.wiki/images/Rana.png",
          "https://minecraft.wiki/images/Diamond_Chicken.png",
          "https://minecraft.wiki/images/Mars.png",
          "https://minecraft.wiki/images/Moobloom.png",
          "https://minecraft.wiki/images/Moon_Cow.png",
          "https://minecraft.wiki/images/Friendly_Wither.png",
          "https://minecraft.wiki/images/Redstone_Bug.png",
          "https://minecraft.wiki/images/Smiling_Creeper.png",
          "https://minecraft.wiki/images/Pigman.png",
          "https://minecraft.wiki/images/Chinese_Alligator.png",
          "https://minecraft.wiki/images/Golden_Monkey.png",
          "https://minecraft.wiki/images/White-Lipped_Deer.png",
          "https://minecraft.wiki/images/Iceologer.png",
          "https://minecraft.wiki/images/Glare.png"
        ],
        items: [
          "https://minecraft.wiki/images/Wheat.png",
          "https://minecraft.wiki/images/Map.png",
          "https://minecraft.wiki/images/Spawn_Egg.png"
        ],
        blocks: [
          "https://minecraft.wiki/images/Dirt.png"
        ]
      };

      _currentCategory = 'mobs';
      _currentIndex = 0;
      _canvasBrushImg = null;
      _ui = {};
      _mainCanvas = null;
      _canvasClickHandler = null;
      _canvasClickHandlerAttached = false;
      _isActive = false;
      _isDrawingCube = false;


      constructor() {
        this._canvasClickHandler = this._handleCanvasClick.bind(this);
        this._createMenuStructure();
        this._onStartup();
      }

      _onStartup() {
        this._mainCanvas = document.getElementById("canvas");
        this._loadInterface();
        this._setupEventListeners();
        this._loadMinecraftImage(this._currentCategory, this._currentIndex);
        this._setModuleActive(false);
        notify("info", " 'Minecraft Drawer' Loaded. Click the gem icon to open.", "Minecraft Drawer");
      }

      _createMenuStructure() {
          const menuContainer = createTree("div", {
              id: this._containerId,
              className: "minecraft-drawer-menu",
              style: `
                  position: fixed;
                  top: 10%;
                  left: 50px;
                  width: 300px;
                  display: none; /* Starts hidden */
              `
          });

          const header = createTree("div", {
              className: "minecraft-drawer-menu-header",
              style: `
                  padding: 8px;
                  background-color: var(--primary, #007bff);
                  color: white;
                  cursor: grab;
                  border-top-left-radius: .25rem;
                  border-top-right-radius: .25rem;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
              `
          }, [createTree("span", {}, ["💎 Minecraft Toolkit"]), createButton("X", "btn-close-menu")]);

          header.querySelector(".btn-close-menu").addEventListener("click", () => {
              menuContainer.style.display = "none";
              this._setModuleActive(false); // Deactivate module when closing
          });

          const content = createTree("div", {
              id: this._contentId,
              className: "minecraft-drawer-menu-content",
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
        const container = createTree("div", {
          id: `${this._identifier}-container`,
          className: "module-section"
        });
        this._ui.section.appendChild(container);


        const moduleToggleGroup = createTree("div", {
          className: "module-btn-group",
          style: "margin-bottom:10px;"
        });
        this._ui.moduleToggleButton = createButton('<i class="fas fa-power-off"></i> Activar Módulo', 'module-toggle-button');
        this._ui.moduleToggleButton.addEventListener('click', () => this._toggleModuleActive());
        moduleToggleGroup.appendChild(this._ui.moduleToggleButton);
        container.appendChild(moduleToggleGroup);

        container.appendChild(createTree("div", {
          className: "module-section-title"
        }, ["Minecraft Online Drawer"]));


        container.appendChild(createTree("div", {
          className: "module-section-title",
          style: "margin-top:15px;"
        }, ["Seleccionar Categoría"]));
        const categoryButtonGroup = createTree("div", {
          className: "module-btn-group",
          style: "margin-bottom:10px;"
        });
        this._ui.mobsCategoryBtn = createButton('Mobs', {
          className: "artfx-button category-nav-button"
        });
        this._ui.itemsCategoryBtn = createButton('Items', {
          className: "artfx-button category-nav-button"
        });
        this._ui.blocksCategoryBtn = createButton('Bloques', {
          className: "artfx-button category-nav-button"
        });

        this._ui.mobsCategoryBtn.addEventListener('click', () => this._setCategory('mobs'));
        this._ui.itemsCategoryBtn.addEventListener('click', () => this._setCategory('items'));
        this._ui.blocksCategoryBtn.addEventListener('click', () => this._setCategory('blocks'));

        categoryButtonGroup.append(this._ui.mobsCategoryBtn, this._ui.itemsCategoryBtn, this._ui.blocksCategoryBtn);
        container.appendChild(categoryButtonGroup);


        const navRow = createTree("div", {
          style: "display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:10px;"
        });
        this._ui.prevBtn = createButton('←', {
          className: "artfx-button special"
        });
        this._ui.canvas = createTree("canvas", {
          width: 96,
          height: 96,
          style: "border:1px solid var(--CE-color);background:#222;"
        });
        this._ui.nextBtn = createButton('→', {
          className: "artfx-button special"
        });
        navRow.append(this._ui.prevBtn, this._ui.canvas, this._ui.nextBtn);
        container.appendChild(navRow);


        this._ui.info = createTree("div", {
          style: "text-align:center;margin-top:5px;font-size:0.9em;color:var(--info);"
        });
        container.appendChild(this._ui.info);


        container.appendChild(createTree("div", {
          className: "module-section-title",
          style: "margin-top:15px;"
        }, ["Buscar por ID"]));
        const searchRow = createRow({
          style: "display:flex;align-items:center;gap:5px;"
        });
        this._ui.iconIdInput = createTree("input", {
          type: "number",
          id: `${this._identifier}-iconIdInput`,
          min: "1",
          value: "1",
          placeholder: "ID del Objeto",
          className: "module-form-control",
          style: "flex:1 1 60%;"
        });
        this._ui.acceptIconBtn = createButton('Aceptar ID', {
          className: "artfx-button",
          style: "flex:1 1 35%;"
        });
        searchRow.appendAll(this._ui.iconIdInput, this._ui.acceptIconBtn);
        container.appendChild(searchRow);


        const randomRow = createRow({
          style: "margin-top:10px;"
        });
        this._ui.randomIconBtn = createButton('Objeto Random', {
          className: "artfx-button special",
          style: "width:100%;"
        });
        randomRow.appendChild(this._ui.randomIconBtn);
        container.appendChild(randomRow);


        container.appendChild(createTree("div", {
          className: "module-section-title",
          style: "margin-top:15px;"
        }, ["Optimización de Dibujo"]));
        const optSettingsGrid = createTree("div", {
          className: "module-btn-group",
          style: "flex-wrap:wrap;"
        });


        // Delay Segment
        this._ui.delayPerSegmentInput = createTree("input", {
          type: "number",
          id: `${this._identifier}-delayPerSegmentInput`,
          min: "0",
          max: "50",
          value: "120",
          title: "Retraso por segmento de línea (ms)",
          className: "module-form-control"
        });
        this._ui.delayPerSegmentLabel = createTree("label", {
          for: `${this._identifier}-delayPerSegmentInput`
        }, ["Delay Segmento (ms):"]);
        optSettingsGrid.append(createTree("div", {
          style: "flex:1 1 48%;"
        }, [this._ui.delayPerSegmentLabel, this._ui.delayPerSegmentInput]));

        // Delay Row
        this._ui.delayPerRowInput = createTree("input", {
          type: "number",
          id: `${this._identifier}-delayPerRowInput`,
          min: "0",
          max: "200",
          value: "130",
          title: "Retraso por fila de píxeles (ms)",
          className: "module-form-control"
        });
        this._ui.delayPerRowLabel = createTree("label", {
          for: `${this._identifier}-delayPerRowInput`
        }, ["Delay Fila (ms):"]);
        optSettingsGrid.append(createTree("div", {
          style: "flex:1 1 48%;"
        }, [this._ui.delayPerRowLabel, this._ui.delayPerRowInput]));

        // Quality Factor
        this._ui.qualityFactorInput = createTree("input", {
          type: "number",
          id: `${this._identifier}-qualityFactorInput`,
          min: "1",
          max: "5",
          value: "6",
          title: "Factor de calidad (1=mejor, 5=peor, más rápido)",
          className: "module-form-control"
        });
        this._ui.qualityFactorLabel = createTree("label", {
          for: `${this._identifier}-qualityFactorInput`
        }, ["Calidad (1-5):"]);
        optSettingsGrid.append(createTree("div", {
          style: "flex:1 1 48%;"
        }, [this._ui.qualityFactorLabel, this._ui.qualityFactorInput]));

        // Auto Clear Toggle
        this._ui.autoClearBeforeDrawToggle = createTree("input", {
          type: "checkbox",
          id: `${this._identifier}-autoClearToggle`,
          checked: false,
          title: "Limpiar el canvas antes de dibujar cada objeto",
          style: "margin-right: 5px; transform: scale(1.5);"
        });

        this._ui.autoClearBeforeDrawLabel = createTree("label", {
          for: `${this._identifier}-autoClearToggle`,
          style: "flex-grow: 1; text-align: left;"
        }, ["Auto-Limpiar antes de dibujar"]);
        optSettingsGrid.append(createTree("div", {
          style: "flex:1 1 48%; display:flex; align-items:center; flex-direction:row;"
        }, [this._ui.autoClearBeforeDrawToggle, this._ui.autoClearBeforeDrawLabel]));

        container.appendChild(optSettingsGrid);


        this._ui.status = createTree("div", {
          style: "text-align:center;margin-top:10px;font-size:0.85em;color:var(--info);"
        }, ["Haz clic en el canvas principal para dibujar el objeto donde hiciste clic (será visible para todos)."]);
        container.appendChild(this._ui.status);


        this._updateCategoryButtons();
      }

      _setupEventListeners() {
        this._ui.prevBtn.addEventListener('click', () => this._changeImage(-1));
        this._ui.nextBtn.addEventListener('click', () => this._changeImage(1));


        this._ui.acceptIconBtn.addEventListener('click', () => this._loadMinecraftImage(this._currentCategory, parseInt(this._ui.iconIdInput.value) - 1 || 0));
        this._ui.randomIconBtn.addEventListener('click', () => {
          const imagesInCurrentCategory = this._minecraftImages[this._currentCategory];
          if (imagesInCurrentCategory.length > 0) {
            const randomIndex = Math.floor(Math.random() * imagesInCurrentCategory.length);
            this._loadMinecraftImage(this._currentCategory, randomIndex);
          } else {
            notify("warning", "No hay imágenes en la categoría actual para seleccionar al azar.");
          }
        });
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
          this._ui.status.textContent = "Listo. Haz click en el canvas principal para dibujar.";

        } else {
          this._unhookCanvasClick();
          this._ui.moduleToggleButton.innerHTML = '<i class="fas fa-power-off"></i> Activar Módulo';
          this._ui.moduleToggleButton.classList.remove('active');
          this._isDrawingCube = false;
          this._ui.status.textContent = "Módulo inactivo. Actívalo para usarlo.";
        }

        const controlsToToggle = [
            this._ui.prevBtn, this._ui.nextBtn, this._ui.iconIdInput, this._ui.acceptIconBtn,
            this._ui.randomIconBtn, this._ui.mobsCategoryBtn, this._ui.itemsCategoryBtn,
            this._ui.blocksCategoryBtn, this._ui.delayPerSegmentInput, this._ui.delayPerRowInput,
            this._ui.qualityFactorInput, this._ui.autoClearBeforeDrawToggle
        ];

        controlsToToggle.forEach(el => {
          if (el) el.disabled = !active;
        });

        this._ui.canvas.style.opacity = active ? '1' : '0.5';
      }


      _setCategory(category) {
        if (this._currentCategory === category) return;

        this._currentCategory = category;
        this._currentIndex = 0;
        this._updateCategoryButtons();
        this._loadMinecraftImage(this._currentCategory, this._currentIndex);
      }


      _updateCategoryButtons() {
        this._ui.mobsCategoryBtn.classList.toggle('active', this._currentCategory === 'mobs');
        this._ui.itemsCategoryBtn.classList.toggle('active', this._currentCategory === 'items');
        this._ui.blocksCategoryBtn.classList.toggle('active', this._currentCategory === 'blocks');
      }

      _changeImage(delta) {
        const imagesInCurrentCategory = this._minecraftImages[this._currentCategory];
        if (imagesInCurrentCategory.length === 0) {
          notify("warning", "La categoría actual no tiene imágenes.");
          return;
        }

        let newIndex = this._currentIndex + delta;

        if (newIndex < 0) newIndex = imagesInCurrentCategory.length - 1;
        if (newIndex >= imagesInCurrentCategory.length) newIndex = 0;

        this._loadMinecraftImage(this._currentCategory, newIndex);
      }

      _updateInfo() {
        const imagesInCurrentCategory = this._minecraftImages[this._currentCategory];
        const categoryNameMap = {
          mobs: "Mob",
          items: "Item",
          blocks: "Bloque"
        };
        const categoryDisplayName = categoryNameMap[this._currentCategory] || "Objeto";
        const maxIndex = imagesInCurrentCategory.length - 1;

        this._ui.info.textContent = `${categoryDisplayName} #${this._currentIndex + 1} / ${maxIndex + 1}`;
        this._ui.iconIdInput.max = maxIndex + 1;
      }

      _loadMinecraftImage(category, index) {
        const imagesInCurrentCategory = this._minecraftImages[category];
        if (!imagesInCurrentCategory || imagesInCurrentCategory.length === 0) {
          const ctx = this._ui.canvas.getContext("2d");
          ctx.clearRect(0, 0, 96, 96);
          ctx.fillStyle = "var(--danger)";
          ctx.font = "14px Arial";
          ctx.fillText("NO IMG", 18, 55);
          this._canvasBrushImg = null;
          this._ui.status.textContent = `Error: No hay imágenes para ${category}.`;
          this._updateInfo();
          return;
        }

        index = clamp(index, 0, imagesInCurrentCategory.length - 1);
        this._currentCategory = category;
        this._currentIndex = index;
        this._updateInfo();
        this._ui.iconIdInput.value = index + 1;

        const ctx = this._ui.canvas.getContext("2d");
        ctx.clearRect(0, 0, 96, 96);
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          ctx.clearRect(0, 0, 96, 96);
          ctx.drawImage(img, 0, 0, 96, 96); // Draw to 96x96 preview canvas
          this._canvasBrushImg = img;
          if(this._isActive) this._ui.status.textContent = "Listo. Haz click en el canvas principal para dibujar.";
        };
        img.onerror = (e) => {
          ctx.clearRect(0, 0, 96, 96);
          ctx.fillStyle = "var(--danger)";
          ctx.font = "14px Arial";
          ctx.fillText("NO IMG", 18, 55);
          this._canvasBrushImg = null;
          const failedUrl = imagesInCurrentCategory[index];
          console.error(`Error al cargar imagen de Minecraft (URL: ${failedUrl}):`, e);
          notify("error", "Error al cargar imagen del objeto.");
          this._ui.status.textContent = "Error al cargar imagen del objeto.";
        };
        img.src = imagesInCurrentCategory[index];
      }


      async _handleCanvasClick(ev) {
        if (this._isDrawingCube || !this._isActive || !this._canvasBrushImg || !this._mainCanvas) {
            return;
        }

        const socket = getPrimarySocket();
        if (!socket) {
            this._ui.status.textContent = "¡Sin conexión! (Revisa la consola)";
            return;
        }

        this._isDrawingCube = true;

        const rect = this._mainCanvas.getBoundingClientRect();
        const clickX_display_px = ev.clientX - rect.left;
        const clickY_display_px = ev.clientY - rect.top;


        const scaleToInternalCanvas = this._mainCanvas.width / rect.width;
        const clickX_internal_px = clickX_display_px * scaleToInternalCanvas;
        const clickY_internal_px = clickY_display_px * scaleToInternalCanvas;


        const delayPerSegment = parseInt(this._ui.delayPerSegmentInput.value) || 80;
        const delayPerRow = parseInt(this._ui.delayPerRowInput.value) || 100;
        const qualityFactor = parseInt(this._ui.qualityFactorInput.value) || 6;
        const autoClear = this._ui.autoClearBeforeDrawToggle.checked;

        this._ui.status.textContent = "Pintando objeto Minecraft...";


        if (autoClear) {
          await this._clearCanvas(socket);
          await delay(100);
        }


        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = this._canvasBrushImg.width;
        tempCanvas.height = this._canvasBrushImg.height;
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(this._canvasBrushImg, 0, 0);

        const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;


        const targetImageWidth_px = 64;
        const scaleFactor_drawing = targetImageWidth_px / tempCanvas.width;

        let currentLineStart_asset_px = null;
        let currentLineColor = null;
        let totalLinesDrawn = 0;

        for (let py = 0; py < tempCanvas.height; py += qualityFactor) {
          if (!this._isActive || !this._isDrawingCube) {
            break;
          }

          currentLineStart_asset_px = null;
          currentLineColor = null;

          for (let px = 0; px < tempCanvas.width; px += qualityFactor) {
            const idx = (py * tempCanvas.width + px) * 4;
            const r = imgData[idx],
              g = imgData[idx + 1],
              b = imgData[idx + 2],
              a = imgData[idx + 3];
            const hexColor = "#" + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');

            if (a > 10) {
              if (currentLineStart_asset_px === null) {
                currentLineStart_asset_px = px;
                currentLineColor = hexColor;
              } else if (hexColor !== currentLineColor) {

                const startX_draw = clickX_internal_px + (currentLineStart_asset_px - tempCanvas.width / 2) * scaleFactor_drawing;
                const startY_draw = clickY_internal_px + (py - tempCanvas.height / 2) * scaleFactor_drawing;
                const endX_draw = clickX_internal_px + (px - qualityFactor - tempCanvas.width / 2) * scaleFactor_drawing;
                const endY_draw = startY_draw;

                const thickness = Math.max(1, Math.round(scaleFactor_drawing * qualityFactor));
                this._sendDrawCommand(socket, [startX_draw, startY_draw], [endX_draw, endY_draw], currentLineColor, thickness);
                totalLinesDrawn++;

                currentLineStart_asset_px = px;
                currentLineColor = hexColor;
              }
            } else {
              if (currentLineStart_asset_px !== null) {

                const startX_draw = clickX_internal_px + (currentLineStart_asset_px - tempCanvas.width / 2) * scaleFactor_drawing;
                const startY_draw = clickY_internal_px + (py - tempCanvas.height / 2) * scaleFactor_drawing;
                const endX_draw = clickX_internal_px + (px - qualityFactor - tempCanvas.width / 2) * scaleFactor_drawing;
                const endY_draw = startY_draw;

                const thickness = Math.max(1, Math.round(scaleFactor_drawing * qualityFactor));
                this._sendDrawCommand(socket, [startX_draw, startY_draw], [endX_draw, endY_draw], currentLineColor, thickness);
                totalLinesDrawn++;

                currentLineStart_asset_px = null;
                currentLineColor = null;
              }
            }
          }

          // Draw the remaining segment at the end of the row
          if (currentLineStart_asset_px !== null) {
            const startX_draw = clickX_internal_px + (currentLineStart_asset_px - tempCanvas.width / 2) * scaleFactor_drawing;
            const startY_draw = clickY_internal_px + (py - tempCanvas.height / 2) * scaleFactor_drawing;
            const endX_draw = clickX_internal_px + (tempCanvas.width - 1 - tempCanvas.width / 2) * scaleFactor_drawing;
            const endY_draw = startY_draw;

            const thickness = Math.max(1, Math.round(scaleFactor_drawing * qualityFactor));
            this._sendDrawCommand(socket, [startX_draw, startY_draw], [endX_draw, endY_draw], currentLineColor, thickness);
            totalLinesDrawn++;

            currentLineStart_asset_px = null;
            currentLineColor = null;
          }

          await delay(delayPerRow);
        }

        this._isDrawingCube = false;
        notify("success", `Objeto Minecraft dibujado en el canvas (${totalLinesDrawn} líneas). Visible para todos.`);
        this._ui.status.textContent = "Listo. Haz click de nuevo para otro objeto.";
      }


      _hookCanvasClick() {

        if (!this._mainCanvas) {
          this._mainCanvas = document.getElementById("canvas");
          if (!this._mainCanvas) {
            return;
          }
        }

        if (!this._canvasClickHandlerAttached) {
          this._mainCanvas.addEventListener("click", this._canvasClickHandler);
          this._canvasClickHandlerAttached = true;
          notify("info", "Canvas click handler attached.", "Minecraft Drawer");
        }
      }


      _unhookCanvasClick() {
        if (this._mainCanvas && this._canvasClickHandlerAttached) {
          this._mainCanvas.removeEventListener("click", this._canvasClickHandler);
          this._canvasClickHandlerAttached = false;
          notify("info", "Canvas click handler detached.", "Minecraft Drawer");
        }
      }


      _sendDrawCommand(socket, start_px, end_px, color, thickness, isEraser = false) {

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



        socket.send(`42["drawcmd",0,[${normX1.toFixed(4)},${normY1.toFixed(4)},${normX2.toFixed(4)},${normY2.toFixed(4)},${isEraser},${0 - thickness},"${color}",0,0,{}]]`);
      }


      async _clearCanvas(socket) {
        if (!this._mainCanvas || !this._mainCanvas.getContext('2d')) {
          return;
        }
        if (!socket || socket.readyState !== WebSocket.OPEN) {
          return;
        }

        const ctx = this._mainCanvas.getContext('2d');
        ctx.clearRect(0, 0, this._mainCanvas.width, this._mainCanvas.height);


        const w = this._mainCanvas.width;
        const h = this._mainCanvas.height;
        const clearThickness = 2000;
        const clearColor = '#FFFFFF';
        const steps = 5;

        for (let i = 0; i <= steps; i++) {
          // Horizontal sweep (using pixel coordinates for the internal drawing command)
          this._sendDrawCommand(socket, [0, (i / steps) * h], [w, (i / steps) * h], clearColor, clearThickness, true);
          await delay(5);
          // Vertical sweep (using pixel coordinates for the internal drawing command)
          this._sendDrawCommand(socket, [(i / steps) * w, 0], [(i / steps) * w, h], clearColor, clearThickness, true);
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

            /* Minecraft-Themed CE-like Variables */
            --CE-bg_color: #1c1c1c; /* Very dark background */
            --CE-color: #f8f9fa;   /* Light text color */
            --CE-input-bg: #444;   /* Dark input background */
            --CE-btn-special: #5cb85c; /* Green color (Minecraft theme) */
            --CE-btn-active: #4a8c4a;   /* Darker green active button */
        }

        .minecraft-drawer-menu {
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

        .minecraft-drawer-menu-header {
            cursor: grab;
            background-color: #3f7f3f !important; /* A distinct Minecraft green */
        }

        .minecraft-drawer-menu .btn-close-menu {
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
            color: var(--CE-btn-special);
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
            font-size: 0.9em;
            padding: 5px;
            background-color: var(--CE-input-bg);
            color: var(--CE-color);
            border-color: var(--CE-input-bg);
        }
        .category-nav-button.active {
            background-color: var(--CE-btn-active);
            color: white;
            border-color: var(--CE-btn-active);
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
    function initializeMinecraftDrawer() {
        if (document.body && document.getElementById("canvas")) {
            const drawer = new MinecraftDrawerStandalone();

            // Floating toggle button
            const toggleButton = createElement("button", {
                id: "open-minecraft-drawer-menu",
                style: `
                    position: fixed;
                    bottom: 80px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background-color: #3f7f3f; /* Minecraft Green */
                    color: white;
                    border: none;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    font-size: 1.5em;
                    cursor: pointer;
                    z-index: 9998;
                `
            }, ['💎']);

            document.body.appendChild(toggleButton);

            toggleButton.addEventListener("click", () => {
                const menu = document.getElementById(drawer._containerId);
                if (menu) {
                    const isVisible = menu.style.display === "block";
                    menu.style.display = isVisible ? "none" : "block";
                    if (!isVisible) {
                        notify("info", "Minecraft Drawer Menu opened.", "Minecraft Drawer");
                    } else {
                        notify("info", "Minecraft Drawer Menu closed.", "Minecraft Drawer");
                        drawer._setModuleActive(false); // Deactivate module when closing
                    }
                }
            });

        } else {
            setTimeout(initializeMinecraftDrawer, 100); // Retry if body or canvas is not ready yet
        }
    }

    initializeMinecraftDrawer();

})();