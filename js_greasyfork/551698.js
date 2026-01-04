// ==UserScript==
// @name         Drawaria Halloween Icon Drawer (Halloween)
// @namespace    drawaria.modded.halloween
// @version      1.0.0
// @description  Un módulo para dibujar íconos temáticos de Halloween de Flaticon en el canvas de Drawaria.online usando un algoritmo de píxel a línea.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/551698/Drawaria%20Halloween%20Icon%20Drawer%20%28Halloween%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551698/Drawaria%20Halloween%20Icon%20Drawer%20%28Halloween%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Definición de la Fuente de Íconos de Halloween (Flaticon PNGs) ---

    // Estructura adaptada de la lista proporcionada.
    const HALLOWEEN_ICONS_DATA = [
        { name: "Pumpkin Face", id: 685842, url: "https://cdn-icons-png.flaticon.com/128/685/685842.png" },
        { name: "Spider Web", id: 5810219, url: "https://cdn-icons-png.flaticon.com/128/5810/5810219.png" },
        { name: "Spooky Ghost", id: 8584871, url: "https://cdn-icons-png.flaticon.com/128/8584/8584871.png" },
        { name: "Simple Pumpkin", id: 685859, url: "https://cdn-icons-png.flaticon.com/128/685/685859.png" },
        { name: "Haunted House", id: 8602728, url: "https://cdn-icons-png.flaticon.com/128/8602/8602728.png" },
        { name: "Bat Flying", id: 3488033, url: "https://cdn-icons-png.flaticon.com/128/3488/3488033.png" },
        { name: "Pumpkin Icon", id: 6046872, url: "https://cdn-icons-png.flaticon.com/128/6046/6046872.png" },
        { name: "Spooky House", id: 218167, url: "https://cdn-icons-png.flaticon.com/128/218/218167.png" },
        { name: "Witch Brooms", id: 8726312, url: "https://cdn-icons-png.flaticon.com/128/8726/8726312.png" },
        { name: "Jack-o-Lantern", id: 685844, url: "https://cdn-icons-png.flaticon.com/128/685/685844.png" },
        { name: "Smiling Pumpkin", id: 3330445, url: "https://cdn-icons-png.flaticon.com/128/3330/3330445.png" },
        { name: "Classic Ghost", id: 477104, url: "https://cdn-icons-png.flaticon.com/128/477/477104.png" },
        { name: "Ghost Waving", id: 2433014, url: "https://cdn-icons-png.flaticon.com/128/2433/2433014.png" },
        { name: "Bat Silhouette", id: 218231, url: "https://cdn-icons-png.flaticon.com/128/218/218231.png" },
        { name: "Halloween Text", id: 6433176, url: "https://cdn-icons-png.flaticon.com/128/6433/6433176.png" },
        { name: "Candle Pumpkin", id: 8745230, url: "https://cdn-icons-png.flaticon.com/128/8745/8745230.png" },
        { name: "Spiderweb Corner", id: 8435425, url: "https://cdn-icons-png.flaticon.com/128/8435/8435425.png" },
        { name: "Happy Face", id: 8771660, url: "https://cdn-icons-png.flaticon.com/128/8771/8771660.png" },
        { name: "Flapping Bat", id: 8493880, url: "https://cdn-icons-png.flaticon.com/128/8493/8493880.png" },
        { name: "Cute Ghost", id: 8463613, url: "https://cdn-icons-png.flaticon.com/128/8463/8463613.png" },
        { name: "Spider Crawler", id: 5482892, url: "https://cdn-icons-png.flaticon.com/128/5482/5482892.png" },
        { name: "Eye Ball", id: 8592190, url: "https://cdn-icons-png.flaticon.com/128/8592/8592190.png" },
        { name: "Multiple Bats", id: 17923556, url: "https://cdn-icons-png.flaticon.com/128/17923/17923556.png" },
        { name: "Candy Corn", id: 3472017, url: "https://cdn-icons-png.flaticon.com/128/3472/3472017.png" },
        { name: "Eyeball 2", id: 12438597, url: "https://cdn-icons-png.flaticon.com/128/12438/12438597.png" },
        { name: "Halloween Banner", id: 6433146, url: "https://cdn-icons-png.flaticon.com/128/6433/6433146.png" },
        { name: "Witch Hat", id: 1235127, url: "https://cdn-icons-png.flaticon.com/128/1235/1235127.png" },
        { name: "Happy Halloween", id: 5518300, url: "https://cdn-icons-png.flaticon.com/128/5518/5518300.png" },
        { name: "Ghost Face", id: 17930958, url: "https://cdn-icons-png.flaticon.com/128/17930/17930958.png" },
        { name: "Zombie Head", id: 5420744, url: "https://cdn-icons-png.flaticon.com/128/5420/5420744.png" },
        { name: "Spell Book", id: 12402624, url: "https://cdn-icons-png.flaticon.com/128/12402/12402624.png" },
        { name: "Witch Ghost", id: 3277320, url: "https://cdn-icons-png.flaticon.com/128/3277/3277320.png" },
        { name: "Halloween Candy", id: 19024707, url: "https://cdn-icons-png.flaticon.com/128/19024/19024707.png" },
        { name: "Party Hat", id: 15618561, url: "https://cdn-icons-png.flaticon.com/128/15618/15618561.png" },
        { name: "Candy Bag", id: 3684878, url: "https://cdn-icons-png.flaticon.com/128/3684/3684878.png" },
        { name: "Garland Deco", id: 8586578, url: "https://cdn-icons-png.flaticon.com/128/8586/8586578.png" },
        { name: "Ghost Balloons", id: 8490297, url: "https://cdn-icons-png.flaticon.com/128/8490/8490297.png" },
        { name: "Spooky Tree", id: 8490316, url: "https://cdn-icons-png.flaticon.com/128/8490/8490316.png" },
        { name: "Haunted Mansion", id: 218272, url: "https://cdn-icons-png.flaticon.com/128/218/218272.png" },
        { name: "Bat Simple", id: 2250418, url: "https://cdn-icons-png.flaticon.com/128/2250/2250418.png" },
        { name: "Pumpkin Scared", id: 685853, url: "https://cdn-icons-png.flaticon.com/128/685/685853.png" },
        { name: "Witch House", id: 8595345, url: "https://cdn-icons-png.flaticon.com/128/8595/8595345.png" },
        { name: "Bat Swarm", id: 3599042, url: "https://cdn-icons-png.flaticon.com/128/3599/3599042.png" },
        { name: "Happy Face 2", id: 8771648, url: "https://cdn-icons-png.flaticon.com/128/8771/8771648.png" },
        { name: "Old Haunted House", id: 581551, url: "https://cdn-icons-png.flaticon.com/128/581/581551.png" },
        { name: "Blood Splatter", id: 2068494, url: "https://cdn-icons-png.flaticon.com/128/2068/2068494.png" },
        { name: "Witch Fingers", id: 19031256, url: "https://cdn-icons-png.flaticon.com/128/19031/19031256.png" },
        { name: "Bat Outline", id: 8493828, url: "https://cdn-icons-png.flaticon.com/128/8493/8493828.png" },
        { name: "Spartan Helmet", id: 3471515, url: "https://cdn-icons-png.flaticon.com/128/3471/3471515.png" }, // Weird inclusion, keeping for completeness
        { name: "Costume", id: 8490370, url: "https://cdn-icons-png.flaticon.com/128/8490/8490370.png" },
        { name: "Group of Bats", id: 3600706, url: "https://cdn-icons-png.flaticon.com/128/3600/3600706.png" },
        { name: "Candy Lollipop", id: 8537841, url: "https://cdn-icons-png.flaticon.com/128/8537/8537841.png" },
        { name: "Crescent Moon", id: 3515040, url: "https://cdn-icons-png.flaticon.com/128/3515/3515040.png" },
        { name: "Witch Hat 2", id: 2179197, url: "https://cdn-icons-png.flaticon.com/128/2179/2179197.png" },
        { name: "Bats in the Night", id: 8490423, url: "https://cdn-icons-png.flaticon.com/128/8490/8490423.png" },
        { name: "Bat Simple 2", id: 8493854, url: "https://cdn-icons-png.flaticon.com/128/8493/8493854.png" },
        { name: "Black Evil Cat", id: 12430, url: "https://cdn-icons-png.flaticon.com/128/12/12430.png" },
        { name: "Pumpkin Frown", id: 3330447, url: "https://cdn-icons-png.flaticon.com/128/3330/3330447.png" },
        { name: "Ghost Flying", id: 477155, url: "https://cdn-icons-png.flaticon.com/128/477/477155.png" },
        { name: "Ghost Face Mask", id: 1141463, url: "https://cdn-icons-png.flaticon.com/128/1141/1141463.png" },
        { name: "Jack O Lantern 2", id: 2150119, url: "https://cdn-icons-png.flaticon.com/128/2150/2150119.png" },
        { name: "Bat Scared", id: 2260495, url: "https://cdn-icons-png.flaticon.com/128/2260/2260495.png" },
        { name: "Witch", id: 17923484, url: "https://cdn-icons-png.flaticon.com/128/17923/17923484.png" },
        { name: "Witch Hat Simple", id: 218200, url: "https://cdn-icons-png.flaticon.com/128/218/218200.png" },
        { name: "Bare Tree", id: 8490308, url: "https://cdn-icons-png.flaticon.com/128/8490/8490308.png" },
        { name: "Coffin", id: 2178247, url: "https://cdn-icons-png.flaticon.com/128/2178/2178247.png" },
        { name: "Pumpkin Outline", id: 3330446, url: "https://cdn-icons-png.flaticon.com/128/3330/3330446.png" },
        { name: "Garland Banner", id: 12403088, url: "https://cdn-icons-png.flaticon.com/128/12403/12403088.png" },
        { name: "Haunted House Small", id: 8595330, url: "https://cdn-icons-png.flaticon.com/128/8595/8595330.png" },
        { name: "Halloween Party", id: 2682288, url: "https://cdn-icons-png.flaticon.com/128/2682/2682288.png" },
        { name: "Cauldron", id: 7340981, url: "https://cdn-icons-png.flaticon.com/128/7340/7340981.png" },
        { name: "Zombie Walking", id: 12555033, url: "https://cdn-icons-png.flaticon.com/128/12555/12555033.png" },
        { name: "Ghost Scared", id: 7823267, url: "https://cdn-icons-png.flaticon.com/128/7823/7823267.png" },
        { name: "Monster Fingers", id: 19031259, url: "https://cdn-icons-png.flaticon.com/128/19031/19031259.png" },
        { name: "Mummy", id: 3384529, url: "https://cdn-icons-png.flaticon.com/128/3384/3384529.png" },
        { name: "Evil Eye", id: 5842189, url: "https://cdn-icons-png.flaticon.com/128/5842/5842189.png" },
        { name: "Floating Ghost", id: 3561168, url: "https://cdn-icons-png.flaticon.com/128/3561/3561168.png" },
        { name: "Happy Halloween Text", id: 12403247, url: "https://cdn-icons-png.flaticon.com/128/12403/12403247.png" },
        { name: "Spooky Castle", id: 8594644, url: "https://cdn-icons-png.flaticon.com/128/8594/8594644.png" },
        { name: "Trick or Treat", id: 2144346, url: "https://cdn-icons-png.flaticon.com/128/2144/2144346.png" },
        { name: "Muffin with Eye", id: 19031252, url: "https://cdn-icons-png.flaticon.com/128/19031/19031252.png" },
        { name: "Witch Hat Simple 2", id: 1234570, url: "https://cdn-icons-png.flaticon.com/128/1234/1234570.png" },
        { name: "Ghost Cute", id: 8536271, url: "https://cdn-icons-png.flaticon.com/128/8536/8536271.png" },
        { name: "Haunted Church", id: 573617, url: "https://cdn-icons-png.flaticon.com/128/573/573617.png" },
        { name: "Party Time", id: 12403832, url: "https://cdn-icons-png.flaticon.com/128/12403/12403832.png" },
        { name: "Garland Lights", id: 8586600, url: "https://cdn-icons-png.flaticon.com/128/8586/8586600.png" },
        { name: "Pumpkin Outline 2", id: 1123876, url: "https://cdn-icons-png.flaticon.com/128/1123/1123876.png" },
        { name: "Zombie Hand", id: 12403095, url: "https://cdn-icons-png.flaticon.com/128/12403/12403095.png" },
        { name: "Dracula", id: 3384516, url: "https://cdn-icons-png.flaticon.com/128/3384/3384516.png" },
        { name: "Black Cat", id: 2179088, url: "https://cdn-icons-png.flaticon.com/128/2179/2179088.png" },
        { name: "Haunted Forest House", id: 573566, url: "https://cdn-icons-png.flaticon.com/128/573/573566.png" },
        { name: "Potion Bottle", id: 3330442, url: "https://cdn-icons-png.flaticon.com/128/3330/3330442.png" },
        { name: "Happy Halloween Banner", id: 12402455, url: "https://cdn-icons-png.flaticon.com/128/12402/12402455.png" },
        { name: "Scary Halloween", id: 3684854, url: "https://cdn-icons-png.flaticon.com/128/3684/3684854.png" },
        { name: "Muffin Simple", id: 19031255, url: "https://cdn-icons-png.flaticon.com/128/19031/19031255.png" },
        { name: "Spider Outline", id: 8503700, url: "https://cdn-icons-png.flaticon.com/128/8503/8503700.png" },
        // Añadir más íconos según sea necesario
    ];

    // --- Standalone Utilities and QBit Replacements (Same as Original) ---

    // === 1. Notification System ===
    function notify(level, message, moduleName = "Halloween Drawer") {
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

    // === 2. domMake Replacements ===
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

    function createTree(tag, attrs, children) {
        return createElement(tag, attrs, children);
    }

    // === 3. Socket Management ===
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
            if (!skipNotification) notify("warning", "No active WebSocket connections found.", "Halloween Drawer");
            return null;
        }
        return primarySocket;
    }

    // === 4. General Utilities ===
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));


    // --- ADAPTED HALLOWEEN DRAWER CLASS ---
    class HalloweenIconDrawerStandalone {
      _containerId = 'halloween-drawer-menu-container';
      _contentId = 'halloween-drawer-content';
      _currentCategory = 'halloween_main';
      _currentIconIndex = 0;
      _currentIconId = HALLOWEEN_ICONS_DATA[0].id; // The actual ID/Name of the icon
      _canvasBrushImg = null;
      _currentRotation = 0;
      _ui = {};
      _mainCanvas = null;
      _canvasClickHandler = null;
      _canvasClickHandlerAttached = false;
      _isActive = false;
      _isDrawingIcon = false;
      _identifier = 'halloweendrawer';

      // --- NUEVA ESTRUCTURA DE CATEGORÍAS (Simplificada) ---
      _categories = {
        halloween_main: {
          name: 'Iconos de Halloween (Flaticon)',
          data: HALLOWEEN_ICONS_DATA,
          prefix_icon: 'fas fa-ghost'
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
        notify("info", " 'Halloween Icon Drawer' Loaded. Click the box icon to open.", "Halloween Drawer");
      }

      // --- MÉTODOS DE UI Y DRAG (Copiados del Original) ---

      _createMenuStructure() {
          const menuContainer = createElement("div", {
              id: this._containerId,
              className: "svg-drawer-menu", // Reutilizar el estilo original
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
                  background-color: var(--danger, #dc3545); /* Changed color for theme */
                  color: white;
                  cursor: grab;
                  border-top-left-radius: .25rem;
                  border-top-right-radius: .25rem;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
              `
          }, [createElement("span", {}, ["👻 Halloween Icon Drawer"]), createButton("X", "btn-close-menu")]);

          header.querySelector(".btn-close-menu").addEventListener("click", () => {
              menuContainer.style.display = "none";
              this._setModuleActive(false);
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

        container.appendChild(createTree("div", { className: "module-section-title" }, ["Selección de Ícono"]));

        // --- Botones de categoría (Simplificado a solo Halloween) ---
        const categoryNav = createTree("div", { className: "module-btn-group", style: "flex-wrap: wrap; margin-bottom: 15px;" });
        const catKey = 'halloween_main';
        const category = this._categories[catKey];
        const iconClass = category.prefix_icon;
        const button = createButton(`<i class="${iconClass}"></i> ${category.name}`, 'artfx-button category-nav-button');
        button.addEventListener('click', () => this._changeCategory(catKey));
        categoryNav.appendChild(button);
        this._ui[`${catKey}NavButton`] = button;
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

        // Optimización de Dibujo (Copiado del Original)
        container.appendChild(createTree("div", { className: "module-section-title", style: "margin-top:15px;" }, ["Optimización de Dibujo"]));
        const optSettingsGrid = createTree("div", { className: "module-btn-group", style: "flex-wrap:wrap;" });

        this._ui.delayPerSegmentInput = createTree("input", { type: "number", min: "0", max: "50", value: "20", title: "Retraso por segmento de línea (ms)", className: "module-form-control", id: `${this._identifier}-delayPerSegmentInput` }); // Default lowered for PNGs
        this._ui.delayPerSegmentLabel = createTree("label", { for: `${this._identifier}-delayPerSegmentInput` }, ["Delay Seg. (ms):"]);
        optSettingsGrid.append(createTree("div", { style: "flex:1 1 48%;" }, [this._ui.delayPerSegmentLabel, this._ui.delayPerSegmentInput]));

        this._ui.delayPerRowInput = createTree("input", { type: "number", min: "0", max: "200", value: "30", title: "Retraso por fila de píxeles (ms)", className: "module-form-control", id: `${this._identifier}-delayPerRowInput` }); // Default lowered for PNGs
        this._ui.delayPerRowLabel = createTree("label", { for: `${this._identifier}-delayPerRowInput` }, ["Delay Fila (ms):"]);
        optSettingsGrid.append(createTree("div", { style: "flex:1 1 48%;" }, [this._ui.delayPerRowLabel, this._ui.delayPerRowInput]));

        this._ui.qualityFactorInput = createTree("input", { type: "number", min: "1", max: "5", value: "4", title: "Factor de calidad (1=mejor, 5=peor, más rápido)", className: "module-form-control", id: `${this._identifier}-qualityFactorInput` }); // Default set to 2 for better PNG quality
        this._ui.qualityFactorLabel = createTree("label", { for: `${this._identifier}-qualityFactorInput` }, ["Calidad (1-5):"]);
        optSettingsGrid.append(createTree("div", { style: "flex:1 1 48%;" }, [this._ui.qualityFactorLabel, this._ui.qualityFactorInput]));

        container.appendChild(optSettingsGrid);

        this._ui.status = createTree("div", { style: "text-align:center;margin-top:10px;font-size:0.85em;color:var(--info);" }, ["Haz clic en el canvas principal para dibujar el ícono."]);
        container.appendChild(this._ui.status);

        // Activar el botón de categoría por defecto
        if (this._ui[`halloween_mainNavButton`]) {
            this._ui[`halloween_mainNavButton`].classList.add('active');
        }
      }

      _setupEventListeners() {
        this._ui.prevBtn.addEventListener('click', () => this._changeIconIndex(-1));
        this._ui.nextBtn.addEventListener('click', () => this._changeIconIndex(1));
        this._ui.iconIdInput.addEventListener('change', () => this._loadIconByIndex(parseInt(this._ui.iconIdInput.value) || 0));
        this._ui.acceptIconBtn.addEventListener('click', () => this._loadIconByIndex(parseInt(this._ui.iconIdInput.value) || 0));
        this._ui.randomIconBtn.addEventListener('click', () => this._loadRandomIcon());
        this._ui.rotateBlockBtn.addEventListener('click', () => this._rotateBrushImage());

        // Solo un botón de categoría en esta versión
        const catKey = 'halloween_main';
        if (this._ui[`${catKey}NavButton`]) {
            this._ui[`${catKey}NavButton`].addEventListener('click', () => this._changeCategory(catKey));
        }
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
          this._ui.moduleToggleButton.style.backgroundColor = 'var(--success)';
        } else {
          this._unhookCanvasClick();
          this._ui.moduleToggleButton.innerHTML = '<i class="fas fa-power-off"></i> Activar Módulo';
          this._ui.moduleToggleButton.classList.remove('active');
          this._ui.moduleToggleButton.style.backgroundColor = 'var(--danger)';
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

        const catKey = 'halloween_main';
        if (this._ui[`${catKey}NavButton`]) {
            this._ui[`${catKey}NavButton`].disabled = !active;
        }

        this._ui.commonControlsSection.style.opacity = active ? '1' : '0.5';
        this._ui.commonControlsSection.style.pointerEvents = active ? 'auto' : 'none';
      }

      _changeCategory(newCategoryKey) {
        // En esta versión solo hay una categoría, pero mantenemos la función
        const oldCategoryButton = this._ui[`${this._currentCategory}NavButton`];
        if (oldCategoryButton) oldCategoryButton.classList.remove('active');

        this._currentCategory = newCategoryKey;
        this._currentIconIndex = 0;
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
        const iconData = category.data[this._currentIconIndex];
        const maxIndex = category.data.length - 1;

        this._currentIconId = iconData.id;
        this._ui.info.textContent = `[${iconData.name}] (Index: ${this._currentIconIndex}) / ${maxIndex}`;
        this._ui.iconIdInput.max = maxIndex;
        this._ui.iconIdInput.value = this._currentIconIndex;
      }

      _changeIconIndex(delta) {
        const category = this._categories[this._currentCategory];
        if (!category) return;
        const maxIndex = category.data.length - 1;

        let n = this._currentIconIndex + delta;
        n = clamp(n, 0, maxIndex);
        this._loadIcon(this._currentCategory, n);
      }

      _loadIconByIndex(index) {
        const category = this._categories[this._currentCategory];
        if (!category) return;
        const maxIndex = category.data.length - 1;

        let n = clamp(index, 0, maxIndex);
        this._loadIcon(this._currentCategory, n);
      }

      _loadRandomIcon() {
        const category = this._categories[this._currentCategory];
        if (!category) return;
        const maxIndex = category.data.length - 1;
        const randomIndex = Math.floor(Math.random() * (maxIndex + 1));
        this._loadIcon(this._currentCategory, randomIndex);
      }

      async _loadIcon(categoryKey, index) {
        const category = this._categories[categoryKey];
        if (!category || index >= category.data.length) return;

        this._currentIconIndex = index;
        this._updateInfo();

        const iconData = category.data[index];
        const imageUrl = iconData.url;
        this._ui.status.textContent = `Cargando: ${iconData.name}...`;

        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          this._canvasBrushImg = img;
          this._currentRotation = 0; // Reset rotation on new icon load
          this._drawPreviewWithRotation(img, this._currentRotation);
          if (this._isActive) {
            this._ui.status.textContent = `Listo. Ícono: ${iconData.name}. Haz click en el canvas.`;
          }
        };
        img.onerror = () => {
          this._canvasBrushImg = null;
          this._drawPreviewError();
          if (this._isActive) {
            notify("error", `Error al cargar ícono: ${iconData.name}.`);
            this._ui.status.textContent = `Error al cargar: ${iconData.name}.`;
          }
        };
        img.src = imageUrl;
      }

      // --- LÓGICA DE DIBUJO (Copiada del Original) ---
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
        const targetDrawingSize_px = 64;

        this._ui.status.textContent = "Dibujando ícono de Halloween...";

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

                        if (delayPerSegment > 0) await delay(delayPerSegment);

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

                        if (delayPerSegment > 0) await delay(delayPerSegment);

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

                if (delayPerSegment > 0) await delay(delayPerSegment);

                currentLineStart_asset_px = null;
                currentLineColor = null;
            }
            if (delayPerRow > 0) await delay(delayPerRow);
        }

        this._isDrawingIcon = false;
        notify("success", `Ícono de Halloween dibujado en el canvas (${totalLinesDrawn} líneas). Visible para todos.`);
        this._ui.status.textContent = "Listo. Haz click de nuevo para otro ícono.";
      }

      // --- MÉTODOS AUXILIARES (Copiados del Original) ---

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
        ctx.fillStyle = "var(--danger, #d00)";
        ctx.font = "14px Arial";
        ctx.fillText("ERROR", 18, 55);
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
          notify("info", "Canvas click handler attached.", "Halloween Drawer");
        }
      }

      _unhookCanvasClick() {
        if (this._mainCanvas && this._canvasClickHandlerAttached) {
          this._mainCanvas.removeEventListener("click", this._canvasClickHandler);
          this._canvasClickHandlerAttached = false;
          notify("info", "Canvas click handler detached.", "Halloween Drawer");
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

    // --- Style Injection (Modificado para un toque de Halloween) ---
    GM_addStyle(`
        /* Custom Variables (Halloween Theme) */
        :root {
            --light: #f8f9fa;
            --dark: #212529;
            --primary: #FF7F50; /* Coral for Halloween pop */
            --secondary: #6c757d;
            --success: #28a745;
            --info: #17a2b8;
            --danger: #dc3545; /* Red/Blood */
            --warning: #ffc107; /* Orange/Pumpkin */

            /* CE-like Variables */
            --CE-bg_color: #1a1a1a; /* Very Dark background */
            --CE-color: #f8f9fa;   /* Light text color */
            --CE-input-bg: #333;   /* Dark input background */
            --CE-btn-special: var(--warning, #ffc107); /* Special button color (Orange) */
            --CE-btn-active: var(--danger, #dc3545);   /* Active button color (Red/Blood) */
        }

        .svg-drawer-menu {
            line-height: normal;
            font-size: 1rem;
            background-color: var(--CE-bg_color);
            border: 2px solid var(--CE-btn-special); /* Border naranja */
            border-radius: .25rem;
            box-shadow: 0 4px 8px rgba(0,0,0,0.8);
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
            color: var(--CE-btn-special); /* Title in Orange */
            margin: 10px 0;
            font-size: 1.1em;
            border-bottom: 1px dashed var(--CE-btn-active);
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
            flex: 1 1 100%; /* Full width for the single category */
            font-size: 1em;
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

        /* Floating Button for Halloween theme */
        #open-svg-drawer-menu {
            background-color: var(--warning, #ffc107) !important; /* Orange */
            color: var(--dark) !important;
        }
    `);

    // --- Module Initialization ---
    function initializeSVGDrawer() {
        if (document.body && document.getElementById("canvas")) {
            const drawer = new HalloweenIconDrawerStandalone();

            // Floating toggle button
            const toggleButton = createElement("button", {
                id: "open-svg-drawer-menu",
                style: `
                    position: fixed;
                    bottom: 80px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background-color: #ffc107; /* Halloween Orange */
                    color: black;
                    border: none;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.7);
                    font-size: 1.5em;
                    cursor: pointer;
                    z-index: 9998;
                    font-family: 'Times New Roman', serif;
                `
            }, ['👻']); // Icono temático diferente

            document.body.appendChild(toggleButton);

            toggleButton.addEventListener("click", () => {
                const menu = document.getElementById(drawer._containerId);
                if (menu) {
                    const isVisible = menu.style.display === "block";
                    menu.style.display = isVisible ? "none" : "block";
                    if (!isVisible) {
                        notify("info", "Halloween Drawer Menu opened.", "Halloween Drawer");
                        if (!drawer._canvasBrushImg) {
                            drawer._loadIcon(drawer._currentCategory, drawer._currentIconIndex);
                        }
                    } else {
                        notify("info", "Halloween Drawer Menu closed.", "Halloween Drawer");
                        drawer._setModuleActive(false);
                    }
                }
            });

        } else {
            setTimeout(initializeSVGDrawer, 100);
        }
    }

    initializeSVGDrawer();

})();