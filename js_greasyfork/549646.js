// ==UserScript==
// @name         Extras UNIT3D CBR
// @namespace    https://github.com/harpiacbr/Extras-CBR
// @version      1.2
// @description  Chat reply, posters hover
// @author       harpiacbr
// @match        https://capybarabr.com/*
// @grant        GM_addStyle
// @icon         https://capybarabr.com/favicon.ico
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/549646/Extras%20UNIT3D%20CBR.user.js
// @updateURL https://update.greasyfork.org/scripts/549646/Extras%20UNIT3D%20CBR.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const SELECTORS = {
    chatMessages: '.chatroom__messages',
    chatbox: '#chatbox__messages-create',
    message: '.chatbox-message',
    messageHeader: '.chatbox-message__header',
    messageUser: '.chatbox-message__address span',
    messageContent: '.chatbox-message__content',
    poster: '.torrent-search--list__poster-img',
    torrentRow: 'tr.torrent-search--list__row',
    torrentName: 'a.torrent-search--list__name',
  };

  /* ===========================
     CHAT: Botão Responder
  =========================== */
  function ensureReplyButtons() {
    document.querySelectorAll(SELECTORS.message).forEach(article => {
      const header = article.querySelector(SELECTORS.messageHeader);
      if (!header) return;

      if (header.querySelector('.custom-reply-btn')) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.title = 'Responder';
      btn.className = 'custom-reply-btn';
      btn.innerHTML = '<i class="fa fa-reply"></i>';
      btn.onclick = () => {
        const user = article.querySelector(SELECTORS.messageUser)?.innerText?.trim() || 'Usuário';
        let msg = article.querySelector(SELECTORS.messageContent)?.innerText?.trim() || '';
        if (!msg) {
          const img = article.querySelector(`${SELECTORS.messageContent} img`);
          if (img) msg = img.src;
        }
        const chatbox = document.querySelector(SELECTORS.chatbox);
        if (chatbox) {
          chatbox.value = `[color=#999][b]${user}[/b]: [i]"${msg}"[/i][/color]\n\n`;
          chatbox.focus();
        }
      };

      header.appendChild(btn);
    });
  }

  /* ===========================
     POSTER HOVER
  =========================== */
  function setupPosterHover() {
    if (document.getElementById('enlargedPoster')) return;
    const enlarged = document.createElement("div");
    enlarged.id = "enlargedPoster";
    enlarged.style.cssText = "position:absolute;width:300px;height:450px;display:none;background-size:cover;box-shadow:0 0 10px rgba(0,0,0,.5);z-index:9999;";
    document.body.appendChild(enlarged);

    function attach(p) {
      if (p.dataset.hoverReady) return;
      p.dataset.hoverReady = '1';
      p.addEventListener("mousemove", e => {
        let src = p.src?.replace("w92","w500") || "";
        if (!src) return;
        enlarged.style.backgroundImage = `url('${src}')`;
        enlarged.style.left = (e.pageX+15)+"px";
        enlarged.style.top = (e.pageY-200)+"px";
        enlarged.style.display = "block";
      });
      p.addEventListener("mouseleave", () => enlarged.style.display="none");
    }

    document.querySelectorAll(SELECTORS.poster).forEach(attach);

    new MutationObserver(muts => {
      muts.forEach(m => m.addedNodes.forEach(node => {
        if (node.matches?.(SELECTORS.poster)) attach(node);
        else if (node.querySelectorAll) node.querySelectorAll(SELECTORS.poster).forEach(attach);
      }));
    }).observe(document.body, {childList:true,subtree:true});
  }

  /* ===========================
     INIT
  =========================== */
  function init() {
    ensureReplyButtons();
    setupPosterHover();
    new MutationObserver(() => {
      ensureReplyButtons();
    }).observe(document.body, {childList:true,subtree:true});
  }

  init();

  /* ===========================
     CSS
  =========================== */
  GM_addStyle(`
    .custom-reply-btn {
      background: none;
      border: none;
      color: #888;
      cursor: pointer;
      margin-left: 8px;
      font-size: 14px;
    }
    .custom-reply-btn:hover { color: #0a0; }
  `);

})();
