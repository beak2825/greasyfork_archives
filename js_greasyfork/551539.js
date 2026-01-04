// ==UserScript==
// @name         Drawaria SVG Inventory Drawer
// @namespace    drawaria.modded.svgdrawer
// @version      1.0.0
// @description  A module to draw Drawaria.online SVG inventory icons on the canvas using a pixel-to-line algorithm.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/551539/Drawaria%20SVG%20Inventory%20Drawer.user.js
// @updateURL https://update.greasyfork.org/scripts/551539/Drawaria%20SVG%20Inventory%20Drawer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Standalone Utilities and QBit Replacements ---

    // === 1. Notification System (replaces ModBase.notify) ===
    function notify(level, message, moduleName = "SVG Drawer") {
        let color = "#6c757d"; // log
        if (level === "error") color = "#dc3545";
        else if (level === "warning") color = "#ffc107";
        else if (level === "info") color = "#17a2b8";
        else if (level === "success") color = "#28a745";

        console.log(`%c${moduleName}: ${message}`, `color: ${color}`);

        // Optional: Display message in game chat if available
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

    // Simple div container creator
    function createTree(tag, attrs, children) {
        return createElement(tag, attrs, children);
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
            if (!skipNotification) notify("warning", "No active WebSocket connections found.", "SVG Drawer");
            return null;
        }
        return primarySocket;
    }

    // === 4. General Utilities ===
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    // --- Adapted SVGInventoryDrawer Class ---
    class SVGInventoryDrawerStandalone {
      _containerId = 'svg-drawer-menu-container';
      _contentId = 'svg-drawer-content';
      _currentCategory = 'home_furnishings';
      _currentIconIndex = 0; // Index in the ids array of the current category
      _currentIconId = 101; // The actual data-itemid
      _canvasBrushImg = null;
      _currentRotation = 0;
      _ui = {};
      _mainCanvas = null;
      _canvasClickHandler = null;
      _canvasClickHandlerAttached = false;
      _isActive = false;
      _isDrawingIcon = false;
      _identifier = 'svgdrawer';

      // --- ESTRUCTURA DE CATEGORÍAS BASADA EN EL INVENTARIO SVG ---
      _categories = {
        ink_refill: { name: 'Recarga de Tinta', ids: [101, 102, 103], prefix_icon: 'fas fa-pen-nib', icon_base_id: 101 },
        home_furnishings: { name: 'Hogar y Muebles', ids: [11000, 12000, 13000, 14000, 15000, 16000, 17000, 58000, 65000, 66000, 67000, 68000, 69000, 76000, 77000, 80000, 81000, 87000, 88000, 89000, 90000, 91000, 95000, 96000, 97000, 98000, 106000, 107000, 110000, 111000, 112000, 113000, 114000, 116000, 118000, 135000], prefix_icon: 'fas fa-couch' },
        space_military: { name: 'Espacio y Guerra', ids: [18000, 19000, 20000, 21000, 22000, 23000, 24000, 27000, 28000, 29000, 30000, 33000, 38000, 39000, 82000, 83000, 84000, 138000, 139000, 140000, 143000], prefix_icon: 'fas fa-rocket' },
        transport_logistics: { name: 'Transporte', ids: [26000, 34000, 35000, 36000, 37000, 109000, 115000, 119000, 159000, 181000], prefix_icon: 'fas fa-truck' },
        food_fashion: { name: 'Comida y Moda', ids: [40000, 41000, 42000, 43000, 44000, 45000, 46000, 47000, 48000, 49000, 50000, 51000, 52000, 53000, 54000, 55000, 56000, 92000, 93000, 94000, 102000, 103000, 104000, 105000, 120000, 125000, 126000, 127000, 145000, 165000, 166000], prefix_icon: 'fas fa-tshirt' },
        tech_hardware: { name: 'Tecnología', ids: [60000, 61000, 62000, 63000, 64000, 78000, 85000, 86000, 99000, 100000, 101000, 123000, 133000, 134000, 150000, 161000, 162000, 163000], prefix_icon: 'fas fa-laptop' },
        nature_animals: { name: 'Naturaleza y Animales', ids: [59000, 121000, 122000, 146000, 147000, 149000, 151000, 152000, 153000, 155000, 156000, 157000, 160000, 174000, 175000], prefix_icon: 'fas fa-tree' },
        design_misc: { name: 'Diseño y Varios', ids: [70000, 71000, 72000, 73000, 74000, 75000, 79000, 108000, 117000, 124000, 154000, 158000, 164000, 167000, 168000, 169000, 170000, 171000, 172000, 173000, 176000, 177000, 178000, 179000, 180000], prefix_icon: 'fas fa-palette' },
        alphabet: {
          name: 'Alfabeto y Números',
          ids: [
            141000, 141001, 141002, 141035, 141034, 141003, 141004, 141005, 141006, 141007, 141008, 141009,
            141010, 141011, 141012, 141013, 141014, 141015, 141016, 141017, 141018, 141019,
            141020, 141021, 141022, 141023, 141024, 141025, 141026, 141027, 141028, 141029,
            141030, 141031, 141032, 141033
          ],
          prefix_icon: 'fas fa-font'
        }
      };

      constructor() {
        this._canvasClickHandler = this._handleCanvasClick.bind(this);
        this._createMenuStructure();
        this._loadInterface();
        this._setupEventListeners();
        this._setModuleActive(false);
        this._mainCanvas = document.getElementById("canvas");
        this._loadIcon(this._currentCategory, this._currentIconIndex); // Load default icon
        notify("info", " 'SVG Inventory Drawer' Loaded. Click the hammer icon to open.", "SVG Drawer");
      }

      _createMenuStructure() {
          const menuContainer = createElement("div", {
              id: this._containerId,
              className: "svg-drawer-menu",
              style: `
                  position: fixed;
                  top: 10%;
                  left: 50px;
                  width: 300px;
                  display: none; /* Starts hidden */
              `
          });

          const header = createElement("div", {
              className: "svg-drawer-menu-header",
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
          }, [createElement("span", {}, ["📦 SVG Inventory Drawer"]), createButton("X", "btn-close-menu")]);

          header.querySelector(".btn-close-menu").addEventListener("click", () => {
              menuContainer.style.display = "none";
              this._setModuleActive(false); // Deactivate module when closing
          });

          const content = createElement("div", {
              id: this._contentId,
              className: "svg-drawer-menu-content",
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

        const moduleToggleGroup = createTree("div", { className: "module-btn-group", style: "margin-bottom:10px;" });
        this._ui.moduleToggleButton = createButton('<i class="fas fa-power-off"></i> Activar Módulo', 'module-toggle-button');
        this._ui.moduleToggleButton.addEventListener('click', () => this._toggleModuleActive());
        moduleToggleGroup.appendChild(this._ui.moduleToggleButton);
        container.appendChild(moduleToggleGroup);

        container.appendChild(createTree("div", { className: "module-section-title" }, ["Inventario SVG Drawer"]));

        // --- Botones de categoría ---
        const categoryNav = createTree("div", { className: "module-btn-group", style: "flex-wrap: wrap; margin-bottom: 15px;" });
        Object.keys(this._categories).forEach(catKey => {
          const category = this._categories[catKey];
          const iconClass = category.prefix_icon;
          const button = createButton(`<i class="${iconClass}"></i> ${category.name}`, 'artfx-button category-nav-button');
          button.addEventListener('click', () => this._changeCategory(catKey));
          categoryNav.appendChild(button);
          this._ui[`${catKey}NavButton`] = button;
        });
        container.appendChild(categoryNav);

        const previewContainer = createTree("div", { style: "display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:10px;" });
        this._ui.previewCanvas = createTree("canvas", { id: `${this._identifier}-previewCanvas`, width: "96", height: "96", style: "border:1px solid var(--CE-color);background:#222;" });
        previewContainer.appendChild(this._ui.previewCanvas);
        container.appendChild(previewContainer);


        this._ui.commonControlsSection = createTree('div', { id: `${this._identifier}-common-controls` });
        this._ui.commonControlsSection.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:10px;">
                <button id="${this._identifier}-prevBtn" class="artfx-button special">← Anterior</button>
                <button id="${this._identifier}-nextBtn" class="artfx-button special">Siguiente →</button>
            </div>
            <div id="${this._identifier}-info" style="text-align:center;margin-top:5px;font-size:0.9em;color:var(--info);"></div>
            <div class="module-btn-group" style="flex-wrap:wrap;margin-top:15px;">
                <input type="number" id="${this._identifier}-iconIdInput" min="0" value="0" placeholder="Índice del Set" class="module-form-control" style="flex:1 1 60%;">
                <button id="${this._identifier}-acceptIconBtn" class="artfx-button" style="flex:1 1 35%;">Aceptar Índice</button>
                <button id="${this._identifier}-randomIconBtn" class="artfx-button special" style="width:100%;">Set Random</button>
            </div>
            <div class="module-btn-group" style="margin-top:10px;">
                <button id="${this._identifier}-rotateBlockBtn" class="artfx-button special"><i class="fas fa-sync-alt"></i> Rotar Objeto</button>
            </div>
        `;
        container.appendChild(this._ui.commonControlsSection);

        this._ui.prevBtn = this._ui.commonControlsSection.querySelector(`#${this._identifier}-prevBtn`);
        this._ui.nextBtn = this._ui.commonControlsSection.querySelector(`#${this._identifier}-nextBtn`);
        this._ui.info = this._ui.commonControlsSection.querySelector(`#${this._identifier}-info`);
        this._ui.iconIdInput = this._ui.commonControlsSection.querySelector(`#${this._identifier}-iconIdInput`);
        this._ui.acceptIconBtn = this._ui.commonControlsSection.querySelector(`#${this._identifier}-acceptIconBtn`);
        this._ui.randomIconBtn = this._ui.commonControlsSection.querySelector(`#${this._identifier}-randomIconBtn`);
        this._ui.rotateBlockBtn = this._ui.commonControlsSection.querySelector(`#${this._identifier}-rotateBlockBtn`);

        // Optimización de Dibujo
        container.appendChild(createTree("div", { className: "module-section-title", style: "margin-top:15px;" }, ["Optimización de Dibujo"]));
        const optSettingsGrid = createTree("div", { className: "module-btn-group", style: "flex-wrap:wrap;" });

        this._ui.delayPerSegmentInput = createTree("input", { type: "number", min: "0", max: "50", value: "40", title: "Retraso por segmento de línea (ms)", className: "module-form-control", id: `${this._identifier}-delayPerSegmentInput` });
        this._ui.delayPerSegmentLabel = createTree("label", { for: `${this._identifier}-delayPerSegmentInput` }, ["Delay Seg. (ms):"]);
        optSettingsGrid.append(createTree("div", { style: "flex:1 1 48%;" }, [this._ui.delayPerSegmentLabel, this._ui.delayPerSegmentInput]));

        this._ui.delayPerRowInput = createTree("input", { type: "number", min: "0", max: "200", value: "50", title: "Retraso por fila de píxeles (ms)", className: "module-form-control", id: `${this._identifier}-delayPerRowInput` });
        this._ui.delayPerRowLabel = createTree("label", { for: `${this._identifier}-delayPerRowInput` }, ["Delay Fila (ms):"]);
        optSettingsGrid.append(createTree("div", { style: "flex:1 1 48%;" }, [this._ui.delayPerRowLabel, this._ui.delayPerRowInput]));

        this._ui.qualityFactorInput = createTree("input", { type: "number", min: "1", max: "5", value: "4", title: "Factor de calidad (1=mejor, 5=peor, más rápido)", className: "module-form-control", id: `${this._identifier}-qualityFactorInput` });
        this._ui.qualityFactorLabel = createTree("label", { for: `${this._identifier}-qualityFactorInput` }, ["Calidad (1-5):"]);
        optSettingsGrid.append(createTree("div", { style: "flex:1 1 48%;" }, [this._ui.qualityFactorLabel, this._ui.qualityFactorInput]));

        container.appendChild(optSettingsGrid);

        this._ui.status = createTree("div", { style: "text-align:center;margin-top:10px;font-size:0.85em;color:var(--info);" }, ["Haz clic en el canvas principal para dibujar el SVG."]);
        container.appendChild(this._ui.status);
      }

      _setupEventListeners() {
        this._ui.prevBtn.addEventListener('click', () => this._changeIconIndex(-1));
        this._ui.nextBtn.addEventListener('click', () => this._changeIconIndex(1));
        this._ui.iconIdInput.addEventListener('change', () => this._loadIconByIndex(parseInt(this._ui.iconIdInput.value) || 0));
        this._ui.acceptIconBtn.addEventListener('click', () => this._loadIconByIndex(parseInt(this._ui.iconIdInput.value) || 0));
        this._ui.randomIconBtn.addEventListener('click', () => this._loadRandomIcon());
        this._ui.rotateBlockBtn.addEventListener('click', () => this._rotateBrushImage());

        Object.keys(this._categories).forEach(catKey => {
          this._ui[`${catKey}NavButton`].addEventListener('click', () => this._changeCategory(catKey));
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
          this._changeCategory(this._currentCategory); // Ensure UI reflects current category state
        } else {
          this._unhookCanvasClick();
          this._ui.moduleToggleButton.innerHTML = '<i class="fas fa-power-off"></i> Activar Módulo';
          this._ui.moduleToggleButton.classList.remove('active');
          this._isDrawingIcon = false;
          this._ui.status.textContent = "Módulo inactivo. Actívalo para usarlo.";
        }

        const controlsToToggle = [
          this._ui.delayPerSegmentInput, this._ui.delayPerRowInput, this._ui.qualityFactorInput,
          this._ui.prevBtn, this._ui.nextBtn, this._ui.iconIdInput, this._ui.acceptIconBtn,
          this._ui.randomIconBtn, this._ui.rotateBlockBtn
        ];
        controlsToToggle.forEach(el => {
          if (el) el.disabled = !active;
        });

        this._ui.previewCanvas.style.opacity = active ? '1' : '0.5';

        Object.keys(this._categories).forEach(catKey => {
            if (this._ui[`${catKey}NavButton`]) {
                this._ui[`${catKey}NavButton`].disabled = !active;
            }
        });

        // Handle common controls visibility based on active state
        this._ui.commonControlsSection.style.opacity = active ? '1' : '0.5';
        this._ui.commonControlsSection.style.pointerEvents = active ? 'auto' : 'none';
      }

      _changeCategory(newCategoryKey) {
        Object.keys(this._categories).forEach(catKey => {
          if (this._ui[`${catKey}NavButton`]) {
            this._ui[`${catKey}NavButton`].classList.remove('active');
          }
        });

        this._currentCategory = newCategoryKey;
        this._currentIconIndex = 0; // Reset index to the first item
        this._currentRotation = 0;

        this._loadIcon(this._currentCategory, this._currentIconIndex);

        const newCategoryButton = this._ui[`${newCategoryKey}NavButton`];
        if (newCategoryButton) {
          newCategoryButton.classList.add('active');
        }
        this._ui.status.textContent = `Categoría: ${this._categories[newCategoryKey].name}.`;
      }

      _updateInfo() {
        const category = this._categories[this._currentCategory];
        const maxIndex = category.ids.length - 1;
        this._currentIconId = category.ids[this._currentIconIndex];
        this._ui.info.textContent = `Set #${this._currentIconIndex} (ID: ${this._currentIconId}) / ${maxIndex}`;
        this._ui.iconIdInput.max = maxIndex;
        this._ui.iconIdInput.value = this._currentIconIndex;
      }

      _changeIconIndex(delta) {
        const category = this._categories[this._currentCategory];
        if (!category) return;
        const maxIndex = category.ids.length - 1;

        let n = this._currentIconIndex + delta;
        n = clamp(n, 0, maxIndex);
        this._loadIcon(this._currentCategory, n);
      }

      _loadIconByIndex(index) {
        const category = this._categories[this._currentCategory];
        if (!category) return;
        const maxIndex = category.ids.length - 1;

        let n = clamp(index, 0, maxIndex);
        this._loadIcon(this._currentCategory, n);
      }

      _loadRandomIcon() {
        const category = this._categories[this._currentCategory];
        if (!category) return;
        const maxIndex = category.ids.length - 1;
        const randomIndex = Math.floor(Math.random() * (maxIndex + 1));
        this._loadIcon(this._currentCategory, randomIndex);
      }

      async _loadIcon(categoryKey, index) {
        if (!this._isActive) {
             // Still load the icon for preview even if not active, but skip status updates
             // and only update the image if the UI is open.
        }

        const category = this._categories[categoryKey];
        if (!category || index >= category.ids.length) return;

        this._currentIconIndex = index;
        this._updateInfo();

        const baseId = category.ids[index];

        // Lógica para determinar el nombre del archivo SVG (Mapeo especial basado en el análisis de tu archivo de URLs)
        let iconFileId = baseId + 1;

        if (categoryKey === 'ink_refill') {
            iconFileId = 101;
        } else if (baseId === 25000) {
            iconFileId = 25002;
        } else if (baseId === 42000) {
            iconFileId = 42005;
        } else if (baseId === 49000) {
            iconFileId = 49022;
        } else if (baseId === 141035) {
            iconFileId = 141036;
        } else if (baseId === 141034) {
            iconFileId = 141035;
        }

        const imageUrl = `https://drawaria.online/img/inventory/${iconFileId}.svg`;
        this._ui.status.textContent = `Cargando set: ${this._currentIconId} (${category.name})...`;

        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          this._canvasBrushImg = img;
          this._currentRotation = 0; // Reset rotation on new icon load
          this._drawPreviewWithRotation(img, this._currentRotation);
          if (this._isActive) {
            this._ui.status.textContent = "Listo. Haz click en el canvas principal para dibujar.";
          }
        };
        img.onerror = () => {
          this._canvasBrushImg = null;
          this._drawPreviewError();
          if (this._isActive) {
            notify("error", `Error al cargar SVG para ID: ${baseId}.`);
            this._ui.status.textContent = `Error al cargar SVG para ID: ${baseId}.`;
          }
        };
        img.src = imageUrl;
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

        const delayPerSegment = parseInt(this._ui.delayPerSegmentInput.value) || 1;
        const delayPerRow = parseInt(this._ui.delayPerRowInput.value) || 20;
        const qualityFactor = parseInt(this._ui.qualityFactorInput.value) || 1;
        const targetDrawingSize_px = 64; // Tamaño predeterminado para iconos SVG

        this._ui.status.textContent = "Dibujando objeto SVG...";

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
        notify("success", `Objeto SVG dibujado en el canvas (${totalLinesDrawn} líneas). Visible para todos.`);
        this._ui.status.textContent = "Listo. Haz click de nuevo para otro objeto.";
      }


      _drawPreviewWithRotation(img, angle) {
        const ctx = this._ui.previewCanvas.getContext("2d");
        const previewSize = 96;
        ctx.clearRect(0, 0, previewSize, previewSize);

        if (!img) {
          ctx.fillStyle = "var(--danger, #d00)";
          ctx.font = "14px Arial";
          ctx.fillText("NO IMG", 18, 55);
          return;
        }

        ctx.save();
        ctx.translate(previewSize / 2, previewSize / 2);
        ctx.rotate(angle * Math.PI / 180); // Rotate

        let drawWidth, drawHeight;
        const maxDim = Math.max(img.width, img.height);
        const scale = previewSize / maxDim * 0.9; // Scale to fit, leave a small margin
        drawWidth = img.width * scale;
        drawHeight = img.height * scale;

        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();
      }


      _drawPreviewError() {
        const ctx = this._ui.previewCanvas.getContext("2d");
        ctx.clearRect(0, 0, 96, 96);
        ctx.fillStyle = "var(--danger, #d00)";
        ctx.font = "14px Arial";
        ctx.fillText("NO IMG", 18, 55);
      }


      _rotateBrushImage() {
        if (!this._canvasBrushImg) {
          return;
        }
        this._currentRotation = (this._currentRotation + 90) % 360;
        this._drawPreviewWithRotation(this._canvasBrushImg, this._currentRotation);
        this._ui.status.textContent = `Objeto rotado a ${this._currentRotation}°. Listo para dibujar.`;
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
          notify("info", "Canvas click handler attached.", "SVG Drawer");
        }
      }

      _unhookCanvasClick() {
        if (this._mainCanvas && this._canvasClickHandlerAttached) {
          this._mainCanvas.removeEventListener("click", this._canvasClickHandler);
          this._canvasClickHandlerAttached = false;
          notify("info", "Canvas click handler detached.", "SVG Drawer");
        }
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

          // Draw locally for immediate feedback (only if canvas is available)
          const ctx = this._mainCanvas.getContext('2d');
          ctx.strokeStyle = color;
          ctx.lineWidth = thickness;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(start_px[0], start_px[1]);
          ctx.lineTo(end_px[0], end_px[1]);
          ctx.stroke();

          // Send command to the server
          // The thickness is negative for the brush tool in drawaria's protocol.
          socket.send(`42["drawcmd",0,[${normX1.toFixed(4)},${normY1.toFixed(4)},${normX2.toFixed(4)},${normY2.toFixed(4)},false,${0 - thickness},"${color}",0,0,{}]]`);
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

            /* CE-like Variables */
            --CE-bg_color: #343434; /* Dark background */
            --CE-color: #f8f9fa;   /* Light text color */
            --CE-input-bg: #444;   /* Dark input background */
            --CE-btn-special: var(--orange, #ffc107); /* Special button color */
            --CE-btn-active: var(--info, #17a2b8);   /* Active button color */
        }

        .svg-drawer-menu {
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

        .svg-drawer-menu-header {
            cursor: grab;
        }

        .svg-drawer-menu .btn-close-menu {
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
        }
        .artfx-button.special {
            background-color: var(--CE-btn-special);
            color: var(--dark);
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
            flex: 1 1 30%; /* Allow wrapping */
            font-size: 0.8em;
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
        .module-btn-group > div input {
             width: 100%;
        }
    `);

    // --- Module Initialization ---
    function initializeSVGDrawer() {
        if (document.body && document.getElementById("canvas")) {
            const drawer = new SVGInventoryDrawerStandalone();

            // Floating toggle button
            const toggleButton = createElement("button", {
                id: "open-svg-drawer-menu",
                style: `
                    position: fixed;
                    bottom: 80px; /* Position above the kick tools button if present */
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background-color: #dc3545; /* Unique color */
                    color: white;
                    border: none;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    font-size: 1.5em;
                    cursor: pointer;
                    z-index: 9998;
                `
            }, ['📦']);

            document.body.appendChild(toggleButton);

            toggleButton.addEventListener("click", () => {
                const menu = document.getElementById(drawer._containerId);
                if (menu) {
                    const isVisible = menu.style.display === "block";
                    menu.style.display = isVisible ? "none" : "block";
                    if (!isVisible) {
                        notify("info", "SVG Drawer Menu opened.", "SVG Drawer");
                        // Re-trigger load on show if canvas brush is null (i.e. first time opening)
                        if (!drawer._canvasBrushImg) {
                            drawer._loadIcon(drawer._currentCategory, drawer._currentIconIndex);
                        }
                    } else {
                        notify("info", "SVG Drawer Menu closed.", "SVG Drawer");
                        drawer._setModuleActive(false); // Deactivate module when closing
                    }
                }
            });

        } else {
            setTimeout(initializeSVGDrawer, 100); // Retry if body or canvas is not ready yet
        }
    }

    initializeSVGDrawer();

})();