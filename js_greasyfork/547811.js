// ==UserScript==
// @name         DuoRain
// @namespace    http://tampermonkey.net/
// @version      5.0.0.BETA
// @description  Ultimate Automation Tool for Duolingo
// @icon         https://raw.githubusercontent.com/OracleMythix/DuoRain-BETA/main/assets/DuoRain-Icon.png
// @author       OracleMythix
// @license      MIT
// @match        https://*.duolingo.com/*
// @match        https://*.duolingo.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @connect      duolingo.com
// @connect      stories.duolingo.com
// @connect      goals-api.duolingo.com
// @connect      ios-api-2.duolingo.com
// @connect      duolingo-leaderboards-prod.duolingo.com
// @connect      fonts.googleapis.com
// @connect      fonts.gstatic.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547811/DuoRain.user.js
// @updateURL https://update.greasyfork.org/scripts/547811/DuoRain.meta.js
// ==/UserScript==

(function() {
'use strict';

const config = {
    dim: { width: 900, height: 600 },
    id: { app: "duorain-app", win: "duorain-win", orb: "duorain-orb" },
    api: {
        stories: "https://stories.duolingo.com/api2/stories",
        users: "https://www.duolingo.com/2017-06-30/users",
        sessions: "https://www.duolingo.com/2017-06-30/sessions",
        leaderboards: "https://duolingo-leaderboards-prod.duolingo.com/leaderboards/7d9f5dd1-8423-491a-91f2-2532052038ce",
        shop: "https://www.duolingo.com/2023-05-23/shop-items",
        goals: "https://goals-api.duolingo.com"
    },
    defaults: {
        delays: { xp: 100, gem: 500, streak: 100, quest: 100, league: 100 },
        leagueBuffer: 60,
        fakeMax: false,
        notifPos: "bl"
    },
    chBody: [
        "assist", "characterIntro", "characterMatch", "characterPuzzle", "characterSelect",
        "characterTrace", "characterWrite", "completeReverseTranslation", "definition", "dialogue",
        "extendedMatch", "extendedListenMatch", "form", "freeResponse", "gapFill", "judge", "listen",
        "listenComplete", "listenMatch", "match", "name", "listenComprehension", "listenIsolation",
        "listenSpeak", "listenTap", "orderTapComplete", "partialListen", "partialReverseTranslate",
        "patternTapComplete", "radioBinary", "radioImageSelect", "radioListenMatch",
        "radioListenRecognize", "radioSelect", "readComprehension", "reverseAssist", "sameDifferent",
        "select", "selectPronunciation", "selectTranscription", "svgPuzzle", "syllableTap",
        "syllableListenTap", "speak", "tapCloze", "tapClozeTable", "tapComplete", "tapCompleteTable",
        "tapDescribe", "translate", "transliterate", "transliterationAssist", "typeCloze",
        "typeClozeTable", "typeComplete", "typeCompleteTable", "writeComprehension"
    ]
};

const desc = {
    dash: "Overview of usage statistics, recent activity, and profile details in one place",
    xp: "Earn any amount of XP by looping a story",
    gem: "Obtain unlimited Gems by loop-claiming a reward; each loop grants 60 Gems",
    streak: "Restore or extend your streak by backfilling days",
    league: "Reach any league position you desire by automatically overtaking opponents",
    quest: "Instantly complete quests by injecting 2000 units of progress (Brute Force)",
    shop: "Acquire Duolingo store items for free",
    misc: "Unlock premium features and other utilities",
    settings: "Adjust your preferences and customize your experience"
};

const assets = {
    logo: "https://raw.githubusercontent.com/OracleMythix/DuoRain-BETA/main/assets/DuoRain.png",
    titleSvg: `<svg class="logo-text-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 70"><defs><linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1bc2f5ff"/><stop offset="100%" stop-color="#07f"/></linearGradient><linearGradient id="shallowWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0077ffff" stop-opacity=".8"/><stop offset="100%" stop-color="#06f" stop-opacity=".9"/></linearGradient><linearGradient id="deepSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0040ff"/><stop offset="100%" stop-color="#000530"/></linearGradient><filter id="neonGlow"><feDropShadow dx="0" dy="0" stdDeviation="3.5" flood-color="#00C6FF" flood-opacity="0.9"/></filter><filter id="diffuseFilter" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter><text id="textRef" style="font-family: 'Fugaz One', cursive" font-size="52" letter-spacing="0" x="96" y="52">Rain</text><path id="organicWave" d="m0 40 3.39.69 3.39.52 3.39.3 3.39.04 3.39-.21 3.39-.42 3.39-.57 3.39-.62 3.39-.59 3.39-.48 3.39-.29 3.39-.09 3.39.13 3.39.29 3.39.41 3.39.44 3.39.41 3.39.31 3.39.16 3.39.03 3.39-.11 3.39-.2 3.39-.23 3.39-.2 3.39-.13 3.39-.02 3.39.07 3.39.14 3.39.16 3.38.1 3.39-.02 3.39-.21 3.39-.44 3.39-.66 3.39-.87 3.39-1.02 3.39-1.08 3.39-1.04 3.39-.9 3.39-.7 3.39-.44 3.39-.17 3.39.1 3.39.31 3.39.45 3.39.52 3.39.51 3.39.46 3.39.37 3.39.29 3.39.24 3.39.23 3.39.27 3.39.36 3.39.49 3.39.62 3.39.72 3.39.79L200 40v60H0Z"/><mask id="rainMask"><use href="#textRef" fill="#fff"/></mask></defs><text x="2" y="52" fill="#fff" filter="url(#neonGlow)" style="font-family: 'Fugaz One', cursive" font-size="52" letter-spacing="0">Duo</text><g filter="url(#neonGlow)"><g mask="url(#rainMask)"><path fill="url(#skyGradient)" d="M0 0h260v70H0z"/><g filter="url(#diffuseFilter)"><g transform="translate(-40)"><animateTransform attributeName="transform" type="translate" values="-40 0; 160 0" dur="4.2s" repeatCount="indefinite"/><use href="#organicWave" x="-200" fill="url(#shallowWater)"/><use href="#organicWave" fill="url(#shallowWater)"/><use href="#organicWave" x="200" fill="url(#shallowWater)"/></g><g><animateTransform attributeName="transform" type="translate" values="0 0; 200 0" dur="4s" repeatCount="indefinite"/><use href="#organicWave" x="-200" fill="url(#deepSea)"/><use href="#organicWave" fill="url(#deepSea)"/><use href="#organicWave" x="200" fill="url(#deepSea)"/></g></g></g></g></svg>`,
    xp: "https://d35aaqx5ub95lt.cloudfront.net/images/profile/01ce3a817dd01842581c3d18debcbc46.svg",
    gems: "https://d35aaqx5ub95lt.cloudfront.net/images/gems/45c14e05be9c1af1d7d0b54c6eed7eee.svg",
    streak: "https://d35aaqx5ub95lt.cloudfront.net/images/icons/398e4298a3b39ce566050e5c041949ef.svg",
    league: "https://d35aaqx5ub95lt.cloudfront.net/vendor/ca9178510134b4b0893dbac30b6670aa.svg",
    quest: "https://d35aaqx5ub95lt.cloudfront.net/vendor/7ef36bae3f9d68fc763d3451b5167836.svg",
    shop: "https://d35aaqx5ub95lt.cloudfront.net/vendor/0e58a94dda219766d98c7796b910beee.svg",
    chest: "https://d35aaqx5ub95lt.cloudfront.net/images/goals/64d0bbcd8f4e6d5018502540f1e0094b.svg",
    misc: "https://d35aaqx5ub95lt.cloudfront.net/images/legendary/158dbe277bf83116d04692b969a27aa3.svg",
    icons: {
        dash: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
        settings: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
        close: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        refresh: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
        arrow: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;vertical-align:middle;margin:0 6px;color:var(--wolf)"><line x1="3" y1="12" x2="21" y2="12"></line><polyline points="14 5 21 12 14 19"></polyline></svg>`,
        chevLeft: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
        chevRight: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
        manage: `<svg viewBox="0 0 16 16" fill="currentColor" style="width:16px;height:16px;"><path d="M8.57031 7.85938C8.57031 8.24219 8.4375 8.5625 8.10938 8.875L2.20312 14.6641C1.96875 14.8984 1.67969 15.0156 1.33594 15.0156C0.648438 15.0156 0.0859375 14.4609 0.0859375 13.7734C0.0859375 13.4219 0.226562 13.1094 0.484375 12.8516L5.63281 7.85156L0.484375 2.85938C0.226562 2.60938 0.0859375 2.28906 0.0859375 1.94531C0.0859375 1.26562 0.648438 0.703125 1.33594 0.703125C1.67969 0.703125 1.96875 0.820312 2.20312 1.05469L8.10938 6.84375C8.42969 7.14844 8.57031 7.46875 8.57031 7.85938Z"/></svg>`
    },
    shopIcons: {
        xp: "https://d35aaqx5ub95lt.cloudfront.net/images/icons/68c1fd0f467456a4c607ecc0ac040533.svg",
        streak: "https://d35aaqx5ub95lt.cloudfront.net/images/icons/216ddc11afcbb98f44e53d565ccf479e.svg",
        heart: "https://d35aaqx5ub95lt.cloudfront.net/images/hearts/547ffcf0e6256af421ad1a32c26b8f1a.svg",
        gem: "https://d35aaqx5ub95lt.cloudfront.net/images/gems/45c14e05be9c1af1d7d0b54c6eed7eee.svg",
        outfit: "https://d35aaqx5ub95lt.cloudfront.net/vendor/0cecd302cf0bcd0f73d51768feff75fe.svg",
        free: "https://d35aaqx5ub95lt.cloudfront.net/images/super/11db6cd6f69cb2e3c5046b915be8e669.svg",
        misc: "https://d35aaqx5ub95lt.cloudfront.net/images/leagues/9fadb349c2ece257386a0e576359c867.svg"
    }
};

let GlobalNotif;
let GlobalPopup;
let GlobalConfirm;

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Fugaz+One&display=swap');@import url('https://fonts.googleapis.com/css2?family=Google+Sans+Code:wght@400;500;600;700&display=swap');@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@700;800&display=swap');@font-face{font-family:'DuoFeather';src:url('https://d35aaqx5ub95lt.cloudfront.net/fonts/642e24bb0295f3aee4dedcd8eecd8007.woff2') format('woff2');font-weight:700}#${config.id.app}{--rain:0,198,255;--rain-hex:#00C6FF;--shadow:0 20px 60px rgba(0,0,0,0.35);--glass:blur(25px) saturate(120%);--close:rgba(255,255,255,0.2)}#${config.id.app}.dr-light{--bg:rgba(138,138,255,0.7);--sidebar:rgba(92,92,255,0.85);--input:rgba(46,46,255,0.65);--hover:rgba(46,46,255,0.4);--dropdown-bg:rgba(46,46,255,0.95);--eel:#FFFFFF;--wolf:#E0E0E0;--swan:rgba(255,255,255,0.2)}#${config.id.app}.dr-dark{--bg:rgba(15,23,42,0.85);--sidebar:rgba(30,41,59,0.9);--input:rgba(51,65,85,0.6);--hover:rgba(71,85,105,0.5);--dropdown-bg:rgba(15,23,42,0.95);--eel:#FFFFFF;--wolf:#94A3B8;--swan:rgba(255,255,255,0.1)}#${config.id.app}{position:fixed;inset:0;pointer-events:none;z-index:2147483647;font-family:'DuoFeather',sans-serif;box-sizing:border-box;user-select:none;-webkit-user-select:none}#${config.id.app} *{box-sizing:border-box}#${config.id.orb}{position:fixed;bottom:30px;left:30px;width:68px;height:68px;pointer-events:auto;cursor:pointer;border-radius:50%;box-shadow:0 10px 30px rgba(0,0,0,.3);transition:transform .3s cubic-bezier(.34,1.56,.64,1);display:flex;align-items:center;justify-content:center;background:var(--bg);border:2px solid var(--swan);backdrop-filter:var(--glass);-webkit-backdrop-filter:var(--glass);overflow:hidden}#${config.id.orb}:hover{transform:scale(1.1)}#${config.id.orb} img{width:100%;height:100%;object-fit:contain;border-radius:50%;pointer-events:none}#${config.id.win}{position:fixed;pointer-events:auto;width:${config.dim.width}px;height:${config.dim.height}px;top:calc(50vh - ${config.dim.height/2}px);left:calc(50vw - ${config.dim.width/2}px);background:var(--bg);border:1px solid var(--swan);border-radius:28px;box-shadow:var(--shadow);backdrop-filter:var(--glass);-webkit-backdrop-filter:var(--glass);display:flex;flex-direction:row;transition:filter .3s, opacity .3s,transform .3s cubic-bezier(.2,0,0,1);overflow:hidden}#${config.id.win}.mini{opacity:0;transform:scale(.9) translateY(30px);pointer-events:none}.sidebar{width:240px;background:var(--sidebar);border-right:1px solid var(--swan);border-radius:28px 0 0 28px;display:flex;flex-direction:column;padding:25px 16px;position:relative}.header-lock{display:flex;align-items:center;justify-content:flex-start;padding-left:6px;padding-bottom:12px;cursor:grab;gap:0}.header-lock:active{cursor:grabbing}.logo-img{width:38px;height:38px;margin-right:10px;border-radius:50%;object-fit:contain;filter:drop-shadow(0 4px 6px rgba(0,0,0,.15))}.logo-text-svg{height:45px;width:auto;margin-left:-4px;margin-top:2px;object-fit:contain;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.1))}.nav-list{flex:1;display:flex;flex-direction:column;gap:6px;position:relative}.magic-pill{position:absolute;left:0;top:0;width:4px;height:50px;background:var(--rain-hex);border-radius:0 4px 4px 0;box-shadow:0 0 15px var(--rain-hex);transition:transform .25s cubic-bezier(.3,0,.2,1)}.nav-btn{display:flex;align-items:center;gap:14px;padding:12px 20px;width:100%;text-align:left;background:0 0;border:none;border-radius:14px;color:var(--wolf);font-size:16px;font-weight:700;cursor:pointer;transition:.15s}.nav-btn:hover{background:var(--hover);color:var(--eel)}.nav-btn.active{color:var(--eel)}.nav-btn img{width:28px;height:28px;transition:transform .2s}.nav-btn svg{width:26px;height:26px;stroke:currentColor;transition:transform .2s}.nav-btn:hover img,.nav-btn:hover svg{transform:scale(1.1)}.main-view{flex:1;display:flex;flex-direction:column;position:relative;overflow:hidden}.top-panel{height:75px;display:flex;align-items:center;justify-content:space-between;padding:0 30px;border-bottom:1px solid var(--swan);cursor:grab;z-index:10}.top-panel:active{cursor:grabbing}.header-title-group{display:flex;align-items:center;gap:12px;color:var(--eel)}.header-icon-box{display:flex;align-items:center;justify-content:center;width:32px;height:32px}.header-icon-box img{width:100%;height:100%;object-fit:contain}.header-icon-box svg{width:28px;height:28px;stroke:var(--eel)}.header-text-col{display:flex;flex-direction:column;justify-content:center}.title{font-size:20px;font-weight:700;color:var(--eel);line-height:1.2}.subtitle{font-size:13px;font-weight:500;color:var(--wolf);line-height:1.2}.close-btn{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--wolf);transition:.2s;cursor:pointer}.close-btn:hover{background:var(--close);color:#FF4B4B}.close-btn svg{width:24px;height:24px}.scroller{flex:1;position:relative;padding:0;overflow-y:auto;user-select:text;-webkit-user-select:text}.scroller.no-scroll{overflow:hidden!important}.page{width:100%;padding:25px;opacity:0;transform:translateY(10px);transition:.2s ease-out;display:none}.page.active{opacity:1;transform:none;display:block;position:relative}.card{background:var(--input);border:1px solid var(--swan);border-radius:20px;padding:25px;margin-bottom:20px}.label{display:block;margin-bottom:10px;font-size:13px;font-weight:800;text-transform:uppercase;color:var(--wolf)}.input-group{display:flex;gap:10px;align-items:center}.input{flex:1;padding:14px 18px;border-radius:14px;background:var(--hover);border:2px solid var(--swan);color:var(--eel);font-weight:700;font-size:16px;outline:0;transition:.2s}.input:focus{border-color:var(--rain-hex);box-shadow:0 0 0 4px rgba(0,198,255,.15)}.input[type=number]::-webkit-inner-spin-button,.input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.btn{padding:14px 25px;border-radius:14px;background:linear-gradient(135deg,#00C6FF 0%,#0072FF 100%);color:#fff;border:none;font-size:15px;font-weight:800;text-transform:uppercase;cursor:pointer;box-shadow:0 8px 25px rgba(0,110,255,.25);transition:all .3s ease;letter-spacing:1px;white-space:nowrap}.btn:active{transform:scale(.98)}.btn:hover{filter:brightness(1.1)}.btn.disabled{filter:grayscale(1);cursor:not-allowed;transform:none}.btn.stop{background:linear-gradient(135deg, #FF4B4B 0%, #FF0000 100%);box-shadow:0 8px 25px rgba(255, 0, 0, 0.25)}.btn-got{background:linear-gradient(135deg,#2ecc71 0%,#26a65b 100%)!important;box-shadow:0 0 15px #2ecc71!important;color:#fff!important;border:none!important;pointer-events:none}.status-box{position:relative;background:rgba(0,0,0,0.4);color:#00ff9d;border-radius:14px;border:1px solid var(--swan);margin-bottom:15px;min-height:auto;overflow:hidden;display:flex;flex-direction:column}.status-content{padding:15px 20px;position:relative;z-index:2;font-family:'Google Sans Code','Consolas',monospace;font-size:14px;line-height:1.45}.progress-overlay{position:absolute;bottom:0;left:0;height:5px;width:0%;background:linear-gradient(90deg,#00C6FF,#0072FF);transition:width .3s ease;z-index:1;box-shadow:0 -2px 10px rgba(0,198,255,.5)}.scroller::-webkit-scrollbar{width:6px}.scroller::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:3px}._profile_card{background:var(--input);border:1px solid var(--swan);border-radius:20px;padding:25px;margin-bottom:20px}._profile_header{display:flex;align-items:center;gap:15px;margin-bottom:20px}._avatar{width:56px;height:56px;background:linear-gradient(135deg,#00C6FF 0%,#0072FF 100%);border-radius:16px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:28px;box-shadow:0 8px 20px rgba(0,110,255,.25);overflow:hidden;position:relative}._profile_info{flex:1}._profile_info h2{font-size:20px;font-weight:700;color:var(--eel);margin:0 0 4px}._profile_info p{color:var(--wolf);font-size:14px;margin:0}._icon_btn{width:36px;height:36px;border:none;background:var(--hover);border:1px solid var(--swan);border-radius:10px;color:var(--wolf);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.2s}._icon_btn:hover{background:rgba(0,198,255,.2);color:#0072FF;border-color:rgba(0,198,255,.3)}._icon_btn svg{width:20px;height:20px;stroke:currentColor}._stats_row{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}._stat_item{display:flex;align-items:center;gap:12px;padding:15px;background:var(--hover);border-radius:14px;border:1px solid var(--swan)}._stat_img{width:32px;height:32px;object-fit:contain}._stat_info{display:flex;flex-direction:column}._stat_value{font-size:18px;font-weight:700;color:var(--eel)}._stat_label{font-size:12px;color:var(--wolf)}._profile_status_row{display:flex;align-items:center;gap:10px;margin-bottom:6px}._status_label{font-size:12px;font-weight:800;color:var(--wolf);min-width:55px}.toggle-switch{position:relative;width:40px;height:22px}.toggle-input{opacity:0;width:0;height:0}.toggle-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:var(--swan);transition:.3s;border-radius:22px}.toggle-slider:before{position:absolute;content:"";height:16px;width:16px;left:3px;bottom:3px;background-color:white;transition:.3s;border-radius:50%}.toggle-input:checked+.toggle-slider{background:linear-gradient(135deg,#00C6FF 0%,#0072FF 100%)}.toggle-input:checked+.toggle-slider:before{transform:translateX(18px)}.row-group{display:flex;gap:20px}.card.half{flex:1;margin-bottom:20px;display:flex;flex-direction:column}.big-stat-text,.big-rank{font-size:54px;font-weight:800;color:var(--eel);line-height:1;margin-top:10px;background:linear-gradient(120deg,#33F9FF 0%,#00C6FF 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-family:'Source Code Pro',monospace}.c-select{position:relative;width:100%;font-family:inherit}.c-select-trigger{padding:14px 18px;border-radius:14px;background:var(--hover);border:2px solid var(--swan);color:var(--eel);font-weight:700;font-size:16px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:.2s;user-select:none}.c-select-trigger:hover{background:var(--input)}.c-select.open .c-select-trigger{border-color:var(--rain-hex);box-shadow:0 0 0 4px rgba(0,198,255,.15)}.c-arrow{width:16px;height:16px;stroke:var(--wolf);transition:transform .3s}.c-select.open .c-arrow{transform:rotate(180deg)}.c-options{position:absolute;top:calc(100% + 8px);left:0;right:0;background:var(--dropdown-bg);border:1px solid var(--swan);border-radius:14px;box-shadow:0 10px 40px rgba(0,0,0,.2);overflow:hidden;z-index:100;opacity:0;visibility:hidden;transform:translateY(-10px);transition:all .2s cubic-bezier(.2,0,.2,1);max-height:220px;overflow-y:auto;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);scrollbar-width:none;-ms-overflow-style:none}.c-options::-webkit-scrollbar{width:0;height:0;display:none}.c-select.open .c-options{opacity:1;visibility:visible;transform:translateY(0)}.c-option{padding:12px 18px;cursor:pointer;font-weight:600;color:var(--wolf);transition:background .1s;display:flex;align-items:center}.c-option:hover{background:rgba(0,198,255,.1);color:var(--eel)}.c-option.selected{background:linear-gradient(90deg,rgba(0,198,255,.1),transparent);color:#00C6FF}.search-bar{width:100%;padding:14px 18px;border-radius:14px;background:var(--hover);border:2px solid var(--swan);color:var(--eel);font-weight:700;font-size:16px;outline:0;transition:.2s;margin-bottom:20px}.search-bar:focus{border-color:var(--rain-hex);box-shadow:0 0 0 4px rgba(0,198,255,.15)}.category-header{font-size:14px;font-weight:800;text-transform:uppercase;color:var(--wolf);margin:20px 0 10px;text-align:center;position:relative}.category-header::before,.category-header::after{content:'';position:absolute;top:50%;width:30%;height:1px;background:var(--swan)}.category-header::before{left:0}.category-header::after{right:0}.shop-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(130px, 1fr));gap:12px;margin-bottom:10px}.shop-item{background:var(--hover);border:1px solid var(--swan);border-radius:16px;padding:15px;display:flex;flex-direction:column;align-items:center;text-align:center;transition:.2s;min-height:140px;justify-content:space-between}.shop-item:hover{transform:translateY(-2px);border-color:var(--rain-hex)}.item-icon{width:42px;height:42px;margin-bottom:10px;object-fit:contain}.item-name{font-size:13px;font-weight:700;color:var(--eel);line-height:1.2;margin-bottom:10px;flex:1;display:flex;align-items:center;justify-content:center}.item-btn{width:100%;padding:8px;border-radius:10px;background:var(--input);border:1px solid var(--swan);color:var(--wolf);font-size:11px;font-weight:800;cursor:pointer;transition:.2s}.item-btn:hover{background:var(--rain-hex);color:#fff;border-color:var(--rain-hex)}.item-btn.buying{pointer-events:none}.item-btn.success{background:#2ecc71;color:#fff;border-color:#2ecc71}.shop-search-row{display:flex;gap:10px;align-items:center;margin-bottom:20px}.shop-reload-btn{width:50px;height:50px;flex-shrink:0;border-radius:14px;background:var(--hover);border:2px solid var(--swan);color:var(--wolf);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.2s}.shop-reload-btn:hover{background:var(--input);color:var(--rain-hex);border-color:var(--rain-hex)}.shop-empty-state{text-align:center;padding:30px;color:var(--wolf);display:none;animation:fadeIn .3s}.shop-empty-img{width:64px;height:64px;margin-bottom:15px;opacity:.6;filter:grayscale(1);object-fit:contain}@keyframes fadeIn{from{opacity:0}to{opacity:1}}.quest-filters{display:flex;gap:8px;overflow-x:auto;padding-bottom:5px;margin-top:10px}.quest-filter-btn{padding:8px 16px;border-radius:14px;background:var(--hover);border:2px solid var(--swan);color:var(--wolf);font-weight:700;font-size:12px;cursor:pointer;transition:.2s;white-space:nowrap}.quest-filter-btn:hover{background:var(--input)}.quest-filter-btn.active{background:var(--rain-hex);color:#fff;border-color:var(--rain-hex)}.quest-item{display:flex;align-items:center;padding:15px;background:var(--hover);border:1px solid var(--swan);border-radius:16px;margin-bottom:10px;transition:.2s}.quest-item:hover{border-color:var(--rain-hex);transform:translateY(-2px)}.quest-item.completed{border-left:4px solid #2ecc71}.quest-item.warning{border-left:4px solid #f1c40f}.quest-icon{width:48px;height:48px;object-fit:contain;margin-right:15px}.quest-info{flex:1}.quest-title{font-size:14px;font-weight:700;color:var(--eel);margin-bottom:4px}.quest-meta{font-size:11px;color:var(--wolf);margin-bottom:6px;font-family:'Google Sans Code',monospace}.quest-progress-row{display:flex;justify-content:space-between;font-size:11px;font-weight:700;color:var(--wolf);margin-bottom:4px}.quest-bar-bg{height:8px;background:var(--swan);border-radius:4px;overflow:hidden}.quest-bar-fill{height:100%;background:var(--rain-hex);width:0%;border-radius:4px;transition:width .5s}.quest-item.completed .quest-bar-fill{background:#2ecc71}.quest-actions{display:flex;gap:6px;margin-left:10px;flex-direction:column}.q-mini-btn{padding:6px 10px;border-radius:8px;background:var(--input);border:1px solid var(--swan);color:var(--wolf);font-size:10px;font-weight:800;cursor:pointer;transition:.2s;min-width:60px;text-align:center}.q-mini-btn:hover{background:var(--rain-hex);color:#fff;border-color:var(--rain-hex)}.q-mini-btn.finish{background:linear-gradient(135deg,#f1c40f 0%,#f39c12 100%);color:#fff;border:none}.q-mini-btn.finish:hover{filter:brightness(1.1)}.quest-header-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.dash-row{display:flex;gap:15px;margin-top:15px}.dash-card{flex:1;background:var(--input);border:1px solid var(--swan);border-radius:16px;padding:20px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;text-align:center;position:relative;min-height:220px}.carousel-nav{position:absolute;top:50%;transform:translateY(-50%);cursor:pointer;color:var(--wolf);width:28px;height:28px;background:var(--hover);border-radius:50%;display:flex;align-items:center;justify-content:center;transition:.2s;z-index:5}.carousel-nav:hover{background:var(--swan);color:var(--eel);transform:translateY(-50%) scale(1.1)}.nav-left{left:10px}.nav-right{right:10px}.q-img{width:60px;height:60px;margin:10px 0;object-fit:contain;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.1))}.q-head{font-size:14px;font-weight:800;color:var(--wolf);text-transform:uppercase}.q-text{font-size:13px;font-weight:600;color:var(--eel);margin-bottom:10px;min-height:18px}.q-btn{padding:8px 20px;border-radius:10px;background:linear-gradient(135deg,#00C6FF 0%,#0072FF 100%);color:#fff;border:none;font-size:12px;font-weight:800;cursor:pointer;transition:.2s}.q-btn:hover{filter:brightness(1.1);transform:scale(1.05)}.q-btn.done{background:none;color:#2ecc71;border:none;pointer-events:none;font-size:14px}.dr-spinner{width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:dr-spin .6s linear infinite;display:inline-block;vertical-align:middle;margin-left:5px}@keyframes dr-spin{to{transform:rotate(360deg)}}.task-item{display:flex;align-items:center;justify-content:space-between;padding:10px;background:var(--hover);border:1px solid var(--swan);border-radius:10px;margin-bottom:8px;width:100%}.task-info{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--eel)}.mini-stop{background:linear-gradient(135deg, #FF4B4B 0%, #FF0000 100%);color:#fff;font-size:10px;font-weight:800;border:none;padding:5px 10px;border-radius:8px;cursor:pointer;box-shadow:0 2px 5px rgba(255,0,0,0.3);transition:.2s}.mini-stop:hover{transform:scale(1.05)}.mini-stop.close{background:var(--hover);color:var(--wolf);box-shadow:none;border:1px solid var(--swan);padding:5px 8px}.mini-stop.close:hover{background:var(--close);color:#FF4B4B}.interrupted-text{color:#FF4B4B;font-size:11px;font-weight:700;margin-right:5px;display:flex;align-items:center;gap:4px}.dr-notif-container{position:fixed;z-index:2147483650;padding:20px;display:flex;gap:10px;pointer-events:none;transition:all .3s}.pos-bl{bottom:0;left:0;align-items:flex-start;flex-direction:column-reverse}.pos-br{bottom:0;right:0;align-items:flex-end;flex-direction:column-reverse}.pos-c{bottom:0;left:50%;transform:translateX(-50%);align-items:center;flex-direction:column-reverse}.dr-notification{position:relative;background:var(--dropdown-bg);border:1px solid var(--swan);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);padding:15px 25px;border-radius:24px;display:flex;align-items:center;gap:15px;box-shadow:0 15px 40px rgba(0,0,0,0.35);pointer-events:auto;min-width:300px;max-width:380px;transition:all .4s cubic-bezier(.16,1,.3,1);transform-origin:center;opacity:0;transform:scale(.9) translateY(20px);max-height:0;margin:0;overflow:hidden}.dr-notif-close{position:absolute;top:-8px;right:-8px;width:24px;height:24px;background:var(--input);border:1px solid var(--swan);border-radius:50%;color:var(--wolf);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;font-weight:700;opacity:0;transition:.2s;box-shadow:0 4px 10px rgba(0,0,0,0.2)}.dr-notification:hover .dr-notif-close{opacity:1;top:-10px;right:-10px}.dr-notif-close:hover{background:#FF4B4B;color:#fff;border-color:#FF4B4B}.dr-notif-icon{width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,#00C6FF,#0072FF);display:flex;align-items:center;justify-content:center;flex-shrink:0}.dr-notif-icon img{width:100%;height:100%;object-fit:contain;border-radius:50%}.dr-notif-content{display:flex;flex-direction:column}.dr-notif-title{color:var(--eel);font-weight:800;font-size:16px;line-height:1.2}.dr-notif-desc{color:var(--wolf);font-size:13px;font-weight:600;margin-top:3px;font-family:'Google Sans Code',monospace}.dr-notification.show{opacity:1;transform:scale(1) translateY(0);max-height:150px;margin-top:10px}.pos-bl .dr-notification.hiding{opacity:0;transform:translateX(-100%) scale(.9);max-height:0!important;margin-top:0!important;padding-top:0!important;padding-bottom:0!important;border:none!important}.pos-br .dr-notification.hiding{opacity:0;transform:translateX(100%) scale(.9);max-height:0!important;margin-top:0!important;padding-top:0!important;padding-bottom:0!important;border:none!important}.pos-c .dr-notification.hiding{opacity:0;transform:translateY(30px) scale(.8);max-height:0!important;margin-top:0!important;padding-top:0!important;padding-bottom:0!important;border:none!important}.dr-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.1);backdrop-filter:blur(15px);z-index:2147483648;display:none;align-items:center;justify-content:center;opacity:0;transition:.3s}.dr-modal-overlay.active{opacity:1;display:flex}.dr-modal{background:var(--bg);border:1px solid var(--swan);padding:30px;border-radius:24px;width:90%;max-width:400px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.4);transform:scale(0.9);transition:.3s}.dr-modal .header-icon-box img{border-radius:50%}.dr-modal-overlay.active .dr-modal{transform:scale(1)}.dr-modal-actions{display:flex;gap:10px;margin-top:20px;justify-content:center}.dr-modal-btn-sec{background:transparent;border:2px solid var(--swan);color:var(--wolf);padding:12px 20px;border-radius:12px;font-weight:700;cursor:pointer;transition:.2s}.dr-modal-btn-sec:hover{border-color:var(--rain-hex);color:var(--eel)}[data-dr-tip]{position:relative}[data-dr-tip]:hover::after{content:attr(data-dr-tip);position:absolute;bottom:100%;left:50%;transform:translateX(-50%);padding:6px 10px;background:var(--dropdown-bg);color:var(--eel);border:1px solid var(--swan);border-radius:8px;font-size:12px;font-weight:700;white-space:nowrap;pointer-events:none;box-shadow:0 5px 15px rgba(0,0,0,0.1);margin-bottom:10px;z-index:100;backdrop-filter:blur(10px)}.ac-preview{display:flex;align-items:center;gap:10px;margin:15px 0;background:var(--hover);padding:10px;border-radius:12px;text-align:left}.ac-prev-img{width:40px;height:40px;border-radius:50%;object-fit:cover}.acc-user-card{background:var(--hover);border-radius:14px;border:1px solid var(--swan);padding:15px;display:flex;align-items:center;gap:12px;position:relative;overflow:hidden;transition:.2s}.acc-user-card:hover{border-color:var(--rain-hex)}.acc-avatar{width:42px;height:42px;border-radius:50%;object-fit:cover;flex-shrink:0}.acc-info{flex:1;display:flex;flex-direction:column}.acc-name{color:var(--eel);font-weight:700;font-size:15px}.acc-desc{color:var(--wolf);font-size:12px}.acc-manage-btn{width:100%;margin-top:10px;background:transparent;border:2px solid var(--swan);color:var(--wolf);padding:12px;border-radius:12px;font-weight:700;cursor:pointer;transition:.2s;display:flex;align-items:center;justify-content:center;gap:8px}.acc-manage-btn:hover{border-color:var(--rain-hex);color:var(--eel)}.acc-status-overlay{position:absolute;inset:0;background:var(--dropdown-bg);display:flex;align-items:center;justify-content:center;opacity:0;transition:.2s;cursor:pointer;backdrop-filter:blur(5px);border-radius:14px}.acc-user-card:hover .acc-status-overlay{opacity:1}.acc-status-text{font-weight:800;color:var(--eel);font-size:13px;text-transform:uppercase}.acc-login-btn{background:var(--rain-hex);color:#fff;border:none;padding:6px 14px;border-radius:8px;font-weight:800;font-size:12px;cursor:pointer}.acc-grid{max-height:190px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;margin-bottom:20px;padding-right:4px}.acc-grid::-webkit-scrollbar{width:4px}.acc-grid::-webkit-scrollbar-thumb{background:var(--swan);border-radius:2px}.acc-item-row{display:flex;align-items:center;justify-content:space-between;background:var(--hover);padding:10px;border-radius:12px;border:1px solid var(--swan)}.acc-del-btn{width:28px;height:28px;border-radius:8px;background:var(--input);color:var(--wolf);border:1px solid var(--swan);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:.2s}.acc-del-btn:hover{background:#FF4B4B;color:#fff;border-color:#FF4B4B}.acc-del-btn svg{width:16px;height:16px;stroke:currentColor}`;

const HTML = `<div id="${config.id.app}" class="dr-light"><div id="dr-notif-area" class="dr-notif-container pos-bl"></div><div id="dr-modal-overlay" class="dr-modal-overlay"><div class="dr-modal"><div style="margin-bottom:20px;display:flex;justify-content:center"><div class="header-icon-box" style="width:64px;height:64px;"><img src="${assets.logo}" style="width:100%;height:100%"></div></div><h3 id="dr-modal-title" style="color:var(--eel);font-size:24px;margin:0 0 10px">Alert</h3><div id="dr-modal-content"><p id="dr-modal-msg" style="color:var(--wolf);font-size:16px;line-height:1.5;margin:0 0 25px"></p></div><div id="dr-modal-actions" class="dr-modal-actions"><button class="btn" id="dr-modal-btn" style="width:100%">OKAY</button></div></div></div><div id="${config.id.orb}"><img src="${assets.logo}" draggable="false"></div><div id="${config.id.win}"><div class="sidebar"><div class="header-lock drag"><img src="${assets.logo}" class="logo-img">${assets.titleSvg}</div><div class="nav-list"><div class="magic-pill"></div><button class="nav-btn active" data-id="dash">${assets.icons.dash}<span>Dashboard</span></button><button class="nav-btn" data-id="xp"><img src="${assets.xp}"><span>XP Farm</span></button><button class="nav-btn" data-id="gem"><img src="${assets.gems}"><span>Gem Farm</span></button><button class="nav-btn" data-id="streak"><img src="${assets.streak}"><span>Streak Farm</span></button><button class="nav-btn" data-id="league"><img src="${assets.league}"><span>League Saver</span></button><button class="nav-btn" data-id="quest"><img src="${assets.quest}"><span>Quests</span></button><button class="nav-btn" data-id="shop"><img src="${assets.shop}"><span>Shop</span></button><button class="nav-btn" data-id="misc"><img src="${assets.misc}" style="width:26px;height:26px;"><span>Miscellaneous</span></button><button class="nav-btn" data-id="settings">${assets.icons.settings}<span>Settings</span></button></div></div><div class="main-view"><div class="top-panel drag"><div class="header-title-group"><div class="header-icon-box" id="dr-header-icon">${assets.icons.dash}</div><div class="header-text-col"><span class="title" id="dr-title">Dashboard</span><span class="subtitle" id="dr-subtitle">${desc.dash}</span></div></div><div class="close-btn" id="dr-close">${assets.icons.close}</div></div><div class="scroller"><div class="page active" id="pg-dash"><div class="_profile_card"><div class="_profile_header"><div class="_avatar"><span style="font-size: 28px;">👤</span></div><div class="_profile_info"><h2 id="_username">Loading...</h2><div class="_profile_status_row"><span id="_privacy_label" class="_status_label">...</span><label class="toggle-switch"><input type="checkbox" id="_privacy_toggle" class="toggle-input"><span class="toggle-slider"></span></label></div><p id="_user_details">Fetching data...</p></div><button id="_refresh_profile" class="_icon_btn" data-dr-tip="Refresh Profile">${assets.icons.refresh}</button></div><div class="_stats_row"><div class="_stat_item"><img src="${assets.xp}" class="_stat_img"><div class="_stat_info"><span class="_stat_value" id="_current_xp">0</span><span class="_stat_label">Total XP</span></div></div><div class="_stat_item"><img src="${assets.streak}" class="_stat_img"><div class="_stat_info"><span class="_stat_value" id="_current_streak">0</span><span class="_stat_label">Streak</span></div></div><div class="_stat_item"><img src="${assets.gems}" class="_stat_img"><div class="_stat_info"><span class="_stat_value" id="_current_gems">0</span><span class="_stat_label">Gems</span></div></div></div></div><div class="dash-row"><div class="dash-card" id="dash-quest-card"><div class="carousel-nav nav-left" id="dq-left">${assets.icons.chevLeft}</div><div class="q-head" id="dq-head">DAILY QUESTS</div><img src="${assets.chest}" class="q-img" id="dq-img"><div class="q-text" id="dq-text">Checking status...</div><button class="q-btn" id="dq-btn">FINISH</button><div class="carousel-nav nav-right" id="dq-right">${assets.icons.chevRight}</div></div><div class="dash-card" id="dash-league-card" style="align-items:flex-start; text-align:left; justify-content:flex-start"><div id="dash-card-content" style="width:100%;height:100%;display:flex;flex-direction:column;align-items:flex-start;"><span class="label" style="margin-bottom:5px">INFO</span><div style="color:var(--eel); font-weight:600">Current League Position</div><div class="big-rank" id="dq-rank" style="margin-top:10px">...</div><div class="q-text" id="dq-league-xp" style="margin-top:auto; align-self:flex-start; color:var(--wolf)">... XP</div></div></div></div><div class="card" id="dash-acc-card" style="margin-top:20px"><span class="label" style="font-size:16px;">ACCOUNTS</span><p style="color:var(--wolf); font-size:13px; margin:0 0 15px 0;">Manage your Duolingo accounts and switch between them effortlessly.</p><div id="acc-current-card" class="acc-user-card" style="margin-bottom:15px"></div><button class="acc-manage-btn" id="acc-open-menu">Account Management Menu ${assets.icons.manage}</button></div></div><div class="page" id="pg-xp"><div class="card"><span class="label">Configuration</span><div style="margin-bottom:5px; color:var(--eel); font-weight:600">Enter amount of XP to farm</div><div class="input-group"><input type="number" id="xp-input" class="input" value="100" min="30" step="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57"><button class="btn" id="xp-btn-run">RUN</button></div></div><div class="card"><span class="label">Status</span><div class="status-box"><div class="status-content" id="xp-status-text">STATUS: Idle<br>Target XP: none<br>Loops to run: 0<br>Loops left: 0<br>Estimated Time left: 0<br>Time taken: ...</div><div class="progress-overlay" id="xp-prog-bar"></div></div></div></div><div class="page" id="pg-gem"><div class="card"><span class="label">Configuration</span><div style="margin-bottom:5px; color:var(--eel); font-weight:600">Enter amount of Gem loops to run</div><div class="input-group"><input type="number" id="gem-input" class="input" value="10" min="1" step="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57"><button class="btn" id="gem-btn-run">RUN</button></div></div><div class="card"><span class="label">Status</span><div class="status-box"><div class="status-content" id="gem-status-text">STATUS: Idle<br>Target Gems: none<br>Loops to run: 0<br>Loops left: 0<br>Estimated Time left: 0<br>Time taken: ...</div><div class="progress-overlay" id="gem-prog-bar"></div></div></div></div><div class="page" id="pg-streak"><div class="card"><span class="label">Configuration</span><div style="margin-bottom:5px; color:var(--eel); font-weight:600">Enter amount of Streak Days to restore/farm</div><div class="input-group"><input type="number" id="streak-input" class="input" value="10" min="1" step="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57"><button class="btn" id="streak-btn-run">RUN</button></div></div><div class="card"><span class="label">Status</span><div class="status-box"><div class="status-content" id="streak-status-text">STATUS: Idle<br>Target Days: none<br>Days to farm: 0<br>Days left: 0<br>Estimated Time left: 0<br>Time taken: ...</div><div class="progress-overlay" id="streak-prog-bar"></div></div></div></div><div class="page" id="pg-league"><div class="row-group"><div class="card half"><span class="label">Configuration</span><div style="margin-bottom:8px; color:var(--eel); font-weight:600">Select a league position to reach</div><div class="input-group"><div id="league-select-wrapper" class="c-select" data-value="1"><div class="c-select-trigger"><span class="c-selected-text"># 1</span><svg class="c-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div><div class="c-options" id="league-options"></div></div><button class="btn" id="league-btn-run">RUN</button></div></div><div class="card half"><span class="label">Info</span><div style="color:var(--eel); font-weight:600">Current League Position</div><div class="big-stat-text" id="league-current-rank">...</div><div style="color:var(--wolf); font-weight:600; margin-top:5px" id="league-current-xp">...</div></div></div><div class="card"><span class="label">Status</span><div class="status-box"><div class="status-content" id="league-status-text">STATUS: Idle<br>Target Position: none<br>Target XP: none<br>Loops to run: 0<br>Loops left: 0<br>Estimated Time left: 0<br>Time taken: ...</div><div class="progress-overlay" id="league-prog-bar"></div></div></div></div><div class="page" id="pg-quest"><div class="card"><span class="label">Controls</span><div class="input-group"><button class="btn" id="quest-btn-claim" style="background:linear-gradient(135deg,#f1c40f 0%,#f39c12 100%)">FINISH MONTHLY</button><button id="quest-reload" class="shop-reload-btn" data-dr-tip="Reload Quests">${assets.icons.refresh}</button></div><div class="quest-filters"><button class="quest-filter-btn active" data-filter="MONTHLY">Monthly</button><button class="quest-filter-btn" data-filter="DAILY">Daily</button><button class="quest-filter-btn" data-filter="FRIENDS">Friends</button><button class="quest-filter-btn" data-filter="WEEKLY">Weekly</button><button class="quest-filter-btn" data-filter="ALL">All</button></div></div><div id="quest-container" style="padding-bottom:20px"><p style="text-align:center;color:var(--wolf);padding:20px">Loading quests...</p></div></div><div class="page" id="pg-shop"><div class="card" style="padding-bottom:10px;"><span class="label">Search</span><div class="shop-search-row"><input type="text" id="shop-search" class="search-bar" placeholder="Search items..." style="margin-bottom:0"><button id="shop-reload" class="shop-reload-btn" data-dr-tip="Reload Shop">${assets.icons.refresh}</button></div><div id="shop-container"><p style="text-align:center;color:var(--wolf);padding:20px;">Loading shop items...</p></div><div id="shop-empty" class="shop-empty-state"><img src="${assets.shopIcons.misc}" class="shop-empty-img"><h3>Nothing found?</h3><p>Try searching for something else!</p></div></div></div><div class="page" id="pg-misc"><div class="card"><span class="label">STATUS</span><div style="margin-bottom:5px; color:var(--eel); font-weight:600">FREE SUPER/MAX</div><div id="misc-desc" style="margin-bottom:15px; color:var(--wolf); font-size:13px">Activate Free Max in your account indefinitely and at no cost</div><div class="input-group"><div id="misc-super-select-wrapper" class="c-select" data-value="fake_max"><div class="c-select-trigger"><span class="c-selected-text">Free Max (Web Only)</span><svg class="c-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div><div class="c-options"><div class="c-option selected" data-value="fake_max">Free Max (Web Only)</div><div class="c-option" data-value="legit_trial">Free Super Trial (3-Days)</div></div></div><div id="misc-control-wrapper" style="display:flex;align-items:center;min-width:100px;justify-content:center;"><label class="toggle-switch" id="misc-fake-switch"><input type="checkbox" class="toggle-input"><span class="toggle-slider"></span></label><button class="btn" id="misc-btn-get" style="display:none">GET</button></div></div></div></div><div class="page" id="pg-settings"><div class="card" id="acc-save-card" style="display:none"><span class="label">ACCOUNT SAVING</span><p style="color:var(--wolf); font-size:13px; margin-bottom:10px;">Save your current account to switch back to it later easily.</p><div class="input-group"><button class="btn" id="acc-save-btn" style="width:100%">SAVE CURRENT ACCOUNT</button></div></div><div class="card"><span class="label">CUSTOMIZE NOTIFICATIONS</span><p style="color:var(--wolf); font-size:13px; margin-bottom:10px;">Modify the position of notifications</p><div class="input-group"><div id="notif-pos-wrapper" class="c-select" data-value="bl"><div class="c-select-trigger"><span class="c-selected-text">Bottom Left</span><svg class="c-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div><div class="c-options"><div class="c-option selected" data-value="bl">Bottom Left</div><div class="c-option" data-value="br">Bottom Right</div><div class="c-option" data-value="c">Center</div></div></div><button class="btn" id="notif-pos-btn">SET</button></div></div><div class="card"><span class="label">Loops Delay Control</span><p style="color:var(--wolf); font-size:13px; margin-bottom:10px;">Select a farm type to configure its loop delay (ms).</p><div style="margin-bottom:10px"><div id="set-delay-wrapper" class="c-select" data-value="xp"><div class="c-select-trigger"><span class="c-selected-text">XP Farm</span><svg class="c-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div><div class="c-options"><div class="c-option selected" data-value="xp">XP Farm</div><div class="c-option" data-value="gem">Gem Farm</div><div class="c-option" data-value="streak">Streak Farm</div><div class="c-option" data-value="league">League Saver</div><div class="c-option" data-value="quest">Quests</div></div></div></div><div class="input-group"><input type="number" id="set-delay-input" class="input" placeholder="ms" min="0" step="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57"><button class="btn" id="set-delay-btn">SET</button></div></div><div class="card"><span class="label">LEAGUE SAVER CONTROL</span><p style="color:var(--wolf); font-size:13px; margin-bottom:10px;">Choose how much extra XP you want to generate as you overtake your opponents on the leaderboard.</p><div class="input-group"><input type="number" id="set-league-buffer-input" class="input" placeholder="XP Amount (Default: 60)" min="10" step="1" onkeypress="return event.charCode >= 48 && event.charCode <= 57"><button class="btn" id="set-league-buffer-btn">SET</button></div></div></div></div></div></div></div>`;

class functions {
    constructor() {
        this.activeTasks = new Set();
        this.taskProgress = new Map();
        this.taskTimers = new Map();
        this.interruptedTasks = new Map();
    }

    installInterceptors() {
        const fakeMax = localStorage.getItem('dr_fake_max') === 'true';

        if (!fakeMax) return;

        const TARGET_URL_REGEX = /https:\/\/www\.duolingo\.com\/\d{4}-\d{2}-\d{2}\/users\/.+/;

        const CUSTOM_SHOP_ITEMS = {
            gold_subscription: {
                itemName: "gold_subscription",
                subscriptionInfo: {
                    vendor: "STRIPE",
                    renewing: true,
                    isFamilyPlan: true,
                    expectedExpiration: 9999999999000
                }
            }
        };

        function shouldIntercept(url, method = 'GET') {
            if (method.toUpperCase() !== 'GET') return false;
            const urlStr = (typeof url === 'string') ? url : (url instanceof Request ? url.url : '');
            const isMatch = TARGET_URL_REGEX.test(urlStr);
            if (urlStr.includes('/shop-items')) return false;
            return isMatch;
        }

        function modifyJson(jsonText) {
            try {
                const data = JSON.parse(jsonText);
                data.hasPlus = true;
                if (!data.trackingProperties || typeof data.trackingProperties !== 'object') {
                    data.trackingProperties = {};
                }
                data.trackingProperties.has_item_gold_subscription = true;
                data.shopItems = {
                    ...data.shopItems,
                    ...CUSTOM_SHOP_ITEMS
                };
                return JSON.stringify(data);
            } catch (e) {
                return jsonText;
            }
        }

        const originalFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = function (resource, options) {
            const url = resource instanceof Request ? resource.url : resource;
            const method = (resource instanceof Request) ? resource.method : (options?.method || 'GET');

            if (shouldIntercept(url, method)) {
                return originalFetch.apply(this, arguments).then(async (response) => {
                    const cloned = response.clone();
                    const jsonText = await cloned.text();
                    const modified = modifyJson(jsonText);
                    const newHeaders = new Headers(response.headers);

                    return new Response(modified, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders
                    });
                });
            }
            return originalFetch.apply(this, arguments);
        };

        const originalXhrOpen = unsafeWindow.XMLHttpRequest.prototype.open;
        const originalXhrSend = unsafeWindow.XMLHttpRequest.prototype.send;

        unsafeWindow.XMLHttpRequest.prototype.open = function (method, url, ...args) {
            this._intercept = shouldIntercept(url, method);
            originalXhrOpen.call(this, method, url, ...args);
        };

        unsafeWindow.XMLHttpRequest.prototype.send = function () {
            if (this._intercept) {
                const originalOnReadyStateChange = this.onreadystatechange;
                const xhr = this;
                this.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const modifiedText = modifyJson(xhr.responseText);
                            Object.defineProperty(xhr, 'responseText', {
                                writable: true,
                                value: modifiedText
                            });
                            Object.defineProperty(xhr, 'response', {
                                writable: true,
                                value: modifiedText
                            });
                        } catch (e) {}
                    }
                    if (originalOnReadyStateChange) originalOnReadyStateChange.apply(this, arguments);
                };
            }
            originalXhrSend.apply(this, arguments);
        };

        function removeManageSubscriptionSection() {
            const sections = document.querySelectorAll('section._3f-te');
            for (const section of sections) {
                const h2 = section.querySelector('h2._203-l');
                if (h2 && h2.textContent.trim() === 'Manage subscription') {
                    section.remove();
                    break;
                }
            }
        }

        const manageSubObserver = new MutationObserver(() => {
            removeManageSubscriptionSection();
        });

        manageSubObserver.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    getJWT() {
        let match = document.cookie.match(new RegExp('(^| )jwt_token=([^;]+)'));
        return match ? match[2] : null;
    }

    decJWT(token) {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(atob(base64).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
            return JSON.parse(jsonPayload);
        } catch(e) { return null; }
    }

    formatHeads(jwt) {
        return {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt,
            "User-Agent": navigator.userAgent
        };
    }

    async getUser(sub, headers) {
        const res = await fetch(`https://www.duolingo.com/2023-05-23/users/${sub}?fields=id,username,fromLanguage,learningLanguage,streak,totalXp,level,numFollowers,numFollowing,gems,creationDate,streakData,picture,trackingProperties`, { method: "GET", headers });
        if (res.ok) return await res.json();
        return null;
    }

    getQuestTimestamp(goalId) {
        const regex = /^(\d{4})_(\d{2})_monthly/;
        const match = goalId.match(regex);
        if (match) {
            const year = parseInt(match[1]);
            const month = parseInt(match[2]) - 1;
            const date = new Date(Date.UTC(year, month, 15, 12, 0, 0));
            return date.toISOString();
        }
        return new Date().toISOString();
    }

    getGoalHeaders(token) {
        return {
            "Content-Type": "application/json",
            "x-requested-with": "XMLHttpRequest",
            "accept": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${token}`
        };
    }

    async getPstatus(sub, headers) {
        try {
            const res = await fetch(`https://www.duolingo.com/2023-05-23/users/${sub}/privacy-settings?fields=privacySettings`, { method: "GET", headers });
            const data = await res.json();
            const social = data.privacySettings.find(s => s.id === "disable_social");
            return social ? social.enabled : false;
        } catch (e) { return false; }
    }

    async setPstatus(sub, headers, isPrivate) {
        try {
            await fetch(`https://www.duolingo.com/2023-05-23/users/${sub}/privacy-settings?fields=privacySettings`, {
                method: "PATCH", headers, body: JSON.stringify({ "DISABLE_SOCIAL": isPrivate })
            });
        } catch (e) {}
    }

    async getLdata(userId, headers) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET", url: `${config.api.leaderboards}/users/${userId}?client_unlocked=true&get_reactions=true&_=${Date.now()}`, headers,
                onload: (res) => resolve(res.status === 200 ? JSON.parse(res.responseText) : null),
                onerror: () => resolve(null)
            });
        });
    }

    async getLstatus(userId, headers) {
        const data = await this.getLdata(userId, headers);
        if (!data || !data.active || !data.active.cohort || !data.active.cohort.rankings) return null;
        const rankings = data.active.cohort.rankings;
        const myIndex = rankings.findIndex(r => r.user_id == userId);
        if (myIndex === -1) return null;
        return { rank: myIndex + 1, score: rankings[myIndex].score, rankings };
    }

    async getShop(headers, userId) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET", url: config.api.shop, headers,
                onload: (res) => {
                    try {
                        if (res.status === 200) resolve(JSON.parse(res.responseText).shopItems);
                        else resolve([]);
                    } catch (e) { resolve([]); }
                },
                onerror: () => resolve(null)
            });
        });
    }

    async buyShop(headers, userId, item) {
        const user = await this.getUser(userId, headers);
        const payload = {
            "itemName": item.id, "isFree": true, "consumed": true,
            "fromLanguage": user.fromLanguage, "learningLanguage": user.learningLanguage
        };
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "POST", url: `https://www.duolingo.com/2017-06-30/users/${userId}/shop-items`, headers,
                data: JSON.stringify(payload),
                onload: (res) => resolve(res.status === 200),
                onerror: () => resolve(false)
            });
        });
    }

    async buyLegitSuper(headers, userId) {
        const user = await this.getUser(userId, headers);
        const payload = {
            "itemName": "immersive_subscription",
            "isFree": true,
            "consumed": true,
            "fromLanguage": user.fromLanguage,
            "learningLanguage": user.learningLanguage,
            "productId": "com.duolingo.immersive_free_trial_subscription"
        };
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "POST", url: `https://www.duolingo.com/2017-06-30/users/${userId}/shop-items`, headers,
                data: JSON.stringify(payload),
                onload: (res) => resolve(res.status === 200 || res.status === 201),
                onerror: () => resolve(false)
            });
        });
    }

    async getGoals(headers) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET", url: `${config.api.goals}/schema?ui_language=en&_=${Date.now()}`, headers,
                onload: (res) => resolve(res.status === 200 ? JSON.parse(res.responseText) : null),
                onerror: () => resolve(null)
            });
        });
    }

    async getUserProgress(userId, headers) {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET", url: `${config.api.goals}/users/${userId}/progress?timezone=${tz}&ui_language=en`, headers,
                onload: (res) => resolve(res.status === 200 ? JSON.parse(res.responseText) : null),
                onerror: () => resolve(null)
            });
        });
    }

    async updateGoal(userId, headers, metric, amount, goalId) {
        const payload = {
            "metric_updates": [{ "metric": metric, "quantity": amount }],
            "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
            "timestamp": this.getQuestTimestamp(goalId)
        };

        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "POST", url: `${config.api.goals}/users/${userId}/progress/batch`, headers,
                data: JSON.stringify(payload),
                onload: (res) => resolve(res.status === 200),
                onerror: () => resolve(false)
            });
        });
    }

    async bruteForceGoals(userId, headers, metrics) {
        const updates = metrics.map(m => ({ "metric": m, "quantity": 2000 }));
        updates.push({ "metric": "QUESTS", "quantity": 1 });

        const payload = {
            "metric_updates": updates,
            "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
            "timestamp": new Date().toISOString()
        };

        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "POST", url: `${config.api.goals}/users/${userId}/progress/batch`, headers,
                data: JSON.stringify(payload),
                onload: (res) => resolve(res.status === 200),
                onerror: () => resolve(false)
            });
        });
    }

    formatTime(ms) {
        if (ms < 1000) return `${ms} ms`;
        const m = Math.floor(ms / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return (m > 0 ? `${m} m ` : '') + (s > 0 || m === 0 ? `${s} s` : '');
    }

    stopTask(type) {
        const startTime = this.taskTimers.get(type);
        if (startTime) {
            const duration = this.formatTime(Date.now() - startTime);
            this.interruptedTasks.set(type, duration);
            this.taskTimers.delete(type);
        }
        this.activeTasks.delete(type);
        this.taskProgress.delete(type);
        this.toggleRunBtn(this.getBtnId(type), false);
        this.updateDashRightCard();

        let name = "Unknown Task";
        if(type === 'xp') name = "XP Farm";
        if(type === 'gem') name = "Gem Farm";
        if(type === 'streak') name = "Streak Farm";
        if(type === 'league') name = "League Saver";
        GlobalNotif("DuoRain Active", `${name} Stopped`);
    }

    dismissInterrupted(type) {
        this.interruptedTasks.delete(type);
        this.updateDashRightCard();
    }

    getBtnId(type) {
        if(type === 'xp') return 'xp-btn-run';
        if(type === 'gem') return 'gem-btn-run';
        if(type === 'streak') return 'streak-btn-run';
        if(type === 'league') return 'league-btn-run';
        return '';
    }

    toggleRunBtn(id, isRunning) {
        const btn = document.getElementById(id);
        if(!btn) return;
        if(isRunning) {
            btn.innerHTML = "STOP";
            btn.classList.add('stop');
        } else {
            btn.innerHTML = "RUN";
            btn.classList.remove('stop', 'disabled');
        }
    }

    updateDashRightCard() {
        const card = document.getElementById('dash-card-content');
        if(!card) return;

        if (this.activeTasks.size === 0 && this.interruptedTasks.size === 0) {
            card.innerHTML = `<span class="label" style="margin-bottom:5px">INFO</span><div style="color:var(--eel); font-weight:600">Current League Position</div><div class="big-rank" id="dq-rank" style="margin-top:10px">...</div><div class="q-text" id="dq-league-xp" style="margin-top:auto; align-self:flex-start; color:var(--wolf)">... XP</div>`;
            document.getElementById('_refresh_profile')?.click();
            return;
        }

        let html = `<span class="label" style="margin-bottom:10px">TASKS</span><div style="width:100%;overflow-y:auto;">`;

        this.activeTasks.forEach(task => {
            let name = "Unknown";
            let prog = "";
            const info = this.taskProgress.get(task);

            if(task === 'xp') name = "XP Farm";
            if(task === 'gem') name = "Gem Farm";
            if(task === 'streak') name = "Streak Farm";
            if(task === 'league') name = "League Saver";

            if(info) {
                if(task === 'league') prog = `<span style="font-size:12px;color:var(--wolf);margin-right:5px;">Checking...</span>`;
                else prog = `<span style="font-size:12px;color:var(--wolf);margin-right:5px;">${info.current} / ${info.total}</span>`;
            }

            html += `
                <div class="task-item">
                    <div class="task-info">
                        ${name}
                        <div class="dr-spinner"></div>
                    </div>
                    <div style="display:flex;align-items:center;">
                        ${prog}
                        <button class="mini-stop" data-task="${task}" data-action="stop">STOP</button>
                    </div>
                </div>
            `;
        });

        this.interruptedTasks.forEach((time, task) => {
            let name = "Unknown";
            if(task === 'xp') name = "XP Farm";
            if(task === 'gem') name = "Gem Farm";
            if(task === 'streak') name = "Streak Farm";
            if(task === 'league') name = "League Saver";

            html += `
                <div class="task-item" style="border-color:#FF4B4B;">
                    <div class="task-info">
                        ${name}
                    </div>
                    <div style="display:flex;align-items:center;">
                        <span class="interrupted-text">INTERRUPTED • ${time}</span>
                        <button class="mini-stop close" data-task="${task}" data-action="dismiss">✕</button>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        card.innerHTML = html;

        card.querySelectorAll('.mini-stop').forEach(btn => {
            btn.onclick = (e) => {
                const action = e.target.dataset.action;
                const task = e.target.dataset.task;
                if(action === 'stop') this.stopTask(task);
                if(action === 'dismiss') this.dismissInterrupted(task);
            };
        });
    }

    updateStats(type, status, target, total, left, time, pct, taken, extra = "") {
        const box = document.getElementById(`${type}-status-text`);
        const bar = document.getElementById(`${type}-prog-bar`);

        if(total && total !== '...') {
             let cur = (typeof total === 'number' && typeof left === 'number') ? (total - left) : 0;
             this.taskProgress.set(type, { current: cur, total: total });
             this.updateDashRightCard();
        }

        if (!box || !bar) return;
        const lbl = type === 'xp' ? 'Target XP' : type === 'gem' ? 'Target Gems' : type === 'streak' ? 'Target Days' : 'Target Position';
        const loopsLbl = type === 'streak' ? 'Days to farm' : 'Loops to run';
        const leftLbl = type === 'streak' ? 'Days left' : 'Loops left';
        let h = `STATUS: ${status}<br>${lbl}: ${target || 'none'}<br>`;
        if (type === 'league') h += `Target XP: ${extra}<br>`;
        h += `${loopsLbl}: ${total}<br>${leftLbl}: ${left}<br>Estimated Time left: ${time}<br>Time taken: ${taken}`;
        box.innerHTML = h;
        bar.style.width = `${pct}%`;
    }

    updateDash(data, isPrivate) {
        const el = (id) => document.getElementById(id);
        if (el('_username')) el('_username').innerText = data.username;
        if (el('_user_details')) el('_user_details').innerHTML = `${data.fromLanguage} ${assets.icons.arrow} ${data.learningLanguage}`;
        if (el('_current_xp')) el('_current_xp').innerText = data.totalXp.toLocaleString();
        if (el('_current_streak')) el('_current_streak').innerText = data.streak.toLocaleString();
        if (el('_current_gems')) el('_current_gems').innerText = data.gems.toLocaleString();
        if (el('_privacy_toggle') && el('_privacy_label')) {
            el('_privacy_toggle').checked = isPrivate;
            el('_privacy_label').innerText = isPrivate ? "PRIVATE" : "PUBLIC";
        }
        if (data.picture) {
            let hq = data.picture.replace(/\/(medium|large|small)$/, '/xlarge');
            if (!hq.endsWith('/xlarge') && hq.includes('duolingo.com/ssr-avatars')) hq += '/xlarge';
            if (document.querySelector('._avatar')) {
                const av = document.querySelector('._avatar');
                av.innerHTML = `<img src="${hq}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" draggable="false">`;
            }
        }
    }

    async runXP(amount, delayMs, uiType = 'xp') {
        const btnId = uiType === 'league' ? 'league-btn-run' : 'xp-btn-run';
        if (this.activeTasks.has(uiType)) {
            this.stopTask(uiType);
            return;
        }

        const token = this.getJWT();
        if (!token) { GlobalPopup("Please login."); return; }
        const sub = this.decJWT(token).sub;
        const headers = this.formatHeads(token);

        this.activeTasks.add(uiType);
        this.taskTimers.set(uiType, Date.now());
        this.toggleRunBtn(btnId, true);
        this.updateDashRightCard();

        GlobalNotif("DuoRain Active", "XP Farm is now running!");
        const startTime = Date.now();
        this.updateStats(uiType, "Initializing...", amount, "...", "...", "...", 0, "...", amount);

        const user = await this.getUser(sub, headers);
        let txp = parseInt(amount);
        const min = 30, max = 499;
        if (txp < min) txp = min;
        let mReq = Math.floor(txp / max);
        let rem = txp % max;
        if (rem > 0 && rem < min && mReq > 0) { mReq--; rem += max; }
        const total = mReq + (rem >= min ? 1 : 0);
        let cur = 0;
        const delay = delayMs || 100;

        const loop = async (xp, hh) => {
            const now = Math.floor(Date.now() / 1000);
            const dur = Math.floor(Math.random() * 121 + 300);
            const payload = {
                "awardXp": true, "completedBonusChallenge": true, "fromLanguage": user.fromLanguage,
                "learningLanguage": user.learningLanguage, "hasXpBoost": false, "illustrationFormat": "svg",
                "isFeaturedStoryInPracticeHub": true, "isLegendaryMode": true, "isV2Redo": false,
                "isV2Story": false, "masterVersion": true, "maxScore": 0, "score": 0, "happyHourBonusXp": hh,
                "startTime": now, "endTime": now + dur
            };
            return new Promise(r => GM_xmlhttpRequest({
                method: "POST", url: `${config.api.stories}/fr-en-le-passeport/complete`, headers,
                data: JSON.stringify(payload), onload: res => r(res.status === 200), onerror: () => r(false)
            }));
        };

        for (let i = 0; i < mReq; i++) {
            if (!this.activeTasks.has(uiType)) break;
            cur++;
            const lLeft = total - cur;
            const pct = (cur / total) * 100;
            this.updateStats(uiType, "RUNNING XP", (uiType === 'league' ? `XP ${amount}` : txp), total, lLeft, (lLeft * (delay / 1000)).toFixed(1) + "s", pct, "...", amount);
            await loop(0, 469);
            await new Promise(r => setTimeout(r, delay));
        }

        if (rem >= min && this.activeTasks.has(uiType)) {
            cur++;
            this.updateStats(uiType, "FINISHING...", (uiType === 'league' ? `XP ${amount}` : txp), total, 0, "0s", 100, "...", amount);
            await loop(0, Math.min(Math.max(0, rem - min), 469));
        }

        if(this.activeTasks.has(uiType)) {
            this.activeTasks.delete(uiType);
            this.taskProgress.delete(uiType);
            this.taskTimers.delete(uiType);
            this.toggleRunBtn(btnId, false);
            this.updateStats(uiType, "COMPLETED", (uiType === 'league' ? `XP ${amount}` : txp), total, 0, "0s", 100, this.formatTime(Date.now() - startTime), amount);
            this.updateDashRightCard();
            GlobalNotif("DuoRain Active", `Finished farming ${txp} XP`);
            document.getElementById('_refresh_profile')?.click();
        }
    }

    async runGem(loops, delayMs) {
        if (this.activeTasks.has('gem')) {
            this.stopTask('gem');
            return;
        }

        const token = this.getJWT();
        if (!token) { GlobalPopup("Please login."); return; }
        const sub = this.decJWT(token).sub;
        const headers = this.formatHeads(token);

        this.activeTasks.add('gem');
        this.taskTimers.set('gem', Date.now());
        this.toggleRunBtn('gem-btn-run', true);
        this.updateDashRightCard();

        GlobalNotif("DuoRain Active", "Gem Farm is now running!");
        const startTime = Date.now();
        const total = loops * 60;
        this.updateStats('gem', "Initializing...", total, loops, loops, "...", 0, "...");

        const user = await this.getUser(sub, headers);
        const rewards = ["SKILL_COMPLETION_BALANCED-…-2-GEMS", "SKILL_COMPLETION_BALANCED-…-2-GEMS"];
        let cur = 0;

        for (let i = 0; i < loops; i++) {
            if (!this.activeTasks.has('gem')) break;
            cur++;
            const left = loops - cur;
            const pct = (cur / loops) * 100;
            this.updateStats('gem', "RUNNING", total, loops, left, (left * ((delayMs || 500) / 1000)).toFixed(1) + "s", pct, "...");
            for (const r of rewards) {
                await new Promise(res => GM_xmlhttpRequest({
                    method: "PATCH", url: `${config.api.users}/${sub}/rewards/${r}`, headers,
                    data: JSON.stringify({ consumed: true, fromLanguage: user.fromLanguage, learningLanguage: user.learningLanguage }),
                    onload: () => res(), onerror: () => res()
                }));
            }
            await new Promise(r => setTimeout(r, delayMs || 500));
        }

        if(this.activeTasks.has('gem')) {
            this.activeTasks.delete('gem');
            this.taskProgress.delete('gem');
            this.taskTimers.delete('gem');
            this.toggleRunBtn('gem-btn-run', false);
            this.updateStats('gem', "COMPLETED", total, loops, 0, "0s", 100, this.formatTime(Date.now() - startTime));
            this.updateDashRightCard();
            GlobalNotif("DuoRain Active", `Finished farming ${total} Gems`);
            document.getElementById('_refresh_profile')?.click();
        }
    }

    async runStreak(amount, delayMs) {
        if (this.activeTasks.has('streak')) {
            this.stopTask('streak');
            return;
        }
        const token = this.getJWT();
        if (!token) { GlobalPopup("Please login."); return; }
        const sub = this.decJWT(token).sub;
        const headers = this.formatHeads(token);

        this.activeTasks.add('streak');
        this.taskTimers.set('streak', Date.now());
        this.toggleRunBtn('streak-btn-run', true);
        this.updateDashRightCard();

        GlobalNotif("DuoRain Active", "Streak Farm is now running!");
        const startTime = Date.now();
        this.updateStats('streak', "Initializing...", amount, amount, amount, "...", 0, "...");

        const user = await this.getUser(sub, headers);
        let farmStart;
        if (!user.streakData || !user.streakData.currentStreak) {
            const n = new Date();
            n.setDate(n.getDate() - 1);
            farmStart = n;
        } else {
            try {
                const s = new Date(user.streakData.currentStreak.startDate);
                s.setDate(s.getDate() - 1);
                farmStart = s;
            } catch (e) {
                GlobalPopup("Error parsing date.");
                this.activeTasks.delete('streak');
                this.taskProgress.delete('streak');
                this.taskTimers.delete('streak');
                this.toggleRunBtn('streak-btn-run', false);
                this.updateDashRightCard();
                return;
            }
        }

        let dCnt = 0;
        for (let i = 0; i < amount; i++) {
            if (!this.activeTasks.has('streak')) break;
            dCnt++;
            const left = amount - dCnt;
            const pct = (dCnt / amount) * 100;
            this.updateStats('streak', "RUNNING", amount, amount, left, (left * ((delayMs || 100) / 1000)).toFixed(1) + "s", pct, "...");
            let simDay = new Date(farmStart);
            simDay.setDate(simDay.getDate() - i);
            const end = Math.floor(simDay.getTime() / 1000);
            let sess = null;
            await new Promise(r => GM_xmlhttpRequest({
                method: "POST", url: config.api.sessions, headers,
                data: JSON.stringify({
                    "challengeTypes": config.chBody, "fromLanguage": user.fromLanguage || 'en',
                    "isFinalLevel": false, "isV2": true, "juicy": true, "learningLanguage": user.learningLanguage || 'fr',
                    "smartTipsVersion": 2, "type": "GLOBAL_PRACTICE"
                }),
                onload: (res) => { if (res.status === 200) sess = JSON.parse(res.responseText); r(); },
                onerror: () => r()
            }));

            if (sess && sess.id) {
                await new Promise(r => GM_xmlhttpRequest({
                    method: "PUT", url: `${config.api.sessions}/${sess.id}`, headers,
                    data: JSON.stringify({
                        ...sess, "heartsLeft": 5, "startTime": end - 1, "endTime": end,
                        "enableBonusPoints": false, "failed": false, "maxInLessonStreak": 9, "shouldLearnThings": true
                    }),
                    onload: () => r(), onerror: () => r()
                }));
            }
            await new Promise(r => setTimeout(r, delayMs || 100));
        }

        if(this.activeTasks.has('streak')) {
            this.activeTasks.delete('streak');
            this.taskProgress.delete('streak');
            this.taskTimers.delete('streak');
            this.toggleRunBtn('streak-btn-run', false);
            this.updateStats('streak', "COMPLETED", amount, amount, 0, "0s", 100, this.formatTime(Date.now() - startTime));
            this.updateDashRightCard();
            GlobalNotif("DuoRain Active", `Restored ${amount} Streak days`);
            document.getElementById('_refresh_profile')?.click();
        }
    }

    async runLeague(tRank, delayMs, bufferXP) {
        if (this.activeTasks.has('league')) {
            this.stopTask('league');
            return;
        }
        const token = this.getJWT();
        if (!token) { GlobalPopup("Please login."); return; }
        const sub = this.decJWT(token).sub;
        const headers = this.formatHeads(token);

        this.activeTasks.add('league');
        this.taskTimers.set('league', Date.now());
        this.toggleRunBtn('league-btn-run', true);
        this.updateDashRightCard();

        GlobalNotif("DuoRain Active", "League Saver Started");
        this.updateStats('league', "Checking Rank...", `# ${tRank}`, "...", "...", "...", 0, "...", "...");

        while (true) {
            if(!this.activeTasks.has('league')) break;
            const s = await this.getLstatus(sub, headers);
            if (!s) { GlobalPopup("Failed to fetch leaderboard."); break; }
            document.getElementById('league-current-rank').innerText = `# ${s.rank}`;
            if (s.rank <= tRank) {
                this.updateStats('league', "GOAL REACHED", `# ${tRank}`, 0, 0, "0s", 100, "Done!", "0");
                break;
            }
            const tUser = s.rankings[tRank - 1];
            if (!tUser) break;

            const safeBuffer = (bufferXP && bufferXP >= 10) ? bufferXP : 60;
            const need = (tUser.score - s.score) + safeBuffer;

            if (need > 0) {
                await this.runXP(need, delayMs, 'league');
                if(!this.activeTasks.has('league')) break;
            } else {
                this.updateStats('league', "Waiting for update...", `# ${tRank}`, "...", "...", "...", 50, "...", "Checking...");
                await new Promise(r => setTimeout(r, 2000));
            }
        }

        if(this.activeTasks.has('league')) {
            this.activeTasks.delete('league');
            this.taskProgress.delete('league');
            this.taskTimers.delete('league');
            this.toggleRunBtn('league-btn-run', false);
            this.updateStats('league', "COMPLETED", "League Goal Reached", 0, 0, "0s", 100, "Done!", "0");
            this.updateDashRightCard();
            GlobalNotif("DuoRain Active", "League Goal Reached");
            document.getElementById('_refresh_profile')?.click();
        }
    }
}

class DuoRain {
    constructor() {
        this.state = { mini: false, activeId: 'dash', shopItems: [], questFilter: 'MONTHLY' };
        this.drag = { active: false, x: 0, y: 0 };
        this.orbDrag = { active: false, x: 0, y: 0, elX: 0, elY: 0, hasMoved: false };
        this.delays = this.loadDelays();
        this.leagueBuffer = this.loadLeagueBuffer();
        this.fx = new functions();
        this.dashQuestIndex = 0;
        this.miscState = { type: 'fake_max' };
        this.notifPos = localStorage.getItem('dr_notif_pos') || config.defaults.notifPos;
    }

    loadDelays() {
        const s = localStorage.getItem('dr_delays');
        return s ? JSON.parse(s) : config.defaults.delays;
    }

    loadLeagueBuffer() {
        const s = localStorage.getItem('dr_league_buffer');
        return s ? parseInt(s) : config.defaults.leagueBuffer;
    }

    saveDelays() {
        localStorage.setItem('dr_delays', JSON.stringify(this.delays));
    }

    saveLeagueBuffer() {
        localStorage.setItem('dr_league_buffer', this.leagueBuffer);
    }

    init() {
        if (!document.querySelector('link[href*="Fugaz+One"]')) {
            const link = document.createElement('link');
            link.href = 'https://fonts.googleapis.com/css2?family=Fugaz+One&display=swap';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }

        GM_addStyle(CSS);

        const old = document.getElementById(config.id.app);
        if (old) old.remove();
        document.body.insertAdjacentHTML('beforeend', HTML);
        this.cache();
        this.bind();
        this.manageLogo();
        this.el.orb.style.transform = 'scale(0)';
        this.el.delayInput.value = this.delays[this.el.delayWrapper.getAttribute('data-value')];
        this.el.leagueBufferInput.value = this.leagueBuffer;

        this.updateMiscUI();
        this.updateNotifPosUI();

        GlobalNotif = (title, msg) => this.showNotif(title, msg);
        GlobalPopup = (msg) => this.showAlert(msg);
        GlobalConfirm = (title, msg) => this.showConfirm(title, msg);

        setTimeout(() => this.moveLine(document.querySelector('.nav-btn.active')), 200);
        this.loadDashData();
        this.loadQuests(true);
        this.updateSaveCardVisibility();

        this.monitorTheme();
    }

    async saveAccount(token, dec) {
        const accounts = GM_getValue('dr_accounts', []);
        const exists = accounts.find(a => a.id === dec.sub);
        if(exists) return;

        const h = this.fx.formatHeads(token);
        const u = await this.fx.getUser(dec.sub, h);
        let pic = assets.logo;
        if(u && u.picture) pic = u.picture + "/large";

        accounts.push({
            id: dec.sub,
            username: u ? u.username : "User",
            pic: pic,
            token: token
        });
        GM_setValue('dr_accounts', accounts);
        this.showNotif("Accounts", "Account saved successfully");
        this.loadDashData();
    }

    renderAccountsCard(currentUser, isSaved, currentSub) {
        const card = document.getElementById('acc-current-card');
        if(!card) return;

        let pic = assets.logo;
        if(currentUser.picture) {
            pic = currentUser.picture.replace(/\/(medium|large|small)$/, '/xlarge');
            if(!pic.endsWith('/xlarge') && pic.includes('duolingo.com/ssr-avatars')) pic += '/xlarge';
        }

        let hoverHtml = `<div class="acc-status-overlay"><span class="acc-status-text">Currently Logged-in</span></div>`;

        card.innerHTML = `
            <img src="${pic}" class="acc-avatar">
            <div class="acc-info">
                <span class="acc-name">${currentUser.username}</span>
                <span class="acc-desc">Logged In</span>
            </div>
            ${hoverHtml}
        `;
    }

    switchAccount(id) {
        const accounts = GM_getValue('dr_accounts', []);
        const target = accounts.find(a => a.id == id);
        if(!target) return;
        document.cookie = `jwt_token=${target.token}; domain=.duolingo.com; path=/; max-age=31536000`;
        window.location.reload();
    }

    async manageLogo() {
        const url = assets.logo;
        const kData = 'dr_logo_data';
        const kSize = 'dr_logo_size';
        const setImg = (src) => {
            const list = [
                this.el.orb.querySelector('img'),
                this.el.win.querySelector('.logo-img'),
                document.querySelector('#dr-modal img'),
                document.querySelector('.dr-notif-icon img')
            ];
            assets.logo = src;
            list.forEach(el => { if(el) el.src = src; });
            const modalImg = document.querySelector('.header-icon-box img');
            if(modalImg) modalImg.src = src;
        };

        try {
            const cachedData = sessionStorage.getItem(kData);
            const cachedSize = sessionStorage.getItem(kSize);

            const head = await fetch(url, { method: 'HEAD', cache: 'no-cache' });
            const netSize = head.headers.get('content-length');

            if (cachedData && cachedSize === netSize) {
                setImg(cachedData);
                return;
            }

            const resp = await fetch(url);
            const blob = await resp.blob();
            const reader = new FileReader();
            reader.onload = () => {
                const b64 = reader.result;
                try {
                    sessionStorage.setItem(kData, b64);
                    sessionStorage.setItem(kSize, netSize);
                } catch(e) {}
                setImg(b64);
            };
            reader.readAsDataURL(blob);

        } catch (e) {
            const c = sessionStorage.getItem(kData);
            if(c) setImg(c);
        }
    }

    updateMiscUI() {
        const type = this.miscState.type;
        const btn = document.getElementById('misc-btn-get');
        const sw = document.getElementById('misc-fake-switch');
        const wrap = document.getElementById('misc-control-wrapper');

        if(type === 'legit_trial') {
            sw.style.display = 'none';
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
            sw.style.display = 'block';

            const key = 'dr_fake_max';
            const isActive = localStorage.getItem(key) === 'true';
            sw.querySelector('input').checked = isActive;
        }
    }

    updateNotifPosUI() {
        const wrap = document.getElementById('notif-pos-wrapper');
        if(!wrap) return;
        wrap.setAttribute('data-value', this.notifPos);
        const map = { 'bl': "Bottom Left", 'br': "Bottom Right", 'c': "Center" };
        wrap.querySelector('.c-selected-text').innerText = map[this.notifPos];
        wrap.querySelectorAll('.c-option').forEach(o => {
            if(o.getAttribute('data-value') === this.notifPos) o.classList.add('selected');
            else o.classList.remove('selected');
        });
        document.getElementById('dr-notif-area').className = `dr-notif-container pos-${this.notifPos}`;
    }

    monitorTheme() {
        const update = () => {
            let isDark = false;
            try {
                const bgColor = window.getComputedStyle(document.body).backgroundColor;
                const rgb = bgColor.match(/\d+/g);
                if (rgb) {
                    const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                    isDark = brightness < 128;
                }
            } catch(e) {}

            if (isDark) {
                this.el.root.classList.add('dr-dark');
                this.el.root.classList.remove('dr-light');
            } else {
                this.el.root.classList.add('dr-light');
                this.el.root.classList.remove('dr-dark');
            }
        };

        update();
        setInterval(update, 1000);
    }

    cache() {
        const $ = (s) => document.getElementById(s);
        this.el = {
            root: $(config.id.app), win: $(config.id.win), orb: $(config.id.orb), magic: document.querySelector('.magic-pill'),
            title: $('dr-title'), subtitle: $('dr-subtitle'), headerIcon: $('dr-header-icon'), close: $('dr-close'),
            btns: document.querySelectorAll('.nav-btn'), pages: document.querySelectorAll('.page'), drags: document.querySelectorAll('.drag'),
            xpBtn: $('xp-btn-run'), xpInput: $('xp-input'), gemBtn: $('gem-btn-run'), gemInput: $('gem-input'),
            streakBtn: $('streak-btn-run'), streakInput: $('streak-input'), leagueBtn: $('league-btn-run'),
            leagueWrapper: $('league-select-wrapper'), leagueOptions: $('league-options'), leagueRankText: $('league-current-rank'), leagueXpText: $('league-current-xp'),
            delayWrapper: $('set-delay-wrapper'), delayInput: $('set-delay-input'), delaySetBtn: $('set-delay-btn'),
            refreshProfile: $('_refresh_profile'), privacyToggle: $('_privacy_toggle'), privacyLabel: $('_privacy_label'),
            shopSearch: $('shop-search'), shopContainer: $('shop-container'), shopReload: $('shop-reload'), shopEmpty: $('shop-empty'),
            questClaim: $('quest-btn-claim'), questContainer: $('quest-container'), questFilters: document.querySelectorAll('.quest-filter-btn'), questReload: $('quest-reload'),
            dqHead: $('dq-head'), dqImg: $('dq-img'), dqText: $('dq-text'), dqBtn: $('dq-btn'),
            dqLeft: $('dq-left'), dqRight: $('dq-right'), dqRank: $('dq-rank'), dqLeagueXp: $('dq-league-xp'),
            dashCardContent: $('dash-card-content'),
            leagueBufferInput: $('set-league-buffer-input'), leagueBufferBtn: $('set-league-buffer-btn'),
            notifPosWrapper: $('notif-pos-wrapper'), notifPosBtn: $('notif-pos-btn'),
            accOpenMenu: $('acc-open-menu'),
            accSaveCard: $('acc-save-card'), accSaveBtn: $('acc-save-btn')
        };
    }

    bind() {
        this.el.btns.forEach(b => b.addEventListener('click', () => this.switchTab(b)));
        this.el.close.addEventListener('click', () => this.toggle(true));

        this.el.orb.addEventListener('mousedown', (e) => {
            this.orbDrag = {
                active: true,
                x: e.clientX,
                y: e.clientY,
                elX: this.el.orb.getBoundingClientRect().left,
                elY: this.el.orb.getBoundingClientRect().top,
                hasMoved: false
            };
            this.el.orb.style.transition = 'none';
            e.preventDefault();
        });

        this.el.drags.forEach(d => {
            d.addEventListener('mousedown', (e) => {
                this.drag.active = true;
                this.drag.x = e.clientX - this.el.win.offsetLeft;
                this.drag.y = e.clientY - this.el.win.offsetTop;
                e.preventDefault();
            });
        });

        document.addEventListener('mousemove', (e) => {
            if (this.drag.active) {
                e.preventDefault();
                let x = e.clientX - this.drag.x;
                let y = e.clientY - this.drag.y;
                x = Math.max(0, Math.min(x, window.innerWidth - this.el.win.offsetWidth));
                y = Math.max(0, Math.min(y, window.innerHeight - this.el.win.offsetHeight));
                this.el.win.style.left = `${x}px`;
                this.el.win.style.top = `${y}px`;
            }

            if (this.orbDrag.active) {
                e.preventDefault();
                const dx = e.clientX - this.orbDrag.x;
                const dy = e.clientY - this.orbDrag.y;
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) this.orbDrag.hasMoved = true;

                let nX = this.orbDrag.elX + dx;
                let nY = this.orbDrag.elY + dy;
                const maxW = window.innerWidth - 68;
                const maxH = window.innerHeight - 68;
                nX = Math.max(0, Math.min(nX, maxW));
                nY = Math.max(0, Math.min(nY, maxH));

                this.el.orb.style.left = nX + 'px';
                this.el.orb.style.top = nY + 'px';
                this.el.orb.style.bottom = 'auto';
                this.el.orb.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            this.drag.active = false;
            if (this.orbDrag.active) {
                this.orbDrag.active = false;
                this.el.orb.style.transition = 'transform .3s cubic-bezier(.34,1.56,.64,1)';
                if (!this.orbDrag.hasMoved) {
                    this.toggle(false);
                }
            }
        });

        this.el.xpBtn.addEventListener('click', () => {
            if(this.fx.activeTasks.has('xp')) { this.fx.stopTask('xp'); return; }
            const v = this.el.xpInput.value;
            parseInt(v) >= 30 ? this.fx.runXP(v, this.delays.xp, 'xp') : this.showAlert("Min XP: 30");
        });
        this.el.gemBtn.addEventListener('click', () => {
            if(this.fx.activeTasks.has('gem')) { this.fx.stopTask('gem'); return; }
            const v = this.el.gemInput.value;
            parseInt(v) >= 1 ? this.fx.runGem(parseInt(v), this.delays.gem) : this.showAlert("Min loops: 1");
        });
        this.el.streakBtn.addEventListener('click', () => {
            if(this.fx.activeTasks.has('streak')) { this.fx.stopTask('streak'); return; }
            const v = this.el.streakInput.value;
            parseInt(v) >= 1 ? this.fx.runStreak(parseInt(v), this.delays.streak) : this.showAlert("Min days: 1");
        });
        this.el.leagueBtn.addEventListener('click', () => {
            if(this.fx.activeTasks.has('league')) { this.fx.stopTask('league'); return; }
            const v = this.el.leagueWrapper.getAttribute('data-value');
            if (v) this.fx.runLeague(parseInt(v), this.delays.league, this.leagueBuffer);
        });
        this.el.delaySetBtn.addEventListener('click', () => {
            const t = this.el.delayWrapper.getAttribute('data-value');
            const v = parseInt(this.el.delayInput.value);
            if (!isNaN(v) && v >= 0) {
                this.delays[t] = v;
                this.saveDelays();
                const og = this.el.delaySetBtn.innerText;
                this.el.delaySetBtn.innerText = "SAVED";
                setTimeout(() => { this.el.delaySetBtn.innerText = og; }, 1000);
            } else this.showAlert("Invalid delay");
        });
        this.el.leagueBufferBtn.addEventListener('click', () => {
            const v = parseInt(this.el.leagueBufferInput.value);
            if(!isNaN(v) && v >= 10) {
                this.leagueBuffer = v;
                this.saveLeagueBuffer();
                const og = this.el.leagueBufferBtn.innerText;
                this.el.leagueBufferBtn.innerText = "SAVED";
                setTimeout(() => { this.el.leagueBufferBtn.innerText = og; }, 1000);
            } else this.showAlert("Buffer must be at least 10 XP");
        });

        this.el.notifPosBtn.addEventListener('click', () => {
            const v = this.el.notifPosWrapper.getAttribute('data-value');
            this.notifPos = v;
            localStorage.setItem('dr_notif_pos', v);
            this.updateNotifPosUI();
            this.showNotif("Settings", "Notification Position Saved");
            const og = this.el.notifPosBtn.innerText;
            this.el.notifPosBtn.innerText = "SAVED";
            setTimeout(() => { this.el.notifPosBtn.innerText = og; }, 1000);
        });

        this.el.accOpenMenu.addEventListener('click', () => this.openAccountManager());

        if(this.el.accSaveBtn) {
            this.el.accSaveBtn.addEventListener('click', async () => {
                const t = this.fx.getJWT();
                if(t) {
                    this.el.accSaveBtn.innerText = "SAVING...";
                    const dec = this.fx.decJWT(t);
                    await this.saveAccount(t, dec);
                    this.el.accSaveBtn.innerText = "SAVED";
                    this.updateSaveCardVisibility();
                }
            });
        }

        const miscSwitch = document.getElementById('misc-fake-switch');
        if(miscSwitch) {
            const miscInput = miscSwitch.querySelector('input');
            miscInput.addEventListener('click', async (e) => {
                e.preventDefault();
                const isEnabled = localStorage.getItem('dr_fake_max') === 'true';
                const action = isEnabled ? 'disable' : 'enable';
                const confirm = await GlobalConfirm(`${action.charAt(0).toUpperCase() + action.slice(1)} Max`, `Are you sure you want to ${action} Free Max? This requires a page reload.`);
                if (confirm) {
                    localStorage.setItem('dr_fake_max', (!isEnabled).toString());
                    localStorage.setItem('dr_fake_super', 'false');
                    window.location.reload();
                }
            });
        }

        document.getElementById('misc-btn-get').addEventListener('click', async () => {
            const btn = document.getElementById('misc-btn-get');
            btn.innerText = "Processing...";
            const t = this.fx.getJWT();
            if(t) {
                const sub = this.fx.decJWT(t).sub;
                const h = this.fx.formatHeads(t);
                const success = await this.fx.buyLegitSuper(h, sub);
                if(success) {
                    btn.innerText = "GOT";
                    btn.classList.add('btn-got');
                    setTimeout(() => {
                        btn.innerText = "GET";
                        btn.classList.remove('btn-got');
                    }, 3000);
                    this.showAlert("Super Trial Activated! (Refresh might be needed)");
                } else {
                    btn.innerText = "FAILED";
                    setTimeout(() => { btn.innerText = "GET"; }, 2000);
                }
            } else {
                btn.innerText = "LOGIN REQ";
            }
        });

        this.el.refreshProfile.addEventListener('click', () => { this.loadDashData(); });
        this.el.privacyToggle.addEventListener('change', async (e) => {
            const isP = e.target.checked;
            this.el.privacyLabel.innerText = isP ? "PRIVATE" : "PUBLIC";
            const t = this.fx.getJWT();
            if (t) await this.fx.setPstatus(this.fx.decJWT(t).sub, this.fx.formatHeads(t), isP);
        });

        this.el.shopSearch.addEventListener('input', (e) => {
            const t = e.target.value.toLowerCase().trim();
            let total = 0;
            document.querySelectorAll('.shop-category-wrapper').forEach(w => {
                let catCount = 0;
                w.querySelectorAll('.shop-item').forEach(i => {
                    const m = i.querySelector('.item-name').innerText.toLowerCase().trim().startsWith(t);
                    i.style.display = m ? 'flex' : 'none';
                    if (m) catCount++;
                });
                w.style.display = catCount > 0 ? 'block' : 'none';
                total += catCount;
            });
            this.el.shopEmpty.style.display = total === 0 ? 'block' : 'none';
        });

        this.el.shopReload.addEventListener('click', () => {
            localStorage.removeItem('dr_shop_data');
            this.el.shopContainer.innerHTML = '<p style="text-align:center;color:var(--wolf);padding:20px;">Reloading items...</p>';
            this.loadShop();
        });

        this.el.questReload.addEventListener('click', () => this.loadQuests(false));
        this.el.questClaim.addEventListener('click', () => this.finishCategory());
        this.el.questFilters.forEach(b => {
            b.addEventListener('click', (e) => {
                this.el.questFilters.forEach(x => x.classList.remove('active'));
                e.target.classList.add('active');
                this.state.questFilter = e.target.dataset.filter;
                this.renderQuests();
            });
        });

        this.el.dqLeft.addEventListener('click', () => {
            this.dashQuestIndex = (this.dashQuestIndex - 1 + 3) % 3;
            this.updateDashQuestCard();
        });
        this.el.dqRight.addEventListener('click', () => {
            this.dashQuestIndex = (this.dashQuestIndex + 1) % 3;
            this.updateDashQuestCard();
        });
        this.el.dqBtn.addEventListener('click', async () => {
            const types = ['DAILY', 'MONTHLY', 'FRIENDS'];
            const target = types[this.dashQuestIndex];
            const t = this.fx.getJWT();
            const sub = this.fx.decJWT(t).sub;
            const h = this.fx.getGoalHeaders(t);

            this.el.dqBtn.innerText = "Processing...";

            const uniqueMetrics = new Set();
            this.questState.schema.goals.forEach(g => {
                if (g.category && g.category.includes(target)) {
                    if (g.metric) uniqueMetrics.add(g.metric);
                }
            });

            if (uniqueMetrics.size > 0) {
                await this.fx.bruteForceGoals(sub, h, Array.from(uniqueMetrics));
                this.loadQuests(true);
            } else {
                this.el.dqBtn.innerText = "Error";
                setTimeout(() => this.updateDashQuestCard(), 1000);
            }
        });

        document.getElementById('dr-modal-btn').addEventListener('click', () => {
            document.getElementById('dr-modal-overlay').classList.remove('active');
            document.getElementById('dr-modal-overlay').style.pointerEvents = "none";
            this.el.win.style.filter = "none";
        });

        this.initDropD();
    }

    updateSaveCardVisibility() {
        const t = this.fx.getJWT();
        if(!t) return;
        const sub = this.fx.decJWT(t).sub;
        const accounts = GM_getValue('dr_accounts', []);
        const isSaved = accounts.some(a => a.id == sub);

        if(this.el.accSaveCard) {
            this.el.accSaveCard.style.display = isSaved ? 'none' : 'block';
        }
    }

    openAccountManager() {
        document.getElementById('dr-modal-title').innerText = "Account Management";
        const content = document.getElementById('dr-modal-content');
        const acts = document.getElementById('dr-modal-actions');

        const renderList = () => {
            const accounts = GM_getValue('dr_accounts', []);
            const currentSub = (this.fx.decJWT(this.fx.getJWT()) || {}).sub;

            if(accounts.length === 0) return `<p style="text-align:center;color:var(--wolf);">No saved accounts.</p>`;

            return accounts.map(acc => {
                const isActive = acc.id == currentSub;
                const actionBtn = isActive
                    ? `<span style="color:var(--rain-hex);font-weight:800;font-size:11px;align-self:center;margin-right:5px;">ACTIVE</span>`
                    : `<button class="acc-login-btn" data-id="${acc.id}">LOGIN</button>`;

                return `
                <div class="acc-item-row">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <img src="${acc.pic}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">
                        <span style="font-weight:700;color:var(--eel);font-size:14px;">${acc.username}</span>
                    </div>
                    <div style="display:flex;gap:8px;">
                        ${actionBtn}
                        <button class="acc-del-btn" data-id="${acc.id}">${assets.icons.close}</button>
                    </div>
                </div>`;
            }).join('');
        };

        const updateContent = () => {
            content.innerHTML = `
                <div class="acc-grid" id="acc-modal-list">
                    ${renderList()}
                </div>
            `;

            const list = document.getElementById('acc-modal-list');
            list.querySelectorAll('.acc-login-btn').forEach(b => { b.onclick = () => this.switchAccount(b.dataset.id); });
            list.querySelectorAll('.acc-del-btn').forEach(b => {
                b.onclick = async () => {
                    const c = await GlobalConfirm("Remove Account", "Are you sure you want to remove this account?");
                    if(c) {
                        const accounts = GM_getValue('dr_accounts', []);
                        const n = accounts.filter(a => a.id != b.dataset.id);
                        GM_setValue('dr_accounts', n);
                        updateContent();
                        this.loadDashData();
                        this.updateSaveCardVisibility();
                    }
                }
            });
        };

        updateContent();

        acts.innerHTML = `<button class="btn" id="dr-modal-close" style="width:100%">CLOSE</button>`;

        const ov = document.getElementById('dr-modal-overlay');
        ov.style.pointerEvents = "auto";
        ov.classList.add('active');
        this.el.win.style.filter = "blur(5px)";

        document.getElementById('dr-modal-close').onclick = () => {
            ov.classList.remove('active');
            ov.style.pointerEvents = "none";
            this.el.win.style.filter = "none";
        };
    }

    initDropD() {
        document.querySelectorAll('.c-select-trigger').forEach(t => {
            t.addEventListener('click', (e) => {
                e.stopPropagation();
                const p = t.parentElement;
                document.querySelectorAll('.c-select').forEach(s => { if (s !== p) s.classList.remove('open'); });
                p.classList.toggle('open');
            });
        });
        document.addEventListener('click', (e) => {
            if (e.target.closest('.c-option')) {
                e.stopPropagation();
                const o = e.target.closest('.c-option');
                const w = o.closest('.c-select');
                const v = o.getAttribute('data-value');
                w.querySelector('.c-selected-text').innerText = o.innerText;
                w.setAttribute('data-value', v);
                w.querySelectorAll('.c-option').forEach(op => op.classList.remove('selected'));
                o.classList.add('selected');
                w.classList.remove('open');
                if (w.id === 'set-delay-wrapper') this.el.delayInput.value = this.delays[v];
                if (w.id === 'misc-super-select-wrapper') {
                    this.miscState.type = v;
                    const descEl = document.getElementById('misc-desc');
                    if(v === 'fake_max') descEl.innerText = "Activate Free Max in your account indefinitely and at no cost";
                    else descEl.innerText = "Activate Free 3-Days Super trial";
                    this.updateMiscUI();
                }
            } else {
                document.querySelectorAll('.c-select').forEach(s => s.classList.remove('open'));
            }
        });
    }

    showNotif(title, msg) {
        const area = document.getElementById('dr-notif-area');
        const el = document.createElement('div');
        el.className = 'dr-notification';
        el.innerHTML = `
            <div class="dr-notif-close">×</div>
            <div class="dr-notif-icon"><img src="${assets.logo}"></div>
            <div class="dr-notif-content">
                <span class="dr-notif-title">${title}</span>
                <span class="dr-notif-desc">${msg}</span>
            </div>
        `;
        const closeBtn = el.querySelector('.dr-notif-close');
        const remove = () => {
            if(el.classList.contains('hiding')) return;
            el.classList.remove('show');
            el.classList.add('hiding');
            setTimeout(() => el.remove(), 400);
        };
        closeBtn.onclick = remove;
        area.prepend(el);
        requestAnimationFrame(() => el.classList.add('show'));
        setTimeout(remove, 5000);
    }

    showAlert(msg) {
        document.getElementById('dr-modal-title').innerText = "Alert";
        document.getElementById('dr-modal-content').innerHTML = `<p id="dr-modal-msg" style="color:var(--wolf);font-size:16px;line-height:1.5;margin:0 0 25px">${msg}</p>`;
        document.getElementById('dr-modal-actions').innerHTML = `<button class="btn" id="dr-modal-btn" style="width:100%">OKAY</button>`;
        const ov = document.getElementById('dr-modal-overlay');
        ov.style.pointerEvents = "auto";
        ov.classList.add('active');
        this.el.win.style.filter = "blur(5px)";
        document.getElementById('dr-modal-btn').onclick = () => {
            ov.classList.remove('active');
            ov.style.pointerEvents = "none";
            this.el.win.style.filter = "none";
        };
    }

    async showConfirm(title, msg) {
        return new Promise((resolve) => {
            document.getElementById('dr-modal-title').innerText = title;
            document.getElementById('dr-modal-content').innerHTML = `<p id="dr-modal-msg" style="color:var(--wolf);font-size:16px;line-height:1.5;margin:0 0 25px">${msg}</p>`;
            const acts = document.getElementById('dr-modal-actions');
            acts.innerHTML = `
                <button class="dr-modal-btn-sec" id="dr-confirm-no">CANCEL</button>
                <button class="btn" id="dr-confirm-yes" style="flex:1">CONFIRM</button>
            `;
            const ov = document.getElementById('dr-modal-overlay');
            ov.style.pointerEvents = "auto";
            ov.classList.add('active');
            this.el.win.style.filter = "blur(5px)";

            const close = (res) => {
                ov.classList.remove('active');
                ov.style.pointerEvents = "none";
                this.el.win.style.filter = "none";
                resolve(res);
            };

            document.getElementById('dr-confirm-yes').onclick = () => close(true);
            document.getElementById('dr-confirm-no').onclick = () => close(false);
        });
    }

    async loadDashData() {
        const t = this.fx.getJWT();
        if (t) {
            const sub = this.fx.decJWT(t).sub;
            const h = this.fx.formatHeads(t);
            const u = await this.fx.getUser(sub, h);
            const p = await this.fx.getPstatus(sub, h);
            if (u) {
                this.fx.updateDash(u, p);

                const accounts = GM_getValue('dr_accounts', []);
                const isSaved = accounts.some(a => a.id === sub);

                this.renderAccountsCard(u, isSaved, sub);
            }

            const l = await this.fx.getLstatus(sub, h);
            const elRank = document.getElementById('dq-rank');
            const elXP = document.getElementById('dq-league-xp');

            if (l) {
                this.el.leagueRankText.innerText = `# ${l.rank}`;
                this.el.leagueXpText.innerText = `${l.score.toLocaleString()} XP`;
                if(elRank && this.fx.activeTasks.size === 0) elRank.innerText = `# ${l.rank}`;
                if(elXP && this.fx.activeTasks.size === 0) elXP.innerText = `${l.score.toLocaleString()} XP`;
                this.popLeagueSelect(l.rank);
            } else {
                if(elRank && this.fx.activeTasks.size === 0) elRank.innerText = "--";
                if(elXP && this.fx.activeTasks.size === 0) elXP.innerText = "No League Data";
            }
            this.updateSaveCardVisibility();
        }
    }

    popLeagueSelect(rank) {
        const c = this.el.leagueOptions;
        c.innerHTML = "";
        if (rank <= 1) {
            c.innerHTML = `<div class="c-option" style="cursor:default;opacity:0.5;">Max Rank Reached</div>`;
            this.el.leagueWrapper.querySelector('.c-selected-text').innerText = "Max";
            this.el.leagueWrapper.setAttribute('data-value', "");
            return;
        }
        for (let i = 1; i < rank; i++) {
            const d = document.createElement('div');
            d.className = 'c-option';
            if (i === 1) d.classList.add('selected');
            d.setAttribute('data-value', i);
            d.innerText = `# ${i}`;
            c.appendChild(d);
        }
        this.el.leagueWrapper.querySelector('.c-selected-text').innerText = "# 1";
        this.el.leagueWrapper.setAttribute('data-value', "1");
    }

    formatItem(id) {
        return id.split('_').map(w => {
            if (w === 'xp') return 'XP';
            if (!isNaN(w)) return w;
            return w.charAt(0).toUpperCase() + w.slice(1);
        }).join(' ');
    }

    defineShop(items) {
        const valid = items.filter(i => i.currencyType === "XGM" && !i.id.includes('gift'));
        const p = valid.map(i => {
            let name = i.name || this.formatItem(i.id);
            let cat = "Misc";
            let icon = assets.shopIcons.misc;
            if (i.id.includes('streak_freeze')) {
                cat = "Streak Freezes";
                icon = assets.shopIcons.streak;
            } else if (i.id.includes('xp_boost')) {
                cat = "XP Boosts";
                icon = assets.shopIcons.xp;
                if (i.id.match(/\d+$/)) name += " Mins";
            } else if (i.id.includes('health') || i.id.includes('heart')) {
                cat = "Hearts";
                icon = assets.shopIcons.heart;
                if (i.id.includes('partial')) {
                    const n = i.id.match(/\d$/);
                    if (n) name = `Health Refill Partial (${n[0]} Heart)`;
                }
            } else if (i.id.includes('gem')) {
                cat = "Gems";
                icon = assets.shopIcons.gem;
            } else if (i.type === "outfit") {
                cat = "Outfits";
                icon = assets.shopIcons.outfit;
            } else if (i.id.includes('free_taste')) {
                cat = "Free Taste";
                icon = assets.shopIcons.free;
            }
            return { ...i, displayName: name, category: cat, icon };
        });
        const ord = ["Streak Freezes", "XP Boosts", "Hearts", "Gems", "Outfits", "Free Taste", "Misc"];
        return p.sort((a, b) => {
            const ca = ord.indexOf(a.category);
            const cb = ord.indexOf(b.category);
            return ca !== cb ? ca - cb : a.displayName.localeCompare(b.displayName);
        });
    }

    renderShop(items) {
        this.el.shopContainer.innerHTML = "";
        const grp = {};
        items.forEach(i => {
            if (!grp[i.category]) grp[i.category] = [];
            grp[i.category].push(i);
        });
        for (const c in grp) {
            const w = document.createElement('div');
            w.className = 'shop-category-wrapper';
            const h = document.createElement('div');
            h.className = 'category-header';
            h.innerText = c;
            w.appendChild(h);
            const g = document.createElement('div');
            g.className = 'shop-grid';
            grp[c].forEach(i => {
                const card = document.createElement('div');
                card.className = 'shop-item';
                card.innerHTML = `<img src="${i.icon}" class="item-icon"><div class="item-name">${i.displayName}</div><button class="item-btn" data-id="${i.id}">GET</button>`;
                g.appendChild(card);
            });
            w.appendChild(g);
            this.el.shopContainer.appendChild(w);
        }
        this.el.shopContainer.querySelectorAll('.item-btn').forEach(b => {
            b.addEventListener('click', async () => {
                const id = b.getAttribute('data-id');
                const item = items.find(i => i.id === id);
                if (!item) return;
                b.classList.add('buying');
                b.innerText = "0%";
                const t = this.fx.getJWT();
                if (t) {
                    const h = this.fx.formatHeads(t);
                    const sub = this.fx.decJWT(t).sub;
                    setTimeout(() => { b.innerText = "50%"; }, 300);
                    const ok = await this.fx.buyShop(h, sub, item);
                    b.innerText = "100%";
                    setTimeout(() => {
                        if (ok) {
                            b.innerText = "GOT";
                            b.classList.add('btn-got');
                            this.showNotif("Shop", `Acquired ${item.displayName}`);
                            setTimeout(() => {
                                b.innerText = "GET";
                                b.classList.remove('btn-got');
                                b.classList.remove('buying');
                            }, 3000);
                        } else {
                            b.innerText = "FAILED";
                            b.classList.remove('buying');
                            setTimeout(() => { b.innerText = "GET"; }, 2000);
                            this.showAlert("Failed to buy item.");
                        }
                    }, 300);
                }
            });
        });
    }

    async loadShop() {
        const cached = localStorage.getItem('dr_shop_data');
        if (cached) {
            try {
                const items = JSON.parse(cached);
                if (items && items.length > 0) {
                    this.renderShop(this.defineShop(items));
                    return;
                }
            } catch(e) { localStorage.removeItem('dr_shop_data'); }
        }

        const t = this.fx.getJWT();
        if (t) {
            const h = this.fx.formatHeads(t);
            const s = this.fx.decJWT(t).sub;
            const items = await this.fx.getShop(h, s);
            if(items && items.length > 0) localStorage.setItem('dr_shop_data', JSON.stringify(items));
            this.renderShop(this.defineShop(items));
        }
    }

    async loadQuests(silent = false) {
        const t = this.fx.getJWT();
        if (!t) return;
        const sub = this.fx.decJWT(t).sub;
        const headers = this.fx.getGoalHeaders(t);

        if (!silent) {
            this.el.questContainer.innerHTML = `<p style="text-align:center;color:var(--wolf);padding:20px;">Refreshing quest data...</p>`;
        }

        const user = await this.fx.getUser(sub, this.fx.formatHeads(t));
        this.questState = { creationDate: user.trackingProperties?.creation_date_new ? new Date(user.trackingProperties.creation_date_new) : null };

        const schema = await this.fx.getGoals(headers);
        const progress = await this.fx.getUserProgress(sub, headers);

        if (schema && progress) {
            this.questState.schema = schema;
            this.questState.progress = progress.goals?.progress || {};
            this.questState.earned = new Set(progress.badges?.earned || []);
            this.renderQuests();
            this.updateDashQuestCard();
        } else {
            if (!silent) this.el.questContainer.innerHTML = `<p style="text-align:center;color:red;padding:20px;">Error loading quests.</p>`;
        }
    }

    isQuestOlder(goalId) {
        if (!this.questState.creationDate) return false;
        const m = goalId.match(/^(\d{4})_(\d{2})_monthly/);
        if (m) {
            const y = parseInt(m[1]), mo = parseInt(m[2]) - 1;
            const cY = this.questState.creationDate.getFullYear(), cM = this.questState.creationDate.getMonth();
            if (y < cY || (y === cY && mo < cM)) return true;
        }
        return false;
    }

    updateMainButton() {
        const filter = this.state.questFilter;
        let label = "FINISH ALL";
        if (filter === 'MONTHLY') label = "FINISH MONTHLY";
        else if (filter === 'DAILY') label = "FINISH DAILY";
        else if (filter === 'FRIENDS') label = "FINISH FRIENDS";
        else if (filter === 'WEEKLY') label = "FINISH WEEKLY";
        this.el.questClaim.innerText = label;
    }

    renderQuests() {
        if (!this.questState || !this.questState.schema) return;
        const c = this.el.questContainer;
        c.innerHTML = "";
        this.updateMainButton();

        const map = new Map();
        const monthlyGoals = [], otherGoals = [];
        const monthlyRegex = /^(\d{4}_\d{2})_monthly/;

        this.questState.schema.goals.forEach(g => {
            const match = g.goalId.match(monthlyRegex);
            if (match) {
                monthlyGoals.push({ key: match[1], goal: g });
            } else {
                otherGoals.push(g);
            }
        });

        monthlyGoals.forEach(item => {
            const existing = map.get(item.key);
            if (!existing) {
                map.set(item.key, item.goal);
            } else {
                const existingIsChallenge = existing.category.includes('CHALLENGE');
                const newIsChallenge = item.goal.category.includes('CHALLENGE');
                if (!existingIsChallenge && newIsChallenge) {
                    map.set(item.key, item.goal);
                }
            }
        });

        const allGoals = [...otherGoals, ...map.values()].reverse();

        allGoals.forEach(g => {
            if (!g.category) return;
            if (this.state.questFilter !== 'ALL' && !g.category.includes(this.state.questFilter)) return;

            const isEarned = this.questState.earned.has(g.badgeId) || this.questState.earned.has(g.goalId);
            const isOld = this.isQuestOlder(g.goalId);

            let cur = 0;
            const raw = this.questState.progress[g.goalId];
            if (typeof raw === 'number') cur = raw;
            else if (raw && typeof raw === 'object') cur = raw.progress || 0;

            const tgt = g.threshold || 10;
            let pct = Math.min(100, (cur / tgt) * 100);
            if (isEarned) { pct = 100; cur = tgt; }

            let remaining = Math.max(0, tgt - cur);

            const item = document.createElement('div');
            item.className = `quest-item ${isEarned ? 'completed' : ''} ${isOld ? 'warning' : ''}`;

            let icon = assets.chest;
            if (g.category.includes("MONTHLY")) {
                const b = this.questState.schema.badges.find(x => x.badgeId === g.badgeId);
                if (b && b.icon?.enabled?.lightMode) icon = b.icon.enabled.lightMode.svg || b.icon.enabled.lightMode.url || icon;
            }

            let actionBtn = '';
            if (!isEarned && remaining > 0) {
                 actionBtn = `<button class="q-mini-btn finish" data-m="${g.metric}" data-a="${remaining}" data-id="${g.goalId}">FINISH (+${remaining})</button>`;
            }

            item.innerHTML = `
                <img src="${icon}" class="quest-icon">
                <div class="quest-info">
                    <div class="quest-title">${g.title?.uiString || g.goalId} ${isOld ? '⚠️' : ''}</div>
                    <div class="quest-meta">${g.metric} • ${isEarned ? 'COMPLETED' : `${cur} / ${tgt}`}</div>
                    <div class="quest-bar-bg"><div class="quest-bar-fill" style="width:${pct}%"></div></div>
                </div>
                <div class="quest-actions">
                    ${actionBtn}
                </div>
            `;

            item.querySelectorAll('.q-mini-btn').forEach(btn => {
                btn.onclick = async () => {
                    if (isOld) {
                        const confirm = await GlobalConfirm("Risk Warning", "This quest is old. Continuing might be risky. Proceed?");
                        if(!confirm) return;
                    }
                    btn.innerText = "...";
                    const t = this.fx.getJWT();
                    const sub = this.fx.decJWT(t).sub;
                    const h = this.fx.getGoalHeaders(t);
                    await this.fx.updateGoal(sub, h, btn.dataset.m, parseInt(btn.dataset.a), btn.dataset.id);
                    btn.innerText = "OK";
                    this.showNotif("Quest", "Progress injected successfully");
                    setTimeout(() => this.loadQuests(true), 800);
                };
            });
            c.appendChild(item);
        });
    }

    updateDashQuestCard() {
        if (!this.questState || !this.questState.schema) {
            this.el.dqText.innerText = "Data missing...";
            return;
        }

        const types = ['DAILY', 'MONTHLY', 'FRIENDS'];
        const labels = ['Daily Quests', 'Monthly Quest', 'Friends Quest'];
        const currentType = types[this.dashQuestIndex];

        let total = 0;
        let completed = 0;
        let icon = assets.chest;

        const currentDate = new Date();
        const currentYearStr = currentDate.getFullYear().toString();
        const currentMonthStr = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const monthlyRegex = new RegExp(`^${currentYearStr}_${currentMonthStr}_monthly`);

        if (currentType === 'MONTHLY') {
            this.questState.schema.goals.forEach(g => {
                if (g.category && g.category.includes('MONTHLY')) {
                    if (g.goalId.match(monthlyRegex)) {
                        total++;
                        const b = this.questState.schema.badges.find(x => x.badgeId === g.badgeId);
                        if (b && b.icon?.enabled?.lightMode) icon = b.icon.enabled.lightMode.svg || b.icon.enabled.lightMode.url;

                        const isEarned = this.questState.earned.has(g.badgeId) || this.questState.earned.has(g.goalId);
                        const raw = this.questState.progress[g.goalId];
                        const cur = (typeof raw === 'number') ? raw : (raw?.progress || 0);
                        const tgt = g.threshold || 1000;

                        if (isEarned || cur >= tgt) completed++;
                    }
                }
            });
        } else {
            this.questState.schema.goals.forEach(g => {
                if (g.category && g.category.includes(currentType)) {
                    total++;
                    const isEarned = this.questState.earned.has(g.badgeId) || this.questState.earned.has(g.goalId);
                    const raw = this.questState.progress[g.goalId];
                    const cur = (typeof raw === 'number') ? raw : (raw?.progress || 0);
                    const tgt = g.threshold || 1;
                    if (isEarned || cur >= tgt) completed++;
                }
            });
        }

        const isDone = total > 0 && total === completed;

        this.el.dqHead.innerText = labels[this.dashQuestIndex];
        this.el.dqImg.src = icon;

        if (total === 0) {
            this.el.dqText.innerText = `No active ${labels[this.dashQuestIndex].toLowerCase()}`;
            this.el.dqBtn.classList.add('done');
            this.el.dqBtn.innerText = "NONE";
        } else if (isDone) {
            this.el.dqText.innerText = `All ${labels[this.dashQuestIndex].toLowerCase()} have been completed!`;
            this.el.dqBtn.classList.add('done');
            this.el.dqBtn.innerText = "COMPLETED";
        } else {
            this.el.dqText.innerText = `Complete ${labels[this.dashQuestIndex].toLowerCase()}?`;
            this.el.dqBtn.classList.remove('done');
            this.el.dqBtn.innerText = "FINISH";
        }
    }

    async finishCategory() {
        if (!this.questState || !this.questState.schema) return;
        const activeFilter = this.state.questFilter;

        const confirm = await GlobalConfirm("Mass Completion", `Force complete quests in ${activeFilter} category?`);
        if (!confirm) return;

        this.el.questClaim.innerText = "PROCESSING...";
        this.el.questClaim.classList.add('disabled');

        const t = this.fx.getJWT();
        const sub = this.fx.decJWT(t).sub;
        const h = this.fx.getGoalHeaders(t);

        const uniqueMetrics = new Set();
        this.questState.schema.goals.forEach(g => {
            if (g.category && (activeFilter === 'ALL' || g.category.includes(activeFilter))) {
                if (g.metric) uniqueMetrics.add(g.metric);
            }
        });

        if (uniqueMetrics.size > 0) {
            await this.fx.bruteForceGoals(sub, h, Array.from(uniqueMetrics));
            this.showNotif("Mass Quest", "Finished processing quests");
        } else {
            this.showAlert("No metrics found for this category.");
        }

        this.el.questClaim.innerText = "DONE";
        setTimeout(() => {
            this.updateMainButton();
            this.el.questClaim.classList.remove('disabled');
            this.loadQuests(true);
        }, 1000);
    }

    switchTab(b) {
        const id = b.dataset.id;
        if (this.state.activeId === id) return;
        this.state.activeId = id;
        this.el.title.innerText = b.querySelector('span').innerText;
        this.el.subtitle.innerText = desc[id] || "";
        const ic = b.querySelector('svg') || b.querySelector('img');
        if (ic) {
            this.el.headerIcon.innerHTML = '';
            this.el.headerIcon.appendChild(ic.cloneNode(true));
        }
        this.el.btns.forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        this.moveLine(b);
        this.el.pages.forEach(p => p.classList.remove('active'));
        document.getElementById(`pg-${id}`).classList.add('active');
        if (id === 'league') {
            this.loadDashData();
            document.querySelector('.scroller').classList.add('no-scroll');
        } else {
            document.querySelector('.scroller').classList.remove('no-scroll');
        }
        if (id === 'shop') this.loadShop();
        if (id === 'quest') this.loadQuests(true);
    }

    moveLine(b) {
        if (b) this.el.magic.style.transform = `translateY(${b.getBoundingClientRect().top - b.parentElement.getBoundingClientRect().top}px)`;
    }

    toggle(mini) {
        if (mini) {
            this.el.win.classList.add('mini');
            setTimeout(() => {
                this.el.win.style.display = 'none';
                this.el.orb.style.display = 'flex';
                setTimeout(() => { this.el.orb.style.transform = 'scale(1)'; }, 50);
            }, 300);
        } else {
            this.el.orb.style.transform = 'scale(0) rotate(180deg)';
            this.el.win.style.display = 'flex';
            void this.el.win.offsetWidth;
            setTimeout(() => this.el.win.classList.remove('mini'), 100);
        }
    }
}

const preLoader = new functions();
preLoader.installInterceptors();

if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', () => new DuoRain().init());
else new DuoRain().init();

})();