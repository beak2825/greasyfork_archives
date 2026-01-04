// ==UserScript==
// @name         SI-Iteung Pro Style
// @namespace    http://siiteung.kabayan.id/
// @version      v1.4
// @description  Iteung rasa baru
// @license      MIT
// @match        *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kabayan.id
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/557718/SI-Iteung%20Pro%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/557718/SI-Iteung%20Pro%20Style.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    .games {
        background: #00000090;
        color: white;
        font-family: Arial, sans-serif;
        text-align: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        position: absolute;
        z-index: 999999;
    }

    canvas {
        background: black;
        border: 2px solid white;
        display: block;
        margin: 0 auto;
        cursor: crosshair;
    }

    .threedtext {
        font-family:Arial, sans-serif;
        line-height:1em;
        color:#ff8cff;
        font-weight:bold;
        font-style:italic;
        font-size:75px;
        text-shadow:0px 0px 0 rgb(189,74,189),-1px 1px 0 rgb(186,71,186),-2px 2px 0 rgb(183,68,183),-3px 3px 0 rgb(179,64,179),-4px 4px 0 rgb(176,61,176),-5px 5px 0 rgb(173,58,173),-6px 6px 0 rgb(170,55,170),-7px 7px 0 rgb(167,52,167),-8px 8px 0 rgb(164,49,164),-9px 9px 0 rgb(161,46,161),-10px 10px 0 rgb(157,42,157),-11px 11px 0 rgb(154,39,154),-12px 12px 0 rgb(151,36,151),-13px 13px 0 rgb(148,33,148),-14px 14px 0 rgb(145,30,145),-15px 15px 0 rgb(142,27,142),-16px 16px 0 rgb(138,23,138),-17px 17px 0 rgb(135,20,135),-18px 18px 0 rgb(132,17,132),-19px 19px 0 rgb(129,14,129), -20px 20px 0 rgb(126,11,126);
        position: absolute;
        left: 7%;
        top: 2rem;
        transform: perspective(700px) skew(0deg,0deg) scale(0.5);
    }

    .threedenim {
        -webkit-animation: threeanim 5s forwards alternate, threeanimbg 1s infinite alternate;
        animation: threeanim 5s forwards alternate, threeanimbg 1s infinite alternate;
    }

    .wave {
      background-color: #F3F6F9;
      overflow: hidden;
      position: relative;
    }
    .wave > div {
      z-index: 1;
    }
    .wave:before {
      content: " ";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ffffff;
      z-index: -1;
    }
    .wave:after {
      content: " ";
      width: 1000px;
      height: 1025px;
      position: absolute;
      bottom: 65%;
      left: -250px;
      border-radius: 35%;
      background: white;
      z-index: 0;
    }
    .wave:after {
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
    }
    .wave-animate:after {
      -webkit-animation: animate-wave 15s infinite linear;
      animation: animate-wave 15s infinite linear;
    }
    .wave-animate-slower:after {
      -webkit-animation: animate-wave 30s infinite linear;
      animation: animate-wave 30s infinite linear;
    }
    .wave-animate-slow:after {
      -webkit-animation: animate-wave 25s infinite linear;
      animation: animate-wave 25s infinite linear;
    }
    .wave-animate-fast:after {
      -webkit-animation: animate-wave 10s infinite linear;
      animation: animate-wave 10s infinite linear;
    }
    .wave-animate-faster:after {
      -webkit-animation: animate-wave 5s infinite linear;
      animation: animate-wave 5s infinite linear;
    }
    .wave.wave-primary {
      background-color: rgba(54, 153, 255, 0.1) !important;
    }
    .wave.wave-primary .svg-icon svg g [fill] {
      fill: #3699FF;
    }
    .wave.wave-secondary {
      background-color: rgba(228, 230, 239, 0.1) !important;
    }
    .wave.wave-secondary .svg-icon svg g [fill] {
      fill: #E4E6EF;
    }
    .wave.wave-success {
      background-color: rgba(27, 197, 189, 0.1) !important;
    }
    .wave.wave-success .svg-icon svg g [fill] {
      fill: #1BC5BD;
    }
    .wave.wave-info {
      background-color: rgba(137, 80, 252, 0.1) !important;
    }
    .wave.wave-info .svg-icon svg g [fill] {
      fill: #8950FC;
    }
    .wave.wave-warning {
      background-color: rgba(255, 168, 0, 0.1) !important;
    }
    .wave.wave-warning .svg-icon svg g [fill] {
      fill: #FFA800;
    }
    .wave.wave-danger {
      background-color: rgba(246, 78, 96, 0.1) !important;
    }
    .wave.wave-danger .svg-icon svg g [fill] {
      fill: #F64E60;
    }
    .wave.wave-light {
      background-color: rgba(243, 246, 249, 0.1) !important;
    }
    .wave.wave-light .svg-icon svg g [fill] {
      fill: #F3F6F9;
    }
    .wave.wave-dark {
      background-color: rgba(24, 28, 50, 0.1) !important;
    }
    .wave.wave-dark .svg-icon svg g [fill] {
      fill: #181C32;
    }
    .wave.wave-white {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }
    .wave.wave-white .svg-icon svg g [fill] {
      fill: #ffffff;
    }

    @-webkit-keyframes animate-wave {
      from {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      to {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }

    @keyframes animate-wave {
      from {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      to {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }

    @-webkit-keyframes threeanim {
      from {
        transform: perspective(700px)
            skew(0deg,0deg) scale(0.5);
        transform-origin: center center;
      }
      to {
        transform: rotateX(25deg) rotateY(10deg) perspective(700px) skew(23deg,0deg) scale(1);
        transform-origin: center center;

      }
    }

    @keyframes threeanim {
      from {
        transform: perspective(700px)
            skew(0deg,0deg) scale(0.5);
        transform-origin: center center;
      }
      to {
        transform: rotateX(25deg) rotateY(10deg) perspective(700px) skew(23deg,0deg) scale(1);
        transform-origin: center center;
      }
    }

    @keyframes threeanimbg {
        from {
            color:#ff8cff;
        }
        to {
            color: rgb(250, 188, 188);
        }
    }

    #box {
        width: 80px;
        height: 80px;
        background: #00ffcc;
        position: absolute;
        left: 200px;
        top: 200px;
        border-radius: 12px;
        cursor: grab;
        z-index: 2;
    }

    #origin {
        width: 10px;
        height: 10px;
        background: red;
        position: absolute;
        left: 240px;
        top: 240px;
        border-radius: 50%;
        z-index: 1;
    }

    #rope {
        position: absolute;
        height: 4px;
        background: #00ffaa;
        transform-origin: left center;
        border-radius: 4px;
        z-index: 0;
    }
    `);

    $(document).ready(function () {
        $('body').append(`<div class="games hide" style="display: none;">
                <h2>Canvas Shooter (Mouse Aim)</h2>
                <p>Move: A/D or ← → | Shoot: Mouse Click | Esc: To Exit The Game</p>
                <canvas id="gameCanvas" width="500" height="400" draggable="false"></canvas>
            </div>`);
        $('.card-body.pb-0>.row.py-3').after('<div class="threedtext mb-md-5 m-0">SI-Iteung Pro</div>');
        var pp = $('.symbol.symbol-100px.symbol-lg-160px.symbol-fixed.position-relative.border.border-secondary');

        var clickedCount = 0;

        pp.children().each((i, e) => {
            $(e).attr('draggable', false);
        });

        $(pp.find('img')).on('click', function () {
            $(this).effect('shake', { times: 3, distance: 10, direction: 'left' }, 500);
            clickedCount++;
            if (clickedCount >= 5) {
                $(".games").show();
                clickedCount = 0;
            }
        })

        $('.col-lg-4.d-flex.justify-content-center.align-items-center').removeClass('justify-content-center align-items-center').addClass('justify-content-end align-items-end')

        pp.attr('draggable', false);

        var unsafeWindow = window;
        // Add animation to 3d text
        setTimeout(function () {
            $('.threedtext').addClass('threedenim');
        }, 1000);


        // Class definition
        unsafeWindow.KTThemeMode = function () {
            var menu;
            var callbacks = [];
            var the = this;

            var getMode = function () {
                var mode;

                if (document.documentElement.hasAttribute("data-bs-theme")) {
                    return document.documentElement.getAttribute("data-bs-theme");
                } else if (localStorage.getItem("data-bs-theme") !== null) {
                    return localStorage.getItem("data-bs-theme");
                } else if (getMenuMode() === "system") {
                    return getSystemMode();
                }

                return "light";
            }

            var setMode = function (mode, menuMode) {
                var currentMode = getMode();

                // Reset mode if system mode was changed
                if (menuMode === 'system') {
                    if (getSystemMode() !== mode) {
                        mode = getSystemMode();
                    }
                } else if (mode !== menuMode) {
                    menuMode = mode;
                }

                // Read active menu mode value
                var activeMenuItem = menu ? menu.querySelector('[data-kt-element="mode"][data-kt-value="' + menuMode + '"]') : null;

                // Enable switching state
                document.documentElement.setAttribute("data-kt-theme-mode-switching", "true");

                // Set mode to the target document.documentElement
                document.documentElement.setAttribute("data-bs-theme", mode);

                // Disable switching state
                setTimeout(function () {
                    document.documentElement.removeAttribute("data-kt-theme-mode-switching");
                }, 300);

                // Store mode value in storage
                localStorage.setItem("data-bs-theme", mode);

                // Set active menu item
                if (activeMenuItem) {
                    localStorage.setItem("data-bs-theme-mode", menuMode);
                    setActiveMenuItem(activeMenuItem);
                }

                if (mode !== currentMode) {
                    KTEventHandler.trigger(document.documentElement, 'kt.thememode.change', the);
                }
            }

            var getMenuMode = function () {
                if (!menu) {
                    return null;
                }

                var menuItem = menu ? menu.querySelector('.active[data-kt-element="mode"]') : null;

                if (menuItem && menuItem.getAttribute('data-kt-value')) {
                    return menuItem.getAttribute('data-kt-value');
                } else if (document.documentElement.hasAttribute("data-bs-theme-mode")) {
                    return document.documentElement.getAttribute("data-bs-theme-mode")
                } else if (localStorage.getItem("data-bs-theme-mode") !== null) {
                    return localStorage.getItem("data-bs-theme-mode");
                } else {
                    return typeof defaultThemeMode !== "undefined" ? defaultThemeMode : "light";
                }
            }

            var getSystemMode = function () {
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
            }

            var initMode = function () {
                setMode(getMode(), getMenuMode());
                KTEventHandler.trigger(document.documentElement, 'kt.thememode.init', the);
            }

            var getActiveMenuItem = function () {
                return menu.querySelector('[data-kt-element="mode"][data-kt-value="' + getMenuMode() + '"]');
            }

            var setActiveMenuItem = function (item) {
                var menuMode = item.getAttribute("data-kt-value");

                var activeItem = menu.querySelector('.active[data-kt-element="mode"]');

                if (activeItem) {
                    activeItem.classList.remove("active");
                }

                item.classList.add("active");
                localStorage.setItem("data-bs-theme-mode", menuMode);
            }

            var handleMenu = function () {
                var items = [].slice.call(menu.querySelectorAll('[data-kt-element="mode"]'));

                items.map(function (item) {
                    item.addEventListener("click", function (e) {
                        e.preventDefault();

                        var menuMode = item.getAttribute("data-kt-value");
                        var mode = menuMode;

                        if (menuMode === "system") {
                            mode = getSystemMode();
                        }

                        setMode(mode, menuMode);
                    });
                });
            }

            return {
                init: function () {
                    menu = document.querySelector('[data-kt-element="theme-mode-menu"]');

                    initMode();

                    if (menu) {
                        handleMenu();
                    }
                },

                getMode: function () {
                    return getMode();
                },

                getMenuMode: function () {
                    return getMenuMode();
                },

                getSystemMode: function () {
                    return getSystemMode();
                },

                setMode: function (mode) {
                    return setMode(mode)
                },

                on: function (name, handler) {
                    return KTEventHandler.on(document.documentElement, name, handler);
                },

                off: function (name, handlerId) {
                    return KTEventHandler.off(document.documentElement, name, handlerId);
                }
            };
        }();

        // Class definition
        unsafeWindow.KTThemeModeUser = function () {

            var handleSubmit = function () {
                // Update chart on theme mode change
                unsafeWindow.KTThemeMode.on("kt.thememode.change", function () {
                    var menuMode = unsafeWindow.KTThemeMode.getMenuMode();
                    var mode = unsafeWindow.KTThemeMode.getMode();
                    console.log("user selected theme mode:" + menuMode);
                    console.log("theme mode:" + mode);

                    // Submit selected theme mode menu option via ajax and
                    // store it in user profile and set the user opted theme mode via HTML attribute
                    // <html data-theme-mode="light"> .... </html>
                });
            }

            return {
                init: function () {
                    handleSubmit();
                }
            };
        }();


        function setGame() {
            const canvas = document.getElementById("gameCanvas");
            const ctx = canvas.getContext("2d");

            // ==== SOUND PLACEHOLDERS ====
            const shootSound = new Audio("shoot.mp3");
            const hitSound = new Audio("hit.mp3");
            const damageSound = new Audio("damage.mp3");
            const powerupSound = new Audio("powerup.mp3");
            const bossSound = new Audio("boss.mp3");

            let score = 0;
            let health = 100;
            let gameOver = true;
            let bossCooldown = false;
            let lastBossKillTime = 0;

            // ==== PLAYER ====
            const player = {
                x: canvas.width / 2 - 20,
                y: canvas.height / 2 - 20,
                w: 40,
                h: 40,
                speed: 4,
            };

            // ==== ARRAYS ====
            const bullets = [];
            const enemies = [];
            const powerups = [];

            // ==== BOOST STATE ====
            let fireRate = 300; // ms
            let invincible = false;
            let multiShot = false;
            let lastShot = 0;
            let boss = null;

            // ==== INPUT ====
            const keys = {};
            let mouse = { x: 0, y: 0 };

            document.addEventListener("keydown", (e) => {
                keys[e.key] = true;
                if (e.key == 'Escape') {
                    $(".games").hide();
                }
            });
            document.addEventListener("keyup", (e) => (keys[e.key] = false));

            canvas.addEventListener("mousemove", (e) => {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            });

            canvas.addEventListener("mousedown", shoot);

            canvas.addEventListener("click", () => {
                if (gameOver) {
                    resetGame();
                }
            });


            // ==== SHOOT WITH FIRE RATE CONTROL ====
            function shoot() {
                if (gameOver) return;
                const now = Date.now();
                if (now - lastShot < fireRate) return;
                lastShot = now;

                const baseAngle = Math.atan2(
                    mouse.y - (player.y + player.h / 2),
                    mouse.x - (player.x + player.w / 2)
                );

                const bulletCount = multiShot ? 5 : 1;
                const spread = 0.2; // angle spread for multi bullets

                for (let i = 0; i < bulletCount; i++) {
                    const angle = baseAngle + (i - (bulletCount - 1) / 2) * spread;

                    bullets.push({
                        x: player.x + player.w / 2,
                        y: player.y + player.h / 2,
                        r: 4,
                        vx: Math.cos(angle) * 8,
                        vy: Math.sin(angle) * 8,
                    });
                }

                // shootSound.play();
            }

            // ==== ENEMY SPAWN ====
            function spawnEnemy() {
                if (boss) return; // stop normal enemies while boss alive

                const side = Math.floor(Math.random() * 4);
                const speed = 1.5 + Math.random();

                let x, y, vx, vy;
                if (side === 0) {
                    x = Math.random() * canvas.width;
                    y = -40;
                    vx = 0;
                    vy = speed;
                } else if (side === 1) {
                    x = canvas.width + 40;
                    y = Math.random() * canvas.height;
                    vx = -speed;
                    vy = 0;
                } else if (side === 2) {
                    x = Math.random() * canvas.width;
                    y = canvas.height + 40;
                    vx = 0;
                    vy = -speed;
                } else {
                    x = -40;
                    y = Math.random() * canvas.height;
                    vx = speed;
                    vy = 0;
                }

                enemies.push({ x, y, w: 30, h: 30, vx, vy });
            }

            // ==== POWERUPS ====
            function spawnPowerup() {
                if (gameOver) return;
                const type = Math.random() < 0.5 ? "rapid" : "shield";

                powerups.push({
                    x: Math.random() * (canvas.width - 20),
                    y: Math.random() * (canvas.height - 20),
                    w: 20,
                    h: 20,
                    type,
                });
            }

            // ==== BOSS ====
            function spawnBoss() {
                boss = {
                    x: canvas.width / 2 - 80,
                    y: -120,
                    w: 160,
                    h: 120,
                    hp: 300,
                    maxHp: 300,
                };

                // bossSound.play();
            }

            // ==== COLLISIONS ====
            function rectsColliding(a, b) {
                return (
                    a.x < b.x + b.w &&
                    a.x + a.w > b.x &&
                    a.y < b.y + b.h &&
                    a.y + a.h > b.y
                );
            }

            function circleRectCollide(c, r) {
                return c.x > r.x && c.x < r.x + r.w && c.y > r.y && c.y < r.y + r.h;
            }

            // ==== UPDATE ====
            function update() {
                if (gameOver) return;

                // Move Player
                if (keys["a"] || keys["ArrowLeft"]) player.x -= player.speed;
                if (keys["d"] || keys["ArrowRight"]) player.x += player.speed;
                if (keys["w"] || keys["ArrowUp"]) player.y -= player.speed;
                if (keys["s"] || keys["ArrowDown"]) player.y += player.speed;

                // Bounds
                player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
                player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));

                // Move bullets
                for (let i = bullets.length - 1; i >= 0; i--) {
                    const b = bullets[i];
                    b.x += b.vx;
                    b.y += b.vy;
                    if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height)
                        bullets.splice(i, 1);
                }

                // Enemies
                for (let i = enemies.length - 1; i >= 0; i--) {
                    const e = enemies[i];
                    e.x += e.vx;
                    e.y += e.vy;

                    if (rectsColliding(player, e)) {
                        enemies.splice(i, 1);
                        if (!invincible) {
                            health -= 10;
                            // damageSound.play();
                        }
                    }
                }

                // Powerups
                for (let i = powerups.length - 1; i >= 0; i--) {
                    const p = powerups[i];
                    if (rectsColliding(player, p)) {
                        if (p.type === "rapid") {
                            multiShot = true;
                            setTimeout(() => (multiShot = false), 5000);
                        } else if (p.type === "shield") {
                            invincible = true;
                            setTimeout(() => (invincible = false), 5000);
                        }

                        // powerupSound.play();
                        powerups.splice(i, 1);
                    }
                }

                // Bullet vs Enemy
                for (let i = enemies.length - 1; i >= 0; i--) {
                    for (let j = bullets.length - 1; j >= 0; j--) {
                        if (circleRectCollide(bullets[j], enemies[i])) {
                            enemies.splice(i, 1);
                            bullets.splice(j, 1);
                            score += 10;
                            break;
                        }
                    }
                }

                // ==== BOSS LOGIC ====
                if (!boss && !bossCooldown && score >= 200) {
                    spawnBoss();
                }

                if (boss) {
                    boss.y += 0.5;

                    // Bullet vs Boss
                    for (let j = bullets.length - 1; j >= 0; j--) {
                        if (circleRectCollide(bullets[j], boss)) {
                            bullets.splice(j, 1);
                            boss.hp -= 5;
                        }
                    }

                    // Boss hits player
                    if (rectsColliding(player, boss) && !invincible) {
                        health -= 20;
                    }

                    // ✅ If boss exits canvas (bottom)
                    if (boss.y > canvas.height) {
                        boss = null;
                        health -= 20;

                        bossCooldown = true;
                        setTimeout(() => (bossCooldown = false), 60000);
                    }

                    // Boss killed
                    if (boss && boss.hp <= 0) {
                        boss = null;
                        score += 500;

                        bossCooldown = true;
                        setTimeout(() => (bossCooldown = false), 60000);
                    }
                }

                // Game over
                if (health <= 0) {
                    gameOver = true;
                }
            }

            // ==== RESET ====
            function resetGame() {
                score = 0;
                health = 100;
                gameOver = false;

                bullets.length = 0;
                enemies.length = 0;
                powerups.length = 0;

                boss = null;
                bossCooldown = false;
                lastShot = 0;
            }


            // ==== DRAW ====
            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Player
                ctx.fillStyle = invincible ? "cyan" : "lime";
                ctx.fillRect(player.x, player.y, player.w, player.h);

                // Bullets
                ctx.fillStyle = "yellow";
                bullets.forEach((b) => {
                    ctx.beginPath();
                    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                    ctx.fill();
                });

                // Enemies
                ctx.fillStyle = "red";
                enemies.forEach((e) => {
                    ctx.fillRect(e.x, e.y, e.w, e.h);
                });

                // Powerups
                powerups.forEach((p) => {
                    ctx.fillStyle = p.type === "rapid" ? "orange" : "cyan";
                    ctx.fillRect(p.x, p.y, p.w, p.h);
                });

                // Boss
                if (boss) {
                    ctx.fillStyle = "purple";
                    ctx.fillRect(boss.x, boss.y, boss.w, boss.h);

                    // Boss HP Bar
                    ctx.fillStyle = "black";
                    ctx.fillRect(50, 10, 400, 10);
                    ctx.fillStyle = "red";
                    ctx.fillRect(50, 10, (boss.hp / boss.maxHp) * 400, 10);
                }

                // UI
                ctx.fillStyle = "white";
                ctx.font = "16px Arial";
                ctx.fillText("Score: " + score, 20, 30);
                ctx.fillText("HP: " + health, 20, 50);

                if (gameOver) {
                    ctx.fillStyle = "white";
                    ctx.font = "40px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

                    ctx.font = "16px Arial";
                    ctx.fillText("Click anywhere to restart", canvas.width / 2, canvas.height / 2 + 30);

                    ctx.font = "14px Arial";
                    ctx.fillText("Your Score:", canvas.width / 2, canvas.height / 2 + 45);

                    let indexScore = localStorage.getItem('indexScore');
                    if (indexScore == null) {
                        indexScore = 1;
                    } else {
                        indexScore = parseInt(indexScore) + 1;
                    }
                    if (score > 0) {
                        localStorage.setItem('indexScore', indexScore);

                        localStorage.setItem('score_' + indexScore, score);

                        if (indexScore > 5) {
                            for (let index = 1; index < indexScore; index++) {
                                localStorage.removeItem('score_' + index);

                            }
                        }
                        score = 0;
                    }
                    let up = 1;
                    for (let index = indexScore; index > 0; index--) {
                        const lastScore = localStorage.getItem('score_' + index);
                        if (lastScore == null) continue;

                        ctx.font = "12px Arial";
                        ctx.fillText(lastScore, canvas.width / 2, canvas.height / 2 + 60 + (21 * up))
                        up++;
                    }
                    ctx.textAlign = "left"; // reset align
                }
            }

            // ==== LOOP ====
            function loop() {
                update();
                draw();
                requestAnimationFrame(loop);
            }

            setInterval(spawnEnemy, Math.random() * 250 + 100);
            setInterval(spawnPowerup, 5000);

            loop();
        }

        setTimeout(() => {
            KTThemeMode.init();
            KTThemeModeUser.init();
        }, 3000);

        setGame();
    });
})();