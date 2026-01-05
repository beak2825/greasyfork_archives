// ==UserScript==
// @name        GitHub file list beautifier
// @description Adds colors to files by type, displays small images in place of file-type icons in a repository source tree
// @license     MIT License
//
// @version     4.0.1
//
// @match       https://github.com/*
//
// @grant       none
// @run-at      document-start
//
// @author      wOxxOm
// @namespace   wOxxOm.scripts
// @icon        https://octodex.github.com/images/murakamicat.png
// @downloadURL https://update.greasyfork.org/scripts/5982/GitHub%20file%20list%20beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/5982/GitHub%20file%20list%20beautifier.meta.js
// ==/UserScript==

'use strict';

let savedConfig = {};
try {
  savedConfig = JSON.parse(localStorage.FileListBeautifier) || {};
} catch (e) {}

const config = Object.assign({},
  ...Object.entries({
    iconSize: 24,
    colorSeed1: 13,
    colorSeed2: 1299721,
    colorSeed3: 179426453,
  }).map(([k, v]) => ({[k]: +savedConfig[k] || v})));

const IMG_CLS = 'wOxxOm-image-icon';
const rxImages = /^(png|jpe?g|bmp|gif|cur|ico|svg)$/i;
const styleQueue = [];
const {sheet} = document.documentElement.appendChild($create('style', {
  textContent: /*language=CSS*/ `
  .${IMG_CLS} {
    width: ${config.iconSize}px;
    height: ${config.iconSize}px;
    object-fit: scale-down;
    margin: 0 -4px;
  }
  a[file-type=":folder"] {
    font-weight: bold;
  }
  `.replace(/;/g, '!important;'),
}));

const filetypes = {};
const ME = Symbol(GM_info.script.name);
const ob = new MutationObserver(start);

let lumaBias, lumaFix, lumaAmp;

requestAnimationFrame(start);

function start() {
  beautify();
  ob.observe(document, {subtree: true, childList: true});
}

function beautify() {
  for (const el of document.querySelectorAll('.react-directory-truncate, .js-navigation-open')) {
    if (ME in el)
      continue;
    el[ME] = true;
    const isOld = el.tagName === 'A';
    const a = isOld ? el : el.getElementsByTagName('a')[0];
    const url = a && a.href;
    if (!url)
      continue;
    const icon = el.closest(isOld ? '.js-navigation-item' : 'td').querySelector('svg');
    if (icon.classList.contains(isOld ? 'octicon-file-directory-fill' : 'icon-directory')) {
      a.setAttribute('file-type', ':folder');
      continue;
    }
    const ext = url.match(/\.(\w+)$|$/)[1] || ':empty';
    a.setAttribute('file-type', ext);
    if (!filetypes[ext])
      addFileTypeStyle(ext);
    if (rxImages.test(ext)) {
      const m = url.match(/github\.com\/(.+?\/)blob\/(.*)$/);
      const next = icon.nextElementSibling;
      if (!m || next && next[ME])
        continue;
      icon.replaceWith($create('img', {
        [ME]: true,
        className: IMG_CLS,
        src: `https://raw.githubusercontent.com/${m[1]}${m[2]}`,
      }));
    }
  }
}

function addFileTypeStyle(type) {
  filetypes[type] = true;
  if (!styleQueue.length)
    requestAnimationFrame(commitStyleQueue);
  styleQueue.push(type);
}

function commitStyleQueue() {
  if (!lumaAmp) initLumaScale();
  const seed2 = config.colorSeed2;
  const seed3 = config.colorSeed3;
  for (const type of styleQueue) {
    const hash = calcSimpleHash(type);
    const H = hash % 360;
    const Hq = H / 60;
    const S = hash * seed2 % 50 + 50 | 0;
    const redFix = (Hq < 1 ? 1 - Hq : Hq > 4 ? (Hq - 4) / 2 : 0);
    const blueFix = (Hq < 3 || Hq > 5 ? 0 : Hq < 4 ? Hq - 3 : 5 - Hq) * 3;
    const L = hash * seed3 % lumaAmp + lumaBias + (redFix + blueFix) * lumaFix * S / 100 | 0;
    sheet.insertRule(/*language=CSS*/ `
      a[file-type="${type}"]:not(#foo) {
        color: hsl(${H},${S}%,${L}%) !important;
      }
    `);
  }
  styleQueue.length = 0;
}

function calcSimpleHash(text) {
  let hash = 0;
  for (let i = 0, len = text.length; i < len; i++)
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
  return Math.abs(hash * config.colorSeed1 | 0);
}

function initLumaScale() {
  const [, r, g, b] = getComputedStyle(document.body).backgroundColor.split(/[^\d.]+/).map(parseFloat);
  const isDark = (r * .2126 + g * .7152 + b * .0722) < 128;
  [lumaBias, lumaAmp, lumaFix] = isDark ? [30, 50, 12] : [25, 15, 0];
}

function $create(tag, props) {
  return Object.assign(document.createElement(tag), props);
}
