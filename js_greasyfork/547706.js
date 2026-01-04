// ==UserScript==
// @name         Sploop.io Legit Script [Reduced lag and new textures.]
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Show HP%, FPS, CPS, Ping, Big Shop, Transparent Shop & Clan menu. Use 75% page zoom for best results. Add Ghost mode & Hitbox. Press f2 to ON/OFF ghost mode & f4 to ON/OFF hitbox.
// @match        *://sploop.io/*
// @icon         https://i.postimg.cc/vBz07fcS/Screenshot-2025-08-28-090152.png
// @grant        none
// @author       Normalplayer
// @downloadURL https://update.greasyfork.org/scripts/547706/Sploopio%20Legit%20Script%20%5BReduced%20lag%20and%20new%20textures%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/547706/Sploopio%20Legit%20Script%20%5BReduced%20lag%20and%20new%20textures%5D.meta.js
// ==/UserScript==
              // =========//This is a completely legal script made by me and a compilation of scripts from other authors.//========== //
(function() {
    'use strict';
    // ---------------- Better Health Bar ----------------
    function lerpColor(a, b, amount) {
        const ah = parseInt(a.replace(/#/g, ''), 16),
              ar = ah >> 16, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
        const bh = parseInt(b.replace(/#/g, ''), 16),
              br = bh >> 16, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
        const rr = ar + amount * (br - ar),
              rg = ag + amount * (bg - ag),
              rb = ab + amount * (bb - ab);
        return '#' + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1);
    }

    function drawHpText(ctx, text, xPos, yPos, color) {
        ctx.save();
        ctx.font = "20px 'Baloo Paaji'";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = color;
        ctx.fillText(text, xPos, yPos);
        ctx.restore();
    }

    const enhanceFillRect = function (fill) {
        return function (x, y, width, height) {
            const fullWidth = 95;
            const hpPercent = Math.max(0, Math.min(1, width / fullWidth));
            const percentText = `${~~(width / fullWidth * 100)}%`;
            const centerX = x + fullWidth / 2;
            let color;
            if (this.fillStyle === "#a4cc4f") {
                color = hpPercent > 0.5 ? lerpColor("#a4cc4f", "#e09f3e", (1 - hpPercent) * 2)
                                         : lerpColor("#e09f3e", "#cc5151", (0.5 - hpPercent) * 2);
                this.fillStyle = color;
                drawHpText(this, percentText, centerX, y + height + 9, color);
            }
            if (this.fillStyle === "#cc5151") {
                color = hpPercent > 0.5 ? lerpColor("#cc5151", "#e09f3e", (1 - hpPercent) * 2)
                                         : lerpColor("#e09f3e", "#a4cc4f", (0.5 - hpPercent) * 2);
                this.fillStyle = color;
                drawHpText(this, percentText, centerX, y + height + 9, color);
            }
            fill.call(this, x, y, width, height);
        };
    };

    const FillRect = CanvasRenderingContext2D.prototype.fillRect;
    CanvasRenderingContext2D.prototype.fillRect = enhanceFillRect(FillRect);

    const { fillText } = CanvasRenderingContext2D.prototype;
    CanvasRenderingContext2D.prototype.fillText = function (...args) {
        if (typeof args[0] === "string") {
            this.lineWidth = 8;
            this.strokeStyle = "#313131";
            this.strokeText.apply(this, args);
        }
        return fillText.apply(this, args);
    };

    const { strokeRect } = CanvasRenderingContext2D.prototype;
    CanvasRenderingContext2D.prototype.strokeRect = function(x, y, w, h) {
        if ((w === 40 && h === 40) || this.strokeStyle === "#bfbfbf" || this.strokeStyle === "#dedede") {
            return;
        }
        return strokeRect.call(this, x, y, w, h);
    };

    const { stroke } = CanvasRenderingContext2D.prototype;
    CanvasRenderingContext2D.prototype.stroke = function(...args) {
        if (this.strokeStyle === "#bfbfbf" || this.strokeStyle === "#dedede") {
            return;
        }
        return stroke.apply(this, args);
    };
// ---------------- Overlay ----------------
const overlay = document.createElement("canvas");
overlay.width = window.innerWidth;
overlay.height = window.innerHeight;
overlay.style.position = "absolute";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.pointerEvents = "none";
overlay.style.zIndex = "9999";
document.body.appendChild(overlay);
const octx = overlay.getContext("2d");
let frameCount = 0, fpsStartTime = performance.now(), fps=0, cps=0;
let lastFrameTime = performance.now(), ping='...';
// ---------------- Ping, FPS, CPS ----------------
setInterval(()=>{
    const now = performance.now();
    ping = Math.round(now - lastFrameTime);
    lastFrameTime = now;
}, 50);

document.addEventListener("mousedown", ()=>{
    cps++; setTimeout(()=>cps--,1000);
});

// ---------------- Server Info ----------------
let serverName = "Unknown";
function updateServerName() {
    const select = document.getElementById("server-select");
    if (select && select.options.length > 0) {
        serverName = select.options[select.selectedIndex].text;
    }
}
setInterval(updateServerName, 2000);
function loop(){
    const now = performance.now();
    frameCount++;
    if(now - fpsStartTime >= 1000){
        fps = frameCount;
        frameCount=0;
        fpsStartTime=now;
    }
    octx.clearRect(0,0,overlay.width,overlay.height);
    octx.save();
    octx.font = "20px 'Baloo Paaji'";
    octx.textBaseline = "top";
    octx.strokeStyle="#313131";
    octx.lineWidth=4;
    // SERVER
    octx.strokeText(`SERVER: ${serverName}`,10,5);
    octx.fillStyle="white";
    octx.fillText(`SERVER: ${serverName}`,10,5);

    // FPS
    octx.strokeText(`FPS: ${fps}`,10,30);
    octx.fillText(`FPS: ${fps}`,10,30);

    // CPS
    octx.strokeText(`CPS: ${cps}`,10,55);
    octx.fillText(`CPS: ${cps}`,10,55);

    // PING
    octx.strokeText(`PING: ${ping}ms`,10,80);
    octx.fillText(`PING: ${ping}ms`,10,80);

    octx.restore();
    requestAnimationFrame(loop);
}
loop();

window.addEventListener("resize", ()=>{
    overlay.width = window.innerWidth;
    overlay.height = window.innerHeight;
});
    // ---------------- Auto Toggle ----------------
    ['#grid-toggle','#native-friendly-indicator'].forEach(id=>{
        const el = document.querySelector(id); if(el) el.click();
    });

    // ---------------- Ad Remove ----------------
    const styleAdRemove = document.createElement('style');
    styleAdRemove.type = 'text/css';
    styleAdRemove.appendChild(document.createTextNode(`
        #cross-promo,#bottom-wrap,#google_play,#game-left-content-main,#game-bottom-content,#game-right-content-main,#left-content,#right-content{
            display:none !important;
        }
    `));
    document.head.appendChild(styleAdRemove);
    document.querySelector('#game-content').style.justifyContent='center';
    document.querySelector('#main-content').style.width='auto';
    // ---------------- Big Shop, Clan -------------------
(function() {
    var style = document.createElement("style");
    style.innerHTML = `
        /* --- SHOP  --- */
        #hat-menu {
            width: 500px !important;
            height: 790px !important;
            background: rgba(0,0,0,0) !important;
            opacity: 0.95 !important;
            border: 5px solid black !important;
            box-shadow: none !important;
        }
        #hat_menu_content {
            max-height: 780px !important;
            overflow-y: auto !important;
            background: transparent !important;
        }

        /* --- CLAN MENU  --- */
        #clan-menu {
            background: rgba(0,0,0,0) !important; /* trong suốt */
            opacity: 0.95 !important;
            border: 5px solid black !important;   /* vẫn giữ viền */
            box-shadow: none !important;
        }
        #clan_menu_content {
            background: transparent !important;
        }
    `;
    document.head.appendChild(style);
})();

// ================== Toggle ==================
let ghostModeEnabled = false;
let hitboxEnabled = true;
let hitboxPlayerEnabled = true;

document.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "f2") ghostModeEnabled = !ghostModeEnabled;
    if (e.key.toLowerCase() === "f4") hitboxEnabled = hitboxPlayerEnabled = !hitboxEnabled;
    console.log(`Ghost=${ghostModeEnabled} | Hitbox=${hitboxEnabled}`);
});

// ================== Keywords ==================
const excludedKeywords = ["player","cow","duck","wolf","shark","mammoth","gcow","dragon"];
const resourceKeywords = ["tree","rock","bush","cactus","ruby","wood","stone","gold","wall","spike","windmill","trap","boost","turret","heal_pad","platform","roof","bed","teleporter","lootbox","tornado","inv_","ice","cave_stone",];
// ================== OPTIMIZED CONFIGURATION ==================
const textures = {
   "https://sploop.io/img/entity/hat_1.png":"https://i.postimg.cc/pdHJbCC3/hat-1.png",
   "https://sploop.io/img/entity/hat_2.png":"https://i.postimg.cc/6QXfJczN/hat-2.png",
   "https://sploop.io/img/entity/hat_3.png":"https://i.postimg.cc/GpxJcDS0/hat-3.png",
   "https://sploop.io/img/entity/hat_4.png":"https://i.postimg.cc/SKf7y915/hat-4.png",
   "https://sploop.io/img/entity/hat_5.png":"https://i.postimg.cc/DzPd2GYT/hat-5.png",
   "https://sploop.io/img/entity/hat_6.png":"https://i.postimg.cc/tgNtX6mC/hat-6.png",
   "https://sploop.io/img/entity/hat_7.png":"https://i.postimg.cc/5tSqxzkX/hat-7.png",
   "https://sploop.io/img/entity/hat_8.png":"https://i.postimg.cc/HL94pMP7/hat-8.png",
   "https://sploop.io/img/entity/hat_9.png":"https://i.postimg.cc/3RLXGTTt/hat-9.png",
   "https://sploop.io/img/entity/hat_10.png":"https://i.postimg.cc/xCsvm22Z/hat-10.png",
   "https://sploop.io/img/entity/hat_11.png":"https://i.postimg.cc/hjCLmBBw/hat-11.png",
   "https://sploop.io/img/entity/hat_12.png":"https://i.postimg.cc/V67qt882/hat-12.png",
   "https://sploop.io/img/entity/hat_13.png":"https://i.postimg.cc/G2MFDCR0/hat-13.png",
   "https://sploop.io/img/entity/hat_14.png":"https://i.postimg.cc/Y9X6FH7M/hat-14.png",
   "https://sploop.io/img/entity/skid_hat.png":"https://i.postimg.cc/yY3mDtrG/skid-hat.png",
   "https://sploop.io/img/entity/stone_toolhammer.png":"https://i.postimg.cc/m21YPJ5x/stone-toolhammer.png",
   "https://sploop.io/img/items/g_toolhammer.png":"https://i.postimg.cc/k5mv3ssT/g-toolhammer.png",
   "https://sploop.io/img/items/d_toolhammer.png":"https://i.postimg.cc/L8f3bwt5/d-toolhammer.png",
   "https://sploop.io/img/items/r_toolhammer.png":"https://i.postimg.cc/MHN1smXQ/r-toolhammer.png",
   "https://sploop.io/img/entity/stone_sword.png":"https://i.postimg.cc/xTNvXh4S/stone-sword.png",
   "https://sploop.io/img/entity/g_sword.png":"https://i.postimg.cc/7Lkn899M/g-sword.png",
   "https://sploop.io/img/entity/d_sword.png":"https://i.postimg.cc/CxDsQXGh/d-sword.png",
   "https://sploop.io/img/entity/r_sword.png":"https://i.postimg.cc/vTk5PtDg/r-sword.png",
   "https://sploop.io/img/entity/katana.png":"https://i.postimg.cc/G2MFDCR1/katana.png",
   "https://sploop.io/img/items/g_katana.png":"https://i.postimg.cc/5tVSdggL/g-katana.png",
   "https://sploop.io/img/items/d_katana.png":"https://i.postimg.cc/wTnkFgmz/d-katana.png",
   "https://sploop.io/img/items/c_katana.png":"https://i.postimg.cc/j2LzQFqf/r-katana.png",
   "https://sploop.io/img/entity/stone_axe.png":"https://i.postimg.cc/3J0XkVbV/stone-axe.png",
   "https://sploop.io/img/items/g_axe.png":"https://i.postimg.cc/mgMy5JYt/g-axe.png",
   "https://sploop.io/img/items/d_axe.png":"https://i.postimg.cc/bNZTQsdx/d-axe.png",
   "https://sploop.io/img/items/r_axe.png":"https://i.postimg.cc/qRmsKTrM/r-axe.png",
   "https://sploop.io/img/entity/great_axe.png":"https://i.postimg.cc/pdHJbCCc/great-axe.png",
   "https://sploop.io/img/items/g_great_axe.png":"https://i.postimg.cc/pL8J64f8/g-great-axe.png",
   "https://sploop.io/img/items/d_great_axe.png":"https://i.postimg.cc/CLRNjzd9/d-great-axe.png",
   "https://sploop.io/img/items/r_great_axe.png":"https://i.postimg.cc/C5zjHQMB/r-great-axe.png",
   "https://sploop.io/img/entity/stone_spear.png":"https://i.postimg.cc/15VG82j1/stone-spear.png",
   "https://sploop.io/img/items/g_spear.png":"https://i.postimg.cc/zGWFc6Cd/g-spear.png",
   "https://sploop.io/img/items/d_spear.png":"https://i.postimg.cc/L6GVv214/d-spear.png",
   "https://sploop.io/img/items/r_spear.png":"https://i.postimg.cc/XqpwczNK/r-spear.png",
   "https://sploop.io/img/entity/cut_spear.png":"https://i.postimg.cc/hPXr9fhV/cut-spear.png",
   "https://sploop.io/img/items/g_cutspear.png":"https://i.postimg.cc/JzJ52vNk/g-cutspear.png",
   "https://sploop.io/img/items/d_cutspear.png":"https://i.postimg.cc/fTVKxJkF/d-cutspear.png",
   "https://sploop.io/img/items/r_cutspear.png":"https://i.postimg.cc/PJPmzRfx/r-cutspear.png",
   "https://sploop.io/img/entity/stick.png":"https://i.postimg.cc/SNY6n3tt/stick.png",
   "https://sploop.io/img/items/g_stick.png":"https://i.postimg.cc/43gQkPPp/g-stick.png",
   "https://sploop.io/img/items/d_stick.png":"https://i.postimg.cc/Pr0MKTwN/d-stick.png",
   "https://sploop.io/img/items/r_stick.png":"https://i.postimg.cc/yxkFXb6X/r-stick.png",
   "https://sploop.io/img/items/bat.png":"https://i.postimg.cc/hPXr9fh7/bat.png",
   "https://sploop.io/img/entity/g_bat.png":"https://i.postimg.cc/136rj2GN/g-bat.png",
   "https://sploop.io/img/entity/d_bat.png":"https://i.postimg.cc/tCs5hY7M/d-bat.png",
   "https://sploop.io/img/entity/r_bat.png":"https://i.postimg.cc/qRmsKTrv/r-bat.png",
   "https://sploop.io/img/entity/s_dagger.png":"https://i.postimg.cc/J7234MKK/s-dagger.png",
   "https://sploop.io/img/items/g_dagger.png":"https://i.postimg.cc/BnDBVkTF/g-dagger.png",
   "https://sploop.io/img/items/d_dagger.png":"https://i.postimg.cc/ZKWcrC02/d-dagger.png",
   "https://sploop.io/img/items/r_dagger.png":"https://i.postimg.cc/tJYhtMR4/r-dagger.png",
   "https://sploop.io/img/entity/s_healing_staff.png":"https://i.postimg.cc/Kv3P1wsP/s-healing-staff.png",
   "https://sploop.io/img/items/g_healing_staff.png":"https://i.postimg.cc/FHcVB8yG/g-healing-staff.png",
   "https://sploop.io/img/items/d_healing_staff.png":"https://i.postimg.cc/gk1K4mZY/d-healing-staff.png",
   "https://sploop.io/img/items/r_healing_staff.png":"https://i.postimg.cc/rsKSCPyt/r-healing-staff.png",
   "https://sploop.io/img/entity/hammer.png":"https://i.postimg.cc/5tVSdggR/hammer.png",
   "https://sploop.io/img/entity/g_hammer.png":"https://i.postimg.cc/BnDBVkTg/g-hammer.png",
   "https://sploop.io/img/entity/d_hammer.png":"https://i.postimg.cc/QxvqShWP/d-hammer.png",
   "https://sploop.io/img/entity/r_hammer.png":"https://i.postimg.cc/kGBxFpMV/r-hammer.png",
   "https://sploop.io/img/entity/shield.png":"https://i.postimg.cc/8PfR79ny/shield.png",
   "https://sploop.io/img/entity/s_musket.png":"https://i.postimg.cc/wxG5TgFf/s-musket.png",
   "https://sploop.io/img/entity/bow.png":"https://i.postimg.cc/5NX3w6jC/bow.png",
   "https://sploop.io/img/entity/Xbow.png":"https://i.postimg.cc/FskyY8B4/Xbow.png",
   "https://sploop.io/img/items/scythe.png":"https://i.postimg.cc/tCn3swmN/scythe.png",
   "https://sploop.io/img/items/meme.png":"https://i.postimg.cc/B6hTF033/meme.png",
   "https://sploop.io/img/items/pearl.png":"https://i.postimg.cc/63HrZXKB/pearl.png",
};
const imageRadii = new Map([
    ["tree.png", 90], ["cherry_tree.png", 90], ["palm_tree.png", 90],
    ["wood_farm.png", 80], ["wood_farm_cherry.png", 80],
    ["rock.png", 75], ["stone_farm.png", 75],
    ["bush.png", 50], ["berry_farm.png", 50], ["cactus.png", 50],
    ["gold.png", 76], ["ruby.png", 100], ["tornado.png", 220],
    ["cave_stone0.png", 92], ["cave_stone1.png", 92], ["cave_stone2.png", 58],
    ["fireball.png", 100], ["ice0.png", 92], ["ice1.png", 20], ["chest.png", 40],
    ["wall.png", 45], ["castle_wall.png", 59], ["spike.png", 45],
    ["hard_spike.png", 45], ["ice_spike.png", 45], ["castle_spike.png", 45],
    ["windmill_base.png", 45], ["trap.png", 40], ["boost.png", 40],
    ["turret_base.png", 45], ["heal_pad.png", 50], ["platform.png", 60],
    ["roof.png", 50], ["bed.png", 50], ["teleporter.png", 35], ["lootbox.png", 40],
    ["wolf.png", 50], ["duck.png", 20], ["cow.png", 90], ["shark.png", 90],
    ["mammoth_body.png", 90], ["dragon_2_body.png", 100], ["gcow.png", 90]
]);
const skinFragments = new Set([
    'body0.png','body1.png','body2.png','body3.png','body4.png','body5.png','body6.png','body7.png','body8.png','body9.png','body10.png','body11.png','body12.png','body13.png','body14.png','body15.png',
    'body16.png','body17.png','body18.png','body19.png','body20.png','body21.png','body22.png','body23.png','body24.png','body25.png','body26.png','body27.png','body28.png','body29.png','body30.png',
    'body31.png','body32.png','body33.png','body34.png','body35.png','body36.png','body37.png','body38.png','body39.png','body40.png','body41.png','body42.png','body43.png','body44.png','45body.png',
    'body46.png','body47.png','body48.png','body49.png','body50.png','body51.png','body52.png','body53.png','body54.png','body55.png','body56.png','body57.png','body58.png','body59.png','body60.png',
    'body61.png','body62.png','body63.png','body64.png','body65.png','body66.png','body67.png','body68.png','body69.png','body70.png','body71.png','body72.png','body73.png','body74.png','body75.png',
    'body76.png','body77.png','78body.png','body79.png','body80.png','body81.png','body82.png','body83.png','body84.png','body85.png','body86.png','body87.png','body88.png','body89.png','body90.png',
    'body91.png','body92.png','body93.png','body94.png','body95.png','body96.png','body97.png','body98.png','body99.png','body100.png','body101.png','body102.png','body103.png','body104.png','body105.png'
]);
const resourceKeywordsList = ["tree","rock","bush","cactus","ruby","wood","stone","gold","wall","spike","windmill","trap","boost","turret","heal_pad","platform","roof","bed","teleporter","lootbox","tornado","inv_","ice","cave_stone"];
const circlesToDraw = [];
    // ================== OPTIMIZED HOOK ==================
const origDrawImage = CanvasRenderingContext2D.prototype.drawImage;
const replacementCache = new Map();

CanvasRenderingContext2D.prototype.drawImage = function(img, ...rest) {
    if (!img || !img.src) {
        return origDrawImage.apply(this, arguments);
    }
    if (img._isProcessed === undefined) {
        img._isProcessed = true;
        const src = img.src;
        img._replacement = null;
        for (const key in textures) {
            if (src.includes(key)) {
                if (!replacementCache.has(key)) {
                    const newImg = new Image();
                    newImg.src = textures[key];
                    replacementCache.set(key, newImg);
                }
                img._replacement = replacementCache.get(key);
                break;
            }
        }
        img._radius = 0;
        for (const [key, radius] of imageRadii) {
            if (src.includes(key)) {
                img._radius = radius;
                break;
            }
        }
        img._isGhostRes = resourceKeywordsList.some(k => src.includes(k));
        const fileName = src.substring(src.lastIndexOf('/') + 1).split('?')[0];
        img._isPlayer = skinFragments.has(fileName);
    }
    const drawImg = (img._replacement && img._replacement.complete) ? img._replacement : img;
    const shouldGhost = ghostModeEnabled && img._isGhostRes;

    if (shouldGhost) {
        this.save();
        this.globalAlpha = 0.3;
    }

    origDrawImage.call(this, drawImg, ...rest);

    if (shouldGhost) {
        this.restore();
    }
// ---------------- Hitbox Resource Logic (Bản Fix Hoàn Thiện) ----------------
    if (hitboxEnabled && img._radius > 0 && rest.length >= 4) {
        const [x, y, w, h] = rest;
        const mh = this.canvas.height;
        const mw = this.canvas.width;
        const src = img.src;

        // 1. Nhận diện vật thể thật ngoài Map (Entity)
        // Dựa trên danh sách bạn gửi: Vật thể thật nằm ở /entity/ và không chứa 'inv_'
        const isWorldEntity = src.includes('/entity/') && !src.includes('inv_');

        // 2. Xác định vùng giao diện (UI Zones) dùng % để tự thích ứng khi zoom
        // Chặn vùng trung tâm phía trên (Choose item) và phía dưới (Hotbar)
        const isHotbarZone = y > (mh * 0.8) && x > (mw * 0.25) && x < (mw * 0.75);
        const isChooseZone = y < (mh * 0.2) && x > (mw * 0.2) && x < (mw * 0.8);

        // 3. LOGIC CHẶN:
        // CHỈ chặn nếu: (Nằm trong vùng UI) VÀ (KHÔNG PHẢI là vật thể thật ngoài map)
        const shouldHideHitbox = (isHotbarZone || isChooseZone) && !isWorldEntity;

        if (this.canvas.id === "game-canvas" && !shouldHideHitbox) {
            this.beginPath();
            this.arc(x + w / 2, y + h / 2, img._radius, 0, 2 * Math.PI);
            this.lineWidth = 2;
            this.strokeStyle = "#ff0000";
            this.stroke();
        }
    }
    if (img._isPlayer && hitboxPlayerEnabled && rest.length >= 2) {
        if (this.canvas.id === "game-canvas") {
            const [x, y, w, h] = rest;
            circlesToDraw.push({
                x, y, width: w, height: h,
                transform: this.getTransform()
            });
        }
    }
};
const circleColor = '#ff0000';
const circleLineWidth = 2;
const playerRadius = 35;
let overlayCanvas, overlayCtx, gameCanvas;
function initOverlay() {
    gameCanvas = document.getElementById('game-canvas');
    if (!gameCanvas) return setTimeout(initOverlay, 500);
    overlayCanvas = document.createElement('canvas');
    overlayCanvas.style.cssText = "position:absolute; pointer-events:none; z-index:999999; top:0; left:0;";
    document.body.appendChild(overlayCanvas);
    overlayCtx = overlayCanvas.getContext('2d');
    const syncCanvasSize = () => {
        const rect = gameCanvas.getBoundingClientRect();
        overlayCanvas.width = rect.width;
        overlayCanvas.height = rect.height;
        overlayCanvas.style.left = rect.left + 'px';
        overlayCanvas.style.top = rect.top + 'px';
    };
    syncCanvasSize();
    new ResizeObserver(syncCanvasSize).observe(gameCanvas);
    window.addEventListener('resize', syncCanvasSize);

    function loop() {
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        if (hitboxPlayerEnabled && circlesToDraw.length > 0) {
            overlayCtx.lineWidth = circleLineWidth;
            overlayCtx.strokeStyle = circleColor;
            for (let i = 0; i < circlesToDraw.length; i++) {
                const c = circlesToDraw[i];
                overlayCtx.save();
                overlayCtx.setTransform(c.transform);
                overlayCtx.beginPath();
                overlayCtx.arc(c.x + c.width / 2, c.y + c.height / 2, playerRadius, 0, 2 * Math.PI);
                overlayCtx.stroke();
                overlayCtx.restore();
            }
        }
        circlesToDraw.length = 0;
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}
initOverlay();
})();