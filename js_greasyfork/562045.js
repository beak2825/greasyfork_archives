// ==UserScript==
// @name         Discord Universal Translator (Web) - Auto Translate & Widget
// @name:ru      Discord Universal Translator (Web) - Авто переводчик и виджет
// @namespace    http://tampermonkey.net/
// @version      8.1
// @description  Professional translation tool for Discord Web. Features LIFO queue, drag-and-drop widget, and multi-language support.
// @description:ru Продвинутый переводчик для веб-версии Discord. Поддерживает виджет, выбор языка и умную очередь.
// @author       MaximusGang
// @license      MIT
// @match        https://discord.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      translate.google.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562045/Discord%20Universal%20Translator%20%28Web%29%20-%20Auto%20Translate%20%20Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/562045/Discord%20Universal%20Translator%20%28Web%29%20-%20Auto%20Translate%20%20Widget.meta.js
// ==/UserScript==

/*
☕ Support the development (Donate):
  TON Address: UQB7aBx5qvgXlVCGvE3OX8i6FZbDbS-BpYwM2GU2oorJSmDB
*/

/*
MIT License
Copyright (c) 2026 MaximusGang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
*/

(function() {
'use strict';

// --- Configuration & Constants ---
const SUPPORTED_LANGUAGES = {
'ru': 'Russian', 'en': 'English', 'de': 'German', 'fr': 'French',
'es': 'Spanish', 'it': 'Italian', 'ja': 'Japanese', 'zh-CN': 'Chinese',
'uk': 'Ukrainian', 'pl': 'Polish', 'tr': 'Turkish', 'ko': 'Korean'
};

const UI_ICONS = {
loading: ' ⏳',
done: ' 🌐'
};

const state = {
enabled: GM_getValue('tr_enabled', true),
targetLang: GM_getValue('tr_lang', 'ru'),
posX: GM_getValue('tr_pos_x', 20),
posY: GM_getValue('tr_pos_y', 80),
queue: [],
activeRequests: 0,
maxConcurrent: 3,
requestDelay: 150,
cache: new Map()
};

// --- Style Injection ---
const injectStyles = () => {
const style = document.createElement('style');
style.textContent = `
#tr-widget {
position: fixed;
left: ${state.posX}px;
top: ${state.posY}px;
z-index: 10000;
background: #1e1f22;
border: 1px solid #313338;
border-radius: 12px;
padding: 8px;
display: flex;
flex-direction: column;
gap: 6px;
box-shadow: 0 8px 24px rgba(0,0,0,0.5);
cursor: move;
width: 140px;
font-family: 'gg sans', 'Noto Sans', sans-serif;
}
.tr-btn {
cursor: pointer;
flex: 1;
padding: 6px 0;
border-radius: 6px;
font-size: 11px;
font-weight: bold;
text-align: center;
color: #fff;
transition: background 0.2s;
border: none;
text-transform: uppercase;
}
.tr-btn-active { background: #23a55a; }
.tr-btn-inactive { background: #da373c; }
.tr-btn:hover { filter: brightness(1.1); }

.tr-select {
background: #313338;
color: #dbdee1;
border: 1px solid #1e1f22;
border-radius: 4px;
font-size: 11px;
padding: 4px;
width: 100%;
cursor: pointer;
outline: none;
}
.tr-icon-done {
opacity: 0.4;
margin-left: 4px;
cursor: help;
font-size: 0.9em;
display: inline-block;
vertical-align: middle;
}
.tr-icon-done:hover { opacity: 1; }
`;
document.head.appendChild(style);
};

// --- UI: Drag & Drop Implementation ---
const initDraggable = (el) => {
let offsetX, offsetY, isDragging = false;

el.addEventListener('mousedown', (e) => {
if (['SELECT', 'BUTTON', 'OPTION'].includes(e.target.tagName)) return;
isDragging = true;
offsetX = e.clientX - el.getBoundingClientRect().left;
offsetY = e.clientY - el.getBoundingClientRect().top;
el.style.transition = 'none';
});

document.addEventListener('mousemove', (e) => {
if (!isDragging) return;
const x = e.clientX - offsetX;
const y = e.clientY - offsetY;
el.style.left = `${x}px`;
el.style.top = `${y}px`;
});

document.addEventListener('mouseup', () => {
if (!isDragging) return;
isDragging = false;
GM_setValue('tr_pos_x', parseInt(el.style.left));
GM_setValue('tr_pos_y', parseInt(el.style.top));
});
};

// --- Translation Engine ---
const fetchTranslation = (text) => {
return new Promise((resolve) => {
const url = `https://translate.google.com/m?sl=auto&tl=${state.targetLang}&q=${encodeURIComponent(text)}`;
GM_xmlhttpRequest({
method: "GET",
url: url,
timeout: 5000,
onload: (res) => {
const doc = new DOMParser().parseFromString(res.responseText, "text/html");
const result = doc.querySelector(".result-container");
resolve(result ? result.innerText.trim() : null);
},
onerror: () => resolve(null)
});
});
};

const processQueue = async () => {
if (state.activeRequests >= state.maxConcurrent || state.queue.length === 0) return;

state.activeRequests++;
const { text, element } = state.queue.shift();

if (state.cache.has(text)) {
applyTranslation(element, state.cache.get(text), text);
state.activeRequests--;
processQueue();
} else {
const translated = await fetchTranslation(text);
if (translated && translated.toLowerCase() !== text.toLowerCase()) {
state.cache.set(text, translated);
applyTranslation(element, translated, text);
} else {
element.innerText = text;
}
setTimeout(() => {
state.activeRequests--;
processQueue();
}, state.requestDelay);
}
};

const applyTranslation = (element, translatedText, originalText) => {
element.innerText = translatedText;
const icon = document.createElement('span');
icon.className = 'tr-icon-done';
icon.innerText = UI_ICONS.done;
icon.title = `Original Content: ${originalText}`;
element.appendChild(icon);
element.setAttribute("data-tr-status", "done");
element.setAttribute("data-orig-content", originalText);
};

const handleMessage = (msg) => {
if (!state.enabled) return;
const text = msg.innerText.replace(UI_ICONS.loading, "").replace(UI_ICONS.done, "").trim();

if (text.length < 2 || msg.getAttribute("data-orig-content") === text) return;

msg.setAttribute("data-tr-status", "processing");
msg.innerText = text + UI_ICONS.loading;
state.queue.unshift({ text, element: msg }); // LIFO Priority
processQueue();
};

// --- UI Injection ---
const injectWidget = () => {
if (document.getElementById('tr-widget')) return;

const widget = document.createElement('div');
widget.id = 'tr-widget';

const btn = document.createElement('button');
btn.className = `tr-btn ${state.enabled ? 'tr-btn-active' : 'tr-btn-inactive'}`;
btn.innerText = state.enabled ? 'Translator: ON' : 'Translator: OFF';
btn.onclick = () => {
GM_setValue('tr_enabled', !state.enabled);
location.reload();
};

const select = document.createElement('select');
select.className = 'tr-select';
Object.entries(SUPPORTED_LANGUAGES).forEach(([code, name]) => {
const opt = document.createElement('option');
opt.value = code;
opt.innerText = name;
if (code === state.targetLang) opt.selected = true;
select.appendChild(opt);
});

select.onchange = (e) => {
GM_setValue('tr_lang', e.target.value);
location.reload();
};

widget.appendChild(btn);
widget.appendChild(select);
document.body.appendChild(widget);
initDraggable(widget);
};

// --- Observer Logic ---
const startObservation = () => {
const observer = new MutationObserver((mutations) => {
if (!document.getElementById('tr-widget')) injectWidget();
if (!state.enabled) return;

mutations.forEach(mutation => {
if (mutation.type === 'childList') {
mutation.addedNodes.forEach(node => {
if (node.nodeType === 1) {
const messages = node.querySelectorAll('[id^="message-content-"]');
messages.forEach(handleMessage);
}
});
}
if (mutation.type === 'characterData' || mutation.type === 'subtree') {
const target = mutation.target.parentElement;
if (target?.id?.startsWith('message-content-') && target.getAttribute("data-tr-status") !== "processing") {
handleMessage(target);
}
}
});
});

const chatContainer = document.querySelector('[class^="chatContent_"]') || document.body;
observer.observe(chatContainer, {
childList: true,
subtree: true,
characterData: true
});
};

// --- Bootstrap ---
const init = () => {
injectStyles();
injectWidget();
startObservation();
console.log(`[Translator 8.1] System initialized. Target Language: ${state.targetLang.toUpperCase()}`);
};

if (document.readyState === 'complete') init();
else window.addEventListener('load', init);

})();