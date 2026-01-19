// ==UserScript==
// @name         WME - RightClick Functions
// @author       GreekCaptain
// @version      0.1.0
// @description  Right-click segment tools
// @match        https://www.waze.com/*/editor*
// @match        https://www.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @license      MIT
// @icon         data:image/png;base64,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
// @run-at       document-start
// @namespace https://greasyfork.org/users/1561762
// @downloadURL https://update.greasyfork.org/scripts/563177/WME%20-%20RightClick%20Functions.user.js
// @updateURL https://update.greasyfork.org/scripts/563177/WME%20-%20RightClick%20Functions.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const SCRIPT_ID = "wme-rightclick-functions";
  const SCRIPT_NAME = "WME - RightClick Functions";

  const EDITOR_BASE = `${location.origin}${location.pathname}`;
  const GMAPS_BASE = "https://www.google.com/maps?q=";

  if (UW.__WME_RIGHTCLICK_FUNCTIONS__) return;
  UW.__WME_RIGHTCLICK_FUNCTIONS__ = true;

  let sdk = null;
  let enabled = true;
  let lastLonLat = null;

  let cachedUserLevel = null;
  let rankIsZeroBased = null;
  let lockIsZeroBased = null;

  let attrClip = null;

  const pasteCfg = { speed: true, lock: true, direction: true, elevation: true };
  let speedDirChoice = "BOTH";

  const menuState = {
    root: null,
    sub: null,
    subCloseTimer: null,
    outsideCloseHandler: null,
    escHandler: null,
    subContext: null,
  };

  const ICONS = {
    copy: svg(`<path d="M8 7h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm-2 8H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v0H8a4 4 0 0 0-4 4v6z"/>`),
    street: svg(`<path d="M5 3h14v2H5V3zm0 16h14v2H5v-2zm1-7h2v2H6v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM4 7h16v10H4V7z"/>`),
    lock: svg(`<path d="M7 10V8a5 5 0 0 1 10 0v2h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h1zm2 0h6V8a3 3 0 0 0-6 0v2z"/>`),
    speed: svg(`<path d="M12 4a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V4zm6.5 6.5-5.3 3a2 2 0 1 1-1-1l3-5.3 3.3 3.3z"/>`),
    zoom: svg(`<path d="M10 18a8 8 0 1 1 5.3-2l4.3 4.3-1.4 1.4L13.9 17.4A8 8 0 0 1 10 18zm0-2a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/><path d="M9 9h2V7h2v2h2v2h-2v2h-2v-2H9V9z"/>`),
    endpoints: svg(`<path d="M7 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm10 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/><path d="M9.5 11.5h5v2h-5v-2z"/>`),
    tools: svg(`<path d="M21 7.5 18.5 5l-2 2 2.5 2.5L21 7.5zM3 17.5V21h3.5l10-10-3.5-3.5-10 10z"/><path d="M14.2 6.8 17 9.6"/>`),
    mapPin: svg(`<path d="M12 22s7-5.2 7-12a7 7 0 0 0-14 0c0 6.8 7 12 7 12zm0-10a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>`),
    link: svg(`<path d="M10.6 13.4a1 1 0 0 0 1.4 1.4l3.6-3.6a3 3 0 0 0-4.2-4.2l-1.6 1.6a1 1 0 1 0 1.4 1.4l1.6-1.6a1 1 0 1 1 1.4 1.4l-3.6 3.6z"/><path d="M13.4 10.6a1 1 0 0 0-1.4-1.4l-3.6 3.6a3 3 0 0 0 4.2 4.2l1.6-1.6a1 1 0 1 0-1.4-1.4l-1.6 1.6a1 1 0 1 1-1.4-1.4l3.6-3.6z"/>`),
    jump: svg(`<path d="M12 2a10 10 0 1 0 10 10h-2A8 8 0 1 1 12 4V2z"/><path d="M20 2v6h-6l2.2-2.2A7 7 0 0 0 12 5a7 7 0 1 0 7 7h2a9 9 0 1 1-9-9c1.9 0 3.6.6 5 1.6L20 2z"/>`),
    refresh: svg(`<path d="M17.65 6.35A7.95 7.95 0 0 0 12 4V1L7 6l5 5V7c2.76 0 5 2.24 5 5a5 5 0 0 1-8.66 3.54l-1.42 1.42A6.98 6.98 0 0 0 19 12c0-2.21-.9-4.21-2.35-5.65z"/>`),
    gear: svg(`<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm9 4-2 .7a7.9 7.9 0 0 1-.6 1.5l1.2 1.8-1.8 1.8-1.8-1.2a7.9 7.9 0 0 1-1.5.6L13 21h-2l-.7-2a7.9 7.9 0 0 1-1.5-.6l-1.8 1.2-1.8-1.8 1.2-1.8a7.9 7.9 0 0 1-.6-1.5L3 13v-2l2-.7a7.9 7.9 0 0 1 .6-1.5L4.4 7l1.8-1.8 1.8 1.2a7.9 7.9 0 0 1 1.5-.6L11 3h2l.7 2a7.9 7.9 0 0 1 1.5.6l1.8-1.2L20 7l-1.2 1.8c.25.48.46.98.6 1.5L21 11v2z"/>`),
    ext: svg(`<path d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14V3z"/><path d="M5 5h6v2H7v10h10v-4h2v6H5V5z"/>`),
    trash: svg(`<path d="M9 3h6l1 2h5v2H3V5h5l1-2zm1 6h2v10h-2V9zm4 0h2v10h-2V9zM7 9h2v10H7V9z"/>`),
    arrows: svg(`<path d="M7 7h6V5l4 3-4 3V9H7V7zm10 10h-6v2l-4-3 4-3v2h6v2z"/>`),
    select: svg(`<path d="M3 3h6v2H5v4H3V3zm16 0h2v6h-2V5h-4V3h4zM3 15h2v4h4v2H3v-6zm16 4v-4h2v6h-6v-2h4z"/>`),
    chain: svg(`<path d="M7 12a3 3 0 0 1 3-3h2v2h-2a1 1 0 0 0 0 2h2v2h-2a3 3 0 0 1-3-3zm7-3h2a3 3 0 0 1 0 6h-2v-2h2a1 1 0 0 0 0-2h-2V9z"/><path d="M10 11h4v2h-4v-2z"/>`),
  };

  function svg(pathD) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${pathD}</svg>`;
  }

  function withIcon(iconSvg, text) {
    return `<div class="wmeRcLbl"><span class="wmeRcI">${iconSvg}</span><span class="wmeRcT">${text}</span></div>`;
  }

  function ensureCSS() {
    if (document.getElementById("wmeRcCss")) return;
    const s = document.createElement("style");
    s.id = "wmeRcCss";
    s.textContent = `
      .wmeRcToast{position:fixed;right:16px;bottom:16px;z-index:2147483647;background:rgba(20,20,22,.90);color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:10px 12px;box-shadow:0 10px 30px rgba(0,0,0,.35);backdrop-filter:blur(10px);font:13px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;opacity:0;transform:translate3d(0,10px,0);transition:.18s ease;max-width:min(560px,calc(100vw - 32px));pointer-events:none;will-change:transform,opacity;}
      .wmeRcToast.show{opacity:1;transform:translate3d(0,0,0);}
      .wmeRcMenu{position:fixed;z-index:2147483647;min-width:320px;max-width:460px;background:rgba(20,20,22,.72);color:#fff;border:1px solid rgba(255,255,255,.14);border-radius:14px;box-shadow:0 18px 60px rgba(0,0,0,.45);backdrop-filter:blur(18px);overflow:hidden;font:13px/1.25 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;}
      .wmeRcMenu.sub{min-width:300px;max-width:460px;border-radius:12px;max-height:380px;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.22) rgba(255,255,255,.06);}
      .wmeRcMenu.sub::-webkit-scrollbar{width:10px;}
      .wmeRcMenu.sub::-webkit-scrollbar-track{background:rgba(255,255,255,.06);}
      .wmeRcMenu.sub::-webkit-scrollbar-thumb{background:rgba(255,255,255,.22);border-radius:10px;border:2px solid rgba(0,0,0,0);background-clip:padding-box;}
      .wmeRcMenu.sub::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.30);}
      .wmeRcHdr{padding:9px 10px;border-bottom:1px solid rgba(255,255,255,.10);opacity:.96;font-size:12px;display:flex;justify-content:space-between;gap:10px;align-items:center;}
      .wmeRcMuted{opacity:.65;}
      .wmeRcItem{padding:9px 10px;cursor:pointer;display:flex;justify-content:space-between;gap:10px;align-items:center;transition:.16s ease;}
      .wmeRcItem:hover{background:rgba(255,255,255,.08);transform:translate3d(0,-1px,0);}
      .wmeRcItem:active{background:rgba(255,255,255,.12);transform:translate3d(0,0,0);}
      .wmeRcItem.disabled{cursor:default;opacity:.55;}
      .wmeRcItem.disabled:hover{background:transparent;transform:none;}
      .wmeRcItem.selected{background:rgba(255,255,255,.10);}
      .wmeRcLeft{display:flex;flex-direction:column;gap:2px;min-width:0;}
      .wmeRcSubText{font-size:11px;opacity:.65;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .wmeRcSep{height:1px;background:rgba(255,255,255,.10);margin:6px 0;}
      .wmeRcKbd{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:11px;opacity:.85;border:1px solid rgba(255,255,255,.16);padding:2px 6px;border-radius:8px;height:fit-content;}
      .wmeRcChevron{opacity:.8;padding-left:10px;}
      .wmeRcCheck{opacity:.95;font-size:13px;}
      .wmeRcMiniBtn{cursor:pointer;user-select:none;padding:6px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);font-size:12px;line-height:1;white-space:nowrap;transition:.16s ease;}
      .wmeRcMiniBtn:hover{background:rgba(255,255,255,.10);transform:translate3d(0,-1px,0);}
      .wmeRcMiniBtn:active{background:rgba(255,255,255,.14);transform:translate3d(0,0,0);}
      .wmeRcMiniIcon{padding:6px 8px;min-width:34px;display:flex;align-items:center;justify-content:center;font-size:14px;}
      .wmeRcI{width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;opacity:.92;}
      .wmeRcI svg{width:16px;height:16px;fill:currentColor;}
      .wmeRcLbl{display:flex;align-items:center;gap:8px;}
      .wmeRcT{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .wmeRcSpeedWrap{padding:10px 10px 10px 10px;}
      .wmeRcSpeedTitle{font-size:11px;opacity:.75;margin-bottom:7px;display:flex;justify-content:space-between;gap:10px;align-items:center;}
      .wmeRcSpeedGrid{display:flex;flex-wrap:wrap;gap:6px;align-items:center;}
      .wmeRcSpeedBtn{width:30px;height:30px;border-radius:999px;border:2px solid rgba(255,60,60,.95);background:rgba(255,255,255,.02);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;user-select:none;font-size:11px;line-height:1;transition:.16s ease;position:relative;}
      .wmeRcSpeedBtn:hover{background:rgba(255,60,60,.10);transform:translate3d(0,-1px,0);}
      .wmeRcSpeedBtn:active{background:rgba(255,60,60,.18);transform:translate3d(0,0,0);}
      .wmeRcSpeedBtn svg{width:14px;height:14px;fill:rgba(255,60,60,.95);}
      .wmeRcSpeedBtn.sel{background:rgba(255,60,60,.18);box-shadow:0 0 0 4px rgba(255,60,60,.10);}
      .wmeRcSpeedBtn.sel::after{content:"";position:absolute;width:6px;height:6px;border-radius:99px;background:rgba(255,255,255,.92);bottom:-2px;right:-2px;box-shadow:0 6px 16px rgba(0,0,0,.35);}
      .wmeRcChips{display:flex;gap:6px;}
      .wmeRcChip{cursor:pointer;padding:6px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);font-size:12px;opacity:.9;transition:.16s ease;user-select:none;}
      .wmeRcChip:hover{background:rgba(255,255,255,.10);transform:translate3d(0,-1px,0);}
      .wmeRcChip:active{transform:translate3d(0,0,0);}
      .wmeRcChip.on{border-color:rgba(255,255,255,.30);background:rgba(255,255,255,.14);opacity:1;}
      .wmeRcModalBackdrop{position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.35);opacity:0;transition:opacity .16s ease;will-change:opacity;}
      .wmeRcModalBackdrop.show{opacity:1;}
      .wmeRcModal{position:fixed;left:50%;top:50%;transform:translate3d(-50%,-50%,0) scale(.985);opacity:0;z-index:2147483647;width:min(560px,calc(100vw - 24px));background:linear-gradient(180deg,rgba(28,28,32,.78),rgba(18,18,20,.78));border:1px solid rgba(255,255,255,.14);border-radius:16px;box-shadow:0 18px 60px rgba(0,0,0,.48);backdrop-filter:blur(12px);color:#fff;font:13px/1.25 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;overflow:hidden;transition:opacity .16s ease,transform .16s ease;will-change:transform,opacity;}
      .wmeRcModal.show{opacity:1;transform:translate3d(-50%,-50%,0) scale(1);}
      .wmeRcModalHdr{padding:12px 12px;border-bottom:1px solid rgba(255,255,255,.10);display:flex;justify-content:space-between;align-items:center;}
      .wmeRcModalTitle{font-weight:800;display:flex;gap:10px;align-items:center;letter-spacing:.2px;white-space:nowrap;}
      .wmeRcModalTitle .wmeRcI{width:18px;height:18px;}
      .wmeRcModalTitle .wmeRcI svg{width:18px;height:18px;}
      .wmeRcModalBody{padding:12px;display:flex;flex-direction:column;gap:10px;}
      .wmeRcHint{opacity:.68;font-size:12px;letter-spacing:.1px;}
      .wmeRcModalActions{display:flex;justify-content:flex-end;gap:10px;align-items:center;margin-top:2px;flex-wrap:wrap;}
      .wmeRcModalBtn{cursor:pointer;padding:8px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:#fff;user-select:none;transition:.16s ease;}
      .wmeRcModalBtn:hover{background:rgba(255,255,255,.10);transform:translate3d(0,-1px,0);}
      .wmeRcModalBtn:active{background:rgba(255,255,255,.14);transform:translate3d(0,0,0);}
      .wmeRcModalBtn.primary{border-color:rgba(255,255,255,.32);background:rgba(255,255,255,.16);box-shadow:0 0 0 4px rgba(255,255,255,.06);font-weight:700;}
      .wmeRcModalBtn.danger{border-color:rgba(255,75,75,.35);background:rgba(255,75,75,.12);}
      .wmeRcWizardHeader{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
      .wmeRcWizardHdrLeft{display:flex;flex-direction:column;gap:2px;min-width:0;}
      .wmeRcWizardTitle{font-weight:900;letter-spacing:.2px;}
      .wmeRcWizardSub{font-size:12px;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:360px;}
      .wmeRcWizardDots{display:flex;gap:6px;align-items:center;flex-wrap:nowrap;}
      .wmeRcDot{width:8px;height:8px;border-radius:999px;background:rgba(255,255,255,.18);box-shadow:inset 0 0 0 1px rgba(255,255,255,.10);}
      .wmeRcDot.on{background:rgba(255,255,255,.70);box-shadow:0 0 0 4px rgba(255,255,255,.10);}
      .wmeRcDot.done{background:rgba(255,255,255,.36);}
      .wmeRcWizardSection{display:flex;flex-direction:column;gap:10px;}
      .wmeRcWizardHint{font-size:12px;opacity:.75;}
      .wmeRcWizardGrid{display:flex;flex-wrap:wrap;gap:8px;align-items:center;}
      .wmeRcWizardBtn{cursor:pointer;padding:8px 12px;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);transition:.16s ease;user-select:none;}
      .wmeRcWizardBtn:hover{background:rgba(255,255,255,.10);transform:translate3d(0,-1px,0);}
      .wmeRcWizardBtn:active{background:rgba(255,255,255,.14);transform:translate3d(0,0,0);}
      .wmeRcWizardBtn.on{border-color:rgba(255,255,255,.30);background:rgba(255,255,255,.14);box-shadow:0 0 0 4px rgba(255,255,255,.08);}
      .wmeRcWizardList{display:flex;flex-direction:column;gap:8px;}
      .wmeRcWizardRow{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 10px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.04);border-radius:14px;}
      .wmeRcWizardRowLeft{display:flex;flex-direction:column;gap:2px;min-width:0;}
      .wmeRcWizardRowTitle{font-weight:800;}
      .wmeRcWizardRowSub{font-size:12px;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .wmeRcWizardTri{display:flex;gap:6px;align-items:center;flex-wrap:nowrap;}
      .wmeRcWizardPill{cursor:pointer;padding:6px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);font-size:12px;opacity:.95;transition:.16s ease;user-select:none;}
      .wmeRcWizardPill:hover{background:rgba(255,255,255,.10);transform:translate3d(0,-1px,0);}
      .wmeRcWizardPill:active{background:rgba(255,255,255,.14);transform:translate3d(0,0,0);}
      .wmeRcWizardPill.on{border-color:rgba(255,255,255,.30);background:rgba(255,255,255,.14);box-shadow:0 0 0 4px rgba(255,255,255,.08);}

      .wmeRcInput{width:100%;padding:11px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);color:#fff;outline:none;font:13px/1.25 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;box-shadow:inset 0 1px 0 rgba(255,255,255,.05);}
      .wmeRcInput::placeholder{color:rgba(255,255,255,.42);}
      .wmeRcInput:focus{border-color:rgba(255,255,255,.30);box-shadow:0 0 0 4px rgba(255,255,255,.07),inset 0 1px 0 rgba(255,255,255,.06);}
      .wmeRcToggleGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}
      .wmeRcToggleBtn{cursor:pointer;padding:10px 10px;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:space-between;gap:10px;user-select:none;transition:.16s ease;}
      .wmeRcToggleBtn:hover{background:rgba(255,255,255,.10);transform:translate3d(0,-1px,0);}
      .wmeRcToggleBtn:active{transform:translate3d(0,0,0);}
      .wmeRcToggleBtn.off{border-color:rgba(255,75,75,.35);background:rgba(255,75,75,.08);}
      .wmeRcToggleBtn.on{border-color:rgba(60,255,143,.35);background:rgba(60,255,143,.08);}
      .wmeRcToggleLeft{display:flex;flex-direction:column;gap:2px;min-width:0;}
      .wmeRcToggleName{font-weight:800;}
      .wmeRcToggleDesc{font-size:11px;opacity:.70;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .wmeRcPill{font-size:11px;border:1px solid rgba(255,255,255,.18);padding:2px 8px;border-radius:999px;opacity:.95;}
      .wmeRcPill.on{border-color:rgba(60,255,143,.35);background:rgba(60,255,143,.12);}
      .wmeRcPill.off{border-color:rgba(255,75,75,.35);background:rgba(255,75,75,.12);}
      .wmeRcActionList{display:flex;flex-direction:column;gap:8px;}
      .wmeRcActionCard{cursor:pointer;padding:10px 10px;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:space-between;gap:10px;user-select:none;transition:.16s ease;}
      .wmeRcActionCard:hover{background:rgba(255,255,255,.10);transform:translate3d(0,-1px,0);}
      .wmeRcActionCard:active{background:rgba(255,255,255,.14);transform:translate3d(0,0,0);}
      .wmeRcActionCard.disabled{cursor:default;opacity:.55;}
      .wmeRcActionCard.disabled:hover{background:rgba(255,255,255,.06);transform:none;}
      .wmeRcActionLeft{display:flex;flex-direction:column;gap:2px;min-width:0;}
      .wmeRcActionTitle{font-weight:800;display:flex;gap:8px;align-items:center;}
      .wmeRcActionDesc{font-size:11px;opacity:.70;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .wmeRcSideWrap{padding:10px 12px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111;}
      .wmeRcSideCard{background:#fff;border:1px solid rgba(0,0,0,.10);border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.08);padding:10px 10px;}
      .wmeRcSideRow{display:flex;align-items:center;justify-content:space-between;gap:12px;}
      .wmeRcSideTitle{font-weight:800;}
      .wmeRcSideSub{font-size:12px;opacity:.65;margin-top:2px;}
      .wmeRcSwitch{width:44px;height:26px;border-radius:999px;border:1px solid rgba(0,0,0,.18);background:rgba(0,0,0,.08);position:relative;cursor:pointer;transition:.16s ease;flex:0 0 auto;}
      .wmeRcSwitch.on{background:rgba(60,255,143,.35);border-color:rgba(60,255,143,.55);}
      .wmeRcKnob{width:22px;height:22px;border-radius:999px;background:#fff;position:absolute;top:1px;left:1px;box-shadow:0 8px 16px rgba(0,0,0,.18);transition:.16s ease;}
      .wmeRcSwitch.on .wmeRcKnob{left:21px;}
      .wmeRcTinyToggle{position:fixed;left:12px;bottom:12px;z-index:2147483646;background:rgba(20,20,22,.78);color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:8px 10px;backdrop-filter:blur(10px);font:12px/1.1 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;display:flex;gap:8px;align-items:center;cursor:pointer;user-select:none;opacity:.35;transition:.16s ease;}
      .wmeRcTinyToggle:hover{opacity:1;transform:translate3d(0,-1px,0);}
      .wmeRcTinyDot{width:10px;height:10px;border-radius:99px;background:#3cff8f;}
      .wmeRcTinyDot.off{background:#ff4b4b;}
      .wmeRcDiffBox{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);border-radius:14px;padding:10px 10px;display:flex;flex-direction:column;gap:8px;}
      .wmeRcDiffRow{display:flex;align-items:center;justify-content:space-between;gap:12px;}
      .wmeRcDiffLeft{display:flex;flex-direction:column;gap:2px;min-width:0;}
      .wmeRcDiffName{font-weight:800;}
      .wmeRcDiffDesc{font-size:11px;opacity:.72;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .wmeRcDiffRight{font:12px/1.2 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;opacity:.9;white-space:nowrap;}
      .wmeRcTag{font-size:11px;border:1px solid rgba(255,255,255,.18);padding:2px 8px;border-radius:999px;opacity:.92;}
      .wmeRcTag.ok{border-color:rgba(60,255,143,.35);background:rgba(60,255,143,.12);}
      .wmeRcTag.warn{border-color:rgba(255,188,75,.35);background:rgba(255,188,75,.10);}
      .wmeRcTag.bad{border-color:rgba(255,75,75,.35);background:rgba(255,75,75,.12);}
    `;
    document.documentElement.appendChild(s);
  }

  function toast(msg) {
    ensureCSS();
    const el = document.createElement("div");
    el.className = "wmeRcToast";
    el.textContent = msg;
    (document.body || document.documentElement).appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 250);
    }, 1400);
  }

  function closeSubMenu() {
    if (menuState.subCloseTimer) {
      clearTimeout(menuState.subCloseTimer);
      menuState.subCloseTimer = null;
    }
    if (menuState.sub) menuState.sub.remove();
    menuState.sub = null;
    menuState.subContext = null;
  }

  function detachOutsideHandlers() {
    if (menuState.outsideCloseHandler) {
      document.removeEventListener("mousedown", menuState.outsideCloseHandler, true);
      document.removeEventListener("touchstart", menuState.outsideCloseHandler, true);
      document.removeEventListener("contextmenu", menuState.outsideCloseHandler, true);
      menuState.outsideCloseHandler = null;
    }
    if (menuState.escHandler) {
      document.removeEventListener("keydown", menuState.escHandler, true);
      menuState.escHandler = null;
    }
  }

  function closeAllMenus() {
    if (menuState.subCloseTimer) {
      clearTimeout(menuState.subCloseTimer);
      menuState.subCloseTimer = null;
    }
    if (menuState.sub) menuState.sub.remove();
    if (menuState.root) menuState.root.remove();
    menuState.sub = null;
    menuState.root = null;
    menuState.subContext = null;
    detachOutsideHandlers();
  }

  function scheduleCloseSub(delay = 160) {
    if (menuState.subCloseTimer) clearTimeout(menuState.subCloseTimer);
    menuState.subCloseTimer = setTimeout(() => closeSubMenu(), delay);
  }

  function positionMenu(menu, x, y) {
    (document.body || document.documentElement).appendChild(menu);
    const r = menu.getBoundingClientRect();
    const pad = 8;
    let px = x, py = y;
    if (px + r.width + pad > innerWidth) px = Math.max(pad, innerWidth - r.width - pad);
    if (py + r.height + pad > innerHeight) py = Math.max(pad, innerHeight - r.height - pad);
    menu.style.left = `${px}px`;
    menu.style.top = `${py}px`;
  }

  function updateRootRowSub(kind, newSubText) {
    try {
      const root = menuState.root;
      if (!root) return;
      const row = root.querySelector(`.wmeRcItem[data-kind="${CSS.escape(kind)}"]`);
      if (!row) return;
      const sub = row.querySelector(".wmeRcSubText");
      if (!sub) return;
      sub.textContent = String(newSubText ?? "");
    } catch {}
  }

  function refreshActiveSubmenuIf(kind) {
    try {
      const ctx = menuState.subContext;
      if (!ctx || ctx.kind !== kind || !menuState.sub) return;
      const items = ctx.getItems ? ctx.getItems() : [];
      openSubMenuForRow(ctx.anchorEl, items, { kind: ctx.kind, getItems: ctx.getItems, keepContext: true });
    } catch (e) {
      console.error(e);
    }
  }

  function buildSpeedGrid(spec) {
    const wrap = document.createElement("div");
    wrap.className = "wmeRcSpeedWrap";

    const title = document.createElement("div");
    title.className = "wmeRcSpeedTitle";

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.gap = "8px";
    left.style.alignItems = "center";
    left.innerHTML = `<span class="wmeRcMuted">${spec.titleLeft || "Speed"}</span>`;

    const right = document.createElement("div");
    right.className = "wmeRcMuted";
    right.textContent = spec.titleRight || "";

    title.appendChild(left);
    title.appendChild(right);
    wrap.appendChild(title);

    if (spec.chipsEl) {
      const chipsWrap = document.createElement("div");
      chipsWrap.style.margin = "8px 0 8px 0";
      chipsWrap.appendChild(spec.chipsEl);
      wrap.appendChild(chipsWrap);
    }

    const grid = document.createElement("div");
    grid.className = "wmeRcSpeedGrid";

    for (const btn of (spec.buttons || [])) {
      const b = document.createElement("div");
      b.className = "wmeRcSpeedBtn" + (btn.selected ? " sel" : "");
      b.title = btn.title || "";
      if (btn.html) b.innerHTML = btn.html;
      else b.textContent = btn.text;

      b.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try { await btn.onClick(); }
        catch (err) { console.error(err); toast(String(err?.message || err)); }
      });

      grid.appendChild(b);
    }

    wrap.appendChild(grid);
    return wrap;
  }

  function buildMenuElement(spec) {
    ensureCSS();
    const menu = document.createElement("div");
    menu.className = "wmeRcMenu" + (spec.isSub ? " sub" : "");
    menu.setAttribute("role", "menu");

    menu.addEventListener("mousedown", (e) => { e.stopPropagation(); }, false);
    menu.addEventListener("click", (e) => { e.stopPropagation(); }, false);
    menu.addEventListener("contextmenu", (e) => { e.preventDefault(); e.stopPropagation(); }, true);

    if (!spec.isSub) {
      const hdr = document.createElement("div");
      hdr.className = "wmeRcHdr";
      hdr.innerHTML = `<div>${spec.headerLeft}</div><div class="wmeRcMuted">${spec.headerRight}</div>`;
      menu.appendChild(hdr);
    }

    for (const it of spec.items) {
      if (it.type === "speedGrid") { menu.appendChild(buildSpeedGrid(it)); continue; }
      if (it.type === "sep") { const sep = document.createElement("div"); sep.className = "wmeRcSep"; menu.appendChild(sep); continue; }

      const row = document.createElement("div");
      row.className = "wmeRcItem" + (it.disabled ? " disabled" : "") + (it.selected ? " selected" : "");
      row.setAttribute("role", "menuitem");
      if (it.kind) row.dataset.kind = String(it.kind);

      const left = document.createElement("div");
      left.className = "wmeRcLeft";
      left.innerHTML = `<div>${it.label}</div>${it.sub ? `<div class="wmeRcSubText">${it.sub}</div>` : ""}`;

      const right = document.createElement("div");
      right.style.display = "flex";
      right.style.gap = "8px";
      right.style.alignItems = "center";

      if (it.iconButton && typeof it.iconButton.onClick === "function") {
        const b = document.createElement("div");
        b.className = "wmeRcMiniBtn wmeRcMiniIcon";
        b.title = it.iconButton.title || "";
        b.innerHTML = it.iconButton.html || it.iconButton.label || "⚙";
        b.addEventListener("click", async (e) => {
          e.preventDefault();
          e.stopPropagation();
          try { await it.iconButton.onClick(); }
          catch (err) { console.error(err); toast(String(err?.message || err)); }
        });
        right.appendChild(b);
      }

      if (it.rightButton && typeof it.rightButton.onClick === "function") {
        const b = document.createElement("div");
        b.className = "wmeRcMiniBtn";
        b.innerHTML = it.rightButton.html || it.rightButton.label || "Open";
        b.addEventListener("click", async (e) => {
          e.preventDefault();
          e.stopPropagation();
          try { await it.rightButton.onClick(); }
          catch (err) { console.error(err); toast(String(err?.message || err)); }
        });
        right.appendChild(b);
      } else if (it.check) {
        right.insertAdjacentHTML("beforeend", `<span class="wmeRcCheck">✓</span>`);
      } else if (it.kbd) {
        right.insertAdjacentHTML("beforeend", `<span class="wmeRcKbd">${it.kbd}</span>`);
      } else if (it.submenu) {
        right.insertAdjacentHTML("beforeend", `<span class="wmeRcChevron">›</span>`);
      }

      row.appendChild(left);
      row.appendChild(right);

      if (!it.disabled && typeof it.onClick === "function" && !it.submenu) {
        row.addEventListener("click", async (e) => {
          e.preventDefault(); e.stopPropagation();
          try { await it.onClick(); }
          catch (err) { console.error(err); toast(String(err?.message || err)); }
        });
      }

      if (!it.disabled && it.submenu && typeof it.getSubmenuItems === "function") {
        row.addEventListener("mouseenter", () => {
          if (menuState.subCloseTimer) { clearTimeout(menuState.subCloseTimer); menuState.subCloseTimer = null; }
          let subItems = [];
          try { subItems = it.getSubmenuItems() || []; } catch (e) { console.error(e); }
          openSubMenuForRow(row, subItems, { kind: it.submenuKind || "generic", getItems: it.getSubmenuItems });
        });
        row.addEventListener("mouseleave", () => scheduleCloseSub(180));
      }

      menu.appendChild(row);
    }

    if (!spec.isSub) {
      menu.addEventListener("mouseleave", () => scheduleCloseSub(180));
      menu.addEventListener("mouseenter", () => {
        if (menuState.subCloseTimer) { clearTimeout(menuState.subCloseTimer); menuState.subCloseTimer = null; }
      });
    }

    return menu;
  }

  function attachOutsideCloseHandlers() {
    const handler = (e) => {
      const root = menuState.root;
      const sub = menuState.sub;
      const t = e.target;
      if (root && (root === t || root.contains(t))) return;
      if (sub && (sub === t || sub.contains(t))) return;
      closeAllMenus();
    };

    menuState.outsideCloseHandler = handler;
    document.addEventListener("mousedown", handler, true);
    document.addEventListener("touchstart", handler, true);
    document.addEventListener("contextmenu", handler, true);
}

  function openRootMenu(x, y, headerLeft, headerRight, items) {
    closeAllMenus();
    const root = buildMenuElement({ headerLeft, headerRight, items, isSub: false });
    menuState.root = root;
    positionMenu(root, x, y);
    attachOutsideCloseHandlers();
  }

  function openSubMenuForRow(rowEl, items, opts = {}) {
    const keepCtx = !!opts.keepContext;
    const prevCtx = menuState.subContext;

    closeSubMenu();
    if (!items || !items.length) return;

    const sub = buildMenuElement({ headerLeft: "", headerRight: "", items, isSub: true });
    menuState.sub = sub;

    const rr = rowEl.getBoundingClientRect();
    const margin = 8;
    let x = rr.right + margin;
    let y = rr.top - 8;

    sub.style.left = "0px";
    sub.style.top = "0px";
    (document.body || document.documentElement).appendChild(sub);
    const sr = sub.getBoundingClientRect();
    sub.remove();

    if (x + sr.width + 8 > innerWidth) x = Math.max(8, rr.left - margin - sr.width);
    if (y + sr.height + 8 > innerHeight) y = Math.max(8, innerHeight - sr.height - 8);

    positionMenu(sub, x, y);

    sub.addEventListener("mouseenter", () => {
      if (menuState.subCloseTimer) { clearTimeout(menuState.subCloseTimer); menuState.subCloseTimer = null; }
    });
    sub.addEventListener("mouseleave", () => scheduleCloseSub(180));

    if (keepCtx && prevCtx) {
      menuState.subContext = prevCtx;
    } else {
      menuState.subContext = {
        kind: String(opts.kind || "generic"),
        anchorEl: rowEl,
        getItems: typeof opts.getItems === "function" ? opts.getItems : () => items,
      };
    }
  }

  function openModal(spec) {
    ensureCSS();
    closeAllMenus();

    const backdrop = document.createElement("div");
    backdrop.className = "wmeRcModalBackdrop";

    const modal = document.createElement("div");
    modal.className = "wmeRcModal";

    const header = document.createElement("div");
    header.className = "wmeRcModalHdr";
    header.innerHTML = `
      <div class="wmeRcModalTitle"><span class="wmeRcI">${spec.iconSvg || ICONS.gear}</span><span>${spec.title || ""}</span></div>
      <div class="wmeRcModalBtn" id="wmeRcModalClose">Close</div>
    `;

    const body = document.createElement("div");
    body.className = "wmeRcModalBody";

    modal.appendChild(header);
    modal.appendChild(body);

    const close = () => {
      backdrop.classList.remove("show");
      modal.classList.remove("show");
      setTimeout(() => {
        backdrop.remove();
        modal.remove();
      }, 180);
    };
header.querySelector("#wmeRcModalClose").addEventListener("click", close);
    backdrop.addEventListener("click", close);
    (document.body || document.documentElement).appendChild(backdrop);
    (document.body || document.documentElement).appendChild(modal);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        backdrop.classList.add("show");
        modal.classList.add("show");
      });
    });

    if (typeof spec.bodyBuilder === "function") spec.bodyBuilder({ body, close, modal });

    return { close };
  }

  function isMapClick(clientX, clientY) {
    const el = document.elementFromPoint(clientX, clientY);
    if (!el) return false;
    if (el.tagName === "CANVAS") return true;
    if (el.closest && el.closest("canvas")) return true;
    if (el.closest && el.closest("#map, #WazeMap, .wme-map, [class*='map']")) return true;
    return false;
  }

  function isSegmentObjectType(v) {
    if (typeof v === "string") return /segment/i.test(v);
    const OT = sdk?.Editing?.ObjectType;
    if (typeof v === "number" && OT && OT.SEGMENT === v) return true;
    return /segment/i.test(String(v));
  }

  function extractSegmentIdsFromSelection(sel) {
    if (Array.isArray(sel)) {
      return sel
        .filter((o) => isSegmentObjectType(o?.objectType) || /segment/i.test(o?.localizedTypeName || ""))
        .map((o) => Number(o?.objectId ?? o?.id))
        .filter((n) => Number.isFinite(n));
    }
    if (sel && typeof sel === "object") {
      const type = sel.objectType ?? sel.type ?? sel.selectedObjectType;
      const ids = sel.ids ?? sel.objectIds ?? sel.selectedIds;
      if (isSegmentObjectType(type) && Array.isArray(ids)) {
        return ids.map((x) => Number(x)).filter((n) => Number.isFinite(n));
      }
      if (Array.isArray(sel.selection)) return extractSegmentIdsFromSelection(sel.selection);
      if (Array.isArray(sel.selectedItems)) return extractSegmentIdsFromSelection(sel.selectedItems);
      if (Array.isArray(sel.objects)) return extractSegmentIdsFromSelection(sel.objects);
    }
    return [];
  }

  function selectedSegmentIds() {
    try {
      const raw = sdk?.Editing?.getSelection?.();
      const ids = extractSegmentIdsFromSelection(raw);
      if (ids.length) return Array.from(new Set(ids));
    } catch {}

    try {
      const sm = UW?.W?.selectionManager;
      const items = sm?.getSelectedFeatures?.() || sm?.getSelectedItems?.() || [];
      if (Array.isArray(items)) {
        const segIds = items
          .map((x) => Number(x?.attributes?.id ?? x?.model?.attributes?.id ?? x?.id))
          .filter((n) => Number.isFinite(n));
        if (segIds.length) return Array.from(new Set(segIds));
      }
    } catch {}

    return [];
  }

  function fmt(n) { return Number(n).toFixed(6); }

  async function setClipboard(text) {
    try { if (typeof GM_setClipboard === "function") { GM_setClipboard(text); return true; } } catch {}
    try { await navigator.clipboard.writeText(text); return true; } catch {}
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {}
    return false;
  }

  function detectRankBase() {
    if (rankIsZeroBased !== null) return;
    rankIsZeroBased = !!(UW?.W?.loginManager?.user?.getRank);
  }

  function normalizeToLevel(raw) {
    if (!Number.isFinite(raw)) return null;
    detectRankBase();
    if (raw === 0) return 1;
    if (rankIsZeroBased && raw >= 0 && raw <= 10) return raw + 1;
    return raw;
  }

  function readLevelFromW() {
    try {
      const u = UW?.W?.loginManager?.user;
      if (typeof u?.getRank === "function") {
        const r = u.getRank();
        if (Number.isFinite(r)) return r + 1;
      }
      const candidates = [
        u?.level, u?.attributes?.level,
        u?.rank,  u?.attributes?.rank,
        UW?.W?.user?.level, UW?.W?.user?.rank,
        UW?.W?.app?.user?.level, UW?.W?.app?.user?.rank,
      ].map((x) => Number(x)).filter((x) => Number.isFinite(x));
      for (const c of candidates) {
        const lvl = normalizeToLevel(c);
        if (Number.isFinite(lvl)) return lvl;
      }
    } catch {}
    return null;
  }

  function readLevelFromSdk() {
    try {
      const a = sdk?.UserSession?.getUserInfo?.()?.rank;
      const lvlA = normalizeToLevel(Number(a));
      if (Number.isFinite(lvlA)) return lvlA;
    } catch {}
    try {
      const b = sdk?.WmeState?.getUserInfo?.()?.rank;
      const lvlB = normalizeToLevel(Number(b));
      if (Number.isFinite(lvlB)) return lvlB;
    } catch {}
    return null;
  }

  function getUserLevel() {
    if (Number.isFinite(cachedUserLevel)) return cachedUserLevel;
    const fromW = readLevelFromW();
    if (Number.isFinite(fromW)) return (cachedUserLevel = fromW);
    const fromSdk = readLevelFromSdk();
    if (Number.isFinite(fromSdk)) return (cachedUserLevel = fromSdk);
    return null;
  }

  function decideLockBase(sampleLockRank, userLevel) {
    if (lockIsZeroBased !== null) return lockIsZeroBased;
    if (Number.isFinite(sampleLockRank) && sampleLockRank >= 0 && sampleLockRank <= 6) { lockIsZeroBased = true; return true; }
    if (Number.isFinite(sampleLockRank) && Number.isFinite(userLevel) && userLevel >= 2) {
      if (sampleLockRank === userLevel - 1) { lockIsZeroBased = true; return true; }
    }
    lockIsZeroBased = false;
    return false;
  }

  function lockRankToLevel(lockRank, userLevelMaybe) {
    if (!Number.isFinite(lockRank)) return null;
    return decideLockBase(lockRank, userLevelMaybe) ? lockRank + 1 : lockRank;
  }

  function levelToLockRank(level, lockRankSample, userLevelMaybe) {
    if (!Number.isFinite(level)) return null;
    return decideLockBase(lockRankSample, userLevelMaybe) ? level - 1 : level;
  }

  function sdkSegGetById(segmentId) {
    return (
      sdk?.Segments?.getById?.({ segmentId }) ??
      sdk?.DataModel?.Segments?.getById?.({ segmentId }) ??
      null
    );
  }

  function sdkStreetsGetById(streetId) {
    return (
      sdk?.Streets?.getById?.({ streetId }) ??
      sdk?.DataModel?.Streets?.getById?.({ streetId }) ??
      null
    );
  }

  function sdkSegUpdateSegment(segmentId, attrs) {
    if (typeof sdk?.Segments?.updateSegment === "function") {
      return sdk.Segments.updateSegment({ segmentId, ...attrs });
    }
    if (typeof sdk?.DataModel?.Segments?.updateSegment === "function") {
      return sdk.DataModel.Segments.updateSegment({ segmentId, ...attrs });
    }
    throw new Error("No SDK Segments.updateSegment available.");
  }


  function segWGetById(id) {
    try {
      const n = Number(id);
      const segs = UW?.W?.model?.segments;
      if (!segs || typeof segs.getObjectById !== "function") return null;
      return segs.getObjectById(n) || null;
    } catch {
      return null;
    }
  }

  function wAddAction(action) {
    try {
      const am = UW?.W?.model?.actionManager;
      if (!am || typeof am.add !== "function") return false;
      am.add(action);
      return true;
    } catch {
      return false;
    }
  }

  function wUpdateObject(modelObj, attrs) {
    try {
      const A = UW?.W?.Action;
      if (!A) return false;
      const C =
        A.UpdateObject ||
        A.UpdateModelObject ||
        A.UpdateSegment ||
        A.UpdateSegmentAttributes ||
        null;
      if (typeof C !== "function") return false;

      try {
        return wAddAction(new C(modelObj, attrs));
      } catch {
        return wAddAction(new C(modelObj, modelObj?.attributes || {}, attrs));
      }
    } catch {
      return false;
    }
  }

  function wSetSegmentDirection(segW, targetMode) {
    const fwd = targetMode === "2" || targetMode === "A";
    const rev = targetMode === "2" || targetMode === "B";
    const attrs = { fwdDirection: fwd, revDirection: rev, isAtoB: fwd, isBtoA: rev };
    return wUpdateObject(segW, attrs);
  }

  function wReverseSegmentDirection(segW) {
    try {
      const A = UW?.W?.Action;
      if (!A) return false;
      const names = [
        "ReverseSegmentDirection",
        "ReverseSegmentsDirection",
        "ReverseSegment",
        "ReverseSegmentGeometry",
      ];
      for (const n of names) {
        const C = A[n];
        if (typeof C !== "function") continue;
        try {
          if (wAddAction(new C(segW))) return true;
        } catch {}
        try {
          if (wAddAction(new C(segW?.attributes?.id ?? segW?.id))) return true;
        } catch {}
      }
      return false;
    } catch {
      return false;
    }
  }

  function getAllLoadedSegmentsW() {
    try {
      const segs = UW?.W?.model?.segments;
      if (!segs) return [];
      if (typeof segs.getObjectArray === "function") return segs.getObjectArray() || [];
      if (segs.objects && typeof segs.objects === "object") return Object.values(segs.objects).filter(Boolean);
    } catch {}
    return [];
  }

  function segIdFromW(segW) {
    return Number(segW?.attributes?.id ?? segW?.id ?? (typeof segW?.getID === "function" ? segW.getID() : NaN));
  }

  function primaryStreetIdFromW(segW) {
    const a = segW?.attributes || {};
    return a.primaryStreetID ?? a.primaryStreetId ?? a.primaryStreet ?? segW?.primaryStreetId ?? null;
  }

  function lockRankFromW(segW) {
    const a = segW?.attributes || {};
    const v = a.lockRank ?? segW?.lockRank;
    return Number.isFinite(Number(v)) ? Number(v) : null;
  }

  function dirFromW(segW) {
    const a = segW?.attributes || {};
    const isAtoB = (typeof segW?.isAtoB === "boolean") ? segW.isAtoB :
      (typeof a.isAtoB === "boolean") ? a.isAtoB :
      (typeof a.fwdDirection === "boolean") ? a.fwdDirection : null;

    const isBtoA = (typeof segW?.isBtoA === "boolean") ? segW.isBtoA :
      (typeof a.isBtoA === "boolean") ? a.isBtoA :
      (typeof a.revDirection === "boolean") ? a.revDirection : null;

    const twoWay = (isAtoB === true && isBtoA === true);
    if (twoWay) return { mode: "2", isAtoB: true, isBtoA: true };
    if (isAtoB === true && isBtoA === false) return { mode: "A", isAtoB: true, isBtoA: false };
    if (isAtoB === false && isBtoA === true) return { mode: "B", isAtoB: false, isBtoA: true };
    return { mode: "?", isAtoB, isBtoA };
  }

  function speedFromW(segW) {
    const a = segW?.attributes || {};
    const f = a.fwdSpeedLimit ?? segW?.fwdSpeedLimit;
    const r = a.revSpeedLimit ?? segW?.revSpeedLimit;
    const nf = (f == null ? null : Number(f));
    const nr = (r == null ? null : Number(r));
    return { f: Number.isFinite(nf) ? nf : null, r: Number.isFinite(nr) ? nr : null };
  }


function elevationFromW(segW) {
  const a = segW?.attributes || {};
  const v = a.level ?? a.elevation ?? segW?.level ?? segW?.elevation;
  const n = (v == null ? null : Number(v));
  return Number.isFinite(n) ? n : null;
}

function getSegLevelById(segmentId) {
  try {
    const seg = sdkSegGetById(segmentId);
    if (Number.isFinite(seg?.level)) return Number(seg.level);
    if (Number.isFinite(seg?.elevation)) return Number(seg.elevation);
    if (seg?.attributes && Number.isFinite(seg.attributes.level)) return Number(seg.attributes.level);
    if (seg?.attributes && Number.isFinite(seg.attributes.elevation)) return Number(seg.attributes.elevation);
  } catch {}
  try {
    const segW = UW?.W?.model?.segments?.getObjectById?.(Number(segmentId));
    return segW ? elevationFromW(segW) : null;
  } catch {}
  return null;
}

function setSegLevelById(segmentId, level) {
  const lvl = (level == null ? null : Number(level));
  if (!Number.isFinite(lvl)) return false;

  // SDK attempt (some builds may support it)
  try {
    sdkSegUpdateSegment(segmentId, { level: lvl });
    return true;
  } catch {}

  // W.model fallback
  try {
    const segW = UW?.W?.model?.segments?.getObjectById?.(Number(segmentId));
    if (!segW) return false;

    const cur = elevationFromW(segW);
    if (cur === lvl) return true;

    const AM = UW?.W?.model?.actionManager;
    const WA = UW?.W?.Action;

    if (AM && WA) {
      if (typeof WA.UpdateObject === "function") { AM.add(new WA.UpdateObject(segW, { level: lvl })); return true; }
      if (typeof WA.UpdateSegment === "function") { AM.add(new WA.UpdateSegment(segW, { level: lvl })); return true; }
    }

    if (typeof segW.setAttribute === "function") { segW.setAttribute("level", lvl); return true; }
    if (segW.attributes) { segW.attributes.level = lvl; return true; }
  } catch {}
  return false;
}


  function setSelectionToSegmentIds(ids) {
    const uniq = Array.from(new Set((ids || []).map(Number).filter(Number.isFinite)));
    if (!uniq.length) { toast("Nothing to select (not loaded)."); return false; }

    try {
      if (sdk?.Editing?.ObjectType?.SEGMENT != null && typeof sdk?.Editing?.setSelection === "function") {
        sdk.Editing.setSelection({
          selection: uniq.map((id) => ({ objectType: sdk.Editing.ObjectType.SEGMENT, objectId: id })),
        });
        toast(`Selected ${uniq.length} segment(s)`);
        return true;
      }
    } catch {}

    try {
      const sm = UW?.W?.selectionManager;
      const segs = UW?.W?.model?.segments;
      if (sm && segs && typeof segs.getObjectById === "function") {
        const models = uniq.map((id) => segs.getObjectById(id)).filter(Boolean);
        if (models.length) {
          if (typeof sm.setSelectedModels === "function") {
            sm.setSelectedModels(models);
            toast(`Selected ${models.length} segment(s)`);
            return true;
          }
          if (typeof sm.setSelectedItems === "function") {
            sm.setSelectedItems(models);
            toast(`Selected ${models.length} segment(s)`);
            return true;
          }
        }
      }
    } catch {}

    toast("Selection API not available (WME changed).");
    return false;
  }

  function getSegmentsLockInfo(segIds) {
    const locks = [];
    for (const id of segIds) {
      const seg = sdkSegGetById(id);
      const lk = seg?.lockRank;
      if (Number.isFinite(lk)) locks.push(lk);
    }
    if (!locks.length) return { currentRaw: null, currentLevel: null, mixed: false };
    const first = locks[0];
    const mixed = locks.some((x) => x !== first);
    const userLevel = getUserLevel();
    const lvl = mixed ? null : lockRankToLevel(first, userLevel);
    return { currentRaw: first, currentLevel: lvl, mixed };
  }

  async function setLockForSelection(segIds, targetLevel) {
    const userLevel = getUserLevel() ?? 1;
    const lockInfo = getSegmentsLockInfo(segIds);
    const rawToSet = levelToLockRank(targetLevel, lockInfo.currentRaw, userLevel);
    if (!Number.isFinite(rawToSet)) throw new Error("Could not compute lock rank to set.");

    let ok = 0, fail = 0;
    for (const id of segIds) {
      try { await sdkSegUpdateSegment(id, { lockRank: rawToSet }); ok++; }
      catch { fail++; }
    }
    toast(`Lock ${targetLevel} • ${ok}/${segIds.length}${fail ? `, ${fail} failed` : ""}`);
    updateRootRowSub("lock", fail ? "mixed" : `L${targetLevel}`);
    refreshActiveSubmenuIf("lock");
  }

  function buildLockSubmenu(segIds) {
    const userLevel = getUserLevel() ?? 1;
    const maxLevel = Math.min(6, Math.max(1, userLevel));
    const lockInfo = getSegmentsLockInfo(segIds);

    const items = [
      { label: withIcon(ICONS.lock, "Lock level"), sub: lockInfo.mixed ? "mixed" : `current L${lockInfo.currentLevel ?? "?"}`, disabled: true },
      { type: "sep" },
    ];

    for (let lvl = 1; lvl <= maxLevel; lvl++) {
      const isCurrent = (!lockInfo.mixed && lockInfo.currentLevel != null && lockInfo.currentLevel === lvl);
      items.push({
        label: `Lock ${lvl}`,
        selected: isCurrent,
        check: isCurrent,
        onClick: () => setLockForSelection(segIds, lvl),
      });
    }
    return items;
  }

  function dirSummaryForSelection(segIds) {
    const modes = [];
    for (const id of segIds) {
      const seg = sdkSegGetById(id);
      if (!seg) continue;
      const is2 = !!seg.isTwoWay;
      const isA = !!seg.isAtoB;
      const isB = !!seg.isBtoA;
      if (is2) modes.push("2");
      else if (isA) modes.push("A");
      else if (isB) modes.push("B");
      else if (seg.allowNoDirection) modes.push("N");
      else modes.push("?");
    }
    if (!modes.length) return { mode: "?", mixed: false };
    const first = modes[0];
    const mixed = modes.some((m) => m !== first);
    return { mode: mixed ? "M" : first, mixed };
  }

  function modeLabel(mode) {
    if (mode === "2") return "2-way";
    if (mode === "A") return "A→B";
    if (mode === "B") return "B→A";
    if (mode === "N") return "no-dir";
    if (mode === "M") return "mixed";
    return "unknown";
  }

    async function setDirectionForSelection(segIds, targetMode) {
    let ok = 0, fail = 0;
    const dir = targetMode === "2" ? "TWO_WAY" : targetMode === "A" ? "A_TO_B" : targetMode === "B" ? "B_TO_A" : null;

    for (const id of segIds) {
      let done = false;
      if (dir) {
        try {
          await sdkSegUpdateSegment(id, { direction: dir });
          done = true;
        } catch {}
      }

      if (!done) {
        const segW = segWGetById(id);
        if (segW && wSetSegmentDirection(segW, targetMode)) done = true;
      }

      if (done) ok++;
      else fail++;
    }

    toast(`Direction → ${modeLabel(targetMode)} • ${ok}/${segIds.length}${fail ? `, ${fail} failed` : ""}`);
    updateRootRowSub("dir", fail ? "mixed" : modeLabel(targetMode));
    refreshActiveSubmenuIf("dir");
  }

    async function flipDirectionForSelection(segIds) {
    let ok = 0, fail = 0;

    for (const id of segIds) {
      let done = false;

      const segW = segWGetById(id);
      if (segW && wReverseSegmentDirection(segW)) done = true;

      if (!done) {
        try {
          const seg = sdkSegGetById(id);
          if (!seg) throw new Error("missing");
          const next = seg.isAtoB && !seg.isBtoA ? "B_TO_A" : seg.isBtoA && !seg.isAtoB ? "A_TO_B" : null;
          if (!next) throw new Error("not flippable");
          await sdkSegUpdateSegment(id, { direction: next });
          done = true;
        } catch {}
      }

      if (done) ok++;
      else fail++;
    }

    toast(`Flipped direction • ${ok}/${segIds.length}${fail ? `, ${fail} failed` : ""}`);
    const info = dirSummaryForSelection(segIds);
    updateRootRowSub("dir", info.mixed ? "mixed" : modeLabel(info.mode));
    refreshActiveSubmenuIf("dir");
  }

  function buildDirectionSubmenu(segIds) {
    const info = dirSummaryForSelection(segIds);
    const cur = info.mixed ? "M" : info.mode;

    return [
      { label: withIcon(ICONS.arrows, "Direction"), sub: `current: ${modeLabel(cur)}`, disabled: true },
      { type: "sep" },
      { label: withIcon(ICONS.arrows, "Flip direction"), sub: "Swap A→B / B→A (2-way unchanged)", onClick: () => flipDirectionForSelection(segIds) },
      { type: "sep" },
      { label: "Make 2-way", sub: "A→B + B→A", selected: (!info.mixed && info.mode === "2"), check: (!info.mixed && info.mode === "2"), onClick: () => setDirectionForSelection(segIds, "2") },
      { label: "Make 1-way A→B", sub: "Forward only", selected: (!info.mixed && info.mode === "A"), check: (!info.mixed && info.mode === "A"), onClick: () => setDirectionForSelection(segIds, "A") },
      { label: "Make 1-way B→A", sub: "Reverse only", selected: (!info.mixed && info.mode === "B"), check: (!info.mixed && info.mode === "B"), onClick: () => setDirectionForSelection(segIds, "B") },
    ];
  }

  function getSegDirectionMode(seg) {
    if (!seg) return "BOTH";
    if (seg.isTwoWay) return "BOTH";
    if (seg.isAtoB && !seg.isBtoA) return "FWD";
    if (seg.isBtoA && !seg.isAtoB) return "REV";
    return "BOTH";
  }

  function getSegmentsSpeedInfo(segIds) {
    let any = 0, firstKey = null, mixed = false;

    for (const id of segIds) {
      const seg = sdkSegGetById(id);
      if (!seg) continue;
      any++;

      const mode = getSegDirectionMode(seg);
      const f = seg.fwdSpeedLimit;
      const r = seg.revSpeedLimit;

      const key =
        mode === "FWD" ? `F:${f ?? "∅"}` :
        mode === "REV" ? `R:${r ?? "∅"}` :
        `B:${(f ?? "∅")}/${(r ?? "∅")}`;

      if (firstKey === null) firstKey = key;
      else if (firstKey !== key) mixed = true;
      if (mixed) break;
    }

    if (!any) return { summary: "unknown", mixed: true };
    if (mixed) return { summary: "mixed", mixed: true };

    const seg0 = sdkSegGetById(segIds[0]);
    const mode0 = getSegDirectionMode(seg0);

    if (mode0 === "FWD") return { summary: seg0?.fwdSpeedLimit == null ? "none" : `${seg0.fwdSpeedLimit}`, mixed: false };
    if (mode0 === "REV") return { summary: seg0?.revSpeedLimit == null ? "none" : `${seg0.revSpeedLimit}`, mixed: false };

    const a = seg0?.fwdSpeedLimit;
    const b = seg0?.revSpeedLimit;
    return { summary: `${a ?? "∅"}/${b ?? "∅"}`, mixed: false };
  }

  function getCurrentSpeedValueForChoice(segIds, choice) {
    const seg0 = sdkSegGetById(segIds[0]);
    if (!seg0) return { value: null, mixed: true };

    const info = getSegmentsSpeedInfo(segIds);
    if (info.mixed) return { value: null, mixed: true };

    const mode = getSegDirectionMode(seg0);
    if (mode !== "BOTH") {
      const v = (mode === "FWD") ? seg0.fwdSpeedLimit : seg0.revSpeedLimit;
      return { value: (v == null ? null : Number(v)), mixed: false };
    }

    if (choice === "FWD") return { value: seg0.fwdSpeedLimit == null ? null : Number(seg0.fwdSpeedLimit), mixed: false };
    if (choice === "REV") return { value: seg0.revSpeedLimit == null ? null : Number(seg0.revSpeedLimit), mixed: false };

    const f = seg0.fwdSpeedLimit, r = seg0.revSpeedLimit;
    if (f == null && r == null) return { value: null, mixed: false };
    if (f != null && r != null && Number(f) === Number(r)) return { value: Number(f), mixed: false };
    return { value: null, mixed: true };
  }

  async function setSpeedForSelection(segIds, valueOrNull, modeOverride = "AUTO", keepOpen = false) {
    let ok = 0, fail = 0;

    for (const id of segIds) {
      const seg = sdkSegGetById(id);
      if (!seg) { fail++; continue; }

      const mode = getSegDirectionMode(seg);
      const patch = {};

      if (mode !== "BOTH") {
        if (mode === "FWD") patch.fwdSpeedLimit = valueOrNull;
        else patch.revSpeedLimit = valueOrNull;
      } else {
        const eff = (modeOverride === "AUTO" ? "BOTH" : modeOverride);
        if (eff === "FWD") patch.fwdSpeedLimit = valueOrNull;
        else if (eff === "REV") patch.revSpeedLimit = valueOrNull;
        else { patch.fwdSpeedLimit = valueOrNull; patch.revSpeedLimit = valueOrNull; }
      }

      try { sdkSegUpdateSegment(id, patch); ok++; }
      catch { fail++; }
    }

    const label = valueOrNull == null ? "cleared" : `→ ${valueOrNull}`;
    const suffix = (modeOverride !== "AUTO") ? ` (${modeOverride === "BOTH" ? "Both" : modeOverride === "FWD" ? "A→B" : "B→A"})` : "";
    toast(`Speed ${label}${suffix} • ${ok}/${segIds.length}${fail ? `, ${fail} failed` : ""}`);

    if (keepOpen) {
      refreshActiveSubmenuIf("speed");
      const speedSummary = getSegmentsSpeedInfo(segIds).summary;
      updateRootRowSub("speed", speedSummary);
      return;
    }
    closeAllMenus();
  }

  function buildSpeedDirectionChips(isTwoWay, segIds) {
    if (!isTwoWay) return null;

    const wrap = document.createElement("div");
    wrap.className = "wmeRcChips";

    const mk = (id, label) => {
      const b = document.createElement("div");
      b.className = "wmeRcChip" + (speedDirChoice === id ? " on" : "");
      b.textContent = label;
      b.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        speedDirChoice = id;
        refreshActiveSubmenuIf("speed");
        const speedSummary = getSegmentsSpeedInfo(segIds).summary;
        updateRootRowSub("speed", speedSummary);
      });
      return b;
    };

    wrap.appendChild(mk("BOTH", "Both"));
    wrap.appendChild(mk("FWD", "A→B"));
    wrap.appendChild(mk("REV", "B→A"));
    return wrap;
  }

  function buildSpeedSubmenu(segIds) {
    const seg0 = sdkSegGetById(segIds[0]);
    const isTwoWay = !!seg0?.isTwoWay;

    const speeds = [20,30,40,50,60,70,80,90,100,110,120,130];
    const cur = getCurrentSpeedValueForChoice(segIds, speedDirChoice);
    const curTxt = cur.mixed ? "current: mixed" : (cur.value == null ? "current: none" : `current: ${cur.value}`);
    const chips = buildSpeedDirectionChips(isTwoWay, segIds);

    return [{
      type: "speedGrid",
      titleLeft: isTwoWay ? "Speed limit • choose direction" : "Speed limit",
      titleRight: curTxt,
      chipsEl: chips,
      buttons: [
        ...speeds.map((s) => ({
          text: String(s),
          title: `${s} km/h`,
          selected: (!cur.mixed && cur.value != null && Number(cur.value) === s),
          onClick: () => setSpeedForSelection(segIds, s, isTwoWay ? speedDirChoice : "AUTO", true),
        })),
        {
          html: ICONS.trash,
          title: "Clear speed",
          selected: (!cur.mixed && cur.value == null),
          onClick: () => setSpeedForSelection(segIds, null, isTwoWay ? speedDirChoice : "AUTO", true),
        },
      ],
    }];
  }

  function segmentCoords(segmentId) {
    const seg = sdkSegGetById(segmentId);
    const c = seg?.geometry?.coordinates;
    if (!Array.isArray(c)) return [];
    return c
      .filter((p) => Array.isArray(p) && p.length >= 2)
      .map((p) => [Number(p[0]), Number(p[1])])
      .filter(([lon, lat]) => Number.isFinite(lon) && Number.isFinite(lat));
  }

  function bboxFromSegments(segIds) {
    const coords = [];
    for (const id of segIds) coords.push(...segmentCoords(id));
    if (!coords.length) return null;

    let left = Infinity, bottom = Infinity, right = -Infinity, top = -Infinity;
    for (const [lon, lat] of coords) {
      if (lon < left) left = lon;
      if (lon > right) right = lon;
      if (lat < bottom) bottom = lat;
      if (lat > top) top = lat;
    }
    return isFinite(left) ? [left, bottom, right, top] : null;
  }

  async function zoomToSegments(segIds) {
    const bbox = bboxFromSegments(segIds);
    if (!bbox || typeof sdk?.Map?.zoomToExtent !== "function") throw new Error("Zoom unavailable.");
    sdk.Map.zoomToExtent({ bbox });
  }

  async function actionZoomTo(segIds) {
    try { await zoomToSegments(segIds); toast("Zoomed."); }
    catch { toast("Zoom unavailable."); }
    closeAllMenus();
  }

  function zoomToLonLat(lon, lat) {
    let moved = false;
    try {
      if (typeof sdk?.Map?.zoomToExtent === "function") {
        const d = 0.0009;
        sdk.Map.zoomToExtent({ bbox: [lon - d, lat - d, lon + d, lat + d] });
        moved = true;
      }
    } catch {}
    if (!moved) {
      try {
        if (typeof sdk?.Map?.setCenter === "function") {
          sdk.Map.setCenter({ lon, lat });
          moved = true;
        }
      } catch {}
    }
    if (moved) applyVisibleCenterOffset();
    return moved;
  }

  function applyVisibleCenterOffset() {
    const dx = computeVisibleCenterPanDx();
    if (!dx) return;
    requestAnimationFrame(() => requestAnimationFrame(() => { panByPx(dx, 0); }));
  }

  function computeVisibleCenterPanDx() {
    const left = measureSideObstructionPx("left");
    const right = measureSideObstructionPx("right");
    const net = (left - right) / 2;
    const dx = -Math.round(net);
    return Math.abs(dx) >= 10 ? dx : 0;
  }

  function measureSideObstructionPx(side) {
    const mapEl = document.querySelector("#map") || document.querySelector(".olMap") || null;
    const mapRect = mapEl ? mapEl.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight, width: window.innerWidth, height: window.innerHeight };

    const x = side === "left" ? Math.max(2, mapRect.left + 4) : Math.min(window.innerWidth - 2, mapRect.right - 4);
    const y = Math.min(window.innerHeight - 2, Math.max(2, mapRect.top + Math.min(360, mapRect.height * 0.35)));

    let stack = [];
    try { stack = document.elementsFromPoint(x, y) || []; } catch {}

    for (const el of stack) {
      if (!el || el === document.documentElement || el === document.body) continue;
      if (mapEl && (el === mapEl || mapEl.contains(el))) continue;

      const r = el.getBoundingClientRect();
      if (r.width < 140 || r.height < 200) continue;
      if (r.bottom <= mapRect.top + 10 || r.top >= mapRect.bottom - 10) continue;

      const overlapsHoriz = !(r.right <= mapRect.left + 2 || r.left >= mapRect.right - 2);
      if (!overlapsHoriz) continue;

      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      if (Number(cs.opacity) === 0) continue;

      if (side === "left") {
        const covered = Math.max(0, Math.min(r.right, mapRect.right) - mapRect.left);
        return covered;
      }
      const covered = Math.max(0, mapRect.right - Math.max(r.left, mapRect.left));
      return covered;
    }

    return 0;
  }

  function panByPx(dx, dy) {
    dx = Math.round(dx || 0);
    dy = Math.round(dy || 0);
    if (!dx && !dy) return false;

    try {
      const olMap = UW?.W?.map;
      if (olMap) {
        if (typeof olMap.pan === "function") { olMap.pan(dx, dy, { animate: false }); return true; }
        if (typeof olMap.moveByPx === "function") { olMap.moveByPx(dx, dy); return true; }
      }
    } catch {}

    try {
      const getLL = sdk?.Map?.getLonLatFromPixel;
      const setC = sdk?.Map?.setCenter;
      if (typeof getLL === "function" && typeof setC === "function") {
        const x = Math.round(window.innerWidth / 2 + dx);
        const y = Math.round(window.innerHeight / 2 + dy);
        const ll = getLL({ x, y });
        if (ll && isFinite(ll.lon) && isFinite(ll.lat)) {
          setC({ lon: ll.lon, lat: ll.lat });
          return true;
        }
      }
    } catch {}

    return false;
  }

  function getSegmentEndpoints(segId) {
    const coords = segmentCoords(segId);
    if (!coords.length) return null;
    const a = coords[0];
    const b = coords[coords.length - 1];
    return { a: { lon: a[0], lat: a[1] }, b: { lon: b[0], lat: b[1] } };
  }

  async function goToEndpoint(segId, which) {
    const ep = getSegmentEndpoints(segId);
    if (!ep) { toast("Segment not loaded (zoom in to load)."); return; }
    const p = which === "A" ? ep.a : ep.b;
    const ok = zoomToLonLat(p.lon, p.lat);
    toast(ok ? `Moved to ${which} node` : "Move failed (API mismatch).");
    closeAllMenus();
  }

  function buildEndpointsSubmenu(segIds) {
    if (segIds.length !== 1) return [{ label: withIcon(ICONS.endpoints, "Endpoints"), sub: "Select 1 segment", disabled: true }];
    return [
      { label: withIcon(ICONS.endpoints, "Endpoints"), sub: "Go to A/B node", disabled: true },
      { type: "sep" },
      { label: "Go to A node", sub: "Start of segment", onClick: () => goToEndpoint(segIds[0], "A") },
      { label: "Go to B node", sub: "End of segment", onClick: () => goToEndpoint(segIds[0], "B") },
    ];
  }

  async function actionCopySegmentIds(segIds) {
    const text = segIds.join(", ");
    await setClipboard(text);
    toast(`Copied ID(s): ${text}`);
    closeAllMenus();
  }

  async function actionCopyStreetName(firstSegId) {
    const seg = sdkSegGetById(firstSegId);
    if (!seg) { toast("Segment not found (zoom in until it loads)."); closeAllMenus(); return; }

    const streetId = seg.primaryStreetId;
    if (streetId == null) { await setClipboard("(no street)"); toast("Copied: (no street)"); closeAllMenus(); return; }

    const street = sdkStreetsGetById(streetId);
    const name = street?.streetName ?? street?.name ?? street?.englishName ?? "(unknown street)";
    await setClipboard(String(name));
    toast(`Copied street: ${name}`);
    closeAllMenus();
  }

  function lonLatFromClick(clientX, clientY) {
    try {
      const fn = sdk?.Map?.getLonLatFromPixel;
      if (typeof fn === "function") {
        const ll = fn({ x: clientX, y: clientY });
        if (ll && isFinite(ll.lon) && isFinite(ll.lat)) return ll;
      }
    } catch {}
    return lastLonLat;
  }


  function gmapsUrlFromLonLat(ll) {
    return `${GMAPS_BASE}${fmt(ll.lat)},${fmt(ll.lon)}`;
  }

  function getZoomLevelBestEffort() {
    try {
      if (typeof sdk?.Map?.getZoom === "function") {
        const z = sdk.Map.getZoom();
        if (Number.isFinite(z)) return z;
      }
    } catch {}
    try {
      const z = UW?.W?.map?.getZoom?.();
      if (Number.isFinite(z)) return z;
    } catch {}
    return null;
  }

  function buildPermalink(ll, segIds = null) {
    const z = getZoomLevelBestEffort();

    // Build a clean permalink that never drags along transient editor state
    // (e.g. issue/report panels). Keep only the minimal context params.
    const cur = new URLSearchParams(location.search);
    const params = new URLSearchParams();

    for (const k of ["env", "tab", "language", "locale", "country"]) {
      if (cur.has(k)) params.set(k, cur.get(k));
    }

    params.set("lat", fmt(ll.lat));
    params.set("lon", fmt(ll.lon));

    if (Number.isFinite(z)) params.set("zoomLevel", String(z));

    if (Array.isArray(segIds) && segIds.length) params.set("segments", segIds.join(","));

    const qs = params.toString();
    return qs ? `${EDITOR_BASE}?${qs}` : EDITOR_BASE;
  }

  async function copyCoordsLatLon(ll) {
    await setClipboard(`${fmt(ll.lat)}, ${fmt(ll.lon)}`);
    toast("Copied: lat,lon");
    closeAllMenus();
  }

  async function copyCoordsGmaps(ll) {
    await setClipboard(gmapsUrlFromLonLat(ll));
    toast("Copied: Google Maps link");
    closeAllMenus();
  }
  async function copyPermalink(ll, segIds = null) {
    const url = buildPermalink(ll, segIds);
    await setClipboard(url);
    toast("Copied: permalink");
    closeAllMenus();
  }

  function refreshHere(ll, segIds = null) {
    try {
      if (!ll || !Number.isFinite(ll.lat) || !Number.isFinite(ll.lon)) {
        toast("No map position yet. Move mouse on map first.");
        closeAllMenus();
        return;
      }
      const url = buildPermalink(ll, segIds);
      closeAllMenus();
      location.replace(url);
    } catch (e) {
      try { closeAllMenus(); location.reload(); } catch {}
    }
  }


  function parseNumbersFromString(s) {
    return (s.match(/-?\d+(\.\d+)?/g) || []).map(Number).filter(n => Number.isFinite(n));
  }

  function tryParseCoords(input) {
    const nums = parseNumbersFromString(input);
    if (nums.length < 2) return null;
    const a = nums[0], b = nums[1];

    const aIsLat = Math.abs(a) <= 90, bIsLon = Math.abs(b) <= 180;
    const aIsLon = Math.abs(a) <= 180, bIsLat = Math.abs(b) <= 90;

    if (aIsLat && bIsLon) return { lat: a, lon: b };
    if (aIsLon && bIsLat) return { lat: b, lon: a };
    return null;
  }

  function tryParsePermalink(input) {
    if (!/lat=|lon=|zoomLevel=|segments=/i.test(input)) return null;

    const lat = (() => {
      const m = input.match(/(?:\?|&)lat=([-0-9.]+)/i);
      return m ? Number(m[1]) : null;
    })();
    const lon = (() => {
      const m = input.match(/(?:\?|&)lon=([-0-9.]+)/i);
      return m ? Number(m[1]) : null;
    })();
    const zoom = (() => {
      const m = input.match(/(?:\?|&)zoomLevel=([0-9]+)/i);
      return m ? Number(m[1]) : null;
    })();

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
    return { lat, lon, zoom: Number.isFinite(zoom) ? zoom : null };
  }

  async function jumpToCoords(lat, lon, zoomMaybe) {
    try {
      if (sdk?.Map?.setCenter && typeof sdk.Map.setCenter === "function") {
        sdk.Map.setCenter({ lon, lat });
      } else if (sdk?.Map?.zoomToExtent) {
        const d = 0.0025;
        sdk.Map.zoomToExtent({ bbox: [lon - d, lat - d, lon + d, lat + d] });
      }
      if (Number.isFinite(zoomMaybe) && typeof sdk?.Map?.setZoom === "function") {
        sdk.Map.setZoom({ zoomLevel: zoomMaybe });
      }
      toast(`Jumped to ${fmt(lat)}, ${fmt(lon)}`);
    } catch (e) {
      console.error(e);
      toast("Jump failed (API mismatch).");
    }
  }

  function showJumpModal(prefill = "") {
    openModal({
      title: "Jump / Search",
      iconSvg: ICONS.jump,
      bodyBuilder: ({ body, close }) => {
        const inp = document.createElement("input");
        inp.className = "wmeRcInput";
        inp.placeholder = "Paste coords, permalink, or segment ID…";
        inp.value = prefill || "";

        const hint = document.createElement("div");
        hint.className = "wmeRcHint";
        hint.innerHTML = `Examples: <span style="opacity:.92;">37.983, 23.728</span> • <span style="opacity:.92;">259312931</span> • <span style="opacity:.92;">permalink with lat/lon</span>`;

        const actions = document.createElement("div");
        actions.className = "wmeRcModalActions";

        const btnCancel = document.createElement("div");
        btnCancel.className = "wmeRcModalBtn";
        btnCancel.textContent = "Cancel";
        btnCancel.addEventListener("click", close);

        const btnGo = document.createElement("div");
        btnGo.className = "wmeRcModalBtn primary";
        btnGo.textContent = "Go";

        const run = async () => {
          const input = (inp.value || "").trim();
          if (!input) { toast("Paste something."); return; }

          const pm = tryParsePermalink(input);
          if (pm) { await jumpToCoords(pm.lat, pm.lon, pm.zoom); close(); return; }

          const cc = tryParseCoords(input);
          if (cc) { await jumpToCoords(cc.lat, cc.lon, null); close(); return; }

          const n = Number((input.match(/^\d+$/) || [])[0]);
          if (Number.isFinite(n) && n > 0) {
            const seg = sdkSegGetById(n);
            if (seg) {
              try { await zoomToSegments([n]); } catch {}
              toast(`Jumped to segment ${n}`);
            } else {
              toast("Segment not loaded. Zoom closer and retry.");
            }
            close();
            return;
          }

          toast("Couldn’t parse input (coords/permalink/segment id).");
        };

        btnGo.addEventListener("click", run);
        inp.addEventListener("keydown", (e) => {
          if (e.key === "Enter") { e.preventDefault(); run(); }
        });

        actions.appendChild(btnCancel);
        actions.appendChild(btnGo);

        body.appendChild(inp);
        body.appendChild(hint);
        body.appendChild(actions);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            try { inp.focus(); inp.select(); } catch {}
          });
        });
      }
    });
  }


function pickAttributesFromSegmentId(segmentId) {
  const seg = sdkSegGetById(segmentId);
  const out = {};
  if (Number.isFinite(seg?.lockRank)) out.lockRank = seg.lockRank;
  out.fwdSpeedLimit = (seg?.fwdSpeedLimit == null ? null : Number(seg.fwdSpeedLimit));
  out.revSpeedLimit = (seg?.revSpeedLimit == null ? null : Number(seg.revSpeedLimit));
  if (typeof seg?.isAtoB === "boolean") out.isAtoB = seg.isAtoB;
  if (typeof seg?.isBtoA === "boolean") out.isBtoA = seg.isBtoA;

  const lvl = getSegLevelById(segmentId);
  if (Number.isFinite(lvl)) out.level = lvl;

  return out;
}


  function pasteCfgSummary() {
    const on = [];
    if (pasteCfg.speed) on.push("speed");
    if (pasteCfg.lock) on.push("lock");
    if (pasteCfg.direction) on.push("dir");
    if (pasteCfg.elevation) on.push("elev");
    return on.length ? on.join(", ") : "none";
  }

  function canPasteAnything() {
    return !!(pasteCfg.speed || pasteCfg.lock || pasteCfg.direction || pasteCfg.elevation);
  }


async function actionCopyAttributesFromSelection(segIds) {
  const id = Number(segIds?.[0]);
  if (!Number.isFinite(id)) { toast("Cannot copy attrs: no segment."); closeAllMenus(); return; }

  const seg = sdkSegGetById(id);
  const segW = UW?.W?.model?.segments?.getObjectById?.(id) || null;
  if (!seg && !segW) { toast("Cannot copy attrs: segment not loaded."); closeAllMenus(); return; }

  attrClip = pickAttributesFromSegmentId(id);
  toast("Copied attributes");
  closeAllMenus();
}


  function sameValue(a, b) {
    const na = (a == null ? null : a);
    const nb = (b == null ? null : b);
    if (typeof na === "number" && typeof nb === "number") return Number(na) === Number(nb);
    return na === nb;
  }

  function computePasteDiff(segIds) {
    const diff = {
      total: segIds.length,
      missing: 0,
      lock: { change: 0, same: 0, target: null, mixed: false, sampleCur: null },
      speed: { change: 0, same: 0, target: null, mixed: false, sampleCur: null },
      direction: { change: 0, same: 0, target: null, mixed: false, sampleCur: null },
      elevation: { change: 0, same: 0, target: null, mixed: false, sampleCur: null },
      overall: { change: 0, same: 0 }
    };

    const userLevel = getUserLevel() ?? 1;

    const targetLockLevel = ("lockRank" in (attrClip || {})) ? lockRankToLevel(Number(attrClip.lockRank), userLevel) : null;
    diff.lock.target = targetLockLevel != null ? `L${targetLockLevel}` : "—";

    const tf = ("fwdSpeedLimit" in (attrClip || {})) ? (attrClip.fwdSpeedLimit == null ? "∅" : String(attrClip.fwdSpeedLimit)) : "—";
    const tr = ("revSpeedLimit" in (attrClip || {})) ? (attrClip.revSpeedLimit == null ? "∅" : String(attrClip.revSpeedLimit)) : "—";
    diff.speed.target = (tf === "—" && tr === "—") ? "—" : `${tf}/${tr}`;

    const tdA = ("isAtoB" in (attrClip || {})) ? (!!attrClip.isAtoB ? "1" : "0") : "—";
    const tdB = ("isBtoA" in (attrClip || {})) ? (!!attrClip.isBtoA ? "1" : "0") : "—";
    diff.direction.target = (tdA === "—" && tdB === "—") ? "—" : `A→B:${tdA} B→A:${tdB}`;

    diff.elevation.target = ("level" in (attrClip || {})) ? String(attrClip.level ?? "—") : "—";

    let sampleLock = null, sampleSpeed = null, sampleDir = null, sampleElev = null;

    for (const id of segIds) {
      const seg = sdkSegGetById(id);
      if (!seg) { diff.missing++; continue; }

      const curLockLevel = (Number.isFinite(seg.lockRank) ? lockRankToLevel(Number(seg.lockRank), userLevel) : null);
      const curSpeed = `${seg.fwdSpeedLimit == null ? "∅" : seg.fwdSpeedLimit}/${seg.revSpeedLimit == null ? "∅" : seg.revSpeedLimit}`;
      const curDir = `A→B:${seg.isAtoB ? "1" : "0"} B→A:${seg.isBtoA ? "1" : "0"}`;
      const lvlNow = getSegLevelById(id);
      const curElev = (lvlNow == null ? "—" : String(lvlNow));

      if (sampleLock == null) sampleLock = curLockLevel != null ? `L${curLockLevel}` : "—";
      if (sampleSpeed == null) sampleSpeed = curSpeed;
      if (sampleDir == null) sampleDir = curDir;
      if (sampleElev == null) sampleElev = curElev;

      const patch = { lock: false, speed: false, direction: false, elevation: false };

      if ("lockRank" in (attrClip || {})) {
        patch.lock = !sameValue(seg.lockRank, attrClip.lockRank);
      }
      if (("fwdSpeedLimit" in (attrClip || {})) || ("revSpeedLimit" in (attrClip || {}))) {
        const cf = seg.fwdSpeedLimit == null ? null : Number(seg.fwdSpeedLimit);
        const cr = seg.revSpeedLimit == null ? null : Number(seg.revSpeedLimit);
        const tf2 = ("fwdSpeedLimit" in (attrClip || {})) ? (attrClip.fwdSpeedLimit == null ? null : Number(attrClip.fwdSpeedLimit)) : cf;
        const tr2 = ("revSpeedLimit" in (attrClip || {})) ? (attrClip.revSpeedLimit == null ? null : Number(attrClip.revSpeedLimit)) : cr;
        patch.speed = (!sameValue(cf, tf2)) || (!sameValue(cr, tr2));
      }
      if (("isAtoB" in (attrClip || {})) || ("isBtoA" in (attrClip || {}))) {
        const ta = ("isAtoB" in (attrClip || {})) ? !!attrClip.isAtoB : !!seg.isAtoB;
        const tb = ("isBtoA" in (attrClip || {})) ? !!attrClip.isBtoA : !!seg.isBtoA;
        patch.direction = (!sameValue(!!seg.isAtoB, ta)) || (!sameValue(!!seg.isBtoA, tb));
      }
      if ("level" in (attrClip || {})) {
        patch.elevation = !sameValue(getSegLevelById(id), attrClip.level);
      }

      const anyChangeIfSelected = (cfg) => {
        return (cfg.lock && patch.lock) || (cfg.speed && patch.speed) || (cfg.direction && patch.direction) || (cfg.elevation && patch.elevation);
      };

      if (patch.lock) diff.lock.change++; else diff.lock.same++;
      if (patch.speed) diff.speed.change++; else diff.speed.same++;
      if (patch.direction) diff.direction.change++; else diff.direction.same++;
      if (patch.elevation) diff.elevation.change++; else diff.elevation.same++;

      if (anyChangeIfSelected(pasteCfg)) diff.overall.change++;
      else diff.overall.same++;
    }

    diff.lock.sampleCur = sampleLock ?? "—";
    diff.speed.sampleCur = sampleSpeed ?? "—";
    diff.direction.sampleCur = sampleDir ?? "—";
    diff.elevation.sampleCur = sampleElev ?? "—";

    return diff;
  }


async function actionPasteAttributesToSelection(segIds) {
  if (!attrClip) { toast("No copied attributes yet."); closeAllMenus(); return; }
  if (!canPasteAnything()) { toast("Paste selection is empty."); return; }

  let changed = 0, unchanged = 0, fail = 0;

  for (const rawId of segIds) {
    const id = Number(rawId);
    if (!Number.isFinite(id)) { fail++; continue; }

    const seg = sdkSegGetById(id);
    let segmentChanged = false;
    let segmentFailed = false;

    const patch = {};
    if (seg) {
      if (pasteCfg.lock && ("lockRank" in attrClip)) {
        if (!sameValue(seg.lockRank, attrClip.lockRank)) patch.lockRank = attrClip.lockRank;
      }

      if (pasteCfg.speed) {
        if ("fwdSpeedLimit" in attrClip) {
          const cur = (seg.fwdSpeedLimit == null ? null : Number(seg.fwdSpeedLimit));
          if (!sameValue(cur, attrClip.fwdSpeedLimit)) patch.fwdSpeedLimit = attrClip.fwdSpeedLimit;
        }
        if ("revSpeedLimit" in attrClip) {
          const cur = (seg.revSpeedLimit == null ? null : Number(seg.revSpeedLimit));
          if (!sameValue(cur, attrClip.revSpeedLimit)) patch.revSpeedLimit = attrClip.revSpeedLimit;
        }
      }

      if (pasteCfg.direction) {
        if ("isAtoB" in attrClip) {
          if (!sameValue(!!seg.isAtoB, !!attrClip.isAtoB)) patch.isAtoB = !!attrClip.isAtoB;
        }
        if ("isBtoA" in attrClip) {
          if (!sameValue(!!seg.isBtoA, !!attrClip.isBtoA)) patch.isBtoA = !!attrClip.isBtoA;
        }
      }

      const keys = Object.keys(patch);
      if (keys.length) {
        try { sdkSegUpdateSegment(id, patch); segmentChanged = true; }
        catch { segmentFailed = true; }
      }
    } else {
      if (pasteCfg.lock || pasteCfg.speed || pasteCfg.direction) segmentFailed = true;
    }

    // Elevation (level): use robust getter + W.model fallback setter
    if (pasteCfg.elevation && ("level" in (attrClip || {}))) {
      const curLvl = getSegLevelById(id);
      if (!sameValue(curLvl, attrClip.level)) {
        const ok = setSegLevelById(id, attrClip.level);
        if (ok) segmentChanged = true;
        else segmentFailed = true;
      }
    }

    if (segmentFailed) fail++;
    if (segmentChanged) changed++; else unchanged++;
  }

  if (changed === 0 && fail === 0) {
    toast(`Paste Attributes: no changes (already identical) • ${unchanged}/${segIds.length}`);
  } else {
    toast(`Pasted (${pasteCfgSummary()}) • changed ${changed}, unchanged ${unchanged}${fail ? `, failed ${fail}` : ""}`);
  }
  closeAllMenus();
}


  function tagHtml(kind, text) {
    const cls = kind === "ok" ? "ok" : (kind === "bad" ? "bad" : "warn");
    return `<span class="wmeRcTag ${cls}">${text}</span>`;
  }

  function showPasteSelectorModal(segIds) {
    if (!attrClip) { toast("Copy attributes first."); return; }

    openModal({
      title: "Paste Attributes",
      iconSvg: ICONS.gear,
      bodyBuilder: ({ body, close }) => {
        const hint = document.createElement("div");
        hint.className = "wmeRcHint";
        hint.textContent = "Select what will be pasted. Preview shows what will change for the current selection.";

        const summary = document.createElement("div");
        summary.className = "wmeRcHint";

        const grid = document.createElement("div");
        grid.className = "wmeRcToggleGrid";

        const diffBox = document.createElement("div");
        diffBox.className = "wmeRcDiffBox";

        const actions = document.createElement("div");
        actions.className = "wmeRcModalActions";

        const refreshGrid = () => {
          grid.innerHTML = "";
          grid.appendChild(mkToggle("speed", "Speed limits", "Forward/reverse speed"));
          grid.appendChild(mkToggle("lock", "Lock", "Lock rank"));
          grid.appendChild(mkToggle("direction", "Direction", "A→B / B→A"));
          grid.appendChild(mkToggle("elevation", "Elevation", "Elevation (level)"));
        };

        const mkToggle = (key, name, desc) => {
          const on = !!pasteCfg[key];
          const el = document.createElement("div");
          el.className = "wmeRcToggleBtn " + (on ? "on" : "off");
          el.innerHTML = `
            <div class="wmeRcToggleLeft">
              <div class="wmeRcToggleName">${name}</div>
              <div class="wmeRcToggleDesc">${desc}</div>
            </div>
            <div class="wmeRcPill ${on ? "on" : "off"}">${on ? "ON" : "OFF"}</div>
          `;
          el.addEventListener("click", () => {
            pasteCfg[key] = !pasteCfg[key];
            refreshGrid();
            refreshDiff();
            updateSummary();
          });
          return el;
        };

        const refreshDiff = () => {
          const d = computePasteDiff(segIds);
          diffBox.innerHTML = "";

          const overallKind = (!canPasteAnything()) ? "bad" : (d.overall.change > 0 ? "ok" : "warn");
          const overallText = (!canPasteAnything()) ? "select something" : (d.overall.change > 0 ? `${d.overall.change} will change` : "no changes");
          const overall = document.createElement("div");
          overall.className = "wmeRcDiffRow";
          overall.innerHTML = `
            <div class="wmeRcDiffLeft">
              <div class="wmeRcDiffName">Preview</div>
              <div class="wmeRcDiffDesc">${d.total} selected${d.missing ? ` • ${d.missing} not loaded` : ""}</div>
            </div>
            <div class="wmeRcDiffRight">${tagHtml(overallKind, overallText)}</div>
          `;
          diffBox.appendChild(overall);

          diffBox.appendChild(makeDiffRow("Lock", d.lock.sampleCur, d.lock.target, pasteCfg.lock, d.lock.change));
          diffBox.appendChild(makeDiffRow("Speed", d.speed.sampleCur, d.speed.target, pasteCfg.speed, d.speed.change));
          diffBox.appendChild(makeDiffRow("Direction", d.direction.sampleCur, d.direction.target, pasteCfg.direction, d.direction.change));
          diffBox.appendChild(makeDiffRow("Elevation", d.elevation.sampleCur, d.elevation.target, pasteCfg.elevation, d.elevation.change));
        };

        const makeDiffRow = (name, cur, target, enabledNow, changeCount) => {
          const row = document.createElement("div");
          row.className = "wmeRcDiffRow";

          const kind = !enabledNow ? "warn" : (changeCount > 0 ? "ok" : "warn");
          const tag = !enabledNow ? tagHtml("warn", "disabled") : (changeCount > 0 ? tagHtml("ok", `${changeCount} change`) : tagHtml("warn", "no change"));

          row.innerHTML = `
            <div class="wmeRcDiffLeft">
              <div class="wmeRcDiffName">${name}</div>
              <div class="wmeRcDiffDesc">${enabledNow ? "will apply if different" : "not included"}</div>
            </div>
            <div class="wmeRcDiffRight">${cur} → ${target} ${tag}</div>
          `;
          return row;
        };

        const updateSummary = () => {
          summary.textContent = `Selected: ${pasteCfgSummary()}`;
          const ok = !!attrClip && segIds.length > 0 && canPasteAnything();
          btnPasteNow.style.opacity = ok ? "1" : ".55";
          btnPasteNow.style.pointerEvents = ok ? "auto" : "none";
        };

        const btnNone = document.createElement("div");
        btnNone.className = "wmeRcModalBtn";
        btnNone.textContent = "Select none";
        btnNone.addEventListener("click", () => {
          pasteCfg.speed = pasteCfg.lock = pasteCfg.direction = pasteCfg.elevation = false;
          refreshGrid(); refreshDiff(); updateSummary();
        });

        const btnAll = document.createElement("div");
        btnAll.className = "wmeRcModalBtn";
        btnAll.textContent = "Select all";
        btnAll.addEventListener("click", () => {
          pasteCfg.speed = pasteCfg.lock = pasteCfg.direction = pasteCfg.elevation = true;
          refreshGrid(); refreshDiff(); updateSummary();
        });

        const btnPasteNow = document.createElement("div");
        btnPasteNow.className = "wmeRcModalBtn primary";
        btnPasteNow.textContent = "Paste Now";
        btnPasteNow.addEventListener("click", async () => {
          const ok = !!attrClip && segIds.length > 0 && canPasteAnything();
          if (!ok) return;
          close();
          await actionPasteAttributesToSelection(segIds);
        });

        const btnSave = document.createElement("div");
        btnSave.className = "wmeRcModalBtn";
        btnSave.textContent = "Save";
        btnSave.addEventListener("click", () => { toast(`Paste set: ${pasteCfgSummary()}`); close(); });

        actions.appendChild(btnNone);
        actions.appendChild(btnAll);
        actions.appendChild(btnSave);
        actions.appendChild(btnPasteNow);

        body.appendChild(hint);
        body.appendChild(summary);
        body.appendChild(grid);
        body.appendChild(diffBox);
        body.appendChild(actions);

        refreshGrid();
        refreshDiff();
        updateSummary();
      },
    });
  }

  function selectSameStreet(segIds) {
    const seg0 = sdkSegGetById(segIds[0]);
    const streetId = seg0?.primaryStreetId;
    if (streetId == null) { toast("No primary street on this segment."); return; }

    const loaded = getAllLoadedSegmentsW();
    const matchIds = [];
    for (const s of loaded) {
      if (primaryStreetIdFromW(s) == streetId) {
        const id = segIdFromW(s);
        if (Number.isFinite(id)) matchIds.push(id);
      }
    }
    if (!matchIds.length) { toast("No matching segments loaded."); return; }
    setSelectionToSegmentIds(matchIds);
  }

  function selectSameLockInView(segIds) {
    const info = getSegmentsLockInfo(segIds);
    if (info.mixed || info.currentRaw == null) { toast("Selection lock is mixed/unknown."); return; }
    const target = info.currentRaw;

    const loaded = getAllLoadedSegmentsW();
    const matchIds = [];
    for (const s of loaded) {
      const lk = lockRankFromW(s);
      if (lk != null && lk === target) {
        const id = segIdFromW(s);
        if (Number.isFinite(id)) matchIds.push(id);
      }
    }
    if (!matchIds.length) { toast("No matching lock segments loaded."); return; }
    setSelectionToSegmentIds(matchIds);
  }

  function selectSameSpeedInView(segIds) {
    const info = getSegmentsSpeedInfo(segIds);
    if (info.mixed) { toast("Selection speed is mixed."); return; }

    const seg0 = sdkSegGetById(segIds[0]);
    if (!seg0) { toast("Segment not loaded."); return; }

    const mode0 = getSegDirectionMode(seg0);
    const f0 = seg0.fwdSpeedLimit == null ? null : Number(seg0.fwdSpeedLimit);
    const r0 = seg0.revSpeedLimit == null ? null : Number(seg0.revSpeedLimit);

    const loaded = getAllLoadedSegmentsW();
    const matchIds = [];
    for (const s of loaded) {
      const id = segIdFromW(s);
      if (!Number.isFinite(id)) continue;

      const sp = speedFromW(s);
      const d = dirFromW(s);

      const isTwo = d.mode === "2";
      const isA = d.mode === "A";
      const isB = d.mode === "B";

      if (mode0 === "BOTH") {
        if (!isTwo) continue;
        if ((sp.f ?? null) === (f0 ?? null) && (sp.r ?? null) === (r0 ?? null)) matchIds.push(id);
      } else if (mode0 === "FWD") {
        if (!isA) continue;
        if ((sp.f ?? null) === (f0 ?? null)) matchIds.push(id);
      } else if (mode0 === "REV") {
        if (!isB) continue;
        if ((sp.r ?? null) === (r0 ?? null)) matchIds.push(id);
      }
    }

    if (!matchIds.length) { toast("No matching speed segments loaded."); return; }
    setSelectionToSegmentIds(matchIds);
  }

  function nodeIdFromW(segW, which) {
    const a = segW?.attributes || {};
    return a[which + "NodeID"] ?? a[which + "NodeId"] ?? a[which + "Node"] ?? segW?.[which + "NodeID"] ?? null;
  }

  function connectedSegmentsAtNode(nodeId, loadedSegs) {
    const out = [];
    for (const s of loadedSegs) {
      const fromN = nodeIdFromW(s, "from");
      const toN = nodeIdFromW(s, "to");
      if (fromN == nodeId || toN == nodeId) {
        const id = segIdFromW(s);
        if (Number.isFinite(id)) out.push({ seg: s, id });
      }
    }
    return out;
  }

  function selectConnectedChain(segIds) {
    const loaded = getAllLoadedSegmentsW();
    if (!loaded.length) { toast("No segments loaded."); return; }

    const all = new Set();

    for (const startId of segIds) {
      const startW = UW?.W?.model?.segments?.getObjectById?.(startId) || null;
      if (!startW) { all.add(startId); continue; }

      all.add(startId);

      const fromNode = nodeIdFromW(startW, "from");
      const toNode = nodeIdFromW(startW, "to");

      const walk = (nodeId, comingSegId) => {
        let currentNode = nodeId;
        let prevSegId = comingSegId;

        while (currentNode != null) {
          const con = connectedSegmentsAtNode(currentNode, loaded)
            .map(x => x.id)
            .filter(id => id !== prevSegId);

          if (con.length !== 1) break;

          const nextSegId = con[0];
          all.add(nextSegId);

          const nextW = UW?.W?.model?.segments?.getObjectById?.(nextSegId) || null;
          if (!nextW) break;

          const nFrom = nodeIdFromW(nextW, "from");
          const nTo = nodeIdFromW(nextW, "to");
          const nextNode = (nFrom == currentNode) ? nTo : nFrom;

          prevSegId = nextSegId;
          currentNode = nextNode;
        }
      };

      walk(fromNode, startId);
      walk(toNode, startId);
    }

    const ids = Array.from(all).filter(Number.isFinite);
    setSelectionToSegmentIds(ids);
  }

  function showSelectModal(segIds) {
    const lockInfo = getSegmentsLockInfo(segIds);
    const speedInfo = getSegmentsSpeedInfo(segIds);

    openModal({
      title: "Select…",
      iconSvg: ICONS.select,
      bodyBuilder: ({ body, close }) => {
        const hint = document.createElement("div");
        hint.className = "wmeRcHint";
        hint.textContent = "Works on loaded segments only (current view / loaded tiles).";

        const list = document.createElement("div");
        list.className = "wmeRcActionList";

        const add = (title, desc, icon, disabled, fn) => {
          const card = document.createElement("div");
          card.className = "wmeRcActionCard" + (disabled ? " disabled" : "");
          card.innerHTML = `
            <div class="wmeRcActionLeft">
              <div class="wmeRcActionTitle"><span class="wmeRcI">${icon}</span><span>${title}</span></div>
              <div class="wmeRcActionDesc">${desc}</div>
            </div>
            <div class="wmeRcChevron">›</div>
          `;
          if (!disabled) {
            card.addEventListener("click", () => {
              try { fn(); } catch (e) { console.error(e); toast(String(e?.message || e)); }
              close();
            });
          }
          list.appendChild(card);
        };

        add("Same street", "Primary street (in view)", ICONS.street, false, () => selectSameStreet(segIds));
        add("Connected chain", "Until junctions (in view)", ICONS.chain, false, () => selectConnectedChain(segIds));
        add("Same lock", lockInfo.mixed ? "Disabled: selection lock is mixed" : "Same lock rank (in view)", ICONS.lock, lockInfo.mixed || lockInfo.currentRaw == null, () => selectSameLockInView(segIds));
        add("Same speed", speedInfo.mixed ? "Disabled: selection speed is mixed" : "Same speed state (in view)", ICONS.speed, speedInfo.mixed, () => selectSameSpeedInView(segIds));

        body.appendChild(hint);
        body.appendChild(list);
      }
    });
  }

  function buildToolsSubmenuForSegments(segIds) {
    return [
      { label: withIcon(ICONS.tools, "Tools"), sub: "Quick utilities", disabled: true },
      { type: "sep" },
      { label: withIcon(ICONS.select, "Select…"), sub: "Smart selection tools", onClick: () => showSelectModal(segIds) },
      { type: "sep" },
      { label: withIcon(ICONS.jump, "Jump / Search…"), sub: "coords • permalink • segment id", onClick: () => showJumpModal("") },
      { type: "sep" },
      { label: withIcon(ICONS.copy, "Copy attributes"), sub: "speed • lock • direction • elev", onClick: () => actionCopyAttributesFromSelection(segIds) },
      {
        label: withIcon(ICONS.tools, "Paste Attributes"),
        sub: attrClip ? `Selected: ${pasteCfgSummary()}` : "Nothing copied yet",
        disabled: !attrClip,
        iconButton: { html: `<span class="wmeRcI">${ICONS.gear}</span>`, title: "Choose what to paste", onClick: () => showPasteSelectorModal(segIds) },
        onClick: () => actionPasteAttributesToSelection(segIds),
      },
    ];
  }
  function getStreetNameForSegmentId(segId) {
    const seg = sdkSegGetById(segId);
    if (!seg) return "(unknown street)";
    const streetId = seg.primaryStreetId;
    if (streetId == null) return "(no street)";
    const street = sdkStreetsGetById(streetId);
    const name = street?.streetName ?? street?.name ?? street?.englishName ?? "(unknown street)";
    return String(name);
  }

  async function actionCopySelectionSummary(segIds, ll) {
    const idsTxt = segIds.join(", ");
    const streetTxt = segIds.length ? getStreetNameForSegmentId(segIds[0]) : "(no segment)";
    const pm = buildPermalink(ll, segIds);
    const gmaps = gmapsUrlFromLonLat(ll);
    const out = `Street: ${streetTxt}\nSegment ID(s): ${idsTxt}\nCoords: ${fmt(ll.lat)}, ${fmt(ll.lon)}\nGoogle Maps: ${gmaps}\nPermalink: ${pm}`;
    await setClipboard(out);
    toast("Copied: selection summary");
    closeAllMenus();
  }

  function buildCopySubmenuForSegments(segIds, ctxLL) {
    const ll = ctxLL || lastLonLat;
    const hasLL = !!(ll && Number.isFinite(ll.lat) && Number.isFinite(ll.lon));
    return [
      { label: withIcon(ICONS.street, "Street name"), sub: "From first selected", onClick: () => actionCopyStreetName(segIds[0]) },
      { label: withIcon(ICONS.copy, "Segment ID"), sub: segIds.length === 1 ? String(segIds[0]) : `${segIds.length} segments`, onClick: () => actionCopySegmentIds(segIds) },
      { type: "sep" },
      { label: withIcon(ICONS.mapPin, "Lat,lon"), sub: hasLL ? `${fmt(ll.lat)}, ${fmt(ll.lon)}` : "Right-click on map", disabled: !hasLL, onClick: () => copyCoordsLatLon(ll) },
      { label: withIcon(ICONS.ext, "Google Maps link"), sub: hasLL ? "https://www.google.com/…" : "Right-click on map", disabled: !hasLL, onClick: () => copyCoordsGmaps(ll), rightButton: hasLL ? { label: "Open", onClick: () => { try { UW.open(gmapsUrlFromLonLat(ll), "_blank", "noopener,noreferrer"); } catch (e) { console.error(e); } closeAllMenus(); } } : null },
      { label: withIcon(ICONS.chain, "Permalink"), sub: hasLL ? "WME permalink" : "Right-click on map", disabled: !hasLL, onClick: () => copyPermalink(ll, segIds) },
      { type: "sep" },
      { label: withIcon(ICONS.copy, "Summary"), sub: hasLL ? "Street • IDs • Links" : "Right-click on map", disabled: !hasLL, onClick: () => actionCopySelectionSummary(segIds, ll) },
    ];
  }




  function openSegmentMenu(x, y, segIds, ctxLL) {
    const dirInfo = dirSummaryForSelection(segIds);
    const dirSub = dirInfo.mixed ? "mixed" : modeLabel(dirInfo.mode);

    const ll = ctxLL || lastLonLat;
    const hasLL = !!(ll && Number.isFinite(ll.lat) && Number.isFinite(ll.lon));

    openRootMenu(x, y, "Segment", `${segIds.length} selected`, [
      { label: withIcon(ICONS.copy, "Copy to Clipboard"), sub: "Street • ID • More", submenu: true, submenuKind: "copy", getSubmenuItems: () => buildCopySubmenuForSegments(segIds, ll) },
      { label: withIcon(ICONS.refresh, "Refresh here"), sub: hasLL ? "Reload editor at this spot" : "Move mouse on map first", disabled: !hasLL, onClick: () => refreshHere(ll, segIds) },
      { type: "sep" },
      { kind: "dir", label: withIcon(ICONS.arrows, "Direction"), sub: dirSub, submenu: true, submenuKind: "dir", getSubmenuItems: () => buildDirectionSubmenu(segIds)},
      { label: withIcon(ICONS.endpoints, "Endpoints"), sub: segIds.length === 1 ? "Go to A/B node" : "Select 1 segment", submenu: true, submenuKind: "endpoints", getSubmenuItems: () => buildEndpointsSubmenu(segIds) },
      { type: "sep" },
      { label: withIcon(ICONS.zoom, "Zoom to"), sub: segIds.length === 1 ? "Center on segment" : "Fit selection", onClick: () => actionZoomTo(segIds) },
      { type: "sep" },
      { label: withIcon(ICONS.tools, "More"), sub: "Tools & utilities", submenu: true, submenuKind: "tools", getSubmenuItems: () => buildToolsSubmenuForSegments(segIds) },
    ]);
  }

  function openMapMenu(x, y, ll) {
    const has = !!ll;

    openRootMenu(x, y, "Map", "No selection", [
      { label: withIcon(ICONS.mapPin, "Copy lat,lon"), sub: has ? `${fmt(ll.lat)}, ${fmt(ll.lon)}` : "Move mouse on map first", disabled: !has, onClick: () => copyCoordsLatLon(ll) },
      { label: withIcon(ICONS.refresh, "Refresh here"), sub: has ? "Reload editor at this spot" : "Move mouse on map first", disabled: !has, onClick: () => refreshHere(ll, null) },
      { label: withIcon(ICONS.chain, "Copy permalink"), sub: has ? "WME permalink (lat/lon/zoom)" : "Move mouse on map first", disabled: !has, onClick: () => copyPermalink(ll, null) },
      { label: withIcon(ICONS.ext, "Open in Google Maps"), sub: has ? "https://www.google.com/…" : "Move mouse on map first", disabled: !has,
        onClick: () => { try { UW.open(gmapsUrlFromLonLat(ll), "_blank", "noopener,noreferrer"); } catch (e) { console.error(e); } closeAllMenus(); },
        rightButton: has ? { label: "Copy", onClick: () => copyCoordsGmaps(ll) } : null
      },
      { type: "sep" },
      { label: withIcon(ICONS.jump, "Jump / Search…"), sub: "coords • permalink • segment id", onClick: () => showJumpModal("") },
    ]);

  }

  function onContextMenuCapture(e) {
    if (!enabled) return;
    if (e.shiftKey) return;
    if (!isMapClick(e.clientX, e.clientY)) return;

    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();

    const segIds = selectedSegmentIds();
    const ll = lonLatFromClick(e.clientX, e.clientY);

    if (segIds.length) openSegmentMenu(e.clientX, e.clientY, segIds, ll);
    else openMapMenu(e.clientX, e.clientY, ll);
  }

  function onMouseDownCapture(e) {
    if (!enabled) return;
    if (e.button !== 2) return;
    if (e.shiftKey) return;
    if (!isMapClick(e.clientX, e.clientY)) return;

    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
  }

  ensureCSS();
  window.addEventListener("contextmenu", onContextMenuCapture, { capture: true });
  window.addEventListener("mousedown", onMouseDownCapture, { capture: true });

  let tinyFallbackToggleEl = null;

  function setEnabled(v) {
    enabled = !!v;
    try {
      if (tinyFallbackToggleEl) {
        tinyFallbackToggleEl.querySelector(".wmeRcTinyDot")?.classList.toggle("off", !enabled);
        tinyFallbackToggleEl.querySelector(".wmeRcTinyTxt").textContent = enabled ? "Right-click: ON" : "Right-click: OFF";
      }
    } catch {}
  }

  function createTinyFallbackToggle() {
    if (tinyFallbackToggleEl && document.contains(tinyFallbackToggleEl)) return;
    const el = document.createElement("div");
    el.className = "wmeRcTinyToggle";
    el.innerHTML = `<div class="wmeRcTinyDot"></div><div class="wmeRcTinyTxt">Right-click: ON</div>`;
    el.addEventListener("click", () => {
      setEnabled(!enabled);
      toast(`${SCRIPT_NAME}: ${enabled ? "ON" : "OFF"}`);
      closeAllMenus();
    });
    (document.body || document.documentElement).appendChild(el);
    tinyFallbackToggleEl = el;
    setEnabled(enabled);
  }

  function mountSidebarPanelBestEffort() {
    try {
      const ww = UW?.WazeWrap;
      const addTab = ww?.Interface?.AddScriptTab;
      if (typeof addTab === "function") {
        const tab = addTab(SCRIPT_NAME);
        if (tab && tab.appendChild) {
          const wrap = document.createElement("div");
          wrap.className = "wmeRcSideWrap";
          wrap.innerHTML = `
            <div class="wmeRcSideCard">
              <div class="wmeRcSideRow">
                <div>
                  <div class="wmeRcSideTitle">Right-click menu</div>
                  <div class="wmeRcSideSub">Shift + right click = default menu</div>
                </div>
                <div class="wmeRcSwitch ${enabled ? "on" : ""}" id="wmeRcSideSwitch">
                  <div class="wmeRcKnob"></div>
                </div>
              </div>
            </div>
          `;
          tab.appendChild(wrap);

          const sw = wrap.querySelector("#wmeRcSideSwitch");
          sw.addEventListener("click", () => {
            setEnabled(!enabled);
            sw.classList.toggle("on", enabled);
            toast(`${SCRIPT_NAME}: ${enabled ? "ON" : "OFF"}`);
            closeAllMenus();
          });

          if (tinyFallbackToggleEl) tinyFallbackToggleEl.remove();
          tinyFallbackToggleEl = null;

          return true;
        }
      }
    } catch (e) {
      console.warn("Sidebar mount failed:", e);
    }

    createTinyFallbackToggle();
    return false;
  }

  async function initSdk() {
    try {
      sdk = UW.getWmeSdk({ scriptId: SCRIPT_ID, scriptName: SCRIPT_NAME });
    } catch (err) {
      console.warn(`[${SCRIPT_NAME}] getWmeSdk failed`, err);
      mountSidebarPanelBestEffort();
      return;
    }

    try {
      const lvl = getUserLevel();
      if (Number.isFinite(lvl)) cachedUserLevel = lvl;
    } catch {}

    try {
      sdk.Events?.on?.({
        eventName: "wme-map-mouse-move",
        eventHandler: (ev) => {
          if (ev && isFinite(ev.lon) && isFinite(ev.lat)) lastLonLat = { lon: ev.lon, lat: ev.lat };
        },
      });
    } catch {}

    const tryMount = () => mountSidebarPanelBestEffort();
    const t = setInterval(() => {
      if (document.body) {
        tryMount();
        clearInterval(t);
      }
    }, 450);
    setTimeout(() => clearInterval(t), 8000);
  }

  if (UW.SDK_INITIALIZED?.then) UW.SDK_INITIALIZED.then(initSdk);
  else {
    const t = setInterval(() => {
      if (UW.SDK_INITIALIZED?.then) { clearInterval(t); UW.SDK_INITIALIZED.then(initSdk); }
    }, 250);
    setTimeout(() => clearInterval(t), 12000);
  }

})();
