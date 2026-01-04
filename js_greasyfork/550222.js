// ==UserScript==
// @name        4chan: redirect 404s to archive
// @namespace   user@user
// @match       *://boards.4chan.org/*/thread/*
// @version     1.3.1
// @date        2025-09-21
// @description Redirect dead 4chan threads to their respective board archives
// @grant       none
// @author      the pie stealer
// @run-at      document-end
// @license Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/550222/4chan%3A%20redirect%20404s%20to%20archive.user.js
// @updateURL https://update.greasyfork.org/scripts/550222/4chan%3A%20redirect%20404s%20to%20archive.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const archives = {
      'archived.moe': ['a','an','biz','c','co','diy','fit','gd','gif','i','jp','k','m','mlp','out','po','r9k','s4s','tg','tv','u','v','vg','vp','wsg', 'asp','b','cm','h','hc','hm','n','p','r','s','soc','toy','y'],
      'archive.palanq.win': ['bant'],
      '4plebs.org':       ['adv','f','hr','o','pol','trv','x'],
      'desuarchive.org': ['int', 'g', 'qa', 'vr'],
      'warosu.org':       ['3','cgl','ck','fa','ic','lit','sci'],
      'archive.rebeccablacktech.com': ['mu','w'],
      'archive.loveisover.me': ['d','e','lgbt','t'],
      'archive.nyafuu.org': ['wg'],
      'totally.not4plebs.org': ['sp']
    };

    const boardToHost = Object.entries(archives).reduce((map, [host, boards]) => {
      boards.forEach(b => map.set(b, host));
      return map;
    }, new Map());

    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length < 3) {
      alert('4chan-redirect: unexpected path structure:', location.pathname);
      return;
    }

    const board = parts[0].toLowerCase();
    const threadIndex = parts.indexOf('thread');
    const threadId = (threadIndex >= 0 && parts.length > threadIndex + 1) ? parts[threadIndex + 1] : null;

    if (!threadId) {
      alert('4chan-redirect: could not determine thread id from', location.pathname);
      return;
    }

    const isDead = (() => {
      const title = (document.title || '').toLowerCase();
      if (title.includes('404') || title.includes('not found')) return true;

      try {
        const bodyText = (document.body && document.body.textContent) ? document.body.textContent.toLowerCase() : '';
        if (bodyText.includes('404 not found') || bodyText.includes('not found') || bodyText.includes('page not found')) return true;
      } catch (e) {

      }
      return false;
    })();

    if (!isDead) {
      return;
    }

    const host = boardToHost.get(board);
    if (!host) {
      alert(`4chan-redirect: no archive specified for board /${board}/`);
      return;
    }

    const archiveUrl = `https://${host}/${encodeURIComponent(board)}/thread/${encodeURIComponent(threadId)}`;

    //use the code below for debugging purpose
    //
    //alert(`4chan-redirect: redirecting /${board}/thread/${threadId} → ${archiveUrl}`);
    location.replace(archiveUrl);
})();