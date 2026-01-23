// ==UserScript==
// @name         Open2ch ID横に検索ボタンをすべてのIDに追加
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license	CC0-1.0
// @description  全てのIDに検索ボタンを追加
// @author       jazapから(自作)
// @match        https://*.open2ch.net/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/563600/Open2ch%20ID%E6%A8%AA%E3%81%AB%E6%A4%9C%E7%B4%A2%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E3%81%99%E3%81%B9%E3%81%A6%E3%81%AEID%E3%81%AB%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/563600/Open2ch%20ID%E6%A8%AA%E3%81%AB%E6%A4%9C%E7%B4%A2%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E3%81%99%E3%81%B9%E3%81%A6%E3%81%AEID%E3%81%AB%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const bbs = 'livejupiter';

  function addSearchButtons() {
    $('span._id').each(function() {
      const $idSpan = $(this);

      if ($idSpan.find('.id-search-btn').length > 0) return;

      const idVal = $idSpan.attr('val');
      if (!idVal) return;

      const $btn = $('<button>')
        .text('検索')
        .addClass('id-search-btn')
        .css({
          marginLeft: '6px',
          fontSize: '10px',
          cursor: 'pointer',
          padding: '1px 5px',
          borderRadius: '3px',
          border: '1px solid #888',
          background: '#eee',
          verticalAlign: 'middle'
        })
        .attr('type', 'button')
        .on('click', () => {
          const url = `https://find.open2ch.net/?bbs=${bbs}&t=f&q=${encodeURIComponent(idVal)}`;
          window.open(url, '_blank');
        });

      $idSpan.append($btn);
    });
  }

  $(function() {
    addSearchButtons();
    setInterval(addSearchButtons, 500);
  });
 })();