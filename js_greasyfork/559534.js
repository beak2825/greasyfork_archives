// ==UserScript==
// @name         ✈️ Travel HUD Mini (Colour Coded + Points Value)
// @namespace    http://tampermonkey.net/
// @version      3.3.1
// @description  Compact travel points tracker with colour coding, flags, API key setup, and points value estimation.
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559534/%E2%9C%88%EF%B8%8F%20Travel%20HUD%20Mini%20%28Colour%20Coded%20%2B%20Points%20Value%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559534/%E2%9C%88%EF%B8%8F%20Travel%20HUD%20Mini%20%28Colour%20Coded%20%2B%20Points%20Value%29.meta.js
// ==/UserScript==

(function () {
'use strict';

/* ================= CONFIG ================= */
const PANEL_ID = 'travel_mini_hud';
const TOGGLE_ID = 'travel_mini_toggle';
const API_PANEL_ID = 'travel_api_panel';
const POLL = 45000;
const PRE_PTS=25, FLO_PTS=10, PLU_PTS=10, MET_PTS=15, FOS_PTS=20;

// Points Market Configuration
const POINTS_ENDPOINT = 'https://api.torn.com/v2/market/pointsmarket';
let currentPointsPrice = 0;
let pointsPriceCache = { time: 0, price: 0, history: [] };
const POINTS_CACHE_DURATION = 300000; // 5 minutes
const POINTS_HISTORY_SIZE = 5; // Keep last 5 prices for averaging

// Colour coding thresholds
const PLUSHIE_THRESHOLD = 2000;
const FLOWER_THRESHOLD = 5000;

/* ================= DATA ================= */
const GROUPS = {
 Prehistoric:{
  pts:PRE_PTS,
  items:{
   "Quartz Point":{s:"Q",loc:"CA 🇨🇦",color:"#87CEEB"},
   "Chalcedony Point":{s:"CH",loc:"AR 🇦🇷",color:"#9ACD32"},
   "Basalt Point":{s:"B",loc:"HW 🏝️",color:"#4682B4"},
   "Quartzite Point":{s:"QZ",loc:"SA 🇿🇦",color:"#5F9EA0"},
   "Chert Point":{s:"CT",loc:"UK 🇬🇧",color:"#708090"},
   "Obsidian Point":{s:"O",loc:"MX 🇲🇽",color:"#00008B"}
  }
 },
 Flowers:{
  pts:FLO_PTS,
  items:{
   "Dahlia":{s:"DH",loc:"MX 🇲🇽",color:"#FF69B4"},
   "Orchid":{s:"OR",loc:"HW 🏝️",color:"#DA70D6"},
   "African Violet":{s:"V",loc:"SA 🇿🇦",color:"#EE82EE"},
   "Cherry Blossom":{s:"CB",loc:"JP 🇯🇵",color:"#FFB6C1"},
   "Peony":{s:"P",loc:"CN 🇨🇳",color:"#FF1493"},
   "Ceibo Flower":{s:"CE",loc:"AR 🇦🇷",color:"#DC143C"},
   "Edelweiss":{s:"E",loc:"CH 🇨🇭",color:"#F0FFF0"},
   "Crocus":{s:"CR",loc:"CA 🇨🇦",color:"#9370DB"},
   "Heather":{s:"H",loc:"UK 🇬🇧",color:"#DDA0DD"},
   "Tribulus Omanense":{s:"T",loc:"AE 🇦🇪",color:"#FFD700"},
   "Banana Orchid":{s:"BO",loc:"KY 🇰🇾",color:"#FFFF00"}
  }
 },
 Plushies:{
  pts:PLU_PTS,
  items:{
   "Sheep Plushie":{s:"SH",loc:"B.B",color:"#FFFFFF"},
   "Teddy Bear Plushie":{s:"TB",loc:"B.B",color:"#8B4513"},
   "Kitten Plushie":{s:"KT",loc:"B.B",color:"#696969"},
   "Jaguar Plushie":{s:"J",loc:"MX 🇲🇽",color:"#FF8C00"},
   "Wolverine Plushie":{s:"W",loc:"CA 🇨🇦",color:"#A0522D"},
   "Nessie Plushie":{s:"N",loc:"UK 🇬🇧",color:"#008080"},
   "Red Fox Plushie":{s:"F",loc:"UK 🇬🇧",color:"#FF4500"},
   "Monkey Plushie":{s:"M",loc:"AR 🇦🇷",color:"#D2691E"},
   "Chamois Plushie":{s:"CM",loc:"CH 🇨🇭",color:"#DEB887"},
   "Panda Plushie":{s:"PD",loc:"CN 🇨🇳",color:"#000000"},
   "Lion Plushie":{s:"L",loc:"SA 🇿🇦",color:"#FFD700"},
   "Camel Plushie":{s:"CA",loc:"AE 🇦🇪",color:"#F4A460"},
   "Stingray Plushie":{s:"SR",loc:"KY 🇰🇾",color:"#2F4F4F"}
  }
 }
};

/* ================= API KEY PANEL STYLES ================= */
GM_addStyle(`
/* API Key Panel */
#${API_PANEL_ID} {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 320px;
    background: linear-gradient(145deg, rgba(20, 25, 40, 0.98), rgba(10, 15, 25, 0.97));
    color: #e0f0ff;
    font: 12px 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
    border: 1px solid rgba(64, 156, 255, 0.3);
    border-radius: 12px;
    z-index: 1000001;
    box-shadow: 
        inset 0 0 30px rgba(64, 156, 255, 0.1),
        0 10px 40px rgba(0, 0, 0, 0.7),
        0 0 50px rgba(64, 156, 255, 0.2);
    backdrop-filter: blur(10px);
    overflow: hidden;
    animation: fadeSlide 0.4s ease-out;
}

#${API_PANEL_ID} .api-header {
    padding: 16px;
    font-weight: 600;
    background: linear-gradient(90deg, rgba(64, 156, 255, 0.2), transparent);
    color: #64b4ff;
    border-bottom: 1px solid rgba(64, 156, 255, 0.2);
    font-size: 13px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;
}

#${API_PANEL_ID} .api-header::before {
    content: '🔑';
    font-size: 14px;
}

#${API_PANEL_ID} .api-content {
    padding: 16px;
}

#${API_PANEL_ID} .api-input-group {
    margin-bottom: 16px;
}

#${API_PANEL_ID} .api-label {
    display: block;
    margin-bottom: 6px;
    color: #88ccff;
    font-weight: 600;
    font-size: 11px;
}

#${API_PANEL_ID} .api-input {
    width: 100%;
    padding: 10px 12px;
    background: rgba(30, 40, 55, 0.8);
    border: 1px solid rgba(64, 156, 255, 0.3);
    border-radius: 6px;
    color: #ffffff;
    font-size: 12px;
    font-family: 'Consolas', 'Monaco', monospace;
    transition: all 0.2s ease;
}

#${API_PANEL_ID} .api-input:focus {
    outline: none;
    border-color: #64b4ff;
    box-shadow: 0 0 0 2px rgba(100, 180, 255, 0.2);
    background: rgba(40, 50, 65, 0.9);
}

#${API_PANEL_ID} .api-note {
    background: rgba(255, 165, 0, 0.1);
    border-left: 3px solid rgba(255, 165, 0, 0.6);
    padding: 10px 12px;
    margin: 12px 0;
    border-radius: 4px;
    font-size: 10.5px;
    color: #ffcc88;
    line-height: 1.4;
}

#${API_PANEL_ID} .api-note strong {
    color: #ffaa00;
    font-weight: 700;
}

#${API_PANEL_ID} .api-buttons {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

#${API_PANEL_ID} .api-button {
    flex: 1;
    padding: 10px;
    background: linear-gradient(145deg, #2a3b52, #152438);
    border: 1px solid rgba(64, 156, 255, 0.4);
    border-radius: 6px;
    color: #64b4ff;
    font-weight: 600;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
}

#${API_PANEL_ID} .api-button:hover {
    background: linear-gradient(145deg, #3a4b62, #253448);
    border-color: rgba(100, 180, 255, 0.6);
    color: #88ccff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

#${API_PANEL_ID} .api-button.primary {
    background: linear-gradient(145deg, #1a5ca3, #0d3d7a);
    border-color: rgba(64, 156, 255, 0.6);
    color: #ffffff;
}

#${API_PANEL_ID} .api-button.primary:hover {
    background: linear-gradient(145deg, #2a6cb3, #1d4d8a);
    border-color: rgba(100, 180, 255, 0.8);
}

/* API Panel Backdrop */
.api-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(3px);
    z-index: 1000000;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
`);

/* ================= EXISTING STYLES (Keep all existing styles) ================= */
GM_addStyle(`
/* Animation keyframes */
@keyframes fadeSlide {
    from { opacity: 0; transform: translateX(20px) scale(0.95); }
    to { opacity: 1; transform: translateX(0) scale(1); }
}

@keyframes gentlePulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
}

@keyframes subtleFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
}

@keyframes highlightPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.4); }
    50% { box-shadow: 0 0 0 3px rgba(0, 255, 0, 0); }
}

@keyframes warningPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255, 165, 0, 0.4); }
    50% { box-shadow: 0 0 0 3px rgba(255, 165, 0, 0); }
}

@keyframes dangerPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4); }
    50% { box-shadow: 0 0 0 3px rgba(255, 0, 0, 0); }
}

/* Points Tooltip */
.points-tooltip {
    position: relative;
    cursor: help;
}

.points-tooltip::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(20, 25, 40, 0.95);
    color: #88ccff;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 10px;
    white-space: pre-line;
    border: 1px solid rgba(64, 156, 255, 0.4);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s;
    z-index: 100000;
    pointer-events: none;
    min-width: 200px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
}

.points-tooltip:hover::after {
    opacity: 1;
    visibility: visible;
}

/* Toggle Button */
#${TOGGLE_ID} {
    position: fixed;
    right: 6px;
    top: 70px;
    width: 36px;
    height: 36px;
    background: linear-gradient(145deg, #1e2b3d, #0d1725);
    border: 1px solid rgba(64, 156, 255, 0.3);
    border-radius: 8px;
    color: #409cff;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1000000;
    box-shadow: 
        0 2px 8px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    backdrop-filter: blur(4px);
    font-weight: 600;
    text-shadow: 0 0 6px rgba(64, 156, 255, 0.5);
}

#${TOGGLE_ID}:hover {
    background: linear-gradient(145deg, #2a3b52, #152438);
    border-color: rgba(100, 180, 255, 0.5);
    color: #64b4ff;
    transform: scale(1.08);
    box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.4),
        0 0 20px rgba(64, 156, 255, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

#${TOGGLE_ID}:active {
    transform: scale(0.95);
    transition: transform 0.1s;
}

/* Panel */
#${PANEL_ID} {
    position: fixed;
    right: 6px;
    top: 70px;
    width: 0;
    height: auto;
    max-height: 60vh;
    background: linear-gradient(145deg, rgba(15, 20, 30, 0.98), rgba(8, 12, 20, 0.97));
    color: #e0f0ff;
    font: 10px 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
    border: 1px solid rgba(64, 156, 255, 0.2);
    border-radius: 10px 0 0 10px;
    z-index: 999999;
    display: flex;
    flex-direction: column;
    box-shadow: 
        inset 0 0 20px rgba(64, 156, 255, 0.05),
        0 4px 20px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    overflow: hidden;
    transition: 
        width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        opacity 0.2s ease;
    opacity: 0;
    transform: translateX(10px);
    border-right: none;
}

#${PANEL_ID}.open {
    width: 220px;
    opacity: 1;
    transform: translateX(0);
    border-right: 1px solid rgba(64, 156, 255, 0.2);
    border-radius: 10px;
    animation: fadeSlide 0.3s ease-out;
}

/* Grid background */
#${PANEL_ID}::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
        linear-gradient(rgba(64, 156, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(64, 156, 255, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
    background-position: 0 0;
    opacity: 0.3;
    z-index: 0;
}

/* Header */
#${PANEL_ID} .h {
    padding: 8px 12px;
    font-weight: 600;
    background: linear-gradient(90deg, rgba(64, 156, 255, 0.15), transparent);
    color: #64b4ff;
    border-bottom: 1px solid rgba(64, 156, 255, 0.15);
    display: flex;
    align-items: center;
    gap: 6px;
    position: relative;
    z-index: 1;
    font-size: 10px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}

#${PANEL_ID} .h::before {
    content: '✈';
    font-size: 12px;
    opacity: 0.8;
    animation: subtleFloat 3s ease-in-out infinite;
}

/* Summary */
#${PANEL_ID} .s {
    padding: 6px 12px;
    background: rgba(25, 35, 50, 0.7);
    font-weight: 700;
    color: #4dabff;
    text-align: center;
    border-bottom: 1px solid rgba(64, 156, 255, 0.1);
    position: relative;
    z-index: 1;
    font-size: 10px;
    backdrop-filter: blur(2px);
    transition: all 0.2s ease;
}

#${PANEL_ID} .s:hover {
    background: rgba(30, 40, 55, 0.8);
    color: #64b4ff;
}

/* Body */
#${PANEL_ID} .b {
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    z-index: 1;
    background: transparent;
    flex: 1;
    max-height: calc(60vh - 50px);
    scrollbar-width: thin;
    scrollbar-color: rgba(64, 156, 255, 0.5) rgba(25, 35, 50, 0.2);
}

#${PANEL_ID} .b::-webkit-scrollbar {
    width: 4px;
}

#${PANEL_ID} .b::-webkit-scrollbar-track {
    background: rgba(25, 35, 50, 0.2);
    border-radius: 2px;
}

#${PANEL_ID} .b::-webkit-scrollbar-thumb {
    background: rgba(64, 156, 255, 0.5);
    border-radius: 2px;
    border: none;
}

#${PANEL_ID} .b::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 180, 255, 0.7);
}

/* Warning Alerts */
#${PANEL_ID} .a {
    background: rgba(255, 75, 75, 0.1);
    border-left: 2px solid rgba(255, 100, 100, 0.6);
    margin: 4px 8px;
    padding: 4px 8px 4px 20px;
    font-weight: 600;
    border-radius: 4px;
    color: #ff8888;
    position: relative;
    font-size: 9px;
    line-height: 1.2;
    transition: all 0.2s ease;
}

#${PANEL_ID} .a:hover {
    transform: translateX(2px);
    background: rgba(255, 75, 75, 0.15);
}

#${PANEL_ID} .a::before {
    content: '!';
    position: absolute;
    left: 6px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 10px;
    font-weight: 900;
    opacity: 0.8;
}

/* Category Titles */
#${PANEL_ID} .t {
    padding: 5px 12px;
    background: rgba(64, 156, 255, 0.08);
    color: #88ccff;
    font-weight: 600;
    border-top: 1px solid rgba(64, 156, 255, 0.1);
    border-bottom: 1px solid rgba(64, 156, 255, 0.05);
    position: relative;
    font-size: 9px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    backdrop-filter: blur(2px);
}

#${PANEL_ID} .t::after {
    content: '';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    background: rgba(64, 156, 255, 0.4);
    border-radius: 50%;
}

/* Rows - Colour Coded Grid */
#${PANEL_ID} .r {
    padding: 3px 12px;
    display: grid;
    grid-template-columns: 25px 35px 35px auto;
    gap: 8px;
    align-items: center;
    transition: all 0.15s ease;
    position: relative;
    font-size: 9.5px;
    min-height: 22px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.02);
}

#${PANEL_ID} .r:hover {
    background: rgba(64, 156, 255, 0.05);
}

#${PANEL_ID} .r:nth-child(even) {
    background: rgba(30, 40, 55, 0.1);
}

#${PANEL_ID} .r span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 1px 4px;
    border-radius: 3px;
    transition: all 0.2s ease;
}

/* Column styling with colour coding */
#${PANEL_ID} .r span:nth-child(1) {
    color: var(--item-color, #c0e0ff);
    font-weight: 700;
    font-size: 9px;
    text-align: center;
    background: rgba(var(--item-r, 64), var(--item-g, 156), var(--item-b, 255), 0.08);
    border: 1px solid rgba(var(--item-r, 64), var(--item-g, 156), var(--item-b, 255), 0.1);
    font-family: 'Consolas', 'Monaco', monospace;
}

#${PANEL_ID} .r:hover span:nth-child(1) {
    background: rgba(var(--item-r, 64), var(--item-g, 156), var(--item-b, 255), 0.15);
    border-color: rgba(var(--item-r, 64), var(--item-g, 156), var(--item-b, 255), 0.2);
}

/* Abroad items colour coding */
#${PANEL_ID} .r span:nth-child(3) {
    font-family: 'Consolas', 'Monaco', monospace;
    text-align: center;
    border: 1px solid;
    font-weight: 700;
    transition: all 0.3s ease;
}

/* Green status - Above threshold */
#${PANEL_ID} .r span.status-green {
    color: #00ff00 !important;
    background: rgba(0, 255, 0, 0.12) !important;
    border-color: rgba(0, 255, 0, 0.3) !important;
    animation: highlightPulse 2s ease-in-out infinite;
    text-shadow: 0 0 4px rgba(0, 255, 0, 0.5);
}

/* Orange status - Below threshold */
#${PANEL_ID} .r span.status-orange {
    color: #ffa500 !important;
    background: rgba(255, 165, 0, 0.12) !important;
    border-color: rgba(255, 165, 0, 0.3) !important;
    animation: warningPulse 2s ease-in-out infinite;
    text-shadow: 0 0 4px rgba(255, 165, 0, 0.5);
}

/* Red status - Zero */
#${PANEL_ID} .r span.status-red {
    color: #ff0000 !important;
    background: rgba(255, 0, 0, 0.12) !important;
    border-color: rgba(255, 0, 0, 0.3) !important;
    animation: dangerPulse 2s ease-in-out infinite;
    text-shadow: 0 0 4px rgba(255, 0, 0, 0.5);
}

/* Normal abroad count (no status) */
#${PANEL_ID} .r span:nth-child(3):not([class*="status-"]) {
    color: #ffa0a0;
    background: rgba(255, 160, 160, 0.08);
    border: 1px solid rgba(255, 160, 160, 0.1);
}

#${PANEL_ID} .r:hover span:nth-child(3):not([class*="status-"]) {
    background: rgba(255, 160, 160, 0.12);
    border-color: rgba(255, 160, 160, 0.2);
}

/* Local count - NOW SHOWING REMAINING */
#${PANEL_ID} .r span:nth-child(2) {
    color: #7fff7f;
    background: rgba(127, 255, 127, 0.08);
    font-weight: 700;
    text-align: center;
    border: 1px solid rgba(127, 255, 127, 0.1);
    font-family: 'Consolas', 'Monaco', monospace;
}

#${PANEL_ID} .r:hover span:nth-child(2) {
    background: rgba(127, 255, 127, 0.12);
    border-color: rgba(127, 255, 127, 0.2);
}

/* Location with flag */
#${PANEL_ID} .r span:nth-child(4) {
    color: #88ccff;
    background: rgba(136, 204, 255, 0.08);
    text-align: center;
    font-weight: 600;
    font-size: 9px;
    border: 1px solid rgba(136, 204, 255, 0.1);
    padding: 1px 6px;
}

#${PANEL_ID} .r:hover span:nth-child(4) {
    background: rgba(136, 204, 255, 0.12);
    border-color: rgba(136, 204, 255, 0.2);
}

/* Loading state */
#${PANEL_ID} .loading {
    background: linear-gradient(90deg, transparent, rgba(64, 156, 255, 0.1), transparent);
    background-size: 200% 100%;
    animation: gentlePulse 1.5s ease-in-out infinite;
}

/* Compact layout for meteorite/fossil */
#${PANEL_ID} .special-row {
    grid-template-columns: 40px 35px 35px auto !important;
}

#${PANEL_ID} .special-row span:nth-child(1) {
    font-size: 8.5px;
    padding: 1px 2px;
}

/* Responsive */
@media (max-height: 600px) {
    #${PANEL_ID} {
        max-height: 70vh;
    }
    #${PANEL_ID} .b {
        max-height: calc(70vh - 50px);
    }
    #${PANEL_ID} .r {
        padding: 2px 10px;
        min-height: 20px;
        gap: 6px;
    }
}

/* Smooth scroll sync */
.scrolling-smooth {
    transition: top 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
`);

/* ================= CREATE API KEY PANEL ================= */
function createApiPanel() {
    // Check if API key already exists
    const existingApiKey = GM_getValue('tornAPIKey');
    
    // Don't show panel if API key already exists
    if (existingApiKey) return;
    
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'api-backdrop';
    
    // Create API panel
    const apiPanel = document.createElement('div');
    apiPanel.id = API_PANEL_ID;
    apiPanel.innerHTML = `
        <div class="api-header">🔑 API KEY REQUIRED</div>
        <div class="api-content">
            <div class="api-input-group">
                <label class="api-label" for="torn-api-key">Torn API Key:</label>
                <input type="text" 
                       id="torn-api-key" 
                       class="api-input" 
                       placeholder="Enter your limited API key..."
                       maxlength="16">
            </div>
            
            <div class="api-note">
                <strong>⚠️ SECURITY NOTE:</strong><br>
                Use a <strong>LIMITED API KEY</strong> with only <strong>DISPLAY</strong> access.<br>
                This script only needs to read your displayed items - no other permissions needed.<br>
                <em>Create key at: <strong>Torn.com → Settings → API</strong></em>
            </div>
            
            <div class="api-buttons">
                <button class="api-button" id="save-api-key">Save API Key</button>
                <button class="api-button primary" id="skip-api">Skip (Limited Mode)</button>
            </div>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(backdrop);
    document.body.appendChild(apiPanel);
    
    // Event listeners
    const saveButton = apiPanel.querySelector('#save-api-key');
    const skipButton = apiPanel.querySelector('#skip-api');
    const apiInput = apiPanel.querySelector('#torn-api-key');
    
    // Auto-focus input
    setTimeout(() => apiInput.focus(), 100);
    
    // Save API key
    saveButton.onclick = () => {
        const apiKey = apiInput.value.trim();
        if (!apiKey) {
            apiInput.style.borderColor = '#ff4444';
            apiInput.style.boxShadow = '0 0 0 2px rgba(255, 68, 68, 0.2)';
            setTimeout(() => {
                apiInput.style.borderColor = '';
                apiInput.style.boxShadow = '';
            }, 1000);
            return;
        }
        
        // Validate API key format (Torn API keys are 16 chars)
        if (apiKey.length !== 16) {
            alert('Invalid API key format. Torn API keys are exactly 16 characters long.');
            return;
        }
        
        // Save the API key
        GM_setValue('tornAPIKey', apiKey);
        
        // Remove panel
        document.body.removeChild(backdrop);
        document.body.removeChild(apiPanel);
        
        // Show success message and start tracker
        showNotification('API key saved successfully! Starting tracker...');
        setTimeout(() => {
            initializeTracker();
        }, 1000);
    };
    
    // Skip API key entry
    skipButton.onclick = () => {
        // Remove panel
        document.body.removeChild(backdrop);
        document.body.removeChild(apiPanel);
        
        // Show message about limited functionality
        showNotification('Running in limited mode. Add API key later via toggle right-click.');
        
        // Start tracker anyway (will show API missing message)
        initializeTracker();
    };
    
    // Allow Enter key to save
    apiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveButton.click();
        }
    });
    
    // Close on backdrop click
    backdrop.onclick = (e) => {
        if (e.target === backdrop) {
            document.body.removeChild(backdrop);
            document.body.removeChild(apiPanel);
            initializeTracker(); // Start without API
        }
    };
}

/* ================= NOTIFICATION FUNCTION ================= */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(145deg, #2a3b52, #152438);
        color: #88ccff;
        padding: 12px 20px;
        border-radius: 8px;
        border: 1px solid rgba(64, 156, 255, 0.4);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
        z-index: 1000002;
        font-size: 12px;
        font-weight: 600;
        backdrop-filter: blur(8px);
        animation: fadeSlide 0.3s ease-out;
        text-align: center;
        max-width: 300px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 3000);
}

/* ================= CREATE MAIN ELEMENTS ================= */
function createMainElements() {
    // Create toggle
    const toggle = document.createElement('div');
    toggle.id = TOGGLE_ID;
    toggle.innerHTML = '✈';
    toggle.title = 'Travel Tracker - Right click to manage API key';
    
    // Add right-click for API management
    toggle.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showApiManagementMenu();
    });
    
    // Create panel
    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.innerHTML = `
    <div class="h">TRAVEL TRACKER</div>
    <div class="s">API KEY NEEDED</div>
    <div class="b"></div>
    `;
    
    // Add to page
    document.body.appendChild(toggle);
    document.body.appendChild(panel);
    
    return { toggle, panel };
}

/* ================= API MANAGEMENT MENU ================= */
function showApiManagementMenu() {
    // Remove existing menu if present
    const existingMenu = document.getElementById('api-management-menu');
    if (existingMenu) document.body.removeChild(existingMenu);
    
    const menu = document.createElement('div');
    menu.id = 'api-management-menu';
    menu.style.cssText = `
        position: fixed;
        background: linear-gradient(145deg, rgba(20, 25, 40, 0.98), rgba(10, 15, 25, 0.97));
        border: 1px solid rgba(64, 156, 255, 0.3);
        border-radius: 8px;
        padding: 8px 0;
        min-width: 180px;
        z-index: 1000003;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.7);
        animation: fadeSlide 0.2s ease;
    `;
    
    const currentKey = GM_getValue('tornAPIKey');
    
    menu.innerHTML = `
        <div style="padding: 8px 12px; font-size: 11px; color: #88ccff; border-bottom: 1px solid rgba(64, 156, 255, 0.2);">
            API Key Management
        </div>
        ${currentKey ? `
            <div class="menu-item" data-action="view">View Current Key</div>
            <div class="menu-item" data-action="change">Change API Key</div>
            <div class="menu-item" data-action="remove">Remove API Key</div>
        ` : `
            <div class="menu-item" data-action="add">Add API Key</div>
        `}
        <div class="menu-item" data-action="help">API Key Help</div>
    `;
    
    // Add menu item styles
    GM_addStyle(`
        .menu-item {
            padding: 8px 12px;
            font-size: 11px;
            color: #c0e0ff;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .menu-item:hover {
            background: rgba(64, 156, 255, 0.15);
            color: #ffffff;
        }
    `);
    
    // Position near toggle
    const toggle = document.getElementById(TOGGLE_ID);
    const toggleRect = toggle.getBoundingClientRect();
    menu.style.top = toggleRect.bottom + 5 + 'px';
    menu.style.right = (window.innerWidth - toggleRect.right) + 'px';
    
    document.body.appendChild(menu);
    
    // Event delegation for menu items
    menu.addEventListener('click', (e) => {
        if (!e.target.classList.contains('menu-item')) return;
        
        const action = e.target.dataset.action;
        document.body.removeChild(menu);
        
        switch(action) {
            case 'view':
                if (currentKey) {
                    alert(`Current API Key: ${currentKey}\n\nKey ends with: ...${currentKey.slice(-4)}`);
                }
                break;
            case 'change':
            case 'add':
                createApiPanel();
                break;
            case 'remove':
                if (confirm('Are you sure you want to remove the API key?\n\nThe tracker will work in limited mode.')) {
                    GM_setValue('tornAPIKey', '');
                    showNotification('API key removed. Please refresh the page.');
                }
                break;
            case 'help':
                alert(`🔑 API KEY SETUP GUIDE:

1. Go to Torn.com → Settings → API
2. Click "Create New Key"
3. Set PERMISSIONS:
   • Select ONLY "Display" checkbox
   • Uncheck ALL other permissions
4. Copy the 16-character API key
5. Paste it into the Travel Tracker

⚠️ SECURITY: Only use LIMITED keys with DISPLAY access!
This script only needs to read your displayed items.`);
                break;
        }
    });
    
    // Close menu when clicking elsewhere
    setTimeout(() => {
        const closeMenu = (e) => {
            if (!menu.contains(e.target) && e.target.id !== TOGGLE_ID) {
                document.body.removeChild(menu);
                document.removeEventListener('click', closeMenu);
            }
        };
        document.addEventListener('click', closeMenu);
    }, 100);
}

/* ================= GLOBAL VARIABLES ================= */
let toggle, panel, sum, body, isPanelOpen = false;

/* ================= INITIALIZE TRACKER ================= */
function initializeTracker() {
    const elements = createMainElements();
    toggle = elements.toggle;
    panel = elements.panel;
    sum = panel.querySelector('.s');
    body = panel.querySelector('.b');
    
    setupToggleFunctionality();
    setupScrollSync();
    
    // Check if we have API key and start rendering
    const apiKey = GM_getValue('tornAPIKey');
    if (apiKey) {
        mainLoop();
    } else {
        // Show API missing message
        sum.textContent = 'API KEY REQUIRED';
        body.innerHTML = `
            <div style="padding: 20px 12px; text-align: center; color: #ff8888; font-size: 10px;">
                ⚠️ No API key configured.<br><br>
                <span style="color: #88ccff; font-size: 9px;">
                    Right-click the toggle button<br>
                    to add your API key.<br><br>
                    Only "Display" permission needed.
                </span>
            </div>
        `;
    }
}

/* ================= TOGGLE FUNCTIONALITY ================= */
function setupToggleFunctionality() {
    toggle.onclick = () => {
        isPanelOpen = !isPanelOpen;
        panel.classList.toggle('open', isPanelOpen);
        
        // Toggle animation
        toggle.style.transform = isPanelOpen ? 
            'translateX(-214px) scale(1.05)' : 
            'translateX(0) scale(1)';
        
        toggle.title = isPanelOpen ? 'Close Tracker' : 'Open Tracker';
        toggle.style.color = isPanelOpen ? '#88ccff' : '#409cff';
        
        if (isPanelOpen) {
            toggle.innerHTML = '×';
        } else {
            toggle.innerHTML = '✈';
        }
    };
}

/* ================= SMOOTH SCROLL SYNC ================= */
function setupScrollSync() {
    let lastScrollY = window.scrollY;
    let scrollAnimationFrame;
    
    function handleSmoothScroll() {
        const currentScrollY = window.scrollY;
        
        // Add smooth class during scroll
        if (!toggle.classList.contains('scrolling-smooth')) {
            toggle.classList.add('scrolling-smooth');
            panel.classList.add('scrolling-smooth');
        }
        
        // Calculate new position
        const newTop = 70 + (currentScrollY - lastScrollY) * 0.3;
        const boundedTop = Math.max(4, Math.min(newTop, window.innerHeight - 40));
        
        toggle.style.top = `${boundedTop}px`;
        panel.style.top = `${boundedTop}px`;
        
        lastScrollY = currentScrollY;
        
        // Remove smooth class after settling
        clearTimeout(scrollAnimationFrame);
        scrollAnimationFrame = setTimeout(() => {
            toggle.classList.remove('scrolling-smooth');
            panel.classList.remove('scrolling-smooth');
        }, 150);
    }
    
    // Optimized scroll handler
    let scrollThrottle;
    window.addEventListener('scroll', () => {
        if (scrollThrottle) return;
        scrollThrottle = requestAnimationFrame(() => {
            handleSmoothScroll();
            scrollThrottle = null;
        });
    });
    
    // Initial position
    handleSmoothScroll();
}

/* ================= FETCH FUNCTIONS ================= */
async function localItems() {
    const key = GM_getValue('tornAPIKey');
    if (!key) {
        throw new Error('No API key configured');
    }
    
    try {
        // Only request display data (not inventory) since we only need display permission
        const response = await fetch(`https://api.torn.com/user/?selections=display&key=${key}`).then(r => r.json());
        
        if (response.error) {
            throw new Error(response.error.error || 'API Error');
        }
        
        const items = {};
        // Only use display items since that's all we have permission for
        if (response.display) {
            response.display.forEach(item => {
                items[item.name] = (items[item.name] || 0) + item.quantity;
            });
        }
        
        return items;
    } catch (error) {
        console.error('Error fetching local items:', error);
        throw error;
    }
}

function gmJSON(url) {
    return new Promise(resolve => {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            onload: r => {
                try {
                    resolve(JSON.parse(r.responseText));
                } catch {
                    resolve({});
                }
            },
            onerror: () => resolve({})
        });
    });
}

async function abroadItems() {
    const [yataData, promData] = await Promise.all([
        gmJSON('https://yata.yt/api/v1/travel/export/'),
        gmJSON('https://api.prombot.co.uk/api/travel')
    ]);
    
    const abroadMap = {};
    
    // Process YATA data
    [yataData?.stocks, yataData].forEach(source => {
        Object.values(source || {}).forEach(country => {
            (country?.stocks || []).forEach(item => {
                abroadMap[item.name] = (abroadMap[item.name] || 0) + (item.quantity || item.qty || 0);
            });
        });
    });
    
    return abroadMap;
}

/* ================= POINTS MARKET PRICE FETCHER ================= */
async function fetchPointsPrice(apiKey) {
    const now = Date.now();
    
    // Return cached price if still valid
    if (pointsPriceCache.time && (now - pointsPriceCache.time) < POINTS_CACHE_DURATION) {
        return pointsPriceCache.price;
    }
    
    try {
        const response = await fetch(`${POINTS_ENDPOINT}?key=${apiKey}`);
        const data = await response.json();
        
        if (data.pointsmarket) {
            // Get all available listings
            const listings = Object.values(data.pointsmarket)
                .filter(listing => listing.quantity > 0) // Only listings with points available
                .map(listing => listing.cost)
                .sort((a, b) => a - b); // Sort cheapest first
            
            if (listings.length > 0) {
                // Calculate average of cheapest 5 listings for stable price
                const topListings = listings.slice(0, Math.min(5, listings.length));
                const avgPrice = Math.round(topListings.reduce((sum, price) => sum + price, 0) / topListings.length);
                
                // Update cache with history
                pointsPriceCache.history.push(avgPrice);
                if (pointsPriceCache.history.length > POINTS_HISTORY_SIZE) {
                    pointsPriceCache.history.shift();
                }
                
                // Calculate moving average if we have history
                const stablePrice = pointsPriceCache.history.length > 0 ?
                    Math.round(pointsPriceCache.history.reduce((sum, price) => sum + price, 0) / pointsPriceCache.history.length) :
                    avgPrice;
                
                pointsPriceCache = {
                    time: now,
                    price: stablePrice,
                    history: pointsPriceCache.history
                };
                
                currentPointsPrice = stablePrice;
                return stablePrice;
            }
        }
    } catch (error) {
        console.error('Error fetching points price:', error);
    }
    
    return currentPointsPrice || 0;
}

/* ================= CALCULATION LOGIC ================= */
function calcSet(inventory, items) {
    const values = Object.keys(items).map(key => inventory[key] || 0);
    const sets = values.length ? Math.min(...values) : 0;
    const remaining = {};
    Object.keys(items).forEach(key => {
        remaining[items[key].s] = (inventory[key] || 0) - sets;
    });
    return { sets, remaining };
}

function lowest(remaining, items) {
    const min = Math.min(...Object.values(remaining));
    const key = Object.keys(remaining).find(k => remaining[k] === min);
    const item = Object.values(items).find(i => i.s === key);
    return min >= 0 && item ? `Need ${key} → ${item.loc}` : null;
}

/* ================= GET STATUS CLASS FOR ABROAD ITEMS ================= */
function getStatusClass(itemName, abroadCount) {
    if (abroadCount === 0) {
        return 'status-red';
    }
    
    // Check if it's a plushie
    if (itemName.includes('Plushie')) {
        if (abroadCount >= PLUSHIE_THRESHOLD) {
            return 'status-green';
        } else {
            return 'status-orange';
        }
    }
    
    // Check if it's a flower
    const flowerItems = Object.keys(GROUPS.Flowers.items);
    if (flowerItems.some(flower => itemName.includes(flower.replace(/ .*/, '')))) {
        if (abroadCount >= FLOWER_THRESHOLD) {
            return 'status-green';
        } else {
            return 'status-orange';
        }
    }
    
    // For other items (prehistoric points, meteorite, fossil)
    // Use normal styling
    return '';
}

/* ================= HEX TO RGB HELPER ================= */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

/* ================= RENDER COLOUR CODED DISPLAY WITH POINTS VALUE ================= */
async function render() {
    try {
        sum.classList.add('loading');
        sum.textContent = 'UPDATING...';
        
        const inventory = await localItems();
        const abroad = await abroadItems();
        
        let totalSets = 0;
        let totalPoints = 0;
        let html = '';
        
        // Process groups with colour codes
        for (const [groupName, group] of Object.entries(GROUPS)) {
            const { sets, remaining } = calcSet(inventory, group.items);
            totalSets += sets;
            totalPoints += sets * group.pts;
            
            const warning = lowest(remaining, group.items);
            if (warning) {
                html += `<div class="a">${warning}</div>`;
            }
            
            // Add group title
            const groupTitle = groupName === 'Plushies' ? 'PLUSH' : 
                              groupName === 'Prehistoric' ? 'PREHIST' : 'FLOWERS';
            html += `<div class="t">${groupTitle}</div>`;
            
            // Calculate remaining for each item in the set
            const itemRemaining = {};
            Object.keys(group.items).forEach(key => {
                const shortCode = group.items[key].s;
                const localCount = inventory[key] || 0;
                itemRemaining[shortCode] = localCount - sets; // Remaining after sets
            });
            
            // Add rows with colour coding (showing only remaining)
            Object.entries(group.items).forEach(([name, data]) => {
                const abroadCount = abroad[name] || 0;
                const statusClass = getStatusClass(name, abroadCount);
                const rgb = hexToRgb(data.color);
                const remaining = itemRemaining[data.s];
                
                html += `
                <div class="r" style="
                    --item-color: ${data.color};
                    --item-r: ${rgb.r};
                    --item-g: ${rgb.g};
                    --item-b: ${rgb.b};
                ">
                    <span>${data.s}</span>
                    <span>${remaining}</span>
                    <span class="${statusClass}">${abroadCount}</span>
                    <span>${data.loc}</span>
                </div>`;
            });
        }
        
        // Add meteorite and fossil with colour coding
        const meteorite = inventory["Meteorite Fragment"] || 0;
        const fossil = inventory["Patagonian Fossil"] || 0;
        totalPoints += meteorite * MET_PTS + fossil * FOS_PTS;
        
        const meteorColor = "#FF4500";
        const fossilColor = "#8B4513";
        const meteorRgb = hexToRgb(meteorColor);
        const fossilRgb = hexToRgb(fossilColor);
        
        const meteorAbroad = abroad["Meteorite Fragment"] || 0;
        const fossilAbroad = abroad["Patagonian Fossil"] || 0;
        
        html += `
        <div class="t">SPECIAL</div>
        <div class="r special-row" style="
            --item-color: ${meteorColor};
            --item-r: ${meteorRgb.r};
            --item-g: ${meteorRgb.g};
            --item-b: ${meteorRgb.b};
        ">
            <span>METR</span>
            <span>${meteorite}</span>
            <span class="${getStatusClass('Meteorite Fragment', meteorAbroad)}">${meteorAbroad}</span>
            <span>AR 🇦🇷</span>
        </div>
        <div class="r special-row" style="
            --item-color: ${fossilColor};
            --item-r: ${fossilRgb.r};
            --item-g: ${fossilRgb.g};
            --item-b: ${fossilRgb.b};
        ">
            <span>FOSL</span>
            <span>${fossil}</span>
            <span class="${getStatusClass('Patagonian Fossil', fossilAbroad)}">${fossilAbroad}</span>
            <span>AR 🇦🇷</span>
        </div>`;
        
        // ========== POINTS VALUE CALCULATION ==========
        let pointsValue = 0;
        let pointsValueFormatted = '';
        const apiKey = GM_getValue('tornAPIKey');
        let pointsPrice = 0;
        
        if (apiKey && totalPoints > 0) {
            pointsPrice = await fetchPointsPrice(apiKey);
            if (pointsPrice > 0) {
                // CALCULATION: Total Points × Average Price
                pointsValue = totalPoints * pointsPrice;
                
                // Format for display
                if (pointsValue >= 1000000) {
                    pointsValueFormatted = `$${(pointsValue / 1000000).toFixed(1)}M`;
                } else if (pointsValue >= 1000) {
                    pointsValueFormatted = `$${Math.round(pointsValue / 1000)}k`;
                } else {
                    pointsValueFormatted = `$${pointsValue}`;
                }
                
                // Add tooltip with detailed info
                sum.classList.add('points-tooltip');
                sum.setAttribute('data-tooltip', 
                    `Total Points: ${totalPoints}\n` +
                    `Average Price per Point: $${pointsPrice.toLocaleString()}\n` +
                    `Total Value: $${pointsValue.toLocaleString()}`
                );
            }
        }
        // ========== END POINTS VALUE CALCULATION ==========
        
        // Update display
        sum.classList.remove('loading');
        if (pointsValueFormatted) {
            sum.innerHTML = `✈ ${totalSets} SETS • ${totalPoints} PTS • <span style="color:#7fff7f">${pointsValueFormatted}</span>`;
        } else {
            sum.textContent = `✈ ${totalSets} SETS • ${totalPoints} PTS`;
            sum.classList.remove('points-tooltip');
            sum.removeAttribute('data-tooltip');
        }
        
        body.innerHTML = html;
        body.scrollTop = 0;
        
    } catch (error) {
        // Handle API errors
        sum.classList.remove('loading');
        sum.textContent = 'API ERROR';
        body.innerHTML = `
            <div style="padding: 20px 12px; text-align: center; color: #ff8888; font-size: 10px;">
                ⚠️ Error: ${error.message}<br><br>
                <span style="color: #88ccff; font-size: 9px;">
                    Check your API key permissions.<br>
                    Only "Display" permission is needed.<br><br>
                    Right-click toggle to manage API key.
                </span>
            </div>
        `;
    }
}

/* ================= MAIN LOOP ================= */
async function mainLoop() {
    // Fetch points price in background (cached, won't spam API)
    const apiKey = GM_getValue('tornAPIKey');
    if (apiKey) {
        fetchPointsPrice(apiKey).catch(() => { /* Silent fail */ });
    }
    
    // Render the display
    await render();
    setTimeout(mainLoop, POLL);
}

/* ================= START EVERYTHING ================= */
// Check if API key exists and show panel if not
if (!GM_getValue('tornAPIKey')) {
    // Show API panel after a short delay
    setTimeout(createApiPanel, 1000);
} else {
    // Start tracker immediately if API key exists
    setTimeout(initializeTracker, 500);
}
})();