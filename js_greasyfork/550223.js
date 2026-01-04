// ==UserScript==
// @name         4chan greentext for 4chan-x userscript
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  greentext support for 4chan-x userscript
// @author       the pie stealer
// @match        https://boards.4chan.org/int/thread/210360442
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4chan.org
// @include      http://boards.4chan.org/*
// @include      https://boards.4chan.org/*
// @include      http://sys.4chan.org/*
// @include      https://sys.4chan.org/*
// @include      http://www.4chan.org/*
// @include      https://www.4chan.org/*
// @include      http://boards.4channel.org/*
// @include      https://boards.4channel.org/*
// @include      http://sys.4channel.org/*
// @include      https://sys.4channel.org/*
// @include      http://www.4channel.org/*
// @include      https://www.4channel.org/*
// @include      http://i.4cdn.org/*
// @include      https://i.4cdn.org/*
// @include      http://is.4chan.org/*
// @include      https://is.4chan.org/*
// @include      http://is2.4chan.org/*
// @include      https://is2.4chan.org/*
// @include      http://is.4channel.org/*
// @include      https://is.4channel.org/*
// @include      http://is2.4channel.org/*
// @include      https://is2.4channel.org/*
// @include      https://erischan.org/*
// @include      https://www.erischan.org/*
// @include      https://fufufu.moe/*
// @include      https://gnfos.com/*
// @include      https://himasugi.blog/*
// @include      https://www.himasugi.blog/*
// @include      https://kakashinenpo.com/*
// @include      https://www.kakashinenpo.com/*
// @include      https://kissu.moe/*
// @include      https://www.kissu.moe/*
// @include      https://lainchan.org/*
// @include      https://www.lainchan.org/*
// @include      https://merorin.com/*
// @include      https://ota-ch.com/*
// @include      https://www.ota-ch.com/*
// @include      https://ponyville.us/*
// @include      https://www.ponyville.us/*
// @include      https://smuglo.li/*
// @include      https://notso.smuglo.li/*
// @include      https://smugloli.net/*
// @include      https://smug.nepu.moe/*
// @include      https://sportschan.org/*
// @include      https://www.sportschan.org/*
// @include      https://sushigirl.us/*
// @include      https://www.sushigirl.us/*
// @include      https://tvch.moe/*
// @exclude      http://www.4chan.org/advertise
// @exclude      https://www.4chan.org/advertise
// @exclude      http://www.4chan.org/advertise?*
// @exclude      https://www.4chan.org/advertise?*
// @exclude      http://www.4chan.org/donate
// @exclude      https://www.4chan.org/donate
// @exclude      http://www.4chan.org/donate?*
// @exclude      https://www.4chan.org/donate?*
// @exclude      http://www.4channel.org/advertise
// @exclude      https://www.4channel.org/advertise
// @exclude      http://www.4channel.org/advertise?*
// @exclude      https://www.4channel.org/advertise?*
// @exclude      http://www.4channel.org/donate
// @exclude      https://www.4channel.org/donate
// @exclude      http://www.4channel.org/donate?*
// @exclude      https://www.4channel.org/donate?*
// @connect      4chan.org
// @connect      4channel.org
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @grant        GM.openInTab
// @grant        GM.xmlHttpRequest
// @run-at       document-start
// @license Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/550223/4chan%20greentext%20for%204chan-x%20userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/550223/4chan%20greentext%20for%204chan-x%20userscript.meta.js
// ==/UserScript==

(function () {
  'use strict';

    let lastFocused = null;

  document.addEventListener('focusin', (e) => {
    if (
      e.target.tagName === 'TEXTAREA' ||
      (e.target.tagName === 'INPUT' && e.target.type === 'text')
    ) {
      lastFocused = e.target;
    }
  });

  const waitFor4chanX = setInterval(() => {
    const headerBar = document.querySelector('#header-bar');
    if (headerBar) {
      clearInterval(waitFor4chanX);

      const greenBtn = document.createElement('button');
      greenBtn.textContent = '>greentext';
      greenBtn.style.marginLeft = '8px';
      greenBtn.style.padding = '2px 6px';
      greenBtn.style.cursor = 'pointer';
      greenBtn.style.backgroundColor = '#447744';
      greenBtn.style.color = 'white';
      greenBtn.style.border = '1px solid #888';
      greenBtn.style.borderRadius = '3px';
      greenBtn.title = 'add > to selected lines in text input';

      greenBtn.addEventListener('click', () => {
          const el = lastFocused;
        if (!el) {
          alert('Click inside a reply/post form first.');
          return;
        }

        const start = el.selectionStart;
        const end = el.selectionEnd;
        if (start === end) return;

        const selected = el.value.substring(start, end);
        const greentext = selected
          .split('\n')
          .map(line => '>' + line)
          .join('\n');

        el.setRangeText(greentext, start, end, 'select');
      });

      headerBar.appendChild(greenBtn);
    }
  });
})();