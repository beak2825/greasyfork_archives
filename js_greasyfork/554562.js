// ==UserScript==
// @name         Drawaria Game Level 1 - Start Point
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Level 1: Start Point. Navigate the dark platform to the end to advance the background. Complete all three phases to talk to the Cube Fairy and finish the level.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/
// @match        https://*.drawaria.online/*
// @match        https://drawaria.online/test
// @match        https://drawaria.online/room/*
// @grant        none
// @license      MIT
// @icon         https://drawaria.online/avatar/cache/86e33830-86ea-11ec-8553-bff27824cf71.jpg
// ==/UserScript==

(function() {
    'use strict';

// =====================================================================
// === MITIGACIÓN DE FUERZA BRUTA: INICIO (DEBE IR AL COMIENZO) ===
// =====================================================================

// Guardar referencias a las funciones originales
const originalSetTimeout = window.setTimeout;
const originalClearTimeout = window.clearTimeout;
const timersToBlock = new Map();

// 1. Reemplazar setTimeout para capturar y bloquear llamadas de inicio de nivel.
window.setTimeout = function(callback, delay) {
    // Si la llamada parece ser el inicio del juego (es un callback de función y no una string)
    // la guardamos en el Map y le devolvemos un ID falso.
    if (typeof callback === 'function') {
        const timerId = Date.now() + Math.random();
        timersToBlock.set(timerId, { callback: callback, delay: delay, state: 'pending' });
        // console.log(`[MITIGATION] Bloqueado timer: ${timerId} (Bloqueando inicio de nivel)`);
        return timerId;
    }
    // Si no es una función (ej. una string o una llamada legítima del navegador), usa el original
    return originalSetTimeout(callback, delay);
};

// 2. Reemplazar clearTimeout (para que los scripts puedan limpiar sus propios timers)
window.clearTimeout = function(timerId) {
    if (timersToBlock.has(timerId)) {
        timersToBlock.delete(timerId);
        // console.log(`[MITIGATION] Limpiado timer bloqueado: ${timerId}`);
    } else {
        originalClearTimeout(timerId);
    }
};

// 3. Crear función de restauración (Se llamará ANTES de lanzar el nivel)
function restoreSetTimeout() {
    window.setTimeout = originalSetTimeout;
    window.clearTimeout = originalClearTimeout;
    // console.log("[MITIGATION] Restored setTimeout/clearTimeout.");
}

// 4. Crear la función que ejecuta la llamada de inicio bloqueada
function executeBlockedTimer(functionName) {
    let executed = false;
    for (const [id, timer] of timersToBlock.entries()) {
        if (timer.callback.toString().includes(functionName)) {
            // console.log(`[MITIGATION] Ejecutando: ${functionName} con ID ${id}`);
            
            // 1. Restaurar las funciones originales ANTES de ejecutar el código del nivel
            restoreSetTimeout();
            
            // 2. Ejecutar el callback (que es la función anónima con el código de inicio del nivel)
            timer.callback();
            
            // 3. Limpiar el registro y salir del bucle
            timersToBlock.delete(id);
            executed = true;
            break;
        }
    }
    
    if (!executed) {
        // En caso de que el script requerido haya sido muy rápido y no haya usado setTimeout (poco probable con tu estructura)
        // Intentar llamar la función directamente (Se asume que la función de inicio está en window)
        if (typeof window[functionName] === 'function') {
             window[functionName]();
        } else {
             console.error(`[MITIGATION] Error Fatal: No se encontró la función de lanzamiento global: ${functionName}`);
        }
    }
}

// 5. Modificar la función de lanzamiento para usar la nueva lógica (Necesita acceso a la función de nivel)
// Usamos el nombre de la función que el script de nivel iba a ejecutar (ej: setupEnvironment)
function launchLevel(storyName) {
    const functionName = STORY_LAUNCH_FUNCTION_NAMES[storyName];

    // Limpieza de la pantalla de selección
    playSfx();
    songAudio.pause();
    const selectScreen = document.getElementById('select-screen');
    if (selectScreen) selectScreen.remove();

    // El corazón de la solución: Busca el setTimeout bloqueado y lo ejecuta.
    // Esto asume que el código del nivel se parece a:
    // (function() { ... setTimeout(setupEnvironment, 1000); ...})();
    executeBlockedTimer(functionName);
}

// 6. Resto del código del lanzador (debe ir después de esto)
// La función launchLevel debe ser la única que llama a executeBlockedTimer.

// =====================================================================
// === MITIGACIÓN DE FUERZA BRUTA: FIN ===
// =====================================================================

    // --- 1. LEVEL METADATA AND CONSTANTS ---

    const LEVEL_TITLE = "Start Point";
    const BACKGROUND_MUSIC_URL = "https://www.myinstants.com/media/sounds/drawaria-stories-start-point.mp3";
    const VIEWBOX_WIDTH = 800;
    const VIEWBOX_HEIGHT = 500;

    // Y position where the bottom of the avatar rests (simulating the ground on the SVG floor)
    const AVATAR_HEIGHT_PX = 64; // Assuming avatar scaled to 64px height for screen ratio
    const GROUND_LEVEL_Y = 450;
    const AVATAR_GROUND_Y = GROUND_LEVEL_Y - AVATAR_HEIGHT_PX; // Top position for the avatar image

    // Adjusted LEVEL_END_X: 800 + 220 = 1020. This allows the player to move far off the right edge.
    const LEVEL_END_X = VIEWBOX_WIDTH + 220; // Trigger for advancing the level (50px from right edge)
    const LEVEL_START_X = 50; // Starting X coordinate

    const CUBE_FAIRY_ID = 'cube-fairy-npc';
    const DIALOGUE_BOX_ID = 'centered-dialogue-box';

    // POSITION OF CUBE FAIRY (NPC)
    const CUBE_FAIRY_X = 650;
    const CUBE_FAIRY_Y = 250;
    const CUBE_FAIRY_SCALE = 0.3; // Scale the 500x500 SVG down

    // Dialogue for Cube Fairy (Phase 0-2)
    const DIALOGUE_LINES = [
        { name: "Cube Fairy", text: `Welcome to the ${LEVEL_TITLE}, little one.` },
        { name: "Cube Fairy", text: "You must cross this void to advance. Reach the end of the screen three times." },
        { name: "Cube Fairy", text: "Each time you successfully cross, the path will change slightly." },
        { name: "Cube Fairy", text: "I will only speak with you again once you have proven your worth." }
    ];

    // Final Dialogue (Phase 3+)
    const DIALOGUE_LINES_FINAL = [
        { name: "Cube Fairy", text: "You did it! You successfully crossed the void and adapted to the changing paths." },
        { name: "Cube Fairy", text: "This marks the end of the first level. You are ready for what comes next." },
        { name: "Cube Fairy", text: "Congratulations! Level 1 complete." }
    ];

    // --- 2. SVG ASSETS PLACEHOLDERS ---

    // Map 1: Black background with simple floor glow
    const MAP_SVG_1 = `
<?xml version="1.0" encoding="utf-8"?>
<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com">
  <rect width="100%" height="100%" fill="#000000" style="pointer-events: none;"/>
  <g style="filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));">
    <text style="fill: rgb(255, 255, 255); font-family: Arial, sans-serif; font-size: 62.3px; font-weight: 700; text-transform: capitalize; white-space: pre; transform-box: fill-box; transform-origin: 50% 50%; filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));" x="234.008" y="245.741" transform="matrix(1, 0, 0, 1.227273, 0, -66.145973)">Start Point</text>
    <rect style="fill: rgb(255, 255, 255); stroke: rgba(0, 0, 0, 0); stroke-opacity: 0;" height="12.986" x="262.127" y="200.766" width="250.735"/>
    <rect style="fill: rgb(255, 255, 255); stroke-width: 1; stroke: rgba(0, 0, 0, 0); stroke-opacity: 0;" height="6.992" x="281.607" y="223.242" width="211.776"/>
    <rect style="fill: rgb(255, 255, 255); stroke-width: 1; stroke: rgba(0, 0, 0, 0); stroke-opacity: 0;" height="4.994" x="311.575" y="238.226" width="151.839"/>
    <path d="M 380 91.392 L 389.522 110.41 L 410.604 119 L 389.522 127.59 L 380 146.608 L 370.478 127.59 L 349.396 119 L 370.478 110.41 Z" bx:shape="star 380 119 30.604 27.608 0.44 4 1@856741a6" style="stroke: rgb(0, 0, 0); stroke-width: 0px; fill: rgb(253, 253, 253);" transform="matrix(-0.99527449, 0.09710149, -0.09710152, -0.99527448, 589.3810518, 242.69671543)"/>
    <path d="M 380 91.392 L 389.522 110.41 L 410.604 119 L 389.522 127.59 L 380 146.608 L 370.478 127.59 L 349.396 119 L 370.478 110.41 Z" bx:shape="star 380 119 30.604 27.608 0.44 4 1@856741a6" style="stroke: rgb(0, 0, 0); stroke-width: 0; fill: rgb(253, 253, 253);" transform="matrix(0.99527443, 0.09710206, 0.09710206, -0.99527443, 194.57313959, 243.42127973)"/>
    <animateMotion path="M 0 0 L -0.428 17.094" calcMode="linear" begin="0s" dur="5.48s" fill="freeze" repeatCount="indefinite"/>
    <animateMotion path="M -2.136 16.026 L -1.496 -7.479" calcMode="linear" begin="5.47s" dur="4.67s" fill="freeze" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.08;1" begin="10.12s" dur="4.72s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
  </g>
  <defs>
    <filter id="glow">
      <feGaussianBlur in="SourceGraphic" stdDeviation="40" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <ellipse cx="400" cy="450" rx="350" ry="15" fill="white" filter="url(#glow)"/>
  <g transform="matrix(1, 0, 0, 1.504657, -4.23077, -282.676697)" style="filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));">
    <ellipse style="fill: rgb(255, 255, 255); stroke: rgba(0, 0, 0, 0); stroke-opacity: 0;" cx="76.229" cy="505.556" rx="11.752" ry="13.355"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 1; stroke: rgba(0, 0, 0, 0); stroke-opacity: 0;" cx="123.161" cy="499.145" rx="7.478" ry="8.547"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 1; stroke: rgba(0, 0, 0, 0); stroke-opacity: 0;" cx="164.568" cy="516.934" rx="11.752" ry="13.355"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 1; stroke: rgba(0, 0, 0, 0); stroke-opacity: 0;" cx="211.5" cy="510.523" rx="7.478" ry="8.547"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 1; stroke: rgba(0, 0, 0, 0); stroke-opacity: 0;" cx="247.902" cy="497.704" rx="11.752" ry="13.355"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 1; stroke: rgba(0, 0, 0, 0); stroke-opacity: 0;" cx="294.834" cy="491.293" rx="7.478" ry="8.547"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 1; stroke: rgba(0, 0, 0, 0); stroke-opacity: 0;" cx="322.688" cy="518.002" rx="11.752" ry="13.355"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 1; stroke: rgba(0, 0, 0, 0); stroke-opacity: 0;" cx="369.62" cy="511.591" rx="7.478" ry="8.547"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 1; stroke: rgba(0, 0, 0, 0); stroke-opacity: 0;" cx="420.978" cy="497.703" rx="11.752" ry="13.355"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 1; stroke: rgba(0, 0, 0, 0); stroke-opacity: 0;" cx="467.91" cy="491.292" rx="7.478" ry="8.547"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 1; stroke: rgba(0, 0, 0, 0); stroke-opacity: 0;" cx="509.654" cy="518.002" rx="11.752" ry="13.355"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 1; stroke: rgba(0, 0, 0, 0); stroke-opacity: 0;" cx="556.586" cy="511.591" rx="7.478" ry="8.547"/>
    <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255); stroke-width: 1; stroke-opacity: 0;" cx="595.124" cy="492.361" rx="11.752" ry="13.355"/>
    <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255); stroke-width: 1; stroke-opacity: 0;" cx="642.056" cy="485.95" rx="7.478" ry="8.547"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 1; stroke: rgba(0, 0, 0, 0); stroke-opacity: 0;" cx="673.115" cy="521.208" rx="11.752" ry="13.355"/>
    <ellipse style="fill: rgb(255, 255, 255); stroke-width: 1; stroke: rgba(0, 0, 0, 0); stroke-opacity: 0;" cx="720.047" cy="514.797" rx="7.478" ry="8.547"/>
    <animateMotion path="M -1.068 68.41 L 23.846 -131.744" calcMode="linear" begin="0s" dur="3s" fill="freeze" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0" begin="0s" dur="3s" fill="freeze" repeatCount="indefinite" keyTimes="0; 1"/>
  </g>
</svg>
`;

    // Map 2: Spotlight and Drawaria logo
    const MAP_SVG_2 = `
<?xml version="1.0" encoding="utf-8"?>
<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#000000"/>
  <defs>
    <filter id="floor-glow">
      <feGaussianBlur in="SourceGraphic" stdDeviation="40" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="spotlight-filter">
      <feGaussianBlur in="SourceGraphic" stdDeviation="25" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <ellipse cx="400" cy="450" rx="350" ry="15" fill="white" filter="url(#floor-glow)"/>
  <path d="M 300.379 0 L 500.379 0 L 549.621 433.12 L 249.621 433.12 L 300.379 0 Z" fill="white" filter="url(#spotlight-filter)" style="opacity: 0.59; fill-opacity: 0.98;">
    <animate attributeName="fill-opacity" values="0.98;0.8" begin="0s" dur="2.55s" keyTimes="0; 1" repeatCount="indefinite"/>
  </path>
  <image href="data:image/png;base64,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" width="80" height="80" x="358.014" y="209.925" style="" transform="matrix(0.807069, 0, 0, 1.144699, 79.072182, -42.951752)">
    <title>drawaria-logo</title>
  </image>
</svg>
`;

    // Map 3: Floor and spotlight rays (final map)
    const MAP_SVG_3 = `
<?xml version="1.0" encoding="utf-8"?>
<svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#111111"/>
  <g transform="matrix(1.187943, 0, 0, 1.151757, 386.645294, 0.195094)" opacity="0.4" filter="url(#ray-blur)" style="stroke-width: 1.35466; vector-effect: non-scaling-stroke;">
    <rect x="-2" y="0" width="4" height="400" fill="white" transform="rotate(-40)"/>
    <rect x="-2" y="0" width="4" height="400" fill="white" transform="rotate(-30)"/>
    <rect x="-2" y="0" width="4" height="400" fill="white" transform="rotate(-20)"/>
    <rect x="-2" y="0" width="4" height="400" fill="white" transform="rotate(-10)"/>
    <rect x="-2" y="0" width="4" height="400" fill="white" transform="rotate(0)"/>
    <rect x="-2" y="0" width="4" height="400" fill="white" transform="rotate(10)"/>
    <rect x="-2" y="0" width="4" height="400" fill="white" transform="rotate(20)"/>
    <rect x="-2" y="0" width="4" height="400" fill="white" transform="rotate(30)"/>
    <rect x="-2" y="0" width="4" height="400" fill="white" transform="rotate(40)"/>
    <animate attributeName="opacity" values="0.4;0.45" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
  </g>
  <defs>
    <filter id="spotlight-blur">
      <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="ray-blur">
      <feGaussianBlur in="SourceGraphic" stdDeviation="5"/>
    </filter>
  </defs>
  <ellipse cx="403.205" cy="475.427" rx="344.957" ry="22.521" fill="white" filter="url(#spotlight-blur)" style=""/>
  <ellipse cx="400" cy="480" rx="350" ry="20" fill="white" opacity="0.2" filter="url(#spotlight-blur)"/>
  <rect y="442.521" width="1360" height="57.479" fill="black" opacity="0.6" style=""/>
</svg>
`;

    const BACKGROUND_SVGS = [MAP_SVG_1, MAP_SVG_2, MAP_SVG_3];

    // Cube Fairy SVG
    const CUBE_FAIRY_SVG_CONTENT = `
<?xml version="1.0" encoding="utf-8"?>
<svg height="700" style="fill:none;stroke:none;" version="1.1" viewBox="0 0 500 500" width="700" xmlns="http://www.w3.org/2000/svg">
  <title/>
  <g id="Composition_445b829fca0b4132b3d29b0a3ad1fc42">
    <g id="Layer_624346cd05d646f7a3f94e5fac2a1f6e" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
      <g id="Layer_62250bd6ab7a4da19142a88de5b1f690" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
        <g id="Layer_289871e692ec49548e910714011b29d5" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
          <g id="Layer_605d6403a529440bad1ca6279a6fbffb" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
            <g id="Layer_0faf33997edd4f84a47e7fc145bdca2a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
              <g id="Layer_0d1afe9409b44391bc4da60c4c40410a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                <g id="Layer_f3b30ec9f300423eb47305caf9da22b9" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                  <g transform="translate(0 0)">
                    <g transform="rotate(0)">
                      <g transform="scale(1 1)">
                        <g transform="translate(0 0)">
                          <g id="Group_578939f9ef5948a99969d70000425c72" opacity="1">
                            <g id="Group_3546f761a4bc4a4fa3f2648a6ec0dab9" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                              <g id="Group_4931839c20154578afe4254fa9a3f272" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_57e8a96570064a13b5821bf70e0482cc" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_4d263dd0743449e1bbed711b422bece5" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Group_60f642c4c27c4987866e82f8de63a28d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <g id="Group_4b7876e756884ac28a05d4830f8e2767" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                        <g id="Group_dd0ceb27508e4ef7b40ed67c059ec48a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                          <g id="Group_d0f537ddf8c2492592085fc466e5c589" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                            <g id="Group_0910e13e62a3425ca744f9366b75b1ff" opacity="1" transform="matrix(-0.177927, 0.984044, -0.984044, -0.177927, 232.909, 58.6668)">
                                              <g id="Group_70b6aa5054fa418bb18a8a530275ab8a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_6aad8811b5a34308b46c779638ca5883" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g fill="#447bf9" fill-opacity="1" id="Fill_ada09a9e3957429ea8ad2b2e4863a825" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 91.949,36.212 C 91.949,36.212 234.759,30.017 234.759,30.017 234.759,30.017 238.941,146.341 238.941,146.341 244.172,136.214 96.782,121.014 92.078,130.119 92.078,130.119 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                              <g id="Group_afe42cc27815441b9b1b80fb9c05599f" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_407c2d8105634716b3cf87b6c1d19586" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Stroke_92c3038cb3ce4b7d87316d9bbc969208" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 91.949,36.212 C 91.949,36.212 234.759,30.017 234.759,30.017 234.759,30.017 238.941,146.341 238.941,146.341 244.172,136.214 96.782,121.014 92.078,130.119 92.078,130.119 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 91.949,36.212 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                            <g id="Group_37337e3c3da24a1c9cebe7ba9dfb7877" opacity="1" transform="matrix(0.177927, 0.984044, -0.984044, 0.177927, 444.508, -116.305)">
                                              <g id="Group_ca67085633b44936bad142cac42e003f" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_cce31530b92141fcafa11267756a6346" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g fill="#447bf9" fill-opacity="1" id="Fill_ad2c1fe7d3c446fd8d11f2ed1e2887dc" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 216.969,261.288 C 216.969,261.288 359.779,267.483 359.779,267.483 359.779,267.483 363.961,151.159 363.961,151.159 369.192,161.286 221.802,176.486 217.098,167.381 217.098,167.381 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                              <g id="Group_9f262dc44b3e491b82062f66875c4d3f" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_4bec6e9f6bfc45dfbcb9d017286e41c8" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Stroke_2a4fd8529faa4ee8bbcfe77c5f352e23" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 216.969,261.288 C 216.969,261.288 359.779,267.483 359.779,267.483 359.779,267.483 363.961,151.159 363.961,151.159 369.192,161.286 221.802,176.486 217.098,167.381 217.098,167.381 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 216.969,261.288 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                    <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.166667; 0.427778; 0.733333" path="M 0,0 C 0,0 0,5.24651 0,5.24651 0,5.24651 0,-1.0493 0,-1.0493 0,-1.0493 0,3.14791 0,3.14791" repeatCount="indefinite"/>
                  </g>
                  <g transform="translate(416.363 -0.815729)" style="">
                    <g transform="rotate(0)">
                      <g transform="scale(-1.04032 1)">
                        <g transform="translate(0 0)">
                          <g id="Group_af8442450fe743d0881a014d1638901a" opacity="1">
                            <g id="Group_5314e37a1b974609bbf566cf63070c37" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                              <g id="Group_6e702614cd9042ba81102e880afef873" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_e0a2a5017a714cb9b03fea6ce45f81dd" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_12768e2885b945e0918396d7b18ca741" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Group_2c2ada61ce854298b97d297e069de3df" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <g id="Group_b8b9b2d35195470bb581bac9ced98a15" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                        <g id="Group_565e2f10da9948ed8f59e069558ab6b4" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                          <g id="Group_072c2b9ab3b74bb0b0cf52af0644fc16" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                            <g id="Group_eadcc05ee44f4a9ea6d3dbd958fd8a18" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                              <g id="Group_fe4af599a66a4a49a0281a0f413b480d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_d5b8a87626d046c891143992f8dbeb35" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Group_7bf696f18809465a934fe9d1eda181ba" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <g id="Group_f353b22e446b483ebce3366134bca565" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                      <g id="Group_efaf09ce5ac64c13b78f1960bd9ee744" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                        <g fill="#ffffff" fill-opacity="1" id="Fill_0aeb68a87203407e9d20d3c488ae7464" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                          <path d="M 175.942,265.148 C 175.942,265.148 171.245,275.724 163.373,275.724 156.718,275.726 145.424,271.674 142.393,267.402 138.792,272.694 132.102,276.25 124.447,276.249 118.501,276.249 113.139,274.106 109.355,270.669 104.703,277.071 96.641,281.305 87.475,281.305 73.068,281.305 61.391,270.848 61.391,257.949 61.391,252.961 70.002,225.442 70.002,225.442 70.002,225.442 179.907,245.669 179.907,245.669 179.907,245.669 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 Z" style="stroke: none; stroke-width: 1.96048px;"/>
                                                        </g>
                                                      </g>
                                                    </g>
                                                    <g id="Group_34668add9f7d408f8551b29402fd266e" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                      <g id="Group_dd3b65c846714f1d9791a4f6c0bb0424" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                        <g id="Stroke_93132806e00e4c7198417ffc4cb6212b" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                          <path d="M 175.942,265.148 C 175.942,265.148 171.245,275.724 163.373,275.724 156.718,275.726 145.424,271.674 142.393,267.402 138.792,272.694 132.102,276.25 124.447,276.249 118.501,276.249 113.139,274.106 109.355,270.669 104.703,277.071 96.641,281.305 87.475,281.305 73.068,281.305 61.391,270.848 61.391,257.949 61.391,252.961 70.002,225.442 70.002,225.442 70.002,225.442 179.907,245.669 179.907,245.669 179.907,245.669 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 1.96048px;"/>
                                                        </g>
                                                      </g>
                                                    </g>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                    <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.194444; 0.388889; 0.700000; 0.705556" path="M 1.856 -0.816 C 1.856 -0.816 1.631 16.315 1.631 16.315 C 1.631 16.315 1.937 -10.299 1.937 -10.299 C 1.937 -10.299 1.897 -6.9 1.897 -6.9 C 1.897 -6.9 1.651 5.975 1.651 5.975" repeatCount="indefinite"/>
                  </g>
                  <g transform="translate(0 -5.24651)">
                    <g transform="rotate(0)">
                      <g transform="scale(1 1)">
                        <g transform="translate(0 0)">
                          <g id="Group_d67fd13048d54b26a92523e6fe67bb13" opacity="1">
                            <g id="Group_21f50d7af90f499c9dc2b7bc415d97bc" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                              <g id="Group_74e397143f07412cbce0eebd64898cde" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_a3762da37fe6420f991b60b055ca6dfe" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_c3f990a1c9e7438294c6bc3daff3c536" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Group_3333000d975344ceac3d127aea89d5b6" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <g id="Group_7c488e718a0c4663931da30fb2691cee" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                        <g id="Group_c754bc8df1954ac4a916915b9cc4b7d6" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                          <g id="Group_29b60323f74b47a387fd64cb8590ebcd" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                            <g id="Group_a48dab89b7334706a2c54982808c8197" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                              <g id="Group_7f63df9daa78450cb4ac1f6b6774ce7d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_3530e59116a74432806fb1ba123a3285" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g fill="#58b0ff" fill-opacity="1" id="Fill_27d16373aea74ab1b8f2809567766dc3" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 264.496,318.382 C 264.496,318.382 265.05,377.193 265.05,377.193 265.05,377.193 142.904,377.193 142.904,377.193 142.904,377.193 142.351,322.953 142.351,320.625 142.351,292.572 169.707,269.83 203.453,269.83 236.295,269.83 263.085,291.37 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                              <g id="Group_94103e30fa964c94bc4a13e720e2a802" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_abb249dbca604c519c8004252594ad84" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Stroke_525022d7e07f41e2a1141072136b57ed" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 264.496,318.382 C 264.496,318.382 265.05,377.193 265.05,377.193 265.05,377.193 142.904,377.193 142.904,377.193 142.904,377.193 142.351,322.953 142.351,320.625 142.351,292.572 169.707,269.83 203.453,269.83 236.295,269.83 263.085,291.37 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 264.496,318.382 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                            <g id="Group_a0f94389490e42eca766562e07da8970" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                              <g id="Group_3023467dd9734fba8fd5873fe124f4c1" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_fd5a78335da84dfd855583a22a71f17d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g fill="#ffffff" fill-opacity="1" id="Fill_1120be8b5a8d4514aab460416f20c7e2" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <rect height="25.208" ry="0" style="stroke: rgb(0, 17, 71); stroke-width: 2px;" width="38.862" x="142.927" y="351.634"/>
                                                  </g>
                                                </g>
                                              </g>
                                              <g id="Group_6623dd2ea3b94f15b55a98f52c7a49e0" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_9ae687bd935a4795aebfe24827c12131" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Stroke_a7f4031c54bf428d87ad39b9c43447ea" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <rect height="25.208" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;" width="38.862" x="142.927" y="351.634"/>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                            <g id="Group_58f02105999346ffa661722acce66b32" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                              <g id="Group_9271c5f202714724b85b4c7b54a80324" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_1e37efe1f748432496121f11c575dfc8" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g fill="#ffffff" fill-opacity="1" id="Fill_f6ef2aa16b114ecab82bd726f6138676" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <rect height="25.208" ry="0" style="stroke: rgb(0, 17, 71); stroke-width: 2px;" width="38.862" x="175.488" y="351.634"/>
                                                  </g>
                                                </g>
                                              </g>
                                              <g id="Group_2a742b4c68b843d99c5ba6e5a3c9120d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_779268157858473cadd4d6dad7b87a2b" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Stroke_2fab7e398ab54dabbf7f731d97e6dc87" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <rect height="25.208" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;" width="38.862" x="175.488" y="351.634"/>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                            <g id="Group_c152098ce4ea4170bb3d0561a3aa30a4" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                              <g id="Group_dd47e2b04ce5435a8e472817cb2cf756" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_22c50ae32992475c8e98eea626334e24" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g fill="#ffffff" fill-opacity="1" id="Fill_2d0478506d91449187b26e68f60f2960" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <rect height="25.208" ry="0" style="stroke: rgb(0, 17, 71); stroke-width: 2px;" width="38.862" x="203.059" y="351.633"/>
                                                  </g>
                                                </g>
                                              </g>
                                              <g id="Group_4dc75f562f0f44afb654dc039c587cba" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_b1f10a474051419692ff940fee23dd2c" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Stroke_cf5303a5bb574f50afa3825adad9cafa" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <rect height="25.208" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;" width="38.862" x="203.059" y="351.633"/>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                            <g id="Group_01dc3c3d42744ca4ba0d85637dbe8376" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                              <g id="Group_3c61d0bbc86f4c64af10fe69a878df02" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_a7c005ccc54d4d84a4fbdbfb4caa5803" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g fill="#ffffff" fill-opacity="1" id="Fill_082a86ce7eb844519e2202dc875e7613" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <rect height="25.208" ry="0" style="stroke: rgb(0, 17, 71); stroke-width: 2px;" width="34.923" x="230.105" y="351.632"/>
                                                  </g>
                                                </g>
                                              </g>
                                              <g id="Group_a35aaf40939746b3aa59203b775f279a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_6fcc44c99614402699246237c321e4a1" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Stroke_6942bc714e494dd69af43173bdb0a952" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <rect height="25.208" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;" width="34.923" x="230.105" y="351.632"/>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                    <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.161111; 0.355556; 0.666667" path="M 0,-5.24651 C 0,-5.24651 0,4.19721 0,4.19721 0,4.19721 0,-2.0986 0,-2.0986 0,-2.0986 0,3.14791 0,3.14791" repeatCount="indefinite"/>
                  </g>
                  <g transform="translate(0 -0.815729)" style="">
                    <g transform="rotate(0)">
                      <g transform="scale(1 1)">
                        <g transform="translate(0 0)">
                          <g id="Group_fea3ae62132741188596da54dce89ef2" opacity="1">
                            <g id="Group_ae46728d8ede4f0891f79e5ae1d9fe60" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                              <g id="Group_895fdefe1d8d4898baed53e0e0effc14" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_946f9b61e52749e1955b1e98946ab893" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_f9905f6dfa72444f96e86e9ed95f4f63" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Group_df22397efc3349b68397472c6af5f7f2" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <g id="Group_94e16cb3c3604988be33b3f048a4edb3" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                        <g id="Group_f3cebc3bf87c46bd9b23f509465c9671" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                          <g id="Group_848f66f0333b4f80adb1dcf2184da5c3" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                            <g id="Group_16e607232e40425285f33a660febf23d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                              <g id="Group_4b0c789323dd4d868a6ca258481c3692" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_5c975c22c5be43908dcd08317c9c6a5b" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Group_52b9e3ff5c0744ffaba9129802aeac78" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <g id="Group_9eb061b8adb146cf82edbccf56d19095" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                      <g id="Group_802dcfe8e719448794dd64699c5ddb52" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                        <g fill="#ffffff" fill-opacity="1" id="Fill_fc624ae2c6a14ca0af745e2024110e37" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                          <path d="M 175.942,265.148 C 175.942,265.148 171.245,275.724 163.373,275.724 156.718,275.726 145.424,271.674 142.393,267.402 138.792,272.694 132.102,276.25 124.447,276.249 118.501,276.249 113.139,274.106 109.355,270.669 104.703,277.071 96.641,281.305 87.475,281.305 73.068,281.305 61.391,270.848 61.391,257.949 61.391,252.961 70.002,225.442 70.002,225.442 70.002,225.442 179.907,245.669 179.907,245.669 179.907,245.669 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 Z" style="stroke: none; stroke-width: 2px;"/>
                                                        </g>
                                                      </g>
                                                    </g>
                                                    <g id="Group_bbb436121f1c4edb9d0cbdbb57ab5975" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                      <g id="Group_96937179d9c64f739c28e922ad427e0f" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                        <g id="Stroke_fc7db8580e784591a9d17af18d39e642" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                          <path d="M 175.942,265.148 C 175.942,265.148 171.245,275.724 163.373,275.724 156.718,275.726 145.424,271.674 142.393,267.402 138.792,272.694 132.102,276.25 124.447,276.249 118.501,276.249 113.139,274.106 109.355,270.669 104.703,277.071 96.641,281.305 87.475,281.305 73.068,281.305 61.391,270.848 61.391,257.949 61.391,252.961 70.002,225.442 70.002,225.442 70.002,225.442 179.907,245.669 179.907,245.669 179.907,245.669 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 175.942,265.148 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;"/>
                                                        </g>
                                                      </g>
                                                    </g>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                    <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.194444; 0.388889; 0.700000; 0.705556" path="M 1.326 -0.551 C 1.326 -0.551 1.631 16.315 1.631 16.315 C 1.631 16.315 1.406 -10.564 1.406 -10.564 C 1.406 -10.564 1.101 -6.37 1.101 -6.37 C 1.101 -6.37 1.386 5.71 1.386 5.71" repeatCount="indefinite"/>
                  </g>
                  <g id="Group_31139b44f4a54ed0b254b48ed355b107" opacity="1" transform="matrix(1, 0, 0, 0.950946, 0.990442, 10.583)">
                    <g id="Group_085f214f43ca45db9264a50cca82398e" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_179563955cc0441aa13c0b61e4d4cbdb" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Group_0c411480c5474c8cbf7f9e2d3412d17d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <g id="Group_428d0a047dd04673a092df58788dd44e" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                            <g id="Group_f8fea14bc733433084925f346e69ec31" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                              <g id="Group_4310ff126a45430dbf89f8459cc6103e" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_4c834c0193aa4a108b7d31be1504e976" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_7c221ce162d44051955593b04e951f35" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Group_ed41a6e8573c457080d161ed4f4751bd" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <g id="Group_d9b96792d4bf4db9b8d041636aaa9a0f" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                        <g id="Group_3019e453bde64354b02b5acbd9811f74" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                          <g fill="#58b0ff" fill-opacity="1" id="Fill_912aeef445ee4df2900c1962603c2e6a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                            <path d="M 161.924,225.837 C 161.924,225.837 244.626,225.837 244.626,225.837 244.626,225.837 244.836,288.287 244.836,288.287 245.397,308.646 161.643,307.761 161.082,287.402 161.082,287.402 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2.05029px;"/>
                                          </g>
                                        </g>
                                      </g>
                                      <g id="Group_b70cd452dde64b03a53a475ec1d40823" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                        <g id="Group_07d616537785432fb5953807910067e1" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                          <g id="Stroke_9198d846b8044b20988871940c043045" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                            <path d="M 161.924,225.837 C 161.924,225.837 244.626,225.837 244.626,225.837 244.626,225.837 244.836,288.287 244.836,288.287 245.397,308.646 161.643,307.761 161.082,287.402 161.082,287.402 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 161.924,225.837 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2.05029px;"/>
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g id="Group_07bf950fb5b744c08da1b602acce90f0" opacity="1" transform="matrix(0.999984, -0.005602, 0.005602, 0.999984, 103.462, 0.097262)">
                    <g id="Group_773ac49d227d47aca3363b5015667a78" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_679d8fb26cd04228ae1dccf28c8d6003" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g fill="#ffffff" fill-opacity="1" id="Fill_bd3d28adbd8547dcac86548851a4f98d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <rect height="18.664" ry="0" style="stroke: rgb(0, 17, 71); stroke-width: 2px;" width="29.325" x="57.947" y="225.535"/>
                        </g>
                      </g>
                    </g>
                    <g id="Group_acc78697a70d4a40a8b549253bfbb45a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_b11e86ddd07d437f90a0c5ec7abbfda5" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Stroke_ed4ad324e01742af9949383f6b8445f4" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <rect height="18.664" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;" width="29.325" x="57.947" y="225.535"/>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g id="Group_257af3be2db5451a98050fb0d6feaf39" opacity="1" transform="matrix(0.999984, -0.005602, 0.005602, 0.999984, 161.795, -0.014585)">
                    <g id="Group_25ecec9c5ecc445c823a47a76d6224c8" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_94ba71a35feb4cda85d74446fd7116cd" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g fill="#ffffff" fill-opacity="1" id="Fill_af6483015cc9479790b8c22131f2ea72" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <rect height="18.664" ry="0" style="stroke: rgb(0, 17, 71); stroke-width: 2px;" width="27.709" x="54.753" y="225.535"/>
                        </g>
                      </g>
                    </g>
                    <g id="Group_9bb47d7862b54caa93b83c41537c9635" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_d921cba171054c84a3f1808b8e459fe7" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Stroke_2ea52e9465d54c08a559910df8d5abfa" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <rect height="18.664" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;" width="27.709" x="54.753" y="225.535"/>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g id="Group_b16201a6547b45e99fd4c4d8b5ee9e56" opacity="1" transform="matrix(0.999984, -0.005602, 0.005602, 0.999984, 135.47, 0.061733)">
                    <g id="Group_bf83fc0b3341442984cd6cce2dcecd19" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_c3d6e18a5df041aca29a49d721224e64" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g fill="#ffffff" fill-opacity="1" id="Fill_56798b44691145f8a59f513c48ac8413" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <rect height="18.664" ry="0" style="stroke: rgb(0, 17, 71); stroke-width: 2px;" width="27.709" x="54.753" y="225.535"/>
                        </g>
                      </g>
                    </g>
                    <g id="Group_409836a08cb5459aa9d0d0f643fd5c12" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_c92d7d97dcb44812875c1b846fa1aca4" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Stroke_da13152381f2499eb2f8f2e7bdbf0686" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <rect height="18.664" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;" width="27.709" x="54.753" y="225.535"/>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g id="Group_cc623433226b40ddaef69231521dab81" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                    <g id="Group_7fd751bd13754d8f8cdb763d0491408a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_437c13ca93864f71b80723f533099a8d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g fill="#fee8d2" fill-opacity="1" id="Fill_937828450c04405cb5b24002364ceada" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <ellipse cx="207.088" cy="182.481" rx="57.198" ry="57.693" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                    <g id="Group_f3fe49167d6f40448822a68c2beee7a8" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_b4db3b4ce592487facef052e458c8c0b" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Stroke_afee68700f384c14957243cd80d4c469" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <ellipse cx="207.088" cy="182.481" rx="57.198" ry="57.693" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g id="Group_55e95fb7ee614601b8d9d6bc77ecc4aa" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                    <g id="Group_3f93614f02324a56858a83b53f20ec18" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_e3b8018d9e2545cc9c493fdfe7c6fe81" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g fill="#ffffff" fill-opacity="1" id="Fill_66757b8e97d242d9bb17f261a9dc6a9c" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <path d="M 146.529,237.848 C 146.529,237.848 191.781,277.463 191.781,277.463 192.259,277.239 196.868,282.444 196.868,285.094 196.868,287.687 195.095,289.8 192.878,289.889 192.637,294.15 190.07,297.502 186.941,297.502 183.676,297.501 181.025,293.854 180.986,289.33 180.986,289.33 137.307,247.471 137.307,247.471 137.307,247.471 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                    <g id="Group_96d7c61b65ea4e9e82eebc58d985b225" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_a5c951f1776548a5b3ee96d6bf98f312" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Stroke_75459dbecf6e461da0939c2b91942f35" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <path d="M 146.529,237.848 C 146.529,237.848 191.781,277.463 191.781,277.463 192.259,277.239 196.868,282.444 196.868,285.094 196.868,287.687 195.095,289.8 192.878,289.889 192.637,294.15 190.07,297.502 186.941,297.502 183.676,297.501 181.025,293.854 180.986,289.33 180.986,289.33 137.307,247.471 137.307,247.471 137.307,247.471 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 146.529,237.848 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g id="Group_1cc2d6febaa64442ad9f57f6d2316ae8" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                    <g id="Group_d932349903a04ba2a57176818cb9c5cb" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_e8ade258977946b3a941a0279fe49ff2" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g fill="#58b0ff" fill-opacity="1" id="Fill_fcd55e49f8f543b485fe53795012c916" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <path d="M 131.942,218.969 C 131.942,218.969 164.628,218.969 164.628,218.969 164.628,218.969 164.628,248.121 164.628,248.121 164.628,248.121 131.942,248.121 131.942,248.121 131.942,248.121 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                    <g id="Group_f29853f1642e466b8786f5df0921b7c6" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_0d04e2332d414ec98d3789f06b274a2e" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Stroke_c8b1b874176d440ebe70a0b4b29ddb2f" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <path d="M 131.942,218.969 C 131.942,218.969 164.628,218.969 164.628,218.969 164.628,218.969 164.628,248.121 164.628,248.121 164.628,248.121 131.942,248.121 131.942,248.121 131.942,248.121 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 131.942,218.969 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g id="Group_d712d75c75a546cc8cf8db4ff449423e" opacity="1" transform="matrix(-1, 0, 0, -1, 474.685, 531.463)">
                    <g id="Group_1c294b6e5c184912a4e38108286a79a9" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_2cb5d67cf44b471f96f1ed2cd1e15bdf" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g fill="#ffffff" fill-opacity="1" id="Fill_206e73005765431584268d3c903abd1d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <path d="M 216.263,296.587 C 216.263,296.587 261.515,256.972 261.515,256.972 261.993,257.196 266.602,251.991 266.602,249.341 266.602,246.748 264.829,244.635 262.612,244.546 262.371,240.285 259.804,236.933 256.675,236.933 253.41,236.934 250.759,240.581 250.72,245.105 250.72,245.105 207.041,286.964 207.041,286.964 207.041,286.964 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                    <g id="Group_904216b925194138a71af571dd411cdc" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_6195333e77e3445a98657d886705e38d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Stroke_909d034755aa457996c394978b26a020" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <path d="M 216.263,296.587 C 216.263,296.587 261.515,256.972 261.515,256.972 261.993,257.196 266.602,251.991 266.602,249.341 266.602,246.748 264.829,244.635 262.612,244.546 262.371,240.285 259.804,236.933 256.675,236.933 253.41,236.934 250.759,240.581 250.72,245.105 250.72,245.105 207.041,286.964 207.041,286.964 207.041,286.964 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 216.263,296.587 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g id="Group_c47d0f843ffe43aaa964d3ba067fd74d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                    <g id="Group_fe713c29db1b4f4ab5bdc86700a247be" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_051bcc3c9a8145b7b064c28b06c3ad13" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g fill="#58b0ff" fill-opacity="1" id="Fill_e352b4de5a2e4474b2252585fda10ef6" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <path d="M 245.259,219.853 C 245.259,219.853 276.472,219.853 276.472,219.853 276.472,219.853 276.472,248.416 276.472,248.416 276.472,248.416 245.259,248.416 245.259,248.416 245.259,248.416 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                    <g id="Group_656efa98c79c4305b3ead9d5d74df8a4" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                      <g id="Group_7594c2aad9954880b586ce0eef9433fe" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Stroke_4cb973583a15459299f98566bc1358fe" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <path d="M 245.259,219.853 C 245.259,219.853 276.472,219.853 276.472,219.853 276.472,219.853 276.472,248.416 276.472,248.416 276.472,248.416 245.259,248.416 245.259,248.416 245.259,248.416 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 245.259,219.853 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g transform="translate(0 0)">
                    <g transform="rotate(0)">
                      <g transform="scale(1 1)">
                        <g transform="translate(0 0)">
                          <g id="Group_aca6ca588cc64afdbfbd62a7268426e3" opacity="1">
                            <g id="Group_ed2913ea75cb48e4b41ee3e0ee7b6c85" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                              <g id="Group_e3651a3aa951404a8fb7390f69f687db" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_59a87ad457764c49bd6a00f98764c656" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_779954feb6df4fb68620f8c4ff42cc3e" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Group_11f057441cd74c6dbabf36a6ec3c12bc" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <g id="Group_2c4aebfc2b014b59a0add11371e215aa" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                        <g id="Group_e1f194d04ca4432d9664c27ab790b148" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                          <g id="Group_f4a36f8fbc174fee9445738549544d46" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                            <g id="Group_ce197513a8cc494c93869e1d6299062b" opacity="1" transform="matrix(0.392565, 0.919724, -0.919724, 0.392565, 31.2082, 39.0615)">
                                              <g id="Group_e8350cd87e87432c991a81dca1493f5e" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_66a432833f7444dca55cb2a8bebeb323" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g fill="#447bf9" fill-opacity="1" id="Fill_93cb0c00a0df448f9c457787b18ccd2b" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 59.52,-164.524 C 59.52,-164.524 151.348,-124.31 151.348,-124.31 151.348,-124.31 167.611,-27.8 167.611,-27.8 167.611,-27.8 70.12,-13.574 70.12,-13.574 70.12,-13.574 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                              <g id="Group_da683ce285dc443f8fe408e0f484d72b" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_f3409296c0f7452d97449901f46c19f1" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Stroke_1fd6de85a5c14f219ea3f54d0822ae32" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 59.52,-164.524 C 59.52,-164.524 151.348,-124.31 151.348,-124.31 151.348,-124.31 167.611,-27.8 167.611,-27.8 167.611,-27.8 70.12,-13.574 70.12,-13.574 70.12,-13.574 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 59.52,-164.524 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                            <g id="Group_241374713016444fa46e7d5b10ad6e9c" opacity="1" transform="matrix(-0.392565, 0.919724, -0.919724, -0.392565, 449.288, -81.2542)">
                                              <g id="Group_7b4884754f61449b94eae24ac6025192" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_e7f3fb64be42403387eb602d3da14e34" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g fill="#447bf9" fill-opacity="1" id="Fill_f16dd6039b214f8983ce4ca7911dd9c8" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 196.91,181.35 C 196.91,181.35 289.152,143.45 289.152,143.45 289.152,143.45 305.415,46.94 305.415,46.94 305.415,46.94 207.924,32.714 207.924,32.714 207.924,32.714 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 Z" style="stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                              <g id="Group_6600cd45f7cd4857956cfde6336b2322" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                <g id="Group_f99e58d12d27428c97965400365bc683" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                  <g id="Stroke_ae14d61fcfda4f7e962eb7abc1ca43a8" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                                    <path d="M 196.91,181.35 C 196.91,181.35 289.152,143.45 289.152,143.45 289.152,143.45 305.415,46.94 305.415,46.94 305.415,46.94 207.924,32.714 207.924,32.714 207.924,32.714 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 196.91,181.35 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke: rgb(0, 17, 71); stroke-width: 2px;"/>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                    <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.166667; 0.427778; 0.733333" path="M 0,0 C 0,0 0,5.24651 0,5.24651 0,5.24651 0,-1.0493 0,-1.0493 0,-1.0493 0,3.14791 0,3.14791" repeatCount="indefinite"/>
                  </g>
                </g>
              </g>
            </g>
            <g transform="translate(-5.68434e-14 1.71918)">
              <g transform="rotate(0)">
                <g transform="scale(1 1)">
                  <g transform="translate(0 0)">
                    <g id="Group_c1da6565ad7a44b7937e52ece78e73a7" opacity="1">
                      <g id="Group_e05da2ce9e2141d58669cc9dff991497" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                        <g id="Group_bba8dfa44cc04d8190f0d00939be16ef" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                          <g id="Group_0c531c675587458394e5098b286b4a51" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                            <g id="Group_caf5454d5ae04e8780788490d52a1e95" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                              <g id="Group_1b27ef5587dd4de197f5f350d043422c" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_781b8505367c42a3857f234570eace38" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_e94c594dd0354662a84f034fae37aac7" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#000000" fill-opacity="1" id="Fill_c97b2af9c9c34f0ebe788810caf4e9ab" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <path d="M 199.908,174.904 C 199.908,185.434 195.141,193.97 189.261,193.97 183.381,193.97 178.614,185.434 178.614,174.904 178.614,164.374 183.876,164.257 189.756,164.257 195.636,164.257 199.908,164.374 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 Z" style="stroke: none; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                                <g id="Group_5f715f838b3944b7a3da530f38b50a25" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_1508c9dbd6fa46aaa56d30844c6c486d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_57410754afa04a8397fcb572b6132546" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <path d="M 199.908,174.904 C 199.908,185.434 195.141,193.97 189.261,193.97 183.381,193.97 178.614,185.434 178.614,174.904 178.614,164.374 183.876,164.257 189.756,164.257 195.636,164.257 199.908,164.374 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 199.908,174.904 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_69526d6ad2644b0582714865bd660c90" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_fee0271290da441f8626210b71d6b96a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_c731d322ff364143b71a5a798af8bdf7" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#000000" fill-opacity="1" id="Fill_f43b0980669249a6966233b37cf3c8cc" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <path d="M 234.325,174.903 C 234.325,185.433 229.558,193.969 223.678,193.969 217.798,193.969 213.031,185.433 213.031,174.903 213.031,164.373 218.293,164.256 224.173,164.256 230.053,164.256 234.325,164.373 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 Z" style="stroke: none; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                                <g id="Group_29c1c68302a045ab99b09b0aa9b09afc" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_e6b7536fa3cb48a5b6df62a0c28f2417" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_9257e3ac72b04b10b821c75be0d620ae" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <path d="M 234.325,174.903 C 234.325,185.433 229.558,193.969 223.678,193.969 217.798,193.969 213.031,185.433 213.031,174.903 213.031,164.373 218.293,164.256 224.173,164.256 230.053,164.256 234.325,164.373 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 234.325,174.903 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_6d802c88b86f43a4bccbe3ed0399f3b4" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_645f362498b84c9db32ee5332fba1042" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_e919f5e73d4b410cb87d940368242035" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#000000" fill-opacity="1" id="Fill_4e1603b8462841f1a51c6eb3b893da90" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <path d="M 223.678,213.284 C 223.678,216.292 216.361,218.731 207.336,218.731 198.311,218.731 191.489,215.302 191.489,212.294 191.489,209.286 197.32,213.284 206.346,213.284 215.371,213.284 223.678,210.276 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 Z" style="stroke: none; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                                <g id="Group_ae12bc5f84564d398f5479e2ee744666" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_671c90609d414f64bc4a9dda4bdc5fee" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_51fe2c4a88e14a3983a44bbf31489932" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <path d="M 223.678,213.284 C 223.678,216.292 216.361,218.731 207.336,218.731 198.311,218.731 191.489,215.302 191.489,212.294 191.489,209.286 197.32,213.284 206.346,213.284 215.371,213.284 223.678,210.276 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 223.678,213.284 Z" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_988df225ba86472b95857e71cc009bb0" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_6eb2bf7373eb491295094e25c051f329" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Stroke_c94c0958917c4d249b046d44ff9d76ab" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <ellipse cx="183.276" cy="172.709" rx="2.724" ry="7.181" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;"/>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_036c24f9d8214f3cbce54c0f2b5511a7" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_7ed8b3a36a9245718e21c6c601dd18f7" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_f6128c42fef74189a7adb193b8531b0d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#ffffff" fill-opacity="1" id="Fill_38c19d56776d42d39e8da1ee55141f47" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <ellipse cx="217.198" cy="172.645" rx="2.971" ry="7.181" style="stroke: none; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                                <g id="Group_0b299d727c594def8ff19d475edfa090" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_413d579327514781a85f892f0fd029ef" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_48d91b1135ef4bcc9e3e2e87f76d31b6" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <ellipse cx="217.198" cy="172.645" rx="2.971" ry="7.181" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_94b3b2d1ecc54bcb83bd2af4287e7335" opacity="1" transform="matrix(0.997575, -0.069598, 0.069598, 0.997575, -10.3555, 15.7956)">
                                <g id="Group_3e6cf58a22df41aeaecab2dffde923dd" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_dbe4deef0d064ae886720333f6afbd29" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#000000" fill-opacity="1" id="Fill_d2238b0204ca4073a7abe17a764a293d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <rect height="5.009" ry="0" style="stroke: none; stroke-width: 2px;" width="21.346" x="179.108" y="147.914"/>
                                    </g>
                                  </g>
                                </g>
                                <g id="Group_5881f2eb8f67401da829c500b2b0bef2" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_419ec196b3cd4d43922ded9c4369feca" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_24722db5bec74d26b6f083f6271deeb5" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <rect height="5.009" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;" width="21.346" x="179.108" y="147.914"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_be0995bd67f34e859e3987fb53d1f410" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_cbd635acea7e4bbbbfc25f27e4b617c9" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_3bb3174017554936a6e30ea1d6a28eba" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#ffffff" fill-opacity="1" id="Fill_f93e3b5ff8514aa4aec3a042071413a2" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <ellipse cx="183.276" cy="172.709" rx="2.724" ry="7.181" style="stroke: none; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_ad973a3955f147cd867bdfbaf4c01185" opacity="1" transform="matrix(-0.997575, -0.0695981, -0.0695981, 0.997575, 420.995, 16.5246)">
                                <g id="Group_828b524ee6c943179d1481ec334f9b88" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_acc6c697956f4ad3bfb057ec0b803172" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#000000" fill-opacity="1" id="Fill_09d00d4c2fa8494b897f5622bf04a927" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <rect height="5.009" ry="0" style="stroke: none; stroke-width: 2px;" width="21.346" x="179.11" y="147.91"/>
                                    </g>
                                  </g>
                                </g>
                                <g id="Group_2cba7d963f4f42fa80de15bd729b1ef4" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_dcfb0bad6ae440b7bfaff639c94c46ee" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_f8d0d55c1cf74b408b1ef2d6283329cc" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <rect height="5.009" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;" width="21.346" x="179.11" y="147.91"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_721b904a63554f419a7989a670d34dc0" opacity="1" transform="matrix(0.980581, 0.196116, -0.196116, 0.980581, 36.1716, -29.591)">
                                <g id="Group_dcd06f12613d4191aa93ac82285bb333" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_4d9fd996419d4ca38abefdb622e76fd2" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#000000" fill-opacity="1" id="Fill_8c4db01f8a294b86a25ca48da3a82df5" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <rect height="2.515" ry="0" style="stroke: none; stroke-width: 2px;" width="11.444" x="167.506" y="167.853"/>
                                    </g>
                                  </g>
                                </g>
                                <g id="Group_d31ed3f59dcc4eb0b5b032b76af01b5f" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_1efad0479d884cd7b83b05b14626b607" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_f570a013b87b4b99a5733740cc6bec08" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <rect height="2.515" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;" width="11.444" x="167.506" y="167.853"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_0c0eec48be45438095795d32aacdabdd" opacity="1" transform="matrix(-0.980581, 0.196116, 0.196116, 0.980581, 375.074, -29.3765)">
                                <g id="Group_85cbc12fbb49406698b0039ac613a554" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_4dd71c4562c44ee7833fccd1c2fd5727" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#000000" fill-opacity="1" id="Fill_e86e56d7af1b40518583d0250ca9541d" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <rect height="2.515" ry="0" style="stroke: none; stroke-width: 2px;" width="11.444" x="167.51" y="167.85"/>
                                    </g>
                                  </g>
                                </g>
                                <g id="Group_25e6d3f3edff4f1fbd57b1371bb58f5a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_aa3250f8fef44c74b2e3e7974148a2c7" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_12f1561499c8471f9ecbc4e3a571abc7" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <rect height="2.515" ry="0" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;" width="11.444" x="167.51" y="167.85"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                              <g id="Group_f2c24a9da86e4b62ad7b6c34b7c60b14" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                <g id="Group_5e9aa5ad63a04e5a977827a22736c105" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_b5cccfe98d4f421cbc4386f369f9700a" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g fill="#ffffff" fill-opacity="1" id="Fill_117872a1e50742c0971fe225f32e6a20" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <ellipse cx="217.198" cy="172.645" rx="2.971" ry="7.181" style="stroke: none; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                                <g id="Group_1c847fc6e7774d5c8750f96064b3a547" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                  <g id="Group_04d00887dda24f73946be18da7ca9025" opacity="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <g id="Stroke_6e4183e42f644a41b75e2cd222a9e2ae" opacity="1" stroke="#000000" stroke-opacity="1" stroke-width="1" transform="matrix(1, 0, 0, 1, 0, 0)">
                                      <ellipse cx="217.198" cy="172.645" rx="2.971" ry="7.181" style="fill: none; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-width: 2px;"/>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
              <animateMotion attributeName="transform" begin="0.000000" calcMode="spline" dur="3.000000" keySplines="0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000; 0.000000 0.000000 1.000000 1.000000" keyTimes="0.000000; 0.194444; 0.411111; 0.700000" path="M -5.68434e-14,1.71918 C -5.68434e-14,1.71918 0.671553,5.7485 0.671553,5.7485 0.671553,5.7485 0.671553,1.04763 0.671553,1.04763 0.671553,1.04763 0.671553,3.73384 0.671553,3.73384" repeatCount="indefinite"/>
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>
`;

    // --- 3. STATE AND GAME VARIABLES ---

    let mapContainer = null;
    let backgroundMusic = null;
    let musicButton = null;
    let currentMapIndex = 0;
    const MAX_LEVEL_PHASES = 3; // Total phases to complete (0, 1, 2 = 3 passes)
    let phasesCompleted = 0;

    // Avatar state
    let avatarX = LEVEL_START_X;
    let avatarY = AVATAR_GROUND_Y;
    let avatarVX = 0;
    let avatarVY = 0;
    let isJumping = false;
    let isLevelComplete = false;
    let selfAvatarImage = null;
    let keys = {};

    // Dialogue state
    let isDialogueActive = false;
    let currentDialogueIndex = 0;
    let dialogueBox = null;
    let dialogueName = null;
    let dialogueText = null;
    let npcClickArea = null;


    // --- 4. ENVIRONMENT AND SETUP ---

    function setupEnvironment() {
        const originalBody = document.body;

        selfAvatarImage = document.querySelector('#selfavatarimage');
        if (!selfAvatarImage) {
            setTimeout(setupEnvironment, 100);
            return;
        }

        // 1. Setup the Map Container and clear body
        mapContainer = document.createElement('div');
        mapContainer.id = 'map-container';
        mapContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 1;
            overflow: hidden;
            background-color: #000000;
        `;

        originalBody.innerHTML = '';
        originalBody.style.background = 'none';
        originalBody.appendChild(mapContainer);

        // 2. Add Avatar
        originalBody.appendChild(selfAvatarImage);
        selfAvatarImage.style.position = 'absolute';
        selfAvatarImage.style.zIndex = '1000';
        selfAvatarImage.style.pointerEvents = 'none';
        selfAvatarImage.style.display = 'block';
        selfAvatarImage.style.width = AVATAR_HEIGHT_PX + 'px';
        selfAvatarImage.style.height = AVATAR_HEIGHT_PX + 'px';

        // 3. Inject NPC and Dialogue Box
        injectCubeFairy();

        // 4. Load initial map (Map 1)
        updateMapSVG();

        // 5. Setup Music (initialization only) and Button
        initializeMusic();
        createMusicButton();

        // 6. Start game loop
        updateAvatar();
    }

    function initializeMusic() {
        backgroundMusic = new Audio(BACKGROUND_MUSIC_URL);
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.5;
    }

    function createMusicButton() {
        musicButton = document.createElement('button');
        musicButton.textContent = "Start Point Music";
        musicButton.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            padding: 10px 15px;
            background-color: #447bf9;
            color: white;
            border: 2px solid white;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10002;
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            box-shadow: 0 0 10px rgba(68, 123, 249, 0.5);
        `;
        musicButton.addEventListener('click', startMusic);
        document.body.appendChild(musicButton);
    }

    function startMusic() {
        if (backgroundMusic) {
            backgroundMusic.play()
                .then(() => {
                    // Successfully started playing, hide the button
                    musicButton.style.display = 'none';
                    musicButton.removeEventListener('click', startMusic);
                })
                .catch(e => {
                    console.error("Failed to play music on click:", e);
                    musicButton.textContent = "Music Error (Click to retry)";
                });
        }
    }

    function updateMapSVG() {
        if (currentMapIndex < BACKGROUND_SVGS.length) {
            mapContainer.innerHTML = BACKGROUND_SVGS[currentMapIndex];
        }
        // Ensure the NPC visibility state is correct after map change
        updateNPCVisibility();
    }

    function updateNPCVisibility() {
        const fairy = document.getElementById(`${CUBE_FAIRY_ID}-clickarea`);
        if (fairy) {
            // Only show the NPC when phasesCompleted is equal to or greater than the max phases (3 passes)
            fairy.style.display = (phasesCompleted >= MAX_LEVEL_PHASES) ? 'block' : 'none';
        }
    }


    // --- 5. NPC AND DIALOGUE LOGIC ---

    function createDialogueBox() {
        const box = document.createElement('div');
        box.id = DIALOGUE_BOX_ID;

        dialogueName = document.createElement('div');
        dialogueName.style.cssText = `
            font-weight: bold;
            font-size: 20px;
            margin-bottom: 5px;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        `;

        dialogueText = document.createElement('div');
        dialogueText.style.cssText = `
            font-size: 18px;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        `;

        box.appendChild(dialogueName);
        box.appendChild(dialogueText);
        document.body.appendChild(box);
        dialogueBox = box;

        // Custom style for the Start Point dialogue box (darker, more ethereal)
        box.style.cssText += `
            position: absolute;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-width: 600px;
            min-height: 80px;
            padding: 15px 25px;
            background: rgba(10, 10, 30, 0.8); /* Very dark blue/black */
            border: 5px solid #447bf9; /* Cube Fairy's blue color */
            box-shadow: 0 0 20px rgba(68, 123, 249, 0.5); /* Blue glow effect */
            border-radius: 10px;
            font-family: 'Courier New', monospace; /* Monospace for ethereal feel */
            z-index: 10001;
            display: none;
            cursor: pointer; /* Clickable to advance dialogue */
        `;
        dialogueBox.addEventListener('click', processDialogue);
    }

    function injectCubeFairy() {
        const parent = document.body;

        const NPC_WIDTH = 500;
        const NPC_HEIGHT = 500;
        const SCALED_SIZE = NPC_WIDTH * CUBE_FAIRY_SCALE;
        const CLICK_AREA_SIZE = SCALED_SIZE + 50; // Larger click area

        // Invisible container for the larger click area
        npcClickArea = document.createElement('div');
        npcClickArea.id = `${CUBE_FAIRY_ID}-clickarea`;

        // Position the click area to center the fairy at CUBE_FAIRY_X/Y
        npcClickArea.style.cssText = `
            position: absolute;
            top: ${CUBE_FAIRY_Y - SCALED_SIZE / 2}px;
            left: ${CUBE_FAIRY_X - SCALED_SIZE / 2}px;
            width: ${SCALED_SIZE}px;
            height: ${SCALED_SIZE}px;
            z-index: 999;
            cursor: pointer;
            display: none; /* Initially hidden */
        `;

        // SVG Container for the Cube Fairy graphic
        const svgContainer = document.createElement('div');
        svgContainer.id = CUBE_FAIRY_ID;
        svgContainer.innerHTML = CUBE_FAIRY_SVG_CONTENT;

        // Scale the SVG content to fit the area
        svgContainer.style.cssText = `
            width: 100%;
            height: 100%;
            transform: scale(${CUBE_FAIRY_SCALE});
            transform-origin: 0 0; /* Important for scaling correctly */
        `;

        npcClickArea.addEventListener('click', startDialogue);
        npcClickArea.appendChild(svgContainer);
        parent.appendChild(npcClickArea);
        createDialogueBox();
    }

    function startDialogue() {
        if (isDialogueActive || isLevelComplete) return;

        isDialogueActive = true;
        currentDialogueIndex = 0;
        dialogueBox.style.display = 'block';
        dialogueBox.style.pointerEvents = 'auto';

        // Reset listeners
        dialogueBox.removeEventListener('click', processDialogue);
        dialogueBox.removeEventListener('click', endDialogue);

        // Set the correct listener for the first dialogue step
        processDialogue();
        dialogueBox.addEventListener('click', processDialogue);
    }

    function processDialogue() {
        if (!isDialogueActive) return;

        const lines = (phasesCompleted < MAX_LEVEL_PHASES) ? DIALOGUE_LINES : DIALOGUE_LINES_FINAL;

        if (currentDialogueIndex >= lines.length) {
            endDialogue();
            return;
        }

        const line = lines[currentDialogueIndex];
        dialogueName.textContent = `${line.name}:`;
        dialogueText.textContent = line.text;

        currentDialogueIndex++;

        // If this is the last line, change the listener to end the dialogue/level
        if (currentDialogueIndex >= lines.length) {
            dialogueBox.removeEventListener('click', processDialogue);
            dialogueBox.addEventListener('click', endDialogue);
        }
    }

    function endDialogue() {
        if (phasesCompleted >= MAX_LEVEL_PHASES) {
            isLevelComplete = true;
            dialogueBox.style.display = 'none';

            // --- VICTORY SCREEN SETUP ---
            mapContainer.innerHTML = `
                <div id="victory-message" style="position:absolute; top:40%; left:50%; transform:translate(-50%, -50%); color:gold; font-size:36px; text-align:center; font-family: 'Courier New', monospace;">
                    LEVEL COMPLETE!<br>Thank you for playing Start Point.
                </div>
            `;
            createBackToLevelsButton();
            // ---------------------------

            if (backgroundMusic) {
                 backgroundMusic.pause();
            }
            if (musicButton) {
                musicButton.style.display = 'none';
            }
            if (npcClickArea) {
                npcClickArea.style.display = 'none';
            }

            // Disable movement
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            return;
        }

        // Standard dialogue end
        isDialogueActive = false;
        dialogueBox.style.display = 'none';
        currentDialogueIndex = 0;
        dialogueBox.style.pointerEvents = 'none';
    }

    function createBackToLevelsButton() {
        const button = document.createElement('button');
        button.textContent = "BACK TO LEVELS";
        button.style.cssText = `
            position: absolute;
            top: 60%;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            background-color: #447bf9;
            color: white;
            border: 4px solid gold;
            border-radius: 8px;
            cursor: pointer;
            z-index: 10003;
            font-size: 24px;
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
        `;
        // Use a simple reload to simulate going back to the Drawaria lobby (the home screen)
        button.addEventListener('click', () => {
            window.location.reload();
        });
        document.body.appendChild(button);
    }


    // --- 6. GAME LOOP AND MOVEMENT LOGIC ---

    function advanceMap() {
        phasesCompleted++;
        // Check if we need to change the background to the next map in the array
        if (currentMapIndex < BACKGROUND_SVGS.length - 1) {
            currentMapIndex++;
            updateMapSVG();
        }

        // After final phase completion (3 passes), ensure NPC is visible.
        if (phasesCompleted >= MAX_LEVEL_PHASES) {
            updateNPCVisibility();
        }
    }

    function updateAvatar() {
        if (isLevelComplete) return;

        // Constants of Movement
        const GRAVITY = 0.5;
        const MAX_SPEED = 10;
        const JUMP_HEIGHT = 15;
        const FRICTION = 0.9;

        // Stop movement during dialogue
        if (isDialogueActive) {
            avatarVX = 0;
            avatarVY = 0;
            isJumping = false;
        } else {
            avatarVY += GRAVITY;

            if (keys['ArrowRight']) {
                avatarVX = Math.min(avatarVX + 0.5, MAX_SPEED);
            } else if (keys['ArrowLeft']) {
                avatarVX = Math.max(avatarVX - 0.5, -MAX_SPEED);
            } else {
                avatarVX *= FRICTION;
            }

            if (keys['ArrowUp'] && !isJumping) {
                avatarVY = -JUMP_HEIGHT;
                isJumping = true;
            }
        }

        avatarX += avatarVX;
        avatarY += avatarVY;

        // Collision with the ground
        if (avatarY > AVATAR_GROUND_Y) {
            avatarY = AVATAR_GROUND_Y;
            avatarVY = 0;
            isJumping = false;
        }

        // LEVEL PROGRESSION LOGIC (Teleport to start and advance map)
        if (avatarX > LEVEL_END_X) {
            avatarX = LEVEL_START_X; // Teleport to start

            // Advance map or stay on the final map
            if (phasesCompleted < MAX_LEVEL_PHASES) {
                advanceMap();
            } else {
                // If max phases are complete and we reach the end, ensure NPC is visible for the final click
                updateNPCVisibility();
            }
        }

        // Keep avatar within left boundary
        if (avatarX < 0) {
            avatarX = 0;
            avatarVX = 0;
        }

        // Update the visual representation of the avatar
        drawAvatar(avatarX, avatarY);

        requestAnimationFrame(updateAvatar);
    }

    function handleKeyDown(event) {
        keys[event.key] = true;
    }

    function handleKeyUp(event) {
        keys[event.key] = false;
    }

    function drawAvatar(x, y) {
        if (selfAvatarImage) {
            // Apply scale/translation for the in-game coordinates
            selfAvatarImage.style.transform = `translate(${x}px, ${y}px) scale(1)`;
            selfAvatarImage.style.border = 'none';
            selfAvatarImage.style.boxShadow = 'none';
        }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Initial script start with a delay to ensure Drawaria elements are loaded
    setTimeout(setupEnvironment, 1000);

})();