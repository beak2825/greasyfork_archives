// ==UserScript==
// @name         SpicyChat Chat Export
// @version      1.2
// @description  Export full SpicyChat chat log
// @match        https://spicychat.ai/*
// @grant        GM_download
// @grant        GM_setClipboard
// @namespace https://greasyfork.org/users/1537524
// @downloadURL https://update.greasyfork.org/scripts/555755/SpicyChat%20Chat%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/555755/SpicyChat%20Chat%20Export.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function htmlToText(html) {
    return html
      .replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*')
      .replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**')
      .replace(/<q[^>]*>(.*?)<\/q>/g, '"$1"')
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/g, '`$1`')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '');
  }

  function decode(str) {
    const div = document.createElement('div');
    div.innerHTML = str;
    return div.textContent || '';
  }

  function parseMessage(node) {
    const spans = node.querySelectorAll('span');
    const textParts = [];
    spans.forEach(span => {
      const raw = htmlToText(span.innerHTML.trim());
      const txt = decode(raw).trim();
      if (txt) textParts.push(txt);
    });
    return textParts.join('\n\n');
  }

  function collect() {
    // Only top-level bubbles
    const bubbles = document.querySelectorAll(
      'div.flex.flex-col.justify-undefined.items-undefined.gap-md.w-full.px-\\[13px\\].py-md'
    );
    const seen = new Set();
    const lines = [];

    bubbles.forEach(bubble => {
      const nameEl = bubble.querySelector('p.font-sans, a p.font-sans');
      const speaker = nameEl ? nameEl.textContent.trim() : 'Unknown';
      const contentEl = bubble.querySelector('div.flex.flex-col.w-full');
      if (!contentEl) return;
      const msg = parseMessage(contentEl);
      const key = speaker + '|' + msg.slice(0, 100); // simple duplicate key
      if (!seen.has(key) && msg) {
        seen.add(key);
        lines.push(`--- ${speaker.toUpperCase()} ---\n\n${msg}`);
      }
    });

    const finalText = lines.join('\n\n');
    GM_setClipboard(finalText);
    const blob = new Blob([finalText], { type: 'text/plain;charset=utf-8' });
    GM_download({
      url: URL.createObjectURL(blob),
      name: `SpicyChat_Export_${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.txt`,
      saveAs: true,
    });
//    alert('✅ Export complete. Copied to clipboard.');
  }

  function addBtn() {
    if (document.getElementById('exportChatBtn')) return;
    const btn = document.createElement('button');
    btn.textContent = '📄 Export Chat';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      background: '#0ea5e9',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '13px',
      cursor: 'pointer',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
    });
    btn.id = 'exportChatBtn';
    btn.onclick = collect;
    document.body.appendChild(btn);
  }

  window.addEventListener('load', addBtn);
  const mo = new MutationObserver(addBtn);
  mo.observe(document.body, { childList: true, subtree: true });
})();
