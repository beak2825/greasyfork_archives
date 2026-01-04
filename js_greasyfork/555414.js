// ==UserScript==
// @name         Instagram Genişlet + İndir Butonu
// @namespace    https://greasyfork.org/tr/users/1503483-teolojik
// @version      1.0.0
// @description  Instagram fotoğraflarını büyütür ve gönderi/hikayelere indir butonu ekler. (Hover zoom + İndir butonu)
// @author       teolojik
// @homepage     https://greasyfork.org/tr/scripts/000000-instagram-genislet-indir-buton
// @supportURL   https://greasyfork.org/tr/scripts/000000-instagram-genislet-indir-buton/feedback
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        GM_download
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555414/Instagram%20Geni%C5%9Flet%20%2B%20%C4%B0ndir%20Butonu.user.js
// @updateURL https://update.greasyfork.org/scripts/555414/Instagram%20Geni%C5%9Flet%20%2B%20%C4%B0ndir%20Butonu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Stil tanımları ---
    GM_addStyle(`
      img.enlarge-hover {
          transition: transform 0.25s ease-in-out;
          z-index: 9999 !important;
      }
      img.enlarge-hover:hover {
          transform: scale(2.5);
          position: relative;
      }
      .dl-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0,0,0,0.6);
          color: #fff;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          z-index: 9999;
      }
      .dl-btn:hover {
          background: rgba(0,0,0,0.8);
      }
    `);

    // --- Gönderi & hikaye kontrol döngüsü ---
    setInterval(() => {
        // Hover efekti ekle
        document.querySelectorAll('img:not(.enlarge-hover)').forEach(img => {
            img.classList.add('enlarge-hover');
        });

        // İndir butonu ekle
        document.querySelectorAll('article:not(.dl-added), div[role="dialog"]:not(.dl-added)').forEach(post => {
            const media = post.querySelector('img, video');
            if (!media) return;

            const btn = document.createElement('div');
            btn.className = 'dl-btn';
            btn.innerText = 'İndir';
            btn.onclick = () => {
                const url = media.src;
                const filename = 'instagram_' + Date.now() + (url.includes('.mp4') ? '.mp4' : '.jpg');
                GM_download(url, filename);
            };

            post.appendChild(btn);
            post.classList.add('dl-added');
        });
    }, 2000);
})();
