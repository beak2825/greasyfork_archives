// ==UserScript==
// @name         Crosshair RGB Avançado CA
// @namespace    crosshair.ca.rgb.advanced
// @version      3.0
// @description  Mira RGB com efeitos visuais decorativos e customização completa
// @author       CA
// @match        *://kour.io*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555558/Crosshair%20RGB%20Avan%C3%A7ado%20CA.user.js
// @updateURL https://update.greasyfork.org/scripts/555558/Crosshair%20RGB%20Avan%C3%A7ado%20CA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======= CARREGAR CONFIGURAÇÕES =======
    const defaultConfig = {
        formato: 'cross',
        size: 12,
        rgbSpeed: 5,
        opacity: 0.8,
        thickness: 2,
        gap: 5,
        offsetX: 0,
        offsetY: 0,
        colorMode: 'rgb',
        staticColor: '#00ff00',
        outlineEnabled: true,
        enabled: true,
        // Novos efeitos
        pulseEnabled: false,
        pulseSpeed: 2,
        rotationEnabled: false,
        rotationSpeed: 1,
        glowEnabled: false,
        glowIntensity: 15,
        gradientEnabled: false,
        shadowEnabled: false,
        shadowBlur: 10,
        particlesEnabled: false,
        particleCount: 6,
        starsEnabled: false,
        starCount: 8,
        wavesEnabled: false,
        waveSpeed: 2
    };

    function loadConfig() {
        const saved = localStorage.getItem('crosshairConfig');
        return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig;
    }

    function saveConfig(config) {
        localStorage.setItem('crosshairConfig', JSON.stringify(config));
    }

    let config = loadConfig();

    // ======= CRIAR MENU =======
    const menu = document.createElement("div");
    menu.id = "crossMenu";
    menu.innerHTML = `
      <div id="menuHeader">
        <h3 style="margin:0;">Mira Custom CA</h3>
        <button id="toggleMenu" style="background:none;border:none;color:white;font-size:18px;cursor:pointer;">−</button>
      </div>
      <div id="menuContent">
        <label>Formato:</label>
        <select id="formato">
          <option value="cross">Cruz</option>
          <option value="crossGap">Cruz com Gap</option>
          <option value="dot">Ponto</option>
          <option value="circle">Circunferência</option>
          <option value="circleFilled">Círculo Cheio</option>
          <option value="circleDot">Círculo + Ponto</option>
          <option value="square">Quadrado</option>
          <option value="squareFilled">Quadrado Cheio</option>
          <option value="tShape">Mira em T</option>
        </select>

        <label>Tamanho: <span id="sizeVal">${config.size}</span></label>
        <input type="range" id="size" min="4" max="50" value="${config.size}">

        <label>Gap/Espaçamento: <span id="gapVal">${config.gap}</span></label>
        <input type="range" id="gap" min="0" max="20" value="${config.gap}">

        <label>Espessura: <span id="thicknessVal">${config.thickness}</span></label>
        <input type="range" id="thickness" min="1" max="8" value="${config.thickness}">

        <label>Opacidade: <span id="opacityVal">${Math.round(config.opacity * 100)}%</span></label>
        <input type="range" id="opacity" min="0.1" max="1" step="0.1" value="${config.opacity}">

        <label>Modo de Cor:</label>
        <select id="colorMode">
          <option value="rgb">RGB Animado</option>
          <option value="static">Cor Estática</option>
          <option value="rainbow">Arco-Íris Suave</option>
        </select>

        <div id="rgbControls">
          <label>RGB Speed: <span id="rgbSpeedVal">${config.rgbSpeed}</span></label>
          <input type="range" id="rgbSpeed" min="1" max="20" value="${config.rgbSpeed}">
        </div>

        <div id="staticColorControl" style="display:none;">
          <label>Cor:</label>
          <input type="color" id="staticColor" value="${config.staticColor}">
        </div>

        <label>
          <input type="checkbox" id="outlineEnabled" ${config.outlineEnabled ? 'checked' : ''}>
          Contorno Preto
        </label>

        <hr style="margin:15px 0;border:none;border-top:1px solid #333;">
        <h4 style="margin:10px 0 5px 0;font-size:13px;">✨ Efeitos Visuais</h4>

        <label>
          <input type="checkbox" id="pulseEnabled" ${config.pulseEnabled ? 'checked' : ''}>
          Pulsação Suave
        </label>
        <div id="pulseControls" style="display:${config.pulseEnabled ? 'block' : 'none'}">
          <label style="font-size:11px;opacity:0.8;">Velocidade: <span id="pulseSpeedVal">${config.pulseSpeed}</span></label>
          <input type="range" id="pulseSpeed" min="0.5" max="5" step="0.5" value="${config.pulseSpeed}">
        </div>

        <label>
          <input type="checkbox" id="rotationEnabled" ${config.rotationEnabled ? 'checked' : ''}>
          Rotação Lenta
        </label>
        <div id="rotationControls" style="display:${config.rotationEnabled ? 'block' : 'none'}">
          <label style="font-size:11px;opacity:0.8;">Velocidade: <span id="rotationSpeedVal">${config.rotationSpeed}</span></label>
          <input type="range" id="rotationSpeed" min="0.5" max="5" step="0.5" value="${config.rotationSpeed}">
        </div>

        <label>
          <input type="checkbox" id="glowEnabled" ${config.glowEnabled ? 'checked' : ''}>
          Brilho/Glow
        </label>
        <div id="glowControls" style="display:${config.glowEnabled ? 'block' : 'none'}">
          <label style="font-size:11px;opacity:0.8;">Intensidade: <span id="glowIntensityVal">${config.glowIntensity}</span></label>
          <input type="range" id="glowIntensity" min="5" max="30" value="${config.glowIntensity}">
        </div>

        <label>
          <input type="checkbox" id="gradientEnabled" ${config.gradientEnabled ? 'checked' : ''}>
          Gradiente Animado
        </label>

        <label>
          <input type="checkbox" id="shadowEnabled" ${config.shadowEnabled ? 'checked' : ''}>
          Sombra Colorida
        </label>
        <div id="shadowControls" style="display:${config.shadowEnabled ? 'block' : 'none'}">
          <label style="font-size:11px;opacity:0.8;">Desfoque: <span id="shadowBlurVal">${config.shadowBlur}</span></label>
          <input type="range" id="shadowBlur" min="5" max="30" value="${config.shadowBlur}">
        </div>

        <hr style="margin:15px 0;border:none;border-top:1px solid #333;">
        <h4 style="margin:10px 0 5px 0;font-size:13px;">🌟 Partículas</h4>

        <label>
          <input type="checkbox" id="particlesEnabled" ${config.particlesEnabled ? 'checked' : ''}>
          Partículas Orbitando
        </label>
        <div id="particleControls" style="display:${config.particlesEnabled ? 'block' : 'none'}">
          <label style="font-size:11px;opacity:0.8;">Quantidade: <span id="particleCountVal">${config.particleCount}</span></label>
          <input type="range" id="particleCount" min="3" max="12" value="${config.particleCount}">
        </div>

        <label>
          <input type="checkbox" id="starsEnabled" ${config.starsEnabled ? 'checked' : ''}>
          Estrelinhas
        </label>
        <div id="starControls" style="display:${config.starsEnabled ? 'block' : 'none'}">
          <label style="font-size:11px;opacity:0.8;">Quantidade: <span id="starCountVal">${config.starCount}</span></label>
          <input type="range" id="starCount" min="4" max="16" value="${config.starCount}">
        </div>

        <label>
          <input type="checkbox" id="wavesEnabled" ${config.wavesEnabled ? 'checked' : ''}>
          Ondas de Energia
        </label>
        <div id="waveControls" style="display:${config.wavesEnabled ? 'block' : 'none'}">
          <label style="font-size:11px;opacity:0.8;">Velocidade: <span id="waveSpeedVal">${config.waveSpeed}</span></label>
          <input type="range" id="waveSpeed" min="0.5" max="5" step="0.5" value="${config.waveSpeed}">
        </div>

        <hr style="margin:15px 0;border:none;border-top:1px solid #333;">

        <label>Offset X: <span id="offsetXVal">${config.offsetX}</span></label>
        <input type="range" id="offsetX" min="-100" max="100" value="${config.offsetX}">

        <label>Offset Y: <span id="offsetYVal">${config.offsetY}</span></label>
        <input type="range" id="offsetY" min="-100" max="100" value="${config.offsetY}">

        <button id="resetBtn" style="width:100%;margin-top:10px;padding:8px;cursor:pointer;background:#c33;color:white;border:none;border-radius:5px;">
          Resetar Configurações
        </button>

        <div style="margin-top:10px;font-size:11px;opacity:0.7;">
          Pressione [M] para ligar/desligar
        </div>
      </div>
    `;
    document.body.appendChild(menu);

    // ======= ESTILO DO MENU =======
    const style = document.createElement("style");
    style.textContent = `
      #crossMenu {
        position: fixed;
        top: 20px;
        left: 20px;
        background: rgba(17, 17, 17, 0.95);
        padding: 15px;
        border-radius: 14px;
        color: white;
        font-family: Arial, sans-serif;
        width: 220px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 0 20px rgba(0,0,0,0.8);
        user-select: none;
        z-index: 9999999;
        backdrop-filter: blur(10px);
      }
      #crossMenu::-webkit-scrollbar {
        width: 8px;
      }
      #crossMenu::-webkit-scrollbar-track {
        background: #1a1a1a;
        border-radius: 10px;
      }
      #crossMenu::-webkit-scrollbar-thumb {
        background: #444;
        border-radius: 10px;
      }
      #menuHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      #toggleMenu:hover {
        opacity: 0.7;
      }
      #crossMenu label {
        font-size: 13px;
        margin-top: 10px;
        display: block;
      }
      #crossMenu select, #crossMenu input[type="range"], #crossMenu input[type="color"] {
        width: 100%;
        margin-top: 5px;
      }
      #crossMenu input[type="checkbox"] {
        width: auto;
        margin-right: 5px;
      }
      #crossCanvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9999998;
      }
      .crosshair-disabled {
        opacity: 0 !important;
      }
    `;
    document.head.appendChild(style);

    // ======= CANVAS DA MIRA =======
    const canvas = document.createElement("canvas");
    canvas.id = "crossCanvas";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    let hue = 0;
    let animationId = null;
    let time = 0;
    let rotation = 0;
    let waves = [];

    // ======= APLICAR CONFIGURAÇÕES AO MENU =======
    function applyConfigToMenu() {
        document.getElementById('formato').value = config.formato;
        document.getElementById('size').value = config.size;
        document.getElementById('rgbSpeed').value = config.rgbSpeed;
        document.getElementById('opacity').value = config.opacity;
        document.getElementById('thickness').value = config.thickness;
        document.getElementById('gap').value = config.gap;
        document.getElementById('offsetX').value = config.offsetX;
        document.getElementById('offsetY').value = config.offsetY;
        document.getElementById('colorMode').value = config.colorMode;
        document.getElementById('staticColor').value = config.staticColor;
        document.getElementById('outlineEnabled').checked = config.outlineEnabled;
        document.getElementById('pulseEnabled').checked = config.pulseEnabled;
        document.getElementById('pulseSpeed').value = config.pulseSpeed;
        document.getElementById('rotationEnabled').checked = config.rotationEnabled;
        document.getElementById('rotationSpeed').value = config.rotationSpeed;
        document.getElementById('glowEnabled').checked = config.glowEnabled;
        document.getElementById('glowIntensity').value = config.glowIntensity;
        document.getElementById('gradientEnabled').checked = config.gradientEnabled;
        document.getElementById('shadowEnabled').checked = config.shadowEnabled;
        document.getElementById('shadowBlur').value = config.shadowBlur;
        document.getElementById('particlesEnabled').checked = config.particlesEnabled;
        document.getElementById('particleCount').value = config.particleCount;
        document.getElementById('starsEnabled').checked = config.starsEnabled;
        document.getElementById('starCount').value = config.starCount;
        document.getElementById('wavesEnabled').checked = config.wavesEnabled;
        document.getElementById('waveSpeed').value = config.waveSpeed;
        updateColorModeVisibility();
        updateEffectVisibility();
    }

    applyConfigToMenu();

    // ======= FUNÇÕES DE EFEITOS =======
    function drawParticles(x, y, color) {
        const count = config.particleCount;
        const radius = config.size + 15;
        for (let i = 0; i < count; i++) {
            const angle = (time * 0.5 + (i * (Math.PI * 2) / count));
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    function drawStars(x, y, color) {
        const count = config.starCount;
        const radius = config.size + 20;
        for (let i = 0; i < count; i++) {
            const angle = time * 0.3 + (i * (Math.PI * 2) / count);
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            const opacity = (Math.sin(time * 3 + i) + 1) / 2;
            ctx.globalAlpha = opacity * config.opacity * 0.7;
            ctx.fillStyle = color;
            ctx.beginPath();
            for (let j = 0; j < 5; j++) {
                const starAngle = (j * Math.PI * 2 / 5) + angle;
                const starRadius = j % 2 === 0 ? 3 : 1.5;
                const starX = px + Math.cos(starAngle) * starRadius;
                const starY = py + Math.sin(starAngle) * starRadius;
                if (j === 0) ctx.moveTo(starX, starY);
                else ctx.lineTo(starX, starY);
            }
            ctx.closePath();
            ctx.fill();
        }
        ctx.globalAlpha = config.opacity;
    }

    function updateWaves(x, y) {
        if (time % (60 / config.waveSpeed) < 1) {
            waves.push({ radius: 0, opacity: 1 });
        }
        waves = waves.filter(wave => {
            wave.radius += 1.5;
            wave.opacity -= 0.015;
            return wave.opacity > 0;
        });
    }

    function drawWaves(x, y, color) {
        waves.forEach(wave => {
            ctx.globalAlpha = wave.opacity * config.opacity;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, config.size + wave.radius, 0, Math.PI * 2);
            ctx.stroke();
        });
        ctx.globalAlpha = config.opacity;
    }

    // ======= DESENHO DA MIRA =======
    function drawCrosshair() {
        if (!config.enabled) {
            canvas.classList.add('crosshair-disabled');
            return;
        }

        canvas.classList.remove('crosshair-disabled');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        time += 0.05;

        let size = config.size;
        if (config.pulseEnabled) {
            const pulse = Math.sin(time * config.pulseSpeed) * 2;
            size += pulse;
        }

        if (config.rotationEnabled) {
            rotation += config.rotationSpeed * 0.02;
        }

        const gap = config.gap;
        const thickness = config.thickness;
        const formato = config.formato;

        // Atualizar cor
        let color;
        if (config.colorMode === 'rgb') {
            hue = (hue + config.rgbSpeed * 0.5) % 360;
            color = `hsl(${hue}, 100%, 50%)`;
        } else if (config.colorMode === 'rainbow') {
            hue = (hue + 1) % 360;
            color = `hsl(${hue}, 100%, 50%)`;
        } else {
            color = config.staticColor;
        }

        const x = canvas.width / 2 + config.offsetX;
        const y = canvas.height / 2 + config.offsetY;

        // Ondas de energia
        if (config.wavesEnabled) {
            updateWaves(x, y);
            drawWaves(x, y, color);
        }

        // Partículas orbitando
        if (config.particlesEnabled) {
            drawParticles(x, y, color);
        }

        // Estrelinhas
        if (config.starsEnabled) {
            drawStars(x, y, color);
        }

        ctx.save();
        ctx.translate(x, y);
        if (config.rotationEnabled) {
            ctx.rotate(rotation);
        }
        ctx.translate(-x, -y);

        ctx.globalAlpha = config.opacity;

        // Sombra colorida
        if (config.shadowEnabled) {
            ctx.shadowColor = color;
            ctx.shadowBlur = config.shadowBlur;
        }

        // Glow effect
        if (config.glowEnabled) {
            ctx.shadowColor = color;
            ctx.shadowBlur = config.glowIntensity;
        }

        // Desenhar outline se ativado
        if (config.outlineEnabled && !config.gradientEnabled) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.lineWidth = thickness + 2;
            ctx.shadowBlur = 0;
            drawShape(formato, x, y, size, gap);
        }

        // Desenhar mira principal
        if (config.gradientEnabled) {
            const gradient = ctx.createLinearGradient(
                x - size, y - size,
                x + size, y + size
            );
            gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
            gradient.addColorStop(0.5, `hsl(${(hue + 120) % 360}, 100%, 50%)`);
            gradient.addColorStop(1, `hsl(${(hue + 240) % 360}, 100%, 50%)`);
            ctx.strokeStyle = gradient;
            ctx.fillStyle = gradient;
        } else {
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
        }

        ctx.lineWidth = thickness;
        drawShape(formato, x, y, size, gap);

        ctx.restore();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        if (config.enabled) {
            animationId = requestAnimationFrame(drawCrosshair);
        }
    }

    function drawShape(formato, x, y, size, gap) {
        ctx.beginPath();

        switch(formato) {
            case 'cross':
                ctx.moveTo(x, y - size);
                ctx.lineTo(x, y + size);
                ctx.moveTo(x - size, y);
                ctx.lineTo(x + size, y);
                ctx.stroke();
                break;

            case 'crossGap':
                ctx.moveTo(x, y - size);
                ctx.lineTo(x, y - gap);
                ctx.moveTo(x, y + gap);
                ctx.lineTo(x, y + size);
                ctx.moveTo(x - size, y);
                ctx.lineTo(x - gap, y);
                ctx.moveTo(x + gap, y);
                ctx.lineTo(x + size, y);
                ctx.stroke();
                break;

            case 'dot':
                ctx.arc(x, y, size / 3, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'circle':
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.stroke();
                break;

            case 'circleFilled':
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'circleDot':
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(x, y, size / 4, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'square':
                ctx.strokeRect(x - size, y - size, size * 2, size * 2);
                break;

            case 'squareFilled':
                ctx.fillRect(x - size, y - size, size * 2, size * 2);
                break;

            case 'tShape':
                ctx.moveTo(x, y - size);
                ctx.lineTo(x, y + size);
                ctx.moveTo(x - size, y - size);
                ctx.lineTo(x + size, y - size);
                ctx.stroke();
                break;
        }
    }

    // ======= EVENT LISTENERS =======
    function updateValue(id, displayId, suffix = '') {
        const el = document.getElementById(id);
        const display = document.getElementById(displayId);
        if (el && display) {
            display.textContent = Math.round(parseFloat(el.value) * (suffix === '%' ? 100 : 1)) + suffix;
        }
    }

    function updateColorModeVisibility() {
        const mode = config.colorMode;
        document.getElementById('rgbControls').style.display =
            (mode === 'rgb') ? 'block' : 'none';
        document.getElementById('staticColorControl').style.display =
            (mode === 'static') ? 'block' : 'none';
    }

    function updateEffectVisibility() {
        document.getElementById('pulseControls').style.display =
            config.pulseEnabled ? 'block' : 'none';
        document.getElementById('rotationControls').style.display =
            config.rotationEnabled ? 'block' : 'none';
        document.getElementById('glowControls').style.display =
            config.glowEnabled ? 'block' : 'none';
        document.getElementById('shadowControls').style.display =
            config.shadowEnabled ? 'block' : 'none';
        document.getElementById('particleControls').style.display =
            config.particlesEnabled ? 'block' : 'none';
        document.getElementById('starControls').style.display =
            config.starsEnabled ? 'block' : 'none';
        document.getElementById('waveControls').style.display =
            config.wavesEnabled ? 'block' : 'none';
    }

    // Configurações básicas
    document.getElementById('formato').addEventListener('change', (e) => {
        config.formato = e.target.value;
        saveConfig(config);
    });

    document.getElementById('size').addEventListener('input', (e) => {
        config.size = Number(e.target.value);
        updateValue('size', 'sizeVal');
        saveConfig(config);
    });

    document.getElementById('gap').addEventListener('input', (e) => {
        config.gap = Number(e.target.value);
        updateValue('gap', 'gapVal');
        saveConfig(config);
    });

    document.getElementById('thickness').addEventListener('input', (e) => {
        config.thickness = Number(e.target.value);
        updateValue('thickness', 'thicknessVal');
        saveConfig(config);
    });

    document.getElementById('opacity').addEventListener('input', (e) => {
        config.opacity = Number(e.target.value);
        updateValue('opacity', 'opacityVal', '%');
        saveConfig(config);
    });

    document.getElementById('rgbSpeed').addEventListener('input', (e) => {
        config.rgbSpeed = Number(e.target.value);
        updateValue('rgbSpeed', 'rgbSpeedVal');
        saveConfig(config);
    });

    document.getElementById('colorMode').addEventListener('change', (e) => {
        config.colorMode = e.target.value;
        updateColorModeVisibility();
        saveConfig(config);
    });

    document.getElementById('staticColor').addEventListener('input', (e) => {
        config.staticColor = e.target.value;
        saveConfig(config);
    });

    document.getElementById('outlineEnabled').addEventListener('change', (e) => {
        config.outlineEnabled = e.target.checked;
        saveConfig(config);
    });

    // Efeitos visuais
    document.getElementById('pulseEnabled').addEventListener('change', (e) => {
        config.pulseEnabled = e.target.checked;
        updateEffectVisibility();
        saveConfig(config);
    });

    document.getElementById('pulseSpeed').addEventListener('input', (e) => {
        config.pulseSpeed = Number(e.target.value);
        updateValue('pulseSpeed', 'pulseSpeedVal');
        saveConfig(config);
    });

    document.getElementById('rotationEnabled').addEventListener('change', (e) => {
        config.rotationEnabled = e.target.checked;
        updateEffectVisibility();
        saveConfig(config);
    });

    document.getElementById('rotationSpeed').addEventListener('input', (e) => {
        config.rotationSpeed = Number(e.target.value);
        updateValue('rotationSpeed', 'rotationSpeedVal');
        saveConfig(config);
    });

    document.getElementById('glowEnabled').addEventListener('change', (e) => {
        config.glowEnabled = e.target.checked;
        updateEffectVisibility();
        saveConfig(config);
    });

    document.getElementById('glowIntensity').addEventListener('input', (e) => {
        config.glowIntensity = Number(e.target.value);
        updateValue('glowIntensity', 'glowIntensityVal');
        saveConfig(config);
    });

    document.getElementById('gradientEnabled').addEventListener('change', (e) => {
        config.gradientEnabled = e.target.checked;
        saveConfig(config);
    });

    document.getElementById('shadowEnabled').addEventListener('change', (e) => {
        config.shadowEnabled = e.target.checked;
        updateEffectVisibility();
        saveConfig(config);
    });

    document.getElementById('shadowBlur').addEventListener('input', (e) => {
        config.shadowBlur = Number(e.target.value);
        updateValue('shadowBlur', 'shadowBlurVal');
        saveConfig(config);
    });

    // Partículas
    document.getElementById('particlesEnabled').addEventListener('change', (e) => {
        config.particlesEnabled = e.target.checked;
        updateEffectVisibility();
        saveConfig(config);
    });

    document.getElementById('particleCount').addEventListener('input', (e) => {
        config.particleCount = Number(e.target.value);
        updateValue('particleCount', 'particleCountVal');
        saveConfig(config);
    });

    document.getElementById('starsEnabled').addEventListener('change', (e) => {
        config.starsEnabled = e.target.checked;
        updateEffectVisibility();
        saveConfig(config);
    });

    document.getElementById('starCount').addEventListener('input', (e) => {
        config.starCount = Number(e.target.value);
        updateValue('starCount', 'starCountVal');
        saveConfig(config);
    });

    document.getElementById('wavesEnabled').addEventListener('change', (e) => {
        config.wavesEnabled = e.target.checked;
        waves = []; // Limpar ondas ao ativar/desativar
        updateEffectVisibility();
        saveConfig(config);
    });

    document.getElementById('waveSpeed').addEventListener('input', (e) => {
        config.waveSpeed = Number(e.target.value);
        updateValue('waveSpeed', 'waveSpeedVal');
        saveConfig(config);
    });

    document.getElementById('offsetX').addEventListener('input', (e) => {
        config.offsetX = Number(e.target.value);
        updateValue('offsetX', 'offsetXVal');
        saveConfig(config);
    });

    document.getElementById('offsetY').addEventListener('input', (e) => {
        config.offsetY = Number(e.target.value);
        updateValue('offsetY', 'offsetYVal');
        saveConfig(config);
    });

    // Reset
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Resetar todas as configurações?')) {
            config = { ...defaultConfig };
            saveConfig(config);
            applyConfigToMenu();
            waves = [];
            rotation = 0;
            time = 0;
        }
    });

    // Toggle Menu
    let menuVisible = true;
    document.getElementById('toggleMenu').addEventListener('click', () => {
        menuVisible = !menuVisible;
        const content = document.getElementById('menuContent');
        const btn = document.getElementById('toggleMenu');
        content.style.display = menuVisible ? 'block' : 'none';
        btn.textContent = menuVisible ? '−' : '+';
    });

    // Hotkey M para toggle da mira
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'm') {
            config.enabled = !config.enabled;
            saveConfig(config);
            if (config.enabled) {
                drawCrosshair();
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    });

    // Pausar quando aba inativa
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        } else if (config.enabled) {
            drawCrosshair();
        }
    });

    // Iniciar valores dos displays
    updateValue('size', 'sizeVal');
    updateValue('gap', 'gapVal');
    updateValue('thickness', 'thicknessVal');
    updateValue('opacity', 'opacityVal', '%');
    updateValue('rgbSpeed', 'rgbSpeedVal');
    updateValue('pulseSpeed', 'pulseSpeedVal');
    updateValue('rotationSpeed', 'rotationSpeedVal');
    updateValue('glowIntensity', 'glowIntensityVal');
    updateValue('shadowBlur', 'shadowBlurVal');
    updateValue('particleCount', 'particleCountVal');
    updateValue('starCount', 'starCountVal');
    updateValue('waveSpeed', 'waveSpeedVal');
    updateValue('offsetX', 'offsetXVal');
    updateValue('offsetY', 'offsetYVal');

    // Iniciar
    if (config.enabled) {
        drawCrosshair();
    }
})();