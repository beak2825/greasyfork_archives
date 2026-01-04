// ==UserScript==
// @name         Drawaria Interactive Tools Suit💻
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  A suite of interactive tools for Drawaria.online with a draggable floating menu.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license     MIT
// @icon        https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/550156/Drawaria%20Interactive%20Tools%20Suit%F0%9F%92%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/550156/Drawaria%20Interactive%20Tools%20Suit%F0%9F%92%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Core Variables and State ---
    let _drawariaCanvas = null;
    let _drawariaCtx = null;
    let _isReady = false;
    let _animationFrameId = null; // Usar requestAnimationFrame para un renderizado más suave
    let _drawariaSocket = null; // Para enviar comandos al servidor

    let _isPhoneActive = false;
    let _currentPhoneState = 'home';
    let _lastPhoneButtons = [];
    let _phoneCalcInput = "";

    let _isGameConsoleActive = false;
    let _lastGameConsoleButtons = [];

    let _isComputerActive = false;
    let _computerOutput = [];
    let _lastComputerButtons = [];

    let _isTabletActive = false;
    let _currentTabletState = 'home';
    let _lastTabletButtons = [];

    let _isShoppingMallActive = false;
    let _currentShoppingMallState = 'shop';
    let _lastShoppingMallButtons = [];
    const _shoppingMallProducts = [
        { id: "apple", name: "a p p l e", icon: "a", price: 5, color: "#df3535" },
        { id: "ball", name: "b a l l", icon: "b", price: 7, color: "#2277f3" },
        { id: "coin", name: "c o i n", icon: "3", price: 3, color: "#ddbe37" },
        { id: "lamp", name: "l a m p", icon: "l", price: 11, color: "#eedd66" }
    ];

    let _isHotelActive = false;
    let _currentHotelState = 'lobby';
    let _lastHotelButtons = [];

    let _isTechCenterActive = false;
    let _currentTechCenterState = 'main';
    let _lastTechCenterButtons = [];
    const _techCenterProducts = [
        { id: "chip", name: "c h i p", icon: "c", price: 10, color: "#92e8a1" },
        { id: "battery", name: "b a t t", icon: "b", price: 8, color: "#d9dd27" },
        { id: "robo_arm", name: "r o b o - b r a z o", icon: "r", price: 25, color: "#808080" },
        { id: "laser", name: "l a s e r", icon: "l", price: 18, color: "#ff0000" }
    ];

    let _userCoins = 20;
    let _userInventory = [];
    const _ui = {};

    // --- Patrones de Letras y Números (Ajustados para consistencia) ---
    const _letterPaths = {
        a: [[10, 40], [20, 0], [30, 40], [25, 20], [15, 20]],
        b: [[0, 0], [0, 40], [15, 40], [20, 35], [20, 25], [15, 20], [0, 20], [15, 20], [20, 15], [20, 5], [15, 0], [0, 0]],
        c: [[30, 10], [20, 0], [10, 0], [0, 10], [0, 30], [10, 40], [20, 40], [30, 30]],
        d: [[0, 0], [0, 40], [10, 40], [30, 20], [10, 0], [0, 0]],
        e: [[30, 0], [0, 0], [0, 20], [20, 20], [0, 20], [0, 40], [30, 40]],
        f: [[20, 0], [0, 0], [0, 20], [15, 20], [0, 20], [0, 40]],
        g: [[30, 10], [20, 0], [10, 0], [0, 10], [0, 30], [10, 40], [20, 40], [30, 30], [20, 20]],
        h: [[0, 0], [0, 40], [0, 20], [20, 20], [20, 0], [20, 40]],
        i: [[10, 0], [10, 40]],
        j: [[20, 0], [20, 40], [10, 40], [0, 30]],
        k: [[0, 0], [0, 40], [0, 20], [20, 0], [0, 20], [20, 40]],
        l: [[0, 0], [0, 40], [20, 40]],
        m: [[0, 40], [0, 0], [10, 20], [20, 0], [20, 40]],
        n: [[0, 40], [0, 0], [20, 40], [20, 0]],
        o: [[10, 0], [20, 0], [30, 10], [30, 30], [20, 40], [10, 40], [0, 30], [0, 10], [10, 0]],
        p: [[0, 40], [0, 0], [10, 0], [20, 10], [10, 20], [0, 20]],
        q: [[10, 0], [20, 0], [30, 10], [30, 30], [20, 40], [10, 40], [0, 30], [0, 10], [10, 0], [20, 20], [30, 40]],
        r: [[0, 40], [0, 0], [10, 0], [20, 10], [10, 20], [0, 20], [20, 40]],
        s: [[20, 0], [10, 0], [0, 10], [20, 20], [30, 30], [20, 40], [10, 40], [0, 30]],
        t: [[10, 0], [10, 40], null, [1, 0], [20, 0]],
        u: [[0, 0], [0, 30], [10, 40], [20, 40], [30, 30], [30, 0]],
        v: [[0, 0], [15, 40], [30, 0]],
        w: [[0, 0], [0, 40], [10, 20], [20, 40], [30, 0]],
        x: [[0, 0], [30, 40], [15, 20], [0, 40], [30, 0]],
        y: [[0, 0], [15, 20], [30, 0], [15, 20], [15, 40]],
        z: [[0, 0], [30, 0], [0, 40], [30, 40]],
        '.': [[7.5, 35], [9, 36]],
        '!': [[15, 0], [15, 30], null, [15, 35], [15, 40]],
        '@': [[20, 10], [10, 0], [0, 10], [0, 30], [10, 40], [20, 40], [30, 30], [30, 20], [15, 20]],
        '#': [[5, 0], [5, 40], null, [25, 0], [25, 40], null, [0, 10], [30, 10], null, [0, 30], [30, 30]],
        '$': [[20, 0], [10, 0], [0, 10], [10, 20], [20, 20], [30, 30], [20, 40], [10, 40], [15, 0], [15, 40]],
        '%': [[0, 30], [30, 0], null, [5, 10], [10, 5], null, [20, 35], [25, 30]],
        '^': [[0, 20], [15, 0], [30, 20]],
        '?': [[0, 10], [10, 0], [20, 0], [30, 10], [15, 20], [15, 30], null, [15, 35], [15, 40]],
        '+': [[15, 0], [15, 40], null, [0, 20], [30, 20]],
        '-': [[0, 20], [30, 20]],
        '*': [[15, 0], [15, 40], null, [0, 10], [30, 30], null, [0, 30], [30, 10]],
        '/': [[0, 40], [30, 0]],
        '(': [[15, 0], [0, 0], [0, 40], [15, 40]],
        ')': [[15, 0], [30, 0], [30, 40], [15, 40]],
        ':': [[15, 10], [16, 11], null, [15, 30], [16, 31]],
        '_': [[0, 40], [30, 40]],
        '=': [[0, 15], [30, 15], null, [0, 25], [30, 25]],
        '<': [[30, 10], [0, 20], [30, 30]],
        '>': [[0, 10], [30, 20], [0, 30]],
        ',': [[10, 30], [10, 35], [5, 40]],
        "'": [[15, 0], [20, 5], [15, 10]]
    };

    const _numberPaths = {
        0: [[10, 0], [20, 0], [30, 10], [30, 30], [20, 40], [10, 40], [0, 30], [0, 10], [10, 0]],
        1: [[15, 0], [15, 40], null, [15, 0], [10, 10], null, [10, 40], [20, 40]],
        2: [[0, 10], [10, 0], [20, 0], [30, 10], [0, 40], [30, 40]],
        3: [[0, 10], [10, 0], [20, 0], [30, 10], [20, 20], [30, 30], [20, 40], [10, 40], [0, 30]],
        4: [[20, 0], [20, 40], null, [0, 20], [25, 20], null, [0, 20], [20, 0]],
        5: [[30, 0], [0, 0], [0, 20], [20, 20], [30, 30], [20, 40], [10, 40], [0, 30]],
        6: [[30, 10], [20, 0], [10, 0], [0, 10], [0, 30], [10, 40], [20, 40], [30, 30], [20, 20], [10, 20], [0, 20], [0, 10]],
        7: [[0, 0], [30, 0], [15, 40]],
        8: [[15, 0], [25, 10], [15, 20], [5, 10], [15, 0], null, [15, 20], [25, 30], [15, 40], [5, 30], [15, 20]],
        9: [[5, 35], [15, 40], [25, 30], [30, 10], [20, 0], [10, 0], [0, 10], [5, 20], [15, 20], [25, 20], [27.5, 20]]
    };

    // --- Utility Functions (Adaptadas de la tienda) ---

    function getGameSocket() {
        if (_drawariaSocket) return _drawariaSocket;

        if (window.socket) {
            _drawariaSocket = window.socket;
        } else if (window.WebSocket && window.WebSocket.prototype) {
            const origSend = WebSocket.prototype.send;
            WebSocket.prototype.send = function(...args) {
                if (this.url && this.url.includes('drawaria') && !_drawariaSocket) {
                    _drawariaSocket = this;
                }
                return origSend.apply(this, args);
            };
        }
        return _drawariaSocket;
    }

    function saveState() {
        GM_setValue('userCoins', _userCoins);
        GM_setValue('userInventory', JSON.stringify(_userInventory));
    }

    function loadState() {
        _userCoins = GM_getValue('userCoins', 20);
        _userInventory = JSON.parse(GM_getValue('userInventory', '[]'));
    }

    function createDraggableMenu() {
        GM_addStyle(`
            #drawaria-tools-menu {
                position: fixed;
                top: 20px;
                left: 20px;
                width: 200px;
                background: #2b2b2b;
                border: 1px solid #555;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.5);
                z-index: 9999;
                font-family: Arial, sans-serif;
                color: #f0f0f0;
                resize: both;
                overflow: auto;
            }
            #drawaria-tools-menu-header {
                cursor: move;
                background: #3c3c3c;
                padding: 10px;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                text-align: center;
                font-weight: bold;
                border-bottom: 1px solid #555;
            }
            #drawaria-tools-menu-content {
                padding: 10px;
            }
            .tool-button {
                width: 100%;
                padding: 8px;
                margin-bottom: 5px;
                background: #444;
                color: #fff;
                border: 1px solid #555;
                border-radius: 4px;
                cursor: pointer;
            }
            .tool-button:hover {
                background: #555;
            }
            .tool-button.active {
                background: #007bff;
                border-color: #0056b3;
            }
            .module-status-indicator {
                margin-top: 10px;
                padding: 5px;
                border-radius: 4px;
                text-align: center;
            }
            .module-status-connected { background: #28a745; }
            .module-status-disconnected { background: #dc3545; }
            .module-status-stopped { background: #ffc107; }
        `);

        const menu = document.createElement('div');
        menu.id = 'drawaria-tools-menu';
        document.body.appendChild(menu);

        const header = document.createElement('div');
        header.id = 'drawaria-tools-menu-header';
        header.textContent = 'Drawaria Interactive Tools Suit';
        menu.appendChild(header);

        const content = document.createElement('div');
        content.id = 'drawaria-tools-menu-content';
        menu.appendChild(content);

        let isDragging = false;
        let startX, startY;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - menu.offsetLeft;
            startY = e.clientY - menu.offsetTop;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        const onMouseMove = (e) => {
            if (isDragging) {
                menu.style.left = `${e.clientX - startX}px`;
                menu.style.top = `${e.clientY - startY}px`;
            }
        };

        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        _ui.togglePhoneButton = createButton('<i class="fas fa-mobile-alt"></i> Teléfono', () => _toggleModule('phone'));
        _ui.toggleGameConsoleButton = createButton('<i class="fas fa-gamepad"></i> Consola', () => _toggleModule('game_console'));
        _ui.toggleComputerButton = createButton('<i class="fas fa-laptop"></i> Computadora', () => _toggleModule('computer'));
        _ui.toggleTabletButton = createButton('<i class="fas fa-tablet-alt"></i> Tablet', () => _toggleModule('tablet'));
        _ui.toggleShoppingMallButton = createButton('<i class="fas fa-store"></i> Centro Comercial', () => _toggleModule('shopping_mall'));
        _ui.toggleHotelButton = createButton('<i class="fas fa-hotel"></i> Hotel', () => _toggleModule('hotel'));
        _ui.toggleTechCenterButton = createButton('<i class="fas fa-microchip"></i> Centro de Tecnología', () => _toggleModule('tech_center'));
        _ui.resetDataButton = createButton('<i class="fas fa-redo-alt"></i> Resetear Datos', () => _resetAllData());
        _ui.stopAllButton = createButton('<i class="fas fa-stop-circle"></i> Detener Todo', () => _stopAllModulesAndRendering());
        _ui.statusLabel = document.createElement('div');
        _ui.statusLabel.className = 'module-status-indicator';
        _ui.statusText = document.createElement('span');
        _ui.statusLabel.appendChild(_ui.statusText);

        content.appendChild(_ui.togglePhoneButton);
        content.appendChild(_ui.toggleGameConsoleButton);
        content.appendChild(_ui.toggleComputerButton);
        content.appendChild(_ui.toggleTabletButton);
        content.appendChild(_ui.toggleShoppingMallButton);
        content.appendChild(_ui.toggleHotelButton);
        content.appendChild(_ui.toggleTechCenterButton);
        content.appendChild(document.createElement('hr'));
        content.appendChild(_ui.resetDataButton);
        content.appendChild(_ui.stopAllButton);
        content.appendChild(_ui.statusLabel);
    }

    function createButton(html, onClick) {
        const btn = document.createElement('button');
        btn.className = 'tool-button';
        btn.innerHTML = html;
        btn.addEventListener('click', onClick);
        return btn;
    }

    function _waitUntilReady() {
        return new Promise(resolve => {
            const check = () => {
                _drawariaCanvas = document.getElementById('canvas');
                if (_drawariaCanvas) {
                    _drawariaCtx = _drawariaCanvas.getContext('2d');
                }
                getGameSocket(); // Asegura que _drawariaSocket se inicialice
                if (_drawariaCanvas && _drawariaCtx && _drawariaSocket) {
                    resolve();
                } else {
                    setTimeout(check, 250);
                }
            };
            check();
        });
    }

    function _getMouseCanvasCoords(e) {
        if (!_drawariaCanvas) return { x: 0, y: 0 };
        const rect = _drawariaCanvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (_drawariaCanvas.width / rect.width),
            y: (e.clientY - rect.top) * (_drawariaCanvas.height / rect.height)
        };
    }

    // --- Adaptado de la tienda: Funciones de Dibujo y Envío de Comandos ---
    function drawLineServerLocal(x1, y1, x2, y2, color = '#222', thickness = 3) {
        if (!_drawariaSocket || !_drawariaCanvas) return;
        const nx1 = (x1 / _drawariaCanvas.width).toFixed(4), ny1 = (y1 / _drawariaCanvas.height).toFixed(4),
              nx2 = (x2 / _drawariaCanvas.width).toFixed(4), ny2 = (y2 / _drawariaCanvas.height).toFixed(4);
        const cmd = `42["drawcmd",0,[${nx1},${ny1},${nx2},${ny2},false,${-Math.abs(thickness)},"${color}",0,0,{}]]`;
        try {
            _drawariaSocket.send(cmd);
        } catch (e) {
            console.error("Error sending draw command:", e);
        }

        _drawariaCtx.save();
        _drawariaCtx.strokeStyle = color;
        _drawariaCtx.lineWidth = thickness;
        _drawariaCtx.lineCap = 'round';
        _drawariaCtx.beginPath();
        _drawariaCtx.moveTo(x1, y1);
        _drawariaCtx.lineTo(x2, y2);
        _drawariaCtx.stroke();
        _drawariaCtx.restore();
    }

    function drawFilledRect(x, y, w, h, color = '#eee') {
        if (!_drawariaCtx) return;
        _drawariaCtx.save();
        _drawariaCtx.fillStyle = color;
        _drawariaCtx.fillRect(x, y, w, h);
        _drawariaCtx.restore();
    }

    function drawRectServerLocal(x, y, w, h, color = '#222', thickness = 3) {
        if (!_drawariaCtx) return;
        _drawariaCtx.save();
        _drawariaCtx.strokeStyle = color;
        _drawariaCtx.lineWidth = thickness;
        _drawariaCtx.strokeRect(x, y, w, h);
        _drawariaCtx.restore();
    }

     function drawLine(x1, y1, x2, y2, color, thickness) {
         drawLineServerLocal(x1, y1, x2, y2, color, thickness);
     }

    function drawLetterPathLocal(path, startX, startY, fontSize, color, thickness) {
        if (!_drawariaCtx) return;
        const scale = fontSize / 40;

        _drawariaCtx.save();
        _drawariaCtx.strokeStyle = color;
        _drawariaCtx.lineWidth = thickness;
        _drawariaCtx.lineCap = 'round';
        _drawariaCtx.lineJoin = 'round';
        _drawariaCtx.beginPath();

        let penLifted = true;
        for (let i = 0; i < path.length; i++) {
            const segment = path[i];
            if (segment === null) {
                penLifted = true;
                continue;
            }
            const [px, py] = segment;
            const currentX = startX + px * scale;
            const currentY = startY + py * scale;
            if (penLifted) {
                _drawariaCtx.moveTo(currentX, currentY);
                penLifted = false;
            } else {
                _drawariaCtx.lineTo(currentX, currentY);
            }
        }
        _drawariaCtx.stroke();
        _drawariaCtx.restore();
    }

    function _drawLocalText(str, x, y, color, thickness = 2, fontSize = 18) {
        let cx = x;
        for (const char of str) {
            const path = _letterPaths[char.toLowerCase()] || _numberPaths[char] || _letterPaths[' '];
            if (path) {
                drawLetterPathLocal(path, cx, y, fontSize, color, thickness);
            }
            cx += fontSize * 0.6;
        }
    }

    // --- Main Logic (Converted from Class Methods) ---

    function _onStartup() {
        createDraggableMenu();
        loadState();
        _waitUntilReady().then(() => {
            _isReady = true;
            _startRenderLoop();
            document.getElementById('canvas').addEventListener('click', _handleCanvasClick);
        });
    }

    // Función de bucle de renderizado usando requestAnimationFrame
    function _renderLoop() {
        if (!_isReady || !_drawariaCtx) {
            const socketStatus = getGameSocket() ? 'connected' : 'disconnected';
            _ui.statusLabel.className = `module-status-indicator module-status-${socketStatus}`;
            _ui.statusText.textContent = socketStatus.charAt(0).toUpperCase() + socketStatus.slice(1);
            _animationFrameId = requestAnimationFrame(_renderLoop); // Continuar solicitando fotogramas incluso si no se renderizan módulos
            return;
        }

        const anyModuleActive = _isPhoneActive || _isGameConsoleActive || _isComputerActive ||
            _isTabletActive || _isShoppingMallActive || _isHotelActive ||
            _isTechCenterActive;

        if (anyModuleActive) {
            // Limpiar solo si un módulo está activo para dibujar la interfaz del módulo
            _drawariaCtx.clearRect(0, 0, _drawariaCanvas.width, _drawariaCanvas.height);

            if (_isPhoneActive) _renderPhone();
            else if (_isGameConsoleActive) _renderGameConsole();
            else if (_isComputerActive) _renderComputer();
            else if (_isTabletActive) _renderTablet();
            else if (_isShoppingMallActive) _renderShoppingMall();
            else if (_isHotelActive) _renderHotel();
            else if (_isTechCenterActive) _renderTechCenter();
        } else {
            // Si ningún módulo está activo, NO limpiar el canvas.
            // Esto permite que el juego principal se dibuje sobre el canvas.
            // Nuestro script solo interviene cuando un módulo está activo.
        }

        const socketStatus = getGameSocket() ? 'connected' : 'disconnected';
        _ui.statusLabel.className = `module-status-indicator module-status-${socketStatus}`;
        _ui.statusText.textContent = socketStatus.charAt(0).toUpperCase() + socketStatus.slice(1);

        _animationFrameId = requestAnimationFrame(_renderLoop); // Programar el siguiente fotograma
    }

    function _startRenderLoop() {
        if (_animationFrameId) {
            cancelAnimationFrame(_animationFrameId); // Cancelar el anterior si existe
        }
        _animationFrameId = requestAnimationFrame(_renderLoop); // Iniciar el bucle
    }

    function _handleCanvasClick(e) {
        if (!_isReady || !_drawariaCtx) return;
        const { x: cx, y: cy } = _getMouseCanvasCoords(e);

        // Delegar el manejo del clic al módulo activo
        if (_isPhoneActive) _handlePhoneClick(cx, cy);
        else if (_isGameConsoleActive) _handleGameConsoleClick(cx, cy);
        else if (_isComputerActive) _handleComputerClick(cx, cy);
        else if (_isTabletActive) _handleTabletClick(cx, cy);
        else if (_isShoppingMallActive) _handleShoppingMallClick(cx, cy);
        else if (_isHotelActive) _handleHotelClick(cx, cy);
        else if (_isTechCenterActive) _handleTechCenterClick(cx, cy);
    }

    function _toggleModule(moduleName) {
        // Desactivar todos los módulos primero
        _isPhoneActive = false;
        _isGameConsoleActive = false;
        _isComputerActive = false;
        _isTabletActive = false;
        _isShoppingMallActive = false;
        _isHotelActive = false;
        _isTechCenterActive = false;

        // Remover la clase 'active' de todos los botones del menú
        document.querySelectorAll('.tool-button').forEach(btn => btn.classList.remove('active'));

        let message = `Módulo '${moduleName.replace('_', ' ')}' desactivado.`;

        switch (moduleName) {
            case 'phone':
                _isPhoneActive = true;
                _ui.togglePhoneButton.classList.add('active');
                _currentPhoneState = 'home';
                message = "Módulo 'Teléfono' activado.";
                break;
            case 'game_console':
                _isGameConsoleActive = true;
                _ui.toggleGameConsoleButton.classList.add('active');
                message = "Módulo 'Consola' activado.";
                break;
            case 'computer':
                _isComputerActive = true;
                _ui.toggleComputerButton.classList.add('active');
                message = "Módulo 'Computadora' activado.";
                break;
            case 'tablet':
                _isTabletActive = true;
                _ui.toggleTabletButton.classList.add('active');
                _currentTabletState = 'home';
                message = "Módulo 'Tablet' activado.";
                break;
            case 'shopping_mall':
                _isShoppingMallActive = true;
                _ui.toggleShoppingMallButton.classList.add('active');
                _currentShoppingMallState = 'shop';
                message = "Módulo 'Centro Comercial' activado.";
                break;
            case 'hotel':
                _isHotelActive = true;
                _ui.toggleHotelButton.classList.add('active');
                _currentHotelState = 'lobby';
                message = "Módulo 'Hotel' activado.";
                break;
            case 'tech_center':
                _isTechCenterActive = true;
                _ui.toggleTechCenterButton.classList.add('active');
                _currentTechCenterState = 'main';
                message = "Módulo 'Centro de Tecnología' activado.";
                break;
        }

        // Si el canvas está disponible, lo limpiamos solo si activamos un módulo,
        // para asegurar que el estado anterior no interfiera.
        if (_drawariaCtx && _drawariaCanvas && anyModuleActive) {
            _drawariaCtx.clearRect(0, 0, _drawariaCanvas.width, _drawariaCanvas.height);
        }
        _startRenderLoop(); // Reiniciar bucle para aplicar cambios
    }

    function _resetAllData() {
        _userCoins = 20;
        _userInventory = [];
        _phoneCalcInput = "";
        _currentPhoneState = 'home';
        _currentTabletState = 'home';
        _currentShoppingMallState = 'shop';
        _currentHotelState = 'lobby';
        _currentTechCenterState = 'main';
        _computerOutput = [];
        saveState();
        _startRenderLoop(); // Re-renderizar para mostrar el estado reseteado
        alert("Todos los datos han sido reseteados.");
    }

    function _stopAllModulesAndRendering() {
        _isPhoneActive = false;
        _isGameConsoleActive = false;
        _isComputerActive = false;
        _isTabletActive = false;
        _isShoppingMallActive = false;
        _isHotelActive = false;
        _isTechCenterActive = false;

        document.querySelectorAll('.tool-button').forEach(btn => btn.classList.remove('active'));

        if (_animationFrameId) {
            cancelAnimationFrame(_animationFrameId);
            _animationFrameId = null;
        }

        // Al detener todo, debemos asegurarnos de que el canvas se limpie para mostrar el juego de nuevo.
        if (_drawariaCtx && _drawariaCanvas) {
            _drawariaCtx.clearRect(0, 0, _drawariaCanvas.width, _drawariaCanvas.height);
        }

        const socketStatus = getGameSocket() ? 'connected' : 'disconnected';
        _ui.statusLabel.className = `module-status-indicator module-status-stopped`;
        _ui.statusText.textContent = `Detenido (${socketStatus.charAt(0).toUpperCase() + socketStatus.slice(1)})`;
    }

    // --- Helper Drawing Functions ---

    function _drawLocalLine(x1, y1, x2, y2, color = '#222', thickness = 3) {
        if (!_drawariaCtx) return;
        _drawariaCtx.save();
        _drawariaCtx.strokeStyle = color;
        _drawariaCtx.lineWidth = thickness;
        _drawariaCtx.lineCap = 'round';
        _drawariaCtx.beginPath();
        _drawariaCtx.moveTo(x1, y1);
        _drawariaCtx.lineTo(x2, y2);
        _drawariaCtx.stroke();
        _drawariaCtx.restore();
    }

     // Función genérica para dibujar texto usando los patrones definidos
     function _drawTextGeneric(str, x, y, color, thickness = 2, fontSize = 18, paths) {
         let cx = x;
         for (const char of str) {
             const path = paths[char.toLowerCase()] || paths[' '];
             if (path) {
                 drawLetterPathLocal(path, cx, y, fontSize, color, thickness);
             }
             cx += fontSize * 0.6;
         }
     }

     // Sobrescribir _drawLocalText para usar la función genérica
     function _drawLocalText(str, x, y, color, thickness = 2, fontSize = 18) {
         _drawTextGeneric(str, x, y, color, thickness, fontSize, _letterPaths);
     }

    function _drawLocalFilledRect(x, y, w, h, color = '#eee') {
        if (!_drawariaCtx) return;
        _drawariaCtx.save();
        _drawariaCtx.fillStyle = color;
        _drawariaCtx.fillRect(x, y, w, h);
        _drawariaCtx.restore();
    }

    function _drawLocalRectOutline(x, y, w, h, color = '#222', thickness = 3) {
        if (!_drawariaCtx) return;
        _drawariaCtx.save();
        _drawariaCtx.strokeStyle = color;
        _drawariaCtx.lineWidth = thickness;
        _drawariaCtx.strokeRect(x, y, w, h);
        _drawariaCtx.restore();
    }

    function _drawActionButton(x, y, w, h, text, action, buttonArray, bgColor = '#DDD', textColor = '#222', fontSize = 17, textThickness = 2, borderColor = '#222', borderWidth = 2, extraData = {}) {
        _drawLocalFilledRect(x, y, w, h, bgColor);
        _drawLocalRectOutline(x, y, w, h, borderColor, borderWidth);
        const textWidthApprox = text.length * fontSize * 0.6;
        _drawLocalText(text, x + (w - textWidthApprox) / 2, y + (h - fontSize) / 2 + 3, textColor, textThickness, fontSize);
        buttonArray.push({ x, y, w, h, action, ...extraData });
    }

     function _drawAppButton(x, y, size, action, bgColor, borderColor, iconChar, iconColor, labelText, labelColor, buttonArray) {
         _drawLocalFilledRect(x, y, size, size, bgColor);
         _drawLocalRectOutline(x, y, size, size, borderColor, 2);
         _drawLocalText(iconChar, x + size / 2 - 10, y + 8, iconColor, 2, 20);
         const labelTextWidthApprox = labelText.length * 12 * 0.6;
         _drawLocalText(labelText, x + size / 2 - (labelTextWidthApprox / 2), y + size + 5, labelColor, 1.5, 12);
         buttonArray.push({ x: x, y: y, w: size, h: size, action: action });
     }


    // --- Module Rendering and Click Handlers ---

    function _handlePhoneClick(cx, cy) {
        for (const btn of _lastPhoneButtons) {
            if (cx >= btn.x && cx <= btn.x + btn.w && cy >= btn.y && cy <= btn.y + btn.h) {
                switch (btn.action) {
                    case 'home': _currentPhoneState = 'home'; break;
                    case 'open_football': _currentPhoneState = 'football'; break;
                    case 'open_notes': _currentPhoneState = 'notes'; break;
                    case 'open_calc': _currentPhoneState = 'calc'; break;
                    case 'open_clock': _currentPhoneState = 'clock'; break;
                    case 'open_gallery': _currentPhoneState = 'gallery'; break;
                    case 'calcpress':
                        _phoneCalcInput += btn.val;
                        break;
                    case 'equals':
                        try {
                            let safeInput = _phoneCalcInput.replace(/[^0-9+\-*/.()]/g, '');
                            _phoneCalcInput = String(eval(safeInput));
                        } catch {
                            _phoneCalcInput = "ERR";
                        }
                        break;
                    case 'ce':
                        _phoneCalcInput = "";
                        break;
                }
                _renderPhone();
                return;
            }
        }
    }

    function _renderPhone() {
        if (!_drawariaCanvas) return;
        const phoneW = 220, phoneH = 420;
        const { x, y, w, h } = { x: _drawariaCanvas.width - phoneW - 32, y: _drawariaCanvas.height - phoneH - 32, w: phoneW, h: phoneH };
        _lastPhoneButtons = [];

        _drawLocalFilledRect(x, y, w, h, '#222');
        _drawLocalRectOutline(x, y, w, h, '#999', 4);
        _drawLocalFilledRect(x + 10, y + 10, w - 20, h - 20, '#000');
        _drawLocalFilledRect(x + w / 2 - 30, y + 20, 60, 10, '#444');
        _drawLocalFilledRect(x + w / 2 - 15, y + h - 30, 30, 15, '#444');

        switch (_currentPhoneState) {
            case 'home': _renderPhoneHome(x + 15, y + 45, w - 30, h - 80); break;
            case 'football': _renderPhoneFootballApp(x + 15, y + 45, w - 30, h - 80); break;
            case 'notes': _renderPhoneNotesApp(x + 15, y + 45, w - 30, h - 80); break;
            case 'calc': _renderPhoneCalcApp(x + 15, y + 45, w - 30, h - 80); break;
            case 'clock': _renderPhoneClockApp(x + 15, y + 45, w - 30, h - 80); break;
            case 'gallery': _renderPhoneGalleryApp(x + 15, y + 45, w - 30, h - 80); break;
        }

        if (_currentPhoneState !== 'home') {
            const btnX = x + 15 + (w - 30) / 2 - 40, btnY = y + 45 + (h - 80) - 40, btnW = 80, btnH = 30;
            _drawActionButton(btnX, btnY, btnW, btnH, "v o l v e r", 'home', _lastPhoneButtons, '#DDD', '#555', 14);
        }
    }

    function _renderPhoneHome(x, y, w, h) {
        _drawLocalText("a n d r o i d", x + 10, y + 10, '#17A', 3, 17);
        _drawAppButton(x + 10, y + 40, 45, 'open_football', '#FAFAFF', '#222', 'f', '#173', 'f u t b o l', '#222', _lastPhoneButtons);
        _drawAppButton(x + 70, y + 40, 45, 'open_notes', '#FFFDE9', '#222', 'n', '#962', 'n o t e s', '#222', _lastPhoneButtons);
        _drawAppButton(x + 130, y + 40, 45, 'open_calc', '#EAEEFF', '#222', 'c', '#246', 'c a l c', '#222', _lastPhoneButtons);
        _drawAppButton(x + 10, y + 120, 45, 'open_clock', '#F6FFEA', '#222', 'r', '#184', 'r e l o j', '#222', _lastPhoneButtons);
        _drawAppButton(x + 70, y + 120, 45, 'open_gallery', '#FAEEFF', '#222', 'g', '#71a', 'g a l e r', '#222', _lastPhoneButtons);
    }

    function _renderPhoneFootballApp(x, y, w, h) {
        _drawLocalText("f u t b o l", x + 20, y + 10, '#173', 3, 18);
        _drawLocalFilledRect(x + 20, y + 50, w - 40, h - 100, '#8BC34A');
        _drawLocalRectOutline(x + 20, y + 50, w - 40, h - 100, '#222', 2);
        _drawLocalLine(x + w / 2, y + 50, x + w / 2, y + h - 50, '#FFF', 1);
        _drawLocalText("b o l a", x + w / 2 - 25, y + h / 2 + 10, '#FFF', 2, 18);
    }

    function _renderPhoneNotesApp(x, y, w, h) {
        _drawLocalText("n o t a s", x + 20, y + 10, '#962', 3, 18);
        _drawLocalFilledRect(x + 10, y + 40, w - 20, h - 80, '#fffbe0');
        _drawLocalRectOutline(x + 10, y + 40, w - 20, h - 80, '#555', 2);
        for (let i = 0; i < 5; i++) {
            _drawLocalLine(x + 15, y + 50 + i * 20, x + w - 15, y + 50 + i * 20, '#99F', 1);
        }
        _drawLocalText("t o m a  n o t a !", x + 20, y + 60, "#333", 2, 15);
    }

    function _renderPhoneCalcApp(x, y, w, h) {
        _drawLocalText("c a l c", x + 20, y + 10, '#246', 3, 18);
        _drawLocalFilledRect(x + 10, y + 40, w - 20, 40, '#f4f7fd');
        _drawLocalRectOutline(x + 10, y + 40, w - 20, 40, '#222', 2);
        _drawLocalText(_phoneCalcInput || "0", x + 15, y + 50, '#246', 2, 18);
        const bw = 40, bh = 30, pad = 5;
        const layout = [
            ['7', '8', '9', '+'],
            ['4', '5', '6', '-'],
            ['1', '2', '3', '*'],
            ['ce', '0', '=', '/']
        ];
        let startY = y + 90;
        for (let row = 0; row < layout.length; row++) {
            let startX = x + 15;
            for (let col = 0; col < layout[row].length; col++) {
                const char = layout[row][col];
                const btnAction = (char === 'ce' || char === '=') ? char : 'calcpress';
                const extra = (btnAction === 'calcpress') ? { val: char } : {};
                _drawActionButton(startX + col * (bw + pad), startY + row * (bh + pad), bw, bh, char, btnAction, _lastPhoneButtons, '#EEE', '#222', 15, 2, '#999', 1, extra);
            }
        }
    }

    function _renderPhoneClockApp(x, y, w, h) {
        _drawLocalText("r e l o j", x + 20, y + 10, '#184', 3, 18);
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
        _drawLocalText(timeStr, x + 20, y + 70, '#222', 3, 25);
        _drawLocalText(dateStr, x + 20, y + 110, '#555', 2, 15);
    }

    function _renderPhoneGalleryApp(x, y, w, h) {
        _drawLocalText("g a l e r", x + 20, y + 10, '#71a', 3, 18);
        _drawLocalFilledRect(x + 10, y + 40, w - 20, h - 80, '#DDD');
        _drawLocalRectOutline(x + 10, y + 40, w - 20, h - 80, '#555', 2);
        _drawLocalText("n o   f o t o s", x + 20, y + 50, '#555', 2, 15);
    }

    function _handleGameConsoleClick(cx, cy) {
        for (const btn of _lastGameConsoleButtons) {
            if (cx >= btn.x && cx <= btn.x + btn.w && cy >= btn.y && cy <= btn.y + btn.h) {
                switch (btn.action) {
                    case 'dpad_up': _drawLocalText("A R R I B A", cx, cy - 20, '#0F0', 2, 12); break;
                    case 'dpad_down': _drawLocalText("A B A J O", cx, cy + 20, '#0F0', 2, 12); break;
                    case 'dpad_left': _drawLocalText("I Z Q", cx - 20, cy + 5, '#0F0', 2, 12); break;
                    case 'dpad_right': _drawLocalText("D E R", cx + 20, cy + 5, '#0F0', 2, 12); break;
                    case 'btn_a': _drawLocalText("A C T I O N", cx, cy, '#0F0', 2, 12); break;
                    case 'btn_b': _drawLocalText("C A N C E L", cx, cy, '#0F0', 2, 12); break;
                }
                _renderGameConsole();
                return;
            }
        }
    }

    function _renderGameConsole() {
        if (!_drawariaCanvas) return;
        const consoleW = 400, consoleH = 200;
        const { x, y, w, h } = { x: _drawariaCanvas.width / 2 - consoleW / 2, y: _drawariaCanvas.height / 2 - consoleH / 2, w: consoleW, h: consoleH };
        _lastGameConsoleButtons = [];

        _drawLocalFilledRect(x, y, w, h, '#444');
        _drawLocalRectOutline(x, y, w, h, '#999', 4);
        _drawLocalFilledRect(x + 20, y + 20, w - 40, 100, '#000');
        _drawLocalRectOutline(x + 20, y + 20, w - 40, 100, '#0F0', 2);

        _drawLocalText("P O N G", x + w / 2 - 50, y + 50, '#0F0', 3, 20);
        _drawLocalText("j u g a r", x + w / 2 - 60, y + 80, '#0F0', 2, 15);
        _drawLocalText("c o n s o l a", x + w / 2 - 80, y + 140, '#CCC', 2, 18);

        const btnSize = 30, btnPad = 10;
        _drawActionButton(x + 30, y + 140, btnSize, btnSize, '▲', 'dpad_up', _lastGameConsoleButtons);
        _drawActionButton(x + 30, y + 140 + btnSize + btnPad, btnSize, btnSize, '▼', 'dpad_down', _lastGameConsoleButtons);
        _drawActionButton(x + 30 - btnSize - btnPad, y + 140 + btnSize + btnPad / 2, btnSize, btnSize, '◀', 'dpad_left', _lastGameConsoleButtons);
        _drawActionButton(x + 30 + btnSize + btnPad, y + 140 + btnSize + btnPad / 2, btnSize, btnSize, '▶', 'dpad_right', _lastGameConsoleButtons);
        _drawActionButton(x + w - 30 - btnSize, y + 140 + btnSize / 2, btnSize, btnSize, 'A', 'btn_a', _lastGameConsoleButtons);
        _drawActionButton(x + w - 30 - btnSize - 20, y + 140 + btnSize / 2 + 10, btnSize, btnSize, 'B', 'btn_b', _lastGameConsoleButtons);
    }

    function _handleComputerClick(cx, cy) {
        for (const btn of _lastComputerButtons) {
            if (cx >= btn.x && cx <= btn.x + btn.w && cy >= btn.y && cy <= btn.y + btn.h) {
                switch (btn.action) {
                    case 'power':
                        _computerOutput.push("P O W E R   O N");
                        break;
                    case 'code':
                        _computerOutput.push("P R O G R A M M I N G");
                        _computerOutput.push("C O D E   L I N E");
                        break;
                    case 'internet':
                        _computerOutput.push("I N T E R N E T");
                        _computerOutput.push("S E A R C H I N G...");
                        break;
                    case 'clear':
                        _computerOutput = [];
                        break;
                }
                if (_computerOutput.length > 5) {
                    _computerOutput.shift();
                }
                _renderComputer();
                return;
            }
        }
    }

    function _renderComputer() {
        if (!_drawariaCanvas) return;
        const compW = 450, compH = 300;
        const { x, y, w, h } = { x: 10, y: 10, w: compW, h: compH };
        _lastComputerButtons = [];

        _drawLocalFilledRect(x, y, w, h, '#333');
        _drawLocalRectOutline(x, y, w, h, '#777', 4);
        _drawLocalFilledRect(x + 20, y + 20, w - 40, h - 60, '#000');
        _drawLocalRectOutline(x + 20, y + 20, w - 40, h - 60, '#0F0', 2);

        _drawLocalText("C O M P U T A D O R A", x + w / 2 - 100, y + 10, '#EEE', 3, 18);
        let outputY = y + 30;
        _computerOutput.forEach(line => {
            _drawLocalText(line, x + 30, outputY, '#0F0', 2, 14);
            outputY += 20;
        });

        _drawActionButton(x + 20, y + h - 30, 80, 20, 'O N', 'power', _lastComputerButtons, '#28A745', '#FFF', 14);
        _drawActionButton(x + 110, y + h - 30, 80, 20, 'C O D E', 'code', _lastComputerButtons, '#007BFF', '#FFF', 14);
        _drawActionButton(x + 200, y + h - 30, 80, 20, 'I N T E R N E T', 'internet', _lastComputerButtons, '#FFC107', '#FFF', 14);
        _drawActionButton(x + w - 100, y + h - 30, 80, 20, 'C L E A R', 'clear', _lastComputerButtons, '#DC3545', '#FFF', 14);
    }

    function _handleTabletClick(cx, cy) {
        for (const btn of _lastTabletButtons) {
            if (cx >= btn.x && cx <= btn.x + btn.w && cy >= btn.y && cy <= btn.y + btn.h) {
                switch (btn.action) {
                    case 'home': _currentTabletState = 'home'; break;
                    case 'open_youtube': _currentTabletState = 'youtube'; break;
                    case 'open_maps': _currentTabletState = 'maps'; break;
                    case 'open_paint': _currentTabletState = 'paint'; break;
                }
                _renderTablet();
                return;
            }
        }
    }

    function _renderTablet() {
        if (!_drawariaCanvas) return;
        const tabletW = 500, tabletH = 350;
        const { x, y, w, h } = { x: _drawariaCanvas.width / 2 - tabletW / 2, y: _drawariaCanvas.height / 2 - tabletH / 2, w: tabletW, h: tabletH };
        _lastTabletButtons = [];

        _drawLocalFilledRect(x, y, w, h, '#222');
        _drawLocalRectOutline(x, y, w, h, '#999', 4);
        _drawLocalFilledRect(x + 10, y + 10, w - 20, h - 20, '#fff');
        _drawLocalFilledRect(x + w / 2 - 20, y + h - 25, 40, 10, '#444');

        switch (_currentTabletState) {
            case 'home': _renderTabletHome(x + 10, y + 10, w - 20, h - 20); break;
            case 'youtube': _renderTabletYouTubeApp(x + 10, y + 10, w - 20, h - 20); break;
            case 'maps': _renderTabletMapsApp(x + 10, y + 10, w - 20, h - 20); break;
            case 'paint': _renderTabletPaintApp(x + 10, y + 10, w - 20, h - 20); break;
        }

        if (_currentTabletState !== 'home') {
            const btnX = x + 10 + (w - 20) / 2 - 40, btnY = y + 10 + (h - 20) - 40, btnW = 80, btnH = 30;
            _drawActionButton(btnX, btnY, btnW, btnH, "v o l v e r", 'home', _lastTabletButtons, '#DDD', '#555', 14);
        }
    }

    function _renderTabletHome(x, y, w, h) {
        _drawLocalText("T A B L E T", x + 10, y + 10, '#369', 3, 18);
        _drawAppButton(x + 20, y + 50, 60, 'open_youtube', '#F00', '#222', 'p', '#FFF', 'y o u t u b e', '#222', _lastTabletButtons);
        _drawAppButton(x + 100, y + 50, 60, 'open_maps', '#28A745', '#222', 'm', '#FFF', 'm a p s', '#222', _lastTabletButtons);
        _drawAppButton(x + 180, y + 50, 60, 'open_paint', '#81D4FA', '#222', 'p', '#FFF', 'p i n t a r', '#222', _lastTabletButtons);
    }

    function _renderTabletYouTubeApp(x, y, w, h) {
        _drawLocalText("y o u t u b e", x + 10, y + 10, '#F00', 3, 18);
        _drawLocalFilledRect(x + 20, y + 50, w - 40, h - 100, '#000');
        _drawLocalRectOutline(x + 20, y + 50, w - 40, h - 100, '#F00', 2);
        _drawLocalText("v i d e o", x + w / 2 - 50, y + h / 2 - 10, '#FFF', 2, 20);
        _drawLocalText("►", x + w / 2 - 10, y + h / 2 - 20, '#FFF', 3, 25);
    }

    function _renderTabletMapsApp(x, y, w, h) {
        _drawLocalText("m a p s", x + 10, y + 10, '#28A745', 3, 18);
        _drawLocalFilledRect(x + 20, y + 50, w - 40, h - 100, '#8BC34A');
        _drawLocalRectOutline(x + 20, y + 50, w - 40, h - 100, '#222', 2);
        _drawLocalText("m a p a", x + w / 2 - 40, y + h / 2 - 10, '#222', 2, 20);
        _drawLocalText("📍", x + w / 2 - 10, y + h / 2 - 20, '#F00', 3, 25);
    }

    function _renderTabletPaintApp(x, y, w, h) {
        _drawLocalText("p i n t a r", x + 10, y + 10, '#81D4FA', 3, 18);
        _drawLocalFilledRect(x + 20, y + 50, w - 40, h - 100, '#FFF');
        _drawLocalRectOutline(x + 20, y + 50, w - 40, h - 100, '#222', 2);
        _drawLocalText("l a p i z", x + 20, y + 60, '#222', 2, 15);
        _drawLocalText("🎨", x + 20, y + 75, '#222', 3, 25);
    }

    function _handleShoppingMallClick(cx, cy) {
        for (const btn of _lastShoppingMallButtons) {
            if (cx >= btn.x && cx <= btn.x + btn.w && cy >= btn.y && cy <= btn.y + btn.h) {
                switch (btn.action) {
                    case 'shop':
                        _currentShoppingMallState = 'shop';
                        break;
                    case 'inventory':
                        _currentShoppingMallState = 'inventory';
                        break;
                    case 'buy':
                        const prod = _shoppingMallProducts.find(p => p.id === btn.id);
                        if (prod && _userCoins >= prod.price) {
                            _userCoins -= prod.price;
                            _userInventory.push(prod.id);
                            saveState();
                        } else if (prod) {
                            alert("¡No tienes suficientes coins!");
                        }
                        break;
                }
                _renderShoppingMall();
                return;
            }
        }
    }

    function _renderShoppingMall() {
        if (!_drawariaCanvas) return;
        const shopW = 500, shopH = 300;
        const { x, y, w, h } = { x: _drawariaCanvas.width / 2 - shopW / 2, y: _drawariaCanvas.height - shopH - 32, w: shopW, h: shopH };
        _lastShoppingMallButtons = [];

        _drawLocalFilledRect(x, y, w, h, '#f4f4f4');
        _drawLocalRectOutline(x, y, w, h, '#222', 4);
        _drawLocalText("c e n t r o   c o m e r c i a l", x + 10, y + 10, '#222', 3, 18);
        _drawLocalText(`c o i n s: ${_userCoins}`, x + 10, y + 30, '#555', 2, 15);
        _drawActionButton(x + 10, y + 45, 100, 30, 't i e n d a', 'shop', _lastShoppingMallButtons);
        _drawActionButton(x + 120, y + 45, 100, 30, 'i n v e n t', 'inventory', _lastShoppingMallButtons);

        switch (_currentShoppingMallState) {
            case 'shop': _renderShopItems(x, y, w, h); break;
            case 'inventory': _renderInventory(x, y, w, h); break;
        }
    }

    function _renderShopItems(x, y, w, h) {
        const itemX = x + 20, itemY = y + 80, itemW = 100, itemH = 60, pad = 10;
        let currentY = itemY;
        _shoppingMallProducts.forEach(item => {
            _drawLocalFilledRect(itemX, currentY, itemW, itemH, '#EEE');
            _drawLocalRectOutline(itemX, currentY, itemW, itemH, '#555', 2);
            _drawLocalText(item.name, itemX + 5, currentY + 5, '#222', 2, 14);
            _drawLocalText(`$${item.price}`, itemX + 5, currentY + 25, '#444', 2, 12);
            const canAfford = _userCoins >= item.price;
            _drawActionButton(itemX + 60, currentY + 30, 35, 20, 'c o m p', 'buy', _lastShoppingMallButtons, canAfford ? '#4a90e2' : '#999', '#FFF', 12, 1, '#222', 1, { id: item.id });
            currentY += itemH + pad;
        });
    }

    function _renderInventory(x, y, w, h) {
        _drawLocalText("i n v e n t a r i o", x + 20, y + 80, '#222', 3, 16);
        let invY = y + 100;
        if (_userInventory.length === 0) {
            _drawLocalText("v a c i o", x + 30, invY, '#555', 2, 14);
        } else {
            const counts = _userInventory.reduce((acc, curr) => {
                acc[curr] = (acc[curr] || 0) + 1;
                return acc;
            }, {});
            for (const itemId in counts) {
                 const product = _shoppingMallProducts.find(p => p.id === itemId);
                 if (product) {
                    _drawLocalText(`${product.name} x ${counts[itemId]}`, x + 30, invY, '#222', 2, 14);
                    invY += 20;
                 }
            }
        }
    }

    function _handleHotelClick(cx, cy) {
        for (const btn of _lastHotelButtons) {
            if (cx >= btn.x && cx <= btn.x + btn.w && cy >= btn.y && cy <= btn.y + btn.h) {
                switch (btn.action) {
                    case 'lobby':
                        _currentHotelState = 'lobby';
                        break;
                    case 'rent':
                        if (_userCoins >= 10) {
                            _userCoins -= 10;
                            _currentHotelState = 'room';
                            saveState();
                        } else {
                            alert("¡No tienes suficientes coins para alquilar!");
                        }
                        break;
                    case 'check_out':
                        _currentHotelState = 'lobby';
                        break;
                }
                _renderHotel();
                return;
            }
        }
    }

    function _renderHotel() {
        if (!_drawariaCanvas) return;
        const hotelW = 400, hotelH = 250;
        const { x, y, w, h } = { x: 30, y: 30, w: hotelW, h: hotelH };
        _lastHotelButtons = [];

        _drawLocalFilledRect(x, y, w, h, '#E0F7FA');
        _drawLocalRectOutline(x, y, w, h, '#222', 4);
        _drawLocalText("h o t e l", x + 10, y + 10, '#369', 3, 18);
        _drawLocalText(`c o i n s: ${_userCoins}`, x + 10, y + 30, '#555', 2, 15);

        switch (_currentHotelState) {
            case 'lobby': _renderHotelLobby(x, y, w, h); break;
            case 'room': _renderHotelRoom(x, y, w, h); break;
        }
    }

    function _renderHotelLobby(x, y, w, h) {
        _drawLocalText("b i e n v e n i d o", x + w / 2 - 60, y + 60, '#369', 3, 18);
        _drawLocalText("r e n t a   u n a   h a b i t", x + 20, y + 100, '#555', 2, 14);
        _drawLocalText("c o s t o: 10 c", x + 20, y + 120, '#555', 2, 14);
        const canRent = _userCoins >= 10;
        _drawActionButton(x + 20, y + h - 50, 150, 30, "a l q u i l a r", 'rent', _lastHotelButtons, canRent ? '#4a90e2' : '#999', '#FFF', 14, 1, '#222', 1);
    }

    function _renderHotelRoom(x, y, w, h) {
        _drawLocalText("t u   h a b i t a c i o n", x + w / 2 - 80, y + 60, '#369', 3, 18);
        _drawLocalText("h o r a   d e   r e l a j", x + 20, y + 100, '#555', 2, 14);
        _drawActionButton(x + 20, y + h - 50, 150, 30, "d e s a l o j a r", 'check_out', _lastHotelButtons, '#DC3545', '#FFF', 14, 1, '#222', 1);
    }

    function _handleTechCenterClick(cx, cy) {
        for (const btn of _lastTechCenterButtons) {
            if (cx >= btn.x && cx <= btn.x + btn.w && cy >= btn.y && cy <= btn.y + btn.h) {
                switch (btn.action) {
                    case 'main':
                        _currentTechCenterState = 'main';
                        break;
                    case 'buy_tech':
                        const prod = _techCenterProducts.find(p => p.id === btn.id);
                        if (prod && _userCoins >= prod.price) {
                            _userCoins -= prod.price;
                            _userInventory.push(prod.id);
                            saveState();
                        } else if (prod) {
                             alert("¡No tienes suficientes coins!");
                        }
                        break;
                }
                _renderTechCenter();
                return;
            }
        }
    }

    function _renderTechCenter() {
        if (!_drawariaCanvas) return;
        const techW = 500, techH = 300;
        const { x, y, w, h } = { x: _drawariaCanvas.width / 2 - techW / 2, y: _drawariaCanvas.height / 2 - techH / 2, w: techW, h: techH };
        _lastTechCenterButtons = [];

        _drawLocalFilledRect(x, y, w, h, '#212121');
        _drawLocalRectOutline(x, y, w, h, '#9E9E9E', 4);
        _drawLocalText("t e c n o l o g i a", x + 10, y + 10, '#E0F7FA', 3, 18);
        _drawLocalText(`c o i n s: ${_userCoins}`, x + 10, y + 30, '#BDBDBD', 2, 15);
        _drawActionButton(x + 10, y + 45, 100, 30, 'm e n u', 'main', _lastTechCenterButtons);

        switch (_currentTechCenterState) {
            case 'main': _renderTechItems(x, y, w, h); break;
        }
    }

    function _renderTechItems(x, y, w, h) {
        const itemX = x + 20, itemY = y + 80, itemW = 100, itemH = 60, pad = 10;
        let currentY = itemY;
        _techCenterProducts.forEach(item => {
            _drawLocalFilledRect(itemX, currentY, itemW, itemH, '#424242');
            _drawLocalRectOutline(itemX, currentY, itemW, itemH, '#757575', 2);
            _drawLocalText(item.name, itemX + 5, currentY + 5, '#E0F7FA', 2, 14);
            _drawLocalText(`$${item.price}`, itemX + 5, currentY + 25, '#BDBDBD', 2, 12);
            const canAfford = _userCoins >= item.price;
            _drawActionButton(itemX + 60, currentY + 30, 35, 20, 'c o m p', 'buy_tech', _lastTechCenterButtons, canAfford ? '#4a90e2' : '#999', '#FFF', 12, 1, '#222', 1, { id: item.id });
            currentY += itemH + pad;
        });
    }

    // --- Inicialización ---
    _onStartup();

})();