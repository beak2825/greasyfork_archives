// ==UserScript==
// @name         Bubleroyal – Pepe96 Winter Pack 
// @namespace    Pepe96
// @version      1.6
// @description  Zimowa edycja (miny, GUI, prezent, boty, macro) + kolor czatu (K) + lokalna zmiana nicku (N) + 1 custom skin po numerze (O)
// @author       Pepe96
// @match        *://bubleroyal.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558442/Bubleroyal%20%E2%80%93%20Pepe96%20Winter%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/558442/Bubleroyal%20%E2%80%93%20Pepe96%20Winter%20Pack.meta.js
// ==/UserScript==

/****************************************************************
 * 1. WINTER PACK (miny, GUI, prezent, boty, macro)
 ****************************************************************/
(function () {
    'use strict';

    // Zabezpieczenie przed podwójnym odpaleniem Winter Packa
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

            /* 🚫 całkowite wyłączenie oryginalnego odbłysku / kreski */
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

    const COIN_PART = "/skins/9999.png";

    // 🔔 NOWY PREZENT – Twój link
    const PRESENT_URL =
        "https://media.discordapp.net/attachments/816260655061532683/1444799813085433978/ba51e637-fbf6-48e6-a2e8-2beae52630fb.png?ex=69393aee&is=6937e96e&hm=f7138357e9e35cf2e62f21ec508f0d9960cdaf1370bf200b452cd8889388469b&=&format=webp&quality=lossless&width=779&height=779";

    var SKIN_MAP = [
        {
            match: 'minions.png',
            newUrl: 'https://media.discordapp.net/attachments/816260655061532683/1444938476163305572/9e22f5de-c758-4e24-897d-5ee27c219cce.png?ex=692e8752&is=692d35d2&hm=f4a7d4a246fd70ac29785299962fb9ff26a1dd31f2e039bbe280be81bd55973c&=&format=webp&quality=lossless&width=508&height=508'
        },
        {
            match: 'tuna.png',
            newUrl: 'https://media.discordapp.net/attachments/816260655061532683/1444938476163305572/9e22f5de-c758-4e24-897d-5ee27c219cce.png?ex=692e8752&is=692d35d2&hm=f4a7d4a246fd70ac29785299962fb9ff26a1dd31f2e039bbe280be81bd55973c&=&format=webp&quality=lossless&width=508&height=508'
        },
        {
            match: 'pizza-bot.png',
            newUrl: 'https://media.discordapp.net/attachments/816260655061532683/1444807640952733867/1c3cace6-1c1b-4c22-b761-a7473c8d6566.png?ex=692e0d78&is=692cbbf8&hm=5b662b9013ccff36935716ee7162096321614b1c9e3781827addcbe46186e631&=&format=webp&quality=lossless&width=930&height=930'
        },
        {
            match: 'ufo.png',
            newUrl: 'https://media.discordapp.net/attachments/816260655061532683/1444807640952733867/1c3cace6-1c1b-4c22-b761-a7473c8d6566.png?ex=692e0d78&is=692cbbf8&hm=5b662b9013ccff36935716ee7162096321614b1c9e3781827addcbe46186e631&=&format=webp&quality=lossless&width=930&height=930'
        },
        {
            match: 'buble.png',
            newUrl: 'https://media.discordapp.net/attachments/816260655061532683/1444953593223315578/b63753cd-d590-44ae-9a33-92754e4e4a09.png?ex=692e9566&is=692d43e6&hm=0e053a24a26d73a7cc9ee23e84a8213577690f17e317576797d4b70cd999ab1f&=&format=webp&quality=lossless&width=930&height=930'
        },
        {
            match: 'fish.png',
            newUrl: 'https://media.discordapp.net/attachments/816260655061532683/1444964295338233896/bbfa70be-5f26-47e2-b205-25f033093347.png?ex=692e9f5e&is=692d4dde&hm=fb6d27f0d9c087d5b0e9fd4c77f57e953cfa8997e0740538f5b9589c3476e78b&=&format=webp&quality=lossless&width=508&height=508'
        },
        {
            match: 'alien.png',
            newUrl: 'https://media.discordapp.net/attachments/816260655061532683/1444964295338233896/bbfa70be-5f26-47e2-b205-25f033093347.png?ex=692e9f5e&is=692d4dde&hm=fb6d27f0d9c087d5b0e9fd4c77f57e953cfa8997e0740538f5b9589c3476e78b&=&format=webp&quality=lossless&width=508&height=508'
        },
        {
            match: 'pink.png',
            newUrl: 'https://media.discordapp.net/attachments/816260655061532683/1444969919656759316/6143ea9d-e14d-4f60-a69c-271c0cdcfaa6.png?ex=692ea49b&is=692d531b&hm=f7ebdd9697c13394e9f447d48e441e99b58e9fd1fff6e22457bfb9ca19bde4ff&=&format=webp&quality=lossless&width=508&height=508'
        },
        {
            match: 'lion.png',
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

    /****************************************************************
     * 3.1. CUSTOM SKIN PO NUMERZE – KONFIG (1 SLOT, PANEL O)
     ****************************************************************/
    const USER_SKIN_LS_KEY = 'brUserSkinByNumber';

    let userSkinSettings = {
        enabled: true,
        matchFragment: '',   // np. "12307.png"
        newUrl: ''           // np. "https://i.imgur.com/xxxx.png"
    };

    (function loadUserSkinSettings() {
        try {
            const raw = localStorage.getItem(USER_SKIN_LS_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (typeof parsed.enabled === 'boolean')        userSkinSettings.enabled       = parsed.enabled;
            if (typeof parsed.matchFragment === 'string')   userSkinSettings.matchFragment = parsed.matchFragment;
            if (typeof parsed.newUrl === 'string')          userSkinSettings.newUrl        = parsed.newUrl;
        } catch (e) {}
    })();

    function saveUserSkinSettings() {
        try {
            localStorage.setItem(USER_SKIN_LS_KEY, JSON.stringify(userSkinSettings));
        } catch (e) {
            console.warn('[UserSkin] save error:', e);
        }
    }

    function fixImgurUrl(url) {
        if (typeof url !== 'string') return url;
        url = url.trim();
        if (url.startsWith('https://imgur.com/')) {
            const id = url.split('/').pop().split('.')[0];
            return 'https://i.imgur.com/' + id + '.png';
        }
        return url;
    }

    function applyUserSkin(value) {
        if (!userSkinSettings.enabled) return value;
        if (!userSkinSettings.matchFragment || !userSkinSettings.newUrl) return value;
        if (value.indexOf(userSkinSettings.matchFragment) !== -1) {
            return userSkinSettings.newUrl;
        }
        return value;
    }

    // ⭐ tu jest logika podmiany obrazków (w tym monety)
    function applyImageReplacements(value) {
        if (typeof value !== 'string') return value;

        // moneta -> prezent
        const lower = value.toLowerCase();
        if (
            value.indexOf(COIN_PART) !== -1 ||      // stara moneta 9999
            lower.includes('coin') ||              // wszystko z "coin" w nazwie
            lower.includes('/skins/9999')          // na wszelki wypadek z parametrami
        ) {
            value = PRESENT_URL;
        }

        value = remapSkin(value);     // świąteczne boty
        value = applyUserSkin(value); // Twój 1 slot po numerze

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

    (function patchCanvasText() {
        if (!CanvasRenderingContext2D) return;
        var proto = CanvasRenderingContext2D.prototype;
        if (proto.__winterBotsTextPatched) return;
        proto.__winterBotsTextPatched = true;

        var origFillText   = proto.fillText;
        var origStrokeText = proto.strokeText;

        function shrinkFontForBotsIfBig(ctx, newText) {
            var f = ctx.font;
            if (!f) return null;

            var match = f.match(/(\d+(\.\d+)?)px/);
            if (!match) return null;

            var size = parseFloat(match[1]);

            if (size < 25) {
                return null;
            }

            var factor = 0.70;

            if (typeof newText === 'string') {
                if (newText.indexOf('Choinka') !== -1) {
                    factor = 0.50;
                }
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
            var botNick  = getNewNickFor(text);

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
            if (getNewNickFor(text)) return;
            var replaced = replaceNickInString(text);
            if (typeof maxWidth === 'number') {
                return origStrokeText.call(this, replaced, x, y, maxWidth);
            } else {
                return origStrokeText.call(this, replaced, x, y);
            }
        };
    })();

    (function patchDOMText() {
        function replaceTextInNode(node) {
            if (!node) return;

            if (node.nodeType === 3) {
                var val    = node.nodeValue;
                var newVal = replaceNickInString(val);
                if (newVal !== val) node.nodeValue = newVal;
            } else if (node.nodeType === 1) {
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
     * 5. MACRO – QASD + 16split + 1–4 split
     ****************************************************************/

    (function setupMacro() {
        if (window.hasRunBubbleMacro) return;
        window.hasRunBubbleMacro = true;

        let splitSwitch = false;
        const keys = { q: false, a: false, s: false, d: false };

        function split(times) {
            for (let i = 0; i < times; i++) {
                setTimeout(() => {
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
                        split(6);
                    }
                    break;
                case "1": split(1); break;
                case "2": split(2); break;
                case "3": split(3); break;
                case "4": split(4); break;
            }

            if (key === "q") goToAbsolute(0.5, 0.3);
            if (key === "a") goToAbsolute(0.3, 0.5);
            if (key === "s") goToAbsolute(0.5, 0.7);
            if (key === "d") goToAbsolute(0.7, 0.5);

            if (keys["q"] && keys["a"]) goToAbsolute(0.3, 0.3);
            if (keys["q"] && keys["d"]) goToAbsolute(0.7, 0.3);
            if (keys["s"] && keys["a"]) goToAbsolute(0.3, 0.7);
            if (keys["s"] && keys["d"]) goToAbsolute(0.7, 0.7);
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

    /****************************************************************
     * 6. PANEL: 1 CUSTOM SKIN PO NUMERZE (KLAWISZ O)
     ****************************************************************/
    (function setupSingleNumberSkinPanel() {
        let panel = null;
        let isVisible = false;

        function createPanel() {
            if (panel) return panel;

            panel = document.createElement('div');
            panel.id = 'br-single-skin-panel';
            Object.assign(panel.style, {
                position: 'fixed',
                top: '120px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: '999999',
                background: 'rgba(0,0,0,0.92)',
                border: '1px solid #444',
                borderRadius: '10px',
                padding: '12px 14px',
                width: '320px',
                color: '#fff',
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px',
                boxShadow: '0 0 10px rgba(0,0,0,0.7)',
                display: 'none'
            });

            panel.innerHTML = `
                <div style="text-align:center; font-weight:bold; margin-bottom:8px;">
                    Custom skin po numerze – 1 slot
                </div>
                <div style="margin-bottom:6px; font-size:11px; color:#ccc;">
                    • W polu <b>Numer skinu</b> wpisz np. <code>12307.png</code><br>
                    • W polu <b>URL skina</b> wklej link z Imgura (może być też <code>https://imgur.com/...</code>)<br>
                    • Działa lokalnie – tylko Ty widzisz zmianę.
                </div>
                <label>Numer skinu (np. 12307.png):</label>
                <input id="br-skin-num" type="text"
                       style="width:100%; padding:4px; margin:3px 0 8px; border-radius:4px; border:1px solid #666; background:#111; color:#fff;">

                <label>URL skina (PNG/GIF/WEBP):</label>
                <input id="br-skin-url" type="text" placeholder="https://i.imgur.com/xxxxx.png"
                       style="width:100%; padding:4px; margin:3px 0 8px; border-radius:4px; border:1px solid #666; background:#111; color:#fff;">

                <label style="display:block; margin-bottom:8px;">
                    <input id="br-skin-enabled" type="checkbox" style="margin-right:4px;">
                    Włączone
                </label>

                <button id="br-skin-save" style="
                    width:100%; padding:6px; background:#2ecc71; color:#000;
                    font-weight:bold; border:none; border-radius:5px; cursor:pointer;">
                    Zapisz
                </button>

                <div style="margin-top:6px; text-align:center; font-size:10px; color:#aaa;">
                    Klawisz <b>O</b> – pokaż/ukryj panel
                </div>
            `;

            document.body.appendChild(panel);

            const numInput = document.getElementById('br-skin-num');
            const urlInput = document.getElementById('br-skin-url');
            const enabledInput = document.getElementById('br-skin-enabled');

            numInput.value = userSkinSettings.matchFragment || '';
            urlInput.value = userSkinSettings.newUrl || '';
            enabledInput.checked = !!userSkinSettings.enabled;

            document.getElementById('br-skin-save').addEventListener('click', () => {
                userSkinSettings.matchFragment = numInput.value.trim();
                userSkinSettings.newUrl = fixImgurUrl(urlInput.value.trim());
                userSkinSettings.enabled = enabledInput.checked;

                saveUserSkinSettings();

                try {
                    if (userSkinSettings.enabled && userSkinSettings.matchFragment) {
                        const sel = 'img[src*="' + userSkinSettings.matchFragment.replace(/"/g, '') + '"]';
                        const imgs = document.querySelectorAll(sel);
                        imgs.forEach(img => {
                            img.src = img.src; // ponowne ustawienie odpali hooka
                        });
                    }
                } catch (e) {}

                alert('Zapisano! Jeśli czegoś nie widać, odśwież stronę (F5).');
            });

            return panel;
        }

        function togglePanel() {
            if (!panel) createPanel();
            if (!panel) return;
            isVisible = !isVisible;
            panel.style.display = isVisible ? 'block' : 'none';
        }

        function onKeyDown(e) {
            const tag = (e.target && e.target.tagName || '').toLowerCase();
            if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
            if (e.key === 'o' || e.key === 'O') {
                togglePanel();
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                createPanel();
                document.addEventListener('keydown', onKeyDown);
            });
        } else {
            createPanel();
            document.addEventListener('keydown', onKeyDown);
        }
    })();

})();

/****************************************************************
 * 2. KOLOR CZATU + PANEL + TOGGLE K
 ****************************************************************/
(function () {
    'use strict';

    if (window.__brRedChatScriptLoaded) return;
    window.__brRedChatScriptLoaded = true;

    const LS_KEY = 'brRedChatSettings';

    const defaultSettings = {
        textColor: '#ff0000',
        glowColor: '#ffffff',
        enabled: true,
        panelVisible: true
    };

    function loadSettings() {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (!raw) return { ...defaultSettings };
            const parsed = JSON.parse(raw);
            return { ...defaultSettings, ...parsed };
        } catch (e) {
            return { ...defaultSettings };
        }
    }

    let settings = loadSettings();

    function saveSettings() {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.warn('[BR RedChat] Nie udało się zapisać ustawień', e);
        }
    }

    /////////////////////////////////
    // PANEL W LEWYM GÓRNYM ROGU
    /////////////////////////////////
    let panel;

    function createPanel() {
        panel = document.createElement('div');
        panel.id = 'br-red-chat-panel';
        Object.assign(panel.style, {
            position: 'fixed',
            top: '10px',
            left: '10px',
            zIndex: '999999',
            background: 'rgba(0,0,0,0.8)',
            border: '1px solid #444',
            borderRadius: '8px',
            padding: '8px 10px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '11px',
            color: '#fff',
            boxShadow: '0 0 8px rgba(0,0,0,0.7)',
            minWidth: '170px',
            display: settings.panelVisible ? 'block' : 'none'
        });

        const header = document.createElement('div');
        Object.assign(header.style, {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
            fontWeight: 'bold'
        });
        header.textContent = 'Kolor czatu (K = ON/OFF)';

        const closeBtn = document.createElement('span');
        closeBtn.textContent = '×';
        Object.assign(closeBtn.style, {
            cursor: 'pointer',
            paddingLeft: '8px',
            fontWeight: 'bold'
        });
        closeBtn.title = 'Schowaj panel';

        closeBtn.addEventListener('click', () => {
            settings.panelVisible = false;
            saveSettings();
            panel.style.display = 'none';
        });

        header.appendChild(closeBtn);
        panel.appendChild(header);

        const status = document.createElement('div');
        status.id = 'br-red-chat-status';
        Object.assign(status.style, {
            marginBottom: '4px',
            fontSize: '10px'
        });
        panel.appendChild(status);
        updateStatusText();

        function addColorRow(labelText, key) {
            const row = document.createElement('div');
            Object.assign(row.style, {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px',
                gap: '4px'
            });

            const label = document.createElement('span');
            label.textContent = labelText;

            const input = document.createElement('input');
            input.type = 'color';
            input.value = settings[key] || defaultSettings[key];
            Object.assign(input.style, {
                width: '40px',
                height: '18px',
                border: 'none',
                padding: '0',
                background: 'transparent',
                cursor: 'pointer'
            });

            input.addEventListener('input', () => {
                settings[key] = input.value;
                saveSettings();
                processExistingMessages();
            });

            row.appendChild(label);
            row.appendChild(input);
            panel.appendChild(row);
        }

        addColorRow('Kolor tekstu', 'textColor');
        addColorRow('Poświata', 'glowColor');

        document.body.appendChild(panel);
    }

    function updateStatusText() {
        const status = document.getElementById('br-red-chat-status');
        if (!status) return;
        status.textContent = settings.enabled ? 'Status: WŁĄCZONY' : 'Status: WYŁĄCZONY';
        status.style.color = settings.enabled ? '#7CFC00' : '#ff8080';
    }

    /////////////////////////////////
    // KOLOROWANIE WIADOMOŚCI
    /////////////////////////////////

    function resetMessageStyle(el) {
        el.style.color = '';
        el.style.textShadow = '';
        const strong = el.querySelector('strong');
        if (strong) {
            strong.style.color = '';
            strong.style.textShadow = '';
        }
    }

    function styleMessage(el) {
        if (!el || el.nodeType !== Node.ELEMENT_NODE) return;
        if (!el.className || !el.className.toString().includes('mess_type_')) return;

        if (!settings.enabled) {
            resetMessageStyle(el);
            return;
        }

        const textColor = settings.textColor || defaultSettings.textColor;
        const glowColor = settings.glowColor || defaultSettings.glowColor;

        el.style.color = textColor;
        el.style.textShadow = `0 0 3px ${glowColor}, 0 0 6px ${glowColor}`;

        const strong = el.querySelector('strong');
        if (strong) {
            strong.style.color = textColor;
            strong.style.textShadow = `0 0 3px ${glowColor}, 0 0 6px ${glowColor}`;
        }
    }

    function processExistingMessages() {
        const msgs = document.querySelectorAll('div[class*="mess_type_"]');
        msgs.forEach(styleMessage);
    }

    function observeMessages() {
        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                if (m.type === 'childList' && m.addedNodes.length > 0) {
                    m.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.className && node.className.toString().includes('mess_type_')) {
                                styleMessage(node);
                            }
                            const inner = node.querySelectorAll
                                ? node.querySelectorAll('div[class*="mess_type_"]')
                                : [];
                            inner.forEach(styleMessage);
                        }
                    });
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /////////////////////////////////
    // TOGGLE POD K
    /////////////////////////////////

    function toggleChatEffect() {
        settings.enabled = !settings.enabled;
        settings.panelVisible = true;
        saveSettings();

        if (panel) {
            panel.style.display = settings.panelVisible ? 'block' : 'none';
        }
        updateStatusText();
        processExistingMessages();
    }

    function initKeybind() {
        document.addEventListener('keydown', (e) => {
            const active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
                return;
            }

            if (e.key === 'k' || e.key === 'K') {
                e.preventDefault();
                toggleChatEffect();
            }
        });
    }

    /////////////////////////////////
    // START
    /////////////////////////////////

    function init() {
        createPanel();
        processExistingMessages();
        observeMessages();
        initKeybind();
        console.log('[BR RedChat] Aktywny – własny kolor czatu + toggle K.');
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 500);
    } else {
        window.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));
    }
})();

/****************************************************************
 * 3. LOKALNA ZMIANA NICKU (PANEL POD N, KULKA + TOP10)
 ****************************************************************/
(function () {
    'use strict';

    if (window.__brLocalNickChangerLoaded) return;
    window.__brLocalNickChangerLoaded = true;

    const LS_KEY = 'brLocalNickChangerSettings';

    const defaultSettings = {
        enabled: true,
        oldNick: '',
        newNick: ''
    };

    function loadSettings() {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (!raw) return { ...defaultSettings };
            const parsed = JSON.parse(raw);
            return { ...defaultSettings, ...parsed };
        } catch (e) {
            return { ...defaultSettings };
        }
    }

    function saveSettings(settings) {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('[NickChanger] localStorage error:', e);
        }
    }

    let settings = loadSettings();

    /*****************************************************************
     * 3.1. PODMIANA TEKSTU NA CANVASIE (kulka, TOP10, inne napisy)
     *****************************************************************/
    (function patchLocalNickCanvas() {
        let proto;
        try {
            proto = CanvasRenderingContext2D.prototype;
        } catch (e) {
            proto = null;
        }
        if (!proto || proto.__brLocalNickPatched) return;
        proto.__brLocalNickPatched = true;

        const origFillText   = proto.fillText;
        const origStrokeText = proto.strokeText;
        const origMeasure    = proto.measureText;

        function maybeSwap(text) {
            try {
                if (
                    settings.enabled &&
                    settings.oldNick &&
                    settings.newNick &&
                    typeof text === 'string'
                ) {
                    if (text.indexOf(settings.oldNick) !== -1) {
                        return text.split(settings.oldNick).join(settings.newNick);
                    }
                }
            } catch (e) {}
            return text;
        }

        proto.fillText = function (text, x, y, maxWidth) {
            text = maybeSwap(text);
            if (typeof maxWidth !== 'undefined') {
                return origFillText.call(this, text, x, y, maxWidth);
            }
            return origFillText.call(this, text, x, y);
        };

        proto.strokeText = function (text, x, y, maxWidth) {
            text = maybeSwap(text);
            if (!origStrokeText) return;
            if (typeof maxWidth !== 'undefined') {
                return origStrokeText.call(this, text, x, y, maxWidth);
            }
            return origStrokeText.call(this, text, x, y);
        };

        proto.measureText = function (text) {
            text = maybeSwap(text);
            return origMeasure.call(this, text);
        };
    })();

    /*****************************************************************
     * 3.2. PODMIANA NICKU W DOM (lobby, czaty, listy graczy)
     *****************************************************************/
    function replaceTextInNode(node) {
        if (!settings.enabled || !settings.oldNick || !settings.newNick) return;
        if (node.nodeType === Node.TEXT_NODE) {
            const txt = node.nodeValue;
            if (!txt || txt.indexOf(settings.oldNick) === -1) return;
            node.nodeValue = txt.split(settings.oldNick).join(settings.newNick);
        }
    }

    function walkAndReplace(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        const toChange = [];
        let n;
        while ((n = walker.nextNode())) {
            if (n.nodeValue && n.nodeValue.indexOf(settings.oldNick) !== -1) {
                toChange.push(n);
            }
        }
        toChange.forEach(replaceTextInNode);
    }

    const observer = new MutationObserver((mutations) => {
        if (!settings.enabled || !settings.oldNick || !settings.newNick) return;
        for (const m of mutations) {
            if (m.type === 'childList') {
                m.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        replaceTextInNode(node);
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        walkAndReplace(node);
                    }
                });
            } else if (m.type === 'characterData') {
                replaceTextInNode(m.target);
            }
        }
    });

    function startObserver() {
        if (!document.body) return;
        observer.observe(document.body, {
            childList: true,
            characterData: true,
            subtree: true
        });
        walkAndReplace(document.body);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }

    /*****************************************************************
     * 3.3. PANEL KONFIGURACJI (TOGGLE POD N)
     *****************************************************************/
    let panel = null;
    let isPanelVisible = false;

    function createPanel() {
        if (panel) return panel;

        panel = document.createElement('div');
        panel.id = 'br-local-nick-panel';

        panel.style.position = 'fixed';
        panel.style.top = '80px';
        panel.style.left = '50%';
        panel.style.transform = 'translateX(-50%)';
        panel.style.zIndex = '99999';
        panel.style.background = 'rgba(15, 15, 15, 0.95)';
        panel.style.border = '1px solid #444';
        panel.style.borderRadius = '10px';
        panel.style.padding = '12px 16px';
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.color = '#fff';
        panel.style.fontSize = '12px';
        panel.style.minWidth = '260px';
        panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.6)';
        panel.style.display = 'none';

        panel.innerHTML = `
            <div style="font-size: 13px; margin-bottom: 6px; text-align:center; font-weight:bold;">
                Lokalna zmiana nicku
            </div>
            <div style="margin-bottom: 4px;">
                <label style="display:block; margin-bottom:2px;">Twój aktualny nick:</label>
                <input type="text" id="br-old-nick" style="width:100%; padding:3px; border-radius:4px; border:1px solid #555; background:#222; color:#fff;">
            </div>
            <div style="margin-bottom: 4px;">
                <label style="display:block; margin-bottom:2px;">Nowy nick (tylko Ty widzisz):</label>
                <input type="text" id="br-new-nick" style="width:100%; padding:3px; border-radius:4px; border:1px solid #555; background:#222; color:#fff;">
            </div>
            <div style="margin-bottom: 6px; display:flex; align-items:center; gap:6px;">
                <input type="checkbox" id="br-nick-enabled">
                <label for="br-nick-enabled" style="cursor:pointer;">Włącz podmianę nicku</label>
            </div>
            <div style="display:flex; justify-content:space-between; gap:6px;">
                <button id="br-save-nick" style="flex:1; padding:4px 0; border:none; border-radius:4px; background:#2ecc71; color:#000; font-weight:bold; cursor:pointer;">
                    Zapisz
                </button>
                <button id="br-close-nick" style="flex:0 0 60px; padding:4px 0; border:none; border-radius:4px; background:#e74c3c; color:#000; font-weight:bold; cursor:pointer;">
                    X
                </button>
            </div>
            <div style="margin-top:4px; font-size:10px; text-align:center; color:#aaa;">
                Klawisz <b>N</b> – pokaż/ukryj panel
            </div>
        `;

        document.body.appendChild(panel);

        const oldInput = panel.querySelector('#br-old-nick');
        const newInput = panel.querySelector('#br-new-nick');
        const enabledCheckbox = panel.querySelector('#br-nick-enabled');

        if (oldInput) oldInput.value = settings.oldNick || '';
        if (newInput) newInput.value = settings.newNick || '';
        if (enabledCheckbox) enabledCheckbox.checked = !!settings.enabled;

        panel.querySelector('#br-save-nick').addEventListener('click', () => {
            const newOld = oldInput.value.trim();
            const newNew = newInput.value.trim();
            const en = enabledCheckbox.checked;

            settings.oldNick = newOld;
            settings.newNick = newNew;
            settings.enabled = en;

            saveSettings(settings);

            if (document.body) {
                walkAndReplace(document.body);
            }
        });

        panel.querySelector('#br-close-nick').addEventListener('click', () => {
            togglePanel(false);
        });

        return panel;
    }

    function togglePanel(forceState) {
        if (!panel) createPanel();
        if (!panel) return;

        if (typeof forceState === 'boolean') {
            isPanelVisible = forceState;
        } else {
            isPanelVisible = !isPanelVisible;
        }

        panel.style.display = isPanelVisible ? 'block' : 'none';
    }

    function onKeyDown(e) {
        const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

        if (e.key === 'n' || e.key === 'N') {
            togglePanel();
        }
    }

    function initPanelKey() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                createPanel();
                document.addEventListener('keydown', onKeyDown);
            });
        } else {
            createPanel();
            document.addEventListener('keydown', onKeyDown);
        }
    }

    initPanelKey();

})();
