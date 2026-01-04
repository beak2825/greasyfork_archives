// ==UserScript==
// @name UFTorrentButton
// @namespace uf-torrent-fansubs
// @version 2.0.0
// @description Agrega botón "Torrent" por ficha en fansubs.php sin modificar el layout.
// @match http://foro.unionfansub.com/fansubs.php*
// @match https://foro.unionfansub.com/fansubs.php*
// @[url=http://foro.unionfansub.com/member.php?action=profile&uid=41112]grant[/url] none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/559772/UFTorrentButton.user.js
// @updateURL https://update.greasyfork.org/scripts/559772/UFTorrentButton.meta.js
// ==/UserScript==

(function () {
'use strict';

const CACHE_KEY = 'UF_TORRENT_ID_CACHE_v5';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
const MAX_RETRIES = 2;

let memoryCache = null;

/* -------------------- CACHE (Optimizada) -------------------- */

function loadCache() {
if (memoryCache) return memoryCache;

try {
const raw = localStorage.getItem(CACHE_KEY);
if (!raw) return (memoryCache = {});

const now = Date.now();
const data = JSON.parse(raw);
const valid = {};

for (const tid in data) {
const entry = data[tid];
if (entry.expiry > now) {
valid[tid] = entry.torrentId;
}
}

// Solo guardar si hay diferencia
if (Object.keys(valid).length !== Object.keys(data).length) {
saveCache(valid);
}

return (memoryCache = valid);
} catch {
return (memoryCache = {});
}
}

function saveCache(cache) {
const now = Date.now();
const out = {};

for (const tid in cache) {
out[tid] = {
torrentId: cache[tid],
expiry: now + CACHE_TTL
};
}

localStorage.setItem(CACHE_KEY, JSON.stringify(out));
memoryCache = cache;
}

function updateCache(tid, torrentId) {
const cache = loadCache();
cache[tid] = torrentId;
saveCache(cache);
}

/* -------------------- UTILIDADES (Mejoradas) -------------------- */

function extractTid(url) {
// Más rápido que regex cuando sea posible
try {
const urlObj = new URL(url, location.href);
return urlObj.searchParams.get('tid');
} catch {
const m = url.match(/[?&]tid=(\d+)/);
return m ? m[1] : null;
}
}

function extractTorrentId(html) {
// Regex más rápido para el caso común
let m = html.match(/torrent=(\d+)/i);
if (m) return m[1];

m = html.match(/id=(\d+)/i);
if (m) return m[1];

// Fallback a DOMParser solo si es necesario
try {
const parser = new DOMParser();
const doc = parser.parseFromString(html, 'text/html');
const links = doc.querySelectorAll('a[href*="torrent.unionfansub.com"]');

for (const a of links) {
const href = a.href || a.getAttribute('href') || '';
m = href.match(/torrent=(\d+)/i);
if (m) return m[1];
m = href.match(/id=(\d+)/i);
if (m) return m[1];
}
} catch {
// Silently fail
}

return null;
}

async function fetchTorrentId(threadUrl, tid, retry = 0) {
try {
const res = await fetch(threadUrl, {
credentials: 'include',
cache: 'no-store' // Evitar caché del navegador
});

if (!res.ok) {
if (retry < MAX_RETRIES) {
await new Promise(r => setTimeout(r, 300 * (retry + 1)));
return fetchTorrentId(threadUrl, tid, retry + 1);
}
return null;
}

const html = await res.text();
const id = extractTorrentId(html);

if (id && tid) updateCache(tid, id);
return id;
} catch {
if (retry < MAX_RETRIES) {
await new Promise(r => setTimeout(r, 300 * (retry + 1)));
return fetchTorrentId(threadUrl, tid, retry + 1);
}
return null;
}
}

/* -------------------- BOTÓN (Mejor UX) -------------------- */

function createButton(threadUrl) {
const btn = document.createElement('button');
btn.className = 'uf-torrent-btn';
btn.textContent = 'Torrent';
btn.title = 'Descargar torrent';
btn.setAttribute('type', 'button');

btn.addEventListener('click', async (e) => {
e.preventDefault();
e.stopPropagation();

if (btn.disabled) return;

const originalText = btn.textContent;
btn.disabled = true;
btn.textContent = '...';

try {
const tid = extractTid(threadUrl);
const cache = loadCache();
let torrentId = tid ? cache[tid] : null;

if (!torrentId) {
torrentId = await fetchTorrentId(threadUrl, tid);
}

if (torrentId) {
window.open(
`https://torrent.unionfansub.com/download.php?torrent=${torrentId}`,
'_blank',
'noopener,noreferrer'
);
} else {
alert('No se encontró enlace de torrent en este hilo.');
}
} catch (error) {
console.error('[UF Torrent] Error:', error);
alert('Error al obtener el torrent.');
} finally {
btn.disabled = false;
btn.textContent = originalText;
}
});

return btn;
}

/* -------------------- DOM (Optimizada) -------------------- */

function processHolder(holder) {
if (holder.dataset.torrentProcessed) return;
holder.dataset.torrentProcessed = 'true';

const link = holder.querySelector('a.threadlink[href*="showthread.php"]');
if (!link || holder.querySelector('.uf-torrent-btn')) return;

const threadUrl = new URL(link.href, location.href).href;
holder.appendChild(createButton(threadUrl));
}

function scanInitial() {
// Usar querySelectorAll una sola vez
const holders = document.querySelectorAll('span.threadholder:not([data-torrent-processed])');
holders.forEach(processHolder);
}

function observeMutations() {
const observer = new MutationObserver((mutations) => {
// Procesar en batch para mejor performance
const holdersToProcess = new Set();

for (const m of mutations) {
for (const node of m.addedNodes) {
if (node.nodeType !== 1) continue;

if (node.matches?.('span.threadholder')) {
holdersToProcess.add(node);
}

const holders = node.querySelectorAll?.('span.threadholder:not([data-torrent-processed])');
holders?.forEach(h => holdersToProcess.add(h));
}
}

holdersToProcess.forEach(processHolder);
});

observer.observe(document.body, {
childList: true,
subtree: true
});
}

/* -------------------- ESTILOS (Mejorados) -------------------- */

function injectStyles() {
if (document.getElementById('uf-torrent-styles')) return;

const css = `
span.threadholder {
position: relative !important;
}

.uf-torrent-btn {
position: absolute;
top: 6px;
right: 6px;
padding: 4px 8px;
border-radius: 7px;
border: 1px solid rgba(0,0,0,.25);
background: rgba(255,255,255,.92);
cursor: pointer;
font-size: 12px;
z-index: 999;
line-height: 1;
transition: all 0.15s ease;
user-select: none;
}

.uf-torrent-btn:hover {
background: rgba(255,255,255,.95);
box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.uf-torrent-btn:active {
transform: translateY(1px);
}

.uf-torrent-btn:disabled {
opacity: 0.6;
cursor: not-allowed;
pointer-events: none;
}
`;

const style = document.createElement('style');
style.id = 'uf-torrent-styles';
style.textContent = css;
document.head.appendChild(style);
}

/* -------------------- INICIO -------------------- */

function start() {
injectStyles();
scanInitial();
observeMutations();
}

// Iniciar inmediatamente si el DOM está listo
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', start);
} else {
setTimeout(start, 0); // Usar setTimeout para no bloquear
}
})();