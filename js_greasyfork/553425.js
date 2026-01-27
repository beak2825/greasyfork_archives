// ==UserScript==
// @name         Ext.to | Restore Download Buttons with Magnet Links
// @description  Resolves download buttons (from e.g. search results) by setting the respective magnet link as href/url (like it used to be) on middle and right click, to allow for opening it in a background tab and copying it more easily. Also prevents the download buttons from being hidden on mobile layout.
// @version      1.1.0
// @namespace    https://github.com/Fenn3c401
// @author       Fenn3c401
// @license      GPL-3.0-or-later
// @icon         https://icons.duckduckgo.com/ip3/ext.to.ico
// @match        https://ext.to/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/553425/Extto%20%7C%20Restore%20Download%20Buttons%20with%20Magnet%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/553425/Extto%20%7C%20Restore%20Download%20Buttons%20with%20Magnet%20Links.meta.js
// ==/UserScript==


'use strict';

let $;


addStyles();

((fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn())(() => {
  $ ??= unsafeWindow.jQuery;
  if (!$) return;

  $('body').on('click auxclick', '.dwn-btn:not([href^="magnet:"])', async function(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const itemDoc = await fetch($(this).closest('tr').find('a').attr('href')).then((r) => r.text()).then((r) => $(new DOMParser().parseFromString(r, 'text/html'))),
          csrfToken = $(itemDoc).find('script:contains("csrfToken =")').text().match(/csrfToken = '([^']+)/)[1],
          pageToken = $(itemDoc).find('script:contains("pageToken =")').text().match(/pageToken = '([^']+)/)[1];

    const data = {
      torrent_id: $(this).attr('data-id'),
      download_type: 'magnet',
      timestamp: Math.floor(Date.now() / 1000).toString(),
      sessid: csrfToken,
    };
    data.hmac = await computeHmac(data.torrent_id, data.timestamp, pageToken);

    $.post({
      url: '/ajax/getTorrentMagnet.php',
      dataType: 'json',
      data,
    }).done((resp) => {
      if (resp.success && resp.url) {
        $(this).attr('href', resp.url);

        if (evt.type === 'click') location.href = resp.url;
        else if (evt.originalEvent.button === 1) GM_openInTab(resp.url, { setParent: true });
      } else {
        alert(resp.error || 'Error loading download link. Please try again.');
      }
    }).fail(() => {
      alert('Connection error. Please check your internet connection and try again.');
    });
  });
});


async function computeHmac(torrentId, timestamp, token) {
  const data = [torrentId, timestamp, token].join('|'),
        encoder = new TextEncoder(),
        bytes = encoder.encode(data);

  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes),
        hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}


function addStyles() {
  GM_addStyle(`
@media (width <= 940px) {
  .main-block .table .btn-blocks :is(.dwn-btn, .vide-watch-btn) {
    display: inline-block;
  }
  .table-responsive .table td.text-left div.float-left {
    max-width: calc(100% - 85px);
  }
}
  `);
}
