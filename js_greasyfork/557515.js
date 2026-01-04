// ==UserScript==
// @name         Bubleroyal – Pepe96 Winter Pack
// @namespace    Pepe96
// @version      1.3
// @description  Zimowa edycja: błękitne miny, zimowe GUI, prezent zamiast monety, makro QASD+16, świąteczne boty (nicki + skiny)
// @author       Pepe96
// @match        *://bubleroyal.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557515/Bubleroyal%20%E2%80%93%20Pepe96%20Winter%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/557515/Bubleroyal%20%E2%80%93%20Pepe96%20Winter%20Pack.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Zabezpieczenie przed podwójnym odpaleniem
    if (window.__brMainWinterScriptLoaded) return;
    window.__brMainWinterScriptLoaded = true;

    /****************************************************************
     * 1. BŁĘKITNE MINY Z POŚWIATĄ (~50% przezroczystości środka)
     ****************************************************************/

    let ctxProto = null;
    try {
        ctxProto = CanvasRenderingContext2D.prototype;
    } catch (e) {
        ctxProto = null;
    }

    if (ctxProto && !ctxProto.__winterMinesPatched) {
        ctxProto.__winterMinesPatched = true;

        const oFill   = ctxProto.fill;
        const oStroke = ctxProto.stroke;
        const oArc    = ctxProto.arc;

        const MINE_COLOR_HEX = '#00b7ff';
        const MINE_FILL_RGBA = 'rgba(0,183,255,0.5)'; // 50% alpha

        function isBrightGreen(fs) {
            if (typeof fs !== 'string') return false;
            fs = fs.trim().toLowerCase();

            if (fs === '#00ff00' || fs === '#0f0') return true;

            if (fs[0] === '#' && (fs.length === 7 || fs.length === 4)) {
                let r = 0, g = 0, b = 0;
                if (fs.length === 7) {
                    r = parseInt(fs.slice(1, 3), 16);
                    g = parseInt(fs.slice(3, 5), 16);
                    b = parseInt(fs.slice(5, 7), 16);
                } else {
                    r = parseInt(fs[1] + fs[1], 16);
                    g = parseInt(fs[2] + fs[2], 16);
                    b = parseInt(fs[3] + fs[3], 16);
                }
                return (g >= 160 && r <= 120 && b <= 120);
            }

            if (fs.startsWith('rgb')) {
                const nums = fs
                    .replace(/[rgba()]/g, '')
                    .split(',')
                    .map(v => parseInt(v.trim(), 10))
                    .filter(v => !isNaN(v));
                if (nums.length < 3) return false;
                const [r, g, b] = nums;
                return (g >= 160 && r <= 120 && b <= 120);
            }

            return false;
        }

        function isMineStyle(ctx) {
            try {
                return (ctx.lineJoin === 'miter' && ctx.lineWidth >= 3);
            } catch (e) {
                return false;
            }
        }

        ctxProto.arc = function (x, y, r, startAngle, endAngle, anticlockwise) {
            this.__lastArcR = r;
            return oArc.call(this, x, y, r, startAngle, endAngle, anticlockwise);
        };

        ctxProto.fill = function (...args) {
            try {
                if (isBrightGreen(this.fillStyle) && isMineStyle(this)) {
                    const oldFill  = this.fillStyle;
                    const oldBlur  = this.shadowBlur;
                    const oldColor = this.shadowColor;

                    this.shadowBlur  = 18;
                    this.shadowColor = 'rgba(0,183,255,0.7)';
                    this.fillStyle   = MINE_FILL_RGBA;

                    oFill.apply(this, args);

                    this.fillStyle   = oldFill;
                    this.shadowBlur  = oldBlur;
                    this.shadowColor = oldColor;
                    return;
                }
            } catch (e) {}
            return oFill.apply(this, args);
        };

        ctxProto.stroke = function (...args) {
            try {
                if (isBrightGreen(this.strokeStyle) && isMineStyle(this)) {
                    const oldStroke = this.strokeStyle;
                    const oldBlur   = this.shadowBlur;
                    const oldColor  = this.shadowColor;

                    this.shadowBlur  = 20;
                    this.shadowColor = 'rgba(0,183,255,0.8)';
                    this.strokeStyle = MINE_COLOR_HEX;

                    oStroke.apply(this, args);

                    this.strokeStyle = oldStroke;
                    this.shadowBlur  = oldBlur;
                    this.shadowColor = oldColor;
                    return;
                }
            } catch (e) {}
            return oStroke.apply(this, args);
        };
    }

    /****************************************************************
     * 2. ZIMOWE GUI (PLAY, LV-ŚNIEŻKA, EXP, RAMKA LOBBY BEZ BIAŁEJ KRESKI)
     ****************************************************************/

    // 🔗 TU WSTAW SWÓJ LINK DO PNG MIKOŁAJA (opcjonalnie, z przezroczystym tłem)
    const SANTA_URL = 'https://example.com/twoj_mikolaj.png';

    function injectGUIStyles() {
        if (document.getElementById('br-winter-ui-style')) return;

        const css = `
            /* 🔹 PLAY — delikatne błękitne podświetlenie */
            #playBtn {
                position: relative !important;
                background: radial-gradient(circle at 30% 20%, #7ee0ff 0%, #2bbcff 40%, #1594ff 100%) !important;
                border-radius: 16px !important;
                border: 2px solid rgba(255,255,255,0.85) !important;
                box-shadow:
                    0 0 6px rgba(0,180,255,0.6),
                    0 0 14px rgba(0,210,255,0.45) !important;
                overflow: hidden;
            }
            #playBtn::after {
                content: 'PLAY';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #ffffff;
                font-weight: 900;
                font-family: Arial, sans-serif;
                letter-spacing: 1px;
                text-shadow:
                    0 0 3px rgba(0,0,0,0.9),
                    0 0 8px rgba(0,0,0,0.7);
                pointer-events: none;
            }

            /* 🔹 LEVEL – śnieżka ❄️ */
            #level {
                background-image: none !important;
                background: radial-gradient(
                    circle at 30% 30%,
                    #ffffff 0%,
                    #f3fbff 32%,
                    #cae9ff 60%,
                    #78c5ff 100%
                ) !important;
                border-radius: 50% !important;
                border: 2px solid rgba(255,255,255,0.9) !important;
                box-shadow:
                    0 0 6px rgba(150,215,255,0.8),
                    0 0 16px rgba(80,180,255,0.55) !important;
                color: #004c73 !important;
                text-shadow: 0 0 3px rgba(255,255,255,0.9) !important;
                font-weight: 900 !important;
            }

            /* 🔹 Morski / teal pasek EXP */
            .progress-bar.progress-bar-striped {
                background-color: #00c8ff !important;
                background-image: linear-gradient(
                    45deg,
                    rgba(255,255,255,0.28) 25%,
                    transparent 25%,
                    transparent 50%,
                    rgba(255,255,255,0.28) 50%,
                    rgba(255,255,255,0.28) 75%,
                    transparent 75%,
                    transparent
                ) !important;
                box-shadow:
                    0 0 6px rgba(0,200,255,0.65),
                    inset 0 0 4px rgba(0,120,200,0.5) !important;
            }

            /* ❄️ Ulepszona zimowa ramka lobby – #helloDialog (bez białej kreski) */
            #helloDialog {
                position: relative !important;
                border-radius: 28px !important;
                padding: 26px 30px 32px 30px !important;
                background:
                    radial-gradient(circle at top, rgba(255,255,255,0.04) 0%, transparent 55%),
                    radial-gradient(circle at bottom, rgba(0,180,255,0.10) 0%, transparent 60%),
                    linear-gradient(180deg, #222a37 0%, #111724 55%, #070a11 100%) !important;
                box-shadow:
                    0 0 30px rgba(0,0,0,0.95),
                    0 0 34px rgba(120,190,255,0.35),
                    inset 0 0 22px rgba(140,210,255,0.20) !important;
                border: 2px solid rgba(120,170,220,0.85) !important;
                outline: none !important;
                overflow: visible !important;
            }

            /* 🚫 całkowite wyłączenie oryginalnego/topowego odbłysku / kreski */
            #helloDialog::before {
                content: none !important;
                display: none !important;
            }

            /* delikatna wewnętrzna poświata (bez pasków) */
            #helloDialog::after {
                content: "";
                position: absolute;
                inset: 8px;
                border-radius: 21px;
                box-shadow: inset 0 0 18px rgba(160,210,255,0.25);
                pointer-events: none;
            }

            /* 🎅 Mikołaj w prawym górnym rogu panelu (opcjonalnie) */
            #helloDialog .br-santa {
                position: absolute;
                top: -32px;
                right: -32px;
                width: 82px;
                height: 82px;
                background-image: url('${SANTA_URL}');
                background-size: contain;
                background-repeat: no-repeat;
                pointer-events: none;
                filter:
                    drop-shadow(0 0 4px rgba(0,0,0,0.8))
                    drop-shadow(0 0 8px rgba(255,255,255,0.6));
            }
        `;

        const style = document.createElement('style');
        style.id = 'br-winter-ui-style';
        style.textContent = css;
        document.head.appendChild(style);

        const hello = document.getElementById('helloDialog');
        if (hello && !hello.querySelector('.br-santa')) {
            const santa = document.createElement('div');
            santa.className = 'br-santa';
            hello.appendChild(santa);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectGUIStyles);
    } else {
        injectGUIStyles();
    }

    /****************************************************************
     * 3. ŚWIĄTECZNA MONETA 9999 + ŚWIĄTECZNE SKINY BOTÓW
     ****************************************************************/

    // fragment adresu ORYGINALNEJ monety
    const COIN_PART = "/skins/9999.png";

    // Twój nowy skin prezentu (okrągły z niebieskim tłem)
    const PRESENT_URL =
        "https://media.discordapp.net/attachments/816260655061532683/1444799813085433978/ba51e637-fbf6-48e6-a2e8-2beae52630fb.png?ex=692e062e&is=692cb4ae&hm=c519638e7339d8e046ab6a9ab632bb2352426f1b5229fa803e99652b763f7cbf&=&format=webp&quality=lossless&width=508&height=508";

    // MAPA SKINÓW BOTÓW
    var SKIN_MAP = [
        {
            match: 'minions.png', // Natura / Minions
            newUrl: 'https://media.discordapp.net/attachments/816260655061532683/1444938476163305572/9e22f5de-c758-4e24-897d-5ee27c219cce.png?ex=692e8752&is=692d35d2&hm=f4a7d4a246fd70ac29785299962fb9ff26a1dd31f2e039bbe280be81bd55973c&=&format=webp&quality=lossless&width=508&height=508'
        },
        {
            match: 'tuna.png', // Tuna → Bałwan
            newUrl: 'https://media.discordapp.net/attachments/816260655061532683/1444938476163305572/9e22f5de-c758-4e24-897d-5ee27c219cce.png?ex=692e8752&is=692d35d2&hm=f4a7d4a246fd70ac29785299962fb9ff26a1dd31f2e039bbe280be81bd55973c&=&format=webp&quality=lossless&width=508&height=508'
        },
        {
            match: 'pizza-bot.png', // Pizza-BOT → Mikołaj
            newUrl: 'https://media.discordapp.net/attachments/816260655061532683/1444807640952733867/1c3cace6-1c1b-4c22-b761-a7473c8d6566.png?ex=692e0d78&is=692cbbf8&hm=5b662b9013ccff36935716ee7162096321614b1c9e3781827addcbe46186e631&=&format=webp&quality=lossless&width=930&height=930'
        },
        {
            match: 'ufo.png', // UFO → Mikołaj
            newUrl: 'https://media.discordapp.net/attachments/816260655061532683/1444807640952733867/1c3cace6-1c1b-4c22-b761-a7473c8d6566.png?ex=692e0d78&is=692cbbf8&hm=5b662b9013ccff36935716ee7162096321614b1c9e3781827addcbe46186e631&=&format=webp&quality=lossless&width=930&height=930'
        },
        {
            match: 'buble.png', // Buble → Renifer
            newUrl: 'https://media.discordapp.net/attachments/816260655061532683/1444953593223315578/b63753cd-d590-44ae-9a33-92754e4e4a09.png?ex=692e9566&is=692d43e6&hm=0e053a24a26d73a7cc9ee23e84a8213577690f17e317576797d4b70cd999ab1f&=&format=webp&quality=lossless&width=930&height=930'
        },
        {
            match: 'fish.png', // Fish → Choinka
            newUrl: 'https://media.discordapp.net/attachments/816260655061532683/1444964295338233896/bbfa70be-5f26-47e2-b205-25f033093347.png?ex=692e9f5e&is=692d4dde&hm=fb6d27f0d9c087d5b0e9fd4c77f57e953cfa8997e0740538f5b9589c3476e78b&=&format=webp&quality=lossless&width=508&height=508'
        },
        {
            match: 'alien.png', // Alien → Choinka
            newUrl: 'https://media.discordapp.net/attachments/816260655061532683/1444964295338233896/bbfa70be-5f26-47e2-b205-25f033093347.png?ex=692e9f5e&is=692d4dde&hm=fb6d27f0d9c087d5b0e9fd4c77f57e953cfa8997e0740538f5b9589c3476e78b&=&format=webp&quality=lossless&width=508&height=508'
        },
        {
            match: 'pink.png', // Pink → Grinch
            newUrl: 'https://media.discordapp.net/attachments/816260655061532683/1444969919656759316/6143ea9d-e14d-4f60-a69c-271c0cdcfaa6.png?ex=692ea49b&is=692d531b&hm=f7ebdd9697c13394e9f447d48e441e99b58e9fd1fff6e22457bfb9ca19bde4ff&=&format=webp&quality=lossless&width=508&height=508'
        },
        {
            match: 'lion.png', // Lion → Grinch
            newUrl: 'https://media.discordapp.net/attachments/816260655061532683/1444969919656759316/6143ea9d-e14d-4f60-a69c-271c0cdcfaa6.png?ex=692ea49b&is=692d531b&hm=f7ebdd9697c13394e9f447d48e441e99b58e9fd1fff6e22457bfb9ca19bde4ff&=&format=webp&quality=lossless&width=508&height=508'
        }
    ];

    function remapSkin(url) {
        if (!url || typeof url !== 'string') return url;
        for (var i = 0; i < SKIN_MAP.length; i++) {
            if (url.indexOf(SKIN_MAP[i].match) !== -1) {
                return SKIN_MAP[i].newUrl;
            }
        }
        return url;
    }

    function applyImageReplacements(value) {
        if (typeof value !== 'string') return value;

        // moneta 9999 → prezent
        if (value.indexOf(COIN_PART) !== -1) {
            value = PRESENT_URL;
        }

        // skiny botów
        value = remapSkin(value);

        return value;
    }

    if (!window.__brImageReplacementsPatched) {
        window.__brImageReplacementsPatched = true;

        try {
            var imgProto = HTMLImageElement.prototype;
            var srcDesc = Object.getOwnPropertyDescriptor(imgProto, 'src');

            if (srcDesc && srcDesc.configurable && srcDesc.set && srcDesc.get) {
                Object.defineProperty(imgProto, 'src', {
                    configurable: true,
                    enumerable: srcDesc.enumerable,
                    get: function () {
                        return srcDesc.get.call(this);
                    },
                    set: function (value) {
                        var newVal = applyImageReplacements(value);
                        return srcDesc.set.call(this, newVal);
                    }
                });
            }
        } catch (e) {
            console.warn('Image src remap error:', e);
        }

        // globalne setAttribute – żeby złapać też inne przypadki ustawiania src
        try {
            var origSetAttr = Element.prototype.setAttribute;
            Element.prototype.setAttribute = function (name, value) {
                if (name === 'src') {
                    value = applyImageReplacements(value);
                }
                return origSetAttr.call(this, name, value);
            };
        } catch (e) {
            console.warn('setAttribute remap error:', e);
        }
    }

    /****************************************************************
     * 4. ŚWIĄTECZNE BOTY – NICKI + CANVAS + TOPKA
     ****************************************************************/

    // MAPA NICKÓW BOTÓW
    var BOT_MAP = [
        { oldNicks: ['Natura', 'Minions', 'Tuna'], newNick: 'Bałwan' },
        { oldNicks: ['Pizza-BOT', 'UFO'],          newNick: 'Mikołaj' },
        { oldNicks: ['Buble'],                     newNick: 'Renifer' },
        { oldNicks: ['Fish', 'Alien'],             newNick: 'Choinka' },
        { oldNicks: ['Pink', 'Lion'],              newNick: 'Grinch' }
    ];

    function getNewNickFor(text) {
        if (typeof text !== 'string') return null;
        for (var i = 0; i < BOT_MAP.length; i++) {
            var map = BOT_MAP[i];
            for (var j = 0; j < map.oldNicks.length; j++) {
                if (text.indexOf(map.oldNicks[j]) !== -1) {
                    return map.newNick;
                }
            }
        }
        return null;
    }

    function replaceNickInString(text) {
        if (typeof text !== 'string') return text;
        for (var i = 0; i < BOT_MAP.length; i++) {
            var map = BOT_MAP[i];
            for (var j = 0; j < map.oldNicks.length; j++) {
                var oldNick = map.oldNicks[j];
                if (text.indexOf(oldNick) !== -1) {
                    text = text.split(oldNick).join(map.newNick);
                }
            }
        }
        return text;
    }

    // CANVAS: nicki nad kulą + brak obramowania dla botów
    (function patchCanvasText() {
        if (!CanvasRenderingContext2D) return;
        var proto = CanvasRenderingContext2D.prototype;
        if (proto.__winterBotsTextPatched) return;
        proto.__winterBotsTextPatched = true;

        var origFillText   = proto.fillText;
        var origStrokeText = proto.strokeText;

        // zmniejszamy font TYLKO dla dużych napisów (nad kulką)
        function shrinkFontForBotsIfBig(ctx, newText) {
            var f = ctx.font;
            if (!f) return null;

            var match = f.match(/(\d+(\.\d+)?)px/);
            if (!match) return null;

            var size = parseFloat(match[1]);

            // małe fonty (TOP 10 itp.) zostawiamy bez zmian
            if (size < 25) {
                return null;
            }

            var factor = 0.70; // domyślnie (Bałwan)

            if (typeof newText === 'string') {
                // najdłuższy nick – najmniejszy font
                if (newText.indexOf('Choinka') !== -1) {
                    factor = 0.50; // jeszcze mniejsze, żeby wszędzie zmieściło się "a"
                }
                // średnie długości
                if (newText.indexOf('Mikołaj') !== -1 ||
                    newText.indexOf('Renifer') !== -1 ||
                    newText.indexOf('Grinch')  !== -1) {
                    factor = 0.60;
                }
            }

            var newSize = size * factor;
            var newFont = f.replace(/(\d+(\.\d+)?)px/, newSize.toFixed(1) + 'px');

            var oldFont = f;
            ctx.font = newFont;
            return oldFont;
        }

        proto.fillText = function (text, x, y, maxWidth) {
            var replaced = replaceNickInString(text);
            var botNick  = getNewNickFor(text); // sprawdzamy po starym nicku

            if (botNick) {
                var oldFont = shrinkFontForBotsIfBig(this, replaced);
                var res;
                if (typeof maxWidth === 'number') {
                    res = origFillText.call(this, replaced, x, y, maxWidth);
                } else {
                    res = origFillText.call(this, replaced, x, y);
                }
                if (oldFont) this.font = oldFont;
                return res;
            }

            return origFillText.call(this, replaced, x, y, maxWidth);
        };

        proto.strokeText = function (text, x, y, maxWidth) {
            // dla naszych botów nie rysujemy obramowania
            if (getNewNickFor(text)) return;
            var replaced = replaceNickInString(text);
            if (typeof maxWidth === 'number') {
                return origStrokeText.call(this, replaced, x, y, maxWidth);
            } else {
                return origStrokeText.call(this, replaced, x, y);
            }
        };
    })();

    // TOPKA + cała strona – podmiana nicków w HTML
    (function patchDOMText() {
        function replaceTextInNode(node) {
            if (!node) return;

            if (node.nodeType === 3) { // TEXT_NODE
                var val    = node.nodeValue;
                var newVal = replaceNickInString(val);
                if (newVal !== val) node.nodeValue = newVal;
            } else if (node.nodeType === 1) { // ELEMENT_NODE
                var c = node.firstChild;
                while (c) {
                    replaceTextInNode(c);
                    c = c.nextSibling;
                }
            }
        }

        function scanWholePage() {
            if (document.body) replaceTextInNode(document.body);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', scanWholePage);
        } else {
            scanWholePage();
        }

        var textObserver = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var m = mutations[i];
                if (m.addedNodes) {
                    for (var j = 0; j < m.addedNodes.length; j++) {
                        replaceTextInNode(m.addedNodes[j]);
                    }
                }
                if (m.type === 'characterData') {
                    replaceTextInNode(m.target);
                }
            }
        });

        textObserver.observe(document.documentElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
    })();

    /****************************************************************
     * 5. Bubble.am/Bubleroyal MACRO – QASD + 16split + 1–4 split
     ****************************************************************/

    (function setupMacro() {
        if (window.hasRunBubbleMacro) return;
        window.hasRunBubbleMacro = true;

        let splitSwitch = false;
        const keys = { q: false, a: false, s: false, d: false };

        function split(times) {
            for (let i = 0; i < times; i++) {
                setTimeout(() => {
                    // używa globalnego jQuery z gry – w momencie użycia jest już załadowane
                    $("body").trigger($.Event("keydown", { keyCode: 32 }));
                    $("body").trigger($.Event("keyup", { keyCode: 32 }));
                }, 80 * i);
            }
        }

        function goToAbsolute(x, y) {
            const width = window.innerWidth;
            const height = window.innerHeight;
            $("canvas").trigger($.Event("mousemove", {
                clientX: width * x,
                clientY: height * y
            }));
        }

        function keydown(e) {
            if (!e.key) return;

            // 🔒 Zabezpieczenie: nie przeszkadzaj w inputach
            if (
                document.activeElement &&
                (
                    document.activeElement.tagName === "INPUT" ||
                    document.activeElement.tagName === "TEXTAREA" ||
                    (typeof document.activeElement.isContentEditable === "boolean" && document.activeElement.isContentEditable)
                )
            ) return;

            const key = e.key.toLowerCase();
            if (keys.hasOwnProperty(key)) keys[key] = true;

            switch (key) {
                case "shift":
                    if (!splitSwitch) {
                        splitSwitch = true;
                        split(6); // 16-split
                    }
                    break;
                case "1": split(1); break;
                case "2": split(2); break;
                case "3": split(3); break;
                case "4": split(4); break;
            }

            if (key === "q") goToAbsolute(0.5, 0.3); // ↑
            if (key === "a") goToAbsolute(0.3, 0.5); // ←
            if (key === "s") goToAbsolute(0.5, 0.7); // ↓
            if (key === "d") goToAbsolute(0.7, 0.5); // →

            if (keys["q"] && keys["a"]) goToAbsolute(0.3, 0.3); // ↖
            if (keys["q"] && keys["d"]) goToAbsolute(0.7, 0.3); // ↗
            if (keys["s"] && keys["a"]) goToAbsolute(0.3, 0.7); // ↙
            if (keys["s"] && keys["d"]) goToAbsolute(0.7, 0.7); // ↘
        }

        function keyup(e) {
            if (!e.key) return;
            const key = e.key.toLowerCase();
            if (keys.hasOwnProperty(key)) keys[key] = false;

            if (key === "shift") {
                splitSwitch = false;
            }
        }

        document.addEventListener("keydown", keydown);
        document.addEventListener("keyup", keyup);

        console.log("✅ Bubleroyal winter macro + świąteczne boty loaded");
    })();

})();
