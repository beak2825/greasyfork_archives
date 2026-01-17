// ==UserScript==
// @name         Map temple tags
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Shows temple tags
// @author       You
// @match        https://*.grepolis.com/*
// @icon         https://static.vecteezy.com/system/resources/previews/057/911/971/non_2x/ancient-roman-temple-illustration-on-transparent-background-free-png.png
// @grant        GM_xmlhttpRequest
// @connect      gpes.innogamescdn.com
// @downloadURL https://update.greasyfork.org/scripts/562863/Map%20temple%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/562863/Map%20temple%20tags.meta.js
// ==/UserScript==

const uw = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
const finalOlimpo = uw.Game.features.end_game_type == "end_game_type_olympus"
const OlympusHelper = uw.require('helpers/olympus')
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let colorMap;

function normalizeColor(c) {
    if (c == null) return null;
    c = String(c).trim();

    if (/^[0-9a-f]{6}$/i.test(c)) return `#${c}`;

    if (/^#[0-9a-f]{6}$/i.test(c)) return c;

    return c;
}

function buildColorMap(){
    let colors = uw.MM.getModels().CustomColor
    let colorMap = {}
    for (let color in colors){
        let type = colors[color].getType()

        if (type.includes("alliance")){
            colorMap[colors[color].getOtherId()] = normalizeColor(colors[color].getColor())
        }
    }
    return colorMap;
}


function hexToRgb(hex) {
    if (!hex) return null;
    hex = String(hex).trim();

    if (/^[0-9a-f]{6}$/i.test(hex)) hex = `#${hex}`;

    const m = /^#([0-9a-f]{6})$/i.exec(hex);
    if (!m) return null;

    const n = parseInt(m[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}


function relativeLuminance({r,g,b}) {
    const srgb = [r,g,b].map(v => v/255).map(c =>
                                             c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4)
                                            );
    return 0.2126*srgb[0] + 0.7152*srgb[1] + 0.0722*srgb[2];
}


function pickTextColor(bgColor) {
    const rgb = hexToRgb(bgColor);
    if (!rgb) return "#fff"; // fallback

    const L = relativeLuminance(rgb);

    return L > 0.5 ? "#000" : "#fff";
}


function upsertTempleBadge(templeEl, text, bgColor) {
    const cs = getComputedStyle(templeEl);
    if (cs.position === "static") templeEl.style.position = "relative";

    let badge = templeEl.querySelector(":scope > .tm-badge");
    if (!badge) {
        badge = document.createElement("span");
        badge.className = "tm-badge";
        templeEl.appendChild(badge);
    }

    const bg = bgColor || "#000";
    const fg = pickTextColor(bg);

    badge.textContent = text ?? "";
    badge.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) translateY(-25px);

    z-index: 10;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 10px;
    line-height: 12px;
    font-weight: 700;

    background: ${bg};
    color: ${fg};

    border: 1px solid rgba(0,0,0,.35);
    box-shadow: 0 1px 2px rgba(0,0,0,.35);
    text-shadow: 0 1px 1px rgba(0,0,0,.35);
    pointer-events: none;
    white-space: nowrap;
  `;
}


async function paintTemple(templeEl){

    if (templeEl.querySelector('.tm-badge')) return

    const str = templeEl.parentElement.id.replace('mini_i', '')
    const island_x = parseInt(str.slice(0,3));
    const island_y = parseInt(str.slice(-3));

    const temple = OlympusHelper.getTempleByIslandXAndIslandY(island_x, island_y);
    const text = temple.attributes.alliance_name
    const color = colorMap[temple.attributes.alliance_id]

    if (color){
        upsertTempleBadge(templeEl, String(text), color);
    }else if (text!= ""){
        upsertTempleBadge(templeEl, String(text), '#BB5511');
    }
}


function renderStrategic(){
    const temples = document.querySelectorAll('.small_temple_marker');
    temples.forEach((temple) => paintTemple(temple))

}


function observeViews(){
        uw.$(uw.document).ajaxComplete(function (e, xhr, opt) {
            const parts=(opt.url||'').split('?'); const filename=parts[0]||''; const qs=parts[1]||'';
            if (filename !== '/game/town_info') return;
            const seg = qs.split(/&/)[1] || ''; const action = seg.substr(7);
            if (action !== 'info') return;
            try{
                const params = new URLSearchParams(qs);
                const rdata = JSON.parse(decodeURIComponent(params.get('json')));
            }catch{}
        });

        uw.$.Observer(uw.GameEvents.map.zoom_out)
            .subscribe(['templeTags_zoom_out'], ()=>{
            uw.$.Observer(uw.GameEvents.minimap.load_chunks)
                .subscribe(['templeTags_chunks'], ()=>{ renderStrategic(); });
        });
    }

async function waitUntil(pred, {tries=200, delay=50}={}) {
    for(let i=0;i<tries;i++){ if (await pred()) return true; await sleep(delay); }
    return false;
}


if (finalOlimpo){
    (async ()=>{
        const ready = await waitUntil(()=>!!uw.Game && !!uw.MM && !!uw.ITowns && !!uw.MM.getModels().CustomColor);
        if (!ready){ console.warn('[TEMPLES - Init] Grepolis no listo.'); return; }
        colorMap = buildColorMap();
        observeViews();
    })();
}