// ==UserScript==
// @name         Startpage bang redirect
// @description  test
// @namespace    https://test.com
// @match        https://www.startpage.com/*
// @run-at       document-end
// @version      0.2
// @downloadURL https://update.greasyfork.org/scripts/557440/Startpage%20bang%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/557440/Startpage%20bang%20redirect.meta.js
// ==/UserScript==

const rules = [
  [['!d', '!dd'],                               'https://duckduckgo.com/?q={q}'],
  [['!g'],                                      'https://google.com/?q={q}'],
  [['!a', '!am', '!amazonfr'],                  'https://www.amazon.fr/s?k={q}'],
  [['!amazon'],                                 'https://www.amazon.com/s?k={q}'],
  [['!n', '!note', '!notebook', '!notebookcheck'],
                                              'https://www.notebookcheck.net/Google-Search.36690.0.html?q={q}']
];

// const queryMatch = location.href.match(/\?query=([^&]*)/);
// if (!queryMatch) return;
// let query = decodeURIComponent(queryMatch[1]).replace(/\+/g, ' ');
let query = document.querySelector('#q')?.value;
if (!query.includes('!')) return;

const parts = query.match(/^(.*?)(!\w+)(.*)$/);
if (!parts) return;

query = (parts[1] + parts[3]).trim();
if (!query) return;

const bang = parts[2];

let destination = '';
for (const [bangs, template] of rules) {
  if (bangs.includes(bang)) { destination = template; break; }
}
if (!destination) return;

location.replace(destination.replace('{q}', encodeURIComponent(query)));