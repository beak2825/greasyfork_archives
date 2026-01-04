// ==UserScript==
// @name         Tiny Scroll-To-Top
// @namespace    https://greasyfork.org/users/yourname
// @version      0.1
// @description  Кнопка «Наверх» на любой странице
// @author       you
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556916/Tiny%20Scroll-To-Top.user.js
// @updateURL https://update.greasyfork.org/scripts/556916/Tiny%20Scroll-To-Top.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const btn = document.createElement('button');
  btn.textContent = '↑';
  Object.assign(btn.style, {
    position: 'fixed', right: '12px', bottom: '12px',
    width: '36px', height: '36px', borderRadius: '18px',
    border: 'none', cursor: 'pointer', fontSize: '18px',
    boxShadow: '0 2px 8px rgba(0,0,0,.2)', opacity: '0',
    transition: 'opacity .2s', zIndex: '999999', background: '#fff'
  });
  btn.title = 'Наверх';
  btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(btn);

  const toggle = () => { btn.style.opacity = (window.scrollY > 200) ? '1' : '0'; };
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
})();