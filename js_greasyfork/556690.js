// ==UserScript==
// @name         HakushinBeautified
// @icon         https://hakush.in/favicon.ico
// @namespace    https://github.com/lucisurbe/js
// @version      76
// @description  Reform the ugly colors in Hakush.in.
// @author       LucisUrbe
// @run-at       document-end
// @match        *://*.hakush.in/*
// @license      Apache
// @downloadURL https://update.greasyfork.org/scripts/556690/HakushinBeautified.user.js
// @updateURL https://update.greasyfork.org/scripts/556690/HakushinBeautified.meta.js
// ==/UserScript==

'use strict';

/*\
|*|
|*|	:: cookies.js ::
|*|
|*|	A complete cookies reader/writer framework with full unicode support.
|*|
|*|	Revision #8 - February 18th, 2020
|*|
|*|	https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
|*|	https://developer.mozilla.org/User:fusionchess
|*|	https://github.com/madmurphy/cookies.js
|*|
|*|	This framework is released under the GNU Public License, version 3 or later.
|*|	http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|	Syntaxes:
|*|
|*|	* docCookies.setItem(name, value[, end[, path[, domain[, secure[, same-site]]]]])
|*|	* docCookies.getItem(name)
|*|	* docCookies.removeItem(name[, path[, domain[, secure[, same-site]]]])
|*|	* docCookies.hasItem(name)
|*|	* docCookies.keys()
|*|	* docCookies.clear([path[, domain[, secure[, same-site]]]])
|*|
\*/
(function () {
    function makeSetterString(sKey, sValue, vEnd, sPath, sDomain, bSecure, vSameSite) {
        var sExpires = '';
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
                    /*
                    Note: Despite officially defined in RFC 6265, the use of `max-age` is not compatible with any
                    version of Internet Explorer, Edge and some mobile browsers. Therefore passing a number to
                    the end parameter might not work as expected. A possible solution might be to convert the the
                    relative time to an absolute time. For instance you could replace the previous line with:

                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT"
                        : "; expires=" + (new Date(vEnd * 1e3 + Date.now())).toUTCString();
                    */
                    break;
                case String:
                    sExpires = '; expires=' + vEnd;
                    break;
                case Date:
                    sExpires = '; expires=' + vEnd.toUTCString();
                    break;
            }
        }
        return encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires +
            (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '') +
            (
                !vSameSite || vSameSite.toString().toLowerCase() === 'no_restriction'
                    ? '' : vSameSite.toString().toLowerCase() === 'lax' || Math.ceil(vSameSite) === 1 || vSameSite === true
                        ? '; samesite=lax' : vSameSite.toString().toLowerCase() === 'none' || vSameSite < 0
                            ? '; samesite=none' : '; samesite=strict'
            );
    }

    var reURIAllowed = /[\-\.\+\*]/g, reCNameAllowed = /^(?:expires|max\-age|path|domain|secure|samesite|httponly)$/i;

    window.docCookies = {
        'getItem': function (sKey) {
            if (!sKey) { return null; }
            return decodeURIComponent(
                document.cookie.replace(
                    new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(reURIAllowed, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'),
                    '$1'
                )
            ) || null;
        },
        'setItem': function (sKey, sValue, vEnd, sPath, sDomain, bSecure, vSameSite) {
            if (!sKey || reCNameAllowed.test(sKey)) { return false; }
            document.cookie = makeSetterString(sKey, sValue, vEnd, sPath, sDomain, bSecure, vSameSite);
            return true;
        },
        'removeItem': function (sKey, sPath, sDomain, bSecure, vSameSite) {
            if (!this.hasItem(sKey)) { return false; }
            document.cookie = makeSetterString(sKey, '', 'Thu, 01 Jan 1970 00:00:00 GMT', sPath, sDomain, bSecure, vSameSite);
            return true;
        },
        'hasItem': function (sKey) {
            if (!sKey || reCNameAllowed.test(sKey)) { return false; }
            return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(reURIAllowed, '\\$&') + '\\s*\\=')).test(document.cookie);
        },
        'keys': function () {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
                aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
            }
            return aKeys;
        },
        'clear': function (sPath, sDomain, bSecure, vSameSite) {
            for (var aKeys = this.keys(), nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
                this.removeItem(aKeys[nIdx], sPath, sDomain, bSecure, vSameSite);
            }
        }
    };
})();

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isGI = window.location.host.startsWith('gi');
const isHSR = window.location.host.startsWith('hsr');
const isZZZ = window.location.host.startsWith('zzz');
const isWW = window.location.host.startsWith('ww');
const GI_DataTable = {
    'levelValue': 90,
    'levelDescription': '以 90 级为例',
    'fontFamily': 'HYWenHei, sans-serif',
    '精炼等级': '以精炼1阶（5阶）为例',
    '突破素材': '角色突破满级材料',
    '天赋素材': '单个天赋满级材料',
};
const HSR_DataTable = {
    'levelValue': 90,
    'levelDescription': '以 80 级为例',
    'fontFamily': 'HYRunYuan, sans-serif',
    '叠影': '以叠影1阶（5阶）为例',
    '突破素材': '突破素材预览',
    '行迹素材': '行迹素材预览',
    '行迹': '行迹图',
    '战斗天赋': '行迹',
    '额外能力': '行迹提供的额外能力',
    '属性加成': '行迹提供的额外加成',
};
const ZZZ_DataTable = {
    'levelValue': 60,
    'levelDescription': '以 60 级为例',
    'fontFamily': 'inpin-hongmengti, sans-serif',
    '精炼等级': '以进阶1（进阶5）为例',
    '突破素材': '晋升材料预览',
    '天赋素材': '技能材料预览（全满级）',
    '战斗天赋': '技能',
    '潜能': '潜能激活（以6阶为例）'
};
const WW_DataTable = {
    'levelValue': 90,
    'levelDescription': '以 90 级为例',
    'fontFamily': '文鼎方新书H7GBK, sans-serif',
    '谐振': '以谐振1阶（5阶）为例',
    '突破素材': '突破材料预览',
    '天赋素材': '技能材料预览',
    '战斗天赋': '技能',
};
let doOnce = false;
let isChar = /\/char\/\d+\/?(\?|#|$)/.test(window.location.href);
let isCharacter = /\/character\/\d+(\?|#|$)/.test(window.location.href);
let isWeapon = /\/weapon\/\d+(\?|#|$)/.test(window.location.href);
let isLightcone = /\/lightcone\/\d+\/?(\?|#|$)/.test(window.location.href);
let isBangboo = /\/bangboo\/\d+(\?|#|$)/.test(window.location.href);
let isDiff = /\/diff\?mode=/.test(window.location.href);
let oldCharacterIDsHSR;

function insertCSS(cssString) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = cssString;
    document.head.appendChild(style);
}

function AddCustomStyles(fontFamily) {
    if (isGI) {
        insertCSS(`
            @font-face {
                font-family: 'KhaenriahSun-Regular';
                src: url(https://raw.githack.com/jaywcjlove/free-font/main/docs/fonts/english/HoYo/HoYo-KhaenriahSun-Regular.ttf)
            }
            @font-face {
                font-family: 'HYWenHei';
                font-weight: 300;
                src: url(https://cdn.jsdelivr.net/gh/PaiGramTeam/PaiGram@main/resources/fonts/HYWenHei-35W.ttf)
                /* This repository has 35W to 85W */
            }
            @font-face {
                font-family: 'HYWenHei';
                font-weight: 500;
                src: url(https://cdn.jsdelivr.net/gh/PaiGramTeam/PaiGram@main/resources/fonts/HYWenHei-55W.ttf)
            }
            @font-face {
                font-family: 'HYWenHei';
                font-weight: 600;
                src: url(https://cdn.jsdelivr.net/gh/PaiGramTeam/PaiGram@main/resources/fonts/HYWenHei-65W.ttf)
            }
            @font-face {
                font-family: 'HYWenHei';
                font-weight: 800;
                src: url(https://sdk.mihoyo.com/hk4e/fonts/zh-cn.ttf)
            }
            .text-indigo-500 { font-family: KhaenriahSun-Regular, HYWenHei, sans-serif; }
            .__grid--masonry > .py-2 { margin-top: unset !important; }
        `);
    }
    if (isHSR) {
        insertCSS(`
            @font-face {
                font-family: 'StarRailNeue-Serif-Regular';
                src: url(https://raw.githack.com/jaywcjlove/free-font/main/docs/fonts/english/HoYo/StarRailNeue-Serif-Regular.ttf)
            }
            @font-face {
                font-family: 'HYRunYuan';
                font-weight: 300;
                src: url(https://cdn.jsdelivr.net/gh/bogerchan/National-Geography@master/app/src/main/assets/font/HYRunYuan-35W.ttf)
            }
            @font-face {
                font-family: 'HYRunYuan';
                font-weight: 500;
                src: url(https://cdn.jsdelivr.net/gh/Moonlark-Dev/XDbot2@master/src/plugins/Core/font/HYRunYuan-55W.ttf)
            }
            @font-face {
                font-family: 'HYRunYuan';
                font-weight: 600;
                src: url(https://cdn.jsdelivr.net/gh/LZY2275/teajourney@main/src/assets/font/HYRunYuan-65W.ttf)
            }
            @font-face {
                font-family: 'HYRunYuan';
                font-weight: 700;
                src: url(https://cdn.jsdelivr.net/gh/sdy623/nana@master/manual/fonts/HYRunYuan-75W.ttf)
            }
            div.grid.grid-cols-1.gap-1.p-4.text-xs.font-normal { display: none !important; } /* 移除详细属性表 */
            div.flex.justify-between.w-full.text-xs.font-normal { display: none !important; } /* 移除详细属性条 */
            div.pt-2.text-md { display: none !important; } /* 移除详细属性 */
            .text-indigo-500 { font-family: StarRailNeue-Serif-Regular, HYRunYuan, sans-serif; } /* 蓝色副标题使用神秘字体 */
            .justify-end { display: none; } /* 移除 Simple Desc */
            .flex > .grid > .flex.p-4 { background-color: #002740; } /* 推荐养成角色卡牌背景色 */
        `);
    }
    if (isZZZ) {
        insertCSS(`
            @font-face {
                font-family: 'ZZZA-Regular';
                src: url(https://raw.githack.com/jaywcjlove/free-font/main/docs/fonts/english/HoYo/ZZZA-Regular.ttf)
            }
            @font-face {
                font-family: 'inpin-hongmengti';
                font-weight: 800;
                src: url(https://zzz.mihoyo.com/_nuxt/fonts/hongmengti.7e79f4e.woff2)
            }
            @font-face {
                font-family: 'inpin-hongmengti';
                font-weight: 300;
                src: url(https://zzz.mihoyo.com/_nuxt/fonts/hongmengti_light.a935fd0.woff2)
            }
            .font-normal {
                color: #CCCCCC;
            }
            .char-name-text {
                font-weight: 600;
            }
            .text-indigo-500 { font-family: ZZZA-Regular, sans-serif; font-size: smaller; } /* 蓝色副标题使用神秘字体 */
            div.flex.justify-end.px-4 > div { display: none !important; } /* Alternative Label */
            .justify-end { padding-bottom: 20px; } /* Alternative 下方增加间隔 */
        `); // 粗体、细体 和 角色名大字字体
    }
    if (isWW) {
        insertCSS(`
            @font-face {
                font-family: '文鼎方新书H7GBK';
                src: url(https://cdn.jsdelivr.net/gh/BlameTwo/WutheringWavesTool@master/src/WutheringWavesTool/Assets/Font.ttf)
            }
            div.grid.grid-cols-1.gap-1.p-4.text-xs.font-normal:nth-child(odd) { display: none !important; } /* 移除详细属性表 */
            div.flex.justify-end.px-4.font-normal > div { display: none !important; } /* Simple Desc */
            div.flex.justify-end.w-full > div { display: none !important; } /* Alternative Label */
        `);
        if (isSafari) insertCSS(`.font-bold, b, strong { font-synthesis: none; } /* 过度加粗 */`);
    }
    insertCSS(`
        html { font-family: ${fontFamily} !important; -webkit-font-smoothing: antialiased; } /* 基础字体 */
        .char-name-text { font-family: ${fontFamily} !important; } /* 角色名大字字体 */
        main { background: #111111 !important; } /* 主背景色 */
        .max-w-5xl { background: #111111 !important; } /* 主背景色 */
        .bg-hakushin-900 { background: #111111 !important; } /* 顶栏背景色 */
        .bg-hakushin-950 { background: none !important; } /* 侧边栏紫色 */
        .text-indigo-500 { color: #009dff !important; font-weight: 100; } /* 文字颜色 */
        .bg-hakushin-table-1 { background-color: #002740 !important; } /* 表格背景色 */
        .bg-hakushin-table-2 { background-color: #00385b !important; } /* 表格背景色 */
        .bg-indigo-500 { background-color: #002740 !important; } /* 背景色 */
        .bg-indigo-900 { background-color: #00385b !important; } /* 背景色 */
        .bg-indigo-950 { background-color: #00385b !important; } /* 背景色 */
        .border-indigo-500 { border-color: #009dff !important; } /* 子条目左边线 */
        .absolute.px-1.transform.rounded.bg-slate-900 { margin-top: 5px; margin-right: 5px; background-color: #151515; opacity: 0.85; }  /* 突破素材数字 */
        div.flex.items-end.justify-center { justify-content: flex-end !important; align-items: flex-start !important; } /* 素材数字位置重构 */
        sidebar > div > .cursor-pointer { display: unset; } /* 语言切换 */
        .cursor-pointer.appearance-none { display: none; } /* 拖动条 */
        .adsbygoogle { display: none !important; } /* 关闭拦截器后的广告 */
        a.group { display: none !important; } /* 加号 */
        a.bg-transparent { display: none !important; } /* 主线语音 */
        .text-xs.text-right.font-normal, /* 计算器广告 */ #calculator { display: none !important; } /* 计算器 */
        button.mx-8.text-sm.text-gray-500.text-left { display: none !important; } /* 导出到 PNG 按钮 */
        select { appearance: none; } /* 改版切换菜单 */
        .leading-5 { line-height: 1.5rem !important; } /* 行高 */
        .text-xs { font-size: 0.9rem !important; line-height: 1.25rem !important; } /* 字号和行高 */
        .text-sm { font-size: 1.0rem !important; line-height: 1.25rem !important; } /* 字号和行高 */
        .py-16 { padding-top: unset !important; } /* footer and adsbygoogle margin */
        .py-8 { padding-top: unset !important; padding-bottom: unset !important; } /* footer and adsbygoogle margin */
        .w-full.p-3:hover { background-color: #00385b !important; } /* 菜单栏按钮悬浮背景色 */
        .char-name-info { top: 80% !important; left: 1% !important; } /* 悬浮主词目名称 */
        .bg-red-200, .bg-green-200 { --tw-bg-opacity: 0.7 !important } /* 差异红绿底纹 */
        .underline { text-decoration-line: unset !important; } /* 下划线 */
        /* .wep-background-image { padding: 30% !important; } 武器图四周空隙 */
    `);
}

function HideImageIfNotExists(imgElement) {
    if (!(imgElement instanceof HTMLImageElement)) return;
    const testImg = new Image();
    testImg.onload = () => { }; // Do nothing if it loads successfully
    testImg.onerror = () => { imgElement.style.display = 'none'; };
    testImg.src = imgElement.src;
}

async function FetchJSON(idRegEx, idName, urlPrefix) {
    // Extract ID from URL pathname
    const pathMatch = window.location.pathname.match(idRegEx);
    if (!pathMatch) {
        console.warn(`[Hakushin Beautified] Failed to extract ${idName} ID from URL!`);
        return null;
    }
    const ID = pathMatch[1];

    // Extract version from URL search parameters
    const urlParams = new URLSearchParams(window.location.search);
    const version = urlParams.get('v');

    // Construct the API URL with version support
    const apiUrl = version
        ? `${urlPrefix.replace('/data/', `/${version}/`)}/${ID}.json`
        : `${urlPrefix}/${ID}.json`;

    // Fetch JSON
    const response = await fetch(apiUrl);
    if (!response.ok) {
        console.warn(`[Hakushin Beautified] Failed to fetch ${idName} data for ID ${ID}`);
        return null;
    }
    return await response.json();
}

async function ShowWeaponRefinements() {
    try {
        const gameKey = isGI ? 'GI' : isZZZ ? 'ZZZ' : isHSR ? 'HSR' : isWW ? 'WW' : null;
        if (!gameKey) return;

        const apiMap = {
            GI: ['weapon', /\/weapon\/(\d+)/, 'https://api.hakush.in/gi/data/zh/weapon'],
            ZZZ: ['weapon', /\/weapon\/(\d+)/, 'https://api.hakush.in/zzz/data/zh/weapon'],
            HSR: ['lightcone', /\/lightcone\/(\d+)/, 'https://api.hakush.in/hsr/data/cn/lightcone'],
            WW: ['weapon', /\/weapon\/(\d+)/, 'https://api.hakush.in/ww/data/zh/weapon']
        };

        const [type, regex, url] = apiMap[gameKey];
        const weaponJSON = await FetchJSON(regex, type, url);
        if (!weaponJSON) return;

        let refine1, refine5;
        if (isGI) {
            refine1 = weaponJSON?.Refinement?.['1']?.Desc;
            refine5 = weaponJSON?.Refinement?.['5']?.Desc;
        } else if (isZZZ) {
            refine1 = weaponJSON?.Talents?.['1']?.Desc;
            refine5 = weaponJSON?.Talents?.['5']?.Desc;
        } else if (isHSR) {
            refine1 = { desc: weaponJSON?.Refinements?.Desc, params: weaponJSON?.Refinements?.Level?.['1']?.ParamList };
            refine5 = { desc: weaponJSON?.Refinements?.Desc, params: weaponJSON?.Refinements?.Level?.['5']?.ParamList };
        } else if (isWW) {
            refine1 = { desc: weaponJSON?.Effect, params: weaponJSON?.Param.map(p => p[0]) };
            refine5 = { desc: weaponJSON?.Effect, params: weaponJSON?.Param.map(p => p[4]) };
        }
        if (!refine1 || !refine5) return;

        const refinementDesc = document.querySelector('.text-sm.font-normal');
        if (!refinementDesc) return;

        // --- WW: Direct replacement of {0}..{n} ---
        if (isWW) {
            refinementDesc.textContent = refine1.desc.replace(/\{(\d+)\}/g, (_, i) => {
                const r1 = refine1.params[i], r5 = refine5.params[i];
                return r1 === r5 ? r1 : `${r1} (${r5})`;
            });
            return;
        }

        // --- GI / ZZZ / HSR ---
        let r1Vals = [], r5Vals = [];

        if (isGI || isZZZ) {
            const regex = isGI
                ? /<color=#99FFFFFF>([^<]+)<\/color>/g
                : /<color=#2BAD00>([^<]+)<\/color>/g;
            const extract = t => [...t.matchAll(regex)].map(m => m[1]);
            r1Vals = extract(refine1);
            r5Vals = extract(refine5);
        } else if (isHSR) {
            const paramRegex = /<color=#f29e38ff><unbreak>#(\d+)\[i\]([^<]*)<\/unbreak><\/color>/g;
            const indices = [...refine1.desc.matchAll(paramRegex)]
                .map(m => ({ i: +m[1] - 1, percent: m[2].includes('%') }));
            r1Vals = indices.map(p => ({ v: refine1.params[p.i], percent: p.percent }));
            r5Vals = indices.map(p => ({ v: refine5.params[p.i], percent: p.percent }));
        }
        if (r1Vals.length !== r5Vals.length) return;

        const selector = isGI ? 'span[style*="color: #99FFFFFF;"] > strong'
            : isZZZ ? 'span[style*="color: #2BAD00;"] > strong'
                : 'span[style*="color: #f29e38ff;"] > strong';

        const strongs = refinementDesc.querySelectorAll(selector);
        if (strongs.length !== r1Vals.length) return;

        strongs.forEach((el, i) => {
            const orig = el.textContent.trim();
            let newVal;
            if (isHSR) {
                const { v, percent } = r5Vals[i];
                newVal = percent ? (v * 100).toFixed(1).replace(/\.0$/, '') + '%' : Math.round(v);
            } else {
                newVal = r5Vals[i];
            }
            el.innerHTML = `${orig} (${newVal})`;
        });

    } catch (err) {
        console.error('[Hakushin Beautified] Refinements patch failed:', err);
    }
}

async function GI_FixWeaponLocalization() {
    try {
        const nameEl = document.querySelector('.char-name-text');
        if (!nameEl) {
            console.warn('[Hakushin Beautified] .char-name-text element not found!');
            return;
        }

        const nameText = nameEl.innerHTML.trim();
        // 1. Detect absence of Chinese characters
        if (!/[\u4e00-\u9fa5]/.test(nameText)) {
            console.log('[Hakushin Beautified] Non-Chinese name detected, attempting localization fix...');

            // 2. Fetch JSON
            const weaponJSON = await FetchJSON(
                /\/weapon\/(\d+)/,
                'weapon',
                'https://api.hakush.in/gi/data/zh/weapon'
            );

            // 3. Extract fields
            const zhName = weaponJSON?.Name;
            const zhDesc = weaponJSON?.Desc;
            const refine1 = weaponJSON?.Refinement?.['1'];
            const refineName = refine1?.Name;
            const refineDesc = refine1?.Desc;

            if (zhName == null || zhDesc == null || refineName == null || refineDesc == null) {
                console.warn('[Hakushin Beautified] Some localization fields are missing in the JSON!');
                return;
            }

            // 4. Replace <color=...>...</color> with styled <span><strong>
            const replaceColorTags = str =>
                str.replace(/<color=([#0-9A-Fa-f]+)>(.*?)<\/color>/g,
                    (_, color, text) => `<span style="color: ${color};"><strong>${text}</strong></span>`
                ).replace(/\\n/g, '<br>');

            const zhDescHTML = replaceColorTags(zhDesc);
            const refineDescHTML = replaceColorTags(refineDesc);

            // 5. DOM replacements
            const weaponNameBG = document.querySelector('.char-name');
            if (weaponNameBG?.firstChild) weaponNameBG.firstChild.textContent = zhName;
            else console.warn('[Hakushin Beautified] .char-name firstChild not found!');

            const weaponName = document.querySelector('.char-name-text');
            if (weaponName) weaponName.innerHTML = zhName;
            else console.warn('[Hakushin Beautified] .char-name-text not found!');

            const weaponDesc = document.querySelector('.flex.text-xs.font-normal');
            if (weaponDesc) weaponDesc.innerHTML = zhDescHTML;
            else console.warn('[Hakushin Beautified] Weapon description container not found!');

            const refinementName = document.querySelector('.flex.text-lg.font-bold');
            if (refinementName?.firstChild) refinementName.firstChild.textContent = refineName;
            else console.warn('[Hakushin Beautified] Refinement name container not found!');

            const refinementDesc = document.querySelector('.text-sm.font-normal');
            if (refinementDesc) refinementDesc.innerHTML = refineDescHTML + '⚠️⚠️⚠️';
            else console.warn('[Hakushin Beautified] Refinement description container not found!');

            console.log('[Hakushin Beautified] Weapon localization successfully patched.');
        }
    } catch (err) {
        console.error('[Hakushin Beautified] Localization patch failed:', err);
    }
}

function GI_FixBaseStatsTable(charJSON) {
    const baseStatsTable = document.querySelector('.grid-rows-13');
    const hasBaseEM = baseStatsTable?.childElementCount > 14;
    const baseStatIndex = hasBaseEM ? 7 : 6;
    // 额外提升元素精通
    if (hasBaseEM) {
        const baseEMStatTitle = baseStatsTable?.children[baseStatIndex]?.firstElementChild;
        baseEMStatTitle.innerHTML = '基础元素精通';
        const baseEMStatValue = baseStatsTable?.children[baseStatIndex]?.lastElementChild;
        if (baseEMStatValue.innerHTML !== '0') baseEMStatValue.innerHTML = '🔺' + baseEMStatValue.innerHTML;
    }
    // 突破属性标记
    const followUpStat = baseStatsTable?.children[baseStatIndex + 1]?.lastElementChild;
    followUpStat.innerHTML = '🔺' + followUpStat.innerHTML;
    // 角色生日
    const birthdayStat = baseStatsTable?.children[baseStatIndex + 2]?.lastElementChild;
    if (birthdayStat.innerHTML === '1/1') birthdayStat.innerHTML = '？？？';
    else birthdayStat.innerHTML = birthdayStat.innerHTML.replace('/', '月') + '日';
    // 添加更多条目
    const regionTable = {
        'ASSOC_TYPE_MONDSTADT': '蒙德',
        'ASSOC_TYPE_LIYUE': '璃月',
        'ASSOC_TYPE_INAZUMA': '稻妻',
        'ASSOC_TYPE_SUMERU': '须弥',
        'ASSOC_TYPE_FONTAINE': '枫丹',
        'ASSOC_TYPE_NATLAN': '纳塔',
        'ASSOC_TYPE_NODKRAI': '挪德卡莱',
        'ASSOC_TYPE_MAINACTOR': '主角',
        'ASSOC_TYPE_RANGER': '游侠',
        'ASSOC_TYPE_FATUI': '愚人众',
        'ASSOC_TYPE_OMNI_SCOURGE': '寰宇劫灭'
    };
    const baseRegion = regionTable[charJSON?.CharaInfo?.Region]
        ?? charJSON?.CharaInfo?.Region?.split('ASSOC_TYPE_')[1]
        ?? charJSON?.CharaInfo?.Region;
    const baseTitle = charJSON?.CharaInfo?.Title;
    if (!baseRegion || !baseTitle) {
        console.warn('[Hakushin Beautified] Some base stat fields are missing in the JSON!');
        return;
    }
    const baseRegionEl = document.createElement('div');
    const baseTitleEl = document.createElement('div');
    baseRegionEl.className = 'grid items-center justify-center grid-cols-2 text-center bg-hakushin-table-2';
    baseTitleEl.className = 'grid items-center justify-center grid-cols-2 text-center bg-hakushin-table-1';
    baseRegionEl.innerHTML = `<div>能力所属</div><div>${baseRegion}</div>`;
    baseTitleEl.innerHTML = `<div>角色标题</div><div>${baseTitle}</div>`;
    baseStatsTable?.insertBefore(baseRegionEl, baseStatsTable.querySelector('.font-normal'));
    if (baseTitle !== '？？？')
        baseStatsTable?.insertBefore(baseTitleEl, baseStatsTable.querySelector('.font-normal'));
}

function GI_InjectFixedMaterials() {
    const root = document.querySelector('.grid.grid-cols-1.m-4.overflow-hidden.sm\\:grid-cols-2');
    if (!root) return;

    const [leftCol, rightCol] = root.children;

    const extraRows = [
        {
            parent: leftCol,
            insertIndex: 1,
            items: [
                {
                    href: '/item/104001',
                    className: 'two-star-avatar-icon',
                    imgSrc: 'https://api.hakush.in/gi/UI/UI_ItemIcon_104001.webp',
                    quantity: '22'
                },
                {
                    href: '/item/104002',
                    className: 'three-star-avatar-icon',
                    imgSrc: 'https://api.hakush.in/gi/UI/UI_ItemIcon_104002.webp',
                    quantity: '13'
                },
                {
                    href: '/item/104003',
                    className: 'four-star-avatar-icon',
                    imgSrc: 'https://api.hakush.in/gi/UI/UI_ItemIcon_104003.webp',
                    quantity: '414'
                },
                {
                    href: '/item/202',
                    className: 'three-star-avatar-icon',
                    imgSrc: 'https://api.hakush.in/gi/UI/UI_ItemIcon_202.webp',
                    quantity: '2092530'
                }
            ]
        },
        {
            parent: rightCol,
            insertIndex: 1,
            items: [
                {
                    href: '/item/202',
                    className: 'three-star-avatar-icon',
                    imgSrc: 'https://api.hakush.in/gi/UI/UI_ItemIcon_202.webp',
                    quantity: '1652500'
                }
            ]
        }
    ];

    for (const { parent, insertIndex, items } of extraRows) {
        const row = document.createElement('div');
        row.className = 'grid grid-cols-5 text-xs font-normal';

        for (const { href, className, imgSrc, quantity } of items) {
            const wrapper = document.createElement('div');
            wrapper.className = 'flex items-end justify-center';

            const anchor = document.createElement('a');
            anchor.href = href;
            anchor.className = `${className} rounded m-1 relative`;

            const img = document.createElement('img');
            img.loading = 'lazy';
            img.src = imgSrc;

            anchor.appendChild(img);

            const qtyDiv = document.createElement('div');
            qtyDiv.className = 'absolute px-1 transform rounded bg-slate-900';
            qtyDiv.textContent = quantity;

            wrapper.appendChild(anchor);
            wrapper.appendChild(qtyDiv);

            row.appendChild(wrapper);
        }

        parent.insertBefore(row, parent.children[insertIndex]);
    }
}

function GI_InjectWeaponMaterials() {
    const container = document.querySelector('.grid > .grid.grid-cols-1.m-4.overflow-hidden');
    const rows = container.querySelectorAll('.grid.grid-cols-5.text-xs.font-normal');

    const extraItems = [
        {
            rowIndex: 1,
            items: [
                {
                    href: '/item/104013',
                    className: 'three-star-avatar-icon',
                    imgSrc: 'https://api.hakush.in/gi/UI/UI_ItemIcon_104013.webp',
                    quantity: '907'
                }
            ]
        },
        {
            rowIndex: 2,
            items: [
                {
                    href: '/item/202',
                    className: 'three-star-avatar-icon',
                    imgSrc: 'https://api.hakush.in/gi/UI/UI_ItemIcon_202.webp',
                    quantity: '1131445',
                    style: 'margin-right: -15px;'
                }
            ]
        }
    ];

    for (const { rowIndex, items } of extraItems) {
        const row = rows[rowIndex];
        if (!row) continue;

        for (const { href, className, imgSrc, quantity, style } of items) {
            const wrapper = document.createElement('div');
            wrapper.className = 'flex items-end justify-center';

            const anchor = document.createElement('a');
            anchor.href = href;
            anchor.className = `${className} rounded m-1 relative`;

            const img = document.createElement('img');
            img.loading = 'lazy';
            img.src = imgSrc;

            anchor.appendChild(img);

            const qtyDiv = document.createElement('div');
            qtyDiv.className = 'absolute px-1 transform rounded bg-slate-900';
            qtyDiv.textContent = quantity;
            if (style) qtyDiv.setAttribute('style', style);

            wrapper.appendChild(anchor);
            wrapper.appendChild(qtyDiv);

            row.appendChild(wrapper);
        }
    }
}

async function GI_InsertHyperlinkDefinitions(charData) {
    try {
        // 1. Extract all unique hyperlink IDs from skills
        const linkIdSet = new Set();
        [charData.Skills ?? [], charData.Passives ?? [], charData.Constellations ?? []]
            .flat()
            .flatMap(skill => [...skill.Desc.matchAll(/\{LINK#N(\d+)\}/g)])
            .forEach(match => linkIdSet.add(match[1]));
        if (linkIdSet.size === 0) {
            console.log('[Hakushin Beautified] No hyperlink references found in skills!');
            return;
        }

        // 2. Fetch hyperlink definitions and parameter data
        const [hyperlinkJson, paramJson] = await Promise.all([
            fetch('https://api.hakush.in/gi/data/zh/hyperlink.json'),
            fetch('https://api.hakush.in/gi/data/zh/hyperlinkparam.json')
        ]);

        if (!hyperlinkJson.ok) {
            console.warn(`[Hakushin Beautified] Failed to fetch hyperlink data`);
            return;
        }
        if (!paramJson.ok) {
            console.warn(`[Hakushin Beautified] Failed to fetch parameter data`);
            return;
        }

        const [hyperlinkDefs, paramDefs] = await Promise.all([
            hyperlinkJson.json(),
            paramJson.json()
        ]);

        // 3. Helper function to process PARAM entries in text
        function processParamEntries(text) {
            return text.replace(/{PARAM#P(\d+)\|(\d+)S(\d+)}/g, (match, paramId, index, multiplier) => {
                const paramIdNum = parseInt(paramId);
                const indexNum = parseInt(index);
                const multiplierNum = parseInt(multiplier);

                // Check if parameter exists in paramDefs
                if (paramDefs[paramIdNum] && paramDefs[paramIdNum][indexNum - 1] !== undefined) {
                    const value = paramDefs[paramIdNum][indexNum - 1] * multiplierNum;
                    return value.toString();
                }

                // If not found, return the original match or a placeholder
                return match;
            });
        }

        // 4. Generate DOM elements
        const hyperlinkElements = Array.from(linkIdSet).map((id, index) => {
            const link = hyperlinkDefs[id];
            if (!link) return null;

            const wrapper = document.createElement('div');
            wrapper.className = 'py-2';

            const title = document.createElement('div');
            title.className = 'flex items-center pb-1';
            const name = document.createElement('div');
            name.className = 'text-lg';
            name.textContent = `${index + 1}. ${link.Name}`;
            title.appendChild(name);

            const desc = document.createElement('div');
            desc.className = 'text-sm font-normal';

            // Process the description - first PARAM entries, then other formatting
            let html = processParamEntries(link.Desc);
            html = html.replace(/\\n/g, '<br>');
            html = html.replace(/<color=([#0-9A-Fa-f]+)>(.*?)<\/color>/g, (_, color, text) =>
                `<strong><span style="color: ${color};">${text}</span></strong>`
            );

            desc.innerHTML = html;

            wrapper.appendChild(title);
            wrapper.appendChild(desc);
            return wrapper;
        }).filter(Boolean); // remove nulls

        if (hyperlinkElements.length === 0) {
            console.log('[Hakushin Beautified] No valid hyperlink data found!');
            return;
        }

        // 5. Wrap in container
        const hyperlinkContainer = document.createElement('div');
        hyperlinkContainer.className = 'flex flex-col p-4 m-4 overflow-hidden font-bold';
        hyperlinkContainer.innerHTML = `
            <div class="flex flex-col self-start">
                <span class="text-2xl leading-5">相关效果</span>
                <span class="text-base leading-5 text-indigo-500">HYPERLINKS</span>
            </div>
        `;
        const grid = document.createElement('div');
        grid.className = '__grid--masonry';
        grid.style.setProperty('--grid-gap', '1rem');
        grid.style.setProperty('--col-width', 'minmax(Min(20em, 100%), 1fr)');
        hyperlinkElements.forEach(el => grid.appendChild(el));
        hyperlinkContainer.appendChild(grid);

        // 6. Insert container after target element
        const target = document.querySelector('.mx-auto.px-4.md\\:px-16.py-8');
        // const target = document.querySelector('#character-kit > .flex-col');
        if (target) {
            target.insertAdjacentElement('afterend', hyperlinkContainer);
        }

    } catch (err) {
        console.error('[Hakushin Beautified] Failed to insert hyperlink definitions:', err);
    }
}

function GI_MakeConstellationsRowWise() {
    document.querySelectorAll('.flex > .__grid--masonry > .py-2 > .text-lg').forEach((e, index) => {
        e.firstChild.textContent = (index + 1) + '. ' + e.firstChild.textContent;
    });
    const constellationCol1 = document.querySelectorAll('.grid > .__grid--masonry')[0];
    const constellationCol2 = document.querySelectorAll('.grid > .__grid--masonry')[1];
    [...constellationCol2.childNodes].forEach((e) => { constellationCol1.appendChild(e); });
    [...constellationCol1.childNodes].forEach((e) => { e.outerHTML = e.outerHTML; });
    constellationCol2.remove();
    document.querySelector('.grid:has(> .__grid--masonry)').classList.remove('md:grid-cols-2');
}

async function GI_MarkNewMaterials() {
    try {
        const response = await fetch('https://api.hakush.in/gi/new.json');
        if (!response.ok) {
            console.warn('[Hakushin Beautified] Failed to fetch new materials data');
            return;
        }
        const data = await response.json();
        const newItemIds = new Set(data.item || []);
        const materialLinks = document.querySelectorAll('a.rounded');
        materialLinks.forEach(link => {
            const href = link.getAttribute('href');
            const idMatch = href.match(/\/item\/(\d+)/);
            if (idMatch) {
                const itemId = parseInt(idMatch[1]);
                if (newItemIds.has(itemId)) {
                    const newMark = document.createElement('div');
                    let baseClassName = 'absolute transform rounded bg-slate-900';
                    if (isCharacter) baseClassName += ' px-1';
                    newMark.className = baseClassName;
                    let baseStyle = `
                        z-index: 1000;
                        background-color: #c9621d;
                        font-size: 0.75rem;
                        opacity: 0.8;
                    `;
                    if (isCharacter) baseStyle += ' margin-top: 25px;';
                    if (isWeapon) baseStyle += ' margin-right: -2px;';
                    newMark.style = baseStyle;
                    newMark.textContent = '新';
                    link.parentNode.insertBefore(newMark, link.nextSibling);
                }
            }
        });
    } catch (error) {
        console.warn('[Hakushin Beautified] Error processing new materials:', error);
    }
}

async function HSR_PreloadAzaMaze() {
    try {
        // 1. Fetch the JSON
        const response = await fetch('https://n1-api.aza.gg/kv/read?key_id=hsr_maze&ttl=86400');
        if (!response.ok) {
            throw new Error(`[Hakushin Beautified] HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        // Check if the response structure is as expected
        if (jsonData.retcode === 0 && jsonData.data && jsonData.data.character) {
            // Extract character IDs (object keys) and convert them to numbers
            oldCharacterIDsHSR = Object.keys(jsonData.data.character).map(id => Number(id));
            console.log('[Hakushin Beautified] Character IDs fetched:', oldCharacterIDsHSR);
        } else {
            console.error('[Hakushin Beautified] Unexpected response structure:', jsonData);
        }
    } catch (error) {
        console.error('[Hakushin Beautified] Failed to fetch character IDs:', error);
    }
}

function HSR_IsOldCharacter() {
    try {
        // 2. Parse the current URL
        const match = window.location.pathname.match(/^\/char\/(\d+)\/?$/);
        if (!match) return false; // Not a character page
        const currentCharId = parseInt(match[1], 10);
        // 3. Check if current character is in the list
        if (oldCharacterIDsHSR?.includes(currentCharId)) {
            console.log('[Hakushin Beautified] This is an old character!');
            return true;
        }
        return false;
    } catch (error) {
        console.error('[Hakushin Beautified] Error checking character status:', error);
        return false;
    }
}

function ZZZ_InsertAdditionalTable() {
    const translation = {
        'Skill ID': '技能分段编号',
        'DMG Multiplier (Prop:1001)': '伤害倍率数值（%）',
        'Daze Multiplier (Prop:1002)': '失衡倍率数值（%）',
        'Energy Gain (Prop:1003)': '能量值积蓄',
        'Adrenaline': '闪能值积蓄',
        'Decibel Gain': '喧响值积蓄',
        'Anomaly Buildup': '属性异常值积蓄',
        'SpConsume': 'Sp消耗',
        'AttackData': '攻击数据',
        'Miasmic Shield Reduction': '秽盾削减值'
    };
    const createElement = (tag, options = {}) => {
        const el = document.createElement(tag);
        if (options.html) el.innerHTML = options.html;
        if (options.classList) el.classList.add(...options.classList);
        if (options.style) Object.assign(el.style, options.style);
        return el;
    };
    const TableTitle = createElement('div', {
        html: '底层数值表含义',
        classList: ['font-sm'],
        style: { marginTop: '100px' }
    });
    const Table = createElement('table', { classList: ['w-full', 'text-xs', 'font-normal', 'text-center', 'border-collapse', 'table-auto'] });
    const Tbody = createElement('tbody');
    const headerRow = createElement('tr', { classList: ['bg-hakushin-table-1'] });
    ['标号', '含义', '中文解释'].forEach(text => { headerRow.appendChild(createElement('td', { html: text })); });
    Tbody.appendChild(headerRow);
    const innerNames = Array.from(document.querySelector('thead')?.firstElementChild?.children || []);
    innerNames.forEach(e => {
        const row = createElement('tr', { classList: ['bg-hakushin-table-2'] });
        [e.innerHTML, e.title, translation[e.title] || ''].forEach(text => { row.appendChild(createElement('td', { html: text })); });
        Tbody.appendChild(row);
    });
    Table.appendChild(Tbody);
    const container = document.querySelector('.__grid--masonry')?.lastChild?.lastChild;
    if (container) {
        container.insertAdjacentElement('afterend', Table);
        container.insertAdjacentElement('afterend', TableTitle);
    }
}

async function ZZZ_FixBangbooSkillB() {
    try {
        // 1. Detect skill level
        console.log('[Hakushin Beautified] Skill B of Lv. 5 detected, attempting level fix...');

        // 2. Fetch JSON
        const bangbooJSON = await FetchJSON(
            /\/bangboo\/(\d+)/,
            'bangboo',
            'https://api.hakush.in/zzz/data/zh/bangboo'
        );

        // 3. Extract fields
        const B1Name = bangbooJSON?.Skill?.B?.Level?.['1']?.Name;
        const B1Desc = bangbooJSON?.Skill?.B?.Level?.['1']?.Desc;
        const B1Param = bangbooJSON?.Skill?.B?.Level?.['1']?.Param?.split('|');
        const B1Property = bangbooJSON?.Skill?.B?.Level?.['1']?.Property;

        if (!B1Name || !B1Desc || !B1Param || !B1Property) {
            console.warn('[Hakushin Beautified] Some localization fields are missing in the JSON!');
            return;
        }

        const BSection = document.querySelectorAll('.pb-1')[1];
        if (!BSection) throw new ReferenceError('[Hakushin Beautified] Bangboo Skill B not found!');
        // 4. Replace <color=...>...</color> with styled <span><strong>
        console.log('[Hakushin Beautified] Bangboo Skill B Name:', B1Name);
        const B1DescHTML = B1Desc
            .replace(/<color=([#0-9A-Fa-f]+)>(.*?)<\/color>/g,
                (_, color, text) => `<span style="color: ${color};"><strong>${text}</strong></span>`
            )
            .replaceAll('\n', '<br>');
        const BDesc = BSection.querySelector('.text-sm');
        if (BDesc) BDesc.innerHTML = B1DescHTML;
        else console.warn('[Hakushin Beautified] Bangboo Skill B Desc not found!');
        const BLevel = BSection.querySelector('.text-md');
        if (BLevel) BLevel.innerHTML = '详细属性 (Lv.1)';
        else console.warn('[Hakushin Beautified] Bangboo Skill B Level not found!');
        const BTable = BSection.querySelector('.grid-cols-1');
        if (BTable) B1Property.forEach((p, index) => {
            const tableRows = BTable.querySelectorAll('.grid > .grid > div');
            console.assert(p === tableRows[index * 2].innerHTML);
            tableRows[index * 2 + 1].innerHTML = B1Param[index];
        });
        else console.warn('[Hakushin Beautified] Bangboo Skill B Table not found!');
        console.log('[Hakushin Beautified] Bangboo Skill B level successfully patched.');
    } catch (err) {
        console.error('[Hakushin Beautified] Bangboo Skill B patch failed:', err);
    }
}

function ZZZ_InsertStatIndicatorsOld() {
    // unused now
    const stats = document.querySelector('.grid.h-full.gap-1.p-4.text-xs.font-normal');
    if (stats && isCharacter) {
        const statsToRead = [9, 10, 11, 12, 13, 14, 15];
        const normalStatValues = [118, 5.0, 50.0, 118, 120, 0, 1.2];
        let statLength = statsToRead.length;
        if (stats.children[3]?.lastElementChild?.innerHTML === '命破') statLength -= 2; // 防止判断失误
        for (let i = 0; i < statLength; i++) {
            const stat = stats.children[statsToRead[i]]?.lastElementChild;
            if (stat?.innerHTML?.replace('%', '') > normalStatValues[i]) {
                stat.innerHTML = '🔺' + stat.innerHTML;
            }
        }
    }
}

async function ZZZ_InsertStatIndicators() {
    try {
        // 1. Fetch JSON
        const characterJSON = await FetchJSON(
            /\/character\/(\d+)/,
            'character',
            'https://api.hakush.in/zzz/data/zh/character'
        );
        // 2. Extract fields
        const extraLevel6 = characterJSON?.ExtraLevel?.['6'];
        if (!extraLevel6) {
            console.warn('[Hakushin Beautified] ExtraLevel 6 field is missing in the JSON!');
            return;
        }
        // 3. Assertions
        console.assert(extraLevel6?.MaxLevel === 60);
        console.assert(extraLevel6?.Extra !== undefined);
        console.assert(Object.keys(extraLevel6?.Extra).length > 0);
        // 4. Insert indicators
        const statPropMap = {
            '11101': '基础生命值',
            '11102': '基础生命值', // 生命值百分比
            '12101': '基础攻击力',
            '12201': '冲击力',
            '20101': '暴击率',
            '21101': '暴击伤害',
            '31401': '异常掌控',
            '31201': '异常精通',
            '23101': '穿透率',
            '30501': '能量自动回复',
        };
        const stats = document.querySelector('.grid.h-full.gap-1.p-4.text-xs.font-normal');
        const statsToRead = [...Array(10).keys()].map(i => i + 6); // 6 ~ 15
        for (const key in extraLevel6?.Extra) {
            if (key in statPropMap)
                for (let i = 0; i < statsToRead.length; i++) {
                    const statLabel = stats.children[statsToRead[i]]?.firstElementChild;
                    const statValue = stats.children[statsToRead[i]]?.lastElementChild;
                    if (statLabel.innerHTML === statPropMap[key])
                        statValue.innerHTML = '🔺' + statValue.innerHTML;
                }
            else
                console.warn(`[Hakushin Beautified] Unknown stat prop ${key}, ${extraLevel6?.Extra[key]}`);
        }
        console.log('[Hakushin Beautified] Stat indicator successfully patched.');
        // 5. Description of SpecialElementType
        const specialElementType = characterJSON?.SpecialElementType;
        if (specialElementType?.Desc) {
            const specialETDesc = specialElementType.Desc;
            const specialETElem = document.createElement('div');
            specialETElem.className = 'px-2 py-1 text-sm text-white bg-black rounded shadow-md pointer-events-none';
            specialETElem.innerHTML = specialETDesc
                .replace(/<color=([#0-9A-Fa-f]+)>(.*?)<\/color>/g,
                    (_, color, text) => `<span style="color: ${color};"><strong>${text}</strong></span>`
                ).replaceAll('\n', '<br>');
            document.querySelector(':has(> .char-background-image)').insertAdjacentElement('afterend', specialETElem);
            console.log('[Hakushin Beautified] Special element type successfully described.');
        }
    } catch (err) {
        console.error('[Hakushin Beautified] Showing stat indicator failed:', err);
    }
}

function ZZZ_UnwrapCanvas() {
    document.querySelectorAll('canvas').forEach((canvas) => {
        const parent = canvas.parentElement;
        if (parent && parent.children.length === 1) {
            parent.replaceWith(canvas);
        }
    });
}

function ZZZ_ReplaceGenshinStars() {
    const imgRarityS = 'https://fastcdn.mihoyo.com/static-resource-v2/2024/05/15/809ad658ea69bb370ba145e37091505a_2903902069612010924.png';
    const imgRarityA = 'https://fastcdn.mihoyo.com/static-resource-v2/2024/05/15/9c4f034e428e25f88bb3daddfdd89f64_8563435929380171954.png';
    const imgRarityB = 'https://fastcdn.mihoyo.com/static-resource-v2/2024/05/15/be34e33f07907ff9eb5c5329e54bc447_9141285759296024360.png';
    const starsContainer = document.querySelector('.flex.stars');
    const rarity = starsContainer?.childElementCount;
    if (rarity === 5) starsContainer.innerHTML = `<img src="${imgRarityS}" style="width: 1.5rem; height: 1.5rem;">`;
    if (rarity === 4) starsContainer.innerHTML = `<img src="${imgRarityA}" style="width: 1.5rem; height: 1.5rem;">`;
    if (rarity === 3) starsContainer.innerHTML = `<img src="${imgRarityB}" style="width: 1.5rem; height: 1.5rem;">`;
}

async function WW_Customize() {
    // 移除不存在的出招说明图
    const roleSkillTree = document.querySelector('img.px-4.py-2');
    HideImageIfNotExists(roleSkillTree);
    if (isWeapon) await ShowWeaponRefinements();
}

async function ZZZ_Customize() {
    if (isCharacter) {
        if (document.getElementsByTagName('thead').length > 0) { ZZZ_InsertAdditionalTable(); }
        // 修复错误的表头描述
        function replaceTableHead(e) {
            if (e.firstChild.innerHTML.trim() === '武器') {
                e.firstChild.innerHTML = '特性';
            }
            if (e.firstChild.innerHTML.trim() === '类型' && isCharacter) {
                e.firstChild.innerHTML = '招式类型';
            }
        }
        document.querySelectorAll('.bg-hakushin-table-1').forEach((e) => { replaceTableHead(e); });
        document.querySelectorAll('.bg-hakushin-table-2').forEach((e) => { replaceTableHead(e); });
        // 将影画图设置在第 3 档
        const levelHandles = document.querySelectorAll('#level');
        const levelHandlesLength = levelHandles.length;
        if (levelHandlesLength === 8 || levelHandlesLength === 9) {
            levelHandles[levelHandlesLength - 1].value = 3;
            levelHandles[levelHandlesLength - 1].dispatchEvent(new Event('change')); // 通知更新等级
        }
        // 移除不存在的影画图
        const cinemaImage = document.querySelector('.inset-0');
        HideImageIfNotExists(cinemaImage);
        // 角色升级带来的额外属性提升
        await ZZZ_InsertStatIndicators();
        // 切换版本菜单汉化
        document.querySelectorAll('select.w-48 > option').forEach((e) => {
            if (e.innerHTML === 'Original') e.innerHTML = '原版';
            if (e.innerHTML.startsWith('Potential')) e.innerHTML = e.innerHTML.replace('Potential', '激发潜能');
        });
        // 汉化副词条
        const substats = document.querySelector('div.m-2.text-sm.font-normal.text-center');
        if (substats) substats.innerHTML = substats.innerHTML.replace('Alternative Stat', '次选属性');
        // 仅 Safari：取消 canvas 包装
        if (isSafari) ZZZ_UnwrapCanvas();
        ZZZ_ReplaceGenshinStars();
    }
    if (isWeapon) {
        await ShowWeaponRefinements();
        ZZZ_ReplaceGenshinStars();
    }
    if (isBangboo) {
        insertCSS(`.overflow-x-auto { display: none }`); // 删除隐藏数值表
        document.querySelectorAll('#level')[1].value = 6;
        document.querySelectorAll('#level')[1].dispatchEvent(new Event('change')); // 通知更新等级
        // 修复邦布 B 技能等级到 1
        await ElementReady(() => {
            const skillLevelEl = document.querySelectorAll('.text-md')[1];
            if (!skillLevelEl) return false;
            const skillLevelText = skillLevelEl.innerHTML.trim();
            return /Lv\.5/.test(skillLevelText);
        });
        await ZZZ_FixBangbooSkillB();
        ZZZ_ReplaceGenshinStars();
    }
}

async function HSR_Customize() {
    // 汉化副词条
    const substats = document.querySelector('div.m-2.text-sm.font-normal.text-center');
    if (substats) substats.innerHTML = substats.innerHTML.replace('Substats', '副属性');
    // 消耗材料
    const ascensionTitle = document.querySelector('div.flex-grow-0.mr-2.text');
    if (ascensionTitle) ascensionTitle.innerHTML = '晋阶材料预览';
    document.querySelectorAll('div.text-lg').forEach((e) => {
        if (e.innerHTML == '战技' || e.innerHTML == '终结技' || e.innerHTML == '天赋') {
            e.innerHTML += ' (Lv. 10)';
        }
        if (e.innerHTML == '普攻' || e.innerHTML == '忆灵技' || e.innerHTML == '忆灵天赋') {
            e.innerHTML += ' (Lv. 6)';
        }
    });
    // 移除损坏的阵营
    const campStat = document.querySelector('.grid-rows-13')?.children[11]?.lastElementChild;
    if (campStat?.innerHTML === '') campStat.parentElement.remove();
    // 切换版本菜单汉化
    document.querySelectorAll('select.w-48 > option').forEach((e) => {
        if (e.innerHTML === 'Original') e.innerHTML = '原版';
        if (e.innerHTML.startsWith('Enhanced')) e.innerHTML = e.innerHTML.replace('Enhanced', '加强版本');
    });
    // 删除外站统计
    document.querySelector('.py-4:has(> .font-normal)')?.remove();
    if (isLightcone) await ShowWeaponRefinements();
}

async function GI_Customize() {
    if (isCharacter) {
        // 移除不存在的特色料理，现在可能显示 Not available
        const specialFood = document.querySelector('div.rounded.m-1.relative.h-24.w-24 > img');
        HideImageIfNotExists(specialFood);
        const placeholderSF = document.querySelector('div.py-4.font-normal > div');
        if (placeholderSF?.innerHTML === 'Not available') placeholderSF.parentNode.parentNode.remove();
        // 移除名片问号
        const namecardTitle = document.querySelector('.grid > .flex > .flex > .py-2');
        if (namecardTitle?.innerHTML === '？？？') namecardTitle.remove();
        const namecardDesc = document.querySelector('.grid > .flex > .flex > .text-sm.font-normal');
        if (namecardDesc?.innerHTML === '？？？') namecardDesc.remove();
        const charJSON = await FetchJSON(
            /\/character\/(\d+)/,
            'character',
            'https://api.hakush.in/gi/data/zh/character'
        );
        // 切换版本菜单汉化
        document.querySelectorAll('select.w-48 > option').forEach((e) => {
            if (e.innerHTML === 'Original') e.innerHTML = '原版';
            if (e.innerHTML === 'Special') e.innerHTML = '新版';
        });
        GI_FixBaseStatsTable(charJSON);
        await GI_InsertHyperlinkDefinitions(charJSON);
        GI_InjectFixedMaterials();
        GI_MakeConstellationsRowWise();
        await GI_MarkNewMaterials();
    }
    else if (isWeapon) {
        GI_InjectWeaponMaterials();
        // 移除精炼指示数字
        const weaponRefinements = document.querySelectorAll('.w-full.flex.justify-between.text-xs');
        if (weaponRefinements.length === 2) {
            weaponRefinements[1].remove();
        }
        await GI_MarkNewMaterials();
        await GI_FixWeaponLocalization();
        await ShowWeaponRefinements();
    }
}

function Diff_Customize() {
    // 1. Select all relevant tables
    const tables = document.querySelectorAll('.grid-cols-1:not(.h-full):not(.rounded)');

    tables.forEach(table => {
        // 2. Select both versions
        const versions = table.querySelectorAll(':scope > .h-full');
        if (versions.length !== 2) return;

        const [oldVer, newVer] = versions;

        // 3. Parse each version into key-value pairs
        const parseRows = (versionDiv) => {
            const rows = versionDiv.querySelectorAll(':scope > div.bg-hakushin-table-1, :scope > div.bg-hakushin-table-2');
            const data = {};
            rows.forEach(row => {
                const [keyDiv, valDiv] = row.children;
                if (keyDiv && valDiv) {
                    data[keyDiv.textContent.trim()] = valDiv;
                }
            });
            return data;
        };

        const oldData = parseRows(oldVer);
        const newData = parseRows(newVer);

        // 4. Extract numeric value from strings
        const parseValue = (str) => {
            if (!str) return NaN;
            str = str.trim();

            // Match percentages like 123.4%
            const percentMatch = str.match(/^([\d.]+)%/);
            if (percentMatch) return parseFloat(percentMatch[1]);

            // Match custom units like 2.0秒 or 80点
            const unitMatch = str.match(/^([\d.]+)(秒|点)?$/);
            if (unitMatch) return parseFloat(unitMatch[1]);

            // Match complex format like 398.1%攻击力+3051
            const complexMatch = str.match(/^([\d.]+)%/);
            if (complexMatch) return parseFloat(complexMatch[1]);

            return NaN;
        };

        // 5. Compare values and annotate differences
        const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
        allKeys.forEach(key => {
            const oldCell = oldData[key];
            const newCell = newData[key];

            if (!oldCell || !newCell) {
                const target = newCell || oldCell;
                if (target) {
                    const marker = document.createElement('span');
                    marker.textContent = '⚠️';
                    target.appendChild(marker);
                }
                return;
            }

            const oldStr = oldCell.textContent.trim();
            const newStr = newCell.textContent.trim();
            const oldVal = parseValue(oldStr);
            const newVal = parseValue(newStr);

            let indicator = '';
            if (!isNaN(oldVal) && !isNaN(newVal)) {
                if (newVal > oldVal) indicator = '🔺';
                else if (newVal < oldVal) indicator = '🔻';
            } else if (oldStr !== newStr) {
                indicator = '🔴';
            }

            if (indicator) {
                const mark = document.createElement('span');
                mark.textContent = indicator;
                newCell.appendChild(mark);
            }
        });
    });
}

function ElementReady(criterionFn, checkInterval = 200, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const check = () => {
            const result = criterionFn();
            if (result) {
                resolve(result);
            } else if (Date.now() - start > timeout) {
                reject(new Error('[Hakushin Beautified] Timeout waiting for element to meet criterion'));
            } else {
                setTimeout(check, checkInterval);
            }
        };
        check();
    });
}

function ModifyRenderedPage(dataTable) {
    // 该函数会在所有可能受支持的页面调用
    // characters, weapon, bangboo, char, charOld, lightcone, diff
    const inputLevel = document.querySelectorAll('#level');
    if (inputLevel.length > 0) {
        inputLevel[0].value = dataTable.levelValue;
        inputLevel[0].dispatchEvent(new Event('change')); // 通知更新等级
    }
    const basicStatsTitle = document.querySelector('.text-2xl.font-bold.leading-5');
    if (basicStatsTitle) basicStatsTitle.innerHTML = '基础属性';
    const inputLevelScales = document.querySelectorAll('.justify-between.text-xs');
    if (inputLevelScales.length > 0) {
        const children = Array.from(inputLevelScales);
        children.slice(1).forEach(child => child.remove());
        children[0].innerText = dataTable.levelDescription;
    }
    if (isGI && isWeapon) dataTable.突破素材 = '武器满级材料';
    if (isZZZ && isWeapon) dataTable.突破素材 = '改装材料预览';
    if (isZZZ && isBangboo) dataTable.突破素材 = '改装材料预览';
    const sectionTitles = document.querySelectorAll('span.text-2xl.leading-5');
    sectionTitles.forEach((e) => {
        if (e.innerHTML.trim() in dataTable) {
            e.innerHTML = dataTable[e.innerHTML.trim()];
        }
        if (e.innerHTML === '养成计算器') {
            e.parentNode.parentNode.remove();
        }
        if (e.innerHTML === '推荐养成') {
            if (isGI) { // 仅为 GI，奇怪的渲染层次
                e.parentNode.parentNode.nextElementSibling?.remove();
                e.parentNode.parentNode.nextElementSibling?.remove();
                e.parentNode.parentNode.remove();
            }
        }
        if (e.innerHTML === '出招表') {
            if (e.parentNode.nextElementSibling.childNodes[0].childElementCount === 0) {
                e.parentNode.remove();
            }
        }
    });
    document.querySelector('footer > div > .ml-auto')?.remove();
    document.querySelector('footer > div > .flex-col > div').innerHTML = '开发中版本，请以游戏正式版本为准<br />游戏内容来源于Hakushin数据库';
}

function ObserveHrefChange() {
    let oldHref = document.location.href;
    const body = document.querySelector('body');
    const observer = new MutationObserver(async (_) => {
        if (oldHref !== document.location.href) {
            oldHref = document.location.href;
            console.log('[Hakushin Beautified] Navigated to ', oldHref);
            await IterativeCalls();
        }
    });
    observer.observe(body, { childList: true, subtree: true });
}

/*
    在该脚本的早期版本中，元素是否就绪的标准是根据 CSS 选择器来决定的。
    然而，如果没有正确实现 id，并非所有元素都能被准确选中。
    因此，该方法现在依赖于手动制定的规则。以下是原来的选择器。
    GI
    character: 'div.w-full.px-4.pb-4.text-sm.text-right.text-gray-400',
    weapon: '#svelte-announcer',
    HSR
    char: 'div.flex.items-center.justify-center.p-4.m-4.mx-8.rounded-2xl',
    charOld: '#main > div.max-w-5xl.w-full > div > div > div > div.flex.w-full.space-x-2',
    lightcone: '#char-material > div:nth-child(7) > a > img',
    ZZZ
    character: '#char-material > div:nth-child(13) > div',
    weapon: '#main > div > div > div > div > div > div:nth-child(7) > div',
    bangboo: '#main > div > div > div:nth-child(4)',
    WW
    character: '#main > div > div > div:nth-child(11)',
    weapon: '#main > div > div > div.mx-auto.px-4.py-8',
*/

function SelectorNotLessThan(selector, minLength) {
    const elementList = document.querySelectorAll(selector);
    if (!elementList) return false;
    return elementList.length >= minLength;
}

function DiffWithV6Rows(minTitles, minRows) {
    // The complete diff page is rendered row-wise, each row two versions.
    // Detect if constellations (12 rows) are all inserted.
    const titles = document.querySelectorAll('.text-xl.font-bold.pt-2');
    if (titles.length < minTitles) return false;
    const lastTitle = titles[minTitles - 1];
    const siblings = Array.from(lastTitle.parentElement.children);
    const index = siblings.indexOf(lastTitle);
    const mb4After = siblings
        .slice(index + 1)
        // No need actually, and already constrained by minTitles.
        // And not every diff row uses mb-4 but uses mb-2 or something else.
        // .filter(el => el.classList.contains('mb-4'))
        .length;
    return mb4After >= minRows;
}

const siteConfig = Object.values({
    GI: {
        isMatch: isGI,
        dataTable: GI_DataTable,
        customize: GI_Customize,
        criteria: {
            character: () => {
                // 最后插入超链接，无论新旧
                const azaBuild = document.querySelector('.w-full.text-gray-400 > a > span');
                return azaBuild?.innerHTML === 'https://aza.gg';
            },
            weapon: () => {
                // 该页在服务器侧已经组装完毕，只需检测到 Svelte announcer
                const svelteAnnouncer = document.querySelector('#svelte-announcer');
                return svelteAnnouncer?.ariaLive === 'assertive';
            },
            diff: () => DiffWithV6Rows(3, 12),
        },
    },
    HSR: {
        isMatch: isHSR,
        dataTable: HSR_DataTable,
        customize: HSR_Customize,
        criteria: {
            char: () => {
                // 对于新角色，最后插入 (Collecting Eidolon Data...)
                const azaBuild = document.querySelector('.flex.p-4.font-normal > div');
                return azaBuild?.innerHTML === '(Collecting Eidolon Data...)';
            },
            // 对于老角色，最后插入推荐养成的最后一行
            charOld: () => SelectorNotLessThan('.space-x-2 > .p-2', 1),
            // 最后插入第 7 个材料的图片
            lightcone: () => SelectorNotLessThan('#char-material > .items-end > a > img', 7),
            diff: () => DiffWithV6Rows(7, 12),
        },
    },
    ZZZ: {
        isMatch: isZZZ,
        dataTable: ZZZ_DataTable,
        customize: ZZZ_Customize,
        criteria: {
            // 最后插入第 13 个材料的所需个数
            character: () => SelectorNotLessThan('#char-material > div > div', 13),
            // 最后插入第 7 个材料的所需个数
            weapon: () => SelectorNotLessThan('.absolute', 7),
            // 最后插入广告
            bangboo: () => SelectorNotLessThan('.px-4.py-8', 2),
            diff: () => DiffWithV6Rows(7, 12),
        },
    },
    WW: {
        isMatch: isWW,
        dataTable: WW_DataTable,
        customize: WW_Customize,
        criteria: {
            // 最后插入广告
            character: () => SelectorNotLessThan('.px-4.py-8', 3),
            // 最后插入广告
            weapon: () => SelectorNotLessThan('.px-4.py-8', 1),
            diff: () => DiffWithV6Rows(2, 12),
        },
    }
}).find(cfg => cfg.isMatch);

async function IterativeCalls() {
    if (!siteConfig) {
        console.log('[Hakushin Beaitified] Host not implemented', window.location.host);
        return;
    }
    const { dataTable, customize, criteria } = siteConfig;
    if (!doOnce) {
        doOnce = true;
        const lang = docCookies.getItem('lang');
        console.log(`[Hakushin Beautified] Cookie lang: ${lang}`);
        if (lang !== 'zh') docCookies.setItem('lang', 'zh', Infinity, '/');
        AddCustomStyles(dataTable.fontFamily);
        if (isHSR) await HSR_PreloadAzaMaze();
    }
    const url = window.location.href;
    isChar = /\/char\/\d+\/?(\?|#|$)/.test(url);
    isCharacter = /\/character\/\d+(\?|#|$)/.test(url);
    isWeapon = /\/weapon\/\d+(\?|#|$)/.test(url);
    isLightcone = /\/lightcone\/\d+\/?(\?|#|$)/.test(url);
    isBangboo = /\/bangboo\/\d+(\?|#|$)/.test(url);
    isDiff = /\/diff\?mode=/.test(url);
    let readyCriterionFn = () => false;
    if (isHSR && isChar && HSR_IsOldCharacter()) readyCriterionFn = criteria.charOld;
    else if (isCharacter) readyCriterionFn = criteria.character;
    else if (isWeapon) readyCriterionFn = criteria.weapon;
    else if (isChar) readyCriterionFn = criteria.char;
    else if (isLightcone) readyCriterionFn = criteria.lightcone;
    else if (isBangboo) readyCriterionFn = criteria.bangboo;
    else if (isDiff) readyCriterionFn = criteria.diff;
    else { console.log('[Hakushin Beautified] Page not implemented', url); return; }
    const isReady = await ElementReady(readyCriterionFn);
    console.log('[Hakushin Beautified] Detected page ready state! ', isReady);
    if (isDiff) Diff_Customize(); else await customize();
    ModifyRenderedPage(dataTable);
}

(async function () {
    window.addEventListener('load', ObserveHrefChange);
    await IterativeCalls();
})();
