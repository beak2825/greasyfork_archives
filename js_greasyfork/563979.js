// ==UserScript==
// @name         Eventernote following highlight
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight following actors on the page
// @author       ouuan
// @match        https://www.eventernote.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eventernote.com
// @grant        GM_addStyle
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/563979/Eventernote%20following%20highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/563979/Eventernote%20following%20highlight.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const KEY = 'following-highlight';

  // visit mypage to cache the following list in local storage
  function updateFollowing() {
    if (window.location.href !== 'https://www.eventernote.com/users') return;
    const followingElements = document.querySelectorAll(
      ".gb_users_side_profile~.gb_subtitle+div>.gb_actors_list>li>a"
    );
    const following = {};
    for (const el of followingElements) {
      const url = new URL(el.href);
      following[url.pathname] = el.parentElement.className;
    }
    localStorage.setItem(KEY, JSON.stringify(following));
  }

  function highlightFollowing() {
    const following = JSON.parse(localStorage.getItem(KEY));
    if (!following) {
      const consent = confirm('[UserScript Eventernote following highlight]\nVisit mypage to get the following list?');
      if (consent) window.location = 'https://www.eventernote.com/users';
      return;
    }
    const actorElements = document.querySelectorAll(".actor>ul>li>a,.actors>li>a");
    for (const el of actorElements) {
      const parent = el.parentElement;
      if (parent.className) continue; // only highlight elements without class
      const url = new URL(el.href);
      const className = following[url.pathname];
      if (className) {
        parent.className = className;
        parent.parentElement.classList.add("gb_actors_list", KEY);
      }
    }
  }

  GM_addStyle(`
  ul.${KEY} li { font-size: 14px; }
  ul.${KEY} .s0 { font-size: 16px; }
  ul.${KEY} .s1 { font-size: 17px; }
  ul.${KEY} .s2 { font-size: 18px; }
  ul.${KEY} .s3 { font-size: 19px; }
  ul.${KEY} .s4 { font-size: 20px; }
  ul.${KEY} .s5 { font-size: 21px; }
  ul.${KEY} .s6 { font-size: 22px; }
  `);

  updateFollowing();
  highlightFollowing();
})();