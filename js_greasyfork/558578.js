// ==UserScript==
// @name         cool18
// @namespace    http://tampermonkey.net/
// @version      2025-09-03
// @description  增强
// @author       ssnangua
// @match        https://www.cool18.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cool18.com
// @require      https://update.greasyfork.org/scripts/555706/1694621/GM_SelectToSearch.js
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558578/cool18.user.js
// @updateURL https://update.greasyfork.org/scripts/558578/cool18.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const searches = Object.fromEntries(new URLSearchParams(location.search));
    if (searches.keywords) document.title = `搜索：${searches.keywords} - ${document.title}`;

    window.GM_SelectToSearch([
        {
            label: `<img src="https://www.cool18.com/favicon.ico"> 搜索`,
            url: "https://www.cool18.com/bbs4/index.php?action=search&bbsdr=bbs4&act=threadsearch&app=forum&keywords=%s&submit=%E6%9F%A5%E8%AF%A2"
        },
        {
            label: `<img src="https://www.voidtools.com/favicon.ico"> ES`,
            url: "es:%s",
        },
    ]);

    GM_addStyle(`
      .site_name {
        white-space: nowrap;
      }
      .site_banzhu {
        flex: auto;
      }
      .adv_site_top {
        display: none;
      }
      .search-form {
        width: auto;
        padding: 5px 10px;

        &>form {
          white-space: nowrap;

          & input[name="keywords"] {
            width: 300px;
          }
        }
      }
    `);
})();