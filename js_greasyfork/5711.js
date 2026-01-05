// ==UserScript==
// @name        KissAnime Slimmer Header
// @description Removes the cruft from this site's navigation bar.
// @namespace   userscripts.org/user/swyter
// @match       *://kissanime.com/*
// @match       *://kisscartoon.me/*
// @match       *://kissanime.to/*
// @match       *://kissasian.com/*
// @match       *://kissmanga.com/*
// @match       *://readcomiconline.to/*
// @match       *://kissanime.ru/*
// @match       *://kisscartoon.se/*
// @match       *://kissasian.ch/*
// @match       *://kimcartoon.me/*
// @match       *://kissasian.sh/*
// @match       *://kimcartoon.to/*
// @match       *://kisstvshow.to/*
// @version     2019.08.19
// @grant       GM_addStyle
// @run-at      document-start

// @downloadURL https://update.greasyfork.org/scripts/5711/KissAnime%20Slimmer%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/5711/KissAnime%20Slimmer%20Header.meta.js
// ==/UserScript==

/* swy: the guys at Greasemonkey are a bunch of incompetent folks, they break stuff all the time */
function GM_addStyle(text)
{
  document.documentElement.appendChild(((thing = document.createElement('style')).textContent = text) && thing);
}

/* rules for a slimmer header */
GM_addStyle("#head + .clear                     \
             {                                  \
               clear: none;                     \
               height: 76px;                    \
             }                                  \
                                                \
             #head h1 /* for kisscartoon */     \
             {                                  \
               margin-top: 10px !important;     \
             }                                  \
                                                \
             #head h1 a.logo[title^=KissAnime]  \
             {                                  \
               width: 243px !important;         \
               height: 65px !important;         \
             }                                  \
             #head h1 a.logo[title*=kissmanga]  \
             {                                  \
               width: 240px !important;         \
               height: 68px !important;         \
             }                                  \
             #head h1 a.logo[title^=KissAsian]  \
             {                                  \
               height: 60px !important;         \
             }                                  \
                                                \
             #search                            \
             {                                  \
               z-index: 2;                      \
             }                                  \
                                                \
             #search::after                     \
             {                                  \
               content: '';                     \
               position: absolute;              \
               display: inline-block;           \
                                                \
               z-index: -1;                     \
                                                \
               width: 100%;                     \
               height: 30px;                    \
                                                \
               background: #2C2C2C;             \
               border-radius: 7px 7px 0 0;      \
                                                \
               top: -10px;                      \
               left: 0;                         \
             }                                  \
                                                \
             #navcontainer ul                   \
             {                                  \
               position: absolute;              \
             }                                  \
                                                \
             #navcontainer #liRequest, #li1,    \
             #result_box + div iframe,          \
             #navcontainer #liChatRoom,         \
             #navcontainer #liFlappy            \
             {                                  \
               display: none !important;        \
             }                                  \
                                                \
             form#formSearch > div:last-child   \
             {                                  \
               margin-top: 0 !important;        \
               float: right;                    \
             }                                  \
                                                \
             #imgSearch                         \
             {                                  \
               background: transparent;         \
             }");

/* Small tweaks for all those sites people requested */
if (document.domain !== 'kissmanga.com')
  return;

GM_addStyle("#head h1                           \
             {                                  \
               position: absolute;              \
               top: 10px;                       \
               border-radius: 16px;             \
               margin-left: 2px !important;     \
             }                                  \
                                                \
             #search input.text                 \
             {                                  \
               width: 134px !important;         \
             }                                  \
                                                \
             #topHolderBox                      \
             {                                  \
               height: 30px !important;         \
             }");
