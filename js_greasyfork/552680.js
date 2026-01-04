// ==UserScript==
// @name        Feedly Colorful Listview - Morandi Edition
// @namespace   http://feedly.colorful.list.view
// @description Colorizes items headers based on their source with Morandi colors
// @include     http*://feedly.com/*
// @include     http*://*.feedly.com/*
// @version     0.13.0
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/552680/Feedly%20Colorful%20Listview%20-%20Morandi%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/552680/Feedly%20Colorful%20Listview%20-%20Morandi%20Edition.meta.js
// ==/UserScript==

const colors = {};

// since GM_addStyle was deprecated - use custom function
// that simply appends styles to head of the document
const addStyle = (styleText) => {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(styleText));
  document.head.appendChild(style);
};

// replaces all non-letters (utf-8) to cleanup the string for coloring
// fixes https://github.com/yamalight/feedly-colorful-list-view/issues/2
const cleanTitle = (title) => {
  return title?.replace?.(/[^\p{L}\s]/gu, '');
};

// Compute color based on source title - Morandi colors (muted, desaturated)
const computeColor = (title) => {
  if (colors[title]) return colors[title];

  let h = 0;
  const clean = cleanTitle(title);

  for (let i = 0; i < clean.length; i++) {
    let s = i !== 0 ? clean.length % i : 1;
    let r = s !== 0 ? clean.charCodeAt(i) % s : clean.charCodeAt(i);
    h += r;
  }

  // Morandi color palette - muted, soft tones
  const morandiColors = [
    { h: 210, s: 15, l: 85 }, // Soft blue-gray
    { h: 25, s: 20, l: 88 },  // Warm beige
    { h: 160, s: 18, l: 82 }, // Sage green
    { h: 45, s: 22, l: 86 },  // Warm gray
    { h: 280, s: 16, l: 84 }, // Soft lavender
    { h: 200, s: 14, l: 87 }, // Powder blue
    { h: 350, s: 18, l: 85 }, // Dusty rose
    { h: 170, s: 15, l: 83 }, // Mint gray
    { h: 30, s: 16, l: 89 },  // Cream
    { h: 220, s: 12, l: 86 }, // Steel blue
    { h: 260, s: 14, l: 84 }, // Mauve
    { h: 15, s: 19, l: 87 }   // Warm taupe
  ];

  const index = h % morandiColors.length;
  const color = morandiColors[index];

  colors[title] = color;
  return color;
};

addStyle(`
  .entry { border-color: transparent !important; }
  .entry .SelectedEntryScroller > div { border-color: transparent !important; }
  .entry .ago { color: #444 !important; }
  .entry .EntryMetadataSource--title-only { color: #444 !important; font-weight: bold !important; }
  #timeline div.selected { border: 1px solid #444 !important; }
  .theme--dark .TitleOnlyLayout--selected { background: inherit !important; }
  .theme--dark .entry .SelectedEntryScroller > * { background: inherit !important; }
  .theme--dark .fx .entry .TitleOnlyLayout:hover { background: inherit !important; }
  .theme--dark .fx .entry .TitleOnlyLayout { border: transparent !important; }
  .theme--dark .fx .entry .EntryTitle { color: rgba(0, 0, 0, 0.88)!important; }
  .theme--dark .fx .entry .EntryMetadataSource--title-only { color: rgba(0, 0, 0, 0.75)!important; }
  .theme--dark .fx .entry.entry--read .EntryMetadataSource--title-only { color: rgba(0, 0, 0, .54)!important; font-weight: normal!important; }
  .theme--dark .fx .entry.entry--read .EntryTitle { color: rgba(0, 0, 0, .54)!important; font-weight: normal!important; }
  .theme--dark .fx .entry { color: rgba(0, 0, 0, .54)!important; background: rgb(255 255 255 / 88%); }
  .theme--dark .fx .entry .EntryTitle { color: #000; }
  .theme--dark .fx .entry .EntryTitleLink { color: #000; }
`);

const observer = new MutationObserver(function () {
  const elements = document.getElementsByClassName('entry');
  Array.from(elements)
    .filter((el) => !el.getAttribute('colored'))
    .filter((el) => el.querySelector('a.EntryMetadataSource'))
    .map((el) => {
      const title = cleanTitle(
        el.querySelector('a.EntryMetadataSource').textContent
      );
      el.setAttribute('colored', title);
      return title;
    })
    .forEach((title) => {
      if (!colors[title]) {
        const color = computeColor(title);
        addStyle(`
        article[colored='${title}'] {
          background: hsl(${color.h},${color.s}%,${color.l}%) !important; }
        article[colored='${title}']:hover {
          background: hsl(${color.h},${color.s}%,${color.l + 3}%) !important; }
        article[colored='${title}']//a[contains(@class, 'read')] {
          background: hsl(${color.h},${color.s}%,${color.l + 5}%) !important; }
        article[colored='${title}']//a[contains(@class, 'read')]:hover {
          background: hsl(${color.h},${color.s}%,${color.l + 8}%) !important; }
      `);
      }
    });
});
const timeline = document.getElementById('root');
observer.observe(timeline, { childList: true, subtree: true });
