// ==UserScript==
// @name         Drawaria.online Server Overload Game
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Turn Drawaria.online into a retro-style 3D space combat game.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @connect      images.unsplash.com
// @connect      ibb.co
// @connect      myinstants.com
// @connect      picsum.photos
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558246/Drawariaonline%20Server%20Overload%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/558246/Drawariaonline%20Server%20Overload%20Game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Limpiar la página original de Drawaria
    // Esperamos al evento DOMContentLoaded para asegurar que borramos todo
    window.addEventListener('DOMContentLoaded', () => {
        document.body.innerHTML = '';
        document.head.innerHTML = ''; // Limpiamos head para evitar conflictos de CSS
        setupGame();
    });

    function setupGame() {
        // 2. Definir Título y Meta
        document.title = "Drawaria.online: Server Overload";
        const meta = document.createElement('meta');
        meta.name = "viewport";
        meta.content = "width=device-width, initial-scale=1.0";
        document.head.appendChild(meta);

        // 3. Inyectar CSS
        const css = `
            body { margin: 0; overflow: hidden; background-color: #000; font-family: 'Courier New', Courier, monospace; user-select: none; }
            #ui-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; display: flex; flex-direction: column; justify-content: space-between; z-index: 10; }
            .hud-top { display: flex; justify-content: space-between; padding: 20px; transition: opacity 0.5s; }
            .hud-box { background: rgba(0, 50, 100, 0.5); border: 1px solid #00aaff; padding: 10px 20px; color: #00aaff; text-shadow: 0 0 5px #00aaff; border-radius: 5px; }
            .reticle { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; border: 2px solid rgba(0, 255, 0, 0.5); border-radius: 50%; box-shadow: 0 0 10px rgba(0,255,0,0.3); transition: all 0.1s; opacity: 0; }
            .reticle.active { opacity: 1; }
            .reticle::after { content: ''; position: absolute; top: 50%; left: 50%; width: 4px; height: 4px; background: #00ff00; transform: translate(-50%, -50%); border-radius: 50%; }
            .reticle.locked { border-color: #ff0000; transform: translate(-50%, -50%) scale(0.8); box-shadow: 0 0 15px #ff0000; }
            .controls-info { position: absolute; bottom: 20px; left: 20px; color: rgba(255,255,255,0.5); font-size: 12px; background: rgba(0,0,0,0.5); padding: 10px; border-radius: 5px; opacity: 0; transition: opacity 0.5s; }
            .controls-info.active { opacity: 1; }
            #message-log { position: absolute; top: 20%; left: 50%; transform: translateX(-50%); text-align: center; display: flex; flex-direction: column; gap: 5px; }
            .msg { color: #fff; font-size: 14px; text-shadow: 0 0 5px black; animation: fadeOut 3s forwards; }
            #menu { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at center, #111 0%, #000 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: auto; z-index: 20; transition: opacity 0.5s; }
            #menu.hidden { opacity: 0; pointer-events: none; }
            h1 { font-size: 48px; color: #ff3333; text-transform: uppercase; letter-spacing: 4px; text-shadow: 0 0 20px #ff0000; margin-bottom: 0; text-align: center; }
            h2 { font-size: 18px; color: #00aaff; letter-spacing: 8px; margin-top: 5px; margin-bottom: 40px; text-transform: uppercase; opacity: 0.8; }
            .menu-btn { background: transparent; color: #00ffcc; border: 2px solid #00ffcc; padding: 15px 50px; font-size: 20px; font-family: inherit; cursor: pointer; transition: all 0.3s; text-transform: uppercase; letter-spacing: 2px; margin: 10px; position: relative; overflow: hidden; }
            .menu-btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: rgba(0, 255, 204, 0.2); transition: left 0.3s; }
            .menu-btn:hover::before { left: 0; }
            .menu-btn:hover { box-shadow: 0 0 20px #00ffcc; text-shadow: 0 0 5px #fff; }
            .lore-text { max-width: 600px; text-align: center; color: #888; font-size: 14px; margin-bottom: 30px; line-height: 1.6; border: 1px solid #333; padding: 20px; background: rgba(0,0,0,0.5); }
            @keyframes fadeOut { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-20px); } }
        `;
        GM_addStyle(css);

        // 4. Inyectar ImportMap (Necesario para los módulos ES6 modernos)
        const importMap = document.createElement('script');
        importMap.type = "importmap";
        importMap.textContent = JSON.stringify({
            "imports": {
                "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
                "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
            }
        });
        document.head.appendChild(importMap);

        // 5. Inyectar Estructura HTML del Juego
        const gameHTML = `
            <div id="ui-layer">
                <div class="hud-top" id="hud-top" style="opacity: 0;">
                    <div class="hud-box">
                        <div style="font-size: 10px; color: #88ccff;">SPEED</div>
                        <div id="speed-display" style="font-size: 24px;">0 M/S</div>
                    </div>
                    <div class="hud-box">
                        <div style="font-size: 10px; color: #88ccff;">VIEW MODE</div>
                        <div id="cam-display" style="font-size: 18px;">TPS (Tactical)</div>
                    </div>
                    <div class="hud-box" style="border-color: #ff3333; color: #ff3333;">
                        <div style="font-size: 10px; color: #ffaaaa;">THREAT LEVEL</div>
                        <div id="target-health">LOW</div>
                    </div>
                </div>

                <div id="reticle" class="reticle"></div>
                <div id="message-log"></div>

                <div class="controls-info" id="controls-info">
                    [W/S] Thrust | [A/D] Yaw | [Space] Fire | [6] TPS View | [7] FPS View
                </div>
            </div>

            <div id="menu">
                <h1>Drawaria.online</h1>
                <h2>Server Overload</h2>

                <div class="lore-text">
                    <p>WARNING: "Space Invader" virus swarm detected.</p>
                    <p>They are tracking your signal. Engaging evasive maneuvers.</p>
                    <p>MISSION: Destroy the swarm and the Mother Frigate.</p>
                </div>

                <button class="menu-btn" id="start-btn">LAUNCH FIGHTER</button>
            </div>
            <audio id="bg-music" src="https://www.myinstants.com/media/sounds/drawaria-server-overload.mp3" loop></audio>
        `;
        document.body.insertAdjacentHTML('beforeend', gameHTML);

        // 6. Inyectar la Lógica del Juego (Módulo JS)
        // Nota: Las backticks (`) internas están escapadas (\`) para funcionar dentro de la string del userscript.
        const gameLogic = `
            import * as THREE from 'three';
            import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
            import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
            import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

            // --- GAME STATE ---
            const CONFIG = {
                acceleration: 60,
                maxSpeed: 120,
                rotationSpeed: 2.0,
                friction: 1.5,
                camLag: 0.1
            };

            let scene, camera, renderer, composer;
            let clock = new THREE.Clock();
            let isGameActive = false;

            // Entities
            let ship, enemyFrigate, planet;
            let particles = [];
            let projectiles = [];
            let asteroids = [];
            let nebulas = [];
            let invaders = [];

            // Input
            const keys = { w: false, a: false, s: false, d: false, space: false };

            // Physics
            let shipVelocity = 0;
            let cameraMode = 'TPS';

            // Audio
            const AudioSys = {
                ctx: null,
                init: function() {
                    if(!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                },
                playTone: function(freq, type, dur, volume = 0.05) {
                    if(!this.ctx) return;
                    if(this.ctx.state === 'suspended') this.ctx.resume();
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                    osc.type = type;
                    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start();
                    osc.stop(this.ctx.currentTime + dur);
                },
                playPositionalSound: function(pos, type) {
                    if(!ship) return;
                    const dist = pos.distanceTo(ship.position);
                    const maxDist = 300;
                    if(dist > maxDist) return;

                    // Volume attenuation based on distance
                    const volume = Math.max(0, 1 - (dist / maxDist)) * 0.1;

                    if (type === 'invader_move') {
                        this.playTone(150 + Math.random()*50, 'sawtooth', 0.1, volume * 0.5);
                    } else if (type === 'invader_die') {
                        this.playTone(50, 'square', 0.3, volume * 2);
                    }
                }
            };

            function init() {
                // Scene
                scene = new THREE.Scene();
                scene.fog = new THREE.FogExp2(0x020205, 0.0008); // Deep space fog

                // Camera
                camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);

                // Renderer
                renderer = new THREE.WebGLRenderer({ antialias: true });
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.toneMapping = THREE.ACESFilmicToneMapping;
                document.body.appendChild(renderer.domElement);

                // Post Processing (Bloom)
                const renderScene = new RenderPass(scene, camera);
                const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
                bloomPass.threshold = 0.1;
                bloomPass.strength = 1.0;
                bloomPass.radius = 0.5;

                composer = new EffectComposer(renderer);
                composer.addPass(renderScene);
                composer.addPass(bloomPass);

                // Lights
                const sun = new THREE.DirectionalLight(0xffffff, 1.5);
                sun.position.set(500, 300, 500);
                scene.add(sun);
                const ambient = new THREE.AmbientLight(0x111122, 1.0); // Brighter ambient for space
                scene.add(ambient);

                // --- ENVIRONMENT GENERATION ---
                createStarfield();
                createPlanet();
                createAsteroidField();
                createNebulas();

                // --- ACTORS ---
                ship = createAresStarfighter();
                scene.add(ship);

                enemyFrigate = createFrigate();
                enemyFrigate.position.set(0, 0, -800);
                enemyFrigate.rotation.y = Math.PI / 6;
                scene.add(enemyFrigate);

                // Events
                window.addEventListener('resize', onResize);
                window.addEventListener('keydown', (e) => onKey(e, true));
                window.addEventListener('keyup', (e) => onKey(e, false));

                document.getElementById('start-btn').addEventListener('click', startGame);

                renderer.setAnimationLoop(loop);
            }

            function startGame() {
                isGameActive = true;
                AudioSys.init();
                document.getElementById('menu').classList.add('hidden');
                document.getElementById('hud-top').style.opacity = 1;
                document.getElementById('controls-info').classList.add('active');
                document.getElementById('reticle').classList.add('active');
                AudioSys.playTone(440, 'sine', 1);

                // Music Handling
                const music = document.getElementById('bg-music');
                if (music) {
                    music.volume = 0.5;
                    music.play().catch(e => console.log("Audio autoplay blocked needed interaction"));
                }

                // Spawn initial wave of Invaders
                spawnInvaderWave(5);
            }

            // --- ASSET GENERATION ---

            function createInvader() {
                const group = new THREE.Group();
                const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Retro Green

                // Voxel Body (Crab shape-ish)
                const s = 1.5; // Scale size
                const positions = [
                    [0,0,0], [-1,0,0], [1,0,0], [-2,0,0], [2,0,0], // Mid
                    [-1,1,0], [1,1,0], [0,1,0],
                    [-2,-1,0], [2,-1,0], [0,-1,0], [-2,-2,0], [2,-2,0] // Legs
                ];

                const geo = new THREE.BoxGeometry(s,s,s);

                // Merge geometry for performance would be better, but groups are easier to read
                positions.forEach(pos => {
                    const cube = new THREE.Mesh(geo, mat);
                    cube.position.set(pos[0]*s, pos[1]*s, pos[2]*s);
                    group.add(cube);
                });

                // Eyes
                const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff00ff }); // Magenta Eyes
                const lEye = new THREE.Mesh(new THREE.BoxGeometry(s,s,s/2), eyeMat);
                lEye.position.set(-0.8*s, 0.5*s, 0.6*s);
                const rEye = new THREE.Mesh(new THREE.BoxGeometry(s,s,s/2), eyeMat);
                rEye.position.set(0.8*s, 0.5*s, 0.6*s);
                group.add(lEye); group.add(rEye);

                group.userData = {
                    hp: 30,
                    speed: 20 + Math.random() * 10,
                    bobOffset: Math.random() * 100
                };
                return group;
            }

            function spawnInvaderWave(count) {
                if(!ship) return;

                for(let i=0; i<count; i++) {
                    const inv = createInvader();
                    // Spawn around the player in front
                    const angle = (Math.random() - 0.5) * Math.PI; // -90 to 90 degrees
                    const dist = 300 + Math.random() * 200;

                    inv.position.x = ship.position.x + Math.sin(angle) * dist;
                    inv.position.z = ship.position.z - Math.cos(angle) * dist;
                    inv.position.y = ship.position.y + (Math.random()-0.5) * 50;

                    scene.add(inv);
                    invaders.push(inv);
                }
                logMessage(\`WARNING: \${count} INVADERS DETECTED\`);
                AudioSys.playTone(100, 'sawtooth', 0.5, 0.1);
            }

            function createPlanet() {
                const geo = new THREE.IcosahedronGeometry(400, 3);
                const mat = new THREE.MeshBasicMaterial({ color: 0x0033ff, wireframe: true, transparent: true, opacity: 0.1 });
                planet = new THREE.Mesh(geo, mat);
                planet.position.set(-600, -200, -1000);

                const coreGeo = new THREE.IcosahedronGeometry(300, 2);
                const coreMat = new THREE.MeshBasicMaterial({ color: 0x000033 });
                const core = new THREE.Mesh(coreGeo, coreMat);
                planet.add(core);

                const ringGeo = new THREE.TorusGeometry(600, 5, 16, 100);
                const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.3 });
                const ring = new THREE.Mesh(ringGeo, ringMat);
                ring.rotation.x = Math.PI / 2.3;
                planet.add(ring);

                scene.add(planet);
            }

            function createNebulas() {
                const canvas = document.createElement('canvas');
                canvas.width = 128; canvas.height = 128;
                const ctx = canvas.getContext('2d');
                const grad = ctx.createRadialGradient(64,64,0,64,64,64);
                grad.addColorStop(0, 'rgba(100, 0, 200, 0.2)');
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = grad;
                ctx.fillRect(0,0,128,128);

                const tex = new THREE.CanvasTexture(canvas);
                const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending });

                for(let i=0; i<30; i++) {
                    const sprite = new THREE.Sprite(mat);
                    sprite.position.set((Math.random()-0.5) * 2000, (Math.random()-0.5) * 1000, (Math.random()-0.5) * 2000);
                    sprite.scale.set(400, 400, 1);
                    scene.add(sprite);
                    nebulas.push(sprite);
                }
            }

            function createAsteroidField() {
                const count = 500;
                const geo = new THREE.DodecahedronGeometry(1, 0);
                const mat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.8 });
                const mesh = new THREE.InstancedMesh(geo, mat, count);

                const dummy = new THREE.Object3D();
                for(let i=0; i<count; i++) {
                    dummy.position.set((Math.random()-0.5) * 1500, (Math.random()-0.5) * 600, (Math.random()-0.5) * 1500);
                    if(dummy.position.length() < 100) dummy.position.x += 200;
                    dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
                    dummy.scale.setScalar(2 + Math.random() * 8);
                    dummy.updateMatrix();
                    mesh.setMatrixAt(i, dummy.matrix);
                }
                scene.add(mesh);
            }

            function createAresStarfighter() {
                const root = new THREE.Group();
                const hullMat = new THREE.MeshStandardMaterial({ color: 0x8899aa, roughness: 0.3, metalness: 0.8 });
                const darkMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7 });
                const glowMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
                const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x00aaff, metalness: 0.9, roughness: 0.1, transmission: 0.5, transparent: true });

                const body = new THREE.Mesh(new THREE.ConeGeometry(0.8, 6, 8).rotateX(Math.PI / 2), hullMat); root.add(body);
                const cockpit = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 1.5).translate(0, 0.3, -0.5), glassMat); root.add(cockpit);

                const wingGeo = new THREE.BufferGeometry();
                const wingVerts = new Float32Array([0, 0, 1, 2.5, 0, 2, 0, 0, -1, 0, 0, 1, -2.5, 0, 2, 0, 0, -1]);
                wingGeo.setAttribute('position', new THREE.BufferAttribute(wingVerts, 3));
                wingGeo.computeVertexNormals();
                root.add(new THREE.Mesh(wingGeo, hullMat));

                const engGeo = new THREE.CylinderGeometry(0.4, 0.3, 2, 8).rotateX(Math.PI / 2);
                const engL = new THREE.Mesh(engGeo, darkMat); engL.position.set(-1.2, 0, 1.5);
                const engR = new THREE.Mesh(engGeo, darkMat); engR.position.set(1.2, 0, 1.5);
                root.add(engL); root.add(engR);

                const nozGeo = new THREE.CircleGeometry(0.25, 8);
                const nozL = new THREE.Mesh(nozGeo, glowMat); nozL.position.set(-1.2, 0, 2.51); nozL.rotation.y = Math.PI;
                const nozR = new THREE.Mesh(nozGeo, glowMat); nozR.position.set(1.2, 0, 2.51); nozR.rotation.y = Math.PI;
                root.add(nozL); root.add(nozR);

                const eL = new THREE.Object3D(); eL.position.copy(nozL.position);
                const eR = new THREE.Object3D(); eR.position.copy(nozR.position);
                root.add(eL); root.add(eR);
                root.userData = { emitters: [eL, eR] };

                return root;
            }

            function createFrigate() {
                const root = new THREE.Group();
                const hullMat = new THREE.MeshStandardMaterial({ color: 0x882222, roughness: 0.6, metalness: 0.4 });
                const detailMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
                const lightMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });

                const main = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 60), hullMat); root.add(main);
                const bridge = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 12).translate(0, 6, -10), hullMat); root.add(bridge);

                const podGeo = new THREE.CylinderGeometry(3, 3, 40, 6).rotateX(Math.PI / 2);
                const pL = new THREE.Mesh(podGeo, detailMat); pL.position.set(-10, 0, 10);
                const pR = new THREE.Mesh(podGeo, detailMat); pR.position.set(10, 0, 10);
                root.add(pL); root.add(pR);

                const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.5, 15).rotateX(Math.PI/2).translate(0,0,-35), detailMat); root.add(ant);

                for(let i=0; i<6; i++) {
                    const l = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 2), lightMat);
                    l.position.set(i%2===0?11:-11, 0, -10 + i*5);
                    root.add(l);
                }
                root.userData = { hp: 1000, maxHp: 1000 };
                return root;
            }

            function createStarfield() {
                const geo = new THREE.BufferGeometry();
                const count = 5000;
                const pos = new Float32Array(count * 3);
                for(let i=0; i<count*3; i++) pos[i] = (Math.random() - 0.5) * 4000;
                geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
                scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.8 })));
            }

            // --- GAME LOGIC ---

            function onKey(e, down) {
                if(!isGameActive) return;
                const k = e.key.toLowerCase();
                if(k === 'w') keys.w = down;
                if(k === 's') keys.s = down;
                if(k === 'a') keys.a = down;
                if(k === 'd') keys.d = down;
                if(k === ' ') keys.space = down;
                if(down && k === '6') changeCamera('TPS');
                if(down && k === '7') changeCamera('FPS');
            }

            function changeCamera(mode) {
                cameraMode = mode;
                document.getElementById('cam-display').innerText = mode === 'TPS' ? "TPS (Tactical)" : "FPS (Cockpit)";
                AudioSys.playTone(600, 'sine', 0.1);
            }

            function logMessage(text) {
                const el = document.createElement('div');
                el.className = 'msg';
                el.innerText = text;
                document.getElementById('message-log').appendChild(el);
                setTimeout(() => el.remove(), 3000);
            }

            function spawnProjectile() {
                const geo = new THREE.CapsuleGeometry(0.1, 2, 4);
                const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                const mesh = new THREE.Mesh(geo, mat);

                mesh.position.copy(ship.position);
                mesh.quaternion.copy(ship.quaternion);
                mesh.rotateX(Math.PI / 2);
                mesh.translateY(1.5);

                scene.add(mesh);

                const vel = new THREE.Vector3(0, 0, -1).applyQuaternion(ship.quaternion).multiplyScalar(400);
                vel.add(new THREE.Vector3(0, 0, -1).applyQuaternion(ship.quaternion).multiplyScalar(shipVelocity));

                projectiles.push({ mesh, vel, life: 3.0 });
                AudioSys.playTone(800, 'square', 0.05);
            }

            let lastShot = 0;

            function loop() {
                if(!isGameActive) {
                    if(ship) ship.rotation.z += 0.005;
                    renderer.render(scene, camera);
                    return;
                }

                const dt = Math.min(clock.getDelta(), 0.1);
                const now = clock.getElapsedTime();

                // 1. SHIP PHYSICS
                if (keys.w && shipVelocity < CONFIG.maxSpeed) shipVelocity += CONFIG.acceleration * dt;
                if (keys.s && shipVelocity > -CONFIG.maxSpeed/2) shipVelocity -= CONFIG.acceleration * dt;
                if (!keys.w && !keys.s) shipVelocity -= shipVelocity * CONFIG.friction * dt;

                if (keys.a) ship.rotation.y += CONFIG.rotationSpeed * dt;
                if (keys.d) ship.rotation.y -= CONFIG.rotationSpeed * dt;

                const targetRoll = (Number(keys.w || 0) * (keys.a ? 0.5 : (keys.d ? -0.5 : 0)));
                ship.rotation.z = THREE.MathUtils.lerp(ship.rotation.z, targetRoll, dt * 5);
                ship.translateZ(-shipVelocity * dt);

                document.getElementById('speed-display').innerText = Math.abs(Math.floor(shipVelocity * 10)) + " M/S";

                // 2. PARTICLES
                if (keys.w || Math.abs(shipVelocity) > 1) {
                    const scale = Math.max(0.5, Math.abs(shipVelocity) / CONFIG.maxSpeed);
                    ship.userData.emitters.forEach(em => {
                        const p = new THREE.Mesh(new THREE.BoxGeometry(0.2,0.2,0.2), new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.8}));
                        const wp = new THREE.Vector3(); em.getWorldPosition(wp);
                        p.position.copy(wp);
                        p.position.x += (Math.random()-0.5)*0.2; p.position.y += (Math.random()-0.5)*0.2;
                        scene.add(p);
                        particles.push({ mesh: p, life: 0.5 * scale });
                    });
                }
                for(let i=particles.length-1; i>=0; i--) {
                    particles[i].life -= dt;
                    particles[i].mesh.scale.multiplyScalar(0.9);
                    if(particles[i].life <= 0) { scene.remove(particles[i].mesh); particles.splice(i, 1); }
                }

                // 3. PROJECTILES
                if (keys.space && now - lastShot > 0.15) { spawnProjectile(); lastShot = now; }

                for (let i=projectiles.length-1; i>=0; i--) {
                    const p = projectiles[i];
                    p.life -= dt;
                    p.mesh.position.addScaledVector(p.vel, dt);

                    // Check Collision with Frigate
                    let hit = false;
                    const distFrigate = p.mesh.position.distanceTo(enemyFrigate.position);
                    if (distFrigate < 40 && enemyFrigate.visible) {
                        enemyFrigate.userData.hp -= 10;
                        hit = true;

                        // Frigate Destruction logic
                        const hpPct = Math.max(0, Math.floor((enemyFrigate.userData.hp / enemyFrigate.userData.maxHp)*100));
                        document.getElementById('target-health').innerText = \`Frigate: \${hpPct}%\`;
                        if (hpPct <= 0) {
                             document.getElementById('target-health').innerText = "Frigate: DESTROYED";
                             enemyFrigate.visible = false;
                             // Explosion
                             for(let k=0; k<20; k++) {
                                 const ex = new THREE.Mesh(new THREE.BoxGeometry(2,2,2), new THREE.MeshBasicMaterial({color: 0xffaa00}));
                                 ex.position.copy(enemyFrigate.position);
                                 ex.position.x += (Math.random()-0.5)*30;
                                 scene.add(ex);
                                 particles.push({ mesh: ex, life: 2.0 });
                             }
                        }
                    }

                    // Check Collision with Invaders
                    if(!hit) {
                        for(let j=invaders.length-1; j>=0; j--) {
                            const inv = invaders[j];
                            if(p.mesh.position.distanceTo(inv.position) < 5) {
                                hit = true;
                                inv.userData.hp -= 10;
                                if(inv.userData.hp <= 0) {
                                    // Kill Invader
                                    AudioSys.playPositionalSound(inv.position, 'invader_die');

                                    // Explosion Effect
                                    for(let k=0; k<5; k++) {
                                        const ex = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,0.5), new THREE.MeshBasicMaterial({color: 0x00ff00}));
                                        ex.position.copy(inv.position);
                                        ex.position.x += (Math.random()-0.5)*2;
                                        scene.add(ex);
                                        particles.push({ mesh: ex, life: 1.0 });
                                    }

                                    scene.remove(inv);
                                    invaders.splice(j, 1);
                                    logMessage("INVADER ELIMINATED");
                                } else {
                                    // Hit flash
                                    inv.position.y += 0.5;
                                }
                                break;
                            }
                        }
                    }

                    if(hit) {
                        const flash = new THREE.PointLight(0xffaa00, 2, 20);
                        flash.position.copy(p.mesh.position);
                        scene.add(flash);
                        setTimeout(()=>scene.remove(flash), 50);
                        scene.remove(p.mesh);
                        projectiles.splice(i, 1);
                    } else if (p.life <= 0) {
                        scene.remove(p.mesh); projectiles.splice(i, 1);
                    }
                }

                // 4. INVADER AI
                if(invaders.length < 3 && Math.random() < 0.01) spawnInvaderWave(3); // Continuous spawning

                for(let i=invaders.length-1; i>=0; i--) {
                    const inv = invaders[i];

                    // Move towards ship
                    const target = ship.position.clone();
                    const dir = target.sub(inv.position).normalize();

                    inv.lookAt(ship.position);
                    inv.position.addScaledVector(dir, inv.userData.speed * dt);

                    // Bobbing animation
                    inv.position.y += Math.sin(now * 5 + inv.userData.bobOffset) * 0.1;

                    // SFX Loop (random chance)
                    if(Math.random() < 0.02) {
                        AudioSys.playPositionalSound(inv.position, 'invader_move');
                    }

                    // Collision with Player
                    if(inv.position.distanceTo(ship.position) < 5) {
                        logMessage("HULL BREACH DETECTED!");
                        ship.position.addScaledVector(dir, 5); // Knockback
                        // Could deduct health here if implemented
                    }
                }

                // 5. CAMERA & ENVIRONMENT
                if (cameraMode === 'TPS') {
                    const offset = new THREE.Vector3(0, 6, 15).applyMatrix4(ship.matrixWorld);
                    camera.position.lerp(offset, 0.1);
                    const lookTarget = new THREE.Vector3(0, 0, -50).applyMatrix4(ship.matrixWorld);
                    camera.lookAt(lookTarget);
                } else {
                    const offset = new THREE.Vector3(0, 0.5, -0.5).applyMatrix4(ship.matrixWorld);
                    camera.position.copy(offset);
                    camera.quaternion.copy(ship.quaternion);
                }

                if(planet) planet.rotation.y += 0.0005;

                // Reticle Logic
                const raycaster = new THREE.Raycaster();
                raycaster.set(ship.position, new THREE.Vector3(0, 0, -1).applyQuaternion(ship.quaternion));

                // Raycast against both Frigate and Invaders
                const targets = [enemyFrigate, ...invaders];
                const intersects = raycaster.intersectObjects(targets, true);

                const reticle = document.getElementById('reticle');
                if (intersects.length > 0 && intersects[0].distance < 1000) {
                    reticle.classList.add('locked');
                } else {
                    reticle.classList.remove('locked');
                }

                composer.render();
            }

            function onResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                composer.setSize(window.innerWidth, window.innerHeight);
            }

            init();
        `;

        const scriptEl = document.createElement('script');
        scriptEl.type = "module";
        scriptEl.textContent = gameLogic;
        document.body.appendChild(scriptEl);
    }

})();