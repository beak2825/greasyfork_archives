// ==UserScript==
// @name         GeoGuessr Better Breakdown
// @namespace    https://greasyfork.org/users/1179204
// @version      1.2.8
// @description  built-in StreetView Window to view where you guessed and the correct location
// @author       KaKa
// @license      MIT
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain=geoguessr.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@3.1.0/dist/chartjs-plugin-annotation.min.js
// @downloadURL https://update.greasyfork.org/scripts/563091/GeoGuessr%20Better%20Breakdown.user.js
// @updateURL https://update.greasyfork.org/scripts/563091/GeoGuessr%20Better%20Breakdown.meta.js
// ==/UserScript==

"use strict";

const SEARCH_RADIUS = 250000;
const STORAGE_CAP = 50;
const PEEK_STATE = defaultState();
const MAP_TYPES = ["Roadmap", "Satellite", "Terrain"];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MOVEMENT_STORAGE_PREFIX = "ggbbui_move_path_";
const panoCache = new Map();
const markerDataMap = new WeakMap();
const panoListenerMap = new WeakMap();
const markerHandlerMap = new WeakMap();
const movementPathCache = new WeakMap();
const mapPathOverlayMap = new WeakMap();


const SELECTORS = {
    guessMarker: "[data-qa='guess-marker']",
    answerMarker: "[data-qa='correct-location-marker']",
    duelMarker: "[class*='result-map_roundPin']",
    dcMarker: '[class^="map-pin_mapPin__"]:not([data-qa="correct-location-marker"])',
    roundEnd: "[data-qa='close-round-result']",
    gameEnd: "[data-qa='play-again-button']",
    duelEnd: "[class*='game-summary']",
    dcEnd: "[class^='results_positionContainer']",
    roundNumber: "[data-qa='round-number']",
    guessMap: "[class*='guess-map_canvas']",
    resultMap: "[class*='coordinate-result-map_map']",
    duelMap: "[class^='result-map_map']",
    svContainer: "panorama-container",
    moveButton: "[data-qa='undo-move']",
    replay: "[class^='replay-footer_reportAndShare__']",
};

const SVG_SOURCE = {
    COPY: `<svg height="24" width="24" viewBox="0 0 24 24"><path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" fill="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
    LOADING: `<svg height="24" width="24" viewBox="0 0 24 24"><path d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z" fill="currentColor"></path></svg>`,
    SUCCESS: `<svg height="24" width="24" viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" fill="currentColor"></path></svg>`,
    ANALYSIS: `<svg width="24px" height="23px" viewBox="0 0 1024 1024" fill="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#ffffff" d="m665.216 768 110.848 192h-73.856L591.36 768H433.024L322.176 960H248.32l110.848-192H160a32 32 0 0 1-32-32V192H64a32 32 0 0 1 0-64h896a32 32 0 1 1 0 64h-64v544a32 32 0 0 1-32 32H665.216zM832 192H192v512h640V192zM352 448a32 32 0 0 1 32 32v64a32 32 0 0 1-64 0v-64a32 32 0 0 1 32-32zm160-64a32 32 0 0 1 32 32v128a32 32 0 0 1-64 0V416a32 32 0 0 1 32-32zm160-64a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V352a32 32 0 0 1 32-32z"></path></g></svg>`,
    LAYERS: `<svg height="20px" width="20px" viewBox="0 0 512 512" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:currentColor;} </style> <g> <polygon class="st0" points="256,381.424 104.628,328.845 0,365.186 256,454.114 512,365.186 407.373,328.845 "></polygon> <polygon class="st0" points="256,272.235 104.628,219.655 0,255.996 256,344.924 512,255.996 407.373,219.655 "></polygon> <polygon class="st0" points="512,146.806 256,57.886 0,146.806 256,235.734 "></polygon> </g> </g></svg>`,
    SAVE: `<svg viewBox="0 0 24 24" fill="none" width="24" height="24"> <path d="M9 6L12 3M12 3L15 6M12 3V13M7.00023 10C6.06835 10 5.60241 10 5.23486 10.1522C4.74481 10.3552 4.35523 10.7448 4.15224 11.2349C4 11.6024 4 12.0681 4 13V17.8C4 18.9201 4 19.4798 4.21799 19.9076C4.40973 20.2839 4.71547 20.5905 5.0918 20.7822C5.5192 21 6.07899 21 7.19691 21H16.8036C17.9215 21 18.4805 21 18.9079 20.7822C19.2842 20.5905 19.5905 20.2839 19.7822 19.9076C20 19.4802 20 18.921 20 17.8031V13C20 12.0681 19.9999 11.6024 19.8477 11.2349C19.6447 10.7448 19.2554 10.3552 18.7654 10.1522C18.3978 10 17.9319 10 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    DOWNLOAD: `<svg viewBox="0 0 24 24" fill="none" width="24" height="24"><path d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 3V16M12 16L16 11.625M12 16L8 11.625" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    SPAWN: `<svg height="24" width="24" viewBox="0 0 24 24"><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" fill="currentColor"></path></svg>`,
    PANEL: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3,9H17V7H3V9M3,13H17V11H3V13M3,17H17V15H3V17M19,17H21V15H19V17M19,7V9H21V7H19M19,13H21V11H19V13Z" /></svg>`,
    CAMERA: `<svg height="24" width="24" viewBox="0 0 24 24"><path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" fill="currentColor"></path></svg>`,
    Satellite:`<svg viewBox="0 0 24 24" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M16.9394 2.35352C17.5252 1.76774 18.4749 1.76774 19.0607 2.35352L20.4749 3.76774C21.0607 4.35352 21.0607 5.30327 20.4749 5.88906L17.6465 8.71749C17.0607 9.30327 16.111 9.30327 15.5252 8.71749L15.2574 8.44975L14.1998 9.50743L15.753 11.0607C16.7294 12.037 16.7294 13.6199 15.753 14.5962L14.3388 16.0105C13.3625 16.9868 11.7796 16.9868 10.8033 16.0105L9.25002 14.4572L8.2072 15.5L8.47493 15.7677C9.06072 16.3535 9.06072 17.3033 8.47493 17.8891L5.6465 20.7175C5.06072 21.3033 4.11097 21.3033 3.52518 20.7175L2.11097 19.3033C1.52518 18.7175 1.52518 17.7677 2.11097 17.182L4.9394 14.3535C5.52518 13.7677 6.47493 13.7677 7.06072 14.3535L7.50009 14.7929L8.54292 13.7501L6.56066 11.7678C5.58435 10.7915 5.58435 9.20859 6.56066 8.23228L7.97487 6.81807C8.95118 5.84176 10.5341 5.84176 11.5104 6.81807L13.4927 8.80032L14.5503 7.74264L14.111 7.30327C13.5252 6.71749 13.5252 5.76774 14.111 5.18195L16.9394 2.35352ZM7.14093 15.848L6.35361 15.0606C6.15835 14.8654 5.84177 14.8654 5.6465 15.0606L2.81808 17.8891C2.62282 18.0843 2.62282 18.4009 2.81808 18.5962L4.23229 20.0104C4.42755 20.2056 4.74414 20.2056 4.9394 20.0104L7.76782 17.182C7.96309 16.9867 7.96309 16.6701 7.76782 16.4748L7.15214 15.8592C7.15025 15.8573 7.14837 15.8555 7.14649 15.8536C7.14462 15.8517 7.14277 15.8498 7.14093 15.848ZM18.3536 3.06063C18.1583 2.86537 17.8418 2.86537 17.6465 3.06063L14.8181 5.88906C14.6228 6.08432 14.6228 6.4009 14.8181 6.59617L16.2323 8.01038C16.4276 8.20564 16.7441 8.20564 16.9394 8.01038L19.7678 5.18195C19.9631 4.98669 19.9631 4.67011 19.7678 4.47484L18.3536 3.06063ZM7.26777 11.0607C6.68198 10.4749 6.68198 9.52517 7.26777 8.93939L8.68198 7.52517C9.26777 6.93939 10.2175 6.93939 10.8033 7.52517L15.0459 11.7678C15.6317 12.3536 15.6317 13.3033 15.0459 13.8891L13.6317 15.3033C13.0459 15.8891 12.0962 15.8891 11.5104 15.3033L7.26777 11.0607Z" fill="currentColor"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M17.571 16.4217C17.4643 16.6794 17.3079 16.9135 17.1107 17.1107C16.9135 17.3078 16.6794 17.4643 16.4217 17.571C16.1641 17.6777 15.8879 17.7326 15.6091 17.7326C15.3329 17.7326 15.1091 17.5088 15.1091 17.2326C15.1091 16.9565 15.3329 16.7326 15.6091 16.7326C15.7566 16.7326 15.9027 16.7036 16.039 16.6471C16.1754 16.5906 16.2992 16.5079 16.4036 16.4035C16.5079 16.2992 16.5907 16.1754 16.6471 16.039C16.7036 15.9027 16.7326 15.7566 16.7326 15.6091C16.7326 15.3329 16.9565 15.1091 17.2326 15.1091C17.5088 15.1091 17.7327 15.3329 17.7327 15.6091C17.7327 15.8879 17.6777 16.1641 17.571 16.4217Z" fill="#ffffff"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M19.551 16.9097C19.3277 17.5209 18.9794 18.0703 18.5249 18.5248C18.0704 18.9794 17.5209 19.3277 16.9097 19.5509C16.2988 19.7741 15.6397 19.8673 14.9713 19.8288C14.6956 19.8129 14.485 19.5765 14.5009 19.3008C14.5168 19.0251 14.7532 18.8145 15.0289 18.8304C15.5672 18.8615 16.0894 18.786 16.5666 18.6116C17.0437 18.4374 17.4682 18.1673 17.8178 17.8177C18.1673 17.4682 18.4374 17.0437 18.6117 16.5666C18.786 16.0893 18.8615 15.5671 18.8305 15.0288C18.8146 14.7531 19.0251 14.5168 19.3008 14.5008C19.5765 14.4849 19.8129 14.6955 19.8288 14.9712C19.8674 15.6397 19.7741 16.2987 19.551 16.9097Z" fill="currentColor"></path> </g></svg>`,
    Terrain:`<svg viewBox="0 0 24 24" fill="none" width="26" height="26"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 10L3 18H13L8 10Z" fill="currentColor"></path> <path d="M10.5286 10.7543L13.5 6L21 18H15.0572L10.5286 10.7543Z" fill="currentColor"></path> </g></svg>`,
    Roadmap:`<svg viewBox="0 0 24 24" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 8.70938C3 7.23584 3 6.49907 3.39264 6.06935C3.53204 5.91678 3.70147 5.79466 3.89029 5.71066C4.42213 5.47406 5.12109 5.70705 6.51901 6.17302C7.58626 6.52877 8.11989 6.70665 8.6591 6.68823C8.85714 6.68147 9.05401 6.65511 9.24685 6.60952C9.77191 6.48541 10.2399 6.1734 11.176 5.54937L12.5583 4.62778C13.7574 3.82843 14.3569 3.42876 15.0451 3.3366C15.7333 3.24444 16.4168 3.47229 17.7839 3.92799L18.9487 4.31624C19.9387 4.64625 20.4337 4.81126 20.7169 5.20409C21 5.59692 21 6.11871 21 7.16229V15.2907C21 16.7642 21 17.501 20.6074 17.9307C20.468 18.0833 20.2985 18.2054 20.1097 18.2894C19.5779 18.526 18.8789 18.293 17.481 17.827C16.4137 17.4713 15.8801 17.2934 15.3409 17.3118C15.1429 17.3186 14.946 17.3449 14.7532 17.3905C14.2281 17.5146 13.7601 17.8266 12.824 18.4507L11.4417 19.3722C10.2426 20.1716 9.64311 20.5713 8.95493 20.6634C8.26674 20.7556 7.58319 20.5277 6.21609 20.072L5.05132 19.6838C4.06129 19.3538 3.56627 19.1888 3.28314 18.7959C3 18.4031 3 17.8813 3 16.8377V8.70938Z" stroke="currentColor" stroke-width="1.5"></path> <path d="M9 6.63867V20.5" stroke="currentColor" stroke-width="1.5"></path> <path d="M15 3V17" stroke="currentColor" stroke-width="1.5"></path> </g></svg>`,
    PATH: `<svg viewBox="0 0 24 24" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.78 20H9.78C7.98 20 4.58 19.09 4.58 15.64C4.58 12.19 7.98 11.28 9.78 11.28H14.22C14.37 11.28 17.92 11.23 17.92 8.42C17.92 5.61 14.37 5.56 14.22 5.56H9.22C9.02109 5.56 8.83032 5.48098 8.68967 5.34033C8.54902 5.19968 8.47 5.00891 8.47 4.81C8.47 4.61109 8.54902 4.42032 8.68967 4.27967C8.83032 4.13902 9.02109 4.06 9.22 4.06H14.22C16.02 4.06 19.42 4.97 19.42 8.42C19.42 11.87 16.02 12.78 14.22 12.78H9.78C9.63 12.78 6.08 12.83 6.08 15.64C6.08 18.45 9.63 18.5 9.78 18.5H14.78C14.9789 18.5 15.1697 18.579 15.3103 18.7197C15.451 18.8603 15.53 19.0511 15.53 19.25C15.53 19.4489 15.451 19.6397 15.3103 19.7803C15.1697 19.921 14.9789 20 14.78 20Z" fill="currentColor"></path> <path d="M6.44 8.31C5.74314 8.30407 5.06363 8.09202 4.48708 7.70056C3.91054 7.30909 3.46276 6.75573 3.20018 6.11021C2.93759 5.46469 2.87195 4.75589 3.01153 4.07312C3.1511 3.39036 3.48965 2.76418 3.9845 2.2735C4.47935 1.78281 5.10837 1.44958 5.79229 1.31579C6.47622 1.182 7.18444 1.25363 7.82771 1.52167C8.47099 1.78971 9.02054 2.24215 9.40711 2.82199C9.79368 3.40182 9.99998 4.08311 10 4.78C10 5.2461 9.90773 5.70759 9.72846 6.13783C9.54919 6.56808 9.28648 6.95856 8.95551 7.28675C8.62453 7.61494 8.23184 7.87433 7.80009 8.04995C7.36834 8.22558 6.90609 8.31396 6.44 8.31ZM6.44 2.75C6.04444 2.75 5.65776 2.86729 5.32886 3.08706C4.99996 3.30682 4.74362 3.61918 4.59224 3.98463C4.44087 4.35008 4.40126 4.75221 4.47843 5.14018C4.5556 5.52814 4.74609 5.8845 5.02579 6.16421C5.3055 6.44391 5.66186 6.6344 6.04982 6.71157C6.43779 6.78874 6.83992 6.74913 7.20537 6.59776C7.57082 6.44638 7.88318 6.19003 8.10294 5.86114C8.32271 5.53224 8.44 5.14556 8.44 4.75C8.44 4.48735 8.38827 4.22728 8.28776 3.98463C8.18725 3.74198 8.03993 3.5215 7.85422 3.33578C7.6685 3.15007 7.44802 3.00275 7.20537 2.90224C6.96272 2.80173 6.70265 2.75 6.44 2.75Z" fill="currentColor"></path> <path d="M17.56 22.75C16.8614 22.752 16.1779 22.5466 15.5961 22.1599C15.0143 21.7733 14.5603 21.2227 14.2916 20.5778C14.0229 19.933 13.9515 19.2229 14.0866 18.5375C14.2217 17.8521 14.5571 17.2221 15.0504 16.7275C15.5437 16.2328 16.1726 15.8956 16.8577 15.7586C17.5427 15.6215 18.253 15.6909 18.8986 15.9577C19.5442 16.2246 20.0961 16.6771 20.4844 17.2578C20.8727 17.8385 21.08 18.5214 21.08 19.22C21.08 20.1545 20.7095 21.0508 20.0496 21.7125C19.3898 22.3743 18.4945 22.7473 17.56 22.75ZM17.56 17.19C17.1644 17.19 16.7778 17.3073 16.4489 17.5271C16.12 17.7468 15.8636 18.0592 15.7122 18.4246C15.5609 18.7901 15.5213 19.1922 15.5984 19.5802C15.6756 19.9681 15.8661 20.3245 16.1458 20.6042C16.4255 20.8839 16.7819 21.0744 17.1698 21.1516C17.5578 21.2287 17.9599 21.1891 18.3254 21.0377C18.6908 20.8864 19.0032 20.63 19.2229 20.3011C19.4427 19.9722 19.56 19.5856 19.56 19.19C19.56 18.6596 19.3493 18.1508 18.9742 17.7758C18.5991 17.4007 18.0904 17.19 17.56 17.19Z" fill="currentColor"></path> </g></svg>`,
    PIN: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.9999 17V21M6.9999 12.6667V6C6.9999 4.89543 7.89533 4 8.9999 4H14.9999C16.1045 4 16.9999 4.89543 16.9999 6V12.6667L18.9135 15.4308C19.3727 16.094 18.898 17 18.0913 17H5.90847C5.1018 17 4.62711 16.094 5.08627 15.4308L6.9999 12.6667Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path> </g></svg>`,
};

const TILE_TEMPLATE = {
    Google_Maps: `https://mapsresources-pa.googleapis.com/v1/tiles?map_id=61449c20e7fc278b&version=15797339025669136861&pb=!1m7!8m6!1m3!1i{z}!2i{x}!3i{y}!2i9!3x1!2m2!1e0!2sm!3m7!2sen!3smx!5e1105!12m1!1e3!12m1!1e2!4e0!5m5!1e0!8m2!1e1!1e1!8i47083502!6m6!1e12!2i2!11e0!39b0!44e0!50e0`,
    Google_Terrain: `https://mapsresources-pa.googleapis.com/v1/tiles?map_id=61449c20e7fc278b&version=15797339025669136861&pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e4!2st!3i725!2m3!1e0!2sr!3i725483392!3m12!2sen!3smx!5e18!12m1!1e3!2m2!1sset!2sTerrain!12m3!1e37!2m1!1ssmartmaps!4e0!5m2!1e3!5f2!23i56565656!26m2!1e2!1e3`,
    Google_Satellite: `https://mts1.googleapis.com/vt?hl=en-mx&lyrs=s&x={x}&y={y}&z={z}`,
    Google_StreetView: `https://maps.googleapis.com/maps/vt?pb=%211m5%211m4%211i{z}%212i{x}%213i{y}%214i256%212m8%211e2%212ssvv%214m2%211scc%212s*211m3*211e2*212b1*213e2*212b1*214b1%214m2%211ssvl%212s*212b1%213m17%212sen%213sUS%215e18%2112m4%211e68%212m2%211sset%212sRoadmap%2112m3%211e37%212m1%211ssmartmaps%2112m4%211e26%212m2%211sstyles%212ss.e%3Ag.f%7Cp.c%3A%231098ad%7Cp.w%3A1%2Cs.e%3Ag.s%7Cp.c%3A%2399e9f2%7Cp.w%3A3%215m1%215f1.35`,
    Google_Satellite_Road: `https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m2!1e0!2sm!3m14!2sen!3smx!5e18!12m4!1e68!2m2!1sset!2sRoadmapSatellite!12m3!1e37!2m1!1ssmartmaps!12m1!1e3!5m1!5f1.35`,
    Google_Hybrid_Labels: `https://www.google.com/maps/vt?pb=!1m7!8m6!1m3!1i{z}!2i{x}!3i{y}!2i9!3x1!2m2!1e0!2sm!3m7!2sen!3smx!5e1105!12m1!1e4!12m1!1e2!4e0!5m5!1e0!8m2!1e1!1e1!8i47083502!6m6!1e12!2i2!11e0!39b0!44e0!50e0`,
    Google_Labels: `https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m2!1e0!2sm!3m17!2sen!3smx!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2ss.t:18|s.e:g.s|p.w:3,s.e:g|p.v:off,s.t:1|s.e:g.s|p.v:off,s.e:l|p.v:on!4i0!5m2!1e0!5f2`,
    Google_Labels_Emphasise_Borders: `https://www.google.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m2!1e0!2sm!3m17!2sen!3smx!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2ss.t:18|s.e:g.s|p.w:2,s.e:g|p.v:off,s.t:1|s.e:g.s|p.v:on,s.e:l|p.v:on!4i0!5m2!1e0!5f1.5`,
}

let svs = null;
let spawn = null;
let viewer = null;
let guessMap = null;
let gameViewer = null;
let cleanStyle = null;
let peekMarker = null;
let mapObserver = null;
let panoSelector = null;
let closeControl = null;
let pathPolyline = null;
let customMapType = null;
let gameLoopTimer = null;
let coverageLayer = null;
let opacityControl = null;
let markerObserver = null;
let viewerObserver = null;
let currentGameToken = null;
let currentMovementRound = null;
let mapTypeIndex = 0;
let movementPath = [];
let currentMovementPath = [];


let isPhotoMode = false;
let isCoverageLayer = false;
let isPathDisplayed = false;
let gameLoopRunning = false;
let clickListenerAttached = false;

let MAP_LIST;
let LOCATION;
let MAP_MAKING_API_KEY = GM_getValue("MAP_MAKING_API_KEY", "PASTE_YOUR_KEY_HERE");
let previousMapId = JSON.parse(GM_getValue('previousMapId', null));
let previousTags = JSON.parse(GM_getValue('previousTags', '[]'));
let currentLayers = ["Google_Maps","Google_Labels"];



// ============================================================================
// UTILITY FUNCTIONS - DOM & DATA ACCESS
// ============================================================================

const domCache = {
    _nextRoot: null,
    _lastNextRootCheck: 0,
    get nextRoot() {
        const now = Date.now();
        if (!this._nextRoot || now - this._lastNextRootCheck > 1000) {
            this._nextRoot = document.querySelector('#__next');
            this._lastNextRootCheck = now;
        }
        return this._nextRoot;
    },
    queryOne(selector) {
        return this.nextRoot?.querySelector(selector) || null;
    },
    queryAll(selector) {
        return this.nextRoot?.querySelectorAll(selector) || [];
    },
    clear() {
        this._nextRoot = null;
        this._lastNextRootCheck = 0;
    }
};

function throttle(fn, delay) {
    let lastCall = 0;
    let timeoutId = null;
    return function (...args) {
        const now = Date.now();
        const remaining = delay - (now - lastCall);
        if (remaining <= 0) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            lastCall = now;
            fn.apply(this, args);
        } else if (!timeoutId) {
            timeoutId = setTimeout(() => {
                lastCall = Date.now();
                timeoutId = null;
                fn.apply(this, args);
            }, remaining);
        }
    };
}

function getReactFiber(el) {
    if (!el) return null;
    const key = Object.keys(el).find(k => k.startsWith("__reactFiber"));
    return key ? el[key] : null;
}

function getGuessMap(el) {
    const fiber = getReactFiber(el);
    try {
        return fiber?.return?.memoizedState?.memoizedState?.current?.instance || fiber?.return?.updateQueue?.lastEffect?.deps?.[0] || null;
    } catch { return null; }
}

function getGameViewer(el) {
    const fiber = getReactFiber(el);
    try {
        return fiber?.return?.return?.return?.sibling?.memoizedProps?.panorama || null;
    } catch { return null; }
}

function getMarkerCoords(marker) {
    const fiber = getReactFiber(marker);
    try {
        const data = fiber?.return?.return?.return?.memoizedProps
        return { lat: data.lat, lng: data.lng };
    } catch { return null; }
}

function extractGameData() {
    const marker = domCache.queryOne(SELECTORS.answerMarker)
    const fiber = getReactFiber(marker);
    try {
        const data = fiber?.return?.return?.return?.return?.return?.memoizedProps
        return data;
    } catch { return null; }
}

function getDuelData(marker) {
    const fiber = getReactFiber(marker);
    if (!fiber) return null;
    return fiber.return?.return?.return?.return?.memoizedProps?.round || fiber.return?.return?.return?.return?.pendingProps || null;
}

function formatDistance(num) {
    return num >= 1000 ? `${(num / 1000).toFixed(1)} km` : `${Math.floor(num)} m`;
}

function convertPanoId(panoId) {
    if (!panoId) return null;
    try {
        const bytes = new Uint8Array(panoId.match(/.{1,2}/g).map(b => parseInt(b, 16)));
        return new TextDecoder("utf-8").decode(bytes);
    } catch (e) {
        console.error("Error:", e);
        return panoId;
    }
}

function getStreetViewThumbUrl(pano) {
    if (pano.panoId) {
        return `https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=${pano.panoId}&cb_client=maps_sv.tactile.gps&w=1024&h=768&yaw=${pano.heading || 0}&pitch=${pano.pitch || 0}&thumbfov=120`;
    } else if (pano.location) {
        return `https://maps.googleapis.com/maps/api/streetview?size=1024x768&location=${pano.location.lat},${pano.location.lng}&heading=${pano.heading || 0}&pitch=${pano.pitch || 0}&fov=120&key=AIzaSyDqRTXlnHXELLKn7645Q1L_5oc4CswKZK4`;
    }
    return null
}

function getRadius(coords1, coords2) {
    return unsafeWindow.google.maps.geometry.spherical.computeDistanceBetween(
        coords1,
        coords2,
    );
}

function getCurrentRound() {
    const el = domCache.queryOne(SELECTORS.roundNumber);
    if (!el) return null;
    const m = el.textContent.match(/\d+/);
    return m ? Number(m[0]) : null;
}

function extractDate(entry) {
    for (const key in entry) {
        const value = entry[key];
        if (value instanceof Date) {
            return value;
        }
        if (typeof value === 'string' && !isNaN(Date.parse(value))) {
            return new Date(value);
        }
    }
    return null;
}

function getGameToken(url) {
    const m = url.match(/[0-9a-zA-Z]{16}/);
    return m ? m[0] : null;
}

function applyStyles(element, styles) {
    Object.assign(element.style, styles);
}

// ============================================================================
// STREET VIEW SERVICE & PANORAMA CACHE
// ============================================================================

function initSVS() {
    if (!svs && unsafeWindow.google?.maps?.StreetViewService) {
        svs = new unsafeWindow.google.maps.StreetViewService();
    }
}

function createCoordCacheKey(coords) {
    const lat = Number(coords.lat.toFixed(5));
    const lng = Number(coords.lng.toFixed(5));
    return `${lat},${lng}`;
}

async function getNearestPano(coords) {
    const cacheKey = createCoordCacheKey(coords);
    if (panoCache.has(cacheKey)) {
        return panoCache.get(cacheKey);
    }

    const nearestPano = { error: true };
    let radius = SEARCH_RADIUS;
    let oldRadius;
    if (!svs) initSVS();

    for (; ;) {
        try {
            const pano = await svs.getPanorama({
                location: coords,
                radius: radius,
                sources: ["outdoor"],
                preference: "nearest",
            });

            radius = getRadius(coords, pano.data.location.latLng);
            if (oldRadius && radius >= oldRadius) break;

            nearestPano.radius = radius;
            nearestPano.location = pano.data.location.latLng
            nearestPano.panoId = pano.data.location.pano
            nearestPano.heading = pano.data.tiles.originHeading
            nearestPano.pitch = pano.data.tiles.originPitch
            nearestPano.error = false
            oldRadius = radius;
        } catch (e) {
            break;
        }
    }

    // Cache the result
    panoCache.set(cacheKey, nearestPano);

    // Limit cache size to prevent memory issues (keep last 100 entries)
    if (panoCache.size > 100) {
        const firstKey = panoCache.keys().next().value;
        panoCache.delete(firstKey);
    }

    return nearestPano;
}

// ============================================================================
// INITIALIZATION FUNCTIONS
// ============================================================================

function startMapObserver() {
    stopMapObserver();

    mapObserver = new MutationObserver((mutations) => {
        if (!mutations.some(m => m.addedNodes.length > 0)) return;
        const duelMap = domCache.queryOne(SELECTORS.duelMap)
        const mapEl = domCache.queryOne(SELECTORS.guessMap) || domCache.queryOne(SELECTORS.resultMap) || duelMap;
        if (!mapEl) return;
        guessMap = getGuessMap(mapEl);
        if (guessMap && !clickListenerAttached) {
            startViewerObserver()
            attachClickListener(guessMap);
            clickListenerAttached = true;
            if ((duelMap && window.location.href.includes('summary'))) makeMapResizable()
            stopMapObserver();
        }
    });

    mapObserver.observe(domCache.nextRoot, {
        childList: true,
        subtree: true,
        attributes: false,
    });
}

function startMarkerObserver() {
    stopMarkerObserver();

    markerObserver = new MutationObserver((mutations) => {
        const hasRelevantChange = mutations.some(m => {
            if (m.addedNodes.length === 0 && m.removedNodes.length === 0) {
                return false;
            }

            for (const node of m.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const dataQa = node.getAttribute?.('data-qa') || '';
                    if (node.classList.contains('map-pin') ||
                        dataQa.includes('marker') ||
                        dataQa === 'guess-marker' ||
                        dataQa === 'correct-location-marker' ||
                        node.classList.contains('roundPin')) {
                        return true;
                    }
                }
            }

            return m.addedNodes.length > 0 || m.removedNodes.length > 0;
        });

        if (hasRelevantChange) {
            throttledScheduleGameLoop();
        }
    });

    markerObserver.observe(domCache.nextRoot, {
        childList: true,
        subtree: true,
    });
}

function startViewerObserver() {
    stopViewerObserver();

    viewerObserver = new MutationObserver((mutations) => {
        if (!mutations.some(m => m.addedNodes.length > 0)) return;
        const isMove = domCache.queryOne(SELECTORS.moveButton)
        if (!isMove) return
        gameViewer = getGameViewer(document.getElementById(SELECTORS.svContainer))
        if (gameViewer) {
            attachPanoChangeListener()
            stopViewerObserver();
        }
    });

    viewerObserver.observe(domCache.nextRoot, {
        childList: true,
        subtree: true,
        attributes: false,
    });
}

// ============================================================================
// OBSERVER CLEANUP FUNCTIONS
// ============================================================================

function stopMapObserver() {
    if (mapObserver) {
        mapObserver.disconnect();
        mapObserver = null;
    }
    clickListenerAttached = false;
}

function stopMarkerObserver() {
    if (markerObserver) {
        markerObserver.disconnect();
        markerObserver = null;
    }

    if (gameLoopTimer) {
        clearTimeout(gameLoopTimer);
        gameLoopTimer = null;
    }
}

function stopViewerObserver() {
    if (viewerObserver) {
        viewerObserver.disconnect();
        viewerObserver = null;
    }
}

// ============================================================================
// GAME LOOP & SCHEDULING
// ============================================================================

function scheduleGameLoop(delay = 200) {
    if (gameLoopTimer) {
        clearTimeout(gameLoopTimer);
    }

    gameLoopTimer = setTimeout(async () => {
        if (gameLoopRunning) return;

        gameLoopRunning = true;
        try {
            await gameLoop();
        } catch (err) {
            console.error('[Guess Peek] gameLoop error:', err);
        } finally {
            gameLoopRunning = false;
        }
    }, delay);
}

// Throttled game loop scheduler to reduce callback frequency
const throttledScheduleGameLoop = throttle(() => scheduleGameLoop(150), 100);

async function gameLoop() {
    if (!domCache.nextRoot) return;

    const token = getGameToken(location.pathname);
    if (token) {
        if (currentGameToken && currentGameToken !== token) {
            cleanupPanoCache();
        }
        if (!currentGameToken) currentGameToken = token
    }

    const round = getCurrentRound();
    const dcEndEl = domCache.queryOne(SELECTORS.dcEnd);
    const replayEl = domCache.queryOne(SELECTORS.replay);
    const gameEndEl = domCache.queryOne(SELECTORS.gameEnd);
    const duelEndEl = domCache.queryOne(SELECTORS.duelEnd);
    const roundEndEl = domCache.queryOne(SELECTORS.roundEnd);
    const resultMap = domCache.queryOne(SELECTORS.resultMap);
    const duelMap = domCache.queryOne(SELECTORS.duelMap);
    const reactionBtn = domCache.queryOne('[class*="styles_hudButton__"]')

    const isDcEnd = !!dcEndEl;
    const isReplay = !!replayEl;
    const isGameEnd = !!gameEndEl;
    const isDuelEnd = !!duelEndEl;
    const isRoundEnd = !!roundEndEl;

    if (!isRoundEnd && !isGameEnd && !isDuelEnd && !isDcEnd) {
        removePeekMarker();
        clearMovementPaths()
        toggleMapType(true)
        if (isCoverageLayer) toggleCoverageLayer("off");
        return
    }

    if ((!token || !round) && !isDuelEnd && !dcEndEl && !isReplay) return;

    if (isReplay) {
        addAnalyzeControl(replayEl)
        return
    }

    if (isRoundEnd || isGameEnd || isDuelEnd || isDcEnd) {
        if (reactionBtn) reactionBtn.remove()
        if (currentMovementRound && currentMovementPath.length > 0) {
            const storageKey = `${MOVEMENT_STORAGE_PREFIX}${currentMovementRound}`;
            try {
                sessionStorage.setItem(storageKey, JSON.stringify(currentMovementPath));
            } catch (err) {
                console.error('[MovementPath] save failed', err);
            }
            currentMovementPath = [];
            currentMovementRound = null;
        }

        if (!isRoundEnd) attachRoundElementInteractions();

        setMapControls(resultMap || duelMap)
        addCreditToPage(resultMap, duelMap)
        renderMovementPaths()

        if (isDuelEnd) {
            const markers = domCache.queryAll(SELECTORS.duelMarker);
            for (const marker of markers) {
                const data = getDuelData(marker);
                if (!data) continue
                await applyPanoToDuelMarker(marker, data);
            }
            if (window.location.href.includes('summary')) addDuelRoundsPanel();
        }
        else await updateMarkers();
    }
}

// ============================================================================
// MAP INTERACTION & EVENT LISTENERS
// ============================================================================

function offsetMapFocus(map, coords) {
    if (!map || !coords) return;

    map.setCenter(coords);

    const mapDiv = map.getDiv();
    const width = mapDiv.offsetWidth;

    const offsetX = width / 4;

    map.panBy(offsetX, 0);
}

function attachPanoChangeListener() {
    if (!gameViewer) return;
    if (panoListenerMap.has(gameViewer)) return;

    const round = getCurrentRound() || 1;

    if (currentMovementRound && currentMovementRound !== round && currentMovementPath.length > 0) {
        const storageKey = `${MOVEMENT_STORAGE_PREFIX}${currentMovementRound}`;
        try {
            sessionStorage.setItem(storageKey, JSON.stringify(currentMovementPath));
        } catch (err) {
            console.error('[MovementPath] save failed', err);
        }
    }
    const startPosition = gameViewer.getPosition();
    if (startPosition) {
        const startPoint = {
            lat: Number(startPosition.lat().toFixed(5)),
            lng: Number(startPosition.lng().toFixed(5))
        };
        currentMovementPath = [startPoint];
        currentMovementRound = round;
    }

    const listener = gameViewer.addListener("position_changed", function () {
        recordMovementPoint(gameViewer);
    });

    panoListenerMap.set(gameViewer, listener);
}

function attachClickListener(map) {
    map.addListener("click", async (e) => {
        const coords = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        };

        if (domCache.queryOne(SELECTORS.roundEnd) ||
            domCache.queryOne(SELECTORS.gameEnd) ||
            domCache.queryOne(SELECTORS.dcEnd) ||
            (domCache.queryOne(SELECTORS.duelEnd) && window.location.href.includes('summary'))) {
            if (!isCoverageLayer) return
            const pano = await getNearestPano(coords);
            if (!pano || pano.error) return
            if (!peekMarker) {
                peekMarker = new google.maps.Marker({
                    position: pano.location,
                    map,
                    icon: {
                        url: "https://www.geoguessr.com/_next/static/media/selected-pin-square.bcb5854f.webp",
                        scaledSize: new google.maps.Size(28, 28),
                        anchor: new google.maps.Point(14, 28)
                    },
                    zIndex: 10008
                });
            } else {
                peekMarker.setPosition(pano.location);
            }
            openNativeStreetView(pano)
        }
    });
}

// ============================================================================
// MAP CONTROLS & UI
// ============================================================================

function addOpacityControl(layer) {
    function updateSliderBackground(slider, value) {
        const percentage = (value / slider.getAttribute('max')) * 100;
        slider.style.background = `linear-gradient(to right, #2196F3 0%, #2196F3 ${percentage}%, #d0d0d0 ${percentage}%, #d0d0d0 100%)`;
    }

    if(opacityControl) removeOpacityControl();

    opacityControl = document.createElement('div');
    opacityControl.className = 'map-control sv-opacity-control';
    opacityControl.id = 'sv-opacity-control';

    const slider = document.createElement('input');
    slider.className = 'sv-opacity-control__slider';
    slider.setAttribute('type', 'range');
    slider.setAttribute('min', '0');
    slider.setAttribute('max', '100');
    slider.setAttribute('step', '20');
    const savedOpacity = GM_getValue('coverageOpacity', '100');
    slider.value = savedOpacity;
    slider.title = 'Adjust visibility of Street View coverage overlay';

    layer.set('opacity', savedOpacity / 100);
    updateSliderBackground(slider, savedOpacity);


    slider.addEventListener('input', function() {
        const opacity = slider.value / 100
        layer.set('opacity', opacity);
        GM_setValue('coverageOpacity', slider.value);
        updateSliderBackground(slider, slider.value);
    });

    opacityControl.appendChild(slider);
    const container = document.getElementById('sv-coverage-toggle')?.parentElement;
    if(container) container.appendChild(opacityControl);
}


function removeOpacityControl() {
    if (opacityControl) {
        opacityControl.remove();
        opacityControl = null;
    }
}

function setMapControls(container) {
    let pathControl = document.getElementById('path-focus');
    let mapTypeControl = document.getElementById('map-type-toggle');
    let coverageLayerControl = document.getElementById('sv-coverage-toggle');

    const isMove = domCache.queryOne(SELECTORS.moveButton)
    if (coverageLayerControl && (pathControl || !isMove) && mapTypeControl) return

    if (!coverageLayerControl) {
        coverageLayerControl = document.createElement('button');
        coverageLayerControl.className = 'map-control';
        coverageLayerControl.id = 'sv-coverage-toggle'
        coverageLayerControl.title = 'Toggle Street View Coverage Overlay'
        coverageLayerControl.innerHTML = `
            <img alt="Coverage Layer Toggle" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2023%2038%22%3E%3Cpath%20d%3D%22M16.6%2038.1h-5.5l-.2-2.9-.2%202.9h-5.5L5%2025.3l-.8%202a1.53%201.53%200%2001-1.9.9l-1.2-.4a1.58%201.58%200%2001-1-1.9v-.1c.3-.9%203.1-11.2%203.1-11.2a2.66%202.66%200%20012.3-2l.6-.5a6.93%206.93%200%20014.7-12%206.8%206.8%200%20014.9%202%207%207%200%20012%204.9%206.65%206.65%200%2001-2.2%205l.7.5a2.78%202.78%200%20012.4%202s2.9%2011.2%202.9%2011.3a1.53%201.53%200%2001-.9%201.9l-1.3.4a1.63%201.63%200%2001-1.9-.9l-.7-1.8-.1%2012.7zm-3.6-2h1.7L14.9%2020.3l1.9-.3%202.4%206.3.3-.1c-.2-.8-.8-3.2-2.8-10.9a.63.63%200%2000-.6-.5h-.6l-1.1-.9h-1.9l-.3-2a4.83%204.83%200%20003.5-4.7A4.78%204.78%200%200011%202.3H10.8a4.9%204.9%200%2000-1.4%209.6l-.3%202h-1.9l-1%20.9h-.6a.74.74%200%2000-.6.5c-2%207.5-2.7%2010-3%2010.9l.3.1L4.8%2020l1.9.3.2%2015.8h1.6l.6-8.4a1.52%201.52%200%20011.5-1.4%201.5%201.5%200%20011.5%201.4l.9%208.4zm-10.9-9.6zm17.5-.1z%22%20style%3D%22isolation%3Aisolate%22%20fill%3D%22%23333%22%20opacity%3D%22.7%22/%3E%3Cpath%20d%3D%22M5.9%2013.6l1.1-.9h7.8l1.2.9%22%20fill%3D%22%23ce592c%22/%3E%3Cellipse%20cx%3D%2210.9%22%20cy%3D%2213.1%22%20rx%3D%222.7%22%20ry%3D%22.3%22%20style%3D%22isolation%3Aisolate%22%20fill%3D%22%23ce592c%22%20opacity%3D%22.5%22/%3E%3Cpath%20d%3D%22M20.6%2026.1l-2.9-11.3a1.71%201.71%200%2000-1.6-1.2H5.699999999999999a1.69%201.69%200%2000-1.5%201.3l-3.1%2011.3a.61.61%200%2000.3.7l1.1.4a.61.61%200%2000.7-.3l2.7-6.7.2%2016.8h3.6l.6-9.3a.47.47%200%2001.44-.5h.06c.4%200%20.4.2.5.5l.6%209.3h3.6L15.7%2020.3l2.5%206.6a.52.52%200%2000.66.31l1.2-.4a.57.57%200%2000.5-.7z%22%20fill%3D%22%23fdbf2d%22/%3E%3Cpath%20d%3D%22M7%2013.6l3.9%206.7%203.9-6.7%22%20style%3D%22isolation%3Aisolate%22%20fill%3D%22%23cf572e%22%20opacity%3D%22.6%22/%3E%3Ccircle%20cx%3D%2210.9%22%20cy%3D%227%22%20r%3D%225.9%22%20fill%3D%22%23fdbf2d%22/%3E%3C/svg%3E" style="color: transparent;">
        `;
        container.appendChild(coverageLayerControl);
        coverageLayerControl.onclick = () => toggleCoverageLayer();
    }
    if (!pathControl && isMove) {
        pathControl = document.createElement('button');
        pathControl.className = 'map-control';
        pathControl.id = 'path-focus';
        pathControl.title = 'Toggle Movement Path';
        pathControl.innerHTML = SVG_SOURCE.PATH
        container.appendChild(pathControl);
        pathControl.onclick = () => focusPath();
    }
    if (!mapTypeControl) {
        mapTypeControl = document.createElement('button');
        mapTypeControl.className = 'map-control';
        mapTypeControl.id = 'map-type-toggle';
        mapTypeControl.innerHTML = SVG_SOURCE.Satellite
        container.appendChild(mapTypeControl);
        mapTypeControl.title = `Toggle ${MAP_TYPES[(mapTypeIndex + 1) % MAP_TYPES.length]} Map`;
        mapTypeControl.onclick = () => toggleMapType();
    }
}

function toggleCoverageLayer(action) {
    if (!guessMap) return;
    if (!customMapType) customMapType = extendGoogleMapType();
    const shouldShow = action === "on" || (action !== "off" && !isCoverageLayer);
    if (shouldShow) {
        currentLayers.splice(1, 0, 'Google_StreetView');
        const layers = new customMapType(currentLayers.map(layerName => makeTileLayer(layerName)));
        guessMap.mapTypes.set("roadmap", layers)
    }
    else {
        currentLayers = currentLayers.filter(layer => layer !== 'Google_StreetView')
        removeOpacityControl()
        const layers = new customMapType(currentLayers.map(layerName => makeTileLayer(layerName)));
        guessMap.mapTypes.set("roadmap", layers)
    }
    isCoverageLayer = shouldShow;
}

function extendGoogleMapType() {
    function MR(e, t) {
        return new Promise(n => {
            google.maps.event.addListenerOnce(e, t, n);
        });
    }

    class customMapType extends google.maps.ImageMapType {
        constructor(layers, options = null) {
            const defaultOptions = {
                getTileUrl: function (coord, zoom) {
                    return null;
                },
                tileSize: new google.maps.Size(256, 256),
                maxZoom: 20,
                name: 'CustomMapType',
            };


            super({ ...defaultOptions, ...options });
            this.layers = layers;
        }

        getTile(t, n, r) {
            const o = this.layers.map(i => {
                if (typeof i.getTile !== 'function') {
                    console.error('getTile method is missing in layer:', i);
                }
                return i.getTile(t, n, r);
            });
            const s = document.createElement("div");
            s.append(...o);

            Promise.all(o.map(i => MR(i, "load"))).then(() => {
                google.maps.event.trigger(s, "load");
            });

            return s;
        }


        releaseTile(tile) {
            let index = 0;
            for (const child of tile.children) {
                if (child instanceof HTMLElement) {
                    this.layers[index]?.releaseTile(child);
                    index += 1;
                }
            }
        }
    }
    return customMapType
}

function makeTileLayer(layerName) {
    const tileUrl = TILE_TEMPLATE[layerName];

    const layer = new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
            return tileUrl
                .replace('{z}', zoom)
                .replace('{x}', coord.x)
                .replace('{y}', coord.y);
        },
        tileSize: new google.maps.Size(256, 256),
        name: layerName,
        maxZoom: 20,
    })
    if (layerName.includes('StreetView')) addOpacityControl(layer);
    return layer;
}

function toggleMapType(reset = false) {
    if (!guessMap) return;

    const control = document.getElementById('map-type-toggle');

    if (reset) {
        mapTypeIndex = 0;
    } else {
        mapTypeIndex = (mapTypeIndex + 1) % MAP_TYPES.length;
    }

    const currentType = MAP_TYPES[mapTypeIndex];
    const nextType = MAP_TYPES[(mapTypeIndex + 1) % MAP_TYPES.length];

    if (!customMapType) {
        customMapType = extendGoogleMapType();
    }

    switch (currentType) {
        case 'Roadmap':
            // Google Maps
            currentLayers[0] = 'Google_Maps'
            if (!currentLayers.includes('Google_Labels')) currentLayers.push('Google_Labels')
            currentLayers = currentLayers.filter(layer => layer !== 'Google_Hybrid_Labels')
            break;
        case 'Terrain':
            // Terrain Map
            currentLayers[0] = 'Google_Terrain'
            if (!currentLayers.includes('Google_Labels')) currentLayers.push('Google_Labels')
            currentLayers = currentLayers.filter(layer => layer !== 'Google_Hybrid_Labels')
            break;
        case 'Satellite':
            // Satellite Map
            currentLayers[0] = 'Google_Satellite'
            if (!currentLayers.includes('Google_Hybrid_Labels')) currentLayers.push('Google_Hybrid_Labels')
            currentLayers = currentLayers.filter(layer => layer !== 'Google_Labels')
            break;
    }

    const layers = new customMapType(
        currentLayers.map(name => makeTileLayer(name))
    );

    guessMap.mapTypes.set('roadmap', layers);

    if (control) {
        control.innerHTML = SVG_SOURCE[nextType];
        control.title = `Toggle ${nextType} Map`;
    }
}

function adjustCoverageOpacity(layer,opacity) {
    if (!guessMap || !layer) return;

    layer.set('opacity',opacity)

    GM_setValue('coverageOpacity', opacity);
}

function focusPath() {
    const roundMarkers = document.querySelectorAll(SELECTORS.answerMarker)
    renderMovementPaths()
    if (roundMarkers.length == 1) {
        const coords = getMarkerCoords(roundMarkers[0])
        const splitContainer = document.querySelector('.peek-split-container')
        guessMap.setZoom(15)
        if (splitContainer && splitContainer.classList.contains('active')) offsetMapFocus(guessMap, coords);
        else guessMap.setCenter(coords)
    }
}

function addCreditToPage(container, duelMap) {
    if ((!window.location.href.includes('summary') && duelMap)) return
    container = container?.parentElement || duelMap?.parentElement || null;

    if (!container || document.getElementById('peek-credit-container')) return;
    const element = document.createElement('div');
    element.id = 'peek-credit-container';
    element.className = 'peek-credit';
    element.innerHTML = `
		<div class="peek-credit-title">GeoGuessr Better Breakdown UI</div>
		<div class="peek-credit-subtitle">by <a href="https://greasyfork.org/users/1179204-kakageo/" target="_blank" rel="noopener noreferrer">kakageo</a>.</div>
	`;
    container.appendChild(element);
    if (duelMap) element.style.left = '4rem';
    else element.style.left = '1rem';
}

function addAnalyzeControl(container) {
    if (!container || document.getElementById('analyze-wrapper')) return;

    const analyzeSpan = document.createElement('span');
    analyzeSpan.id = 'analyze-wrapper';
    analyzeSpan.className = 'tooltip_reference__CwDbn';

    const buttonDiv = document.createElement('div');
    buttonDiv.id = 'analyze-button';
    buttonDiv.className = 'report-user-replay_reportResultButton__cerrj';
    buttonDiv.innerHTML = SVG_SOURCE.ANALYSIS;
    applyStyles(buttonDiv, { color: '#FFFFFF', cursor: 'pointer' });

    const tooltipDiv = document.createElement('div');
    tooltipDiv.className = 'tooltip_tooltip__3D6bz tooltip_top__X4nYB tooltip_roundnessXS__BGhWu tooltip_variantDefault__7WTJ0';
    applyStyles(tooltipDiv, {
        left: '50%',
        transform: 'translateX(-50%) scale(0)',
        opacity: '0',
        visibility: 'hidden',
        transition: 'opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease'
    });
    tooltipDiv.textContent = 'Analyze Replay';

    const arrowDiv = document.createElement('div');
    arrowDiv.className = 'tooltip_arrow__LJ1of';
    tooltipDiv.appendChild(arrowDiv);

    analyzeSpan.appendChild(buttonDiv);
    analyzeSpan.appendChild(tooltipDiv);

    analyzeSpan.addEventListener('mouseenter', () => {
        applyStyles(tooltipDiv, {
            transform: 'translateX(-50%) scale(1)',
            opacity: '1',
            visibility: 'visible'
        });
    });

    analyzeSpan.addEventListener('mouseleave', () => {
        applyStyles(tooltipDiv, {
            transform: 'translateX(-50%) scale(0)',
            opacity: '0',
            visibility: 'hidden'
        });
    });

    buttonDiv.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { gameId, round } = parseUrl()
        const selectedRound = document.querySelector('[class*="selectedRound"]');
        const roundTextElement = selectedRound.querySelector('[class*="roundText"], [class*="game-summary_text"]');
        if (roundTextElement && roundTextElement.textContent.includes('Round')) {
            const match = roundTextElement.textContent.match(/Round\s+(\d+)/);
            await getReplayer(gameId, match[1])
            analyze(match[1])
        }
    });

    container.appendChild(analyzeSpan);
}

// ============================================================================
// REPLAY ANALYSIS
// ============================================================================
let replayData, playersList, selectedPlayer, rounds, currentGameId;

async function getReplayer(gameId, round) {
    let replayControls = document.querySelector('[class^="replay_main__"]');
    const keys = Object.keys(replayControls)
    const key = keys.find(key => key.startsWith("__reactProps"))
    const props = replayControls[key]
    playersList = props.children[4].props.players
    if (playersList) rounds = Math.max(...playersList.map(player => player.guesses?.length || 0));
    else rounds = document.querySelectorAll('[class*="playedRound"]').length - 3;
    const selectedPlayerLabels = document.querySelectorAll('label[class*="switch_label"][aria-selected="true"]');
    selectedPlayerLabels.forEach(label => {
        const playerName = label.textContent.trim();
        if (playersList) selectedPlayer = playersList.find(player => player.nick.trim() == playerName)
        else selectedPlayer = props.children[4].props.selectedPlayer
    });
    currentGameId = gameId
    replayData = await fetchReplayData(currentGameId, selectedPlayer.playerId, round)
}

async function fetchReplayData(gameId, userId, round) {
    const url = `https://www.geoguessr.com/api/v4/replays/${userId}/${gameId}/${round}`;
    try {
        const response = await fetch(url, { method: "GET", credentials: "include" });

        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return null
        }
        return await response.json();

    } catch (error) {
        console.error('Error fetching replay data:', error);
        return null;
    }
}

function parseUrl() {
    const url = window.location.href;
    const urlObj = new URL(url);

    const pathSegments = urlObj.pathname.split('/');
    const gameId = pathSegments.length > 2 ? pathSegments[2] : null;

    const round = urlObj.searchParams.get("round");
    return { gameId, round };
}

async function downloadPanoramaImage(panoId, fileName, w, h, zoom, d) {
    return new Promise(async (resolve, reject) => {
        try {
            let canvas, ctx, tilesPerRow, tilesPerColumn, imageUrl;
            const tileWidth = 512;
            const tileHeight = 512;

            let zoomTiles;
            imageUrl = `https://streetviewpixels-pa.googleapis.com/v1/tile?cb_client=apiv3&panoid=${panoId}&output=tile&zoom=${zoom}&nbt=0&fover=2`;
            zoomTiles = [2, 4, 8, 16, 32];
            tilesPerRow = Math.min(Math.ceil(w / tileWidth), zoomTiles[zoom - 1]);
            tilesPerColumn = Math.min(Math.ceil(h / tileHeight), zoomTiles[zoom - 1] / 2);

            const canvasWidth = tilesPerRow * tileWidth;
            const canvasHeight = tilesPerColumn * tileHeight;
            canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            if (w === 13312) {
                const sizeMap = {
                    4: [6656, 3328],
                    3: [3328, 1664],
                    2: [1664, 832],
                    1: [832, 416]
                };
                if (sizeMap[zoom]) {
                    [canvas.width, canvas.height] = sizeMap[zoom];
                }
            }

            const loadTile = (x, y) => {
                return new Promise(async (resolveTile) => {
                    let tile;
                    let tileUrl = `${imageUrl}&x=${x}&y=${y}`;
                    if (panoId.substring(0, 4) == 'CIHM' || panoId.length != 22) tileUrl = `https://lh3.ggpht.com/jsapi2/a/b/c/x${x}-y${y}-z${zoom}/${panoId}`
                    try {
                        tile = await loadImage(tileUrl);
                        ctx.drawImage(tile, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
                        resolveTile();
                    } catch (error) {
                        console.error(`Error loading tile at ${x},${y}:`, error);
                        resolveTile();
                    }
                });
            };

            let tilePromises = [];
            for (let y = 0; y < tilesPerColumn; y++) {
                for (let x = 0; x < tilesPerRow; x++) {
                    tilePromises.push(loadTile(x, y));
                }
            }

            await Promise.all(tilePromises);
            if (d) {
                resolve(canvas.toDataURL('image/jpeg'));
            }
            else {
                canvas.toBlob(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    resolve();
                }, 'image/jpeg');
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.toString(),
                icon: 'error',
                backdrop: false
            });
            reject(error);
        }
    });
}

async function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image from ${url}`));
        img.src = url;
    });
}

function analyze(round) {

    Swal.fire({
        title: 'Replay Analysis',
        html: `
<div style="text-align: center; font-family: sans-serif;">
            <div style="margin-bottom: 10px;">
                <select id="roundSelect" style="background: #db173e; color: white; font-size: 16px; padding: 8px 15px; border: none; border-radius: 6px; cursor: pointer; margin: 5px;"></select>
                <select id="playerSelect" style="background: #007bff; color: white; font-size: 16px; padding: 8px 15px; border: none; border-radius: 6px; cursor: pointer; margin: 5px;"></select>
                <button id="toggleEventBtn" style="background: #28a745; color: white; font-size: 14px; padding: 8px 15px; border: 2px solid grey; border-radius: 6px; cursor: pointer; margin: 5px;">Event Analysis</button>
                <button id="toggleSVBtn" style="background: #ffc107; color: black; font-size: 14px; padding: 8px 15px; border: none; border-radius: 6px; cursor: pointer;">StreetView Analysis</button>
            </div>
            <canvas id="chartCanvas" width="300" height="150" style="background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);"></canvas>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-top: 5px;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); width: 300px; text-align: center;">
                    <p><strong>Event Density:</strong> <span id="eventDensity">Loading...</span></p>
                    <p><strong>Avgerage Gap Time:</strong> <span id="AvgGapTime">Loading...</span></p>
                    <p><strong>Pano Event Ratio:</strong> <span id="streetViewRatio">Loading...</span></p>
                    <p><strong>First PanoZoom:</strong> <span id="firstPanoZoomTime">Loading...</span></p>
                    <p><strong>Longest Single Gap:</strong> <span id="longestGapTime">Loading...</span></p>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); width: 300px; text-align: center;">
                    <p><strong>Switch Count:</strong> <span id="switchCount">Loading...</span></p>
                    <p><strong>Total Gap Time:</strong> <span id="stagnationTime">Loading...</span></p>
                    <p><strong>Map Event Ratio:</strong> <span id="mapEventRatio">Loading...</span></p>
                    <p><strong>First Map Zoom:</strong> <span id="firstMapZoomTime">Loading...</span></p>
                    <p><strong>Pano POV Speed:</strong> <span id="avgPovSpeed">Loading...</span></p>
                </div>
            </div>
        </div>
    `,
        width: 800,
        showCloseButton: true,
        backdrop: null,
        didOpen: () => {

            const canvas = document.getElementById('chartCanvas')
            const ctx = canvas.getContext('2d', { willReadFrequently: true })

            const playerSelect = document.getElementById("playerSelect");
            const roundSelect = document.getElementById("roundSelect");
            if (playersList) {
                playersList.forEach(player => {
                    let option = document.createElement("option");
                    option.value = player.playerId;
                    option.textContent = player.nick;
                    playerSelect.appendChild(option);
                });
                if (selectedPlayer) playerSelect.value = selectedPlayer.playerId;
            }
            else playerSelect.style.display = 'none'
            if (rounds) {
                for (let i = 1; i <= rounds; i++) {
                    let option = document.createElement("option")
                    option.value = i;
                    option.textContent = `Round ${i}`
                    roundSelect.appendChild(option);
                }
            }
            if (round) roundSelect.value = parseInt(round)
            const toggleSVBtn = document.getElementById('toggleSVBtn');
            const toggleEventBtn = document.getElementById('toggleEventBtn');

            function updateChartData(data, playerName) {
                chart.resize()
                const interval = 1000;
                const eventTypes = [
                    "PanoPov",
                    "PanoZoom",
                    "MapPosition",
                    "MapZoom",
                    "PinPosition",
                    "MapDisplay",
                    "PanoPosition",
                    "Focus",
                    "Timer",
                    "KeyPress",
                ];

                const keyEventTypes = ["PinPosition", "MapDisplay", "GuessWithLatLng", "Timer", "Focus", "KeyPress"];
                const eventColors = {
                    "MapZoom": "#0000FF",
                    "MapPosition": "#FFA500",
                    "PanoPov": "#00FF00",
                    "PinPosition": "#00FFFF",
                    "MapDisplay": "#800080",
                    "PanoZoom": "#FF69B4",
                    "PanoPosition": "#1E90FF",
                    "KeyPress": "lightgreen",
                    "Timer": "red",
                    "Focus": "#FFD700"
                };

                const eventBuckets = {};
                const allEventTimes = {};

                eventTypes.forEach(eventType => {
                    eventBuckets[eventType] = {};

                });
                keyEventTypes.forEach(eventType => {
                    allEventTimes[eventType] = [];
                });

                data.forEach(event => {
                    const eventTime = event.time;
                    const relativeTime = eventTime - data[0].time;
                    if (eventBuckets[event.type]) {
                        const bucket = Math.floor(relativeTime / interval);

                        if (!eventBuckets[event.type][bucket]) {
                            eventBuckets[event.type][bucket] = 0;
                        }
                        eventBuckets[event.type][bucket]++;
                    }
                    if (allEventTimes[event.type]) {
                        allEventTimes[event.type].push(relativeTime);
                    }
                });

                const labels = [];
                const maxBucket = Math.max(
                    ...Object.values(eventBuckets).flatMap(bucket => Object.keys(bucket).map(Number))
                );

                for (let i = 0; i <= maxBucket; i++) {
                    const relativeSeconds = (i * interval + interval / 2) / 1000;
                    const minutes = Math.floor(relativeSeconds / 60);
                    const seconds = Math.floor(relativeSeconds % 60);
                    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                    labels.push(formattedTime);
                }

                const datasets = eventTypes.map(eventType => {
                    const dataPoints = labels.map((label, index) => eventBuckets[eventType][index] || 0);
                    return {
                        label: eventType,
                        data: dataPoints,
                        fill: false,
                        borderColor: eventColors[eventType],
                        backgroundColor: eventColors[eventType],
                        tension: 0.5,
                        hidden: true
                    };
                });

                const totalEventsData = labels.map((label, index) => {
                    let total = 0;
                    eventTypes.forEach(eventType => {
                        total += eventBuckets[eventType][index] || 0;
                    });
                    return total;
                });

                datasets.push({
                    label: 'Total Events',
                    data: totalEventsData,
                    fill: false,
                    borderColor: 'rgba(0,0,0,0.6)',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    tension: 0.5
                });

                const annotations = [];
                const hiddenKeyPoints = [];

                Object.keys(allEventTimes).forEach(eventType => {
                    allEventTimes[eventType].forEach((eventTime, idx) => {
                        const xPosition = eventTime / 1000;

                        const annotation = {
                            type: 'line',
                            xMin: xPosition,
                            xMax: xPosition,
                            borderColor: eventColors[eventType],
                            borderWidth: 1.5,
                            borderDash: [5, 5],
                        };

                        if (eventType === "KeyPress") {
                            const keyPayload = data.find(
                                ev => ev.type === "KeyPress" && (ev.time - data[0].time) === eventTime
                            )?.payload?.key || "";

                            annotations.push({
                                type: 'line',
                                xMin: xPosition,
                                xMax: xPosition,
                                borderColor: eventColors[eventType],
                                borderWidth: 1.5,
                                borderDash: [5, 5],

                                hiddenPoint: {
                                    x: xPosition,
                                    key: keyPayload
                                }
                            });

                            hiddenKeyPoints.push({
                                x: xPosition,
                                y: 0,
                                key: keyPayload
                            });
                        }

                        annotations.push(annotation);
                    });
                });
                datasets.push({
                    label: "KeyPressHidden",
                    data: hiddenKeyPoints,
                    parsing: false,
                    pointRadius: 4,
                    pointHoverRadius: 10,
                    borderWidth: 0,
                    borderColor: "rgba(0,0,0,0)",
                    backgroundColor: "rgba(0,0,0,0)",
                    showLine: false
                });
                chart.data.datasets = datasets;
                chart.data.labels = labels;
                chart.options.plugins.annotation.annotations = annotations;
                chart.update();
            }

            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: []
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                boxWidth: 30,
                                boxHeight: 15,
                                padding: 30
                            },
                            position: 'top',
                            align: 'center',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                pointStyle: 'rectRounded'
                            },
                        },
                        tooltip: {
                            enabled: true,
                            intersect: false,
                            mode: "nearest",

                            callbacks: {
                                title: () => "",
                                label: (ctx) => {
                                    if (ctx.dataset.label === "KeyPressHidden") {
                                        return `Key: ${ctx.raw.key}`;
                                    }
                                    return null;
                                }
                            },
                            backgroundColor: "rgba(0,0,0,0.75)",
                            padding: 8,
                            cornerRadius: 6
                        },
                        annotation: { annotations: {} },
                        customTooltip: true
                    },
                    scales: {
                        x: { title: { display: true } },
                        y: { title: { display: true, text: 'Event Counts' }, beginAtZero: true }
                    },

                },

            });

            function updateEventAnalysisData(data) {
                const { eventDensity, switchCount, stagnationTime, stagnationCount, AvgGapTime, streetViewRatio, mapEventRatio, firstMapZoomTime, firstPanoZoomTime, longestGapTime, avgPovSpeed } = updateEventAnalysis(data);
                document.getElementById('eventDensity').textContent = eventDensity.toFixed(2) + " times/s";
                document.getElementById('stagnationTime').textContent = stagnationTime.toFixed(2) + " s";
                document.getElementById('longestGapTime').textContent = longestGapTime.toFixed(2) + " s";
                document.getElementById('avgPovSpeed').textContent = avgPovSpeed.toFixed(2) + " °/s";
                document.getElementById('switchCount').textContent = `${switchCount / 2} times`;
                document.getElementById('AvgGapTime').textContent = !stagnationCount ? 'None' : `${(parseFloat(stagnationTime / stagnationCount)).toFixed(2)}s`;
                document.getElementById('streetViewRatio').textContent = (streetViewRatio * 100).toFixed(2) + "%";
                document.getElementById('mapEventRatio').textContent = (mapEventRatio * 100).toFixed(2) + "%";
                document.getElementById('firstMapZoomTime').textContent = firstMapZoomTime === null ? "None" : "At " + firstMapZoomTime + " s";
                document.getElementById('firstPanoZoomTime').textContent = firstPanoZoomTime === null ? "None" : "At " + firstPanoZoomTime + " s";
            }

            updateChartData(replayData);
            updateEventAnalysisData(replayData);
            playerSelect.onchange = async () => {
                canvas.style.pointerEvents = 'auto';
                try {
                    replayData = await fetchReplayData(currentGameId, playerSelect.value, roundSelect.value)
                    selectedPlayer = playersList.find(player => player.playerId == playerSelect.value)
                }
                catch (e) {
                    console.error("Error fetching replay data")
                    return
                }
                updateChartData(replayData);
                updateEventAnalysisData(replayData);
            };

            roundSelect.onchange = async () => {
                canvas.style.pointerEvents = 'auto';
                try {
                    replayData = await fetchReplayData(currentGameId, playerSelect.value || selectedPlayer.playerId, roundSelect.value)
                }
                catch (e) {
                    console.error("Error fetching replay data")
                    return
                }
                updateChartData(replayData);
                updateEventAnalysisData(replayData);
            };

            toggleEventBtn.addEventListener('click', () => {
                toggleSVBtn.style.border = 'none'
                toggleEventBtn.style.border = '2px solid grey'
                canvas.style.pointerEvents = 'auto';
                updateChartData(replayData);
                updateEventAnalysisData(replayData);
            })
            toggleSVBtn.addEventListener('click', async () => {
                toggleEventBtn.style.border = 'none'
                toggleSVBtn.style.border = '2px solid grey'
                canvas.style.pointerEvents = 'none'
                var centerHeading;
                const panoIds = replayData
                .filter(item => item.type === 'PanoPosition' && item.payload?.panoId)
                .map(item => item.payload.panoId);
                if (panoIds.length > 1) {
                    var panoId = panoIds[Math.floor(Math.random() * panoIds.length)]
                    }
                else {
                    panoId = panoIds[0]
                }
                const metaData = await getLOCATION('GetMetadata', panoId);

                var w = metaData.worldWidth;
                var h = metaData.worldHeight;

                centerHeading = metaData.heading;


                try {
                    const imageUrl = await downloadPanoramaImage(panoId, panoId, w, h, w == 13312 ? 5 : 3, true);
                    const img = await loadImage(imageUrl);
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    let lastPanoPov = { heading: 0, pitch: 0 };
                    let stagnationPoints = [];
                    const heatData = replayData.filter(event => ["PanoZoom", "PanoPov"].includes(event.type)).map((event, index, events) => {
                        let heading, pitch, type;
                        let time = event.time;

                        if (event.type === "PanoPov") {
                            [heading, pitch] = [event.payload.heading, event.payload.pitch]
                            lastPanoPov = { heading, pitch };
                            type = "PanoPov";
                        } else if (event.type === "PanoZoom") {
                            heading = lastPanoPov.heading;
                            pitch = lastPanoPov.pitch;
                            type = "PanoZoom";
                        }

                        if (index > 0) {
                            const prevEvent = events[index - 1];
                            const timeDiff = Math.abs(time - prevEvent.time);
                            if (timeDiff > 3000) {
                                stagnationPoints.push(index);
                            }
                        }

                        return { heading, pitch, type };
                    });

                    drawHeatMapOnImage(canvas, heatData, centerHeading, stagnationPoints);
                } catch (error) {
                    console.error('Error downloading panorama image:', error);
                }

            })
        }

    });
}

function drawHeatMapOnImage(canvas, heatData, centerHeading, points) {
    const ctx = canvas.getContext('2d');
    heatData.forEach((point, index) => {
        let headingDifference = point.heading - centerHeading;
        if (headingDifference > 180) {
            headingDifference -= 360;
        } else if (headingDifference < -180) {
            headingDifference += 360;
        }
        const x = (headingDifference + 180) / 360 * canvas.width;
        const y = (90 - point.pitch) / 180 * canvas.height;

        ctx.beginPath();
        if (canvas.width === 13312) ctx.arc(x, y, (points.includes(index)) ? 80 : 40, 0, 2 * Math.PI);
        else ctx.arc(x, y, (points.includes(index)) ? 30 : 15, 0, 2 * Math.PI);

        if (points.includes(index)) {
            ctx.fillStyle = 'yellow';
        } else if (point.type === "PanoZoom") {
            ctx.fillStyle = '#FF0000';
        } else if (point.type === "PanoPov") {
            ctx.fillStyle = '#00FF00';
        }

        ctx.fill();
    });
}

function updateEventAnalysis(data) {
    let totalEvents = 0;
    let totalTime = 0;
    let stagnationTime = 0;
    let stagnationCount = 0;
    let switchCount = 0;
    let streetViewEvents = 0;
    let mapEvents = 0;
    let lastEventTime = null;
    let longestGapTime = 0;

    let totalHeadingDifference = 0;
    let totalTimeGap = 0;

    let lastPanoPovEventTime = null;
    let lastHeading = null;

    data.forEach(event => {
        const eventTime = event.time;
        const relativeTime = Math.floor((eventTime - data[0].time) / 1000);

        totalEvents++;
        totalTime = relativeTime;

        if (event.type.includes("Pano")) {
            streetViewEvents++;
        } else if (event.type.includes("Map")) {
            mapEvents++;
        }

        if (lastEventTime !== null) {
            const timeGap = (eventTime - lastEventTime) / 1000;

            if (timeGap >= 3) {
                if (timeGap > longestGapTime) longestGapTime = timeGap;
                stagnationTime += timeGap;
                stagnationCount++;
            }
        }

        if (event.type === "PanoPov" && lastPanoPovEventTime !== null) {
            const headingDifference = Math.abs(event.payload.heading - lastHeading);
            const timeGap = (eventTime - lastPanoPovEventTime) / 1000;

            totalHeadingDifference += headingDifference;
            totalTimeGap += timeGap;
        }

        lastEventTime = eventTime;

        if (event.type === "PanoPov") {
            lastPanoPovEventTime = eventTime;
            lastHeading = event.payload.heading;
        }

        if (event.type === "Focus" && !event.payload.focus) {
            switchCount++;
        }
    });

    const eventDensity = totalEvents / totalTime;

    const streetViewRatio = streetViewEvents / totalEvents;
    const mapEventRatio = mapEvents / totalEvents;

    let firstMapZoomTime = null;
    let firstMapZoomTime_ = null;
    let firstPanoZoomTime_ = null;
    let firstPanoZoomTime = null;
    data.forEach(event => {
        if (event.type === "MapZoom" && !firstMapZoomTime) {
            if (firstMapZoomTime_ === null) firstMapZoomTime_ = 1;
            else {
                firstMapZoomTime = Math.floor((event.time - data[0].time) / 1000);
            }
        }
        if (event.type === "PanoZoom" && !firstPanoZoomTime) {
            if (firstPanoZoomTime_ === null) firstPanoZoomTime_ = 1;
            else {
                firstPanoZoomTime = Math.floor((event.time - data[0].time) / 1000);
            }
        }
    });

    let avgPovSpeed = 0;
    if (totalTimeGap > 0) {
        avgPovSpeed = totalHeadingDifference / totalTimeGap;
    }

    return {
        eventDensity,
        stagnationTime,
        switchCount,
        stagnationCount,
        streetViewRatio,
        mapEventRatio,
        firstPanoZoomTime,
        firstMapZoomTime,
        longestGapTime,
        avgPovSpeed
    };
}

// ============================================================================
// MARKER CLEANUP
// ============================================================================

function removePeekMarker() {
    if (peekMarker) {
        peekMarker.setMap(null);
        peekMarker = null;
    }
}

function cleanupPanoCache() {
    panoCache.clear();
}

// ============================================================================
// MARKER PROCESSING & UPDATES
// ============================================================================

async function updateMarkers() {
    let guessMarkers = [...domCache.queryAll(SELECTORS.guessMarker)];
    if (guessMarkers.length < 1) guessMarkers = [...domCache.queryAll(SELECTORS.dcMarker)];
    const answerMarkers = [...domCache.queryAll(SELECTORS.answerMarker)];
    const gameData = extractGameData();

    for (const [index, marker] of answerMarkers.entries()) {
        const data = gameData.rounds?.[index];
        if (!data) continue;

        const markerData = markerDataMap.get(marker) || {};
        const bindKey = `answer_${index + 1}`;
        if (markerData.peekBound === bindKey && markerData.cachedPano) {
            continue;
        }

        applyPanoToAnswerMarker(marker, {
            panoId: convertPanoId(data.panoId),
            heading: data.heading,
            location: { lat: data.lat, lng: data.lng },
            pitch: data.pitch,
            radius: 0,
            zoom: data.zoom,
            error: false
        }, index + 1);
    }

    await Promise.all(
        guessMarkers.map(async (marker, index) => {
            const coords = gameData.guesses?.[index]?.coordinate;
            if (!coords) return;

            const markerData = markerDataMap.get(marker) || {};
            const bindKey = `bound_${index + 1}`;
            if (markerData.peekBound === bindKey && markerData.cachedPano) {
                return;
            }

            try {
                const pano = await getNearestPano(coords);
                if (pano) {
                    applyPanoToGuessMarker(marker, pano, index + 1);
                }
            } catch { }
        })
    );
}

function applyPanoToGuessMarker(marker, pano, roundId) {
    const bindKey = `bound_${roundId}`;
    const markerData = markerDataMap.get(marker) || {};

    if (markerData.peekBound === bindKey && markerData.cachedPano) {
        return;
    }

    markerData.peekBound = bindKey;
    markerData.pano = pano.error ? "false" : "true";
    markerData.cachedPano = pano;
    markerDataMap.set(marker, markerData);

    marker.style.cursor = "pointer";
    marker.style.pointerEvents = "auto";
    marker.dataset.pano = markerData.pano;

    const existingTooltips = marker.querySelectorAll(".peek-tooltip");
    for (const t of existingTooltips) t.remove();

    const tooltip = document.createElement("div");
    tooltip.className = "peek-tooltip";
    if (pano.error) {
        tooltip.innerHTML = `<div class="peek-error">No Street View found within 250km</div>`;
    } else {
        tooltip.innerHTML = `
            <div class="peek-header">
                <span class="peek-dist">${formatDistance(pano.radius)}</span> away from the nearest street view
            </div>
            <div class="peek-body">
                <img src="${getStreetViewThumbUrl(pano)}" class="peek-thumb" alt="Preview">
            </div>
            <div class="peek-note">Click pin to view Street View</div>
        `;
        attachMarkerClickListener(marker, pano);
    }

    marker.appendChild(tooltip);
}

function applyPanoToAnswerMarker(marker, pano, roundId) {
    const bindKey = `answer_${roundId}`;
    const markerData = markerDataMap.get(marker) || {};

    if (markerData.peekBound === bindKey && markerData.cachedPano) {
        return;
    }

    markerData.peekBound = bindKey;
    markerData.cachedPano = pano;
    markerDataMap.set(marker, markerData);

    marker.style.cursor = "pointer";
    marker.style.pointerEvents = "auto";

    const existingTooltips = marker.querySelectorAll(".peek-answer-tooltip");
    for (const t of existingTooltips) t.remove();

    const tooltip = document.createElement("div");
    tooltip.className = "peek-answer-tooltip";
    tooltip.innerHTML = `
            <div class="peek-note">Click pin to view Street View</div>
            <div class="peek-body">
                <img src="${getStreetViewThumbUrl(pano)}" class="peek-thumb">
            </div>
        `;
    marker.appendChild(tooltip);
    attachMarkerClickListener(marker, pano);
}

async function applyPanoToDuelMarker(marker, data) {
    if (!data) return;

    const markerData = markerDataMap.get(marker) || {};
    let pano;

    if (markerData.cachedPano) {
        pano = markerData.cachedPano;
    } else if (data.panorama) {
        pano = {
            panoId: convertPanoId(data.panorama.panoId),
            location: { lat: data.panorama.lat, lng: data.panorama.lng },
            heading: data.panorama.heading,
            pitch: data.panorama.pitch,
            zoom: data.panorama.zoom
        };
        markerData.cachedPano = pano;
        markerDataMap.set(marker, markerData);
    }
    else {
        pano = await getNearestPano({ lat: data.lat, lng: data.lng });
        markerData.cachedPano = pano;
        markerDataMap.set(marker, markerData);
    }
    marker.style.cursor = "pointer";
    marker.style.pointerEvents = "auto";
    if (!data.panorama) marker.dataset.pano = pano.error ? "false" : "true";

    if (marker.querySelector(".peek-duel-tooltip") || marker.querySelector(".peek-duel-answer-tooltip")) return;

    const tooltip = document.createElement("div");
    tooltip.className = "peek-duel-tooltip";
    if (pano.error) {
        tooltip.innerHTML = `<div class="peek-error">No Street View found within 250km</div>`;
    }
    else if (data.panorama) {
        tooltip.className = "peek-duel-answer-tooltip";
        tooltip.innerHTML = `
            <div class="peek-note">Click pin to view Street View</div>
            <div class="peek-body">
                <img src="${getStreetViewThumbUrl(pano)}" class="peek-thumb">
            </div>
        `;
    }
    else {
        tooltip.innerHTML = `
            <div class="peek-header">
                <span class="peek-dist">${formatDistance(pano.radius)}</span> away from the nearest street view
            </div>
            <div class="peek-body">
                <img src="${getStreetViewThumbUrl(pano)}" class="peek-thumb" alt="Preview">
            </div>
            <div class="peek-note">Click pin to view Street View</div>
        `;
    }

    if (!pano.error) {
        attachMarkerClickListener(marker, pano);
    }

    marker.appendChild(tooltip);
}

// ============================================================================
// DUEL ROUNDS PANEL
// ============================================================================

const initializedContainers = new WeakMap();

function addDuelRoundsPanel() {
    const mapContainer = domCache.queryOne('[class*="game-summary_mapContainer"]');
    if (!mapContainer || initializedContainers.get(mapContainer)?.duelPanel) return;

    initializedContainers.set(mapContainer, { ...initializedContainers.get(mapContainer), duelPanel: true });
    mapContainer.style.position = 'relative';
    mapContainer.style.overflow = 'hidden';

    const playedRounds = domCache.queryAll('[class*="game-summary_playedRounds"]');

    if (!playedRounds.length) {
        console.error('Duel rounds elements not found', { playedRounds });
        return;
    }

    const toggleButton = document.createElement('button');
    toggleButton.className = 'peek-duel-rounds-button';
    toggleButton.innerHTML = SVG_SOURCE.PANEL;
    toggleButton.title = 'Toggle rounds panel';

    const panel = document.createElement('div');
    panel.className = 'peek-duel-rounds-panel';

    const panelContent = document.createElement('div');
    panelContent.className = 'peek-duel-rounds-content';

    const roundsContainer = document.createElement('div');
    roundsContainer.className = 'peek-duel-rounds-list';

    for (const round of playedRounds) {
        const clonedRound = round.cloneNode(true);
        roundsContainer.appendChild(clonedRound);
    }
    const summaryTitle = domCache.queryOne('[class*="game-summary_summaryTitle"]');
    if (summaryTitle) summaryTitle.style.display = "none";

    const gameModeBrand = domCache.queryOne('[class*="game-mode-brand_root"]');
    const gameMode = gameModeBrand.querySelector('[class*="game-mode-brand_selected"]');
    const mapName = gameModeBrand.querySelector('[class*="game-mode-brand_mapName"]');
    gameModeBrand.style.display = "none";

    const gameModeHeader = document.createElement('div');
    gameModeHeader.className = 'peek-duel-game-header';

    const gameModeContainer = document.createElement('div');
    gameModeContainer.className = 'peek-duel-game-info';

    if (gameMode) {
        const clonedGameMode = gameMode.cloneNode(true);
        applyStyles(clonedGameMode, {
            position: 'static',
            transform: 'none',
            left: 'auto',
            top: 'auto',
            right: 'auto',
            bottom: 'auto'
        });
        gameModeContainer.appendChild(clonedGameMode);
    }

    if (mapName) {
        const clonedMapName = mapName.cloneNode(true);
        applyStyles(clonedMapName, {
            position: 'static',
            transform: 'none',
            left: 'auto',
            top: 'auto',
            right: 'auto',
            bottom: 'auto'
        });
        gameModeContainer.appendChild(clonedMapName);
    }

    if (gameMode || mapName) {
        gameModeHeader.appendChild(gameModeContainer);
        panelContent.appendChild(gameModeHeader);
    }
    const clonedRoundElements = roundsContainer.querySelectorAll('[class*="game-summary_playedRound"]');
    const originalRoundElements = domCache.queryAll('[class*="game-summary_playedRounds"]:not(.peek-duel-rounds-list) [class*="game-summary_playedRound"]');

    const getSelectedClass = (element) => {
        return Array.from(element.classList).find(cls => cls.includes('game-summary_selectedRound'));
    };

    const roundIndicator = document.createElement('div');
    roundIndicator.className = 'peek-round-indicator';
    roundIndicator.textContent = 'Round 1';
    mapContainer.appendChild(roundIndicator);
    const updateRoundIndicator = () => {
        const selectedElement = roundsContainer.querySelector('[class*="game-summary_selectedRound"]');
        if (selectedElement) {
            const textElement = selectedElement.querySelector('[class*="game-summary_text__"]');
            if (textElement) {
                const match = textElement.textContent.match(/Round\s+(\d+)/i);
                if (match) {
                    roundIndicator.textContent = `Round ${match[1]}`;
                }
            }
        }
    };

    clonedRoundElements.forEach((roundElement, index) => {
        roundElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const selectedClass = getSelectedClass(roundElement);
            const isAlreadySelected = selectedClass && roundElement.classList.contains(selectedClass);

            if (isAlreadySelected) {
                return;
            }

            for (const el of clonedRoundElements) {
                const selectedClass = getSelectedClass(el);
                if (selectedClass) el.classList.remove(selectedClass);
            }

            for (const el of originalRoundElements) {
                const selectedClass = getSelectedClass(el);
                if (selectedClass) el.classList.remove(selectedClass);
            }

            const originalElement = originalRoundElements[index - 2];
            if (originalElement && typeof originalElement.click === 'function') {
                originalElement.click();

                setTimeout(() => {
                    const selectedClass = getSelectedClass(originalElement);
                    if (selectedClass) {
                        if (!originalElement.classList.contains(selectedClass)) {
                            originalElement.classList.add(selectedClass);
                        }
                        if (!roundElement.classList.contains(selectedClass)) {
                            roundElement.classList.add(selectedClass);
                        }
                    }
                    updateRoundIndicator();
                }, 50);
            }

            if (closeControl) closeControl.click();
        });
    });
    panelContent.appendChild(roundsContainer);
    panel.appendChild(panelContent);

    originalRoundElements.forEach((originalEl, index) => {
        const clonedEl = clonedRoundElements[index + 2];
        if (clonedEl) {
            originalEl.addEventListener('click', () => {
                setTimeout(() => {
                    const selectedClass = getSelectedClass(originalEl);
                    if (selectedClass && originalEl.classList.contains(selectedClass)) {
                        clonedRoundElements.forEach(el => {
                            const cls = getSelectedClass(el);
                            if (cls) el.classList.remove(cls);
                        });
                        clonedEl.classList.add(selectedClass);
                        updateRoundIndicator();
                    }
                }, 50);
            });
        }
        originalEl.style.display = 'none'
    });

    updateRoundIndicator();

    const closeButton = document.createElement('button');
    closeButton.className = 'peek-duel-rounds-close';
    closeButton.innerHTML = '×';
    closeButton.title = 'Close panel';
    panel.appendChild(closeButton);

    mapContainer.appendChild(toggleButton);
    mapContainer.appendChild(panel);

    const pinButton = document.createElement('button')
    pinButton.className = 'peek-duel-rounds-pin';
    pinButton.innerHTML = SVG_SOURCE.PIN;
    pinButton.title = 'Stick panel';
    panel.appendChild(pinButton);

    const stickPanel = () => {
        pinButton.classList.toggle('active');
    };

    const togglePanel = () => {
        const isActive = panel.classList.toggle('active');
        toggleButton.classList.toggle('active');
        toggleButton.style.opacity = isActive ? '0' : '1';
        toggleButton.style.pointerEvents = isActive ? 'none' : 'auto';
    };

    const closePanel = () => {
        panel.classList.remove('active');
        toggleButton.classList.remove('active');
        applyStyles(toggleButton, { opacity: '1', pointerEvents: 'auto' });
    };

    pinButton.addEventListener('click', stickPanel);
    toggleButton.addEventListener('click', togglePanel);
    closeButton.addEventListener('click', closePanel);

    mapContainer.addEventListener('click', (e) => {
        if (panel.classList.contains('active') &&
            !pinButton.classList.contains('active') &&
            !toggleButton.contains(e.target) &&
            !closeButton.contains(e.target) &&
            !panel.contains(e.target)) {
            closePanel();
        }
    });
}

// ============================================================================
// MAP RESIZING
// ============================================================================

function makeMapResizable() {
    const summaryContainer = domCache.queryOne('[class^="game-summary_innerContainer"]');
    const summaryBottom = domCache.queryOne('[class^="game-summary_bottom"]');
    if (summaryContainer) summaryContainer.style.paddingBottom = '0'
    if (summaryBottom) summaryBottom.style.minHeight = '4rem'
    const mapContainer = summaryContainer.querySelector('[class*="game-summary_mapContainer"]');
    if (!mapContainer) return;

    const containerData = initializedContainers.get(mapContainer) || {};
    if (containerData.resizable) return;

    containerData.resizable = true;
    initializedContainers.set(mapContainer, containerData);
    mapContainer.style.position = 'relative';

    const savedSize = GM_getValue('mapContainerSize', { width: null, height: null });
    if (savedSize.width && savedSize.height) {
        mapContainer.style.width = `${savedSize.width}px`;
        mapContainer.style.height = `${Math.min(window.innerHeight - 160, savedSize.height)}px`;
    }

    const resizerStyle = {
        position: 'fixed',
        background: 'rgba(100, 100, 255, 0.3)',
        transition: 'background 0.2s',
        zIndex: 10010
    };

    const resizers = [
        { name: 'top', cursor: 'n-resize', style: 'top: 0; left: 0; right: 0; height: 5px;' },
        { name: 'bottom', cursor: 's-resize', style: 'bottom: 0; left: 0; right: 0; height: 5px;' },
        { name: 'left', cursor: 'w-resize', style: 'left: 0; top: 0; bottom: 0; width: 5px;' },
        { name: 'right', cursor: 'e-resize', style: 'right: 0; top: 0; bottom: 0; width: 5px;' },
        { name: 'top-left', cursor: 'nw-resize', style: 'top: 0; left: 0; width: 10px; height: 10px;' },
        { name: 'top-right', cursor: 'ne-resize', style: 'top: 0; right: 0; width: 10px; height: 10px;' },
        { name: 'bottom-left', cursor: 'sw-resize', style: 'bottom: 0; left: 0; width: 10px; height: 10px;' },
        { name: 'bottom-right', cursor: 'se-resize', style: 'bottom: 0; right: 0; width: 10px; height: 10px;' }
    ];

    let isResizing = false;
    let currentResizer = null;
    let startX = 0, startY = 0;
    let startWidth = 0, startHeight = 0;
    let startLeft = 0, startTop = 0;

    const baseResizerStyle = `position: absolute; z-index: ${resizerStyle.zIndex}; background: ${resizerStyle.background};`;

    for (const config of resizers) {
        const resizer = document.createElement('div');
        resizer.className = `map-resizer-${config.name}`;
        resizer.style.cssText = `${config.style} ${baseResizerStyle} cursor: ${config.cursor};`;

        const updateResizerBg = (bg) => resizer.style.background = bg;
        resizer.addEventListener('mouseenter', () => updateResizerBg('rgba(100, 100, 255, 0.6)'));
        resizer.addEventListener('mouseleave', () => {
            if (!isResizing) updateResizerBg(resizerStyle.background);
        });

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            currentResizer = config.name;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = mapContainer.offsetWidth;
            startHeight = mapContainer.offsetHeight;

            const rect = mapContainer.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            applyStyles(document.body, { cursor: config.cursor, userSelect: 'none' });
            e.preventDefault();
            e.stopPropagation();
        });

        mapContainer.appendChild(resizer);
    }

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;

        if (currentResizer.includes('right')) {
            newWidth = startWidth + deltaX;
        } else if (currentResizer.includes('left')) {
            newWidth = startWidth - deltaX;
        }

        if (currentResizer.includes('bottom')) {
            newHeight = startHeight + deltaY;
        } else if (currentResizer.includes('top')) {
            newHeight = startHeight - deltaY;
        }

        const minWidth = 300;
        const maxWidth = window.innerWidth - 100;
        const minHeight = 250;
        const maxHeight = window.innerHeight - 160;

        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

        applyStyles(mapContainer, { width: `${newWidth}px`, height: `${newHeight}px` });
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            currentResizer = null;
            applyStyles(document.body, { cursor: '', userSelect: '' });

            GM_setValue('mapContainerSize', {
                width: mapContainer.offsetWidth,
                height: mapContainer.offsetHeight
            });

            const resizerElements = mapContainer.querySelectorAll('[class^="map-resizer-"]');
            for (const r of resizerElements) {
                r.style.background = resizerStyle.background;
            }
        }
    });
}

// ============================================================================
// PANORAMA DATA & METADATA
// ============================================================================

function getGeneration(worldsize, country, lat, date) {
    if (!worldsize) return 'Ari';
    if (worldsize === 1664) return 'Gen1';
    if (worldsize === 8192) return 'Gen4';
    if (worldsize === 6656) {
        const dateStr = date.toISOString().slice(0, 7);
        const gen2Countries = new Set(['AU', 'BR', 'CA', 'CL', 'JP', 'GB', 'IE', 'NZ', 'MX', 'RU', 'US', 'IT', 'DK', 'GR', 'RO',
                                       'PL', 'CZ', 'CH', 'SE', 'FI', 'BE', 'LU', 'NL', 'ZA', 'SG', 'TW', 'HK', 'MO', 'MC', 'NO',
                                       'SM', 'AD', 'IM', 'JE', 'FR', 'DE', 'ES', 'PT', 'SJ']);
        const gen3Dates = {
            'BD': '2021-04', 'EC': '2022-03', 'FI': '2020-09', 'IN': '2021-10', 'LK': '2021-02', 'KH': '2022-10',
            'LB': '2021-05', 'NG': '2021-06', 'ST': '2024-02', 'US': '2019-01', 'VN': '2021-01', 'ES': '2023-01'
        };
        if (dateStr >= '2022-01') return 'BadCam'
        if (dateStr >= gen3Dates[country]) {
            if (country != 'US') return 'BadCam'
            if (country === 'US' && lat > 52) return 'BadCam'
        }

        if (gen2Countries.has(country) && dateStr <= '2011-11') {
            return dateStr >= '2010-09' ? 'Gen2/3' : 'Gen2';
        }

        return 'Gen3';
    }
}

function parseMeta(data) {
    const tags = []

    const panoId = data[1][0][1][1];
    const lat = data[1][0][5][0][1][0][2];
    const lng = data[1][0][5][0][1][0][3];
    const year = data[1][0][6][7][0];
    const month = data[1][0][6][7][1];
    const worldsize = data[1][0][2][2][0];
    const history = data[1][0][5][0][8];
    const links = data[1][0][5][0][3][0]
    const worldHeight = data[1][0][2][2][0];
    const worldWidth = data[1][0][2][2][1];

    const date = new Date(year, month - 1);
    const formattedDate = date.toLocaleString('default', { month: 'short', year: 'numeric' });

    let heading, region, locality, road, country, altitude;
    try {
        heading = data[1][0][5][0][1][2][0];
    } catch (e) {
        heading = 0
    }
    try {
        country = data[1][0][5][0][1][4];
        if (['TW', 'HK', 'MO'].includes(country)) {
            country = 'CN';
        }
    } catch (e) {
        country = null;
    }

    try {
        const address = data[1][0][3][2][1][0];
        const parts = address.split(',')
        if (parts.length > 1) {
            region = parts[parts.length - 1].trim();
            locality = parts[0].trim()
        } else {
            region = address;
        }
    } catch (e) {
        try {
            const address = data[1][0][3][2][0][0]
            const parts = address.split(',')
            if (parts.length > 1) {
                region = parts[parts.length - 1].trim();
                locality = parts[0].trim()
            }
            else region = address;
        }
        catch (e) {
            region = null;
        }
    }
    try {
        road = data[1][0][5][0][12][0][0][0][2][0];
    } catch (e) {
        road = null;
    }
    try {
        altitude = data[1][0][5][0][1][1][0]
    }
    catch (e) {
        altitude = null;
    }
    const generation = String(data[1][0][4]).includes('Google') ? getGeneration(worldsize, country, lat, date) : 'ari';
    let camera;
    if (generation == 'Gen4') {
        if (['IN', 'PR'].includes(country)) camera = 'smallcam'
        else if (['NA', 'PA', 'OM', 'QA', 'EC'].includes(country)) camera = 'gen4trekker'
    }
    const isNewRoad = !history ? 'newroad' : false;
    const tagFields = [
        formattedDate, `${year}-${month}`, `${String(year).slice(2, 4)}-${month}`, year,
        MONTHS_SHORT[month - 1], MONTHS_FULL[month - 1],
        country, region, locality, road,
        generation, camera, altitude ? altitude.toFixed(2) + 'm' : null, isNewRoad
    ].filter(Boolean);
    return {
        lat,
        lng,
        altitude,
        panoId,
        worldHeight,
        worldWidth,
        year,
        month,
        country,
        region,
        locality,
        road,
        generation,
        links,
        history,
        heading: Math.round(heading),
        pitch: 0,
        zoom: 0,
        tags,
        tagFields
    }
}

// ============================================================================
// API REQUESTS & DATA
// ============================================================================

async function fetchGooglePano(t, e, s, d, r) {
    try {
        const url = `https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/${t}`;
        let payload = createPayload(t, e, s, d, r);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json+protobuf",
                "x-user-agent": "grpc-web-javascript/0.1"
            },
            body: payload,
            mode: "cors",
            credentials: "omit"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            return await response.json();
        }
    } catch (error) {
        console.error(`Error fetching google pano: ${error.message}`);
    }
}

function createPayload(mode, coorData, s, d, r) {
    var payload;
    let type = 2
    if (mode === 'GetMetadata') {
        const length = coorData.length
        if (String(coorData).substring(0, 4) == 'CIHM' || length != 22) type = 10
        payload = [["apiv3"], ["en", "US"], [[[type, coorData]]], [[1, 2, 3, 4, 8, 6]]];
    }
    else if (mode === 'SingleImageSearch') {
        payload = [["apiv3"],
                   [[null, null, parseFloat(coorData.lat), parseFloat(coorData.lng)], r],
                   [[null, null, null, null, null, null, null, null, null, null, [s, d]], null, null, null, null, null, null, null, [2], null, [[[type, true, 2]]]], [[1, 2, 3, 4, 8, 6]]]
    }
    else {
        throw new Error("Invalid mode!");
    }
    return JSON.stringify(payload);
}

async function getLOCATION(panoId) {
    const metaData = await fetchGooglePano('GetMetadata', panoId ? panoId : viewer.getPano());
    if (metaData) {
        LOCATION = parseMeta(metaData)
        LOCATION.heading = viewer.getPov().heading;
        LOCATION.pitch = viewer.getPov().pitch;
        LOCATION.zoom = viewer.getZoom();
        return LOCATION
    }
}

function calculateFOV(zoom) {
    const pi = Math.PI;
    const argument = (3 / 4) * Math.pow(2, 1 - zoom);
    const radians = Math.atan(argument);
    const degrees = (360 / pi) * radians;
    return degrees;
}

// ============================================================================
// STREET VIEW LINK & SHARING
// ============================================================================

async function getShortLink() {
    const url = 'https://www.google.com/maps/rpc/shorturl';
    if (!viewer) {
        return fallbackLink();
    }

    const aElements = domCache.queryAll('[rel="noopener"]');
    if (!aElements || aElements.length < 2) {
        return fallbackLink();
    }

    const ShareLinkElement = aElements[aElements.length - 2];
    const regex = /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)a,(-?\d+(?:\.\d+)?)y,(-?\d+(?:\.\d+)?)h,(-?\d+(?:\.\d+)?)t\/data=!3m4!1e\d+!3m2!1s([^!]+)!2e\d+(?:\?.*)?/;
    const shareLink = ShareLinkElement.getAttribute('href');
    const match = shareLink.match(regex);

    if (match) {
        const [, lat, lng, , y, h, t, panoId] = match;
        const payload = `!1shttps://www.google.com/maps/@${lat},${lng},3a,${y}y,${h}h,${t}t/data=*213m5*211e1*213m3*211s${panoId}*212e0*216shttps%3A%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3D${panoId}%26cb_client%3Dmaps_sv.share%26w%3D900%26h%3D600%26yaw%3D${h}%26pitch%3D${90 - parseFloat(t)}%26thumbfov%3D100*217i16384*218i8192?coh=205410&entry=tts!2m1!7e81!6b1`;

        const params = new URLSearchParams({
            authuser: '0',
            hl: 'en',
            gl: 'us',
            pb: payload
        }).toString();
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${url}?${params}`,
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        const text = response.responseText;
                        const match = text.match(/"([^"]+)"/);
                        if (match && match[1]) {
                            resolve(match[1]);
                        } else {
                            resolve(fallbackLink());
                        }
                    } else {
                        resolve(fallbackLink());
                    }
                },
                onerror: function () {
                    resolve(fallbackLink());
                }
            });
        });
    } else {
        return fallbackLink();
    }

    function fallbackLink() {
        return `https://www.google.com/maps/@?api=1&map_action=pano&heading=${viewer.getPov().heading}&pitch=${viewer.getPov().pitch}&fov=${calculateFOV(viewer.getZoom())}&pano=${viewer.getPano()}`;
    }
}

async function updatePanoSelector(pano, selector) {
    if (!svs) initSVS();
    const panoData = await new Promise((resolve, reject) => {
        svs.getPanorama(
            pano.panoId ? { pano: pano.panoId } : { location: pano.location },
            (data, status) => {
                if (status === google.maps.StreetViewStatus.OK) {
                    resolve(data);
                } else {
                    reject(new Error(`StreetView request failed: ${status}`));
                }
            }
        );
    });
    if (!panoData || !panoData.time || !panoData.imageDate) return
    const frag = document.createDocumentFragment();
    let [defaultYear, defaultMonth] = panoData.imageDate.split("-");
    if (panoData.imageDate && panoData.location?.pano) {
        frag.appendChild(new Option(
            `${MONTHS_FULL[defaultMonth - 1]} ${defaultYear} (Current)`,
            panoData.location.pano
        ));
    }

    if (Array.isArray(panoData.time) && panoData.time.length > 1) {
        for (const entry of panoData.time) {
            const date = extractDate(entry);
            if (!date) continue;
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            if (year == defaultYear && month == defaultMonth) continue;
            frag.appendChild(new Option(
                `${MONTHS_FULL[month - 1]} ${year}`,
                entry.pano
            ));
        }
    }
    selector.replaceChildren(frag);
}

// ============================================================================
// FULLSCREEN CONTROLS
// ============================================================================

function enterFullscreen(panoDiv) {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (panoDiv.requestFullscreen) {
            panoDiv.requestFullscreen();
        } else if (panoDiv.webkitRequestFullscreen) {
            panoDiv.webkitRequestFullscreen();
        } else if (panoDiv.msRequestFullscreen) {
            panoDiv.msRequestFullscreen();
        }
    }
}

function exitFullscreen() {
    document.exitFullscreen?.();
    document.webkitExitFullscreen?.();
    document.msExitFullscreen?.();
}

// ============================================================================
// MOVEMENT PATH TRACKING & RENDERING
// ============================================================================

function renderMovementPaths(round) {
    clearMovementPaths()
    const roundsToRender = round ? [round] : [1, 2, 3, 4, 5];
    const polylines = [];

    for (const roundNum of roundsToRender) {
        const storageKey = `${MOVEMENT_STORAGE_PREFIX}${roundNum}`;
        let path = null;

        try {
            const raw = sessionStorage.getItem(storageKey);
            if (!raw) continue;
            path = JSON.parse(raw);
            if (!Array.isArray(path) || path.length < 2) continue;
        } catch (err) {
            console.error('[MovementPath] read failed', err);
            continue;
        }

        const polyline = new google.maps.Polyline({
            path,
            geodesic: true,
            strokeColor: 'rgb(131, 18, 223)',
            strokeOpacity: 0.85,
            strokeWeight: 3,
            map: guessMap,
            zIndex: 99999
        });
        polylines.push({ polyline, round: roundNum });
    }

    if (polylines.length > 0) {
        if (round) {
            mapPathOverlayMap.set(guessMap, polylines[0]);
        } else {
            mapPathOverlayMap.set(guessMap, polylines);
        }
    }
}

function clearMovementPaths() {
    const overlay = mapPathOverlayMap.get(guessMap);
    if (overlay) {
        if (Array.isArray(overlay)) {
            overlay.forEach(item => item.polyline?.setMap(null));
        } else if (overlay.polyline) {
            overlay.polyline.setMap(null);
        }
    }

    mapPathOverlayMap.delete(guessMap);
}

function recordMovementPoint(panorama) {
    if (!panorama) return;

    const position = panorama.getPosition();
    if (!position) return;

    const round = getCurrentRound();
    if (!round) return;

    if (currentMovementRound !== round) {
        const startPoint = {
            lat: Number(position.lat().toFixed(5)),
            lng: Number(position.lng().toFixed(5))
        };
        currentMovementPath = [startPoint];
        currentMovementRound = round;
        return;
    }

    const newPoint = {
        lat: Number(position.lat().toFixed(5)),
        lng: Number(position.lng().toFixed(5))
    };

    const lastPoint = currentMovementPath[currentMovementPath.length - 1];
    if (!lastPoint || lastPoint.lat !== newPoint.lat || lastPoint.lng !== newPoint.lng) {
        currentMovementPath.push(newPoint);
    }
}

function trackMovement() {
    if (!viewer || !guessMap) return;

    const position = viewer.getPosition();
    if (!position) return;

    const newPoint = {
        lat: Number(position.lat().toFixed(5)),
        lng: Number(position.lng().toFixed(5))
    };

    const lastPoint = movementPath[movementPath.length - 1];
    if (!lastPoint || lastPoint.lat !== newPoint.lat || lastPoint.lng !== newPoint.lng) {
        movementPath.push(newPoint);
    }

    if (movementPath.length > 1) {
        if (pathPolyline) {
            pathPolyline.setPath(movementPath);
        } else {
            pathPolyline = new google.maps.Polyline({
                path: movementPath,
                geodesic: true,
                strokeColor: 'rgb(204, 48, 46)',
                strokeOpacity: 0.9,
                strokeWeight: 4,
                map: guessMap,
                zIndex: 10000
            });
        }
    }
}

function clearMovementPath() {
    if (pathPolyline) {
        pathPolyline.setMap(null);
        pathPolyline = null;
    }
    movementPath = [];
}

// ============================================================================
// ROUND SELECTION & RESULT DISPLAY
// ============================================================================

function attachRoundElementInteractions() {
    const roundContainer = domCache.queryOne('[class^="result-list_listWrapper"]');
    if (!roundContainer) return;

    const roundElements = roundContainer.querySelectorAll('[class^="result-list_listItemWrapper__"]');

    roundElements.forEach((element, index) => {
        if (element.dataset.snakeBound === 'true') return;
        element.dataset.snakeBound = 'true';

        ['top', 'right', 'bottom', 'left'].forEach(side => {
            const border = document.createElement('div');
            border.className = `snake-border-${side}`;
            element.appendChild(border);
        });

        element.addEventListener('mouseenter', () => element.classList.add('show-border'));

        element.addEventListener('mouseleave', () => element.classList.remove('show-border'));

        element.addEventListener('click', (e) => {
            e.stopPropagation();
            handleRoundElementClick(index + 1);
        }, true);
    });
}

function handleRoundElementClick(num) {
    closeControl?.click();

    const guessMarkers = [...domCache.queryAll(SELECTORS.guessMarker)];
    const answerMarkers = [...domCache.queryAll(SELECTORS.answerMarker)];
    const bounds = new google.maps.LatLngBounds();

    const showAll = num > answerMarkers.length;

    const processMarker = (marker, index) => {
        const visible = showAll || index + 1 === num;
        marker.style.display = visible ? 'block' : 'none';

        if (visible) {
            const coords = getMarkerCoords(marker);
            if (coords) bounds.extend(new google.maps.LatLng(coords));
        }
    };

    answerMarkers.forEach(processMarker);
    guessMarkers.forEach(processMarker);

    if (showAll) {
        guessMap.setCenter({ lat: 0, lng: 0 });
        guessMap.setZoom(2);
    } else if (!bounds.isEmpty()) {
        guessMap.fitBounds(bounds);
    }
}

// ============================================================================
// PHOTO MODE & STREET VIEW CONTROLS
// ============================================================================

function togglePhotoMode(photoControl, viewer) {
    isPhotoMode = !isPhotoMode;
    const panoDiv = document.getElementById('peek-pano');
    const controls = panoDiv.querySelectorAll('.pano-control');
    const panoSelect = document.getElementById('pano-select');

    if (isPhotoMode) {
        enterFullscreen(panoDiv);

        for (const ctrl of controls) {
            ctrl.style.display = 'none';
        }
        if (panoSelect) panoSelect.style.display = 'none';
        viewer.setOptions({
            linksControl: false,
            addressControl: false,
            fullscreenControl: false,
            clickToGo: false,
        });

        applyStyles(photoControl, { opacity: '0.1' });
        photoControl.title = 'Exit Photo Mode';

        cleanStyle = GM_addStyle(`
      .embed-controls {display: none !important}
      .SLHIdE-sv-links-control {display: none !important}
      [alt="Google"] {display: none !important}
      .gmnoprint.SLHIdE-sv-links-control {display: none !important}
      [class$="gmnoprint"], [class$="gm-style-cc"], [class$="gm-compass"] {display: none !important}
    `);
    } else {
        for (const ctrl of controls) {
            ctrl.style.display = '';
        }
        if (panoSelect) panoSelect.style.display = '';

        viewer.setOptions({
            linksControl: true,
            addressControl: true,
            fullscreenControl: true,
            clickToGo: true,
        });

        if (cleanStyle) {
            cleanStyle.remove();
            cleanStyle = null;
        }

        applyStyles(photoControl, { opacity: '1' });
        photoControl.title = 'Photo Mode (Hide UI)';
    }
}

const getPanorama = (lat, lng) => {
    return new Promise((resolve) => {
        if (!svs) initSVS();
        svs.getPanorama(
            { location: { lat, lng }, radius: 50 },
            (data, status) => {
                if (status === google.maps.StreetViewStatus.OK) {
                    resolve(data);
                } else {
                    resolve(null);
                }
            }
        );
    });
};

async function moveStreetView(direction) {
    if (!viewer) return;

    const currentPos = viewer.getPosition();
    if (!currentPos) return;

    const lat = currentPos.lat();
    const lng = currentPos.lng();
    const heading = viewer.getPov().heading;
    const TARGET_DISTANCE = 100;

    const mainHeading = direction === 'forward' ? heading : (heading + 180) % 360;
    const leftHeading = (mainHeading - 45) % 360;
    const rightHeading = (mainHeading + 45) % 360;

    const currentLatLng = new google.maps.LatLng(lat, lng);
    const mainPoint = google.maps.geometry.spherical.computeOffset(currentLatLng, TARGET_DISTANCE, mainHeading);
    const leftPoint = google.maps.geometry.spherical.computeOffset(currentLatLng, TARGET_DISTANCE, leftHeading);
    const rightPoint = google.maps.geometry.spherical.computeOffset(currentLatLng, TARGET_DISTANCE, rightHeading);

    let [panoMain, panoLeft, panoRight] = await Promise.allSettled([
        getPanorama(mainPoint.lat(), mainPoint.lng()),
        getPanorama(leftPoint.lat(), leftPoint.lng()),
        getPanorama(rightPoint.lat(), rightPoint.lng())
    ]);

    let newPos = currentPos;

    if (panoMain && panoMain.status === 'fulfilled' && panoMain.value) {
        newPos = panoMain.value.location.latLng;
    } else if (panoLeft && panoLeft.status === 'fulfilled' && panoLeft.value) {
        newPos = panoLeft.value.location.latLng;
    } else if (panoRight && panoRight.status === 'fulfilled' && panoRight.value) {
        newPos = panoRight.value.location.latLng;
    }

    viewer.setPosition({
        lat: newPos.lat(),
        lng: newPos.lng()
    });
}

// ============================================================================
// STREET VIEW INITIALIZATION & DISPLAY
// ============================================================================

function buildMapHTML(m) {
    return `<div class="map">
        <a href="https://map-making.app/maps/${m.id}" class="map-link">
            <span class="map-name">${m.name}</span>
        </a>
        <span class="map-buttons">
            <span class="map-add" data-id="${m.id}">ADD</span>
            <span class="map-added">ADDED</span>
        </span>
    </div>`;
}

function openNativeStreetView(pano) {
    if (!guessMap || !pano || pano.error) return;
    if(!isCoverageLayer) toggleCoverageLayer("on");
    const shareDiv = domCache.queryOne("[class*='standard-final-result_challengeFriendButton']")
    if (shareDiv) shareDiv.style.display = 'none'
    const xpDiv = domCache.queryOne("[class*='level-up-xp-button']")
    if (xpDiv) xpDiv.style.display = 'none'
    const mapContainer = domCache.queryOne(SELECTORS.dcEND) || domCache.queryOne(SELECTORS.resultMap) || domCache.queryOne(SELECTORS.duelMap);
    const isDuelMode = !!domCache.queryOne(SELECTORS.duelMap);
    const actualContainer = isDuelMode ? mapContainer.parentElement : mapContainer;

    let splitContainer = actualContainer.querySelector('.peek-split-container');

    if (!splitContainer) {
        if (isDuelMode && actualContainer) {
            actualContainer.style.position = 'relative';
        }

        splitContainer = document.createElement('div');
        splitContainer.className = 'peek-split-container';
        splitContainer.innerHTML = `
            <div class="peek-split-resizer"></div>
            <div class="peek-split-pano" id="peek-pano"></div>
        `;
        actualContainer.appendChild(splitContainer);

        const resizer = splitContainer.querySelector('.peek-split-resizer');
        let isResizing = false;
        let startX = 0;
        let startWidth = 0;

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startWidth = splitContainer.offsetWidth;
            applyStyles(document.body, { cursor: 'ew-resize', userSelect: 'none' });
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const deltaX = startX - e.clientX;
            const newWidth = startWidth + deltaX;
            const containerWidth = mapContainer.offsetWidth;

            const minWidth = containerWidth * 0.2;
            const maxWidth = containerWidth * 0.8;

            if (newWidth >= minWidth && newWidth <= maxWidth) {
                const widthPercent = (newWidth / containerWidth) * 100;
                splitContainer.style.width = widthPercent + '%';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                applyStyles(document.body, { cursor: '', userSelect: '' });
            }
        });

        const panoDiv = document.getElementById('peek-pano');

        viewer = new google.maps.StreetViewPanorama(panoDiv, {
            pov: {
                heading: pano.heading || 0,
                pitch: pano.pitch || 0
            },
            zoom: pano.zoom || 1,
            addressControl: true,
            showRoadLabels: false,
            enableCloseButton: false,
            zoomControl: true,
            clickToGo: true
        })

        pano.panoId ? viewer.setPano(pano.panoId) : viewer.setPosition(pano.location)

        viewer.addListener("pano_changed", function () {
            updatePanoSelector({ panoId: viewer.getPano() }, panoSelector)
        });

        viewer.addListener("position_changed", function () {
            trackMovement();
        });

        closeControl = document.createElement('button')
        closeControl.className = 'pano-control'
        closeControl.id = 'peek-split-close'
        closeControl.textContent = '×'
        closeControl.onclick = (e) => {
            e.stopPropagation();
            if (shareDiv) shareDiv.style.display = 'block';
            if (xpDiv) xpDiv.style.display = 'inline-flex';
            splitContainer.classList.remove('active');
            removePeekMarker();
            clearMovementPath();
        };
        viewer.controls[google.maps.ControlPosition.RIGHT_TOP].push(closeControl);

        const saveControl = document.createElement('button')
        saveControl.className = 'pano-control'
        saveControl.id = 'peek-save'
        saveControl.title = 'Save to MapMaking'
        saveControl.innerHTML = SVG_SOURCE.SAVE
        saveControl.addEventListener('click', async () => {
            await getLOCATION()
            if (MAP_MAKING_API_KEY === 'PASTE_YOUR_KEY_HERE') {
                await Swal.fire({
                    icon: 'warning',
                    title: 'API Key Required',
                    html: `To save locations to <strong>Map Making App</strong>, please enter your API key below.<br><br>
           You can generate an API key <a href="https://map-making.app/keys" target="_blank" style="color: #007bff; text-decoration: none;"><strong>here</strong></a>.`,
                    input: 'text',
                    inputPlaceholder: 'Enter your API key',
                    showCancelButton: true,
                    confirmButtonText: 'Save',
                    cancelButtonText: 'Cancel',
                    backdrop: null,
                    preConfirm: (value) => {
                        if (!value) {
                            Swal.showValidationMessage('API key cannot be empty');
                        }
                        return value;
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        MAP_MAKING_API_KEY = result.value
                        GM_setValue("MAP_MAKING_API_KEY", result.value);
                    }
                });
            }

            if (!MAP_LIST) {
                showLoader();

                try {
                    MAP_LIST = await getMaps();
                } catch {
                }

                hideLoader();
            }

            if (MAP_LIST) {
                showMapList()
            }
        });
        viewer.controls[google.maps.ControlPosition.RIGHT_TOP].push(saveControl);

        const downloadControl = document.createElement('button')
        downloadControl.className = 'pano-control'
        downloadControl.id = 'pano-download'
        downloadControl.title = 'Download Panorama Image'
        downloadControl.innerHTML = SVG_SOURCE.DOWNLOAD
        downloadControl.addEventListener('click', async () => {
            try {
                downloadControl.innerHTML = SVG_SOURCE.LOADING;
                downloadControl.title = 'Downloading...';
                downloadControl.classList.add('loading');

                const metadata = await getLOCATION();

                await downloadPanoramaImage(metadata.panoId, `${metadata.panoId}.jpg`, metadata.worldWidth, metadata.worldHeight, 5);

                downloadControl.classList.remove('loading');
                downloadControl.innerHTML = SVG_SOURCE.SUCCESS;
                downloadControl.title = 'Download Complete!';

                setTimeout(() => {
                    downloadControl.innerHTML = SVG_SOURCE.DOWNLOAD;
                    downloadControl.title = 'Download Panorama Image';
                }, 1500);

            } catch (error) {
                console.error('Download failed:', error);
                downloadControl.classList.remove('loading');
                downloadControl.innerHTML = SVG_SOURCE.DOWNLOAD;
                downloadControl.title = 'Download Panorama Image';
                Swal.fire({
                    icon: 'error',
                    title: 'Download Failed',
                    text: 'Failed to download panorama image. Please try again.',
                    confirmButtonText: 'OK',
                    backdrop: null
                });
            }
        });
        viewer.controls[google.maps.ControlPosition.RIGHT_TOP].push(downloadControl);

        const copyControl = document.createElement('button')
        copyControl.className = 'pano-control'
        copyControl.id = 'peek-copy'
        copyControl.title = 'Copy Link'
        copyControl.innerHTML = SVG_SOURCE.COPY
        copyControl.addEventListener("click", async () => {
            copyControl.innerHTML = SVG_SOURCE.LOADING;
            copyControl.classList.toggle('loading');
            const shortUrl = await getShortLink();
            copyControl.innerHTML = SVG_SOURCE.SUCCESS;
            copyControl.classList.toggle('loading');
            await GM_setClipboard(shortUrl);
            setTimeout(() => {
                copyControl.innerHTML = SVG_SOURCE.COPY;
            }, 1500);
        });
        viewer.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(copyControl);

        const spawnControl = document.createElement('button')
        spawnControl.className = 'pano-control'
        spawnControl.id = 'peek-spawn'
        spawnControl.title = 'Back to Spawn'
        spawnControl.innerHTML = SVG_SOURCE.SPAWN
        spawnControl.addEventListener('click', async () => {
            if (spawn && (spawn.panoId || spawn.location)) {
                spawn.panoId ? viewer.setPano(spawn.panoId) : viewer.setPosition(spawn.location);
                viewer.setPov({ heading: spawn.heading || 0, pitch: spawn.pitch || 0 });
                viewer.setZoom(spawn.zoom || 1);
            }
        });
        viewer.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(spawnControl);

        const photoControl = document.createElement('button')
        photoControl.className = 'pano-control'
        photoControl.id = 'peek-photo'
        photoControl.title = 'Photo Mode (Hide UI)'
        photoControl.innerHTML = SVG_SOURCE.CAMERA
        photoControl.addEventListener('click', () => {
            togglePhotoMode(photoControl, viewer);
        });
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                if (isPhotoMode) togglePhotoMode(photoControl, viewer);
                closeControl.style.display = '';
            }
            else {
                closeControl.style.display = 'none';
            }
        });
        viewer.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(photoControl);

        // Jump distance control
        const jumpControl = document.createElement('div');
        jumpControl.className = 'pano-control';
        jumpControl.id = 'pano-jump';
        const jumpForwardBtn = document.createElement('button');
        jumpForwardBtn.className = 'pano-jump-btn pano-control';
        jumpForwardBtn.textContent = '100m';
        jumpForwardBtn.title = 'Jump forward 100 metres (Hotkey: 3)';

        const jumpBackwardBtn = document.createElement('button');
        jumpBackwardBtn.className = 'pano-jump-btn pano-control';
        jumpBackwardBtn.textContent = '-100m';
        jumpBackwardBtn.title = 'Jump backward 100 metres (Hotkey: 4)';

        jumpForwardBtn.addEventListener('click', () => moveStreetView('forward'));
        jumpBackwardBtn.addEventListener('click', () => moveStreetView('backward'));

        jumpControl.appendChild(jumpForwardBtn);
        jumpControl.appendChild(jumpBackwardBtn);

        viewer.controls[google.maps.ControlPosition.TOP_CENTER].push(jumpControl);

        document.addEventListener('keydown', (e) => {
            if (splitContainer && splitContainer.classList.contains('active')) {
                if (e.key === '4' && !e.ctrlKey && !e.altKey && !e.metaKey) {
                    e.preventDefault();
                    moveStreetView('backward');
                } else if (e.key === '3' && !e.ctrlKey && !e.altKey && !e.metaKey) {
                    e.preventDefault();
                    moveStreetView('forward');
                }
            }
        });


        if (!panoSelector) panoSelector = document.createElement("select");
        panoSelector.id = "pano-select";
        panoSelector.addEventListener('change', function () {
            if (viewer) viewer.setPano(panoSelector.value);
        });
        viewer.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(panoSelector);
    }
    else {
        pano.panoId ? viewer.setPano(pano.panoId) : viewer.setPosition(pano.location)
        if (pano.heading && pano.pitch) viewer.setPov({ heading: pano.heading || 0, pitch: pano.pitch || 0 })
        if (pano.zoom) viewer.setZoom(pano.zoom);
    }

    requestAnimationFrame(() => {
        spawn = pano;
        updatePanoSelector(pano, document.getElementById('pano-select'));
        clearMovementPath();
        splitContainer.classList.toggle('active');
    });
}

function showMapList() {
    if (document.getElementById('peek-map-list')) return;

    const element = document.createElement('div');
    element.id = 'peek-map-list';
    element.className = 'peek-modal';

    // Use array join for better string concatenation performance
    let recentMapsSection = '';
    if (PEEK_STATE.recentMaps.length > 0) {
        const recentMapsArr = PEEK_STATE.recentMaps.filter(m => !m.archivedAt).map(buildMapHTML);
        if (recentMapsArr.length > 0) {
            recentMapsSection = `
                <h3>Recent Maps</h3>
                <div class="maps">
                    ${recentMapsArr.join('')}
                </div>
                <br>
            `;
        }
    }

    const mapsArr = MAP_LIST.filter(m => !m.archivedAt).map(buildMapHTML);

    const tagButtonsArr = [];
    if (LOCATION) {
        for (const tag of LOCATION.tagFields) {
            tagButtonsArr.push(`<button class="tag-button" data-tag="${tag}">${tag}</button>`);
        }
    }
    if (previousTags.length > 0) {
        for (const tag of previousTags) {
            tagButtonsArr.push(`<button class="tag-button" data-tag="${tag}">${tag}</button>`);
        }
    }

    element.innerHTML = `
    <div class="inner">
        <h3>Tags (comma separated)</h3>

        <input type="text" class="tag-input" id="peek-map-tags" />

        <div class="tag-buttons">
            ${tagButtonsArr.join('')}
        </div>

        <br><br>

        ${recentMapsSection}

        <h3>All Maps</h3>

        <div class="maps">
            ${mapsArr.join('')}
        </div>
    </div>

    <div class="dim"></div>
    `;

    document.body.appendChild(element);

    element.querySelector('.dim').addEventListener('click', closeMapList);

    const tagInput = document.getElementById('peek-map-tags');
    const stopPropagation = e => e.stopPropagation();
    tagInput.addEventListener('keyup', stopPropagation);
    tagInput.addEventListener('keydown', stopPropagation);
    tagInput.addEventListener('keypress', stopPropagation);
    tagInput.focus();

    for (const map of element.querySelectorAll('.maps .map-add')) {
        map.addEventListener('click', addLocationToMap);
    }

    for (const btn of element.querySelectorAll('.tag-button')) {
        btn.addEventListener('click', function () {
            const tag = this.dataset.tag;
            const input = document.getElementById('peek-map-tags');

            let currentTags = input.value.split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);

            if (this.classList.contains('active')) {
                currentTags = currentTags.filter(t => t !== tag);
                this.classList.remove('active');
            } else {
                if (!currentTags.includes(tag)) {
                    currentTags.push(tag);
                }
                this.classList.add('active');
            }

            input.value = currentTags.join(', ');
        });
    }
}

function closeMapList() {
    const element = document.getElementById('peek-map-list');
    if (element) element.remove();
}

function addLocationToMap(e) {
    e.target.parentNode.classList.add('is-added');

    const id = parseInt(e.target.dataset.id);
    previousMapId = id;
    GM_setValue('previousMapId', JSON.stringify(id));

    PEEK_STATE.recentMaps = PEEK_STATE.recentMaps.filter(m => m.id !== id).slice(0, 2);
    const map = MAP_LIST.find(m => m.id === id);
    if (map) {
        PEEK_STATE.recentMaps.unshift(map);
    }

    saveState();
    const tagList = document.getElementById('peek-map-tags').value.split(',').map(t => t.trim()).filter(t => t.length > 0);
    // Use Set for efficient deduplication
    const tagFieldsSet = new Set(LOCATION.tagFields);
    const customTags = tagList.filter(tag => !tagFieldsSet.has(tag));
    const mergedSet = new Set([...customTags, ...previousTags]);
    const limited = [...mergedSet].slice(0, 5);
    GM_setValue('previousTags', JSON.stringify(limited));
    importLocations(id, [{
        id: -1,
        location: { lat: LOCATION.lat, lng: LOCATION.lng },
        panoId: LOCATION.panoId ?? null,
        heading: LOCATION.heading ?? 90,
        pitch: LOCATION.pitch ?? 0,
        zoom: LOCATION.zoom === 0 ? null : LOCATION.zoom,
        tags: tagList,
        flags: LOCATION.panoId ? 1 : 0
    }]);
}

// ============================================================================
// STATE MANAGEMENT & PERSISTENCE
// ============================================================================

function defaultState() {
    return {
        recentMaps: []
    }
}

function loadState() {
    const data = GM_getValue('peek_state', null);
    if (!data) return;

    const dataJson = JSON.parse(data);
    Object.assign(PEEK_STATE, defaultState(), dataJson);
    saveState();
}

function saveState() {
    GM_setValue('peek_state', JSON.stringify(PEEK_STATE));
}

async function mmaFetch(url, options = {}) {
    const response = await fetch(new URL(url, 'https://map-making.app'), {
        ...options,
        headers: {
            accept: 'application/json',
            authorization: `API ${MAP_MAKING_API_KEY.trim()}`,
            ...options.headers
        }
    });
    if (!response.ok) {
        let message = 'Unknown error';
        try {
            const res = await response.json();
            if (res.message) {
                message = res.message;
            }
        } catch {
            //empty
        }
        alert(`An error occurred while trying to connect to Map Making App. ${message}`);
        throw Object.assign(new Error(message), { response });
    }
    return response;
}

async function getMaps() {
    const response = await mmaFetch(`/api/maps`);
    const maps = await response.json();
    return maps;
}

function showLoader() {
    if (document.getElementById('peek-loader')) return;

    const element = document.createElement('div');
    element.id = 'peek-loader';
    element.className = 'peek-modal';
    element.innerHTML = `
		<div class="text">LOADING...</div>
		<div class="dim"></div>
	`;
    document.body.appendChild(element);
}

function hideLoader() {
    const element = document.getElementById('peek-loader');
    if (element) element.remove();
}

async function importLocations(mapId, locations) {
    const response = await mmaFetch(`/api/maps/${mapId}/locations`, {
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            edits: [{
                action: { type: 4 },
                create: locations,
                remove: []
            }]
        })
    });
    await response.json();
}

// ============================================================================
// HISTORY TRACKING & MARKER HANDLERS
// ============================================================================

function updateHistory(token, listKey) {
    let list = GM_getValue(listKey, []);
    list = list.filter(t => t !== token);
    list.unshift(token);
    while (list.length > STORAGE_CAP) {
        GM_deleteValue(list.pop());
    }
    GM_setValue(listKey, list);
}

function createMarkerClickHandler(pano) {
    return (e) => {
        e.preventDefault();
        e.stopPropagation();
        removePeekMarker();
        openNativeStreetView(pano);
    };
}

function attachMarkerClickListener(marker, pano) {
    const oldHandler = markerHandlerMap.get(marker);
    if (oldHandler) {
        marker.removeEventListener("click", oldHandler);
    }
    const clickHandler = createMarkerClickHandler(pano);
    markerHandlerMap.set(marker, clickHandler);
    marker.addEventListener("click", clickHandler);
}


// ============================================================================
// INITIALIZATION
// ============================================================================

function main() {
    startMapObserver();
    startMarkerObserver();
    loadState();
    window.addEventListener("urlchange", () => {
        startMapObserver();
        startMarkerObserver();
        loadState();
    });

    GM_addStyle(`
    .peek-tooltip {
        display: none;
        position: absolute;
        width: 300px;
        background: rgba(26, 26, 26, 0.95);
        color: white;
        border: 1px solid #ffd700;
        border-radius: 4px;
        padding: 8px;
        font-size: 12px;
        left: 50%;
        bottom: 45px;
        transform: translateX(-50%);
        z-index: 10000;
        pointer-events: none;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    }

    .peek-duel-tooltip {
        display: none;
        position: absolute;
        width: 280px;
        background: rgba(26, 26, 26, 0.95);
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px;
        font-size: 12px;
        left: 50%;
        bottom: 45px;
        transform: translateX(-50%);
        z-index: 10000;
        pointer-events: none;
        text-align: center;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.6);
    }

    .peek-duel-answer-tooltip {
        display: none;
        position: absolute;
        width: 280px;
        background: rgba(30, 30, 35, 0.96);
        color: white;
        border: none;
        border-radius: 6px;
        padding: 0;
        left: 50%;
        bottom: 45px;
        transform: translateX(-50%);
        z-index: 10000;
        pointer-events: none;
        text-align: center;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.65);
        overflow: hidden;
    }

    [data-pano="true"]:hover .peek-duel-tooltip,
    [data-pano="false"]:hover .peek-duel-tooltip {
        display: block;
    }

    [class*='result-map_roundPin']:hover .peek-duel-answer-tooltip {
        display: block;
    }

    .peek-answer-tooltip {
        display: none;
        position: absolute;
        width: 300px;
        background: rgba(30, 30, 35, 0.96);
        color: white;
        border: 1px solid #4ade80;
        border-radius: 6px;
        padding: 0;
        left: 50%;
        bottom: 45px;
        transform: translateX(-50%);
        z-index: 10000;
        pointer-events: none;
        text-align: center;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.65);
        overflow: hidden;
    }

    .peek-close-btn {
        position: absolute;
        top: 2px;
        right: 4px;
        background: rgba(0, 0, 0, 0.4);
        color: #ff6b6b;
        border: none;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        font-size: 12px;
        line-height: 16px;
        cursor: pointer;
        z-index: 10003;
    }

    .peek-close-btn:hover {
        background: rgba(255, 107, 107, 0.3);
    }

    .peek-split-container {
        position: absolute;
        top: 0;
        right: -100%;
        width: 50%;
        height: 100%;
        background: #000;
        z-index: 10006;
        transition: right 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
        overflow: hidden;
        box-shadow: -5px 0 20px rgba(0, 0, 0, 0.5);
    }

    .peek-split-container.active {
        right: 0;
    }

    .peek-split-resizer {
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        background: #7dcc4c;
        cursor: ew-resize;
        z-index: 10007;
    }

    .peek-split-pano {
        width: 100%;
        height: 100%;
    }

    .pano-control {
        background: none rgb(68, 68, 68);
        border: 0px;
        color: #b3b3b3;
        font-size: 32px;
        margin: 8px 10px;
        padding: 0px;
        text-transform: none;
        appearance: none;
        position: absolute;
        cursor: pointer;
        user-select: none;
        border-radius: 2px;
        height: 40px;
        width: 40px;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
        overflow: hidden;
        z-index: 10008;
    }

    .pano-control:hover {
        color: #e6e6e6;
    }

    .pano-control.loading svg {
        animation: rotate 2s linear infinite;
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .map-control {
        background: rgb(0, 0, 0, 0.8);
        color: white;
        border: 0px;
        top: 100px;
        padding: 8px;
        text-transform: none;
        appearance: none;
        position: absolute;
        cursor: pointer;
        user-select: none;
        border-radius: 100%;
        height: 40px;
        width: 40px;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
        overflow: hidden;
        opacity: 0.8;
        z-index: 9999;
    }

    .map-control:hover {
        opacity: 1.0;
        color:#ffcf4a;
    }

    #sv-coverage-toggle {
        left: 1rem;
    }

    #map-type-toggle {
        left: 4.5rem;
    }

    #path-focus {
        left: 8rem;
    }

    #sv-opacity-control {
        left: 1rem;
        top: 64px;
        width: 100px !important;
        border-radius: 5px !important;
        height: 24px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 10px !important;
        background: #ffffff !important;
        opacity: 0.9;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    }

    .sv-opacity-control__slider {
        width: 100%;
        height: 5px;
        borde: none;
        padding: 0;
        background: linear-gradient(to right, #e8e8e8, #d0d0d0);
        outline: none;
        appearance: auto;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    #pano-jump {
        display: flex !important;
        gap: 0 !important;
        padding: 0 !important;
        margin: 8px 10px !important;
        width: auto !important;
        height: auto !important;
        background: none rgb(68, 68, 68) !important;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px !important;
        border-radius: 2px !important;
    }

    .pano-jump-btn {
        padding: 8px 12px;
        border: none;
        cursor: pointer;
        font-weight: 500;
        background: transparent;
        color: inherit;
        flex: 0 1 auto;
        border-right: 1px solid rgba(0, 0, 0, 0.3);
        transition: all 0.2s ease;
        font-size: 14px;
        line-height: 1;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .pano-jump-btn:first-child {
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;
    }

    .pano-jump-btn:last-child {
        border-right: none;
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
    }

    .pano-jump-btn:hover {
        background-color: rgba(100, 100, 100, 0.5);
        color: #e6e6e6;
    }

    .pano-jump-btn:active {
        background-color: rgba(80, 80, 80, 0.7);
    }

    .peek-modal {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .peek-modal .dim {
        position: fixed;
        inset: 0;
        z-index: 0;
        background: rgba(0, 0, 0, 0.75);
    }

    .peek-modal .text {
        position: relative;
        z-index: 1;
    }

    .peek-modal .inner {
        box-sizing: border-box;
        position: relative;
        z-index: 1;
        background: #fff;
        padding: 20px;
        margin: 20px;
        width: calc(100% - 40px);
        max-width: 500px;
        overflow: auto;
        color: #000;
        flex: 0 1 auto;
    }

    #peek-loader {
        color: #fff;
        font-weight: bold;
    }

    .peek-credit {
        position: absolute;
        top: 1rem;
        z-index: 9;
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: flex-start;
    }

    #peek-main {
        position: absolute;
        width: 40px;
        height: 40px;
        top: 0.85rem;
        right: 4rem;
        z-index: 9;
        display: flex;
        border: none;
        border-radius: 50%;
        background: #00000099;
        background-repeat: no-repeat;
        background-position: 50%;
        flex-direction: column;
        gap: 5px;
        align-items: flex-start;
    }

    #peek-main:hover {
        cursor: pointer;
        opacity: 0.8;
    }

    #peek-main::after {
        display: none;
        content: attr(data-text);
        position: absolute;
        top: 120%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 1);
        color: #fff;
        padding: 5px;
        border-radius: 5px;
        font-weight: normal;
        font-size: 11px;
        line-height: 1;
        height: auto;
        white-space: nowrap;
        transition: opacity 0.5s ease;
    }

    #peek-main:hover::after {
        opacity: 1;
        display: block;
    }

    .peek-credit.extra-pad {
        top: 2.5rem;
    }

    .peek-credit-title {
        font-size: 15px;
        font-weight: bold;
        text-shadow: rgb(204, 48, 46) 2px 0px 0px, rgb(204, 48, 46) 1.75517px 0.958851px 0px, rgb(204, 48, 46) 1.0806px 1.68294px 0px, rgb(204, 48, 46) 0.141474px 1.99499px 0px, rgb(204, 48, 46) -0.832294px 1.81859px 0px, rgb(204, 48, 46) -1.60229px 1.19694px 0px, rgb(204, 48, 46) -1.97998px 0.28224px 0px, rgb(204, 48, 46) -1.87291px -0.701566px 0px, rgb(204, 48, 46) -1.30729px -1.5136px 0px, rgb(204, 48, 46) -0.421592px -1.95506px 0px, rgb(204, 48, 46) 0.567324px -1.91785px 0px, rgb(204, 48, 46) 1.41734px -1.41108px 0px, rgb(204, 48, 46) 1.92034px -0.558831px 0px;
        position: relative;
        z-index: 1;
    }

    .peek-credit-subtitle {
        font-size: 12px;
        background: rgba(204, 48, 46, 0.4);
        padding: 3px 5px;
        border-radius: 5px;
        position: relative;
        z-index: 0;
        top: -8px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    .peek-credit-subtitle a:hover {
        text-decoration: underline;
    }

    .peek-settings-option {
        background: var(--ds-color-purple-100);
        padding: 6px 10px;
        border-radius: 5px;
        font-size: 12px;
        cursor: pointer;
        opacity: 0.75;
        transition: opacity 0.2s;
        pointer-events: auto;
    }

    .peek-settings-option:hover {
        opacity: 1;
    }

    #peek-map-list h3 {
        margin-bottom: 10px;
    }

    #peek-map-list .tag-input {
        display: block;
        width: 100%;
        font: inherit;
        border: 1px solid #ccc;
    }

    #peek-map-list .maps {
        max-height: 200px;
        overflow-x: hidden;
        overflow-y: auto;
        font-size: 15px;
    }

    #peek-map-list .map {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        padding: 8px;
        transition: background 0.2s;
    }

    #peek-map-list .map:nth-child(2n) {
        background: #f0f0f0;
    }

    #peek-map-list .map-buttons:not(.is-added) .map-added {
        display: none !important;
    }

    #peek-map-list .map-buttons.is-added .map-add {
        display: none !important;
    }

    #peek-map-list .map-add {
        background: green;
        color: #fff;
        padding: 3px 6px;
        border-radius: 5px;
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
    }

    #peek-map-list .map-added {
        background: #000;
        color: #fff;
        padding: 3px 6px;
        border-radius: 5px;
        font-size: 13px;
        font-weight: bold;
    }

    #pano-select {
        width: 200px;
        height: 40px;
        padding: 5px;
        font-size: 14px;
        color: #FFFFFF;
        position: absolute;
        bottom: 8px !important;
        border-radius: 5px;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
        border: none;
        cursor: pointer;
        text-align: left;
        z-index: 10007;
        background-color: rgb(34, 34, 34, 0.9);
    }

    .map-name {
        color: #007b8b;
        text-decoration: underline;
    }

    .tag-buttons {
        margin-top: 10px;
    }

    .tag-button {
        margin: 5px 5px 0 0;
        padding: 4px 10px;
        border: 1px solid #ccc;
        background: #f0f0f0;
        border-radius: 4px;
        cursor: pointer;
        transition: 0.2s;
        font-size: 16px;
        font-weight: bold;
    }

    .tag-button:hover {
        background: #e0e0e0;
    }

    .tag-button.active {
        background-color: green;
        color: white;
        border-color: green;
    }

    [data-pano="true"]:hover .peek-tooltip,
    [data-pano="false"]:hover .peek-tooltip {
        display: block;
    }

    [data-qa='correct-location-marker']:hover .peek-answer-tooltip {
        display: block;
    }

    [data-pano="true"]> :first-child {
        cursor: pointer;
        --border-size-factor: 1.5 !important;
    }

    [data-pano="true"]:not([class*='result-map_roundPin'])> :first-child {
    --border-color: #E91E63 !important;
    }

    [data-pano="false"]:not([class*='result-map_roundPin'])> :first-child {
        cursor: initial;
        --border-color: #323232 !important;
    }

    [data-qa='guess-marker'] {
        cursor: pointer !important;
        z-index: 1000 !important;
        transition: transform 0.2s;
    }

    .peek-header {
        background: #111;
        padding: 6px;
        font-size: 11px;
        color: #888;
        text-align: center;
        border-bottom: 1px solid #333;
    }

    .peek-dist {
        color: #ffd700;
        font-weight: bold;
        font-size: 13px;
    }

    .peek-note {
        font-size: 10px;
        color: #ffd700;
        margin-top: 4px;
    }

    .peek-body {
        height: 150px;
        background: #000;
        overflow: hidden;
        cursor: default;
    }

    .peek-thumb {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .peek-error {
        padding: 15px;
        color: #ff4d4d;
        font-size: 12px;
        text-align: center;
    }

    .peek-duel-rounds-button {
        position: absolute;
        top: 15px;
        left: 15px;
        z-index: 10005;
        width: 44px;
        height: 44px;
        background: rgba(34, 34, 34, 0.9);
        border: none;
        border-radius: 6px;
        cursor: pointer;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 6px;
        transition: all 0.2s;
        opacity:0.7;
    }

    .peek-duel-rounds-button:hover {
        background: rgba(50, 50, 50, 0.95);
        transform: scale(1.05);
    }

    .peek-duel-rounds-button.active {
        background: rgba(66, 133, 244, 0.9);
    }

    .peek-duel-rounds-panel {
        position: absolute;
        top: 0;
        left: -400px;
        width: 400px;
        height: 100%;
        background: rgba(28, 28, 30, 0.98);
        backdrop-filter: blur(10px);
        z-index: 10004;
        transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        opacity:0.9;
    }

    .peek-duel-rounds-panel.active {
        left: 0;
    }

    .peek-duel-rounds-content {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 15px;
        padding-top: 50px;
    }

    .peek-duel-game-header {
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .peek-duel-game-info {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
    }

    .peek-duel-game-info * {
        position: static !important;
        transform: none !important;
        left: auto !important;
        top: auto !important;
        right: auto !important;
        bottom: auto !important;
    }

    .peek-duel-game-info [class*="game-mode-brand_selected"] {
        margin: 0;
    }

    .peek-duel-game-info [class*="game-mode-brand_mapName"] {
        font-size: 14px;
        opacity: 0.8;
        margin: 0;
    }

    .peek-duel-rounds-list {
        transform: scale(0.85);
        transform-origin: top left;
        width: 117.65%;
        margin-bottom: -70%;
    }

    .peek-duel-rounds-content [class*="game-summary_playedRound"] {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 6px;
        margin-bottom: 8px;
        transition: background 0.2s;
        cursor: pointer;
        font-size: 0.75em;
    }

    .peek-duel-rounds-content [class*="game-summary_playedRound"]:hover {
        background: rgba(255, 255, 255, 0.08);
    }

    .peek-duel-rounds-content [class*="game-summary_selectedRound"] {
        background: rgba(66, 133, 244, 0.3) !important;
        border-left: 3px solid rgba(66, 133, 244, 0.9);
    }

    .peek-duel-rounds-close {
        position: absolute;
        top: 15px;
        right: 20px;
        width: 28px;
        height: 28px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 50%;
        color: #ffffff;
        font-size: 20px;
        line-height: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        z-index: 10;
    }

    .peek-duel-rounds-close:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: rotate(90deg);
    }

    .peek-duel-rounds-pin {
        position: absolute;
        top: 15px;
        right: 64px;
        width: 28px;
        height: 28px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 50%;
        color: #ffffff;
        font-size: 20px;
        line-height: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        z-index: 10;
    }

    .peek-duel-rounds-pin.active {
        color:#97e851;
        transform: rotate(90deg);
    }

    .peek-duel-rounds-pin:hover {
        background: rgba(255, 255, 255, 0.3);
        color:#97e851;
        transform: rotate(90deg);
    }

    .peek-round-indicator {
        position: absolute;
        top: 15px;
        right: 50%;
        z-index: 10003;
        background: linear-gradient(135deg, rgba(121, 80, 229, 0.95) 0%, rgba(74, 35, 153, 0.95) 100%);
        backdrop-filter: blur(10px);
        color: rgb(255, 255, 255);
        padding: 0.5rem 1.25rem;
        border-radius: 6px;
        font-family: 'ggFont', sans-serif;
        font-size: 1rem;
        line-height: 1.25rem;
        font-weight: 700;
        font-style: italic;
        box-shadow: 0 0.375rem 0.625rem rgb(26 26 26/30%), 0 0.125rem 1.25rem 0 rgb(26 26 26/20%);
        border: 1px solid rgba(166, 133, 255, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        user-select: none;
    }

    .peek-round-indicator:hover {
        transform: translateY(-2px);
        box-shadow: 0 0.5rem 1rem rgb(26 26 26/40%), 0 0.25rem 1.5rem 0 rgb(26 26 26/30%);
    }

    @media (max-width: 768px) {
        .peek-duel-rounds-panel {
            width: 100%;
            left: -100%;
        }

        .peek-duel-rounds-panel.active {
            left: 0;
        }

        .peek-round-indicator {
            top: 10px;
            right: 10px;
            padding: 0.4rem 1rem;
            font-size: 0.875rem;
            line-height: 1rem;
        }
    }

        @keyframes snakeBorderTop {
            0% { left: -100%; }
            50%, 100% { left: 100%; }
        }

        @keyframes snakeBorderRight {
            0% { top: -100%; }
            50%, 100% { top: 100%; }
        }

        @keyframes snakeBorderBottom {
            0% { right: -100%; }
            50%, 100% { right: 100%; }
        }

        @keyframes snakeBorderLeft {
            0% { bottom: -100%; }
            50%, 100% { bottom: 100%; }
        }

        [class^="result-list_listWrapper"] {
            pointer-events: auto !important;
            z-index: 1000 !important;
        }

        [class*="result-list_listItemWrapper"] {
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            pointer-events: auto !important;
            overflow: hidden;
        }

        [class*="result-list_listItemWrapper"]:hover {
            transform: scale(1.2);
            box-shadow: 0 8px 16px rgba(255, 198, 40, 0.3);
        }

        [class*="result-list_listItemWrapper"]:active {
            transform: scale(1.15);
            box-shadow: 0 4px 8px rgba(255, 198, 40, 0.2);
        }

        [class*="result-list_listItemWrapper"] .snake-border-top,
        [class*="result-list_listItemWrapper"] .snake-border-right,
        [class*="result-list_listItemWrapper"] .snake-border-bottom,
        [class*="result-list_listItemWrapper"] .snake-border-left {
            position: absolute;
            display: none;
            animation-play-state: paused;
        }

        [class*="result-list_listItemWrapper"] .snake-border-top {
            top: 0;
            left: -100%;
            width: 100%;
            height: 2px;
            background-image: linear-gradient(90deg, transparent, #ffc628);
            animation: snakeBorderTop 1.5s linear infinite;
        }

        [class*="result-list_listItemWrapper"] .snake-border-right {
            top: -100%;
            right: 0;
            width: 2px;
            height: 100%;
            background-image: linear-gradient(180deg, transparent, #ffc628);
            animation: snakeBorderRight 1.5s linear 0.375s infinite;
        }

        [class*="result-list_listItemWrapper"] .snake-border-bottom {
            bottom: 0;
            right: -100%;
            width: 100%;
            height: 2px;
            background-image: linear-gradient(270deg, transparent, #ffc628);
            animation: snakeBorderBottom 1.5s linear 0.75s infinite;
        }

        [class*="result-list_listItemWrapper"] .snake-border-left {
            bottom: -100%;
            left: 0;
            width: 2px;
            height: 100%;
            background-image: linear-gradient(360deg, transparent, #ffc628);
            animation: snakeBorderLeft 1.5s linear 1.125s infinite;
        }

        [class*="result-list_listItemWrapper"].show-border .snake-border-top,
        [class*="result-list_listItemWrapper"].show-border .snake-border-right,
        [class*="result-list_listItemWrapper"].show-border .snake-border-bottom,
        [class*="result-list_listItemWrapper"].show-border .snake-border-left {
            display: block;
            animation-play-state: running;
        }

        [class*="result-list_roundNumber"],
        [class*="result-list_points"],
        [class*="result-list_roundInfo"] {
            transition: color 0.3s ease;
            pointer-events: auto !important;
        }

        [class*="result-list_listItemWrapper"]:hover [class*="result-list_roundNumber"],
        [class*="result-list_listItemWrapper"]:hover [class*="result-list_points"],
    `)
}

main();